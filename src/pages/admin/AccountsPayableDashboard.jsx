import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { payablesService, PayablesOverviewCards } from '../../features/finance';
import {
  CreditCard,
  Building2,
  RefreshCw,
  Plus,
  Receipt,
  ShoppingBag,
  Truck,
  ArrowRight,
  Clock,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

export default function AccountsPayableDashboard() {
  const { currentCompany, currentCompanyId, isAllCompanies, availableCompanies } = useCompany();

  const [scopedCompanyFilter, setScopedCompanyFilter] = useState('');
  const [summary, setSummary] = useState(null);
  const [aging, setAging] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const effectiveCompanyId = isAllCompanies
    ? (scopedCompanyFilter === 'all' ? null : scopedCompanyFilter || null)
    : currentCompanyId;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sumData, ageData] = await Promise.all([
        payablesService.getPayablesSummary(effectiveCompanyId),
        payablesService.getPayablesAging(effectiveCompanyId)
      ]);
      setSummary(sumData);
      setAging(ageData);
    } catch (err) {
      console.error('Error loading payables dashboard:', err);
      setError(err.message || 'Failed to load payables data');
    } finally {
      setIsLoading(false);
    }
  }, [effectiveCompanyId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Accounts Payable & Procurement
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Supplier payables, aging analysis, purchase commitments, and cash disbursement overview.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            title="Refresh dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/admin/reports/payables"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Payables Reports
          </Link>

          <Link
            to="/admin/purchase-bills/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" />
            Record Bill
          </Link>
        </div>
      </div>

      {/* Scope Banner in All Companies mode */}
      {isAllCompanies && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-800 dark:text-amber-300 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 shrink-0" />
            <span>Viewing group-wide consolidated payables metrics.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Filter by Company:</span>
            <select
              value={scopedCompanyFilter}
              onChange={(e) => setScopedCompanyFilter(e.target.value)}
              className="text-xs rounded-lg border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-2.5 py-1"
            >
              <option value="all">All Group Companies</option>
              {availableCompanies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3 text-rose-700 dark:text-rose-300 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={loadData} className="ml-auto underline font-medium">Retry</button>
        </div>
      )}

      {/* KPI Cards */}
      <PayablesOverviewCards summary={summary} isLoading={isLoading} />

      {/* Payables Aging Buckets */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Payables Aging Analysis
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Outstanding supplier liabilities segmented by overdue maturity.
            </p>
          </div>
          <Link
            to="/admin/reports/payables?tab=aging"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Detailed Aging Report <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          {/* Current */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Current (Not Due)</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{aging?.summary.current.count || 0} bills</span>
            </div>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              ₹{Number(aging?.summary.current.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* 1-15 Days */}
          <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
            <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 mb-1">
              <span>1–15 Days Overdue</span>
              <span className="font-semibold">{aging?.summary.days_1_15.count || 0} bills</span>
            </div>
            <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
              ₹{Number(aging?.summary.days_1_15.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* 16-30 Days */}
          <div className="p-4 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/40">
            <div className="flex items-center justify-between text-xs text-orange-700 dark:text-orange-400 mb-1">
              <span>16–30 Days Overdue</span>
              <span className="font-semibold">{aging?.summary.days_16_30.count || 0} bills</span>
            </div>
            <div className="text-xl font-bold font-mono text-orange-600 dark:text-orange-400">
              ₹{Number(aging?.summary.days_16_30.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* 30+ Days */}
          <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40">
            <div className="flex items-center justify-between text-xs text-rose-700 dark:text-rose-400 mb-1">
              <span>30+ Days Overdue</span>
              <span className="font-semibold">{aging?.summary.days_31_plus.count || 0} bills</span>
            </div>
            <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
              ₹{Number(aging?.summary.days_31_plus.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Link
          to="/admin/vendors"
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors group flex items-center justify-between"
        >
          <div>
            <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              Vendor Master
            </div>
            <div className="text-xs text-slate-500">Manage supplier directories</div>
          </div>
          <Truck className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
        </Link>

        <Link
          to="/admin/purchase-orders"
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors group flex items-center justify-between"
        >
          <div>
            <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              Purchase Orders
            </div>
            <div className="text-xs text-slate-500">Approvals & commitments</div>
          </div>
          <ShoppingBag className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
        </Link>

        <Link
          to="/admin/purchase-bills"
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors group flex items-center justify-between"
        >
          <div>
            <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              Supplier Bills
            </div>
            <div className="text-xs text-slate-500">Accounts payable vouchers</div>
          </div>
          <Receipt className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
        </Link>

        <Link
          to="/admin/vendor-payments"
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors group flex items-center justify-between"
        >
          <div>
            <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              Vendor Payments
            </div>
            <div className="text-xs text-slate-500">Money OUT disbursements</div>
          </div>
          <CreditCard className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
        </Link>
      </div>
    </div>
  );
}
