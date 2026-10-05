import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { getAccounts } from './accountService';

/**
 * JAY MURLIDHAR GROUP (JMG) — FINANCIAL REPORT SERVICE
 * 
 * Generates authoritative financial statements strictly from posted General Ledger entries:
 * 1. Trial Balance (Total Debit = Total Credit)
 * 2. General Ledger Account Statements
 * 3. Profit & Loss (P&L) Statement (Revenue - COGS = Gross Profit - Expenses = Net Profit)
 * 4. Balance Sheet (Assets = Liabilities + Equity)
 * 5. Executive Financial Metrics
 */

/**
 * 1. Trial Balance Report
 */
export async function getTrialBalance({
  companyId,
  startDate,
  endDate,
  fiscalYearId,
  periodId,
  isConsolidated = false
} = {}) {
  if (!isSupabaseConfigured) return { rows: [], totals: { debit: 0, credit: 0 }, isBalanced: true };

  // Fetch accounts (or all accounts if consolidated)
  let accountsQuery = supabase
    .from('accounts')
    .select('id, company_id, account_code, account_name, account_class, account_type, normal_balance')
    .order('account_code', { ascending: true });

  if (!isConsolidated && companyId) {
    accountsQuery = accountsQuery.eq('company_id', companyId);
  }

  const { data: accounts, error: accErr } = await accountsQuery;
  if (accErr) throw accErr;

  // Fetch all journal lines with entry metadata
  let linesQuery = supabase
    .from('journal_entry_lines')
    .select(`
      account_id,
      debit,
      credit,
      journal:journal_entries!inner(
        id,
        company_id,
        entry_date,
        status,
        fiscal_year_id,
        accounting_period_id
      )
    `)
    .in('journal.status', ['posted', 'reversed']);

  if (!isConsolidated && companyId) {
    linesQuery = linesQuery.eq('journal.company_id', companyId);
  }
  if (fiscalYearId) {
    linesQuery = linesQuery.eq('journal.fiscal_year_id', fiscalYearId);
  }
  if (periodId) {
    linesQuery = linesQuery.eq('journal.accounting_period_id', periodId);
  }
  if (startDate) {
    linesQuery = linesQuery.gte('journal.entry_date', startDate);
  }
  if (endDate) {
    linesQuery = linesQuery.lte('journal.entry_date', endDate);
  }

  const { data: lines, error: linesErr } = await linesQuery;
  if (linesErr) throw linesErr;

  // Aggregate debit and credit per account
  const accountTotals = {};
  (lines || []).forEach((line) => {
    const accId = line.account_id;
    if (!accountTotals[accId]) {
      accountTotals[accId] = { debit: 0, credit: 0 };
    }
    accountTotals[accId].debit += Number(line.debit) || 0;
    accountTotals[accId].credit += Number(line.credit) || 0;
  });

  let totalDebit = 0;
  let totalCredit = 0;

  const rows = (accounts || []).map((acc) => {
    const totals = accountTotals[acc.id] || { debit: 0, credit: 0 };
    const dr = Math.round(totals.debit * 100) / 100;
    const cr = Math.round(totals.credit * 100) / 100;

    // Net closing balance depending on normal balance
    let closingDebit = 0;
    let closingCredit = 0;

    const net = dr - cr;
    if (net > 0) {
      closingDebit = net;
    } else if (net < 0) {
      closingCredit = Math.abs(net);
    }

    closingDebit = Math.round(closingDebit * 100) / 100;
    closingCredit = Math.round(closingCredit * 100) / 100;

    totalDebit += closingDebit;
    totalCredit += closingCredit;

    return {
      accountId: acc.id,
      accountCode: acc.account_code,
      accountName: acc.account_name,
      accountClass: acc.account_class,
      accountType: acc.account_type,
      normalBalance: acc.normal_balance,
      periodDebit: dr,
      periodCredit: cr,
      closingDebit,
      closingCredit
    };
  }).filter((r) => r.periodDebit > 0 || r.periodCredit > 0 || r.closingDebit > 0 || r.closingCredit > 0);

  totalDebit = Math.round(totalDebit * 100) / 100;
  totalCredit = Math.round(totalCredit * 100) / 100;
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.05;

  return {
    rows,
    totals: { debit: totalDebit, credit: totalCredit },
    isBalanced
  };
}

/**
 * 2. General Ledger Account Ledger
 */
