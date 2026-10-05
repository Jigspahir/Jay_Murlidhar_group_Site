import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useCompany } from '../../../contexts/CompanyContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../config/permissions';
import { 
  getAccounts, 
  getAccountTemplates, 
  createAccount, 
  provisionCompanyAccounts,
  ACCOUNT_CLASSES 
} from '../../../features/accounting';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Layers, 
  Sliders, 
  AlertCircle,
  FileDown
} from 'lucide-react';

export default function AccountList() {
  const { currentCompany } = useCompany();
  const { hasPermission } = usePermissions();

  const [accounts, setAccounts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    accountCode: '',
    accountName: '',
    accountClass: 'expense',
    accountType: 'operating_expense',
    normalBalance: 'debit',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!currentCompany?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [accs, tmpls] = await Promise.all([
        getAccounts(currentCompany.id),
        getAccountTemplates()
      ]);
      setAccounts(accs);
      setTemplates(tmpls);
    } catch (err) {
      console.error('Failed to load accounts:', err);
      setError(err.message || 'Error fetching chart of accounts.');
    } finally {
      setIsLoading(false);
    }
  }, [currentCompany?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleProvision = async () => {
    if (!currentCompany?.id) return;
    setIsProvisioning(true);
    setError(null);
    try {
      await provisionCompanyAccounts(currentCompany.id);
      setSuccessMsg('Standard Chart of Accounts successfully provisioned.');
      await loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Provisioning error:', err);
      setError(err.message || 'Failed to provision accounts.');
    } finally {
      setIsProvisioning(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!currentCompany?.id) return;
    setIsSaving(true);
    setError(null);
    try {
      await createAccount({
        companyId: currentCompany.id,
        accountCode: formData.accountCode,
        accountName: formData.accountName,
        accountClass: formData.accountClass,
        accountType: formData.accountType,
        normalBalance: formData.normalBalance,
        description: formData.description
      });
      setIsModalOpen(false);
      setFormData({
        accountCode: '',
        accountName: '',
        accountClass: 'expense',
        accountType: 'operating_expense',
        normalBalance: 'debit',
        description: ''
      });
      setSuccessMsg('Account created successfully.');
      await loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Account creation error:', err);
      setError(err.message || 'Failed to create account.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchClass = selectedClass === 'all' || acc.account_class === selectedClass;
      const matchSearch =
        !searchQuery ||
        acc.account_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.account_name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchSearch;
    });
  }, [accounts, selectedClass, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Chart of Accounts
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            4-digit numeric account hierarchy (Model C) for{' '}
            <strong className="text-slate-800">{currentCompany?.name}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasPermission(PERMISSIONS.ACCOUNTING_ACCOUNTS_MANAGE) && (
            <>
              <button
                onClick={handleProvision}
                disabled={isProvisioning}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all"
                title="Populate missing standard accounts from template dictionary"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProvisioning ? 'animate-spin' : ''}`} />
                <span>Sync Standard Accounts</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Sub-Account</span>
              </button>
            </>
          )}
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

      {/* Tabs & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Class Filters */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setSelectedClass('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedClass === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({accounts.length})
            </button>
            {ACCOUNT_CLASSES.map((cls) => {
              const count = accounts.filter((a) => a.account_class === cls.value).length;
              return (
                <button
                  key={cls.value}
                  onClick={() => setSelectedClass(cls.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedClass === cls.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cls.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code or name..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Dense Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Account Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Account Type</th>
                <th className="py-3 px-4">Normal Balance</th>
                <th className="py-3 px-4">Origin</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading chart of accounts...
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No accounts found matching filters.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                      {acc.account_code}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-800">
                      <div>{acc.account_name}</div>
                      {acc.description && (
                        <div className="text-[10px] text-slate-400">{acc.description}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {acc.account_class}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600">
                      {acc.account_type}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                        acc.normal_balance === 'debit' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {acc.normal_balance}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      {acc.is_system ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                          Template
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700">
                          Custom
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      {acc.is_active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 font-medium text-[11px]">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Sub-Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Create Custom Sub-Account</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="p-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Account Code (e.g. 1120.01) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.accountCode}
                  onChange={(e) => setFormData({ ...formData, accountCode: e.target.value })}
                  placeholder="e.g. 6110.01"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Account Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  placeholder="e.g. Office Rent — Surat Branch"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Account Class *</label>
                  <select
                    value={formData.accountClass}
                    onChange={(e) => {
                      const cls = e.target.value;
                      const norm = (cls === 'asset' || cls === 'cogs' || cls === 'expense') ? 'debit' : 'credit';
                      setFormData({ ...formData, accountClass: cls, normalBalance: norm });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    {ACCOUNT_CLASSES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Normal Balance *</label>
                  <select
                    value={formData.normalBalance}
                    onChange={(e) => setFormData({ ...formData, normalBalance: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  >
                    <option value="debit">DEBIT</option>
                    <option value="credit">CREDIT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Account Type Key *</label>
                <input
                  type="text"
                  required
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                  placeholder="e.g. operating_expense"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional ledger description..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
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
                  {isSaving ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
