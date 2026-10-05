import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCompany } from '../../contexts/CompanyContext';
import { useDashboard } from './useDashboard';
import ConsolidatedView from './ConsolidatedView';
import CompanyScopedView from './CompanyScopedView';
import { 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Layers, 
  CheckCircle2,
  Mail
} from 'lucide-react';

/**
 * PHASE 6: CONSOLIDATED DASHBOARD & COMPANY DASHBOARD FOUNDATION
 * 
 * Production dashboard root component.
 * Respects CompanyContext dynamically.
 * Zero fake metrics.
 */
export default function DashboardOverview() {
  const { user, roles } = useAuth();
  const { 
    currentCompany, 
    currentCompanyId, 
    availableCompanies, 
    isAllCompanies, 
    switchCompany
  } = useCompany();

  const isSuperAdmin = roles.includes('group_owner');

  // Primary user authority label
  const primaryRoleLabel = isSuperAdmin
    ? 'Group Owner'
    : roles.includes('company_manager')
    ? 'Company Manager'
    : 'Employee';

  const isCompanyManager = roles.includes('company_manager');

  // Reactively fetch real Supabase dashboard data based on active scope
  const { 
    isLoading, 
    error, 
    consolidatedData, 
    scopedData, 
    refetch 
  } = useDashboard({
    currentCompanyId,
    isAllCompanies
  });

  // =========================================================================
  // 1. EMPTY STATE: No Company Access
  // Per Section 11:
  // "Your account is authenticated, but no active company has been assigned to your account."
  // =========================================================================
  if (!isSuperAdmin && availableCompanies.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-xl border border-amber-200 p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          No Company Access
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
          Your account is authenticated, but no active company has been assigned to your account.
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
          <Mail className="w-4 h-4 text-slate-400" />
          <span>Please contact the administrator at <strong className="text-slate-900">admin@jaymurlidhargroup.co.in</strong></span>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-mono text-slate-400">
          Authenticated User: <span className="font-semibold text-slate-600">{user?.email}</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. ERROR STATE
  // Per Section 13: Handle query failures with friendly message, no raw SQL
  // =========================================================================
  if (error && !isLoading) {
    return (
      <div className="max-w-3xl mx-auto my-8 bg-white rounded-xl border border-rose-200 p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-900">
              Dashboard Data Unavailable
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {error}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={refetch}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. MAIN DASHBOARD CONTENT
  // =========================================================================
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Institutional Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              JMG BUSINESS MANAGEMENT
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] font-mono text-blue-600 font-semibold uppercase">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              {isAllCompanies ? 'Consolidated Multi-Company Overview' : currentCompany?.name || 'Company Dashboard'}
            </h1>
            {isAllCompanies ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-medium">
                <Layers className="w-3 h-3" />
                <span>ALL COMPANIES</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>ACTIVE CONTEXT</span>
              </span>
            )}
          </div>
        </div>

        {/* User Context & Refetch */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto text-xs">
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{primaryRoleLabel}</span>
          </span>

          <button
            type="button"
            onClick={refetch}
            disabled={isLoading}
            title="Refresh dashboard metrics"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dynamic View: All Companies vs. Company Scoped */}
      {isAllCompanies ? (
        <ConsolidatedView
          stats={{
            totalCompanies: consolidatedData.totalCompanies,
            totalDomains: consolidatedData.totalDomains,
            totalActiveMembers: consolidatedData.totalActiveMembers
          }}
          companies={consolidatedData.companies}
          onSwitchCompany={switchCompany}
          isSuperAdmin={isSuperAdmin}
          isLoading={isLoading}
        />
      ) : (
        <CompanyScopedView
          company={scopedData?.company || currentCompany}
          activeMembersCount={scopedData?.activeMembersCount || 0}
          userRole={primaryRoleLabel}
          isSuperAdmin={isSuperAdmin}
          isCompanyManager={isCompanyManager}
          onReturnToAll={isSuperAdmin ? () => switchCompany('ALL') : null}
          isLoading={isLoading}
        />
      )}

    </div>
  );
}
