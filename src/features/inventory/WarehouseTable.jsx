import React from 'react';
import { Link } from 'react-router-dom';
import { Warehouse, Eye, Edit3, CheckCircle, XCircle } from 'lucide-react';

export default function WarehouseTable({
  warehouses = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Loading warehouses...</p>
      </div>
    );
  }

  if (warehouses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <Warehouse className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-700 mb-1">No Warehouses Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No warehouse locations configured for this company. Create one to begin tracking inventory.
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
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Warehouse Name</th>
              <th className="py-3 px-4">Address / Location</th>
              <th className="py-3 px-4 text-center">Default</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {warehouses.map((w) => (
              <tr key={w.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-mono font-medium text-blue-600">
                  {w.warehouse_code}
                </td>
                <td className="py-3 px-4 font-medium text-slate-900">
                  {w.warehouse_name}
                </td>
                <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                  {w.address || '—'}
                </td>
                <td className="py-3 px-4 text-center">
                  {w.is_default ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200">
                      Default
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                    w.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {w.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/admin/warehouses/${w.id}`}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Warehouse"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/admin/warehouses/${w.id}/edit`}
                      className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit Warehouse"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
