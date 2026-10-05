import React from 'react';
import { Link } from 'react-router-dom';
import { Printer, ExternalLink } from 'lucide-react';
import { PAYMENT_METHODS } from './paymentService';

export default function PaymentTable({
  payments = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  count = 0,
  pageSize = 25,
  onPageChange,
  onViewReceipt
}) {
  const getMethodLabel = (val) => {
    const found = PAYMENT_METHODS.find((m) => m.value === val);
    return found ? found.label : val;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-3" />
        <p className="text-xs text-slate-500 font-mono">Loading payment ledger entries...</p>
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-sm font-medium text-slate-700 mb-1">No payment transactions found</p>
        <p className="text-xs text-slate-500">
          No payments recorded under the current company selection or active filters.
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
              <th className="px-4 py-3">Receipt / Payment #</th>
              <th className="px-4 py-3">Invoice #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-3 py-3 font-mono">Date</th>
              <th className="px-3 py-3">Method</th>
              <th className="px-3 py-3">Reference / UTR</th>
              <th className="px-4 py-3 text-right">Amount (₹)</th>
              <th className="px-4 py-3 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                {/* Payment Number */}
                <td className="px-4 py-3 font-mono font-medium text-blue-600">
                  <button
                    type="button"
                    onClick={() => onViewReceipt(p.id)}
                    className="hover:underline flex items-center gap-1 text-left"
                    title="View Printable Receipt"
                  >
                    {p.payment_number}
                  </button>
                </td>

                {/* Linked Invoice */}
                <td className="px-4 py-3 font-mono text-slate-800">
                  {p.invoices ? (
                    <Link
                      to={`/admin/invoices/${p.invoices.id}`}
                      className="hover:text-blue-600 inline-flex items-center gap-1"
                    >
                      <span>{p.invoices.invoice_number}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  ) : (
                    '—'
                  )}
                </td>

                {/* Customer */}
                <td className="px-4 py-3 font-medium text-slate-800">
                  <div>{p.customers?.full_name || 'Customer'}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {p.customers?.customer_code}
                  </div>
                </td>

                {/* Company */}
                <td className="px-4 py-3 text-slate-700">
                  <span className="truncate block max-w-[160px]" title={p.companies?.name}>
                    {p.companies?.name}
                  </span>
                </td>

                {/* Payment Date */}
                <td className="px-3 py-3 font-mono text-slate-600 whitespace-nowrap">
                  {p.payment_date}
                </td>

                {/* Payment Method */}
                <td className="px-3 py-3 capitalize text-slate-700">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 border border-slate-200">
                    {getMethodLabel(p.payment_method)}
                  </span>
                </td>

                {/* Reference Number */}
                <td className="px-3 py-3 font-mono text-slate-500 text-[11px]">
                  {p.reference_number || '—'}
                </td>

                {/* Amount Paid */}
                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 text-sm">
                  ₹{Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>

                {/* Action: Receipt */}
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onViewReceipt(p.id)}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Print Receipt"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          Showing <span className="font-medium text-slate-800">{payments.length}</span> of{' '}
          <span className="font-medium text-slate-800">{count}</span> payments (Page {page} of {totalPages || 1})
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
