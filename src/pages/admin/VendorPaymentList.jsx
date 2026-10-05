import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { 
  useVendorPayments, 
  VendorPaymentTable 
} from '../../features/vendorPayments';
import { 
  CreditCard, 
  RefreshCw, 
  Building2, 
  AlertCircle,
  Search,
  Filter,
  FileSpreadsheet
} from 'lucide-react';

export default function VendorPaymentList() {
  const { currentCompany, currentCompanyId, isAllCompanies, availableCompanies } = useCompany();

  const [scopedCompanyFilter, setScopedCompanyFilter] = useState('');

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
  } = useVendorPayments({
    companyId: effectiveCompanyId,
    isAllCompanies: isAllCompanies && !scopedCompanyFilter
  });

  const exportCSV = () => {
    if (!payments.length) return;
    const headers = ['Payment Number', 'Vendor', 'Bill Number', 'Company', 'Date', 'Method', 'Reference', 'Amount'];
    const rows = payments.map((p) => [
      p.payment_number,
      `"${p.vendors?.legal_name || ''}"`,
      p.purchase_bills?.bill_number || '',
      `"${p.companies?.name || ''}"`,
      p.payment_date,
      p.payment_method,
      `"${p.reference_number || ''}"`,
      Number(p.amount).toFixed(2)
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vendor_Payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              Vendor Payment Ledger
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {count} {count === 1 ? 'disbursement' : 'disbursements'}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dedicated Money OUT disbursements against supplier bills and accounts payable.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refresh}
            disabled={isLoading}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            title="Refresh payments"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={exportCSV}
            disabled={!payments.length}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>

          <Link
            to="/admin/purchase-bills"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:scale-[1.01]"
          >
            Pay Open Bill
          </Link>
        </div>
      </div>

      {/* Scope Banner in All Companies mode */}
      {isAllCompanies && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-800 dark:text-amber-300 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 shrink-0" />
            <span>Viewing disbursements across all companies. Each payment is tied to its originating entity.</span>
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search payment #, ref..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Payment Method */}
          <div>
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">All Payment Methods</option>
              <option value="bank_transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
              <option value="upi">UPI</option>
              <option value="cheque">Cheque</option>
              <option value="cash">Cash</option>
              <option value="card">Debit / Credit Card</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Date To */}
          <div>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={refresh} className="ml-auto underline font-medium">Retry</button>
        </div>
      )}

      {/* Table */}
      <VendorPaymentTable
        payments={payments}
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
