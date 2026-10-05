import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Building2, ShoppingBag, ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { PO_STATUSES, PO_APPROVAL_STATUSES } from './purchaseOrderService';

export default function POTable({
  purchaseOrders = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange
}) {
  const getStatusBadge = (status) => {
    const meta = PO_STATUSES.find((s) => s.value === status) || { label: status, color: 'slate' };
    const colorClasses = {
      slate: 'bg-slate-100 text-slate-700 border-slate-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      teal: 'bg-teal-50 text-teal-700 border-teal-200',
      rose: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${colorClasses[meta.color] || colorClasses.slate}`}>
        {meta.label}
      </span>
    );
  };

  const getApprovalBadge = (approval) => {
    const meta = PO_APPROVAL_STATUSES.find((a) => a.value === approval) || { label: approval, color: 'slate' };
    const colorClasses = {
      slate: 'bg-slate-100 text-slate-600',
      amber: 'bg-amber-100 text-amber-800',
      emerald: 'bg-emerald-100 text-emerald-800',
      rose: 'bg-rose-100 text-rose-800'
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
        <p className="text-xs font-medium text-slate-500">Loading purchase orders...</p>
      </div>
    );
  }

  if (purchaseOrders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-700">No Purchase Orders Found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No procurement orders match the selected filters. Create a new purchase order to issue formal commitments to your vendors.
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
              <th className="py-3 px-4">PO Number</th>
              <th className="py-3 px-4">Vendor</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">PO Date</th>
              <th className="py-3 px-4 text-right">PO Total (₹)</th>
              <th className="py-3 px-4 text-right">Billed (₹)</th>
              <th className="py-3 px-4 text-center">Approval</th>
              <th className="py-3 px-4 text-center">Fulfillment</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {purchaseOrders.map((po) => {
              const total = Number(po.total_amount) || 0;
              const billed = Number(po.billed_amount) || 0;
              const outstanding = Math.max(0, total - billed);

              return (
                <tr key={po.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-blue-600">
                    <Link to={`/admin/purchase-orders/${po.id}`} className="hover:underline">
                      {po.po_number}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{po.vendors?.legal_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{po.vendors?.vendor_code}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {po.companies?.name || 'Company'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    {po.po_date}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">
                    <div>₹{billed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    {outstanding > 0 && billed > 0 && (
                      <div className="text-[10px] text-purple-600">Bal: ₹{outstanding.toLocaleString('en-IN')}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getApprovalBadge(po.approval_status)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(po.status)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        to={`/admin/purchase-orders/${po.id}`}
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View PO Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {po.status === 'draft' && (
                        <Link
                          to={`/admin/purchase-orders/${po.id}/edit`}
                          className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                          title="Edit Draft PO"
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

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
        <div>
          Showing {purchaseOrders.length} of {totalCount} records
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
