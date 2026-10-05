import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, Send, XCircle, Printer } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';

const STATUS_BADGES = {
  draft: 'bg-slate-100 text-slate-700 border-slate-300',
  issued: 'bg-blue-50 text-blue-700 border-blue-200',
  partially_paid: 'bg-amber-50 text-amber-700 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  overdue: 'bg-rose-50 text-rose-700 border-rose-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-300 line-through'
};

export default function InvoiceTable({
  invoices = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  count = 0,
  pageSize = 25,
  onPageChange,
  onIssue,
  onCancelClick
}) {
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(PERMISSIONS.INVOICES_EDIT);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-3" />
        <p className="text-xs text-slate-500 font-mono">Loading commercial invoices...</p>
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-sm font-medium text-slate-700 mb-1">No invoices found</p>
        <p className="text-xs text-slate-500">
          No billing records match the current company selection or active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-3">Invoice #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Due Date</th>
              <th className="px-3 py-3 text-right">Total</th>
              <th className="px-3 py-3 text-right">Paid</th>
              <th className="px-3 py-3 text-right">Balance</th>
              <th className="px-3 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => {
              const badgeCls = STATUS_BADGES[inv.status] || STATUS_BADGES.draft;
              const isOverdue = inv.status !== 'paid' && inv.status !== 'cancelled' && inv.due_date < todayStr;
              const displayStatus = isOverdue && inv.status === 'issued' ? 'overdue' : inv.status;

              return (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Invoice Number */}
                  <td className="px-4 py-3 font-mono font-medium text-slate-900">
                    <Link
                      to={`/admin/invoices/${inv.id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {inv.invoice_number}
                    </Link>
                    {inv.is_tax_invoice && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200">
                        GST
                      </span>
                    )}
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{inv.customer_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {inv.customer_phone || inv.customer_email || '—'}
                    </div>
                  </td>

                  {/* Company */}
                  <td className="px-4 py-3 text-slate-700">
                    <span className="truncate block max-w-[160px]" title={inv.companies?.name || inv.company_name}>
                      {inv.companies?.name || inv.company_name}
                    </span>
                  </td>

                  {/* Invoice Date */}
                  <td className="px-3 py-3 font-mono text-slate-600 whitespace-nowrap">
                    {inv.invoice_date}
                  </td>

                  {/* Due Date */}
                  <td className="px-3 py-3 font-mono whitespace-nowrap">
                    <span className={isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                      {inv.due_date}
                    </span>
                  </td>

                  {/* Total Amount */}
                  <td className="px-3 py-3 text-right font-mono font-semibold text-slate-900">
                    ₹{Number(inv.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Amount Paid */}
                  <td className="px-3 py-3 text-right font-mono text-emerald-600">
                    ₹{Number(inv.amount_paid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Balance Due */}
                  <td className="px-3 py-3 text-right font-mono font-bold text-slate-800">
                    ₹{Number(inv.balance_due || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Status */}
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border ${badgeCls}`}
                    >
                      {displayStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Detail */}
                      <Link
                        to={`/admin/invoices/${inv.id}`}
                        className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                        title="View Full Invoice Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      {/* Print View */}
                      <Link
                        to={`/admin/invoices/${inv.id}?print=1`}
                        className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        title="Print Invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </Link>

                      {/* Edit Draft */}
                      {inv.status === 'draft' && canEdit && (
                        <Link
                          to={`/admin/invoices/${inv.id}/edit`}
                          className="p-1 rounded text-amber-600 hover:text-amber-800 hover:bg-amber-50 transition-colors"
                          title="Edit Draft"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      {/* Issue Invoice */}
                      {inv.status === 'draft' && canEdit && (
                        <button
                          type="button"
                          onClick={() => onIssue(inv.id)}
                          className="p-1 rounded text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                          title="Issue Invoice"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Cancel Invoice */}
                      {inv.status !== 'cancelled' && inv.status !== 'paid' && Number(inv.amount_paid) === 0 && canEdit && (
                        <button
                          type="button"
                          onClick={() => onCancelClick(inv)}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Cancel Invoice"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          Showing <span className="font-medium text-slate-800">{invoices.length}</span> of{' '}
          <span className="font-medium text-slate-800">{count}</span> records (Page {page} of {totalPages || 1})
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-2 font-mono">{page} / {totalPages}</span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
