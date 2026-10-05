import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { VENDOR_PAYMENT_METHODS } from './vendorPaymentService';

export default function VendorPaymentTable({
  vendorPayments = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange
}) {
  const getMethodLabel = (method) => {
    const found = VENDOR_PAYMENT_METHODS.find((m) => m.value === method);
    return found ? found.label : method;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Loading vendor payment ledger...</p>
      </div>
    );
  }

  if (vendorPayments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-700">No Disbursements Found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No vendor payment transactions have been logged. Settle supplier bills to record cash or bank outflows.
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
              <th className="py-3 px-4">Payment Voucher #</th>
              <th className="py-3 px-4">Vendor</th>
              <th className="py-3 px-4">Supplier Bill</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Payment Date</th>
              <th className="py-3 px-4">Method & UTR</th>
              <th className="py-3 px-4 text-right">Disbursed (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {vendorPayments.map((p) => {
              const amount = Number(p.amount) || 0;

              return (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-blue-600">
                    {p.payment_number}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{p.vendors?.legal_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{p.vendors?.vendor_code}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/admin/purchase-bills/${p.bill_id}`}
                      className="font-mono text-blue-600 hover:underline"
                    >
                      {p.purchase_bills?.bill_number}
                    </Link>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Inv #{p.purchase_bills?.vendor_invoice_number}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {p.companies?.name || 'Company'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    {p.payment_date}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{getMethodLabel(p.payment_method)}</div>
                    {p.reference_number && (
                      <div className="text-[10px] text-slate-400 font-mono">Ref: {p.reference_number}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                    ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
          Showing {vendorPayments.length} of {totalCount} disbursements
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
