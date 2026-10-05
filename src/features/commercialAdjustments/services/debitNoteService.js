import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { postDebitNoteJournal } from '../../accounting/services/postingService';

/**
 * JAY MURLIDHAR GROUP (JMG) — PURCHASE DEBIT NOTE SERVICE
 * 
 * Handles Purchase Debit Notes, item line records, purchase return
 * stock deductions, and GL accounting adjustments.
 */

export async function getDebitNotes({ companyId, status, vendorId, purchaseBillId } = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('debit_notes')
    .select(`
      *,
      vendor:vendors(id, legal_name, vendor_code),
      bill:purchase_bills(id, bill_number, bill_date, total_amount)
    `)
    .order('created_at', { ascending: false });

  if (companyId) {
    query = query.eq('company_id', companyId);
  }
  if (status) {
    query = query.eq('status', status);
  }
  if (vendorId) {
    query = query.eq('vendor_id', vendorId);
  }
  if (purchaseBillId) {
    query = query.eq('purchase_bill_id', purchaseBillId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getDebitNoteById(id) {
  if (!isSupabaseConfigured || !id) return null;

  const { data, error } = await supabase
    .from('debit_notes')
    .select(`
      *,
      vendor:vendors(*),
      bill:purchase_bills(*),
      items:debit_note_items(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createDebitNote({
  companyId,
  purchaseBillId,
  vendorId,
  debitNoteDate,
  reason = 'purchase_return',
  items = [],
  notes = '',
  userId = null
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  if (!companyId || !purchaseBillId || !vendorId) {
    throw new Error('Missing mandatory company, bill, or vendor.');
  }

  // Fetch bill to validate boundaries
  const { data: bill, error: billErr } = await supabase
    .from('purchase_bills')
    .select('*')
    .eq('id', purchaseBillId)
    .single();

  if (billErr || !bill) throw new Error('Referenced purchase bill not found.');
  if (bill.company_id !== companyId) {
    throw new Error('Bill company does not match debit note company.');
  }
  if (bill.status === 'cancelled') {
    throw new Error('Cannot issue a debit note against a cancelled bill.');
  }

  // Generate debit note number
  const { data: dnNumData } = await supabase.rpc('generate_company_debit_note_number', {
    target_comp_id: companyId
  });
  const debitNoteNumber = dnNumData || `JMG-DN-${Date.now().toString().slice(-6)}`;

  // Calculate totals
  let subtotal = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  const preparedItems = items.map((it) => {
    const qty = Number(it.quantity) || 1;
    const price = Number(it.unit_price) || 0;
    const taxable = Math.round(qty * price * 100) / 100;
    const rate = Number(it.tax_rate) || 0;
    const taxAmt = Math.round(taxable * (rate / 100) * 100) / 100;
    const lineTot = Math.round((taxable + taxAmt) * 100) / 100;

    subtotal += taxable;
    cgstAmount += Math.round((taxAmt / 2) * 100) / 100;
    sgstAmount += Math.round((taxAmt / 2) * 100) / 100;

    return {
      purchase_bill_item_id: it.purchase_bill_item_id || null,
      product_id: it.product_id || null,
      service_id: it.service_id || null,
      item_name: it.item_name || 'Rejected / Returned Item',
      description: it.description || '',
      hsn_sac_code: it.hsn_sac_code || '',
      quantity: qty,
      unit_price: price,
      taxable_amount: taxable,
      tax_rate: rate,
      tax_amount: taxAmt,
      line_total: lineTot,
      serial_numbers: Array.isArray(it.serial_numbers) ? it.serial_numbers : []
    };
  });

  const totalTax = Math.round((cgstAmount + sgstAmount + igstAmount) * 100) / 100;
  const grandTotal = Math.round((subtotal + totalTax) * 100) / 100;

  // Insert Debit Note header
  const { data: dn, error: dnInsertErr } = await supabase
    .from('debit_notes')
    .insert([
      {
        debit_note_number: debitNoteNumber,
        company_id: companyId,
        purchase_bill_id: purchaseBillId,
        vendor_id: vendorId,
        debit_note_date: debitNoteDate || new Date().toISOString().split('T')[0],
        reason,
        status: 'draft',
        subtotal,
        taxable_amount: subtotal,
        cgst_amount: cgstAmount,
        sgst_amount: sgstAmount,
        igst_amount: igstAmount,
        total_tax_amount: totalTax,
        total_amount: grandTotal,
        amount_applied: 0,
        balance_amount: grandTotal,
        notes,
        created_by: userId
      }
    ])
    .select()
    .single();

  if (dnInsertErr) throw dnInsertErr;

  // Insert items
  if (preparedItems.length > 0) {
    const itemsToInsert = preparedItems.map((p) => ({
      ...p,
      debit_note_id: dn.id
    }));
    const { error: itemsErr } = await supabase.from('debit_note_items').insert(itemsToInsert);
    if (itemsErr) throw itemsErr;
  }

  return dn;
}

export async function recordDebitNote(id, userId = null) {
  if (!isSupabaseConfigured || !id) return null;

  const dn = await getDebitNoteById(id);
  if (!dn) throw new Error('Debit Note not found');
  if (dn.status !== 'draft') return dn;

  // 1. Post double-entry journal (Debit AP, Credit Expense, Credit Input GST)
  await postDebitNoteJournal(dn.id, userId);

  // 2. If physical items were returned to vendor, record return_out movement
  for (const it of dn.items || []) {
    if (it.product_id && Number(it.quantity) > 0) {
      const { data: wh } = await supabase
        .from('warehouses')
        .select('id')
        .eq('company_id', dn.company_id)
        .limit(1)
        .maybeSingle();

      if (wh) {
        await supabase.from('stock_movements').insert([
          {
            company_id: dn.company_id,
            product_id: it.product_id,
            warehouse_id: wh.id,
            movement_type: 'return_out',
            reference_module: 'debit_note',
            reference_id: dn.id,
            quantity: -Number(it.quantity),
            unit_cost: Number(it.unit_price),
            total_cost: Math.round(Number(it.quantity) * Number(it.unit_price) * 100) / 100,
            notes: `Purchase return from Debit Note #${dn.debit_note_number}`
          }
        ]);
      }
    }
  }

  // 3. Mark Debit Note recorded
  const { data: updated, error: updErr } = await supabase
    .from('debit_notes')
    .update({ status: 'recorded' })
    .eq('id', id)
    .select()
    .single();

  if (updErr) throw updErr;
  return updated;
}
