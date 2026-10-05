import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  usePurchaseBills, 
  BillTable, 
  BillFilters 
} from '../../features/purchaseBills';
import { VendorPaymentModal } from '../../features/vendorPayments';
import { 
  Plus, 
  RefreshCw, 
  Building2, 
  AlertCircle,
  Receipt
} from 'lucide-react';

export default function PurchaseBillList() {
  const { currentCompany, currentCompanyId, isAllCompanies, availableCompanies } = useCompany();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PERMISSIONS.PURCHASE_BILLS_CREATE);

  const [scopedCompanyFilter, setScopedCompanyFilter] = useState('');

  const effectiveCompanyId = isAllCompanies 
    ? (scopedCompanyFilter === 'all' ? null : scopedCompanyFilter || null)
    : currentCompanyId;

  const {
    bills,
    count,
    totalPages,
    page,
    setPage,
    pageSize,
    search,
    setSearch,
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    isLoading,
    error,
    refresh
  } = usePurchaseBills({
    companyId: effectiveCompanyId,
    isAllCompanies: isAllCompanies && !scopedCompanyFilter
  });

  // Payment Modal state for quick settlement
  const [selectedBillForPayment, setSelectedBillForPayment] = useState(null);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              Supplier Bills
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {count} {count === 1 ? 'bill' : 'bills'}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Accounts payable register, direct vendor invoices, and PO-linked supplier bills.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refresh}
            disabled={isLoading}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            title="Refresh bills"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {canCreate && (
            <Link
              to="/admin/purchase-bills/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:scale-[1.01]"
            >
              <Plus className="w-4 h-4" />
              Record Supplier Bill
            </Link>
          )}
        </div>
      </div>

      {/* Scope Banner in All Companies mode */}
      {isAllCompanies && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-800 dark:text-amber-300 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 shrink-0" />
            <span>Viewing supplier bills across all companies. Payables are isolated per legal entity.</span>
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
      <BillFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={setPaymentStatus}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onReset={() => {
          setSearch('');
          setStatus('');
          setPaymentStatus('');
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

      {/* Bill Table */}
      <BillTable
        bills={bills}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalCount={count}
        pageSize={pageSize}
        onPageChange={setPage}
        onRecordPayment={(bill) => setSelectedBillForPayment(bill)}
      />

      {/* Quick Settlement Modal */}
      {selectedBillForPayment && (
        <VendorPaymentModal
          bill={selectedBillForPayment}
          isOpen={!!selectedBillForPayment}
          onClose={() => setSelectedBillForPayment(null)}
          onSuccess={() => {
            setSelectedBillForPayment(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}
