import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Building2, Phone, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';
import { VENDOR_STATUSES, VENDOR_TYPES } from './vendorService';

export default function VendorTable({
  vendors = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange
}) {
  const getStatusBadge = (status) => {
    const meta = VENDOR_STATUSES.find((s) => s.value === status) || { label: status, color: 'slate' };
    const colorClasses = {
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      slate: 'bg-slate-100 text-slate-700 border-slate-200',
      rose: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${colorClasses[meta.color] || colorClasses.slate}`}>
        {meta.label}
      </span>
    );
  };

  const getTypeName = (type) => {
    const found = VENDOR_TYPES.find((t) => t.value === type);
    return found ? found.label : type;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Loading vendor records...</p>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-700">No Vendors Found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No vendor profiles match the selected filters or company context. Register a new vendor to start recording procurement and bills.
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
              <th className="py-3 px-4">Vendor Code</th>
              <th className="py-3 px-4">Legal Name & Trade Name</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Contact & Phone</th>
              <th className="py-3 px-4">GSTIN</th>
              <th className="py-3 px-4 text-center">Credit Days</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {vendors.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-mono font-medium text-blue-600">
                  <Link to={`/admin/vendors/${v.id}`} className="hover:underline">
                    {v.vendor_code}
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">{v.legal_name}</div>
                  {v.trade_name && (
                    <div className="text-[10px] text-slate-400 font-normal">T/A: {v.trade_name}</div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    {v.companies?.name || 'Assigned Company'}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600 text-[11px]">
                  {getTypeName(v.vendor_type)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-800">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {v.phone}
                  </div>
                  {v.contact_person && (
                    <div className="text-[10px] text-slate-400">Attn: {v.contact_person}</div>
                  )}
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                  {v.gstin || <span className="text-slate-300 font-sans italic">Not registered</span>}
                </td>
                <td className="py-3 px-4 text-center font-mono">
                  {v.payment_terms_days} d
                </td>
                <td className="py-3 px-4 text-center">
                  {getStatusBadge(v.status)}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Link
                      to={`/admin/vendors/${v.id}`}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="View Vendor Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/vendors/${v.id}/edit`}
                      className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                      title="Edit Vendor"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Strip */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
        <div>
          Showing {vendors.length} of {totalCount} records
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
