import React from 'react';
import { ArrowDownLeft, ArrowUpRight, History, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { MOVEMENT_TYPES } from './inventoryService';

export default function StockMovementTable({
  movements = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange
}) {
  const getMovementMeta = (type) => {
    return MOVEMENT_TYPES.find((m) => m.value === type) || {
      label: type,
      direction: 'in',
      color: 'slate'
    };
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Loading stock movements ledger...</p>
      </div>
    );
  }

  if (movements.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-700 mb-1">No Stock Movements</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No inventory transactions recorded. All stock inward, outward, and adjustments will appear in this immutable audit ledger.
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
              <th className="py-3 px-4">Movement #</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Warehouse</th>
              <th className="py-3 px-4 text-right">Quantity</th>
              <th className="py-3 px-4 text-right">Unit Cost</th>
              <th className="py-3 px-4 text-right">Total Cost</th>
              <th className="py-3 px-4">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {movements.map((m) => {
              const meta = getMovementMeta(m.movement_type);
              const isIn = meta.direction === 'in';

              return (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                    {m.movement_number}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                    {m.created_at ? new Date(m.created_at).toLocaleString('en-IN') : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                        isIn
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {isIn ? (
                        <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3 text-amber-600" />
                      )}
                      {meta.label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{m.products?.product_name || '—'}</div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {m.products?.product_code} • {m.products?.sku}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {m.warehouses?.warehouse_name || '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    <span className={isIn ? 'text-emerald-600' : 'text-amber-600'}>
                      {isIn ? `+${m.quantity}` : `-${m.quantity}`} {m.products?.unit_code || 'PCS'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">
                    ₹{Number(m.unit_cost || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                    ₹{Number(m.total_cost || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                    {m.reference_type ? (
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                        <FileText className="w-3 h-3 text-slate-400" />
                        {m.reference_type}: {m.reference_id?.slice(0, 8)}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="py-3 px-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-700">{movements.length}</span> of{' '}
          <span className="font-semibold text-slate-700">{totalCount}</span> movements
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
