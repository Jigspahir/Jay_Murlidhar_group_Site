import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { getCurrentPeriodForDate } from './fiscalYearService';

/**
 * JAY MURLIDHAR GROUP (JMG) — JOURNAL SERVICE
 * 
 * Production data layer for Double-Entry Journal Entries and Lines.
 * Invariant: Total Debit = Total Credit, Immutable once posted.
 */

export const ENTRY_TYPES = Object.freeze([
  { value: 'sales', label: 'Sales Invoice', color: 'blue' },
  { value: 'customer_payment', label: 'Customer Payment', color: 'emerald' },
  { value: 'purchase', label: 'Supplier Bill', color: 'purple' },
  { value: 'vendor_payment', label: 'Vendor Disbursement', color: 'indigo' },
  { value: 'grn', label: 'Goods Receipt (GRN)', color: 'teal' },
  { value: 'inventory_adjustment', label: 'Stock Adjustment', color: 'amber' },
  { value: 'expense', label: 'Operational Expense', color: 'orange' },
  { value: 'opening', label: 'Opening Balance', color: 'cyan' },
  { value: 'manual', label: 'Manual Journal', color: 'slate' },
  { value: 'closing', label: 'Period Close', color: 'rose' },
  { value: 'reversal', label: 'Reversal Journal', color: 'red' }
]);

export async function getJournals(companyId, {
  entryType,
  sourceModule,
  status,
  startDate,
  endDate,
  fiscalYearId,
  periodId,
  search
} = {}) {
  if (!isSupabaseConfigured || !companyId) return [];

  let query = supabase
    .from('journal_entries')
    .select(`
      id,
      company_id,
      journal_number,
      entry_date,
      posting_date,
      entry_type,
      source_module,
      source_id,
      reference_number,
      narration,
      status,
      is_reversal,
      reversed_entry_id,
      total_debit,
      total_credit,
      created_at,
      fiscal_year:fiscal_years(fiscal_year_code),
      period:accounting_periods(period_code, period_name)
    `)
    .eq('company_id', companyId)
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (entryType) query = query.eq('entry_type', entryType);
  if (sourceModule) query = query.eq('source_module', sourceModule);
  if (status) query = query.eq('status', status);
  if (fiscalYearId) query = query.eq('fiscal_year_id', fiscalYearId);
  if (periodId) query = query.eq('accounting_period_id', periodId);
  if (startDate) query = query.gte('entry_date', startDate);
  if (endDate) query = query.lte('entry_date', endDate);

  const { data, error } = await query;
  if (error) throw error;

  let results = data || [];
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (j) =>
        j.journal_number?.toLowerCase().includes(q) ||
        j.reference_number?.toLowerCase().includes(q) ||
        j.narration?.toLowerCase().includes(q)
    );
  }

  return results;
}

export async function getJournalById(id) {
  if (!isSupabaseConfigured || !id) return null;

  const { data: header, error: headerErr } = await supabase
    .from('journal_entries')
    .select(`
      *,
      fiscal_year:fiscal_years(id, fiscal_year_code),
      period:accounting_periods(id, period_code, period_name, status)
    `)
    .eq('id', id)
    .single();

  if (headerErr) throw headerErr;
  if (!header) return null;

  const { data: lines, error: linesErr } = await supabase
    .from('journal_entry_lines')
    .select(`
      *,
      account:accounts(id, account_code, account_name, account_class, account_type, normal_balance)
    `)
    .eq('journal_entry_id', id)
    .order('line_number', { ascending: true });

  if (linesErr) throw linesErr;

  return {
    ...header,
    lines: lines || []
  };
}

/**
 * Creates a balanced manual journal entry with lines.
 */
