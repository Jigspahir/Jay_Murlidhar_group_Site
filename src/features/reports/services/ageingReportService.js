import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — AGEING REPORT SERVICE
 * 
 * Computes Accounts Receivable (AR) and Accounts Payable (AP) ageing
 * schedules based on actual net unpaid balances after accounting for
 * payments, credit notes, debit notes, and allocated advances.
 * 
 * Standard Ageing Buckets:
 * - Current (not yet due)
 * - 1–30 days
 * - 31–60 days
 * - 61–90 days
 * - 91–180 days
 * - 180+ days
 */

export async function getArAgeingReport({ companyId, asOfDate = null } = {}) {
  if (!isSupabaseConfigured || !companyId) {
    return {
      customers: [],
      totals: { current: 0, b1_30: 0, b31_60: 0, b61_90: 0, b91_180: 0, b180_plus: 0, totalOutstanding: 0 }
    };
  }

  const cutOff = asOfDate ? new Date(asOfDate) : new Date();

  // 1. Fetch Invoices with balance due
  const { data: invoices, error: invErr } = await supabase
    .from('invoices')
    .select(`
      id,
      invoice_number,
      invoice_date,
      due_date,
      total_amount,
      amount_paid,
      balance_due,
      status,
      customer:customers(id, display_name, customer_code, phone)
    `)
    .eq('company_id', companyId)
    .gt('balance_due', 0)
    .neq('status', 'draft')
    .neq('status', 'cancelled');

  if (invErr) throw invErr;

  // 2. Aggregate per customer
  const customerMap = {};

  (invoices || []).forEach((inv) => {
    const custId = inv.customer?.id || 'unknown';
    const custName = inv.customer?.display_name || 'Unnamed Customer';
    const custCode = inv.customer?.customer_code || 'CUST-00';

    if (!customerMap[custId]) {
      customerMap[custId] = {
        customerId: custId,
        customerCode: custCode,
        customerName: custName,
        current: 0,
        b1_30: 0,
        b31_60: 0,
        b61_90: 0,
        b91_180: 0,
        b180_plus: 0,
        totalOutstanding: 0,
        invoices: []
      };
    }

    const dueDate = inv.due_date ? new Date(inv.due_date) : new Date(inv.invoice_date);
    const diffTime = cutOff - dueDate;
    const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const bal = Number(inv.balance_due) || 0;

    customerMap[custId].totalOutstanding += bal;

    if (daysOverdue <= 0) {
      customerMap[custId].current += bal;
    } else if (daysOverdue <= 30) {
      customerMap[custId].b1_30 += bal;
    } else if (daysOverdue <= 60) {
      customerMap[custId].b31_60 += bal;
    } else if (daysOverdue <= 90) {
      customerMap[custId].b61_90 += bal;
    } else if (daysOverdue <= 180) {
      customerMap[custId].b91_180 += bal;
    } else {
      customerMap[custId].b180_plus += bal;
    }

    customerMap[custId].invoices.push({
      id: inv.id,
      number: inv.invoice_number,
      date: inv.invoice_date,
      dueDate: inv.due_date,
      daysOverdue: Math.max(0, daysOverdue),
      balanceDue: bal
    });
  });

  const customerList = Object.values(customerMap);

  const totals = customerList.reduce(
    (acc, c) => ({
      current: acc.current + c.current,
      b1_30: acc.b1_30 + c.b1_30,
      b31_60: acc.b31_60 + c.b31_60,
      b61_90: acc.b61_90 + c.b61_90,
      b91_180: acc.b91_180 + c.b91_180,
      b180_plus: acc.b180_plus + c.b180_plus,
      totalOutstanding: acc.totalOutstanding + c.totalOutstanding
    }),
    { current: 0, b1_30: 0, b31_60: 0, b61_90: 0, b91_180: 0, b180_plus: 0, totalOutstanding: 0 }
  );

  return {
    customers: customerList,
    totals: {
      current: Math.round(totals.current * 100) / 100,
      b1_30: Math.round(totals.b1_30 * 100) / 100,
      b31_60: Math.round(totals.b31_60 * 100) / 100,
      b61_90: Math.round(totals.b61_90 * 100) / 100,
      b91_180: Math.round(totals.b91_180 * 100) / 100,
      b180_plus: Math.round(totals.b180_plus * 100) / 100,
      totalOutstanding: Math.round(totals.totalOutstanding * 100) / 100
    }
  };
}

