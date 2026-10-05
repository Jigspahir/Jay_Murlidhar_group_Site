import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — PURCHASE BILL (SUPPLIER BILL) SERVICE
 * 
 * Production data layer for Accounts Payable, Supplier Invoices,
 * Input Tax Capture, and Payment Settlement Synchronization.
 */

export const BILL_STATUSES = Object.freeze([
  { value: 'draft', label: 'Draft', color: 'slate' },
  { value: 'recorded', label: 'Recorded (Payable)', color: 'blue' },
  { value: 'cancelled', label: 'Cancelled', color: 'rose' }
]);

export const BILL_PAYMENT_STATUSES = Object.freeze([
  { value: 'unpaid', label: 'Unpaid', color: 'rose' },
  { value: 'partially_paid', label: 'Partially Paid', color: 'amber' },
  { value: 'paid', label: 'Fully Paid', color: 'emerald' }
]);

/**
 * Decimal-safe rounding to 2 decimal places
 */
export function round2(num) {
  const n = Number(num);
  if (isNaN(n)) return 0;
  return Number(Math.round(Number(n + 'e2')) + 'e-2');
}

/**
 * Calculate bill line item financial totals
 */
export function calculateBillLineItem({
  quantity = 1,
  unitPrice = 0,
  discountAmount = 0,
  taxRate = 0
}) {
  const qty = Math.max(0, Number(quantity) || 0);
  const price = Math.max(0, Number(unitPrice) || 0);
  const disc = Math.max(0, Number(discountAmount) || 0);
  const rate = Math.max(0, Number(taxRate) || 0);

  const gross = round2(qty * price);
  const taxableAmount = Math.max(0, round2(gross - disc));
  const taxAmount = round2(taxableAmount * (rate / 100));
  const lineTotal = round2(taxableAmount + taxAmount);

  return {
    gross,
    taxableAmount,
    taxAmount,
    lineTotal
  };
}

/**
 * Calculate Bill totals with discount and Indian GST input tax engine
 */
export function calculateBillTotals({
  items = [],
  discountAmount = 0,
  isInterstate = false
}) {
  let subtotal = 0;
  let itemsTaxTotal = 0;

  items.forEach((item) => {
    const calc = calculateBillLineItem(item);
    subtotal = round2(subtotal + calc.gross);
    itemsTaxTotal = round2(itemsTaxTotal + calc.taxAmount);
  });

  const discAmt = Math.max(0, Number(discountAmount) || 0);
  const finalDiscount = round2(Math.min(subtotal, discAmt));
  const taxableAmount = Math.max(0, round2(subtotal - finalDiscount));

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;
  let totalTaxAmount = 0;

  if (itemsTaxTotal > 0) {
    const taxScaleRatio = subtotal > 0 ? (taxableAmount / subtotal) : 1;
    totalTaxAmount = round2(itemsTaxTotal * taxScaleRatio);

    if (isInterstate) {
      igstAmount = totalTaxAmount;
      cgstAmount = 0;
      sgstAmount = 0;
    } else {
      cgstAmount = round2(totalTaxAmount / 2);
      sgstAmount = round2(totalTaxAmount - cgstAmount);
      igstAmount = 0;
    }
  }

  const totalAmount = round2(taxableAmount + totalTaxAmount);

  return {
    subtotal,
    discountAmount: finalDiscount,
    taxableAmount,
    isInterstate,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalTaxAmount,
    totalAmount
  };
}

/**
 * Fetch purchase bills with company scoping, filtering, and pagination
 */
export async function getPurchaseBills({
  companyId = null,
  isAllCompanies = false,
  vendorId = null,
  purchaseOrderId = null,
  status = 'all',
  paymentStatus = 'all',
  dateFrom = null,
  dateTo = null,
  search = '',
  page = 1,
  pageSize = 25
} = {}) {
  if (!isSupabaseConfigured) {
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('purchase_bills')
      .select(`
        id,
        bill_number,
        vendor_invoice_number,
        company_id,
        vendor_id,
        purchase_order_id,
        bill_date,
        due_date,
        subtotal,
        discount_amount,
        taxable_amount,
        place_of_supply,
        is_interstate,
        cgst_amount,
        sgst_amount,
        igst_amount,
        total_tax_amount,
        total_amount,
        amount_paid,
        balance_due,
        status,
        payment_status,
        reference_number,
        notes,
        created_at,
        created_by,
        companies:company_id (
          id,
          name,
          slug
        ),
        vendors:vendor_id (
          id,
          vendor_code,
          legal_name,
          trade_name,
          phone,
          gstin
        ),
        purchase_orders:purchase_order_id (
          id,
          po_number
        )
      `, { count: 'exact' });

    if (!isAllCompanies && companyId) {
      query = query.eq('company_id', companyId);
    }

    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }

    if (purchaseOrderId) {
      query = query.eq('purchase_order_id', purchaseOrderId);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query = query.eq('payment_status', paymentStatus);
    }

    if (dateFrom) {
      query = query.gte('bill_date', dateFrom);
    }

    if (dateTo) {
      query = query.lte('bill_date', dateTo);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`bill_number.ilike.${term},vendor_invoice_number.ilike.${term},reference_number.ilike.${term}`);
    }

    query = query
      .order('bill_date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  } catch (err) {
    console.error('getPurchaseBills Error:', err);
    throw err;
  }
}

