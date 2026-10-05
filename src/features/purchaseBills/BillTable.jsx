import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Building2, Receipt, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';
import { BILL_STATUSES, BILL_PAYMENT_STATUSES } from './purchaseBillService';

export default function BillTable({
  purchaseBills = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange,
  onRecordPayment
}) {
  const getStatusBadge = (status) => {
    const meta = BILL_STATUSES.find((s) => s.value === status) || { label: status, color: 'slate' };
    const colorClasses = {
      slate: 'bg-slate-100 text-slate-700 border-slate-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rose: 'bg-rose-50 text-rose-700 border-rose-200',
      gray: 'bg-slate-100 text-slate-500 border-slate-200'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${colorClasses[meta.color] || colorClasses.slate}`}>
        {meta.label}
      </span>
    );
  };

  const getPaymentBadge = (payStatus) => {
    const meta = BILL_PAYMENT_STATUSES.find((p) => p.value === payStatus) || { label: payStatus, color: 'slate' };
    const colorClasses = {
      rose: 'bg-rose-100 text-rose-800',
      amber: 'bg-amber-100 text-amber-800',
      emerald: 'bg-emerald-100 text-emerald-800'
    };
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${colorClasses[meta.color] || colorClasses.slate}`}>
        {meta.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Loading purchase bills...</p>
      </div>
    );
  }

  if (purchaseBills.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-700">No Supplier Bills Found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No supplier invoices match the selected criteria. Record a direct supplier bill or convert an approved PO to establish payables.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Internal Bill #</th>
              <th className="py-3 px-4">Vendor Inv #</th>
              <th className="py-3 px-4">Vendor</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Bill Date</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4 text-right">Total (₹)</th>
              <th className="py-3 px-4 text-right">Balance Due (₹)</th>
              <th className="py-3 px-4 text-center">Settlement</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {purchaseBills.map((b) => {
              const total = Number(b.total_amount) || 0;
              const balance = Number(b.balance_due) || 0;
              const paid = Number(b.amount_paid) || 0;

              return (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-blue-600">
                    <Link to={`/admin/purchase-bills/${b.id}`} className="hover:underline">
                      {b.bill_number}
                    </Link>
                    {b.purchase_orders?.po_number && (
                      <div className="text-[10px] text-slate-400 font-mono">
                        PO: {b.purchase_orders.po_number}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                    {b.vendor_invoice_number}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{b.vendors?.legal_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{b.vendors?.vendor_code}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {b.companies?.name || 'Company'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    {b.bill_date}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    {b.due_date}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    <span className={balance > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                      ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getPaymentBadge(b.payment_status)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(b.status)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      {balance > 0 && b.status === 'recorded' && onRecordPayment && (
                        <button
                          type="button"
                          onClick={() => onRecordPayment(b)}
                          className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                          title="Record Vendor Payment"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      )}
                      <Link
                        to={`/admin/purchase-bills/${b.id}`}
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Bill Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {paid === 0 && b.status !== 'cancelled' && (
                        <Link
                          to={`/admin/purchase-bills/${b.id}/edit`}
                          className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                          title="Edit Bill"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Strip */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
        <div>
          Showing {purchaseBills.length} of {totalCount} records
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-1 rounded border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-slate-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1 rounded border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-slate-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
