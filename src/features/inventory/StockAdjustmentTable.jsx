import React from 'react';
import { Link } from 'react-router-dom';
import { Sliders, Eye, ChevronLeft, ChevronRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { ADJUSTMENT_STATUSES, ADJUSTMENT_REASONS } from './inventoryService';

export default function StockAdjustmentTable({
  adjustments = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange
}) {
  const getStatusBadge = (status) => {
    const meta = ADJUSTMENT_STATUSES.find((s) => s.value === status) || { label: status, color: 'slate' };
    const colorClasses = {
      slate: 'bg-slate-100 text-slate-700 border-slate-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rose: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${colorClasses[meta.color] || colorClasses.slate}`}>
        {meta.label}
      </span>
    );
  };

  const getReasonLabel = (reason) => {
    return ADJUSTMENT_REASONS.find((r) => r.value === reason)?.label || reason;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Loading stock adjustments...</p>
      </div>
    );
  }

  if (adjustments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <Sliders className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-700 mb-1">No Adjustments Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No stock reconciliations or adjustments recorded. Use this tool for physical counts, damage write-offs, or opening balances.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Adjustment #</th>
              <th className="py-3 px-4">Warehouse</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {adjustments.map((adj) => (
              <tr key={adj.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                  {adj.adjustment_number}
                </td>
                <td className="py-3 px-4 font-medium text-slate-800">
                  {adj.warehouses?.warehouse_name || '—'}
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {getReasonLabel(adj.reason)}
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">
                  {adj.created_at ? new Date(adj.created_at).toLocaleDateString('en-IN') : '—'}
                </td>
                <td className="py-3 px-4 text-center">
                  {getStatusBadge(adj.status)}
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    to={`/admin/inventory/adjustments/${adj.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-medium transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="py-3 px-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-700">{adjustments.length}</span> of{' '}
          <span className="font-semibold text-slate-700">{totalCount}</span> adjustments
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1 rounded border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-slate-600 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-[11px]">{page} / {totalPages}</span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1 rounded border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-slate-600 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