export async function getApAgeingReport({ companyId, asOfDate = null } = {}) {
  if (!isSupabaseConfigured || !companyId) {
    return {
      vendors: [],
      totals: { current: 0, b1_30: 0, b31_60: 0, b61_90: 0, b91_180: 0, b180_plus: 0, totalOutstanding: 0 }
    };
  }

  const cutOff = asOfDate ? new Date(asOfDate) : new Date();

  // Fetch Bills with balance due
  const { data: bills, error: billErr } = await supabase
    .from('purchase_bills')
    .select(`
      id,
      bill_number,
      vendor_bill_number,
      bill_date,
      payment_due_date,
      total_amount,
      amount_paid,
      balance_due,
      status,
      vendor:vendors(id, legal_name, vendor_code, phone)
    `)
    .eq('company_id', companyId)
    .gt('balance_due', 0)
    .neq('status', 'draft')
    .neq('status', 'cancelled');

  if (billErr) throw billErr;

  const vendorMap = {};

  (bills || []).forEach((b) => {
    const venId = b.vendor?.id || 'unknown';
    const venName = b.vendor?.legal_name || 'Unnamed Vendor';
    const venCode = b.vendor?.vendor_code || 'VEN-00';

    if (!vendorMap[venId]) {
      vendorMap[venId] = {
        vendorId: venId,
        vendorCode: venCode,
        vendorName: venName,
        current: 0,
        b1_30: 0,
        b31_60: 0,
        b61_90: 0,
        b91_180: 0,
        b180_plus: 0,
        totalOutstanding: 0,
        bills: []
      };
    }

    const dueDate = b.payment_due_date ? new Date(b.payment_due_date) : new Date(b.bill_date);
    const diffTime = cutOff - dueDate;
    const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const bal = Number(b.balance_due) || 0;

    vendorMap[venId].totalOutstanding += bal;

    if (daysOverdue <= 0) {
      vendorMap[venId].current += bal;
    } else if (daysOverdue <= 30) {
      vendorMap[venId].b1_30 += bal;
    } else if (daysOverdue <= 60) {
      vendorMap[venId].b31_60 += bal;
    } else if (daysOverdue <= 90) {
      vendorMap[venId].b61_90 += bal;
    } else if (daysOverdue <= 180) {
      vendorMap[venId].b91_180 += bal;
    } else {
      vendorMap[venId].b180_plus += bal;
    }

    vendorMap[venId].bills.push({
      id: b.id,
      number: b.bill_number,
      vendorBillNumber: b.vendor_bill_number,
      date: b.bill_date,
      dueDate: b.payment_due_date,
      daysOverdue: Math.max(0, daysOverdue),
      balanceDue: bal
    });
  });

  const vendorList = Object.values(vendorMap);

  const totals = vendorList.reduce(
    (acc, v) => ({
      current: acc.current + v.current,
      b1_30: acc.b1_30 + v.b1_30,
      b31_60: acc.b31_60 + v.b31_60,
      b61_90: acc.b61_90 + v.b61_90,
      b91_180: acc.b91_180 + v.b91_180,
      b180_plus: acc.b180_plus + v.b180_plus,
      totalOutstanding: acc.totalOutstanding + v.totalOutstanding
    }),
    { current: 0, b1_30: 0, b31_60: 0, b61_90: 0, b91_180: 0, b180_plus: 0, totalOutstanding: 0 }
  );

  return {
    vendors: vendorList,
    totals: {
      current: Math.round(totals.current * 100) / 100,
      b1_30: Math.round(totals.b1_30 * 100) / 100,
      b31_60: Math.round(totals.b31_60 * 100) / 100,
      b61_90: Math.round(totals.b61_90 * 100) / 100,
      b91_180: Math.round(totals.b91_180 * 100) / 100,
      b180_plus: Math.round(totals.b180_plus * 100) / 100,
      totalOutstanding: Math.round(totals.totalOutstanding * 100) / 100
    }
  };
}

export async function getARAgeingReportAdapter(arg1, arg2) {
  const params = typeof arg1 === 'object' && arg1 !== null ? arg1 : { companyId: arg1, asOfDate: arg2 };
  const res = await getArAgeingReport(params);
  return {
    ...res,
    customers: (res.customers || []).map(c => ({
      ...c,
      customer_id: c.customerId,
      customer_name: c.customerName,
      '1_30': c.b1_30,
      '31_60': c.b31_60,
      '61_90': c.b61_90,
      '91_180': c.b91_180,
      '180_plus': c.b180_plus,
      total_outstanding: c.totalOutstanding
    })),
    totals: {
      ...res.totals,
      '1_30': res.totals?.b1_30 || 0,
      '31_60': res.totals?.b31_60 || 0,
      '61_90': res.totals?.b61_90 || 0,
      '91_180': res.totals?.b91_180 || 0,
      '180_plus': res.totals?.b180_plus || 0,
      total_outstanding: res.totals?.totalOutstanding || 0
    }
  };
}

export async function getAPAgeingReportAdapter(arg1, arg2) {
  const params = typeof arg1 === 'object' && arg1 !== null ? arg1 : { companyId: arg1, asOfDate: arg2 };
  const res = await getApAgeingReport(params);
  return {
    ...res,
    vendors: (res.vendors || []).map(v => ({
      ...v,
      vendor_id: v.vendorId,
      vendor_name: v.vendorName,
      '1_30': v.b1_30,
      '31_60': v.b31_60,
      '61_90': v.b61_90,
      '91_180': v.b91_180,
      '180_plus': v.b180_plus,
      total_payable: v.totalOutstanding
    })),
    totals: {
      ...res.totals,
      '1_30': res.totals?.b1_30 || 0,
      '31_60': res.totals?.b31_60 || 0,
      '61_90': res.totals?.b61_90 || 0,
      '91_180': res.totals?.b91_180 || 0,
      '180_plus': res.totals?.b180_plus || 0,
      total_payable: res.totals?.totalOutstanding || 0
    }
  };
}

export const ageingReportService = {
  getArAgeingReport,
  getARAgeingReport: getARAgeingReportAdapter,
  getApAgeingReport,
  getAPAgeingReport: getAPAgeingReportAdapter
};

export default ageingReportService;
