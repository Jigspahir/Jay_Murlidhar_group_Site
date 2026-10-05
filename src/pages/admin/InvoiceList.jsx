import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import {
  useInvoices,
  InvoiceTable,
  InvoiceFilters
} from '../../features/invoices';
import {
  Plus,
  RefreshCw,
  FileText,
  AlertCircle,
  XCircle,
  Building2
} from 'lucide-react';

export default function InvoiceList() {
  const { currentCompany, currentCompanyId, isAllCompanies, availableCompanies } = useCompany();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PERMISSIONS.INVOICES_CREATE);

  // In All Companies mode, allow filtering by specific company
  const [scopedCompanyFilter, setScopedCompanyFilter] = useState('');

  const effectiveCompanyId = isAllCompanies
    ? (scopedCompanyFilter === 'all' ? null : scopedCompanyFilter || null)
    : currentCompanyId;

  const {
    invoices,
    count,
    totalPages,
    page,
    setPage,
    pageSize,
    search,
    setSearch,
    status,
    setStatus,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    isLoading,
    error,
    refresh,
    issueInvoice,
    cancelInvoice
  } = useInvoices({
    companyId: effectiveCompanyId,
    isAllCompanies: isAllCompanies && !scopedCompanyFilter
  });

  // Cancellation Modal State
  const [cancellingInvoice, setCancellingInvoice] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelError, setCancelError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleIssue = async (id) => {
    if (!window.confirm('Are you sure you want to issue this invoice? Once issued, line items and calculations will become immutable.')) {
      return;
    }
    try {
      await issueInvoice(id);
    } catch (err) {
      alert(err.message || 'Failed to issue invoice.');
    }
  };

  const handleOpenCancelModal = (inv) => {
    setCancellingInvoice(inv);
    setCancellationReason('');
    setCancelError(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancellationReason || !cancellationReason.trim()) {
      setCancelError('Please specify the cancellation reason.');
      return;
    }

    try {
      setIsProcessing(true);
      await cancelInvoice(cancellingInvoice.id, cancellationReason);
      setCancellingInvoice(null);
      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      setCancelError(err.message || 'Failed to cancel invoice.');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('all');
    setDateFrom('');
    setDateTo('');
    setScopedCompanyFilter('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
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
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Commercial Invoices</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            GST & Non-Tax Invoicing, Concurrency-Safe Sequence, and Payment Tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
            title="Refresh Invoices"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {canCreate && (
            <Link
              to="/admin/invoices/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Invoice</span>
            </Link>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
          <div>
            <span className="font-semibold block">Failed to load invoices</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Company Scoping Selector for All Companies Mode */}
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
      <InvoiceFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onReset={handleResetFilters}
      />

      {/* Invoices Table */}
      <InvoiceTable
        invoices={invoices}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        count={count}
        pageSize={pageSize}
        onPageChange={setPage}
        onIssue={handleIssue}
        onCancelClick={handleOpenCancelModal}
      />

      {/* Cancel Invoice Modal */}
      {cancellingInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cancel Commercial Invoice</h3>
                <p className="text-xs text-slate-500 font-mono">{cancellingInvoice.invoice_number}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Cancellation is an audited financial action. The invoice status will be marked as cancelled, and it cannot be re-issued or settled.
            </p>

            {cancelError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {cancelError}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Cancellation Reason *
              </label>
              <textarea
                rows="3"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Specify reason (e.g. Order cancelled by client, duplicate invoice)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingInvoice(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg shadow-sm transition-all"
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
