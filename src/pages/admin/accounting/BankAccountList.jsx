import React, { useState, useEffect, useCallback } from 'react';
import { useCompany } from '../../../contexts/CompanyContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../config/permissions';
import { 
  getCompanyBankAccounts, 
  createCompanyBankAccount, 
  getAccounts 
} from '../../../features/accounting';
import { 
  Building2, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  CreditCard, 
  Star,
  RefreshCw
} from 'lucide-react';

export default function BankAccountList() {
  const { currentCompany } = useCompany();
  const { hasPermission } = usePermissions();

  const [bankAccounts, setBankAccounts] = useState([]);
  const [glAccounts, setGlAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    accountName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    accountType: 'current',
    upiId: '',
    linkedGlAccountId: '',
    isDefault: false
  });
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!currentCompany?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [banks, accs] = await Promise.all([
        getCompanyBankAccounts(currentCompany.id),
        getAccounts(currentCompany.id, { accountClass: 'asset' })
      ]);
      setBankAccounts(banks);
      setGlAccounts(accs);
    } catch (err) {
      console.error('Failed to load bank accounts:', err);
      setError(err.message || 'Error fetching bank accounts.');
    } finally {
      setIsLoading(false);
    }
  }, [currentCompany?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateBank = async (e) => {
    e.preventDefault();
    if (!currentCompany?.id) return;
    setIsSaving(true);
    setError(null);
    try {
      await createCompanyBankAccount({
        companyId: currentCompany.id,
        accountName: formData.accountName,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        branch: formData.branch,
        accountType: formData.accountType,
        upiId: formData.upiId,
        linkedGlAccountId: formData.linkedGlAccountId || null,
        isDefault: formData.isDefault
      });

      setIsModalOpen(false);
      setFormData({
        accountName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        branch: '',
        accountType: 'current',
        upiId: '',
        linkedGlAccountId: '',
        isDefault: false
      });
      setSuccessMsg('Company bank account registered successfully.');
      await loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Create bank error:', err);
      setError(err.message || 'Failed to register bank account.');
    } finally {
      setIsSaving(false);
    }
  };

  const maskAccountNo = (num) => {
    if (!num) return '—';
    const s = String(num);
    if (s.length <= 4) return s;
    return '•••• •••• ' + s.slice(-4);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Company Bank Accounts
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Operational settlement accounts and General Ledger asset linkages for{' '}
            <strong className="text-slate-800">{currentCompany?.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasPermission(PERMISSIONS.ACCOUNTING_BANK_ACCOUNTS_MANAGE) && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Bank Account</span>
            </button>
          )}

          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid of Bank Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-3 p-12 text-center text-slate-400">
            Loading bank accounts...
          </div>
        ) : bankAccounts.length === 0 ? (
          <div className="col-span-3 p-8 text-center bg-white rounded-xl border border-slate-200">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-600">No bank accounts registered yet.</p>
          </div>
        ) : (
          bankAccounts.map((b) => (
            <div
              key={b.id}
              className={`p-5 rounded-xl border bg-white shadow-sm flex flex-col justify-between transition-all ${
                b.is_default ? 'border-blue-300 ring-1 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {b.bank_name}
                  </span>
                  {b.is_default && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Default</span>
                    </span>
                  )}
                </div>

                <h2 className="text-base font-bold text-slate-900 mt-1">
                  {b.account_name}
                </h2>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Account No:</span>
                    <span className="font-bold text-slate-800">{maskAccountNo(b.account_number)}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">IFSC Code:</span>
                    <span className="font-bold text-slate-800">{b.ifsc_code}</span>
                  </div>
                  {b.branch && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Branch:</span>
                      <span className="text-slate-800">{b.branch}</span>
                    </div>
                  )}
                  {b.upi_id && (
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">UPI ID:</span>
                      <span className="text-blue-700 font-semibold">{b.upi_id}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Linked GL Ledger Tag */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Linked GL Ledger:</span>
                <span className="font-mono font-bold text-blue-700">
                  {b.gl_account ? `${b.gl_account.account_code} — ${b.gl_account.account_name}` : '1120 Bank Current A/C'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Register Company Bank Account</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBank} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Account Display Name *</label>
                <input
                  type="text"
                  required
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  placeholder="e.g. State Bank of India — Current A/C"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bank Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="e.g. State Bank of India"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Account Type *</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="current">Current Account</option>
                    <option value="savings">Savings Account</option>
                    <option value="cash_credit">Cash Credit (CC)</option>
                    <option value="overdraft">Overdraft (OD)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Account Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="e.g. 38940192834"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">IFSC Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                    placeholder="e.g. SBIN0001234"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono uppercase focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Branch</label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="e.g. Ring Road Branch"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">UPI ID</label>
                  <input
                    type="text"
                    value={formData.upiId}
                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    placeholder="e.g. jmg@sbi"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Linked GL Asset Account</label>
                <select
                  value={formData.linkedGlAccountId}
                  onChange={(e) => setFormData({ ...formData, linkedGlAccountId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="">-- Default Bank Account (1120) --</option>
                  {glAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.account_code} — {a.account_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isDefault" className="text-slate-700 font-medium cursor-pointer">
                  Set as Primary / Default Bank Account for Settlement
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                >
                  {isSaving ? 'Registering...' : 'Save Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
