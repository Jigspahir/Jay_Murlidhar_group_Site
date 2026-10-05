import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — CONSOLIDATED & COMPANY FINANCE SERVICE
 * 
 * Computes authoritative financial metrics directly from PostgreSQL records:
 * - Gross Invoiced Revenue
 * - Total Collected Cash
 * - Outstanding Receivables
 * - Overdue Receivables
 * - Operating Expenses
 * - Net Operating Position (Cash Collected - Cash Paid)
 * - Invoice Status Breakdown
 * - Financial Reports Datasets
 */

/**
 * Fetch executive finance dashboard summary metrics
 */
export async function getFinanceDashboardSummary({
  companyId = null,
  isAllCompanies = false,
  dateFrom = null,
  dateTo = null
} = {}) {
  if (!isSupabaseConfigured) {
    return {
      grossInvoicedRevenue: 0,
      totalCollected: 0,
      outstandingReceivables: 0,
      overdueReceivables: 0,
      totalExpenses: 0,
      netOperatingPosition: 0,
      statusCounts: {
        draft: 0,
        issued: 0,
        partially_paid: 0,
        paid: 0,
        overdue: 0,
        cancelled: 0
      },
      invoiceCount: 0,
      paymentCount: 0,
      expenseCount: 0
    };
  }

  try {
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Invoices Query
    let invQuery = supabase
      .from('invoices')
      .select('id, total_amount, amount_paid, balance_due, status, due_date, invoice_date');

    if (!isAllCompanies && companyId) {
      invQuery = invQuery.eq('company_id', companyId);
    }
    if (dateFrom) {
      invQuery = invQuery.gte('invoice_date', dateFrom);
    }
    if (dateTo) {
      invQuery = invQuery.lte('invoice_date', dateTo);
    }

    const { data: invoices, error: invErr } = await invQuery;
    if (invErr) throw invErr;

    // 2. Payments Query
    let payQuery = supabase
      .from('payments')
      .select('id, amount, payment_date');

    if (!isAllCompanies && companyId) {
      payQuery = payQuery.eq('company_id', companyId);
    }
    if (dateFrom) {
      payQuery = payQuery.gte('payment_date', dateFrom);
    }
    if (dateTo) {
      payQuery = payQuery.lte('payment_date', dateTo);
    }

    const { data: payments, error: payErr } = await payQuery;
    if (payErr) throw payErr;

    // 3. Expenses Query (Paid expenses represent actual cash disbursements)
    let expQuery = supabase
      .from('expenses')
      .select('id, total_amount, status, expense_date');

    if (!isAllCompanies && companyId) {
      expQuery = expQuery.eq('company_id', companyId);
    }
    if (dateFrom) {
      expQuery = expQuery.gte('expense_date', dateFrom);
    }
    if (dateTo) {
      expQuery = expQuery.lte('expense_date', dateTo);
    }

    const { data: expenses, error: expErr } = await expQuery;
    if (expErr) throw expErr;

    // Aggregations
    let grossInvoicedRevenue = 0;
    let outstandingReceivables = 0;
    let overdueReceivables = 0;

    const statusCounts = {
      draft: 0,
      issued: 0,
      partially_paid: 0,
      paid: 0,
      overdue: 0,
      cancelled: 0
    };

    (invoices || []).forEach((inv) => {
      const tot = Number(inv.total_amount) || 0;
      const bal = Number(inv.balance_due) || 0;
      const isPastDue = inv.due_date < todayStr && bal > 0;

      if (inv.status !== 'cancelled') {
        grossInvoicedRevenue += tot;

        if (inv.status !== 'paid') {
          outstandingReceivables += bal;
          if (isPastDue) {
            overdueReceivables += bal;
          }
        }
      }

      if (isPastDue && inv.status === 'issued') {
        statusCounts.overdue = (statusCounts.overdue || 0) + 1;
      } else if (statusCounts[inv.status] !== undefined) {
        statusCounts[inv.status] += 1;
      }
    });

    const totalCollected = (payments || []).reduce(
      (sum, p) => sum + (Number(p.amount) || 0),
      0
    );

    const totalExpenses = (expenses || [])
      .filter((e) => e.status === 'paid')
      .reduce((sum, e) => sum + (Number(e.total_amount) || 0), 0);

    const netOperatingPosition = totalCollected - totalExpenses;

    return {
      grossInvoicedRevenue: Number(grossInvoicedRevenue.toFixed(2)),
      totalCollected: Number(totalCollected.toFixed(2)),
      outstandingReceivables: Number(outstandingReceivables.toFixed(2)),
      overdueReceivables: Number(overdueReceivables.toFixed(2)),
      totalExpenses: Number(totalExpenses.toFixed(2)),
      netOperatingPosition: Number(netOperatingPosition.toFixed(2)),
      statusCounts,
      invoiceCount: invoices?.length || 0,
      paymentCount: payments?.length || 0,
      expenseCount: expenses?.length || 0
    };
  } catch (err) {
    console.error('getFinanceDashboardSummary Error:', err);
    throw err;
  }
}

