import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — PAYMENT LEDGER & RECEIPT SERVICE
 * 
 * Production data layer for payment recording, receipt generation,
 * and commercial settlement tracking.
 */

export const PAYMENT_METHODS = Object.freeze([
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI / QR' },
  { value: 'bank_transfer', label: 'Bank Transfer (NEFT/RTGS/IMPS)' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'card', label: 'Credit / Debit Card' },
  { value: 'online', label: 'Net Banking' },
  { value: 'other', label: 'Other Instrument' }
]);

/**
 * Fetch payments list with company scoping, filtering, and pagination
 */
export async function getPayments({
  companyId = null,
  isAllCompanies = false,
  invoiceId = null,
  customerId = null,
  paymentMethod = 'all',
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
      .from('payments')
      .select(`
        id,
        payment_number,
        company_id,
        invoice_id,
        customer_id,
        amount,
        payment_date,
        payment_method,
        reference_number,
        notes,
        created_at,
        created_by,
        companies:company_id (
          id,
          name,
          slug
        ),
        invoices:invoice_id (
          id,
          invoice_number,
          total_amount,
          amount_paid,
          balance_due,
          status
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

    if (invoiceId) {
      query = query.eq('invoice_id', invoiceId);
    }

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    if (paymentMethod && paymentMethod !== 'all') {
      query = query.eq('payment_method', paymentMethod);
    }

    if (dateFrom) {
      query = query.gte('payment_date', dateFrom);
    }

    if (dateTo) {
      query = query.lte('payment_date', dateTo);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`payment_number.ilike.${term},reference_number.ilike.${term}`);
    }

    query = query
      .order('payment_date', { ascending: false })
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
    console.error('getPayments Error:', err);
    throw err;
  }
}

/**
 * Fetch a single payment record with full invoice, customer, and company details for Receipt View
 */
export async function getPaymentById(id) {
  if (!isSupabaseConfigured || !id) return null;

  try {
    const { data, error } = await supabase
      .from('payments')
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
          bank_name,
          bank_account_no,
          bank_ifsc,
          upi_id
        ),
        invoices:invoice_id (
          id,
          invoice_number,
          invoice_date,
          due_date,
          total_amount,
          amount_paid,
          balance_due,
          status,
          customer_name,
          customer_phone,
          customer_email
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
          postal_code
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('getPaymentById Error:', err);
    throw err;
  }
}

/**
 * Record a payment against an invoice
 * Validates amount > 0 and overpayment protection
 */
export async function recordPayment({
  invoiceId,
  amount,
  paymentDate,
  paymentMethod,
  referenceNumber = '',
  notes = '',
  currentUser = null
}) {
  if (!isSupabaseConfigured) throw new Error('Database connection not configured');
  if (!invoiceId) throw new Error('Invoice reference is required');

  const payAmt = Number(amount);
  if (isNaN(payAmt) || payAmt <= 0) {
    throw new Error('Payment amount must be greater than zero.');
  }

  // Fetch invoice details for validation
  const { data: inv, error: invErr } = await supabase
    .from('invoices')
    .select('id, company_id, customer_id, total_amount, amount_paid, balance_due, status')
    .eq('id', invoiceId)
    .single();

  if (invErr || !inv) throw new Error('Referenced invoice not found');
  if (inv.status === 'draft') {
    throw new Error('Cannot record payments against draft invoices. Please issue the invoice first.');
  }
  if (inv.status === 'cancelled') {
    throw new Error('Cannot record payments against cancelled invoices.');
  }

  const currentBal = Number(inv.balance_due);
  if (payAmt > currentBal + 0.01) { // 0.01 tolerance for floating point
    throw new Error(`Payment amount (₹${payAmt.toFixed(2)}) cannot exceed remaining balance (₹${currentBal.toFixed(2)}).`);
  }

  const paymentPayload = {
    company_id: inv.company_id,
    invoice_id: inv.id,
    customer_id: inv.customer_id,
    amount: payAmt,
    payment_date: paymentDate || new Date().toISOString().split('T')[0],
    payment_method: paymentMethod || 'upi',
    reference_number: referenceNumber ? referenceNumber.trim() : null,
    notes: notes ? notes.trim() : null,
    created_by: currentUser?.id || null
  };

  const { data, error } = await supabase
    .from('payments')
    .insert(paymentPayload)
    .select()
    .single();

  if (error) throw error;
  return data;
}
