import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — INVOICE & BILLING SERVICE
 * 
 * Production data layer for Invoices, Line Items, Historical Snapshots,
 * and Concurrency-Safe Financial Calculations.
 * PostgreSQL Row Level Security (RLS) is authoritative.
 */

export const INVOICE_STATUSES = Object.freeze([
  { value: 'draft', label: 'Draft', color: 'slate' },
  { value: 'issued', label: 'Issued', color: 'blue' },
  { value: 'partially_paid', label: 'Partially Paid', color: 'amber' },
  { value: 'paid', label: 'Paid', color: 'emerald' },
  { value: 'overdue', label: 'Overdue', color: 'rose' },
  { value: 'cancelled', label: 'Cancelled', color: 'gray' }
]);

export const DISCOUNT_TYPES = Object.freeze([
  { value: 'fixed', label: 'Fixed Amount (₹)' },
  { value: 'percentage', label: 'Percentage (%)' }
]);

export const PLACE_OF_SUPPLY_STATES = Object.freeze([
  'Gujarat', 'Maharashtra', 'Rajasthan', 'Madhya Pradesh', 'Delhi',
  'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Haryana',
  'Punjab', 'Telangana', 'Andhra Pradesh', 'Kerala', 'Bihar', 'Other'
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
 * Calculate line item financial totals
 */
export function calculateLineItem({
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
 * Calculate invoice-level totals with discount and GST engine
 */
export function calculateInvoiceTotals({
  items = [],
  discountType = 'fixed',
  discountValue = 0,
  isTaxInvoice = true,
  isInterstate = false
}) {
  let subtotal = 0;
  let itemsTaxTotal = 0;

  items.forEach((item) => {
    const calc = calculateLineItem(item);
    subtotal = round2(subtotal + calc.gross);
    itemsTaxTotal = round2(itemsTaxTotal + (isTaxInvoice ? calc.taxAmount : 0));
  });

  const discVal = Math.max(0, Number(discountValue) || 0);
  let discountAmount = 0;

  if (discountType === 'percentage') {
    discountAmount = round2(subtotal * (Math.min(100, discVal) / 100));
  } else {
    discountAmount = round2(Math.min(subtotal, discVal));
  }

  const taxableAmount = Math.max(0, round2(subtotal - discountAmount));

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;
  let totalTaxAmount = 0;

  if (isTaxInvoice && itemsTaxTotal > 0) {
    // If invoice-level discount applied, scale taxes proportionally
    const taxScaleRatio = subtotal > 0 ? (taxableAmount / subtotal) : 1;
    totalTaxAmount = round2(itemsTaxTotal * taxScaleRatio);

    if (isInterstate) {
      igstAmount = totalTaxAmount;
      cgstAmount = 0;
      sgstAmount = 0;
    } else {
      cgstAmount = round2(totalTaxAmount / 2);
      sgstAmount = round2(totalTaxAmount - cgstAmount); // Avoid rounding mismatch
      igstAmount = 0;
    }
  }

  const totalAmount = round2(taxableAmount + totalTaxAmount);

  return {
    subtotal,
    discountType,
    discountValue: discVal,
    discountAmount,
    taxableAmount,
    isTaxInvoice,
    isInterstate,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalTaxAmount,
    totalAmount
  };
}

/**
 * Fetch invoices list with filtering, company scoping, and pagination
 */
export async function getInvoices({
  companyId = null,
  isAllCompanies = false,
  search = '',
  status = 'all',
  customerId = null,
  dateFrom = null,
  dateTo = null,
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
      .from('invoices')
      .select(`
        id,
        invoice_number,
        company_id,
        customer_id,
        invoice_date,
        due_date,
        subtotal,
        discount_type,
        discount_amount,
        taxable_amount,
        is_tax_invoice,
        cgst_amount,
        sgst_amount,
        igst_amount,
        total_tax_amount,
        total_amount,
        amount_paid,
        balance_due,
        status,
        customer_name,
        customer_phone,
        customer_email,
        company_name,
        place_of_supply,
        created_at,
        companies:company_id (
          id,
          name,
          slug
        ),
        customers:customer_id (
          id,
          full_name,
          customer_code,
          phone
        )
      `, { count: 'exact' });

    if (!isAllCompanies && companyId) {
      query = query.eq('company_id', companyId);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    if (dateFrom) {
      query = query.gte('invoice_date', dateFrom);
    }

    if (dateTo) {
      query = query.lte('invoice_date', dateTo);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`invoice_number.ilike.${term},customer_name.ilike.${term},customer_phone.ilike.${term},customer_email.ilike.${term}`);
    }

    query = query
      .order('invoice_date', { ascending: false })
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
    console.error('getInvoices Error:', err);
    throw err;
  }
}

/**
 * Fetch a single invoice with full line items, snapshots, and payment history
 */
export async function getInvoiceById(id) {
  if (!isSupabaseConfigured || !id) return null;

  try {
    const { data: invoice, error: invError } = await supabase
      .from('invoices')
      .select(`
        *,
        companies:company_id (
          id,
          name,
          slug,
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
        customers:customer_id (
          id,
          full_name,
          customer_code,
          phone,
          email,
          address,
          city,
          state,
          postal_code,
          tax_id
        ),
        invoice_items (
          id,
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
          line_total,
          services:service_id (
            id,
            service_code,
            name
          )
        ),
        payments (
          id,
          payment_number,
          amount,
          payment_date,
          payment_method,
          reference_number,
          notes,
          created_at,
          created_by
        )
      `)
      .eq('id', id)
      .single();

    if (invError) throw invError;

    return invoice;
  } catch (err) {
    console.error('getInvoiceById Error:', err);
    throw err;
  }
}

/**
 * Create a new invoice and line items
 */
export async function createInvoice({
  companyId,
  customerId,
  enquiryId = null,
  invoiceDate,
  dueDate,
  isTaxInvoice = true,
  placeOfSupply = 'Gujarat',
  isInterstate = false,
  discountType = 'fixed',
  discountValue = 0,
  items = [],
  notes = '',
  termsAndConditions = '',
  currentUser = null
}) {
  if (!isSupabaseConfigured) throw new Error('Database connection not configured');
  if (!companyId) throw new Error('Company selection is mandatory');
  if (!customerId) throw new Error('Customer selection is mandatory');
  if (!items || items.length === 0) throw new Error('At least one invoice line item is required');

  try {
    // 1. Fetch Company details for historical snapshot
    const { data: company, error: compErr } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (compErr || !company) throw new Error('Failed to load company billing profile');

    // 2. Fetch Customer details for historical snapshot
    const { data: customer, error: custErr } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    if (custErr || !customer) throw new Error('Failed to load customer profile');

    // 3. Compute Totals
    const totals = calculateInvoiceTotals({
      items,
      discountType,
      discountValue,
      isTaxInvoice,
      isInterstate
    });

    // 4. Insert Invoice Header
    const invoicePayload = {
      company_id: companyId,
      customer_id: customerId,
      enquiry_id: enquiryId,
      invoice_date: invoiceDate || new Date().toISOString().split('T')[0],
      due_date: dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      subtotal: totals.subtotal,
      discount_type: totals.discountType,
      discount_value: totals.discountValue,
      discount_amount: totals.discountAmount,
      taxable_amount: totals.taxableAmount,
      is_tax_invoice: totals.isTaxInvoice,
      place_of_supply: placeOfSupply,
      is_interstate: totals.isInterstate,
      cgst_amount: totals.cgstAmount,
      sgst_amount: totals.sgstAmount,
      igst_amount: totals.igstAmount,
      total_tax_amount: totals.totalTaxAmount,
      total_amount: totals.totalAmount,
      amount_paid: 0.00,
      balance_due: totals.totalAmount,
      status: 'draft',
      
      // Customer Historical Snapshot
      customer_name: customer.full_name,
      customer_business_name: customer.business_name || null,
      customer_phone: customer.phone,
      customer_email: customer.email || null,
      customer_address: customer.address || null,
      customer_city: customer.city || null,
      customer_state: customer.state || null,
      customer_postal_code: customer.postal_code || null,
      customer_tax_id: customer.tax_id || null,

      // Company Historical Snapshot
      company_name: company.name,
      company_legal_name: company.legal_name || company.name,
      company_gstin: company.gstin || null,
      company_pan: company.pan || null,
      company_address: company.billing_address || null,
      company_bank_name: company.bank_name || null,
      company_bank_account_no: company.bank_account_no || null,
      company_bank_ifsc: company.bank_ifsc || null,
      company_upi_id: company.upi_id || null,

      notes: notes || null,
      terms_and_conditions: termsAndConditions || null,
      created_by: currentUser?.id || null
    };

    const { data: createdInvoice, error: invInsertErr } = await supabase
      .from('invoices')
      .insert(invoicePayload)
      .select()
      .single();

    if (invInsertErr) throw invInsertErr;

    // 5. Insert Invoice Items
    const lineItemInserts = items.map((item) => {
      const calc = calculateLineItem(item);
      return {
        invoice_id: createdInvoice.id,
        service_id: item.service_id || null,
        item_name: item.item_name || 'Custom Service',
        description: item.description || null,
        hsn_sac_code: item.hsn_sac_code || null,
        quantity: Math.max(0.01, Number(item.quantity) || 1),
        unit_price: Math.max(0, Number(item.unit_price) || 0),
        discount_amount: Math.max(0, Number(item.discount_amount) || 0),
        tax_rate: isTaxInvoice ? Math.max(0, Number(item.tax_rate) || 0) : 0,
        taxable_amount: calc.taxableAmount,
        tax_amount: isTaxInvoice ? calc.taxAmount : 0,
        line_total: isTaxInvoice ? calc.lineTotal : calc.taxableAmount
      };
    });

    const { error: itemsErr } = await supabase
      .from('invoice_items')
      .insert(lineItemInserts);

    if (itemsErr) {
      // Rollback header on error
      await supabase.from('invoices').delete().eq('id', createdInvoice.id);
      throw itemsErr;
    }

    return createdInvoice;
  } catch (err) {
    console.error('createInvoice Error:', err);
    throw err;
  }
}

/**
 * Update an existing draft invoice
 */
export async function updateInvoice(id, {
  companyId,
  customerId,
  enquiryId = null,
  invoiceDate,
  dueDate,
  isTaxInvoice = true,
  placeOfSupply = 'Gujarat',
  isInterstate = false,
  discountType = 'fixed',
  discountValue = 0,
  items = [],
  notes = '',
  termsAndConditions = '',
  currentUser = null
}) {
  if (!isSupabaseConfigured) throw new Error('Database connection not configured');
  
  // Verify invoice exists and is draft
  const { data: existing, error: checkErr } = await supabase
    .from('invoices')
    .select('id, status, amount_paid')
    .eq('id', id)
    .single();

  if (checkErr || !existing) throw new Error('Invoice not found');
  if (existing.status !== 'draft') {
    throw new Error('Only draft invoices can be edited. Issued invoices are immutable.');
  }

  try {
    // 1. Fetch updated snapshots if customer/company changed
    const { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    const totals = calculateInvoiceTotals({
      items,
      discountType,
      discountValue,
      isTaxInvoice,
      isInterstate
    });

    // 2. Update Header
    const updatePayload = {
      customer_id: customerId,
      enquiry_id: enquiryId,
      invoice_date: invoiceDate,
      due_date: dueDate,
      subtotal: totals.subtotal,
      discount_type: totals.discountType,
      discount_value: totals.discountValue,
      discount_amount: totals.discountAmount,
      taxable_amount: totals.taxableAmount,
      is_tax_invoice: totals.isTaxInvoice,
      place_of_supply: placeOfSupply,
      is_interstate: totals.isInterstate,
      cgst_amount: totals.cgstAmount,
      sgst_amount: totals.sgstAmount,
      igst_amount: totals.igstAmount,
      total_tax_amount: totals.totalTaxAmount,
      total_amount: totals.totalAmount,
      balance_due: totals.totalAmount - (existing.amount_paid || 0),
      notes: notes || null,
      terms_and_conditions: termsAndConditions || null,
      updated_by: currentUser?.id || null
    };

    if (customer) {
      updatePayload.customer_name = customer.full_name;
      updatePayload.customer_business_name = customer.business_name || null;
      updatePayload.customer_phone = customer.phone;
      updatePayload.customer_email = customer.email || null;
      updatePayload.customer_tax_id = customer.tax_id || null;
    }

    const { error: invUpErr } = await supabase
      .from('invoices')
      .update(updatePayload)
      .eq('id', id);

    if (invUpErr) throw invUpErr;

    // 3. Replace Line Items: Delete old and insert new
    await supabase.from('invoice_items').delete().eq('invoice_id', id);

    const lineItemInserts = items.map((item) => {
      const calc = calculateLineItem(item);
      return {
        invoice_id: id,
        service_id: item.service_id || null,
        item_name: item.item_name || 'Custom Service',
        description: item.description || null,
        hsn_sac_code: item.hsn_sac_code || null,
        quantity: Math.max(0.01, Number(item.quantity) || 1),
        unit_price: Math.max(0, Number(item.unit_price) || 0),
        discount_amount: Math.max(0, Number(item.discount_amount) || 0),
        tax_rate: isTaxInvoice ? Math.max(0, Number(item.tax_rate) || 0) : 0,
        taxable_amount: calc.taxableAmount,
        tax_amount: isTaxInvoice ? calc.taxAmount : 0,
        line_total: isTaxInvoice ? calc.lineTotal : calc.taxableAmount
      };
    });

    const { error: itemsErr } = await supabase
      .from('invoice_items')
      .insert(lineItemInserts);

    if (itemsErr) throw itemsErr;

    return true;
  } catch (err) {
    console.error('updateInvoice Error:', err);
    throw err;
  }
}

/**
 * Issue an invoice (Draft -> Issued)
 * Freezes the commercial document for settlement
 */
export async function issueInvoice(id) {
  if (!isSupabaseConfigured) throw new Error('Database connection not configured');

  const { data: inv, error: getErr } = await supabase
    .from('invoices')
    .select('id, status, total_amount')
    .eq('id', id)
    .single();

  if (getErr || !inv) throw new Error('Invoice not found');
  if (inv.status !== 'draft') {
    throw new Error('Only draft invoices can be issued.');
  }

  const { error } = await supabase
    .from('invoices')
    .update({ status: 'issued' })
    .eq('id', id);

  if (error) throw error;
  return true;
}

/**
 * Cancel an invoice (with mandatory reason)
 */
export async function cancelInvoice(id, cancellationReason) {
  if (!isSupabaseConfigured) throw new Error('Database connection not configured');
  if (!cancellationReason || !cancellationReason.trim()) {
    throw new Error('A cancellation reason is strictly required.');
  }

  const { data: inv, error: getErr } = await supabase
    .from('invoices')
    .select('id, status, amount_paid')
    .eq('id', id)
    .single();

  if (getErr || !inv) throw new Error('Invoice not found');
  if (inv.status === 'cancelled') {
    throw new Error('Invoice is already cancelled.');
  }
  if (Number(inv.amount_paid) > 0) {
    throw new Error('Cannot cancel an invoice with recorded payments. Reverse payments first.');
  }

  const { error } = await supabase
    .from('invoices')
    .update({
      status: 'cancelled',
      cancellation_reason: cancellationReason.trim()
    })
    .eq('id', id);

  if (error) throw error;
  return true;
}

/**
 * Delete a draft invoice (Super Admin only)
 */
export async function deleteInvoice(id) {
  if (!isSupabaseConfigured) throw new Error('Database connection not configured');

  const { data: inv, error: getErr } = await supabase
    .from('invoices')
    .select('id, status')
    .eq('id', id)
    .single();

  if (getErr || !inv) throw new Error('Invoice not found');
  if (inv.status !== 'draft') {
    throw new Error('Only draft invoices can be deleted.');
  }

  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

/**
 * Fetch available customers for a specific company
 */
export async function getCompanyCustomers(companyId) {
  if (!isSupabaseConfigured || !companyId) return [];

  const { data, error } = await supabase
    .from('customers')
    .select('id, full_name, customer_code, phone, email, address, city, state, postal_code, tax_id')
    .eq('company_id', companyId)
    .eq('status', 'active')
    .order('full_name');

  if (error) {
    console.error('getCompanyCustomers Error:', error);
    return [];
  }
  return data || [];
}

/**
 * Fetch available services for a specific company
 */
export async function getCompanyServices(companyId) {
  if (!isSupabaseConfigured || !companyId) return [];

  const { data, error } = await supabase
    .from('services')
    .select('id, service_code, name, description, hsn_sac_code, base_price, tax_rate')
    .eq('company_id', companyId)
    .eq('status', 'active')
    .order('name');

  if (error) {
    console.error('getCompanyServices Error:', error);
    return [];
  }
  return data || [];
}
