import React from 'react';
import { Link } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  Building2, 
  Layers, 
  ExternalLink, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft,
  ChevronRight,
  Tag
} from 'lucide-react';
import { BILLING_TYPES } from './serviceService';

export default function ServiceTable({
  services = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange,
  onDeactivate,
  onReactivate
}) {
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(PERMISSIONS.SERVICES_EDIT);
  const canDelete = hasPermission(PERMISSIONS.SERVICES_DELETE);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
          Loading Service Catalog...
        </p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1">No Services Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
          There are no service items matching the active filter criteria or company scope.
        </p>
      </div>
    );
  }

  const startRecord = (page - 1) * 25 + 1;
  const endRecord = Math.min(page * 25, totalCount);

  const getBillingLabel = (type) => {
    const found = BILLING_TYPES.find((b) => b.value === type);
    return found ? found.label : type;
  };

  const formatPrice = (price, billingType) => {
    if (billingType === 'quote_based') {
      return price > 0 ? `From ₹${Number(price).toLocaleString('en-IN')}` : 'Quote Based';
    }
    if (price === 0) {
      return 'Free / Scheme';
    }
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-4">
      {/* ========================================================
          DESKTOP TABLE (Hidden on Mobile)
      ======================================================== */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Service Name</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Billing Type</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {services.map((s) => {
                const isActive = s.status === 'active';

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Code */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      <Link 
                        to={`/admin/services/${s.id}`}
                        className="hover:underline"
                      >
                        {s.service_code}
                      </Link>
                    </td>

                    {/* Service Name & Description */}
                    <td className="py-3 px-4 max-w-[260px]">
                      <div className="font-semibold text-slate-900 truncate" title={s.service_name}>
                        {s.service_name}
                      </div>
                      {s.description && (
                        <div className="text-[11px] text-slate-500 truncate" title={s.description}>
                          {s.description}
                        </div>
                      )}
                    </td>

                    {/* Company */}
                    <td className="py-3 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[170px]" title={s.company?.name || 'Assigned Company'}>
                          {s.company?.name || 'JMG Company'}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        {s.category || 'General'}
                      </span>
                    </td>

                    {/* Billing Type */}
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-medium text-slate-700">
                        {getBillingLabel(s.billing_type)}
                      </span>
                    </td>

                    {/* Base Price */}
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      {formatPrice(s.base_price, s.billing_type)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                          <XCircle className="w-3 h-3 text-slate-400" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/services/${s.id}`}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                          title="View Service Profile"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        {canEdit && (
                          <Link
                            to={`/admin/services/${s.id}/edit`}
                            className="p-1 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors"
                            title="Edit Service"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                        )}
                        {canDelete && isActive && onDeactivate && (
                          <button
                            type="button"
                            onClick={() => onDeactivate(s.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition-colors"
                            title="Deactivate Service"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && !isActive && onReactivate && (
                          <button
                            type="button"
                            onClick={() => onReactivate(s.id)}
                            className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded transition-colors"
                            title="Reactivate Service"
                          >
                            <CheckCircle2 className="w-4 h-4" />
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
      </div>

      {/* ========================================================
          MOBILE CARDS (Hidden on Desktop)
      ======================================================== */}
      <div className="lg:hidden space-y-3">
        {services.map((s) => {
          const isActive = s.status === 'active';

          return (
            <div key={s.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <Link
                  to={`/admin/services/${s.id}`}
                  className="font-mono font-bold text-sm text-blue-600 hover:underline"
                >
                  {s.service_code}
                </Link>
                {isActive ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                    <XCircle className="w-2.5 h-2.5 text-slate-400" />
                    Inactive
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-sm">{s.service_name}</h4>
                {s.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{s.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-mono">Company</span>
                  <span className="text-slate-700 font-medium truncate block">{s.company?.name || 'JMG'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-mono">Category</span>
                  <span className="text-slate-700 font-medium truncate block">{s.category || 'General'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-mono">Billing</span>
                  <span className="text-slate-700 font-medium truncate block">{getBillingLabel(s.billing_type)}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-mono">Base Price</span>
                  <span className="font-mono font-semibold text-slate-900">{formatPrice(s.base_price, s.billing_type)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Link
                  to={`/admin/services/${s.id}`}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  View
                </Link>
                {canEdit && (
                  <Link
                    to={`/admin/services/${s.id}/edit`}
                    className="px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          PAGINATION BAR
      ======================================================== */}
      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200 text-xs">
          <div className="text-slate-500 font-mono">
            Showing <span className="font-bold text-slate-700">{startRecord}</span> to{' '}
            <span className="font-bold text-slate-700">{endRecord}</span> of{' '}
            <span className="font-bold text-slate-700">{totalCount}</span> services
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange && onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-mono text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange && onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
