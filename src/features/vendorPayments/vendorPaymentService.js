import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — VENDOR PAYMENT LEDGER SERVICE
 * 
 * Production data layer for Outgoing Disbursements (Money OUT),
 * settlements against Supplier Bills, and balance synchronization.
 */

export const VENDOR_PAYMENT_METHODS = Object.freeze([
  { value: 'bank_transfer', label: 'Bank Transfer (NEFT/RTGS/IMPS)' },
  { value: 'upi', label: 'UPI / QR' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'cash', label: 'Cash Disbursement' },
  { value: 'card', label: 'Corporate Card' },
  { value: 'other', label: 'Other Instrument' }
]);

/**
 * Fetch vendor payments list with company scoping, filtering, and pagination
 */
export async function getVendorPayments({
  companyId = null,
  isAllCompanies = false,
  vendorId = null,
  billId = null,
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
      .from('vendor_payments')
      .select(`
        id,
        payment_number,
        company_id,
        bill_id,
        vendor_id,
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
        vendors:vendor_id (
          id,
          vendor_code,
          legal_name,
          trade_name
        ),
        purchase_bills:bill_id (
          id,
          bill_number,
          vendor_invoice_number,
          total_amount,
          amount_paid,
          balance_due,
          status,
          payment_status
        )
      `, { count: 'exact' });

    if (!isAllCompanies && companyId) {
      query = query.eq('company_id', companyId);
    }

    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }

    if (billId) {
      query = query.eq('bill_id', billId);
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
    console.error('getVendorPayments Error:', err);
    throw err;
  }
}

/**
 * Fetch single payment record with bill and vendor details
 */
export async function getVendorPaymentById(id) {
  if (!isSupabaseConfigured || !id) return null;

  try {
    const { data, error } = await supabase
      .from('vendor_payments')
      .select(`
        *,
        companies:company_id (
          id,
          name,
          legal_name
        ),
        vendors:vendor_id (
          id,
          vendor_code,
          legal_name,
          trade_name,
          bank_name,
          bank_account_no,
          bank_ifsc
        ),
        purchase_bills:bill_id (
          id,
          bill_number,
          vendor_invoice_number,
          total_amount,
          amount_paid,
          balance_due,
          status
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('getVendorPaymentById Error:', err);
    throw err;
  }
}

/**
 * Record a disbursement payment against a Supplier Bill
 * Validates amount > 0 and prevents overpayment.
 */
export async function recordVendorPayment({
  billId,
  amount,
  paymentDate,
  paymentMethod,
  referenceNumber = '',
  notes = '',
  currentUser = null
}) {
  if (!isSupabaseConfigured) throw new Error('Database connection not configured');
  if (!billId) throw new Error('Purchase Bill reference is required');

  const payAmt = Number(amount);
  if (isNaN(payAmt) || payAmt <= 0) {
    throw new Error('Disbursement amount must be greater than zero.');
  }

  // Fetch bill to check balance and status
  const { data: bill, error: billErr } = await supabase
    .from('purchase_bills')
    .select('id, company_id, vendor_id, total_amount, amount_paid, balance_due, status')
    .eq('id', billId)
    .single();

  if (billErr || !bill) throw new Error('Referenced purchase bill not found.');
  if (bill.status === 'draft') {
    throw new Error('Cannot record payments against draft bills. Record the bill first.');
  }
  if (bill.status === 'cancelled') {
    throw new Error('Cannot record payments against cancelled bills.');
  }

  const currentBal = Number(bill.balance_due);
  if (payAmt > currentBal + 0.01) { // 0.01 tolerance for floating point
    throw new Error(
      `Disbursement amount (₹${payAmt.toFixed(2)}) cannot exceed remaining bill balance (₹${currentBal.toFixed(2)}).`
    );
  }

  const paymentPayload = {
    company_id: bill.company_id,
    bill_id: bill.id,
    vendor_id: bill.vendor_id,
    amount: payAmt,
    payment_date: paymentDate || new Date().toISOString().split('T')[0],
    payment_method: paymentMethod || 'bank_transfer',
    reference_number: referenceNumber ? referenceNumber.trim() : null,
    notes: notes ? notes.trim() : null,
    created_by: currentUser?.id || null
  };

  const { data, error } = await supabase
    .from('vendor_payments')
    .insert(paymentPayload)
    .select()
    .single();

  if (error) throw error;
  return data;
}
