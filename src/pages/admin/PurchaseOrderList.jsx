import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  usePurchaseOrders, 
  POTable, 
  POFilters 
} from '../../features/purchaseOrders';
import { 
  Plus, 
  RefreshCw, 
  Building2, 
  AlertCircle,
  ShoppingBag
} from 'lucide-react';

export default function PurchaseOrderList() {
  const { currentCompany, currentCompanyId, isAllCompanies, availableCompanies } = useCompany();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PERMISSIONS.PURCHASE_ORDERS_CREATE);

  const [scopedCompanyFilter, setScopedCompanyFilter] = useState('');

  const effectiveCompanyId = isAllCompanies 
    ? (scopedCompanyFilter === 'all' ? null : scopedCompanyFilter || null)
    : currentCompanyId;

  const {
    purchaseOrders,
    count,
    totalPages,
    page,
    setPage,
    pageSize,
    search,
    setSearch,
    status,
    setStatus,
    approvalStatus,
    setApprovalStatus,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    isLoading,
    error,
    refresh
  } = usePurchaseOrders({
    companyId: effectiveCompanyId,
    isAllCompanies: isAllCompanies && !scopedCompanyFilter
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              Purchase Orders
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {count} {count === 1 ? 'order' : 'orders'}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage procurement commitments, approval workflows, and billing progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refresh}
            disabled={isLoading}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {canCreate && (
            <Link
              to="/admin/purchase-orders/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:scale-[1.01]"
            >
              <Plus className="w-4 h-4" />
              Create Purchase Order
            </Link>
          )}
        </div>
      </div>

      {/* Scope Banner in All Companies mode */}
      {isAllCompanies && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-800 dark:text-amber-300 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 shrink-0" />
            <span>Viewing purchase orders across all companies. Each order is isolated to its issuing company.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Filter by Company:</span>
            <select
              value={scopedCompanyFilter}
              onChange={(e) => {
                setScopedCompanyFilter(e.target.value);
                setPage(1);
              }}
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

      {/* Filters Bar */}
      <POFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        approvalStatus={approvalStatus}
        onApprovalStatusChange={setApprovalStatus}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onReset={() => {
          setSearch('');
          setStatus('');
          setApprovalStatus('');
          setDateFrom('');
          setDateTo('');
          setPage(1);
        }}
      />

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={refresh} className="ml-auto underline font-medium">Retry</button>
        </div>
      )}

      {/* PO Table */}
      <POTable
        purchaseOrders={purchaseOrders}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalCount={count}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </div>
  );
}
