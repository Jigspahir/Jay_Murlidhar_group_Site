import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

export default function CompanyOverviewTable({ 
  companies = [], 
  onSwitchCompany, 
  canManageCompanies = false 
}) {
  const getDomainBadge = (domain) => {
    const slug = domain?.slug || '';
    switch (slug) {
      case 'technology':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'jan-suvidha':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'insurance':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'business-services':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'travel':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'retail':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Connected Operating Companies
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status across JMG canonical business entities.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {companies.length} Active {companies.length === 1 ? 'Entity' : 'Entities'}
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-600 uppercase font-mono text-[11px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-5">Company</th>
              <th className="py-3 px-5">Domain</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5">Members</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {companies.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Company Name */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        {c.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 block truncate max-w-xs mt-0.5">
                        {c.slug}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Domain */}
                <td className="py-3.5 px-5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${getDomainBadge(c.domain)}`}>
                    {c.domain?.name || 'Unassigned'}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5 px-5">
                  {c.is_active !== false ? (
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

                {/* Members */}
                <td className="py-3.5 px-5 font-mono text-slate-600 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.memberCount !== undefined ? c.memberCount : '—'}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onSwitchCompany && (
                      <button
                        type="button"
                        onClick={() => onSwitchCompany(c.id)}
                        className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-blue-600 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                        title="Switch operational scope to this company"
                      >
                        <span>Switch Scope</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {canManageCompanies && (
                      <Link
                        to={`/admin/companies/${c.id}`}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="View company details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="md:hidden divide-y divide-slate-100">
        {companies.map((c) => (
          <div key={c.id} className="p-4 space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <span className="font-semibold text-xs text-slate-900 block">
                    {c.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    {c.slug}
                  </span>
                </div>
              </div>

              {c.is_active !== false ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold">
                  Inactive
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${getDomainBadge(c.domain)}`}>
                {c.domain?.name || 'Unassigned'}
              </span>
              <span className="font-mono text-slate-500 text-[11px] flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                <span>{c.memberCount} members</span>
              </span>
            </div>

            {onSwitchCompany && (
              <div className="pt-1.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSwitchCompany(c.id)}
                  className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-center text-xs font-semibold hover:bg-slate-100 flex items-center justify-center gap-1"
                >
                  <span>Switch Scope</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                {canManageCompanies && (
                  <Link
                    to={`/admin/companies/${c.id}`}
                    className="py-1.5 px-3 rounded-lg border border-slate-200 text-slate-600 text-center text-xs font-medium hover:bg-slate-50"
                  >
                    Manage
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Jay Murlidhar Computer strictly under Jan Suvidha.</span>
        <span>Real Supabase Data</span>
      </div>
    </div>
  );
}
