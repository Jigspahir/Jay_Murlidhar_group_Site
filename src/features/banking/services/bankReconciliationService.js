import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { postBankAdjustmentJournal } from '../../accounting/services/postingService';

/**
 * JAY MURLIDHAR GROUP (JMG) — BANK RECONCILIATION SERVICE
 * 
 * Manages CSV bank statement parsing, staging transaction ingestion with
 * duplicate-protection fingerprinting, transaction matching, and monthly BRS generation.
 */

export async function getBankStatements(companyId, bankAccountId = null) {
  if (!isSupabaseConfigured || !companyId) return [];

  let query = supabase
    .from('bank_statements')
    .select(`
      *,
      bank_account:company_bank_accounts(id, bank_name, account_number)
    `)
    .eq('company_id', companyId)
    .order('statement_date', { ascending: false });

  if (bankAccountId) query = query.eq('bank_account_id', bankAccountId);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getBankStatementTransactions(statementId) {
  if (!isSupabaseConfigured || !statementId) return [];

  const { data, error } = await supabase
    .from('bank_statement_transactions')
    .select('*')
    .eq('statement_id', statementId)
    .order('transaction_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Parse CSV text into normalized transaction rows
 */
export function parseBankStatementCsv(csvText, mapping = {}) {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''));

  // Default auto-detect indices
  const dateIdx = mapping.dateIdx ?? headers.findIndex((h) => h.includes('date') || h.includes('txn'));
  const descIdx = mapping.descIdx ?? headers.findIndex((h) => h.includes('desc') || h.includes('narration') || h.includes('particular'));
  const refIdx = mapping.refIdx ?? headers.findIndex((h) => h.includes('chq') || h.includes('ref') || h.includes('utr'));
  const debitIdx = mapping.debitIdx ?? headers.findIndex((h) => h.includes('dr') || h.includes('debit') || h.includes('withdrawal'));
  const creditIdx = mapping.creditIdx ?? headers.findIndex((h) => h.includes('cr') || h.includes('credit') || h.includes('deposit'));
  const balanceIdx = mapping.balanceIdx ?? headers.findIndex((h) => h.includes('bal'));

  const parsedRows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < 3) continue;

    const dateStr = cols[dateIdx] || new Date().toISOString().split('T')[0];
    const desc = cols[descIdx] || 'Bank Transaction';
    const ref = cols[refIdx] || '';

    const drVal = parseFloat(cols[debitIdx]?.replace(/,/g, '') || 0);
    const crVal = parseFloat(cols[creditIdx]?.replace(/,/g, '') || 0);
    const balVal = parseFloat(cols[balanceIdx]?.replace(/,/g, '') || 0);

    let type = 'credit';
    let amt = 0;

    if (drVal > 0) {
      type = 'debit';
      amt = drVal;
    } else if (crVal > 0) {
      type = 'credit';
      amt = crVal;
    }

    if (amt > 0) {
      parsedRows.push({
        date: formatDateIso(dateStr),
        description: desc,
        reference: ref,
        type,
        amount: amt,
        balanceAfter: balVal
      });
    }
  }

  return parsedRows;
}

function parseCsvLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

