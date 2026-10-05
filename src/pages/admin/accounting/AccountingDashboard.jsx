import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../../contexts/CompanyContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../config/permissions';
import { getAccountingMetrics } from '../../../features/accounting';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Receipt, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  BookOpen, 
  Calendar, 
  FileText, 
  PlusCircle, 
  Layers, 
  Building2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function AccountingDashboard() {
  const { currentCompany } = useCompany();
  const { hasPermission, isGroupOwner } = usePermissions();

  const [metrics, setMetrics] = useState({
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
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!currentCompany?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAccountingMetrics(currentCompany.id);
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load accounting metrics:', err);
      setError(err.message || 'Error fetching financial metrics');
    } finally {
      setIsLoading(false);
    }
  }, [currentCompany?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!currentCompany) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
        <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">No Company Selected</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
          Please select an active subsidiary from the top company switcher to access its General Ledger.
        </p>
      </div>
    );
  }

  const formatCurr = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Double-Entry ERP Ledger
            </span>
            <span className="text-xs text-slate-400 font-mono">
              FY 2026-27 (1 Apr – 31 Mar)
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            General Ledger & Accounting
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time financial status, control accounts, and statutory GAAP/Ind-AS reporting for{' '}
            <strong className="text-slate-800">{currentCompany.name}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {hasPermission(PERMISSIONS.ACCOUNTING_JOURNALS_CREATE) && (
            <Link
              to="/admin/accounting/manual-journal"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Journal Voucher</span>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Total Assets</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-slate-900">
              {formatCurr(metrics.totalAssets)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>AR: {formatCurr(metrics.accountsReceivable)}</span>
              <span>•</span>
              <span>Stock: {formatCurr(metrics.inventoryValue)}</span>
            </div>
          </div>
        </div>

        {/* Total Liabilities */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Total Liabilities</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-slate-900">
              {formatCurr(metrics.totalLiabilities)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>AP: {formatCurr(metrics.accountsPayable)}</span>
              <span>•</span>
              <span>GST Out: {formatCurr(metrics.outputGst)}</span>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Operating Revenue</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-slate-900">
              {formatCurr(metrics.totalRevenue)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>COGS: {formatCurr(metrics.totalCogs)}</span>
              <span>•</span>
              <span className="font-semibold text-emerald-600">
                Gross: {formatCurr(metrics.grossProfit)}
              </span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Net Operating Profit</span>
            <div className={`p-2 rounded-lg ${metrics.netProfit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {metrics.netProfit >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-bold font-mono ${metrics.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {formatCurr(metrics.netProfit)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Operating Exp: {formatCurr(metrics.operatingExpenses)}
            </div>
          </div>
        </div>
      </div>

      {/* Accounting Quick Navigation Hub */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Accounting Management Modules</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Master Books */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Masters & Accounts</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Chart of accounts, 4-digit ledger codes, account groups, and company bank accounts.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200">
              <Link
                to="/admin/accounting/accounts"
                className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center justify-between"
              >
                <span>Chart of Accounts (COA)</span>
                <span>→</span>
              </Link>
              <Link
                to="/admin/accounting/bank-accounts"
                className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center justify-between"
              >
                <span>Company Bank Accounts</span>
                <span>→</span>
              </Link>
              <Link
                to="/admin/accounting/opening-balances"
                className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center justify-between"
              >
                <span>Opening Balance Wizard</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Double-Entry Vouchers */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                <span>Journal Vouchers</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Immutable double-entry vouchers: Sales, Bills, Payments, GRN, COGS, and Adjustments.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200">
              <Link
                to="/admin/accounting/journals"
                className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center justify-between"
              >
                <span>Journal Register ({metrics.journalCount} Vouchers)</span>
                <span>→</span>
              </Link>
              <Link
                to="/admin/accounting/manual-journal"
                className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center justify-between"
              >
                <span>Post Manual Journal</span>
                <span>→</span>
              </Link>
              <Link
                to="/admin/accounting/fiscal-years"
                className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center justify-between"
              >
                <span>Fiscal Years & Monthly Periods</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Statutory Financial Reports */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Financial Statements</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Trial Balance, General Ledger, Profit & Loss, and Balance Sheet statements.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200">
              <Link
                to="/admin/accounting/trial-balance"
                className="text-xs font-medium text-emerald-600 hover:text-emerald-800 flex items-center justify-between"
              >
                <span>Trial Balance</span>
                <span>→</span>
              </Link>
              <Link
                to="/admin/accounting/general-ledger"
                className="text-xs font-medium text-emerald-600 hover:text-emerald-800 flex items-center justify-between"
              >
                <span>General Ledger (Account Statement)</span>
                <span>→</span>
              </Link>
              <Link
                to="/admin/accounting/profit-loss"
                className="text-xs font-medium text-emerald-600 hover:text-emerald-800 flex items-center justify-between"
              >
                <span>Profit & Loss (P&L)</span>
                <span>→</span>
              </Link>
              <Link
                to="/admin/accounting/balance-sheet"
                className="text-xs font-medium text-emerald-600 hover:text-emerald-800 flex items-center justify-between"
              >
                <span>Balance Sheet</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
