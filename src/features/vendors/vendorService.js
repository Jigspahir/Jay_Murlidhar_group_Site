import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — VENDOR MASTER SERVICE
 * 
 * Production data layer for Vendors, Suppliers, and Statement of Accounts.
 * Enforces single-company ownership and PostgreSQL RLS.
 */

export const VENDOR_TYPES = Object.freeze([
  { value: 'distributor', label: 'Distributor / Wholesaler' },
  { value: 'service_provider', label: 'Service Provider' },
  { value: 'contractor', label: 'Contractor / Specialist' },
  { value: 'landlord', label: 'Premises Landlord' },
  { value: 'utility', label: 'Utility Board / ISP' },
  { value: 'government', label: 'Government / Regulatory' },
  { value: 'other', label: 'Other Vendor' }
]);

export const VENDOR_STATUSES = Object.freeze([
  { value: 'active', label: 'Active', color: 'emerald' },
  { value: 'inactive', label: 'Inactive', color: 'slate' },
  { value: 'blacklisted', label: 'Blacklisted', color: 'rose' }
]);

export const INDIAN_STATES = Object.freeze([
  'Gujarat', 'Maharashtra', 'Rajasthan', 'Madhya Pradesh', 'Delhi',
  'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Haryana',
  'Punjab', 'Telangana', 'Andhra Pradesh', 'Kerala', 'Bihar', 'Other'
]);

/**
 * Validation regex patterns
 */
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export function isValidGSTIN(gstin) {
  if (!gstin || !gstin.trim()) return true; // Optional field
  return GSTIN_REGEX.test(gstin.trim().toUpperCase());
}

export function isValidPAN(pan) {
  if (!pan || !pan.trim()) return true; // Optional field
  return PAN_REGEX.test(pan.trim().toUpperCase());
}

/**
 * Fetch vendors list with company scoping, filtering, and pagination
 */
export async function getVendors({
  companyId = null,
  isAllCompanies = false,
  vendorType = 'all',
  status = 'all',
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
      .from('vendors')
      .select(`
        id,
        vendor_code,
        company_id,
        vendor_type,
        legal_name,
        trade_name,
        contact_person,
        email,
        phone,
        alternate_phone,
        gstin,
        pan,
        msme_registration_no,
        billing_address,
        billing_city,
        billing_state,
        billing_postal_code,
        payment_terms_days,
        bank_name,
        bank_account_no,
        bank_ifsc,
        bank_branch,
        upi_id,
        status,
        notes,
        created_at,
        created_by,
        companies:company_id (
          id,
          name,
          slug
        )
      `, { count: 'exact' });

    if (!isAllCompanies && companyId) {
      query = query.eq('company_id', companyId);
    }

    if (vendorType && vendorType !== 'all') {
      query = query.eq('vendor_type', vendorType);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`vendor_code.ilike.${term},legal_name.ilike.${term},trade_name.ilike.${term},phone.ilike.${term},gstin.ilike.${term}`);
    }

    query = query
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
    console.error('getVendors Error:', err);
    throw err;
  }
}

/**
 * Fetch a single vendor by ID
 */
