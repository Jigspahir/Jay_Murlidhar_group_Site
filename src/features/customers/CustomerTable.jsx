import React from 'react';
import { Link } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  Building2, 
  User, 
  ExternalLink, 
  Edit3, 
  UserX, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function CustomerTable({
  customers = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange,
  onDeactivate
}) {
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(PERMISSIONS.CUSTOMERS_EDIT);
  const canDelete = hasPermission(PERMISSIONS.CUSTOMERS_DELETE);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
          Loading Customer Records...
        </p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <User className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1">No Customers Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
          There are no customer records matching the active filter criteria or company scope.
        </p>
      </div>
    );
  }

  const startRecord = (page - 1) * 25 + 1;
  const endRecord = Math.min(page * 25, totalCount);

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
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Assigned Employee</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {customers.map((c) => {
                const isBusiness = c.customer_type === 'business';
                const employeeName = c.assigned_employee 
                  ? `${c.assigned_employee.first_name} ${c.assigned_employee.last_name}`
                  : null;

                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Code */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      <Link 
                        to={`/admin/customers/${c.id}`}
                        className="hover:underline"
                      >
                        {c.customer_code}
                      </Link>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isBusiness ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isBusiness ? (
                            <Building2 className="w-4 h-4" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <div className="truncate max-w-[200px]">
                          <Link 
                            to={`/admin/customers/${c.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 truncate block"
                          >
                            {c.display_name || 'Unnamed Customer'}
                          </Link>
                          {isBusiness && c.first_name && (
                            <span className="text-[11px] text-slate-500 block truncate">
                              Attn: {c.first_name} {c.last_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-3 px-4">
                      {c.company ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium max-w-[180px] truncate">
                          <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{c.company.name}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Customer Type */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold ${
                        isBusiness 
                          ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isBusiness ? 'Business' : 'Individual'}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-900">{c.phone}</div>
                      {c.email ? (
                        <div className="text-[11px] text-slate-500 truncate max-w-[160px]">{c.email}</div>
                      ) : (
                        <div className="text-[10px] text-slate-400 italic">No email</div>
                      )}
                    </td>

                    {/* Assigned Employee */}
                    <td className="py-3 px-4">
                      {employeeName ? (
                        <div>
                          <span className="font-medium text-slate-800 block truncate max-w-[150px]">
                            {employeeName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            {c.assigned_employee.employee_code}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {c.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-300 text-[10px] font-bold">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/customers/${c.id}`}
                          title="View Profile"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {canEdit && (
                          <Link
                            to={`/admin/customers/${c.id}/edit`}
                            title="Edit Customer"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                        )}

                        {canDelete && c.status === 'active' && (
                          <button
                            onClick={() => onDeactivate && onDeactivate(c)}
                            title="Deactivate Customer"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <UserX className="w-3.5 h-3.5" />
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
          MOBILE / TABLET STACKED CARD VIEW (Hidden on Desktop)
      ======================================================== */}
      <div className="lg:hidden space-y-3">
        {customers.map((c) => {
          const isBusiness = c.customer_type === 'business';
          return (
            <div 
              key={c.id} 
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isBusiness ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isBusiness ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <Link
                      to={`/admin/customers/${c.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-blue-600 block leading-tight"
                    >
                      {c.display_name || 'Unnamed Customer'}
                    </Link>
                    <span className="text-[11px] font-mono text-blue-600 font-bold block mt-0.5">
                      {c.customer_code}
                    </span>
                  </div>
                </div>

                {c.status === 'active' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-300 text-[10px] font-bold">
                    Inactive
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Phone</span>
                  <span className="font-mono text-slate-800">{c.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Company</span>
                  <span className="text-slate-800 truncate block">
                    {c.company ? c.company.name : 'Unassigned'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold ${
                  isBusiness 
                    ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {isBusiness ? 'Business' : 'Individual'}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/customers/${c.id}`}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    View
                  </Link>
                  {canEdit && (
                    <Link
                      to={`/admin/customers/${c.id}/edit`}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      Edit
                    </Link>
                  )}
                  {canDelete && c.status === 'active' && (
                    <button
                      onClick={() => onDeactivate && onDeactivate(c)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          PAGINATION BAR
      ======================================================== */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500 font-mono">
          <div>
            Showing <span className="font-bold text-slate-800">{startRecord}</span> to{' '}
            <span className="font-bold text-slate-800">{endRecord}</span> of{' '}
            <span className="font-bold text-slate-800">{totalCount}</span> customers
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-sans font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            <span className="px-2 py-1 text-slate-700 font-bold">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-sans font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
