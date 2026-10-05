import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — ACCOUNTS PAYABLE & PROCUREMENT ANALYTICS SERVICE
 * 
 * Computes authoritative payables metrics directly from PostgreSQL records:
 * - Total Outstanding Payables
 * - Overdue Payables
 * - Bills Approaching Due Date
 * - Pending PO Approvals
 * - Outstanding Purchase Order Commitments
 * - Total Disbursed Payments
 * - Payables Aging Buckets (Current, 1-15, 16-30, 30+ days)
 * - Reports: Aging, Purchase Register, PO Register, Disbursement Ledger
 */

export async function getPayablesDashboardSummary({
  companyId = null,
  isAllCompanies = false,
  dateFrom = null,
  dateTo = null
} = {}) {
  if (!isSupabaseConfigured) {
    return {
      totalPayables: 0,
      overduePayables: 0,
      dueThisWeek: 0,
      partiallyPaidBills: 0,
      pendingPOApprovals: 0,
      totalPOCommitment: 0,
      totalDisbursed: 0,
      purchaseTaxCaptured: 0,
      billCount: 0,
      poCount: 0,
      disbursementCount: 0,
      agingBuckets: {
        current: { count: 0, amount: 0 },
        days1_15: { count: 0, amount: 0 },
        days16_30: { count: 0, amount: 0 },
        days30_plus: { count: 0, amount: 0 }
      }
    };
  }

  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const next7DaysStr = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    // 1. Fetch Purchase Bills
    let billsQuery = supabase
      .from('purchase_bills')
      .select('id, total_amount, amount_paid, balance_due, status, payment_status, due_date, bill_date, total_tax_amount');

    if (!isAllCompanies && companyId) {
      billsQuery = billsQuery.eq('company_id', companyId);
    }
    if (dateFrom) billsQuery = billsQuery.gte('bill_date', dateFrom);
    if (dateTo) billsQuery = billsQuery.lte('bill_date', dateTo);

    const { data: bills, error: bErr } = await billsQuery;
    if (bErr) throw bErr;

    // 2. Fetch Purchase Orders
    let poQuery = supabase
      .from('purchase_orders')
      .select('id, total_amount, billed_amount, status, approval_status, po_date');

    if (!isAllCompanies && companyId) {
      poQuery = poQuery.eq('company_id', companyId);
    }
    if (dateFrom) poQuery = poQuery.gte('po_date', dateFrom);
    if (dateTo) poQuery = poQuery.lte('po_date', dateTo);

    const { data: pos, error: poErr } = await poQuery;
    if (poErr) throw poErr;

    // 3. Fetch Vendor Payments
    let vpayQuery = supabase
      .from('vendor_payments')
      .select('id, amount, payment_date');

    if (!isAllCompanies && companyId) {
      vpayQuery = vpayQuery.eq('company_id', companyId);
    }
    if (dateFrom) vpayQuery = vpayQuery.gte('payment_date', dateFrom);
    if (dateTo) vpayQuery = vpayQuery.lte('payment_date', dateTo);

    const { data: payments, error: pErr } = await vpayQuery;
    if (pErr) throw pErr;

    // Aggregations
    let totalPayables = 0;
    let overduePayables = 0;
    let dueThisWeek = 0;
    let partiallyPaidBills = 0;
    let purchaseTaxCaptured = 0;

    const agingBuckets = {
      current: { label: 'Current (Not Due)', count: 0, amount: 0 },
      days1_15: { label: '1 – 15 Days Overdue', count: 0, amount: 0 },
      days16_30: { label: '16 – 30 Days Overdue', count: 0, amount: 0 },
      days30_plus: { label: '30+ Days Overdue', count: 0, amount: 0 }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    (bills || []).forEach((b) => {
      const bal = Number(b.balance_due) || 0;
      const tax = Number(b.total_tax_amount) || 0;

      // Only recorded bills contribute to Accounts Payable and tax capture
      if (b.status === 'recorded') {
        purchaseTaxCaptured += tax;

        if (bal > 0) {
          totalPayables += bal;

          const dueDate = new Date(b.due_date);
          dueDate.setHours(0, 0, 0, 0);
          const diffTime = today - dueDate;
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays <= 0) {
            agingBuckets.current.count += 1;
            agingBuckets.current.amount += bal;

            // Check if due in next 7 days
            if (b.due_date >= todayStr && b.due_date <= next7DaysStr) {
              dueThisWeek += bal;
            }
          } else {
            overduePayables += bal;
            if (diffDays <= 15) {
              agingBuckets.days1_15.count += 1;
              agingBuckets.days1_15.amount += bal;
            } else if (diffDays <= 30) {
              agingBuckets.days16_30.count += 1;
              agingBuckets.days16_30.amount += bal;
            } else {
              agingBuckets.days30_plus.count += 1;
              agingBuckets.days30_plus.amount += bal;
            }
          }

          if (b.payment_status === 'partially_paid') {
            partiallyPaidBills += 1;
          }
        }
      }
    });

    let pendingPOApprovals = 0;
    let totalPOCommitment = 0;

    (pos || []).forEach((po) => {
      if (po.approval_status === 'submitted' || po.approval_status === 'pending_approval') {
        pendingPOApprovals += 1;
      }
      if (['approved', 'issued', 'partially_billed'].includes(po.status)) {
        const comm = Math.max(0, (Number(po.total_amount) || 0) - (Number(po.billed_amount) || 0));
        totalPOCommitment += comm;
      }
    });

    const totalDisbursed = (payments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return {
      totalPayables: Number(totalPayables.toFixed(2)),
      overduePayables: Number(overduePayables.toFixed(2)),
      dueThisWeek: Number(dueThisWeek.toFixed(2)),
      partiallyPaidBills,
      pendingPOApprovals,
      totalPOCommitment: Number(totalPOCommitment.toFixed(2)),
      totalDisbursed: Number(totalDisbursed.toFixed(2)),
      purchaseTaxCaptured: Number(purchaseTaxCaptured.toFixed(2)),
      billCount: bills?.length || 0,
      poCount: pos?.length || 0,
      disbursementCount: payments?.length || 0,
      agingBuckets
    };
  } catch (err) {
    console.error('getPayablesDashboardSummary Error:', err);
    throw err;
  }
}