function formatDateIso(str) {
  if (!str) return new Date().toISOString().split('T')[0];
  const parts = str.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    if (parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return str;
}

/**
 * Import and stage bank statement with duplicate detection
 */
export async function importBankStatementCsv({
  companyId,
  bankAccountId,
  csvText,
  fileName = 'statement.csv',
  userId = null
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');

  const rows = parseBankStatementCsv(csvText);
  if (rows.length === 0) throw new Error('No valid transaction rows found in CSV');

  let totalDeposits = 0;
  let totalWithdrawals = 0;
  let minDate = rows[0].date;
  let maxDate = rows[0].date;

  rows.forEach((r) => {
    if (r.type === 'credit') totalDeposits += r.amount;
    if (r.type === 'debit') totalWithdrawals += r.amount;
    if (r.date < minDate) minDate = r.date;
    if (r.date > maxDate) maxDate = r.date;
  });

  // Create statement header
  const { data: stmt, error: stmtErr } = await supabase
    .from('bank_statements')
    .insert([
      {
        company_id: companyId,
        bank_account_id: bankAccountId,
        statement_date: new Date().toISOString().split('T')[0],
        period_start_date: minDate,
        period_end_date: maxDate,
        total_deposits: Math.round(totalDeposits * 100) / 100,
        total_withdrawals: Math.round(totalWithdrawals * 100) / 100,
        total_transactions: rows.length,
        file_name: fileName,
        status: 'imported',
        imported_by: userId
      }
    ])
    .select()
    .single();

  if (stmtErr) throw stmtErr;

  // Insert staging lines with deterministic duplicate-prevention fingerprint
  let importedCount = 0;
  let skippedDuplicates = 0;

  for (const r of rows) {
    const fingerprint = `${companyId}_${bankAccountId}_${r.date}_${r.amount}_${r.type}_${r.reference}_${r.description.slice(0, 20)}`.replace(/[^a-zA-Z0-9_]/g, '');

    const { error: insErr } = await supabase
      .from('bank_statement_transactions')
      .insert([
        {
          statement_id: stmt.id,
          company_id: companyId,
          bank_account_id: bankAccountId,
          transaction_date: r.date,
          description: r.description,
          cheque_reference_no: r.reference,
          transaction_type: r.type,
          amount: r.amount,
          balance_after: r.balanceAfter,
          fingerprint,
          status: 'unmatched'
        }
      ]);

    if (insErr) {
      if (insErr.code === '23505') {
        skippedDuplicates++;
      } else {
        throw insErr;
      }
    } else {
      importedCount++;
    }
  }

  return {
    statement: stmt,
    totalRows: rows.length,
    importedCount,
    skippedDuplicates
  };
}

/**
 * Match a staged transaction to a commercial payment or expense
 */
export async function matchBankTransaction({
  transactionId,
  matchedEntityType,
  matchedEntityId,
  userId = null
}) {
  if (!isSupabaseConfigured || !transactionId) throw new Error('Missing transaction ID');

  const { data: updated, error } = await supabase
    .from('bank_statement_transactions')
    .update({
      status: 'matched',
      matched_entity_type: matchedEntityType,
      matched_entity_id: matchedEntityId,
      reconciled_at: new Date().toISOString(),
      reconciled_by: userId
    })
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw error;
  return updated;
}

/**
 * Compute Bank Reconciliation Statement (BRS) Summary
 */
export async function getBankReconciliationSummary({
  companyId,
  bankAccountId,
  asOfDate = null
}) {
  if (!isSupabaseConfigured || !companyId || !bankAccountId) {
    return {
      bankStatementBalance: 0,
      bookBalance: 0,
      depositsInTransit: 0,
      outstandingCheques: 0,
      adjustedBankBalance: 0,
      variance: 0,
      isBalanced: true
    };
  }

  const cutOff = asOfDate || new Date().toISOString().split('T')[0];

  // 1. Fetch Bank GL Account balance
  const { data: bAcc } = await supabase
    .from('company_bank_accounts')
    .select('id, linked_gl_account_id')
    .eq('id', bankAccountId)
    .single();

  let bookBalance = 0;
  if (bAcc?.linked_gl_account_id) {
    const { data: lines } = await supabase
      .from('journal_entry_lines')
      .select('debit, credit, journal:journal_entries!inner(entry_date, status)')
      .eq('account_id', bAcc.linked_gl_account_id)
      .eq('journal.status', 'posted')
      .lte('journal.entry_date', cutOff);

    (lines || []).forEach((l) => {
      bookBalance += (Number(l.debit) || 0) - (Number(l.credit) || 0);
    });
  }

  // 2. Fetch Staged Bank Transactions to get latest statement closing
  const { data: stmtTxs } = await supabase
    .from('bank_statement_transactions')
    .select('amount, transaction_type, status, balance_after')
    .eq('company_id', companyId)
    .eq('bank_account_id', bankAccountId)
    .lte('transaction_date', cutOff)
    .order('transaction_date', { ascending: false });

  const latestBal = stmtTxs && stmtTxs.length > 0 && stmtTxs[0].balance_after != null
    ? Number(stmtTxs[0].balance_after)
    : bookBalance;

  // 3. Outstanding cheques (Book payments not yet in bank statement)
  let outstandingCheques = 0;
  let depositsInTransit = 0;

  // Calculate un-reconciled items
  (stmtTxs || []).forEach((tx) => {
    if (tx.status === 'unmatched') {
      if (tx.transaction_type === 'credit') {
        depositsInTransit += Number(tx.amount);
      } else {
        outstandingCheques += Number(tx.amount);
      }
    }
  });

  const adjustedBank = Math.round((latestBal + depositsInTransit - outstandingCheques) * 100) / 100;
  const variance = Math.round((adjustedBank - bookBalance) * 100) / 100;

  return {
    bankStatementBalance: Math.round(latestBal * 100) / 100,
    bookBalance: Math.round(bookBalance * 100) / 100,
    depositsInTransit: Math.round(depositsInTransit * 100) / 100,
    outstandingCheques: Math.round(outstandingCheques * 100) / 100,
    adjustedBankBalance: adjustedBank,
    variance,
    isBalanced: Math.abs(variance) < 1.0
  };
}

export async function finalizeBankReconciliation({
  companyId,
  bankAccountId,
  statementId = null,
  asOfDate = null,
  bankStatementBalance,
  bookBalance,
  notes = '',
  userId = null
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');

  const summary = await getBankReconciliationSummary({ companyId, bankAccountId, asOfDate });

  const { data: brs, error } = await supabase
    .from('bank_reconciliations')
    .insert([
      {
        company_id: companyId,
        bank_account_id: bankAccountId,
        statement_id: statementId,
        as_of_date: asOfDate || new Date().toISOString().split('T')[0],
        bank_statement_balance: bankStatementBalance ?? summary.bankStatementBalance,
        book_balance: bookBalance ?? summary.bookBalance,
        deposits_in_transit: summary.depositsInTransit,
        outstanding_cheques: summary.outstandingCheques,
        adjusted_bank_balance: summary.adjustedBankBalance,
        variance: summary.variance,
        status: 'finalized',
        notes,
        finalized_at: new Date().toISOString(),
        finalized_by: userId
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return brs;
}

// =============================================================================
// UI WORKSPACE ADAPTER METHODS
// =============================================================================

export async function getReconciliations(companyId, bankAccountId = null) {
  if (!isSupabaseConfigured || !companyId) return [];
  let query = supabase
    .from('bank_reconciliations')
    .select(`
      *,
      bank_account:company_bank_accounts(id, bank_name, account_number, account_type)
    `)
    .eq('company_id', companyId)
    .order('statement_date', { ascending: false });

  if (bankAccountId) query = query.eq('bank_account_id', bankAccountId);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(r => ({
    ...r,
    statement_date: r.as_of_date || r.statement_date,
    closing_balance_per_bank: r.bank_statement_balance || r.closing_balance_per_bank,
    closing_balance_per_books: r.book_balance || r.closing_balance_per_books,
    difference: r.variance ?? (r.bank_statement_balance - r.book_balance)
  }));
}

export async function startReconciliation({
  company_id,
  bank_account_id,
  statement_date,
  closing_balance_per_bank,
  notes = '',
  user_id = null
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('bank_reconciliations')
    .insert([
      {
        company_id,
        bank_account_id,
        as_of_date: statement_date,
        bank_statement_balance: closing_balance_per_bank,
        book_balance: 0,
        status: 'draft',
        notes,
        created_by: user_id
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function importCsvStatement({
  company_id,
  bank_account_id,
  file_name,
  csv_text,
  column_mapping = {},
  opening_balance = 0,
  closing_balance = 0
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const lines = csv_text.split(/\r\n|\n/).filter(l => l.trim() !== '');
  if (lines.length < 2) throw new Error('CSV must contain a header and data rows');

  const headers = lines[0].split(',').map(h => h.replace(/["']/g, '').trim());
  const dateCol = column_mapping.date || 'Date';
  const descCol = column_mapping.description || 'Description';
  const refCol = column_mapping.reference || 'Reference';
  const drCol = column_mapping.debit || 'Debit';
  const crCol = column_mapping.credit || 'Credit';
  const balCol = column_mapping.balance || 'Balance';

  const dateIdx = headers.indexOf(dateCol);
  const descIdx = headers.indexOf(descCol);
  const refIdx = headers.indexOf(refCol);
  const drIdx = headers.indexOf(drCol);
  const crIdx = headers.indexOf(crCol);
  const balIdx = headers.indexOf(balCol);

  if (dateIdx === -1) throw new Error(`Date column "${dateCol}" not found in CSV`);

  // Create statement record
  const { data: stmt, error: stmtErr } = await supabase
    .from('bank_statements')
    .insert([
      {
        company_id,
        bank_account_id,
        file_name,
        statement_date: new Date().toISOString().split('T')[0],
        statement_from: null,
        statement_to: null,
        opening_balance,
        closing_balance,
        total_rows: lines.length - 1,
        status: 'imported'
      }
    ])
    .select()
    .single();

  if (stmtErr) throw stmtErr;

  let importedCount = 0;
  let dupCount = 0;
  let minDate = null;
  let maxDate = null;

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',').map(c => c.replace(/["']/g, '').trim());
    const rawDate = cells[dateIdx];
    if (!rawDate) continue;

    // Normalize date to YYYY-MM-DD
    let isoDate = rawDate;
    if (rawDate.includes('/')) {
      const parts = rawDate.split('/');
      if (parts[2]?.length === 4) {
        isoDate = `${parts[2]}-${String(parts[1]).padStart(2, '0')}-${String(parts[0]).padStart(2, '0')}`;
      }
    }

    if (!minDate || isoDate < minDate) minDate = isoDate;
    if (!maxDate || isoDate > maxDate) maxDate = isoDate;

    const desc = descIdx >= 0 ? cells[descIdx] : '';
    const ref = refIdx >= 0 ? cells[refIdx] : '';
    const debit = drIdx >= 0 ? parseFloat(cells[drIdx]) || 0 : 0;
    const credit = crIdx >= 0 ? parseFloat(cells[crIdx]) || 0 : 0;
    const bal = balIdx >= 0 ? parseFloat(cells[balIdx]) || 0 : 0;

    const amount = credit > 0 ? credit : debit;
    const type = credit > 0 ? 'credit' : 'debit';

    // Build unique fingerprint
    const fingerprint = `${company_id}_${bank_account_id}_${isoDate}_${amount}_${type}_${ref}_${desc.slice(0, 20)}`;

    const { error: insErr } = await supabase
      .from('bank_statement_transactions')
      .insert([
        {
          statement_id: stmt.id,
          company_id,
          bank_account_id,
          transaction_date: isoDate,
          value_date: isoDate,
          description: desc,
          reference: ref,
          amount,
          transaction_type: type,
          balance: bal,
          duplicate_fingerprint: fingerprint,
          status: 'unmatched'
        }
      ]);

    if (insErr) {
      if (insErr.code === '23505') {
        dupCount++;
      } else {
        console.warn('Row insert error:', insErr);
      }
    } else {
      importedCount++;
    }
  }

  // Update statement with date span
  await supabase
    .from('bank_statements')
    .update({
      statement_from: minDate,
      statement_to: maxDate,
      total_rows: importedCount
    })
    .eq('id', stmt.id);

  return {
    statement: { ...stmt, statement_from: minDate, statement_to: maxDate },
    imported_count: importedCount,
    duplicate_count: dupCount
  };
}

export async function getBRSStatement(reconId) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data: rec, error } = await supabase
    .from('bank_reconciliations')
    .select(`
      *,
      bank_account:company_bank_accounts(*)
    `)
    .eq('id', reconId)
    .single();

  if (error) throw error;

  const asOf = rec.as_of_date || rec.statement_date;
  const summary = await getBankReconciliationSummary({
    companyId: rec.company_id,
    bankAccountId: rec.bank_account_id,
    asOfDate: asOf
  });

  return {
    reconciliation: {
      ...rec,
      statement_date: asOf,
      closing_balance_per_bank: rec.bank_statement_balance || 0,
      closing_balance_per_books: summary.bookBalance || 0
    },
    summary: {
      closing_balance_per_bank: rec.bank_statement_balance || 0,
      closing_balance_per_books: summary.bookBalance || 0,
      total_uncredited_receipts: summary.depositsInTransit || 0,
      total_unpresented_payments: summary.outstandingCheques || 0,
      difference: Math.round(((rec.bank_statement_balance || 0) - (summary.bookBalance || 0)) * 100) / 100
    }
  };
}

export async function getStagedTransactions(bankAccountId, statementDate) {
  if (!isSupabaseConfigured || !bankAccountId) return [];
  let query = supabase
    .from('bank_statement_transactions')
    .select('*')
    .eq('bank_account_id', bankAccountId)
    .order('transaction_date', { ascending: false });

  if (statementDate) query = query.lte('transaction_date', statementDate);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getUnreconciledBookTransactions(companyId, bankAccountId, statementDate) {
  if (!isSupabaseConfigured || !companyId) return [];

  // 1. Customer Payments (Inflows)
  const { data: payments } = await supabase
    .from('payments')
    .select('id, payment_number, payment_date, amount, payment_method, reference_number, customer:customers(name)')
    .eq('company_id', companyId)
    .eq('bank_account_id', bankAccountId)
    .lte('payment_date', statementDate || new Date().toISOString().split('T')[0]);

  // 2. Vendor Payments (Outflows)
  const { data: vendorPayments } = await supabase
    .from('vendor_payments')
    .select('id, payment_number, payment_date, amount, payment_method, reference_number, vendor:vendors(name)')
    .eq('company_id', companyId)
    .eq('bank_account_id', bankAccountId)
    .lte('payment_date', statementDate || new Date().toISOString().split('T')[0]);

  // 3. Operating Expenses (Outflows)
  const { data: expenses } = await supabase
    .from('expenses')
    .select('id, expense_number, expense_date, amount, payment_mode, reference_number, description')
    .eq('company_id', companyId)
    .eq('bank_account_id', bankAccountId)
    .lte('expense_date', statementDate || new Date().toISOString().split('T')[0]);

  const items = [];
  (payments || []).forEach(p => {
    items.push({
      id: p.id,
      type: 'customer_payment',
      date: p.payment_date,
      number: p.payment_number,
      party: p.customer?.name || 'Customer Payment',
      reference: p.reference_number,
      amount: p.amount,
      direction: 'inflow'
    });
  });

  (vendorPayments || []).forEach(vp => {
    items.push({
      id: vp.id,
      type: 'vendor_payment',
      date: vp.payment_date,
      number: vp.payment_number,
      party: vp.vendor?.name || 'Supplier Payment',
      reference: vp.reference_number,
      amount: vp.amount,
      direction: 'outflow'
    });
  });

  (expenses || []).forEach(e => {
    items.push({
      id: e.id,
      type: 'expense',
      date: e.expense_date,
      number: e.expense_number,
      party: e.description || 'Operating Expense',
      reference: e.reference_number,
      amount: e.amount,
      direction: 'outflow'
    });
  });

  return items.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function finalizeReconciliation(reconId) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('bank_reconciliations')
    .update({
      status: 'finalized',
      finalized_at: new Date().toISOString()
    })
    .eq('id', reconId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const parseAndStageCsvBankStatement = importCsvStatement;

export async function matchTransaction(params) {
  const transactionId = params.transactionId || params.bank_transaction_id;
  const matchedEntityType = params.matchedEntityType || params.book_transaction_type;
  const matchedEntityId = params.matchedEntityId || params.book_transaction_id;
  const userId = params.userId || params.user_id;

  return matchBankTransaction({
    transactionId,
    matchedEntityType,
    matchedEntityId,
    userId
  });
}

export async function unmatchTransaction(transactionId) {
  if (!isSupabaseConfigured || !transactionId) throw new Error('Missing transaction ID');
  const { data: updated, error } = await supabase
    .from('bank_statement_transactions')
    .update({
      status: 'unmatched',
      matched_entity_type: null,
      matched_entity_id: null,
      reconciled_at: null,
      reconciled_by: null
    })
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw error;
  return updated;
}

export const bankReconciliationService = {
  getBankStatements,
  getStatements: getBankStatements,
  getBankStatementTransactions,
  parseAndStageCsvBankStatement,
  importCsvStatement,
  matchTransaction,
  unmatchTransaction,
  getBankReconciliationSummary,
  finalizeBankReconciliation,
  finalizeReconciliation,
  getReconciliations,
  startReconciliation,
  getBRSStatement,
  getStagedTransactions,
  getUnreconciledBookTransactions
};

export default bankReconciliationService;
