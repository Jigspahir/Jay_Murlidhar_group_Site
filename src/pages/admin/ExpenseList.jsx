import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import {
  useExpenses,
  ExpenseTable,
  ExpenseFilters
} from '../../features/expenses';
import {
  Plus,
  RefreshCw,
  Receipt,
  AlertCircle,
  XCircle,
  Building2
} from 'lucide-react';

export default function ExpenseList() {
  const { currentCompany, currentCompanyId, isAllCompanies, availableCompanies } = useCompany();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PERMISSIONS.EXPENSES_CREATE);

  const [scopedCompanyFilter, setScopedCompanyFilter] = useState('');

  const effectiveCompanyId = isAllCompanies
    ? (scopedCompanyFilter === 'all' ? null : scopedCompanyFilter || null)
    : currentCompanyId;

  const {
    expenses,
    count,
    totalPages,
    page,
    setPage,
    pageSize,
    search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    isLoading,
    error,
    refresh,
    cancelExpense
  } = useExpenses({
    companyId: effectiveCompanyId,
    isAllCompanies: isAllCompanies && !scopedCompanyFilter
  });

  const [cancellingExpense, setCancellingExpense] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmCancel = async () => {
    if (!cancellingExpense) return;
    try {
      setIsProcessing(true);
      await cancelExpense(cancellingExpense.id);
      setCancellingExpense(null);
      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      alert(err.message || 'Failed to cancel expense.');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setStatus('all');
    setDateFrom('');
    setDateTo('');
    setScopedCompanyFilter('');
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {isAllCompanies
                ? 'Consolidated View &bull; All JMG Companies'
                : currentCompany?.name || 'Company Scoped'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-purple-600" />
            <span>Operating Expenses</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational Disbursements, Controlled Cost Categories, and Company Scoped Vouchers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
            title="Refresh Expenses"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {canCreate && (
            <Link
              to="/admin/expenses/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Record Expense</span>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
          <div>
            <span className="font-semibold block">Failed to load expenses</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Company Scoping in All Companies Mode */}
      {isAllCompanies && (
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-blue-900 font-medium flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-600" />
            Filter by Operating Company:
          </span>
          <select
            value={scopedCompanyFilter}
            onChange={(e) => setScopedCompanyFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-blue-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

      {/* Filters Strip */}
      <ExpenseFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onReset={handleResetFilters}
      />

      {/* Expenses Table */}
      <ExpenseTable
        expenses={expenses}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        count={count}
        pageSize={pageSize}
        onPageChange={setPage}
        onCancelClick={(exp) => setCancellingExpense(exp)}
      />

      {/* Cancel Confirmation Modal */}
      {cancellingExpense && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cancel Expense Voucher</h3>
                <p className="text-xs text-slate-500 font-mono">{cancellingExpense.expense_number}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to mark this expense as cancelled? This voucher will be excluded from active operating totals.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingExpense(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg shadow-sm"
              >
                {isProcessing ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
