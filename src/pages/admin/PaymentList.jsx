import React, { useState } from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import {
  usePayments,
  PaymentTable,
  PaymentReceiptView,
  getPaymentById,
  PAYMENT_METHODS
} from '../../features/payments';
import { CreditCard, Building2, RefreshCw, AlertCircle, Search, RotateCcw, Calendar } from 'lucide-react';

export default function PaymentList() {
  const { currentCompany, currentCompanyId, isAllCompanies, availableCompanies } = useCompany();

  const [scopedCompanyFilter, setScopedCompanyFilter] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const effectiveCompanyId = isAllCompanies
    ? (scopedCompanyFilter === 'all' ? null : scopedCompanyFilter || null)
    : currentCompanyId;

  const {
    payments,
    count,
    totalPages,
    page,
    setPage,
    pageSize,
    search,
    setSearch,
    paymentMethod,
    setPaymentMethod,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    isLoading,
    error,
    refresh
  } = usePayments({
    companyId: effectiveCompanyId,
    isAllCompanies: isAllCompanies && !scopedCompanyFilter
  });

  const handleViewReceipt = async (paymentId) => {
    try {
      const data = await getPaymentById(paymentId);
      setSelectedReceipt(data);
    } catch (err) {
      alert(err.message || 'Failed to load receipt.');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setPaymentMethod('all');
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
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <span>Payment Receipts Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-Trail of All Commercial Invoice Settlements & Printable Official Receipts
          </p>
        </div>

        <button
          onClick={refresh}
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs self-start sm:self-auto"
          title="Refresh Payments"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
          <div>
            <span className="font-semibold block">Failed to load payments</span>
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
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by receipt # or reference..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="all">All Payment Methods</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              title="Payment Date From"
              className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              title="Payment Date To"
              className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white"
            />
          </div>

          <div className="md:col-span-1 flex items-center">
            <button
              onClick={handleResetFilters}
              type="button"
              className="w-full h-[34px] inline-flex items-center justify-center gap-1 px-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Clear filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <PaymentTable
        payments={payments}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        count={count}
        pageSize={pageSize}
        onPageChange={setPage}
        onViewReceipt={handleViewReceipt}
      />

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <PaymentReceiptView
          payment={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