export async function getGeneralLedger({
  companyId,
  accountId,
  startDate,
  endDate
}) {
  if (!isSupabaseConfigured || !accountId) return { account: null, lines: [], runningBalance: 0 };

  // Fetch account info
  const { data: account, error: accErr } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', accountId)
    .single();

  if (accErr || !account) throw new Error('Account not found');

  let query = supabase
    .from('journal_entry_lines')
    .select(`
      id,
      line_number,
      debit,
      credit,
      description,
      entity_type,
      entity_id,
      created_at,
      journal:journal_entries!inner(
        id,
        company_id,
        journal_number,
        entry_date,
        entry_type,
        source_module,
        source_id,
        reference_number,
        narration,
        status,
        is_reversal
      )
    `)
    .eq('account_id', accountId)
    .in('journal.status', ['posted', 'reversed'])
    .order('journal(entry_date)', { ascending: true })
    .order('line_number', { ascending: true });

  if (companyId) {
    query = query.eq('company_id', companyId);
  }
  if (startDate) {
    query = query.gte('journal.entry_date', startDate);
  }
  if (endDate) {
    query = query.lte('journal.entry_date', endDate);
  }

  const { data, error } = await query;
  if (error) throw error;

  let running = 0;
  const isDebitNormal = account.normal_balance === 'debit';

  const lines = (data || []).map((row) => {
    const dr = Number(row.debit) || 0;
    const cr = Number(row.credit) || 0;

    if (isDebitNormal) {
      running += (dr - cr);
    } else {
      running += (cr - dr);
    }

    return {
      id: row.id,
      date: row.journal?.entry_date,
      journalNumber: row.journal?.journal_number,
      journalId: row.journal?.id,
      entryType: row.journal?.entry_type,
      sourceModule: row.journal?.source_module,
      referenceNumber: row.journal?.reference_number,
      narration: row.description || row.journal?.narration,
      debit: dr,
      credit: cr,
      runningBalance: Math.round(running * 100) / 100
    };
  });

  return {
    account,
    lines,
    finalBalance: Math.round(running * 100) / 100
  };
}

/**
 * 3. Profit & Loss (P&L) Statement
 */
export async function getProfitAndLoss({
  companyId,
  startDate,
  endDate,
  fiscalYearId,
  isConsolidated = false
} = {}) {
  const trial = await getTrialBalance({
    companyId,
    startDate,
    endDate,
    fiscalYearId,
    isConsolidated
  });

  const revenues = [];
  const cogs = [];
  const operatingExpenses = [];
  const otherIncome = [];

  trial.rows.forEach((r) => {
    // Net amount calculation:
    // Revenue is credit-normal
    // Expense / COGS is debit-normal
    if (r.accountClass === 'revenue') {
      const net = r.closingCredit - r.closingDebit;
      if (net !== 0) {
        if (r.accountCode === '4920' || r.accountCode === '4910') {
          otherIncome.push({ ...r, amount: net });
        } else {
          revenues.push({ ...r, amount: net });
        }
      }
    } else if (r.accountClass === 'cogs') {
      const net = r.closingDebit - r.closingCredit;
      if (net !== 0) {
        cogs.push({ ...r, amount: net });
      }
    } else if (r.accountClass === 'expense') {
      const net = r.closingDebit - r.closingCredit;
      if (net !== 0) {
        operatingExpenses.push({ ...r, amount: net });
      }
    }
  });

  const totalRevenue = Math.round(revenues.reduce((s, r) => s + r.amount, 0) * 100) / 100;
  const totalCogs = Math.round(cogs.reduce((s, r) => s + r.amount, 0) * 100) / 100;
  const grossProfit = Math.round((totalRevenue - totalCogs) * 100) / 100;

  const totalOperatingExpenses = Math.round(operatingExpenses.reduce((s, r) => s + r.amount, 0) * 100) / 100;
  const operatingProfit = Math.round((grossProfit - totalOperatingExpenses) * 100) / 100;

  const totalOtherIncome = Math.round(otherIncome.reduce((s, r) => s + r.amount, 0) * 100) / 100;
  const netProfit = Math.round((operatingProfit + totalOtherIncome) * 100) / 100;

  return {
    revenues,
    cogs,
    operatingExpenses,
    otherIncome,
    totalRevenue,
    totalCogs,
    grossProfit,
    totalOperatingExpenses,
    operatingProfit,
    totalOtherIncome,
    netProfit
  };
}

/**
 * 4. Balance Sheet
 */
