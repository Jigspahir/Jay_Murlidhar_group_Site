import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — OPERATING EXPENSE SERVICE
 * 
 * Production data layer for Corporate Disbursements & Company Scoping.
 * Controlled Categories, No Vendor Master (Uses Payee Name).
 */

export const EXPENSE_CATEGORIES = Object.freeze([
  'Rent & Premises',
  'Electricity & Utilities',
  'Staff Salaries & Honorarium',
  'Hardware & Mobility Inventory',
  'Server, Cloud Hosting & Domains',
  'Vehicle Maintenance & Transport',
  'Stationery, Printing & Consumables',
  'Statutory & Compliance Fees',
  'Marketing & Advertising',
  'Miscellaneous Office Expenses'
]);

export const EXPENSE_STATUSES = Object.freeze([
  { value: 'paid', label: 'Paid / Settled', color: 'emerald' },
  { value: 'recorded', label: 'Recorded (Unpaid Bill)', color: 'amber' },
  { value: 'draft', label: 'Draft', color: 'slate' },
  { value: 'cancelled', label: 'Cancelled', color: 'gray' }
]);

export const EXPENSE_PAYMENT_METHODS = Object.freeze([
  { value: 'bank_transfer', label: 'Bank Transfer (NEFT/RTGS/IMPS)' },
  { value: 'upi', label: 'UPI / QR' },
  { value: 'cash', label: 'Cash Voucher' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'card', label: 'Corporate Card' },
  { value: 'other', label: 'Other' }
]);

/**
 * Fetch expenses list with company scoping, filtering, and pagination
 */
export async function getExpenses({
  companyId = null,
  isAllCompanies = false,
  category = 'all',
  status = 'all',
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
      .from('expenses')
      .select(`
        id,
        expense_number,
        company_id,
        vendor_id,
        category,
        payee_name,
        amount,
        tax_amount,
        total_amount,
        expense_date,
        payment_method,
        reference_number,
        description,
        status,
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
          legal_name
        )
      `, { count: 'exact' });

    if (!isAllCompanies && companyId) {
      query = query.eq('company_id', companyId);
    }

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (paymentMethod && paymentMethod !== 'all') {
      query = query.eq('payment_method', paymentMethod);
    }

    if (dateFrom) {
      query = query.gte('expense_date', dateFrom);
    }

    if (dateTo) {
      query = query.lte('expense_date', dateTo);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`expense_number.ilike.${term},payee_name.ilike.${term},reference_number.ilike.${term}`);
    }

    query = query
      .order('expense_date', { ascending: false })
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
    console.error('getExpenses Error:', err);
    throw err;
  }
}

/**
 * Fetch a single expense record by ID
 */
export async function getExpenseById(id) {
  if (!isSupabaseConfigured || !id) return null;

  try {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        companies:company_id (
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('getExpenseById Error:', err);
    throw err;
  }
}

/**
 * Create a new operating expense voucher
 */
export async function createExpense({
  companyId,
  vendorId = null,
  category,
  payeeName,
  amount,
  taxAmount = 0,
  expenseDate,
  paymentMethod = 'bank_transfer',
  referenceNumber = '',
  description = '',
  status = 'paid',
  currentUser = null
}) {
  if (!isSupabaseConfigured) throw new Error('Database connection not configured');
  if (!companyId) throw new Error('Company selection is mandatory');
  if (!category) throw new Error('Category selection is mandatory');
  if (!payeeName || !payeeName.trim()) throw new Error('Payee name is mandatory');

  const baseAmt = Number(amount);
  const taxAmt = Number(taxAmount) || 0;

  if (isNaN(baseAmt) || baseAmt <= 0) {
    throw new Error('Expense amount must be greater than zero.');
  }
  if (taxAmt < 0) {
    throw new Error('Tax amount cannot be negative.');
  }

  const totalAmount = Number((baseAmt + taxAmt).toFixed(2));

  const payload = {
    company_id: companyId,
    vendor_id: vendorId || null,
    category,
    payee_name: payeeName.trim(),
    amount: baseAmt,
    tax_amount: taxAmt,
    total_amount: totalAmount,
    expense_date: expenseDate || new Date().toISOString().split('T')[0],
    payment_method: paymentMethod,
    reference_number: referenceNumber ? referenceNumber.trim() : null,
    description: description ? description.trim() : null,
    status,
    created_by: currentUser?.id || null
  };

  const { data, error } = await supabase
    .from('expenses')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing expense voucher
 */
export async function updateExpense(id, {
  companyId,
  vendorId = null,
  category,
  payeeName,
  amount,
  taxAmount = 0,
  expenseDate,
  paymentMethod = 'bank_transfer',
  referenceNumber = '',
  description = '',
  status = 'paid',
  currentUser = null
}) {
  if (!isSupabaseConfigured) throw new Error('Database connection not configured');
  if (!id) throw new Error('Expense ID is mandatory');

  const baseAmt = Number(amount);
  const taxAmt = Number(taxAmount) || 0;

  if (isNaN(baseAmt) || baseAmt <= 0) {
    throw new Error('Expense amount must be greater than zero.');
  }
  if (taxAmt < 0) {
    throw new Error('Tax amount cannot be negative.');
  }

  const totalAmount = Number((baseAmt + taxAmt).toFixed(2));

  const payload = {
    company_id: companyId,
    vendor_id: vendorId || null,
    category,
    payee_name: payeeName.trim(),
    amount: baseAmt,
    tax_amount: taxAmt,
    total_amount: totalAmount,
    expense_date: expenseDate,
    payment_method: paymentMethod,
    reference_number: referenceNumber ? referenceNumber.trim() : null,
    description: description ? description.trim() : null,
    status,
    updated_by: currentUser?.id || null
  };

  const { data, error } = await supabase
    .from('expenses')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Cancel an expense record
 */
export async function cancelExpense(id) {
  if (!isSupabaseConfigured) throw new Error('Database connection not configured');

  const { data, error } = await supabase
    .from('expenses')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