/**
 * Fetch a single purchase bill with full relationships and vendor payments
 */
export async function getPurchaseBillById(id) {
  if (!isSupabaseConfigured || !id) return null;

  try {
    const { data, error } = await supabase
      .from('purchase_bills')
      .select(`
        *,
        companies:company_id (
          id,
          name,
          legal_name,
          gstin,
          pan,
          billing_address,
          billing_city,
          billing_state,
          billing_postal_code,
          bank_name,
          bank_account_no,
          bank_ifsc
        ),
        vendors:vendor_id (
          id,
          vendor_code,
          legal_name,
          trade_name,
          contact_person,
          phone,
          email,
          gstin,
          pan,
          billing_address,
          billing_city,
          billing_state,
          billing_postal_code,
          bank_name,
          bank_account_no,
          bank_ifsc,
          upi_id
        ),
        purchase_orders:purchase_order_id (
          id,
          po_number,
          po_date,
          total_amount
        ),
        purchase_bill_items (
          id,
          purchase_order_item_id,
          service_id,
          item_name,
          description,
          hsn_sac_code,
          quantity,
          unit_price,
          discount_amount,
          tax_rate,
          taxable_amount,
          tax_amount,
          line_total
        ),
        vendor_payments (
          id,
          payment_number,
          amount,
          payment_date,
          payment_method,
          reference_number,
          notes,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('getPurchaseBillById Error:', err);
    throw err;
  }
}

/**
 * Create a new Purchase Bill (Direct or PO-linked)
 */
export async function createPurchaseBill({ billData, items = [], currentUser = null }) {
  if (!isSupabaseConfigured) throw new Error('Database connection not configured');
  if (!billData.company_id) throw new Error('Company association is required.');
  if (!billData.vendor_id) throw new Error('Vendor selection is required.');
  if (!billData.vendor_invoice_number || !billData.vendor_invoice_number.trim()) {
    throw new Error('Vendor invoice number (from external bill) is required.');
  }
  if (!items || items.length === 0) {
    throw new Error('Supplier bill requires at least one line item.');
  }

  const totals = calculateBillTotals({
    items,
    discountAmount: billData.discount_amount || 0,
    isInterstate: billData.is_interstate || false
  });

  const billPayload = {
    company_id: billData.company_id,
    vendor_id: billData.vendor_id,
    purchase_order_id: billData.purchase_order_id || null,
    vendor_invoice_number: billData.vendor_invoice_number.trim(),
    bill_date: billData.bill_date || new Date().toISOString().split('T')[0],
    due_date: billData.due_date || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    subtotal: totals.subtotal,
    discount_amount: totals.discountAmount,
    taxable_amount: totals.taxableAmount,
    place_of_supply: billData.place_of_supply || 'Gujarat',
    is_interstate: totals.isInterstate,
    cgst_amount: totals.cgstAmount,
    sgst_amount: totals.sgstAmount,
    igst_amount: totals.igstAmount,
    total_tax_amount: totals.totalTaxAmount,
    total_amount: totals.totalAmount,
    amount_paid: 0.00,
    balance_due: totals.totalAmount,
    status: billData.status === 'draft' ? 'draft' : 'recorded',
    payment_status: 'unpaid',
    reference_number: billData.reference_number ? billData.reference_number.trim() : null,
    notes: billData.notes ? billData.notes.trim() : null,
    created_by: currentUser?.id || null
  };

  const { data: createdBill, error: billErr } = await supabase
    .from('purchase_bills')
    .insert(billPayload)
    .select()
    .single();

  if (billErr) throw billErr;

  // Insert bill line items
  const itemsPayload = items.map((item) => {
    const calc = calculateBillLineItem(item);
    return {
      purchase_bill_id: createdBill.id,
      purchase_order_item_id: item.purchase_order_item_id || null,
      service_id: item.service_id || null,
      item_name: item.item_name.trim(),
      description: item.description ? item.description.trim() : null,
      hsn_sac_code: item.hsn_sac_code ? item.hsn_sac_code.trim() : null,
      quantity: Math.max(1, Number(item.quantity) || 1),
      unit_price: Math.max(0, Number(item.unit_price) || 0),
      discount_amount: Math.max(0, Number(item.discount_amount) || 0),
      tax_rate: Math.max(0, Number(item.tax_rate) || 0),
      taxable_amount: calc.taxableAmount,
      tax_amount: calc.taxAmount,
      line_total: calc.lineTotal
    };
  });

  const { error: itemsErr } = await supabase
    .from('purchase_bill_items')
    .insert(itemsPayload);

  if (itemsErr) {
    console.error('Failed to insert bill items:', itemsErr);
    await supabase.from('purchase_bills').delete().eq('id', createdBill.id);
    throw itemsErr;
  }

  return createdBill;
}

/**
 * Record a draft Purchase Bill (makes it active in AP and updates PO progress)
 */
export async function recordPurchaseBill(id, currentUser = null) {
  if (!isSupabaseConfigured || !id) throw new Error('Bill ID is required');

  const { data, error } = await supabase
    .from('purchase_bills')
    .update({
      status: 'recorded',
      updated_by: currentUser?.id || null
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing Purchase Bill (Only Draft or Recorded bills with zero payments)
 */
export async function updatePurchaseBill(id, { billData, items = [], currentUser = null }) {
  if (!isSupabaseConfigured || !id) throw new Error('Bill ID is required');

  const { data: existingBill, error: fetchErr } = await supabase
    .from('purchase_bills')
    .select('status, amount_paid, total_amount')
    .eq('id', id)
    .single();

  if (fetchErr) throw fetchErr;

  if (Number(existingBill.amount_paid) > 0) {
    throw new Error('Cannot modify financial line items of a bill with recorded payments. Please revert payments first.');
  }

  const totals = calculateBillTotals({
    items,
    discountAmount: billData.discount_amount || 0,
    isInterstate: billData.is_interstate || false
  });

  const billPayload = {
    vendor_invoice_number: billData.vendor_invoice_number?.trim(),
    bill_date: billData.bill_date,
    due_date: billData.due_date,
    subtotal: totals.subtotal,
    discount_amount: totals.discountAmount,
    taxable_amount: totals.taxableAmount,
    place_of_supply: billData.place_of_supply,
    is_interstate: totals.isInterstate,
    cgst_amount: totals.cgstAmount,
    sgst_amount: totals.sgstAmount,
    igst_amount: totals.igstAmount,
    total_tax_amount: totals.totalTaxAmount,
    total_amount: totals.totalAmount,
    balance_due: totals.totalAmount,
    reference_number: billData.reference_number ? billData.reference_number.trim() : null,
    notes: billData.notes ? billData.notes.trim() : null,
    updated_by: currentUser?.id || null
  };

  const { data: updatedBill, error: updateErr } = await supabase
    .from('purchase_bills')
    .update(billPayload)
    .eq('id', id)
    .select()
    .single();

  if (updateErr) throw updateErr;

  // Replace line items
  await supabase.from('purchase_bill_items').delete().eq('purchase_bill_id', id);

  const itemsPayload = items.map((item) => {
    const calc = calculateBillLineItem(item);
    return {
      purchase_bill_id: id,
      purchase_order_item_id: item.purchase_order_item_id || null,
      service_id: item.service_id || null,
      item_name: item.item_name.trim(),
      description: item.description ? item.description.trim() : null,
      hsn_sac_code: item.hsn_sac_code ? item.hsn_sac_code.trim() : null,
      quantity: Math.max(1, Number(item.quantity) || 1),
      unit_price: Math.max(0, Number(item.unit_price) || 0),
      discount_amount: Math.max(0, Number(item.discount_amount) || 0),
      tax_rate: Math.max(0, Number(item.tax_rate) || 0),
      taxable_amount: calc.taxableAmount,
      tax_amount: calc.taxAmount,
      line_total: calc.lineTotal
    };
  });

  const { error: itemsErr } = await supabase
    .from('purchase_bill_items')
    .insert(itemsPayload);

  if (itemsErr) throw itemsErr;

  return updatedBill;
}

/**
 * Cancel a Purchase Bill (Only if no payments recorded)
 */
export async function cancelPurchaseBill(id, currentUser = null) {
  if (!isSupabaseConfigured || !id) throw new Error('Bill ID is required');

  const { data: existingBill, error: fetchErr } = await supabase
    .from('purchase_bills')
    .select('amount_paid')
    .eq('id', id)
    .single();

  if (fetchErr) throw fetchErr;
  if (Number(existingBill.amount_paid) > 0) {
    throw new Error('Cannot cancel a purchase bill with recorded disbursements.');
  }

  const { data, error } = await supabase
    .from('purchase_bills')
    .update({
      status: 'cancelled',
      balance_due: 0.00,
      updated_by: currentUser?.id || null
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const purchaseBillService = {
  getPurchaseBills,
  getPurchaseBillById,
  createPurchaseBill,
  updatePurchaseBill,
  recordPurchaseBill,
  cancelPurchaseBill,
  calculateBillLineItem,
  calculateBillTotals
};

export default purchaseBillService;

