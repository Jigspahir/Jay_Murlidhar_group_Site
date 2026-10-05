import React from 'react';
import { Link } from 'react-router-dom';
import MetricCard from './MetricCard';
import CompanyOverviewTable from './CompanyOverviewTable';
import { 
  Building2, 
  Globe, 
  Users, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';

export default function ConsolidatedView({ 
  stats, 
  companies = [], 
  onSwitchCompany, 
  isSuperAdmin = false,
  isLoading = false 
}) {
  return (
    <div className="space-y-6">
      
      {/* Consolidated Header Banner */}
      <div className="p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-medium mb-2">
            <Layers className="w-3 h-3 text-blue-600" />
            <span>ALL COMPANIES MODE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            JMG Business Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Consolidated view across your connected companies.
          </p>
        </div>

        {isSuperAdmin && (
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/admin/companies"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Manage Companies</span>
            </Link>
          </div>
        )}
      </div>

      {/* Real Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Companies */}
        <MetricCard
          label="Active Companies"
          value={stats.totalCompanies}
          subtitle="Connected JMG operating entities"
          icon={Building2}
          badgeText="Verified"
          badgeVariant="success"
          isLoading={isLoading}
        />

        {/* Active Domains */}
        <MetricCard
          label="Active Domains"
          value={stats.totalDomains}
          subtitle="Technology, Jan Suvidha, Insurance..."
          icon={Globe}
          badgeText="Ecosystem"
          badgeVariant="info"
          isLoading={isLoading}
        />

        {/* Accessible Memberships */}
        <MetricCard
          label="Accessible Members"
          value={stats.totalActiveMembers}
          subtitle="User-company relational bridges"
          icon={Users}
          badgeText="Active"
          badgeVariant="neutral"
          isLoading={isLoading}
        />

        {/* Security & RLS */}
        <MetricCard
          label="Data Isolation"
          value="RLS Enforced"
          subtitle="PostgreSQL security definers"
          icon={ShieldCheck}
          badgeText="Zero Trust"
          badgeVariant="success"
          isLoading={isLoading}
        />

      </div>

      {/* Connected Companies Table */}
      <CompanyOverviewTable 
        companies={companies} 
        onSwitchCompany={onSwitchCompany}
        canManageCompanies={isSuperAdmin}
      />

    </div>
  );
}
