import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, Edit3, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { PRODUCT_STATUSES } from './inventoryService';

export default function ProductTable({
  products = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange
}) {
  const getStatusBadge = (status) => {
    const meta = PRODUCT_STATUSES.find((s) => s.value === status) || { label: status, color: 'slate' };
    const colorClasses = {
      slate: 'bg-slate-100 text-slate-700 border-slate-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rose: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${colorClasses[meta.color] || colorClasses.slate}`}>
        {meta.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Loading products catalog...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-700 mb-1">No Products Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No products match the selected criteria or none have been created yet.
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
              <th className="py-3 px-4">Code / SKU</th>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">UOM</th>
              <th className="py-3 px-4 text-right">Purchase Price</th>
              <th className="py-3 px-4 text-right">Selling Price</th>
              <th className="py-3 px-4 text-center">Serialized</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-mono font-medium text-slate-800">
                  <div className="font-semibold text-blue-600">{p.product_code}</div>
                  <div className="text-[10px] text-slate-400">SKU: {p.sku}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-slate-900">{p.product_name}</div>
                  <div className="text-[11px] text-slate-500">
                    {[p.brand, p.model].filter(Boolean).join(' • ')}
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {p.product_categories?.category_name || '—'}
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">
                  {p.unit_code}
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-700">
                  ₹{Number(p.purchase_price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                  ₹{Number(p.selling_price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-center">
                  {p.is_serialized ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200">
                      IMEI / Serial
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {getStatusBadge(p.status)}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/admin/products/${p.id}`}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Product"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit Product"
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

      {/* Pagination Footer */}
      <div className="py-3 px-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-700">{products.length}</span> of{' '}
          <span className="font-semibold text-slate-700">{totalCount}</span> products
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
            <span className="px-2 font-mono text-[11px]">
              {page} / {totalPages}
            </span>
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
