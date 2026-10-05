import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — PURCHASE ORDER SERVICE
 * 
 * Production data layer for Procurement, Purchase Orders, Line Items,
 * and Approval Workflows.
 */

export const PO_STATUSES = Object.freeze([
  { value: 'draft', label: 'Draft', color: 'slate' },
  { value: 'submitted', label: 'Submitted', color: 'amber' },
  { value: 'approved', label: 'Approved', color: 'blue' },
  { value: 'issued', label: 'Issued to Vendor', color: 'indigo' },
  { value: 'partially_billed', label: 'Partially Billed', color: 'purple' },
  { value: 'fully_billed', label: 'Fully Billed', color: 'emerald' },
  { value: 'closed', label: 'Closed', color: 'teal' },
  { value: 'cancelled', label: 'Cancelled', color: 'rose' }
]);

export const PO_APPROVAL_STATUSES = Object.freeze([
  { value: 'draft', label: 'Draft', color: 'slate' },
  { value: 'submitted', label: 'Submitted', color: 'amber' },
  { value: 'approved', label: 'Approved', color: 'emerald' },
  { value: 'rejected', label: 'Rejected', color: 'rose' }
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
 * Calculate PO line item financial totals
 */
export function calculatePOLineItem({
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
 * Calculate PO-level totals with discount and Indian GST engine
 */
export function calculatePOTotals({
  items = [],
  discountAmount = 0,
  isInterstate = false
}) {
  let subtotal = 0;
  let itemsTaxTotal = 0;

  items.forEach((item) => {
    const calc = calculatePOLineItem(item);
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
 * Fetch purchase orders with company scoping, filtering, and pagination
 */
export async function getPurchaseOrders({
  companyId = null,
  isAllCompanies = false,
  vendorId = null,
  status = 'all',
  approvalStatus = 'all',
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
      .from('purchase_orders')
      .select(`
        id,
        po_number,
        company_id,
        vendor_id,
        po_date,
        expected_delivery_date,
        payment_terms_days,
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
        billed_amount,
        status,
        approval_status,
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
        )
      `, { count: 'exact' });

    if (!isAllCompanies && companyId) {
      query = query.eq('company_id', companyId);
    }

    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (approvalStatus && approvalStatus !== 'all') {
      query = query.eq('approval_status', approvalStatus);
    }

    if (dateFrom) {
      query = query.gte('po_date', dateFrom);
    }

    if (dateTo) {
      query = query.lte('po_date', dateTo);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`po_number.ilike.${term}`);
    }

    query = query
      .order('po_date', { ascending: false })
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
    console.error('getPurchaseOrders Error:', err);
    throw err;
  }
}

/**
 * Fetch a single Purchase Order by ID with full relations
 */
export async function getPurchaseOrderById(id) {
  if (!isSupabaseConfigured || !id) return null;

  try {
    const { data, error } = await supabase
      .from('purchase_orders')
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
          payment_terms_days
        ),
        purchase_order_items (
          id,
          service_id,
          item_name,
          description,
          hsn_sac_code,
          quantity,
          billed_quantity,
          unit_price,
          discount_amount,
          tax_rate,
          taxable_amount,
          tax_amount,
          line_total
        ),
        purchase_bills (
          id,
          bill_number,
          vendor_invoice_number,
          bill_date,
          total_amount,
          amount_paid,
          balance_due,
          status,
          payment_status
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('getPurchaseOrderById Error:', err);
    throw err;
  }
}

/**
 * Create a new Purchase Order
 */
export async function createPurchaseOrder({ poData, items = [], currentUser = null }) {
  if (!isSupabaseConfigured) throw new Error('Database connection not configured');
  if (!poData.company_id) throw new Error('Company association is required.');
  if (!poData.vendor_id) throw new Error('Vendor is required.');
  if (!items || items.length === 0) throw new Error('Purchase order requires at least one line item.');

  const totals = calculatePOTotals({
    items,
    discountAmount: poData.discount_amount || 0,
    isInterstate: poData.is_interstate || false
  });

  const poPayload = {
    company_id: poData.company_id,
    vendor_id: poData.vendor_id,
    po_date: poData.po_date || new Date().toISOString().split('T')[0],
    expected_delivery_date: poData.expected_delivery_date || null,
    payment_terms_days: Math.max(0, parseInt(poData.payment_terms_days, 10) || 15),
    subtotal: totals.subtotal,
    discount_amount: totals.discountAmount,
    taxable_amount: totals.taxableAmount,
    place_of_supply: poData.place_of_supply || 'Gujarat',
    is_interstate: totals.isInterstate,
    cgst_amount: totals.cgstAmount,
    sgst_amount: totals.sgstAmount,
    igst_amount: totals.igstAmount,
    total_tax_amount: totals.totalTaxAmount,
    total_amount: totals.totalAmount,
    billed_amount: 0.00,
    status: 'draft',
    approval_status: 'draft',
    notes: poData.notes ? poData.notes.trim() : null,
    terms_and_conditions: poData.terms_and_conditions ? poData.terms_and_conditions.trim() : '1. Standard commercial delivery terms apply.\n2. Goods must match exact specifications.',
    created_by: currentUser?.id || null
  };

  const { data: createdPO, error: poErr } = await supabase
    .from('purchase_orders')
    .insert(poPayload)
    .select()
    .single();

  if (poErr) throw poErr;

  // Insert PO Line items
  const itemsPayload = items.map((item) => {
    const calc = calculatePOLineItem(item);
    return {
      purchase_order_id: createdPO.id,
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
    .from('purchase_order_items')
    .insert(itemsPayload);

  if (itemsErr) {
    console.error('Failed to insert PO line items:', itemsErr);
    throw itemsErr;
  }

  return createdPO;
}

/**
 * Update an existing Purchase Order (Only Draft / Revised POs)
 */
export async function updatePurchaseOrder(id, { poData, items = [], currentUser = null }) {
  if (!isSupabaseConfigured || !id) throw new Error('PO ID is required');

  const { data: existingPO, error: fetchErr } = await supabase
    .from('purchase_orders')
    .select('status, approval_status')
    .eq('id', id)
    .single();

  if (fetchErr) throw fetchErr;
  if (existingPO.status !== 'draft') {
    throw new Error('Only draft purchase orders can be modified. Issued or approved orders are locked.');
  }

  const totals = calculatePOTotals({
    items,
    discountAmount: poData.discount_amount || 0,
    isInterstate: poData.is_interstate || false
  });

  const poPayload = {
    po_date: poData.po_date,
    expected_delivery_date: poData.expected_delivery_date || null,
    payment_terms_days: Math.max(0, parseInt(poData.payment_terms_days, 10) || 15),
    subtotal: totals.subtotal,
    discount_amount: totals.discountAmount,
    taxable_amount: totals.taxableAmount,
    place_of_supply: poData.place_of_supply,
    is_interstate: totals.isInterstate,
    cgst_amount: totals.cgstAmount,
    sgst_amount: totals.sgstAmount,
    igst_amount: totals.igstAmount,
    total_tax_amount: totals.totalTaxAmount,
    total_amount: totals.totalAmount,
    notes: poData.notes ? poData.notes.trim() : null,
    terms_and_conditions: poData.terms_and_conditions ? poData.terms_and_conditions.trim() : null,
    updated_by: currentUser?.id || null
  };

  const { data: updatedPO, error: updateErr } = await supabase
    .from('purchase_orders')
    .update(poPayload)
    .eq('id', id)
    .select()
    .single();

  if (updateErr) throw updateErr;

  // Replace line items
  await supabase.from('purchase_order_items').delete().eq('purchase_order_id', id);

  const itemsPayload = items.map((item) => {
    const calc = calculatePOLineItem(item);
    return {
      purchase_order_id: id,
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
    .from('purchase_order_items')
    .insert(itemsPayload);

  if (itemsErr) throw itemsErr;

  return updatedPO;
}

/**
 * Submit PO for approval (Employee or Manager)
 */
export async function submitPurchaseOrder(id, currentUser = null) {
  if (!isSupabaseConfigured || !id) throw new Error('PO ID is required');

  const { data, error } = await supabase
    .from('purchase_orders')
    .update({
      status: 'submitted',
      approval_status: 'submitted',
      submitted_by: currentUser?.id || null
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Approve Purchase Order (Manager or Group Owner)
 */
export async function approvePurchaseOrder(id, currentUser = null) {
  if (!isSupabaseConfigured || !id) throw new Error('PO ID is required');

  const { data, error } = await supabase
    .from('purchase_orders')
    .update({
      status: 'approved',
      approval_status: 'approved',
      approved_by: currentUser?.id || null,
      approved_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Reject Purchase Order (Manager or Group Owner)
 */
export async function rejectPurchaseOrder(id, reason = '', currentUser = null) {
  if (!isSupabaseConfigured || !id) throw new Error('PO ID is required');

  const { data, error } = await supabase
    .from('purchase_orders')
    .update({
      status: 'draft', // Resets to draft for revision
      approval_status: 'rejected',
      cancellation_reason: reason.trim() || 'PO rejected during review',
      updated_by: currentUser?.id || null
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Issue approved PO to vendor
 */
export async function issuePurchaseOrder(id, currentUser = null) {
  if (!isSupabaseConfigured || !id) throw new Error('PO ID is required');

  const { data, error } = await supabase
    .from('purchase_orders')
    .update({
      status: 'issued',
      issued_at: new Date().toISOString(),
      updated_by: currentUser?.id || null
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Cancel Purchase Order
 */
export async function cancelPurchaseOrder(id, reason = '', currentUser = null) {
  if (!isSupabaseConfigured || !id) throw new Error('PO ID is required');
  if (!reason.trim()) throw new Error('Cancellation reason is required.');

  const { data, error } = await supabase
    .from('purchase_orders')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason.trim(),
      updated_by: currentUser?.id || null
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch approved/issued POs for converting into a Supplier Bill
 */
export async function getApprovedPOsForCompany(companyId, vendorId = null) {
  if (!isSupabaseConfigured || !companyId) return [];

  try {
    let query = supabase
      .from('purchase_orders')
      .select(`
        id,
        po_number,
        vendor_id,
        po_date,
        total_amount,
        billed_amount,
        status,
        vendors (
          id,
          legal_name,
          trade_name
        )
      `)
      .eq('company_id', companyId)
      .in('status', ['issued', 'partially_billed'])
      .order('po_date', { ascending: false });

    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('getApprovedPOsForCompany Error:', err);
    return [];
  }
}

/**
 * Close Purchase Order administratively
 */
export async function closePurchaseOrder(id, currentUser = null) {
  if (!isSupabaseConfigured || !id) throw new Error('PO ID is required');

  const { data, error } = await supabase
    .from('purchase_orders')
    .update({
      status: 'closed',
      updated_by: currentUser?.id || null
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const submitForApproval = submitPurchaseOrder;
export const calculateLineItem = calculatePOLineItem;
export const calculateOrderTotals = calculatePOTotals;

export const purchaseOrderService = {
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  submitPurchaseOrder,
  submitForApproval,
  approvePurchaseOrder,
  rejectPurchaseOrder,
  issuePurchaseOrder,
  closePurchaseOrder,
  cancelPurchaseOrder,
  calculateLineItem,
  calculateOrderTotals,
  getApprovedPOsForCompany
};

export default purchaseOrderService;

