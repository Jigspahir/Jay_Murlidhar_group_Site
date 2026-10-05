import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — FISCAL YEAR & ACCOUNTING PERIOD SERVICE
 * 
 * Manages Indian Fiscal Year (1 April - 31 March), 12 monthly periods,
 * and period closing/locking controls.
 */

export async function getFiscalYears(companyId) {
  if (!isSupabaseConfigured || !companyId) return [];

  const { data, error } = await supabase
    .from('fiscal_years')
    .select('*')
    .eq('company_id', companyId)
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAccountingPeriods(companyId, fiscalYearId = null) {
  if (!isSupabaseConfigured || !companyId) return [];

  let query = supabase
    .from('accounting_periods')
    .select(`
      *,
      fiscal_year:fiscal_years(id, fiscal_year_code, status)
    `)
    .eq('company_id', companyId)
    .order('start_date', { ascending: true });

  if (fiscalYearId) {
    query = query.eq('fiscal_year_id', fiscalYearId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getCurrentPeriodForDate(companyId, dateStr = null) {
  if (!isSupabaseConfigured || !companyId) return null;

  const targetDate = dateStr || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('accounting_periods')
    .select(`
      *,
      fiscal_year:fiscal_years(id, fiscal_year_code, status)
    `)
    .eq('company_id', companyId)
    .lte('start_date', targetDate)
    .gte('end_date', targetDate)
    .single();

  if (error) {
    // If not found, attempt to find first open period
    const { data: fallback } = await supabase
      .from('accounting_periods')
      .select(`
        *,
        fiscal_year:fiscal_years(id, fiscal_year_code, status)
      `)
      .eq('company_id', companyId)
      .eq('status', 'open')
      .order('start_date', { ascending: true })
      .limit(1)
      .maybeSingle();

    return fallback || null;
  }

  return data;
}

export async function closePeriod(periodId, userId) {
  if (!isSupabaseConfigured || !periodId) throw new Error('Missing period ID');

  const { data, error } = await supabase
    .from('accounting_periods')
    .update({
      status: 'closed',
      closed_at: new Date().toISOString(),
      closed_by: userId || null
    })
    .eq('id', periodId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function reopenPeriod(periodId) {
  if (!isSupabaseConfigured || !periodId) throw new Error('Missing period ID');

  const { data, error } = await supabase
    .from('accounting_periods')
    .update({
      status: 'open',
      closed_at: null,
      closed_by: null
    })
    .eq('id', periodId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function lockPeriod(periodId, userId) {
  if (!isSupabaseConfigured || !periodId) throw new Error('Missing period ID');

  const { data, error } = await supabase
    .from('accounting_periods')
    .update({
      status: 'locked',
      locked_at: new Date().toISOString(),
      locked_by: userId || null
    })
    .eq('id', periodId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function provisionCompanyFiscalYear(companyId, yearStart = 2026) {
  if (!isSupabaseConfigured || !companyId) throw new Error('Missing company ID');

  const { data, error } = await supabase.rpc('provision_company_fiscal_year', {
    target_company_id: companyId,
    year_start: yearStart
  });

  if (error) throw error;
  return data;
}
