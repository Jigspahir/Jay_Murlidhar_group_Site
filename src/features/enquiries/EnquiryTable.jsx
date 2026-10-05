import React from 'react';
import { Link } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  Building2, 
  HelpCircle, 
  ExternalLink, 
  Edit3, 
  User, 
  ChevronLeft,
  ChevronRight,
  Phone,
  Layers,
  Calendar
} from 'lucide-react';
import { ENQUIRY_STATUSES, ENQUIRY_PRIORITIES, ENQUIRY_SOURCES } from './enquiryService';

export default function EnquiryTable({
  enquiries = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange
}) {
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(PERMISSIONS.ENQUIRIES_EDIT);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
          Loading Enquiry Pipeline...
        </p>
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1">No Enquiries Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
          There are no enquiry or lead records matching the current filter criteria or company scope.
        </p>
      </div>
    );
  }

  const startRecord = (page - 1) * 25 + 1;
  const endRecord = Math.min(page * 25, totalCount);

  const getStatusBadge = (status) => {
    const s = ENQUIRY_STATUSES.find((item) => item.value === status);
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${s?.badgeBg || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
        {s?.label || status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const p = ENQUIRY_PRIORITIES.find((item) => item.value === priority);
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold ${p?.color || 'bg-slate-100 text-slate-700'}`}>
        {p?.label || priority}
      </span>
    );
  };

  const getSourceLabel = (source) => {
    const s = ENQUIRY_SOURCES.find((item) => item.value === source);
    return s?.label || source;
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
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {enquiries.map((enq) => {
                const assignedName = enq.assigned_employee
                  ? `${enq.assigned_employee.first_name} ${enq.assigned_employee.last_name}`
                  : null;

                return (
                  <tr key={enq.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Code */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      <Link 
                        to={`/admin/enquiries/${enq.id}`}
                        className="hover:underline"
                      >
                        {enq.enquiry_code}
                      </Link>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{enq.contact_name}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {enq.contact_phone}
                      </div>
                      {enq.customer && (
                        <span className="inline-block mt-0.5 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Linked: {enq.customer.customer_code}
                        </span>
                      )}
                    </td>

                    {/* Subject */}
                    <td className="py-3 px-4 max-w-[200px]">
                      <div className="font-medium text-slate-800 truncate" title={enq.subject}>
                        {enq.subject}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        Source: {getSourceLabel(enq.source)}
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-3 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px]" title={enq.company?.name || 'JMG Company'}>
                          {enq.company?.name || 'JMG Company'}
                        </span>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-3 px-4 text-slate-600">
                      {enq.service ? (
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="truncate max-w-[150px] font-medium text-slate-800" title={enq.service.service_name}>
                            {enq.service.service_name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">General Enquiry</span>
                      )}
                    </td>

                    {/* Assigned Employee */}
                    <td className="py-3 px-4 text-slate-600">
                      {assignedName ? (
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[130px]">{assignedName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                      )}
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4 text-center">
                      {getPriorityBadge(enq.priority)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(enq.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/enquiries/${enq.id}`}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                          title="View Enquiry Profile"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        {canEdit && (
                          <Link
                            to={`/admin/enquiries/${enq.id}/edit`}
                            className="p-1 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors"
                            title="Edit Enquiry"
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
      </div>

      {/* ========================================================
          MOBILE CARDS (Hidden on Desktop)
      ======================================================== */}
      <div className="lg:hidden space-y-3">
        {enquiries.map((enq) => {
          const assignedName = enq.assigned_employee
            ? `${enq.assigned_employee.first_name} ${enq.assigned_employee.last_name}`
            : 'Unassigned';

          return (
            <div key={enq.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <Link
                  to={`/admin/enquiries/${enq.id}`}
                  className="font-mono font-bold text-sm text-blue-600 hover:underline"
                >
                  {enq.enquiry_code}
                </Link>
                <div className="flex items-center gap-1.5">
                  {getPriorityBadge(enq.priority)}
                  {getStatusBadge(enq.status)}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-sm">{enq.subject}</h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                  <span className="font-medium text-slate-800">{enq.contact_name}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="font-mono text-slate-500">{enq.contact_phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-mono">Company</span>
                  <span className="text-slate-700 font-medium truncate block">{enq.company?.name || 'JMG'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-mono">Service</span>
                  <span className="text-slate-700 font-medium truncate block">{enq.service?.service_name || 'General'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-mono">Assigned</span>
                  <span className="text-slate-700 font-medium truncate block">{assignedName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-mono">Created</span>
                  <span className="text-slate-700 font-medium truncate block flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {new Date(enq.created_at).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Link
                  to={`/admin/enquiries/${enq.id}`}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  View
                </Link>
                {canEdit && (
                  <Link
                    to={`/admin/enquiries/${enq.id}/edit`}
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
            <span className="font-bold text-slate-700">{totalCount}</span> enquiries
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