/**
 * REPORT 1: Invoice Register Dataset
 */
export async function getInvoiceRegisterReport({
  companyId = null,
  isAllCompanies = false,
  dateFrom = null,
  dateTo = null
} = {}) {
  let query = supabase
    .from('invoices')
    .select(`
      invoice_number,
      customer_name,
      company_name,
      invoice_date,
      due_date,
      taxable_amount,
      cgst_amount,
      sgst_amount,
      igst_amount,
      total_tax_amount,
      total_amount,
      amount_paid,
      balance_due,
      status,
      is_tax_invoice
    `);

  if (!isAllCompanies && companyId) {
    query = query.eq('company_id', companyId);
  }
  if (dateFrom) query = query.gte('invoice_date', dateFrom);
  if (dateTo) query = query.lte('invoice_date', dateTo);

  query = query.order('invoice_date', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * REPORT 2: Accounts Receivable Aging Dataset
 * Buckets: Current (not overdue), 1-15 days, 16-30 days, 30+ days
 */
export async function getReceivablesAgingReport({
  companyId = null,
  isAllCompanies = false
} = {}) {
  let query = supabase
    .from('invoices')
    .select(`
      id,
      invoice_number,
      customer_name,
      company_name,
      due_date,
      total_amount,
      amount_paid,
      balance_due,
      status
    `)
    .neq('status', 'paid')
    .neq('status', 'cancelled')
    .gt('balance_due', 0);

  if (!isAllCompanies && companyId) {
    query = query.eq('company_id', companyId);
  }

  const { data, error } = await query;
  if (error) throw error;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets = {
    current: { label: 'Current (Not Overdue)', count: 0, amount: 0, items: [] },
    days1_15: { label: '1 – 15 Days Overdue', count: 0, amount: 0, items: [] },
    days16_30: { label: '16 – 30 Days Overdue', count: 0, amount: 0, items: [] },
    days30_plus: { label: '30+ Days Overdue', count: 0, amount: 0, items: [] }
  };

  (data || []).forEach((inv) => {
    const dueDate = new Date(inv.due_date);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = today - dueDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const bal = Number(inv.balance_due) || 0;

    if (diffDays <= 0) {
      buckets.current.count += 1;
      buckets.current.amount += bal;
      buckets.current.items.push({ ...inv, daysOverdue: 0 });
    } else if (diffDays <= 15) {
      buckets.days1_15.count += 1;
      buckets.days1_15.amount += bal;
      buckets.days1_15.items.push({ ...inv, daysOverdue: diffDays });
    } else if (diffDays <= 30) {
      buckets.days16_30.count += 1;
      buckets.days16_30.amount += bal;
      buckets.days16_30.items.push({ ...inv, daysOverdue: diffDays });
    } else {
      buckets.days30_plus.count += 1;
      buckets.days30_plus.amount += bal;
      buckets.days30_plus.items.push({ ...inv, daysOverdue: diffDays });
    }
  });

  return buckets;
}

/**
 * REPORT 3: Payment Ledger Dataset
 */
export async function getPaymentLedgerReport({
  companyId = null,
  isAllCompanies = false,
  dateFrom = null,
  dateTo = null
} = {}) {
  let query = supabase
    .from('payments')
    .select(`
      payment_number,
      payment_date,
      amount,
      payment_method,
      reference_number,
      notes,
      companies:company_id ( name ),
      invoices:invoice_id ( invoice_number ),
      customers:customer_id ( full_name, customer_code )
    `);

  if (!isAllCompanies && companyId) {
    query = query.eq('company_id', companyId);
  }
  if (dateFrom) query = query.gte('payment_date', dateFrom);
  if (dateTo) query = query.lte('payment_date', dateTo);

  query = query.order('payment_date', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * REPORT 4: Expense Analysis Dataset
 * Group by Category
 */
export async function getExpenseAnalysisReport({
  companyId = null,
  isAllCompanies = false,
  dateFrom = null,
  dateTo = null
} = {}) {
  let query = supabase
    .from('expenses')
    .select(`
      id,
      expense_number,
      company_id,
      category,
      payee_name,
      amount,
      tax_amount,
      total_amount,
      expense_date,
      payment_method,
      status,
      companies:company_id ( name )
    `);

  if (!isAllCompanies && companyId) {
    query = query.eq('company_id', companyId);
  }
  if (dateFrom) query = query.gte('expense_date', dateFrom);
  if (dateTo) query = query.lte('expense_date', dateTo);

  query = query.order('expense_date', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;

  // Group summary by Category
  const categorySummary = {};
  (data || []).forEach((exp) => {
    if (!categorySummary[exp.category]) {
      categorySummary[exp.category] = { count: 0, totalAmount: 0, items: [] };
    }
    categorySummary[exp.category].count += 1;
    categorySummary[exp.category].totalAmount += Number(exp.total_amount) || 0;
    categorySummary[exp.category].items.push(exp);
  });

  return {
    rawExpenses: data || [],
    categorySummary
  };
}

/**
 * REPORT 5: Income vs Expense Operating Position
 */
export async function getIncomeVsExpenseReport({
  companyId = null,
  isAllCompanies = false,
  dateFrom = null,
  dateTo = null
} = {}) {
  // Fetch payments
  let payQuery = supabase
    .from('payments')
    .select('amount, payment_date, company_id, companies:company_id ( name )');
  if (!isAllCompanies && companyId) payQuery = payQuery.eq('company_id', companyId);
  if (dateFrom) payQuery = payQuery.gte('payment_date', dateFrom);
  if (dateTo) payQuery = payQuery.lte('payment_date', dateTo);

  // Fetch paid expenses
  let expQuery = supabase
    .from('expenses')
    .select('total_amount, expense_date, company_id, companies:company_id ( name )')
    .eq('status', 'paid');
  if (!isAllCompanies && companyId) expQuery = expQuery.eq('company_id', companyId);
  if (dateFrom) expQuery = expQuery.gte('expense_date', dateFrom);
  if (dateTo) expQuery = expQuery.lte('expense_date', dateTo);

  const [{ data: payments, error: pErr }, { data: expenses, error: eErr }] =
    await Promise.all([payQuery, expQuery]);

  if (pErr) throw pErr;
  if (eErr) throw eErr;

  const totalIncome = (payments || []).reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const totalExpense = (expenses || []).reduce((s, e) => s + (Number(e.total_amount) || 0), 0);
  const netPosition = totalIncome - totalExpense;

  return {
    totalIncome: Number(totalIncome.toFixed(2)),
    totalExpense: Number(totalExpense.toFixed(2)),
    netPosition: Number(netPosition.toFixed(2)),
    paymentCount: payments?.length || 0,
    expenseCount: expenses?.length || 0
  };
}
