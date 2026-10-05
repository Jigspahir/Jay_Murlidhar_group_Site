import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  useEnquiries, 
  EnquiryTable, 
  EnquiryFilters,
  ENQUIRY_STATUSES
} from '../../features/enquiries';
import { 
  Plus, 
  Building2, 
  AlertCircle, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';

export default function EnquiryList() {
  const { currentCompany, currentCompanyId, availableCompanies, isAllCompanies } = useCompany();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PERMISSIONS.ENQUIRIES_CREATE);

  // Filter overrides for company in All Companies mode
  const [scopedCompanyFilter, setScopedCompanyFilter] = useState('');

  const effectiveCompanyId = isAllCompanies 
    ? (scopedCompanyFilter === 'all' ? null : scopedCompanyFilter || null)
    : currentCompanyId;

  const {
    enquiries,
    count,
    page,
    totalPages,
    setPage,
    pipelineCounts,
    search,
    setSearch,
    status,
    setStatus,
    priority,
    setPriority,
    source,
    setSource,
    isLoading,
    error,
    refetch
  } = useEnquiries({
    companyId: effectiveCompanyId,
    isAllCompanies: isAllCompanies && !scopedCompanyFilter
  });

  const handleResetFilters = () => {
    setSearch('');
    setStatus('all');
    setPriority('all');
    setSource('all');
    setScopedCompanyFilter('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              JMG BUSINESS MANAGEMENT
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-[10px] font-mono text-blue-600 font-semibold uppercase">
              Inbound CRM &amp; Pipeline
            </span>
          </div>

          <div className="flex items-center gap-2.5 mt-1">
            <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Enquiry &amp; Lead CRM
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track customer inquiries, lead lifecycles, service assignments, and conversions into active accounts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {canCreate && (
            <Link
              to="/admin/enquiries/new"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Record Enquiry</span>
            </Link>
          )}
        </div>
      </div>

      {/* Pipeline Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {ENQUIRY_STATUSES.map((st) => {
          const num = pipelineCounts[st.value] || 0;
          const isSelected = status === st.value;

          return (
            <button
              key={st.value}
              type="button"
              onClick={() => setStatus(isSelected ? 'all' : st.value)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-xs' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block truncate">
                {st.label}
              </span>
              <div className="text-lg font-mono font-bold text-slate-900 mt-0.5">
                {num}
              </div>
            </button>
          );
        })}
      </div>

      {/* Scope Indicator Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-semibold">Active Company Scope:</span>
          {isAllCompanies ? (
            <span className="font-mono text-blue-700 font-bold bg-blue-100/60 px-2 py-0.5 rounded">
              All Companies Consolidated
            </span>
          ) : (
            <span className="font-mono text-slate-900 font-bold">
              {currentCompany?.name || 'Selected Company'}
            </span>
          )}
        </div>

        {/* Multi-company dropdown filter when in All Companies mode */}
        {isAllCompanies && availableCompanies.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono text-[11px]">Filter by Company:</span>
            <select
              value={scopedCompanyFilter}
              onChange={(e) => setScopedCompanyFilter(e.target.value)}
              className="py-1 px-2.5 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Available Companies</option>
              {availableCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <div>
            <p className="font-semibold">Unable to fetch enquiries</p>
            <p className="text-[11px] text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Filters Toolbar */}
      <EnquiryFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        source={source}
        onSourceChange={setSource}
        onReset={handleResetFilters}
      />

      {/* Enquiry Table */}
      <EnquiryTable
        enquiries={enquiries}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalCount={count}
        onPageChange={setPage}
      />
    </div>
  );
}