export async function getBalanceSheet({
  companyId,
  asOfDate,
  fiscalYearId,
  isConsolidated = false
} = {}) {
  const trial = await getTrialBalance({
    companyId,
    endDate: asOfDate,
    fiscalYearId,
    isConsolidated
  });

  // Also calculate current period net profit to reflect in Equity
  const pnl = await getProfitAndLoss({
    companyId,
    endDate: asOfDate,
    fiscalYearId,
    isConsolidated
  });

  const assets = [];
  const liabilities = [];
  const equity = [];

  trial.rows.forEach((r) => {
    if (r.accountClass === 'asset') {
      const net = r.closingDebit - r.closingCredit;
      if (net !== 0) assets.push({ ...r, amount: net });
    } else if (r.accountClass === 'liability') {
      const net = r.closingCredit - r.closingDebit;
      if (net !== 0) liabilities.push({ ...r, amount: net });
    } else if (r.accountClass === 'equity') {
      const net = r.closingCredit - r.closingDebit;
      if (net !== 0) equity.push({ ...r, amount: net });
    }
  });

  // Inject Current Year Net Profit / (Loss) into Equity
  if (pnl.netProfit !== 0) {
    equity.push({
      accountId: 'net-profit-current',
      accountCode: '3310',
      accountName: 'Current Period Net Profit / (Loss)',
      accountClass: 'equity',
      accountType: 'equity',
      amount: pnl.netProfit
    });
  }

  const totalAssets = Math.round(assets.reduce((s, a) => s + a.amount, 0) * 100) / 100;
  const totalLiabilities = Math.round(liabilities.reduce((s, l) => s + l.amount, 0) * 100) / 100;
  const totalEquity = Math.round(equity.reduce((s, e) => s + e.amount, 0) * 100) / 100;

  const totalLiabilitiesAndEquity = Math.round((totalLiabilities + totalEquity) * 100) / 100;
  const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.05;

  return {
    assets,
    liabilities,
    equity,
    totalAssets,
    totalLiabilities,
    totalEquity,
    totalLiabilitiesAndEquity,
    isBalanced
  };
}

/**
 * 5. Executive Accounting Metrics (Dashboard)
 */
export async function getAccountingMetrics(companyId) {
  if (!isSupabaseConfigured || !companyId) {
    return {
      totalAssets: 0,
      totalLiabilities: 0,
      totalEquity: 0,
      totalRevenue: 0,
      totalCogs: 0,
      grossProfit: 0,
      operatingExpenses: 0,
      netProfit: 0,
      accountsReceivable: 0,
      accountsPayable: 0,
      inventoryValue: 0,
      inputGst: 0,
      outputGst: 0,
      journalCount: 0
    };
  }

  const todayStr = new Date().toISOString().split('T')[0];

  const [bs, pnl, journalsRes] = await Promise.all([
    getBalanceSheet({ companyId, asOfDate: todayStr }),
    getProfitAndLoss({ companyId, endDate: todayStr }),
    supabase
      .from('journal_entries')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', companyId)
  ]);

  // Extract specific control accounts from BS
  const arRow = bs.assets.find((a) => a.accountCode === '1210');
  const apRow = bs.liabilities.find((l) => l.accountCode === '2110');
  const invRow = bs.assets.find((a) => a.accountCode === '1310');
  const inputGstRows = bs.assets.filter((a) => ['1410', '1420', '1430'].includes(a.accountCode));
  const outputGstRows = bs.liabilities.filter((l) => ['2210', '2220', '2230'].includes(l.accountCode));

  const inputGst = inputGstRows.reduce((s, r) => s + r.amount, 0);
  const outputGst = outputGstRows.reduce((s, r) => s + r.amount, 0);

  return {
    totalAssets: bs.totalAssets,
    totalLiabilities: bs.totalLiabilities,
    totalEquity: bs.totalEquity,
    totalRevenue: pnl.totalRevenue,
    totalCogs: pnl.totalCogs,
    grossProfit: pnl.grossProfit,
    operatingExpenses: pnl.totalOperatingExpenses,
    netProfit: pnl.netProfit,
    accountsReceivable: arRow ? arRow.amount : 0,
    accountsPayable: apRow ? apRow.amount : 0,
    inventoryValue: invRow ? invRow.amount : 0,
    inputGst: Math.round(inputGst * 100) / 100,
    outputGst: Math.round(outputGst * 100) / 100,
    journalCount: journalsRes.count || 0
  };
}
