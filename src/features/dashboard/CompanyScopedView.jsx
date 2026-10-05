import React from 'react';
import { Link } from 'react-router-dom';
import MetricCard from './MetricCard';
import { 
  Building2, 
  Globe, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ExternalLink, 
  Edit3, 
  Layers 
} from 'lucide-react';

export default function CompanyScopedView({
  company,
  activeMembersCount = 0,
  userRole = 'Employee',
  isSuperAdmin = false,
  isCompanyManager = false,
  onReturnToAll,
  isLoading = false
}) {
  if (!company) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-xs">
        <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h2 className="text-base font-bold text-slate-900">Company Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          The selected company could not be retrieved from the database.
        </p>
      </div>
    );
  }

  const getDomainColor = (slug) => {
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

  const domainSlug = company.domain?.slug || 'technology';
  const canManage = isSuperAdmin || isCompanyManager;

  return (
    <div className="space-y-6">
      
      {/* Company-Specific Header Banner */}
      <div className="p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shrink-0">
            {company.name?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {company.name}
              </h1>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${getDomainColor(domainSlug)}`}>
                {company.domain?.name || 'Domain'}
              </span>
              {company.is_active !== false ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Active</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold">
                  <XCircle className="w-3 h-3 text-slate-400" />
                  <span>Inactive</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Slug: <span className="font-semibold text-slate-700">{company.slug}</span>
              {company.legal_name && ` • ${company.legal_name}`}
            </p>
          </div>
        </div>

        {/* Super Admin option to return to All Companies */}
        {isSuperAdmin && onReturnToAll && (
          <button
            type="button"
            onClick={onReturnToAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Return to All Companies</span>
          </button>
        )}
      </div>

      {/* Scoped Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Operating Domain */}
        <MetricCard
          label="Domain"
          value={company.domain?.name || 'Unassigned'}
          subtitle={`/${domainSlug}`}
          icon={Globe}
          badgeText="Assigned"
          badgeVariant="info"
          isLoading={isLoading}
        />

        {/* Operational Status */}
        <MetricCard
          label="Status"
          value={company.is_active !== false ? 'Active' : 'Inactive'}
          subtitle="Database status"
          icon={CheckCircle2}
          badgeText="Verified"
          badgeVariant={company.is_active !== false ? 'success' : 'warning'}
          isLoading={isLoading}
        />

        {/* Active Company Members */}
        <MetricCard
          label="Assigned Members"
          value={activeMembersCount}
          subtitle="Active user_companies"
          icon={Users}
          badgeText="Team"
          badgeVariant="neutral"
          isLoading={isLoading}
        />

        {/* User's Access Role */}
        <MetricCard
          label="Your Authority"
          value={userRole}
          subtitle="RBAC verified"
          icon={ShieldCheck}
          badgeText="Scoped"
          badgeVariant="neutral"
          isLoading={isLoading}
        />

      </div>

      {/* Company Summary & Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Summary Details */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Company Summary
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {company.description || 'No operational overview has been recorded for this entity.'}
          </p>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[11px]">Legal Entity:</span>
              <span className="font-semibold text-slate-800">{company.legal_name || 'Standard Registration'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Created Date:</span>
              <span className="text-slate-700">
                {company.created_at ? new Date(company.created_at).toLocaleDateString('en-IN', {
                  dateStyle: 'medium'
                }) : 'Canonical'}
              </span>
            </div>
          </div>
        </div>

        {/* Existing Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Quick Actions
            </h3>
            <p className="text-xs text-slate-500">
              Administrative shortcuts for this company.
            </p>
          </div>

          <div className="space-y-2">
            {canManage && (
              <>
                <Link
                  to={`/admin/companies/${company.id}/members`}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Company Members</span>
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>

                <Link
                  to={`/admin/companies/${company.id}`}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Manage Company Details</span>
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>

                <Link
                  to={`/admin/companies/${company.id}/edit`}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Edit Company Metadata</span>
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </>
            )}

            <Link
              to={`/${domainSlug}/${company.slug}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>View Public Website Page</span>
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400 text-center">
            Business modules will link to this scope in future phases.
          </div>
        </div>

      </div>

    </div>
  );
}
