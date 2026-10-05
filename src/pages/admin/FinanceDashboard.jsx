import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import {
  getFinanceDashboardSummary,
  FinanceOverviewCards
} from '../../features/finance';
import {
  DollarSign,
  Building2,
  RefreshCw,
  Plus,
  CreditCard,
  Receipt,
  FileBarChart,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function FinanceDashboard() {
  const { currentCompany, currentCompanyId, isAllCompanies, availableCompanies } = useCompany();
  const { hasPermission } = usePermissions();

  const canCreateInvoice = hasPermission(PERMISSIONS.INVOICES_CREATE);
  const canCreateExpense = hasPermission(PERMISSIONS.EXPENSES_CREATE);
  const canViewReports = hasPermission(PERMISSIONS.FINANCE_REPORTS);

  const [scopedCompanyFilter, setScopedCompanyFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const effectiveCompanyId = isAllCompanies
    ? (scopedCompanyFilter === 'all' ? null : scopedCompanyFilter || null)
    : currentCompanyId;

  const loadSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getFinanceDashboardSummary({
        companyId: effectiveCompanyId,
        isAllCompanies: isAllCompanies && !scopedCompanyFilter,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null
      });
      setSummary(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to aggregate financial metrics.');
      setIsLoading(false);
    }
  }, [effectiveCompanyId, isAllCompanies, scopedCompanyFilter, dateFrom, dateTo]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const applyPreset = (preset) => {
    const today = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const toYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (preset === 'today') {
      const d = toYMD(today);
      setDateFrom(d);
      setDateTo(d);
    } else if (preset === 'this_week') {
      const first = new Date(today.setDate(today.getDate() - today.getDay() + 1));
      const last = new Date(today.setDate(today.getDate() - today.getDay() + 7));
      setDateFrom(toYMD(first));
      setDateTo(toYMD(last));
    } else if (preset === 'this_month') {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setDateFrom(toYMD(first));
      setDateTo(toYMD(last));
    } else if (preset === 'prev_month') {
      const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const last = new Date(today.getFullYear(), today.getMonth(), 0);
      setDateFrom(toYMD(first));
      setDateTo(toYMD(last));
    } else if (preset === 'this_fy') {
      const currentYear = today.getFullYear();
      const fyStart = today.getMonth() >= 3 ? currentYear : currentYear - 1;
      const start = new Date(fyStart, 3, 1);
      const end = new Date(fyStart + 1, 2, 31);
      setDateFrom(toYMD(start));
      setDateTo(toYMD(end));
    } else if (preset === 'all_time') {
      setDateFrom('');
      setDateTo('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {isAllCompanies
                ? 'Consolidated Portfolio &bull; All 6 JMG Companies'
                : currentCompany?.name || 'Company Scoped'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <span>Commercial Finance & Billing Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-Time Revenue, Collections, Receivables Aging, and Operating Position
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadSummary}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {canCreateInvoice && (
            <Link
              to="/admin/invoices/new"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Invoice</span>
            </Link>
          )}

          {canCreateExpense && (
            <Link
              to="/admin/expenses/new"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Record Expense</span>
            </Link>
          )}

          {canViewReports && (
            <Link
              to="/admin/reports/finance"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium shadow-xs transition-colors"
            >
              <FileBarChart className="w-3.5 h-3.5 text-blue-600" />
              <span>Reports</span>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
          <div>
            <span className="font-semibold block">Failed to aggregate finance data</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Date Range & Scoping Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Period:
            </span>
            <button
              onClick={() => applyPreset('today')}
              className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              Today
            </button>
            <button
              onClick={() => applyPreset('this_week')}
              className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              This Week
            </button>
            <button
              onClick={() => applyPreset('this_month')}
              className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              This Month
            </button>
            <button
              onClick={() => applyPreset('prev_month')}
              className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              Previous Month
            </button>
            <button
              onClick={() => applyPreset('this_fy')}
              className="px-2.5 py-1 rounded-md text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium"
            >
              This Financial Year (Apr-Mar)
            </button>
            <button
              onClick={() => applyPreset('all_time')}
              className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              All Time
            </button>
          </div>

          {/* Custom Date Pickers */}
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-2 py-1 rounded border border-slate-300 text-xs bg-white"
              title="From Date"
            />
            <span className="text-slate-400 font-mono">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-2 py-1 rounded border border-slate-300 text-xs bg-white"
              title="To Date"
            />
          </div>
        </div>

        {/* Company Scoping in All Companies Mode */}
        {isAllCompanies && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 font-medium flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              Company Breakdown Filter:
            </span>
            <select
              value={scopedCompanyFilter}
              onChange={(e) => setScopedCompanyFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Companies (Consolidated)</option>
              {availableCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Primary KPI Cards & Status Pipeline Breakdown */}
      <FinanceOverviewCards summary={summary} isLoading={isLoading} />

      {/* Navigation Quick Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/invoices"
          className="p-5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
              Manage Invoices &rarr;
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Plus className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Create new commercial bills, issue drafts, view tax breakdowns, and track balances.
          </p>
        </Link>

        <Link
          to="/admin/payments"
          className="p-5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">
              Payment Receipts Ledger &rarr;
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Track settled payments, view receipts, and monitor partial customer payments.
          </p>
        </Link>

        <Link
          to="/admin/expenses"
          className="p-5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 group-hover:text-purple-600">
              Operating Disbursements &rarr;
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Record office rent, staff honorariums, utilities, hardware inventory, and domain costs.
          </p>
        </Link>
      </div>
    </div>
  );
}
