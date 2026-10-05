import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { postCreditNoteJournal } from '../../accounting/services/postingService';

/**
 * JAY MURLIDHAR GROUP (JMG) — SALES CREDIT NOTE SERVICE
 * 
 * Handles Sales Credit Notes, item line records, serial/IMEI returns,
 * inventory stock restoration, and GL accounting reversal.
 */

export async function getCreditNotes({ companyId, status, customerId, invoiceId } = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('credit_notes')
    .select(`
      *,
      customer:customers(id, display_name, customer_code),
      invoice:invoices(id, invoice_number, invoice_date, total_amount)
    `)
    .order('created_at', { ascending: false });

  if (companyId) {
    query = query.eq('company_id', companyId);
  }
  if (status) {
    query = query.eq('status', status);
  }
  if (customerId) {
    query = query.eq('customer_id', customerId);
  }
  if (invoiceId) {
    query = query.eq('invoice_id', invoiceId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getCreditNoteById(id) {
  if (!isSupabaseConfigured || !id) return null;

  const { data, error } = await supabase
    .from('credit_notes')
    .select(`
      *,
      customer:customers(*),
      invoice:invoices(*),
      items:credit_note_items(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createCreditNote({
  companyId,
  invoiceId,
  customerId,
  creditNoteDate,
  reason = 'sales_return',
  items = [],
  notes = '',
  userId = null
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  if (!companyId || !invoiceId || !customerId) {
    throw new Error('Missing mandatory company, invoice, or customer.');
  }

  // Fetch invoice to validate boundaries and totals
  const { data: inv, error: invErr } = await supabase
    .from('invoices')
    .select('*, items:invoice_items(*)')
    .eq('id', invoiceId)
    .single();

  if (invErr || !inv) throw new Error('Referenced invoice not found.');
  if (inv.company_id !== companyId) {
    throw new Error('Invoice company does not match credit note company.');
  }
  if (inv.status === 'cancelled') {
    throw new Error('Cannot issue a credit note against a cancelled invoice.');
  }

  // Generate credit note number
  const { data: cnNumData, error: numErr } = await supabase.rpc('generate_company_credit_note_number', {
    target_comp_id: companyId
  });
  const creditNoteNumber = cnNumData || `JMG-CN-${Date.now().toString().slice(-6)}`;

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
    if (inv.is_interstate) {
      igstAmount += taxAmt;
    } else {
      cgstAmount += Math.round((taxAmt / 2) * 100) / 100;
      sgstAmount += Math.round((taxAmt / 2) * 100) / 100;
    }

    return {
      invoice_item_id: it.invoice_item_id || null,
      product_id: it.product_id || null,
      service_id: it.service_id || null,
      item_name: it.item_name || 'Returned Item',
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

  // Insert Credit Note header
  const { data: cn, error: cnInsertErr } = await supabase
    .from('credit_notes')
    .insert([
      {
        credit_note_number: creditNoteNumber,
        company_id: companyId,
        invoice_id: invoiceId,
        customer_id: customerId,
        credit_note_date: creditNoteDate || new Date().toISOString().split('T')[0],
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

  if (cnInsertErr) throw cnInsertErr;

  // Insert items
  if (preparedItems.length > 0) {
    const itemsToInsert = preparedItems.map((p) => ({
      ...p,
      credit_note_id: cn.id
    }));
    const { error: itemsErr } = await supabase.from('credit_note_items').insert(itemsToInsert);
    if (itemsErr) throw itemsErr;
  }

  return cn;
}

export async function recordCreditNote(id, userId = null) {
  if (!isSupabaseConfigured || !id) return null;

  const cn = await getCreditNoteById(id);
  if (!cn) throw new Error('Credit Note not found');
  if (cn.status !== 'draft') return cn;

  // 1. Post double-entry journal (Reversal of Revenue, GST, AR, and COGS/Inventory)
  await postCreditNoteJournal(cn.id, userId);

  // 2. If physical items were returned, restore stock movement
  for (const it of cn.items || []) {
    if (it.product_id && Number(it.quantity) > 0) {
      // Find a warehouse for company
      const { data: wh } = await supabase
        .from('warehouses')
        .select('id')
        .eq('company_id', cn.company_id)
        .limit(1)
        .maybeSingle();

      if (wh) {
        // Record return_in movement
        await supabase.from('stock_movements').insert([
          {
            company_id: cn.company_id,
            product_id: it.product_id,
            warehouse_id: wh.id,
            movement_type: 'return_in',
            reference_module: 'credit_note',
            reference_id: cn.id,
            quantity: Number(it.quantity),
            unit_cost: Number(it.unit_price) * 0.7,
            total_cost: Math.round(Number(it.quantity) * Number(it.unit_price) * 0.7 * 100) / 100,
            notes: `Sales return from Credit Note #${cn.credit_note_number}`
          }
        ]);

        // If serial numbers returned, mark them back in stock
        if (Array.isArray(it.serial_numbers) && it.serial_numbers.length > 0) {
          await supabase
            .from('product_serial_numbers')
            .update({ status: 'in_stock' })
            .in('serial_number', it.serial_numbers)
            .eq('product_id', it.product_id);
        }
      }
    }
  }

  // 3. Mark Credit Note recorded
  const { data: updated, error: updErr } = await supabase
    .from('credit_notes')
    .update({ status: 'recorded' })
    .eq('id', id)
    .select()
    .single();

  if (updErr) throw updErr;
  return updated;
}
