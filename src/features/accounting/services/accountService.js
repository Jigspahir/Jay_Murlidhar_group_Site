import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — ACCOUNT SERVICE
 * 
 * Chart of Accounts (COA) data layer implementing Model C:
 * Master Account Templates + Company-Scoped Account Instances.
 */

export const ACCOUNT_CLASSES = Object.freeze([
  { value: 'asset', label: 'Assets', normalBalance: 'debit', codeRange: '1000–1999', color: 'emerald' },
  { value: 'liability', label: 'Liabilities', normalBalance: 'credit', codeRange: '2000–2999', color: 'rose' },
  { value: 'equity', label: 'Equity', normalBalance: 'credit', codeRange: '3000–3999', color: 'purple' },
  { value: 'revenue', label: 'Revenue', normalBalance: 'credit', codeRange: '4000–4999', color: 'blue' },
  { value: 'cogs', label: 'Cost of Goods Sold (COGS)', normalBalance: 'debit', codeRange: '5000–5999', color: 'amber' },
  { value: 'expense', label: 'Operating Expenses', normalBalance: 'debit', codeRange: '6000–6999', color: 'orange' }
]);

export async function getAccountTemplates() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('account_templates')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('code', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getAccounts(companyId, { accountClass, isActive } = {}) {
  if (!isSupabaseConfigured || !companyId) return [];

  let query = supabase
    .from('accounts')
    .select(`
      *,
      template:account_templates(id, code, name, normal_balance)
    `)
    .eq('company_id', companyId)
    .order('account_code', { ascending: true });

  if (accountClass) {
    query = query.eq('account_class', accountClass);
  }
  if (typeof isActive === 'boolean') {
    query = query.eq('is_active', isActive);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getAccountById(id) {
  if (!isSupabaseConfigured || !id) return null;

  const { data, error } = await supabase
    .from('accounts')
    .select(`
      *,
      template:account_templates(id, code, name, normal_balance)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createAccount(accountData) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');

  const {
    companyId,
    templateId,
    accountCode,
    accountName,
    accountClass,
    accountType,
    normalBalance,
    parentAccountId,
    description,
    isSystem = false,
    isActive = true
  } = accountData;

  if (!companyId || !accountCode || !accountName || !accountClass || !accountType || !normalBalance) {
    throw new Error('Mandatory account attributes missing.');
  }

  const { data, error } = await supabase
    .from('accounts')
    .insert({
      company_id: companyId,
      template_id: templateId || null,
      account_code: accountCode.trim(),
      account_name: accountName.trim(),
      account_class: accountClass,
      account_type: accountType,
      normal_balance: normalBalance,
      parent_account_id: parentAccountId || null,
      description: description ? description.trim() : null,
      is_system: isSystem,
      is_active: isActive
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAccount(id, updates) {
  if (!isSupabaseConfigured || !id) throw new Error('Missing account identifier');

  const payload = { ...updates };
  delete payload.id;
  delete payload.company_id;
  delete payload.is_system; // Protected

  const { data, error } = await supabase
    .from('accounts')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function provisionCompanyAccounts(companyId) {
  if (!isSupabaseConfigured || !companyId) throw new Error('Missing company ID');

  const { data, error } = await supabase.rpc('provision_company_accounts', {
    target_company_id: companyId
  });

  if (error) throw error;
  return data;
}