export async function createManualJournal({
  companyId,
  entryDate,
  referenceNumber,
  narration,
  lines = [],
  entryType = 'manual',
  sourceModule = 'manual',
  sourceId = null,
  userId = null
}) {
  if (!isSupabaseConfigured) throw new Error('Database connection not configured');
  if (!companyId || !entryDate || !narration || !Array.isArray(lines) || lines.length < 2) {
    throw new Error('A valid journal requires company, date, narration, and at least 2 lines.');
  }

  // Calculate totals and validate double-entry rule
  let totalDebit = 0;
  let totalCredit = 0;

  lines.forEach((l, idx) => {
    const dr = Math.round((Number(l.debit) || 0) * 100) / 100;
    const cr = Math.round((Number(l.credit) || 0) * 100) / 100;

    if (dr < 0 || cr < 0) {
      throw new Error(`Line ${idx + 1}: Negative amounts prohibited.`);
    }
    if ((dr === 0 && cr === 0) || (dr > 0 && cr > 0)) {
      throw new Error(`Line ${idx + 1}: Exactly one of debit or credit must be positive.`);
    }
    if (!l.accountId) {
      throw new Error(`Line ${idx + 1}: Ledger account is mandatory.`);
    }

    totalDebit += dr;
    totalCredit += cr;
  });

  totalDebit = Math.round(totalDebit * 100) / 100;
  totalCredit = Math.round(totalCredit * 100) / 100;

  if (Math.abs(totalDebit - totalCredit) > 0.001) {
    throw new Error(`Double-entry balance violation: Total Debit (₹${totalDebit.toFixed(2)}) must equal Total Credit (₹${totalCredit.toFixed(2)}).`);
  }

  // Resolve period and fiscal year
  const period = await getCurrentPeriodForDate(companyId, entryDate);
  if (!period) {
    throw new Error(`No open accounting period found for date ${entryDate}.`);
  }
  if (period.status !== 'open') {
    throw new Error(`Accounting period ${period.period_code} is ${period.status}. Posting is blocked.`);
  }

  // Insert header
  const { data: journal, error: headerErr } = await supabase
    .from('journal_entries')
    .insert({
      company_id: companyId,
      fiscal_year_id: period.fiscal_year_id,
      accounting_period_id: period.id,
      entry_date: entryDate,
      entry_type: entryType,
      source_module: sourceModule,
      source_id: sourceId,
      reference_number: referenceNumber ? referenceNumber.trim() : null,
      narration: narration.trim(),
      status: 'posted',
      total_debit: totalDebit,
      total_credit: totalCredit,
      created_by: userId,
      posted_by: userId
    })
    .select()
    .single();

  if (headerErr) throw headerErr;

  // Insert lines
  const lineInserts = lines.map((l, idx) => ({
    company_id: companyId,
    journal_entry_id: journal.id,
    line_number: idx + 1,
    account_id: l.accountId,
    debit: Math.round((Number(l.debit) || 0) * 100) / 100,
    credit: Math.round((Number(l.credit) || 0) * 100) / 100,
    description: l.description ? l.description.trim() : narration.trim(),
    entity_type: l.entityType || null,
    entity_id: l.entityId || null
  }));

  const { error: linesErr } = await supabase
    .from('journal_entry_lines')
    .insert(lineInserts);

  if (linesErr) {
    // If lines fail, rollback header if possible (though Supabase REST doesn't support interactive transaction, unique constraints protect state)
    throw linesErr;
  }

  return journal;
}

/**
 * Creates an append-only reversal journal for a posted journal entry.
 */
export async function reverseJournal(journalId, reversalReason = 'Reversal adjustment', userId = null) {
  if (!isSupabaseConfigured) throw new Error('Database connection not configured');
  if (!journalId) throw new Error('Missing journal ID to reverse');

  const original = await getJournalById(journalId);
  if (!original) throw new Error('Original journal not found.');
  if (original.status === 'reversed') throw new Error('Journal is already reversed.');
  if (original.is_reversal) throw new Error('Cannot reverse an existing reversal journal.');

  const todayStr = new Date().toISOString().split('T')[0];
  const period = await getCurrentPeriodForDate(original.company_id, todayStr);
  if (!period || period.status !== 'open') {
    throw new Error('Current accounting period is closed or unavailable for reversal posting.');
  }

  // Invert lines: Debits become Credits, Credits become Debits
  const reversedLines = original.lines.map((l) => ({
    accountId: l.account_id,
    debit: l.credit,
    credit: l.debit,
    description: `Reversal: ${l.description || original.narration}`,
    entityType: l.entity_type,
    entityId: l.entity_id
  }));

  // Create reversal journal
  const { data: revJournal, error: revErr } = await supabase
    .from('journal_entries')
    .insert({
      company_id: original.company_id,
      fiscal_year_id: period.fiscal_year_id,
      accounting_period_id: period.id,
      entry_date: todayStr,
      entry_type: 'reversal',
      source_module: original.source_module,
      source_id: original.source_id,
      reference_number: `REV-${original.journal_number}`,
      narration: `Reversal of ${original.journal_number}: ${reversalReason}`,
      status: 'posted',
      is_reversal: true,
      reversed_entry_id: original.id,
      total_debit: original.total_credit,
      total_credit: original.total_debit,
      created_by: userId,
      posted_by: userId
    })
    .select()
    .single();

  if (revErr) throw revErr;

  const revLineInserts = reversedLines.map((l, idx) => ({
    company_id: original.company_id,
    journal_entry_id: revJournal.id,
    line_number: idx + 1,
    account_id: l.accountId,
    debit: l.debit,
    credit: l.credit,
    description: l.description,
    entity_type: l.entityType,
    entity_id: l.entityId
  }));

  const { error: lineInsErr } = await supabase
    .from('journal_entry_lines')
    .insert(revLineInserts);

  if (lineInsErr) throw lineInsErr;

  // Mark original journal as reversed
  await supabase
    .from('journal_entries')
    .update({ status: 'reversed' })
    .eq('id', original.id);

  return revJournal;
}