/**
 * REPORT 1: Vendor Payables Aging Report
 */
export async function getPayablesAgingReport({
  companyId = null,
  isAllCompanies = false
} = {}) {
  let query = supabase
    .from('purchase_bills')
    .select(`
      id,
      bill_number,
      vendor_invoice_number,
      bill_date,
      due_date,
      total_amount,
      amount_paid,
      balance_due,
      status,
      payment_status,
      companies:company_id ( name ),
      vendors:vendor_id ( legal_name, vendor_code, phone )
    `)
    .eq('status', 'recorded')
    .gt('balance_due', 0);

  if (!isAllCompanies && companyId) {
    query = query.eq('company_id', companyId);
  }

  const { data, error } = await query;
  if (error) throw error;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rows = (data || []).map((b) => {
    const dueDate = new Date(b.due_date);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = today - dueDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let bucket = 'Current';
    if (diffDays > 30) bucket = '30+ Days';
    else if (diffDays > 15) bucket = '16 – 30 Days';
    else if (diffDays > 0) bucket = '1 – 15 Days';

    return {
      ...b,
      daysOverdue: Math.max(0, diffDays),
      agingBucket: bucket
    };
  });

  return rows;
}

/**
 * REPORT 2: Purchase Register (GSTR-2B Audit Readiness)
 */
export async function getPurchaseRegisterReport({
  companyId = null,
  isAllCompanies = false,
  dateFrom = null,
  dateTo = null
} = {}) {
  let query = supabase
    .from('purchase_bills')
    .select(`
      id,
      bill_number,
      vendor_invoice_number,
      bill_date,
      due_date,
      taxable_amount,
      cgst_amount,
      sgst_amount,
      igst_amount,
      total_tax_amount,
      total_amount,
      amount_paid,
      balance_due,
      payment_status,
      is_interstate,
      companies:company_id ( name ),
      vendors:vendor_id ( legal_name, vendor_code, gstin )
    `)
    .eq('status', 'recorded');

  if (!isAllCompanies && companyId) query = query.eq('company_id', companyId);
  if (dateFrom) query = query.gte('bill_date', dateFrom);
  if (dateTo) query = query.lte('bill_date', dateTo);

  query = query.order('bill_date', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * REPORT 4: Purchase Order Register (Commitment Audit)
 */
export async function getPORegisterReport({
  companyId = null,
  isAllCompanies = false,
  dateFrom = null,
  dateTo = null
} = {}) {
  let query = supabase
    .from('purchase_orders')
    .select(`
      id,
      po_number,
      po_date,
      expected_delivery_date,
      total_amount,
      billed_amount,
      status,
      approval_status,
      companies:company_id ( name ),
      vendors:vendor_id ( legal_name, vendor_code )
    `);

  if (!isAllCompanies && companyId) query = query.eq('company_id', companyId);
  if (dateFrom) query = query.gte('po_date', dateFrom);
  if (dateTo) query = query.lte('po_date', dateTo);

  query = query.order('po_date', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((po) => ({
    ...po,
    outstandingCommitment: Math.max(0, (Number(po.total_amount) || 0) - (Number(po.billed_amount) || 0))
  }));
}

/**
 * REPORT 5: Vendor Payment Ledger (Disbursements Outflow)
 */
export async function getVendorPaymentLedgerReport({
  companyId = null,
  isAllCompanies = false,
  dateFrom = null,
  dateTo = null
} = {}) {
  let query = supabase
    .from('vendor_payments')
    .select(`
      id,
      payment_number,
      payment_date,
      amount,
      payment_method,
      reference_number,
      notes,
      companies:company_id ( name ),
      vendors:vendor_id ( legal_name, vendor_code ),
      purchase_bills:bill_id ( bill_number, vendor_invoice_number )
    `);

  if (!isAllCompanies && companyId) query = query.eq('company_id', companyId);
  if (dateFrom) query = query.gte('payment_date', dateFrom);
  if (dateTo) query = query.lte('payment_date', dateTo);

  query = query.order('payment_date', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getPayablesSummary(arg) {
  const companyId = typeof arg === 'object' && arg !== null ? arg.companyId : arg;
  return getPayablesDashboardSummary({ companyId });
}

export async function getPayablesAging(arg) {
  const companyId = typeof arg === 'object' && arg !== null ? arg.companyId : arg;
  return getPayablesAgingReport({ companyId });
}

export const getPurchaseRegister = getPurchaseRegisterReport;
export const getPurchaseOrderRegister = getPORegisterReport;
export const getDisbursementLedger = getVendorPaymentLedgerReport;

export const payablesService = {
  getPayablesSummary,
  getPayablesDashboardSummary,
  getPayablesAging,
  getPayablesAgingReport,
  getPurchaseRegister,
  getPurchaseRegisterReport,
  getPurchaseOrderRegister,
  getPORegisterReport,
  getDisbursementLedger,
  getVendorPaymentLedgerReport
};

export default payablesService;

