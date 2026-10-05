import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — COMPANY BANK ACCOUNT SERVICE
 * 
 * Manages company operational bank accounts and links to GL Asset accounts.
 */

export async function getCompanyBankAccounts(companyId) {
  if (!isSupabaseConfigured || !companyId) return [];

  const { data, error } = await supabase
    .from('company_bank_accounts')
    .select(`
      *,
      gl_account:accounts(id, account_code, account_name, normal_balance)
    `)
    .eq('company_id', companyId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getCompanyBankAccountById(id) {
  if (!isSupabaseConfigured || !id) return null;

  const { data, error } = await supabase
    .from('company_bank_accounts')
    .select(`
      *,
      gl_account:accounts(id, account_code, account_name, normal_balance)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createCompanyBankAccount(bankData) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');

  const {
    companyId,
    accountName,
    bankName,
    accountNumber,
    ifscCode,
    branch,
    accountType = 'current',
    upiId,
    linkedGlAccountId,
    isDefault = false,
    isActive = true
  } = bankData;

  if (!companyId || !accountName || !bankName || !accountNumber || !ifscCode) {
    throw new Error('Mandatory bank account fields are required.');
  }

  // If setting default, unset others first
  if (isDefault) {
    await supabase
      .from('company_bank_accounts')
      .update({ is_default: false })
      .eq('company_id', companyId);
  }

  const { data, error } = await supabase
    .from('company_bank_accounts')
    .insert({
      company_id: companyId,
      account_name: accountName.trim(),
      bank_name: bankName.trim(),
      account_number: accountNumber.trim(),
      ifsc_code: ifscCode.trim().toUpperCase(),
      branch: branch ? branch.trim() : null,
      account_type: accountType,
      upi_id: upiId ? upiId.trim() : null,
      linked_gl_account_id: linkedGlAccountId || null,
      is_default: isDefault,
      is_active: isActive
    })
    .select(`
      *,
      gl_account:accounts(id, account_code, account_name)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function updateCompanyBankAccount(id, updates) {
  if (!isSupabaseConfigured || !id) throw new Error('Missing bank account identifier');

  const payload = { ...updates };
  delete payload.id;
  delete payload.company_id;

  if (payload.is_default && updates.company_id) {
    await supabase
      .from('company_bank_accounts')
      .update({ is_default: false })
      .eq('company_id', updates.company_id);
  }

  const { data, error } = await supabase
    .from('company_bank_accounts')
    .update(payload)
    .eq('id', id)
    .select(`
      *,
      gl_account:accounts(id, account_code, account_name)
    `)
    .single();

  if (error) throw error;
  return data;
}
