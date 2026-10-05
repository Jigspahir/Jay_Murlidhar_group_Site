import React from 'react';
import { Link } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  Building2, 
  ExternalLink, 
  Edit3, 
  UserX, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function EmployeeTable({
  employees = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange,
  onDeactivate
}) {
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(PERMISSIONS.EMPLOYEES_EDIT);
  const canDelete = hasPermission(PERMISSIONS.EMPLOYEES_DELETE);

  const getEmploymentBadge = (type) => {
    switch (type) {
      case 'full_time':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'part_time':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'contract':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'intern':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'consultant':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatEmploymentLabel = (type) => {
    switch (type) {
      case 'full_time': return 'Full Time';
      case 'part_time': return 'Part Time';
      case 'contract': return 'Contract';
      case 'intern': return 'Intern';
      case 'consultant': return 'Consultant';
      default: return type || '—';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-7 h-7 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="font-mono text-xs text-slate-500 uppercase tracking-wider">
          Loading employee records...
        </p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
          <Building2 className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No employees found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No employee records match your active company scope or current filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-600 uppercase font-mono text-[11px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-5">Employee</th>
              <th className="py-3 px-5">Employee ID</th>
              <th className="py-3 px-5">Company Scope</th>
              <th className="py-3 px-5">Department</th>
              <th className="py-3 px-5">Designation</th>
              <th className="py-3 px-5">Employment Type</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {employees.map((emp) => {
              const primaryAssignment = emp.assignments?.find(a => a.is_primary && a.is_active) 
                || emp.assignments?.[0];
              const companyName = primaryAssignment?.company?.name || 'Unassigned';

              return (
                <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Employee Name & Photo */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      {emp.profile_photo_url ? (
                        <img 
                          src={emp.profile_photo_url} 
                          alt={emp.full_name} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" 
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                          {emp.first_name?.charAt(0)}{emp.last_name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <Link 
                          to={`/admin/employees/${emp.id}`}
                          className="font-semibold text-slate-900 hover:text-blue-600 transition-colors block"
                        >
                          {emp.full_name}
                        </Link>
                        {emp.email && (
                          <span className="text-[11px] font-mono text-slate-400 block truncate max-w-xs mt-0.5">
                            {emp.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Employee ID */}
                  <td className="py-3.5 px-5 font-mono text-slate-600 font-semibold text-[11px]">
                    {emp.employee_code}
                  </td>

                  {/* Company */}
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 text-slate-800 font-medium">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{companyName}</span>
                    </span>
                    {emp.assignments?.length > 1 && (
                      <span className="text-[10px] font-mono text-blue-600 block mt-0.5">
                        +{emp.assignments.length - 1} more {emp.assignments.length === 2 ? 'company' : 'companies'}
                      </span>
                    )}
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-5 text-slate-700 font-medium">
                    {emp.department || '—'}
                  </td>

                  {/* Designation */}
                  <td className="py-3.5 px-5 text-slate-600">
                    {emp.designation || '—'}
                  </td>

                  {/* Employment Type */}
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${getEmploymentBadge(emp.employment_type)}`}>
                      {formatEmploymentLabel(emp.employment_type)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-5">
                    {emp.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold">
                        <XCircle className="w-3 h-3 text-slate-400" />
                        <span>Inactive</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/admin/employees/${emp.id}`}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                        title="View Profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      {canEdit && (
                        <Link
                          to={`/admin/employees/${emp.id}/edit`}
                          className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      {canDelete && emp.status === 'active' && onDeactivate && (
                        <button
                          type="button"
                          onClick={() => onDeactivate(emp.id, emp.full_name)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Deactivate Employee"
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

      {/* Mobile Stacked Card View */}
      <div className="lg:hidden divide-y divide-slate-100">
        {employees.map((emp) => {
          const primaryAssignment = emp.assignments?.find(a => a.is_primary && a.is_active) 
            || emp.assignments?.[0];
          const companyName = primaryAssignment?.company?.name || 'Unassigned';

          return (
            <div key={emp.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {emp.profile_photo_url ? (
                    <img 
                      src={emp.profile_photo_url} 
                      alt={emp.full_name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                      {emp.first_name?.charAt(0)}{emp.last_name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <Link 
                      to={`/admin/employees/${emp.id}`}
                      className="font-bold text-slate-900 hover:text-blue-600 text-xs block"
                    >
                      {emp.full_name}
                    </Link>
                    <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                      {emp.employee_code} &bull; {emp.designation || 'Staff'}
                    </span>
                  </div>
                </div>

                {emp.status === 'active' ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold">
                    Inactive
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Company:</span>
                  <span className="font-semibold text-slate-800 truncate block">{companyName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Department:</span>
                  <span className="text-slate-700 truncate block">{emp.department || '—'}</span>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Link
                  to={`/admin/employees/${emp.id}`}
                  className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 text-center text-xs font-semibold hover:bg-slate-50"
                >
                  View Profile
                </Link>
                {canEdit && (
                  <Link
                    to={`/admin/employees/${emp.id}/edit`}
                    className="flex-1 py-1.5 px-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-center text-xs font-semibold hover:bg-blue-100"
                  >
                    Edit
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="font-mono text-slate-500">
          Showing <strong className="text-slate-900">{employees.length}</strong> of{' '}
          <strong className="text-slate-900">{totalCount}</strong> employees
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-medium transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="font-mono text-slate-600 px-2">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-medium transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
