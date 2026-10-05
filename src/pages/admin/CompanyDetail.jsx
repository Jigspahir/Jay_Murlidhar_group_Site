import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCompanyById, fetchCompanyMembers } from '../../services/companyService';
import { usePermissions } from '../../hooks/usePermissions';
import { 
  Building2, 
  ArrowLeft, 
  Edit3, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Clock, 
  Globe, 
  ShieldCheck, 
  Tag
} from 'lucide-react';

export default function CompanyDetail() {
  const { companyId } = useParams();
  const { canEditCompany, canManageMembers } = usePermissions();

  const [company, setCompany] = useState(null);
  const [memberCount, setMemberCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [comp, members] = await Promise.all([
          fetchCompanyById(companyId),
          fetchCompanyMembers(companyId)
        ]);
        if (mounted) {
          if (!comp) {
            setError(`Company not found for identifier "${companyId}".`);
          } else {
            setCompany(comp);
            setMemberCount(Array.isArray(members) ? members.filter(m => m.is_active !== false).length : 0);
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load company details.');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [companyId]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="font-mono text-xs text-slate-500 uppercase tracking-wider">
          Retrieving company record...
        </p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="space-y-4">
        <Link 
          to="/admin/companies" 
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Companies</span>
        </Link>
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center shadow-sm">
          <Building2 className="w-10 h-10 text-red-300 mx-auto mb-2" />
          <h2 className="text-base font-bold text-slate-900">Company Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {error || 'The requested company could not be located in the database.'}
          </p>
          <Link
            to="/admin/companies"
            className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
          >
            Return to Company Roster
          </Link>
        </div>
      </div>
    );
  }

  const isEditable = canEditCompany(company.id);
  const canManage = canManageMembers(company.id);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link 
          to="/admin/companies" 
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Companies</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {canManage && (
            <Link
              to={`/admin/companies/${company.id}/members`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Manage Members ({memberCount})</span>
            </Link>
          )}

          {isEditable && (
            <Link
              to={`/admin/companies/${company.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Company</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Company Overview Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-xl shadow-md shrink-0">
              {company.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {company.name}
                </h1>
                {company.is_active !== false ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold">
                    <XCircle className="w-3 h-3 text-slate-400" />
                    <span>Inactive</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Canonical Identifier: <span className="font-semibold text-slate-700">{company.slug}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold font-mono">
              <Globe className="w-3.5 h-3.5" />
              <span>Domain: {company.domain?.name || 'Unassigned'}</span>
            </span>
          </div>
        </div>

        {/* Company Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          
          {/* Legal Name */}
          <div className="p-4 rounded-lg bg-slate-50/60 border border-slate-100">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Legal Registered Entity Name
            </span>
            <span className="font-semibold text-sm text-slate-800">
              {company.legal_name || 'Not formally specified'}
            </span>
          </div>

          {/* Assigned Domain */}
          <div className="p-4 rounded-lg bg-slate-50/60 border border-slate-100">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              JMG Business Domain
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-sm text-slate-800">
                {company.domain?.name || 'Unassigned'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                ({company.domain?.slug || 'n/a'})
              </span>
            </div>
          </div>

          {/* System ID */}
          <div className="p-4 rounded-lg bg-slate-50/60 border border-slate-100">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Internal UUID
            </span>
            <span className="font-mono text-xs text-slate-600 truncate block select-all">
              {company.id}
            </span>
          </div>

          {/* Created At */}
          <div className="p-4 rounded-lg bg-slate-50/60 border border-slate-100">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Registered Date
            </span>
            <div className="flex items-center gap-2 mt-0.5 text-slate-700 text-xs font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {company.created_at ? new Date(company.created_at).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                }) : '—'}
              </span>
            </div>
          </div>

          {/* Updated At */}
          <div className="p-4 rounded-lg bg-slate-50/60 border border-slate-100">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Last Synchronized
            </span>
            <div className="flex items-center gap-2 mt-0.5 text-slate-700 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {company.updated_at ? new Date(company.updated_at).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                }) : '—'}
              </span>
            </div>
          </div>

          {/* Active Members Count */}
          <div className="p-4 rounded-lg bg-slate-50/60 border border-slate-100">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Assigned Personnel
            </span>
            <div className="flex items-center gap-2 mt-0.5 text-slate-700 text-xs">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-sm text-slate-800">
                {memberCount} Active {memberCount === 1 ? 'Member' : 'Members'}
              </span>
            </div>
          </div>

        </div>

        {/* Business Description */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
            Entity Operational Scope &amp; Description
          </span>
          <div className="p-4 rounded-lg bg-slate-50/50 border border-slate-200/80 text-xs leading-relaxed text-slate-700 font-sans">
            {company.description || 'No descriptive overview recorded.'}
          </div>
        </div>

        {/* Deactivation / Status Notice if Inactive */}
        {company.is_active === false && (
          <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Company is Inactive</span>
              <p className="mt-0.5 text-amber-700">
                This company has been deactivated. Historical records and memberships remain preserved in the database, but it is excluded from active operational selection.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