export async function getVendorById(id) {
  if (!isSupabaseConfigured || !id) return null;

  try {
    const { data, error } = await supabase
      .from('vendors')
      .select(`
        *,
        companies:company_id (
          id,
          name,
          slug,
          legal_name,
          gstin
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('getVendorById Error:', err);
    throw err;
  }
}

/**
 * Fetch active vendors for a specific company (for dropdown selection)
 */
export async function getCompanyVendors(companyId) {
  if (!isSupabaseConfigured || !companyId) return [];

  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('id, vendor_code, legal_name, trade_name, phone, gstin, payment_terms_days, billing_state, status')
      .eq('company_id', companyId)
      .eq('status', 'active')
      .order('legal_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('getCompanyVendors Error:', err);
    return [];
  }
}

/**
 * Create a new vendor record
 */
export async function createVendor(vendorData, currentUser = null) {
  if (!isSupabaseConfigured) throw new Error('Database connection not configured');

  if (!vendorData.company_id) {
    throw new Error('Company association is required.');
  }
  if (!vendorData.legal_name || !vendorData.legal_name.trim()) {
    throw new Error('Vendor legal name is required.');
  }
  if (!vendorData.phone || !vendorData.phone.trim()) {
    throw new Error('Primary contact phone is required.');
  }
  if (!vendorData.billing_address || !vendorData.billing_address.trim()) {
    throw new Error('Billing address is required.');
  }
  if (vendorData.gstin && !isValidGSTIN(vendorData.gstin)) {
    throw new Error('Invalid Indian GSTIN format (15 alphanumeric characters).');
  }
  if (vendorData.pan && !isValidPAN(vendorData.pan)) {
    throw new Error('Invalid Indian PAN format (10 alphanumeric characters).');
  }

  const payload = {
    company_id: vendorData.company_id,
    vendor_type: vendorData.vendor_type || 'distributor',
    legal_name: vendorData.legal_name.trim(),
    trade_name: vendorData.trade_name ? vendorData.trade_name.trim() : null,
    contact_person: vendorData.contact_person ? vendorData.contact_person.trim() : null,
    email: vendorData.email ? vendorData.email.trim() : null,
    phone: vendorData.phone.trim(),
    alternate_phone: vendorData.alternate_phone ? vendorData.alternate_phone.trim() : null,
    gstin: vendorData.gstin ? vendorData.gstin.trim().toUpperCase() : null,
    pan: vendorData.pan ? vendorData.pan.trim().toUpperCase() : null,
    msme_registration_no: vendorData.msme_registration_no ? vendorData.msme_registration_no.trim() : null,
    billing_address: vendorData.billing_address.trim(),
    billing_city: vendorData.billing_city ? vendorData.billing_city.trim() : 'Ahmedabad',
    billing_state: vendorData.billing_state || 'Gujarat',
    billing_postal_code: vendorData.billing_postal_code ? vendorData.billing_postal_code.trim() : '380001',
    payment_terms_days: Math.max(0, parseInt(vendorData.payment_terms_days, 10) || 15),
    bank_name: vendorData.bank_name ? vendorData.bank_name.trim() : null,
    bank_account_no: vendorData.bank_account_no ? vendorData.bank_account_no.trim() : null,
    bank_ifsc: vendorData.bank_ifsc ? vendorData.bank_ifsc.trim().toUpperCase() : null,
    bank_branch: vendorData.bank_branch ? vendorData.bank_branch.trim() : null,
    upi_id: vendorData.upi_id ? vendorData.upi_id.trim() : null,
    status: vendorData.status || 'active',
    notes: vendorData.notes ? vendorData.notes.trim() : null,
    created_by: currentUser?.id || null
  };

  const { data, error } = await supabase
    .from('vendors')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing vendor record
 */
export async function updateVendor(id, vendorData, currentUser = null) {
  if (!isSupabaseConfigured || !id) throw new Error('Vendor ID is required');

  if (vendorData.gstin && !isValidGSTIN(vendorData.gstin)) {
    throw new Error('Invalid Indian GSTIN format (15 alphanumeric characters).');
  }
  if (vendorData.pan && !isValidPAN(vendorData.pan)) {
    throw new Error('Invalid Indian PAN format (10 alphanumeric characters).');
  }

  const payload = {
    vendor_type: vendorData.vendor_type,
    legal_name: vendorData.legal_name?.trim(),
    trade_name: vendorData.trade_name ? vendorData.trade_name.trim() : null,
    contact_person: vendorData.contact_person ? vendorData.contact_person.trim() : null,
    email: vendorData.email ? vendorData.email.trim() : null,
    phone: vendorData.phone?.trim(),
    alternate_phone: vendorData.alternate_phone ? vendorData.alternate_phone.trim() : null,
    gstin: vendorData.gstin ? vendorData.gstin.trim().toUpperCase() : null,
    pan: vendorData.pan ? vendorData.pan.trim().toUpperCase() : null,
    msme_registration_no: vendorData.msme_registration_no ? vendorData.msme_registration_no.trim() : null,
    billing_address: vendorData.billing_address?.trim(),
    billing_city: vendorData.billing_city ? vendorData.billing_city.trim() : null,
    billing_state: vendorData.billing_state,
    billing_postal_code: vendorData.billing_postal_code ? vendorData.billing_postal_code.trim() : null,
    payment_terms_days: Math.max(0, parseInt(vendorData.payment_terms_days, 10) || 15),
    bank_name: vendorData.bank_name ? vendorData.bank_name.trim() : null,
    bank_account_no: vendorData.bank_account_no ? vendorData.bank_account_no.trim() : null,
    bank_ifsc: vendorData.bank_ifsc ? vendorData.bank_ifsc.trim().toUpperCase() : null,
    bank_branch: vendorData.bank_branch ? vendorData.bank_branch.trim() : null,
    upi_id: vendorData.upi_id ? vendorData.upi_id.trim() : null,
    status: vendorData.status,
    notes: vendorData.notes ? vendorData.notes.trim() : null,
    updated_by: currentUser?.id || null
  };

  const { data, error } = await supabase
    .from('vendors')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a vendor (Super Admin only)
 */
export async function deleteVendor(id) {
  if (!isSupabaseConfigured || !id) throw new Error('Vendor ID is required');

  const { error } = await supabase
    .from('vendors')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

/**
 * Group Owner convenience: Clone / provision a vendor to another company
 */
export async function copyVendorToCompany(vendorId, targetCompanyId, currentUser = null) {
  if (!isSupabaseConfigured || !vendorId || !targetCompanyId) {
    throw new Error('Source vendor ID and target company ID are required.');
  }

  const sourceVendor = await getVendorById(vendorId);
  if (!sourceVendor) throw new Error('Source vendor record not found.');

  const clonePayload = {
    ...sourceVendor,
    id: undefined,
    vendor_code: undefined,
    company_id: targetCompanyId,
    created_at: undefined,
    updated_at: undefined,
    created_by: currentUser?.id || null,
    updated_by: null
  };

  return createVendor(clonePayload, currentUser);
}

/**
 * Calculate Vendor Statement of Account
 * Shows opening balance, bills (credit to vendor / liability increase), payments (debit to vendor / liability decrease), and running balance.
 */
export async function getVendorStatement({ vendorId, dateFrom = null, dateTo = null }) {
  if (!isSupabaseConfigured || !vendorId) {
    return {
      vendor: null,
      openingBalance: 0,
      totalBilled: 0,
      totalPaid: 0,
      closingBalance: 0,
      transactions: []
    };
  }

  try {
    const vendor = await getVendorById(vendorId);
    if (!vendor) throw new Error('Vendor not found');

    // 1. Fetch all recorded bills for this vendor (excluding draft and cancelled)
    let billsQuery = supabase
      .from('purchase_bills')
      .select('id, bill_number, vendor_invoice_number, bill_date, total_amount, amount_paid, balance_due, status')
      .eq('vendor_id', vendorId)
      .eq('status', 'recorded');

    // 2. Fetch all payments for this vendor
    let payQuery = supabase
      .from('vendor_payments')
      .select('id, payment_number, bill_id, payment_date, amount, payment_method, reference_number')
      .eq('vendor_id', vendorId);

    const [{ data: allBills, error: bErr }, { data: allPayments, error: pErr }] =
      await Promise.all([billsQuery, payQuery]);

    if (bErr) throw bErr;
    if (pErr) throw pErr;

    // Calculate opening balance before dateFrom (if dateFrom provided)
    let openingBalance = 0;

    const priorBills = (allBills || []).filter((b) => dateFrom && b.bill_date < dateFrom);
    const priorPayments = (allPayments || []).filter((p) => dateFrom && p.payment_date < dateFrom);

    const priorBilledTotal = priorBills.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
    const priorPaidTotal = priorPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    openingBalance = Number((priorBilledTotal - priorPaidTotal).toFixed(2));

    // Filter transactions within range
    const periodBills = (allBills || []).filter((b) => {
      if (dateFrom && b.bill_date < dateFrom) return false;
      if (dateTo && b.bill_date > dateTo) return false;
      return true;
    });

    const periodPayments = (allPayments || []).filter((p) => {
      if (dateFrom && p.payment_date < dateFrom) return false;
      if (dateTo && p.payment_date > dateTo) return false;
      return true;
    });

    // Merge & sort chronological transaction stream
    const transactions = [];

    periodBills.forEach((bill) => {
      transactions.push({
        date: bill.bill_date,
        type: 'bill',
        reference: bill.bill_number,
        details: `Vendor Inv #${bill.vendor_invoice_number}`,
        billAmount: Number(bill.total_amount),
        paymentAmount: 0,
        status: bill.status
      });
    });

    periodPayments.forEach((pay) => {
      transactions.push({
        date: pay.payment_date,
        type: 'payment',
        reference: pay.payment_number,
        details: `${pay.payment_method?.toUpperCase()} Ref: ${pay.reference_number || 'N/A'}`,
        billAmount: 0,
        paymentAmount: Number(pay.amount),
        status: 'settled'
      });
    });

    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate running balance: Running = Opening + Billed - Paid
    let running = openingBalance;
    let periodBilledTotal = 0;
    let periodPaidTotal = 0;

    const stream = transactions.map((tx) => {
      periodBilledTotal += tx.billAmount;
      periodPaidTotal += tx.paymentAmount;
      running += (tx.billAmount - tx.paymentAmount);
      return {
        ...tx,
        runningBalance: Number(running.toFixed(2))
      };
    });

    const closingBalance = Number(running.toFixed(2));

    return {
      vendor,
      openingBalance,
      totalBilled: Number(periodBilledTotal.toFixed(2)),
      totalPaid: Number(periodPaidTotal.toFixed(2)),
      closingBalance,
      transactions: stream
    };
  } catch (err) {
    console.error('getVendorStatement Error:', err);
    throw err;
  }
}

export async function setVendorStatus(id, status, currentUser = null) {
  return updateVendor(id, { status }, currentUser);
}

export const cloneVendorToCompany = copyVendorToCompany;

export async function calculateVendorBalance(vendorId) {
  const statement = await getVendorStatement({ vendorId });
  return statement.closingBalance;
}

export const vendorService = {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  setVendorStatus,
  cloneVendorToCompany,
  getVendorStatement,
  calculateVendorBalance
};

export default vendorService;

