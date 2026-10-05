import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  useServices, 
  ServiceTable, 
  ServiceFilters 
} from '../../features/services';
import { 
  Plus, 
  Building2, 
  AlertCircle, 
  RefreshCw,
  Layers,
  Wrench
} from 'lucide-react';

export default function ServiceList() {
  const { currentCompany, currentCompanyId, availableCompanies, isAllCompanies } = useCompany();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PERMISSIONS.SERVICES_CREATE);

  // Filter overrides for company in All Companies mode
  const [scopedCompanyFilter, setScopedCompanyFilter] = useState('');

  const effectiveCompanyId = isAllCompanies 
    ? (scopedCompanyFilter === 'all' ? null : scopedCompanyFilter || null)
    : currentCompanyId;

  const {
    services,
    count,
    page,
    totalPages,
    setPage,
    search,
    setSearch,
    category,
    setCategory,
    billingType,
    setBillingType,
    status,
    setStatus,
    isLoading,
    error,
    refetch,
    deactivateService,
    reactivateService
  } = useServices({
    companyId: effectiveCompanyId,
    isAllCompanies: isAllCompanies && !scopedCompanyFilter
  });

  // Modal State for deactivation
  const [deactivatingService, setDeactivatingService] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const confirmDeactivate = async () => {
    if (!deactivatingService) return;
    setIsProcessing(true);
    try {
      await deactivateService(deactivatingService.id);
      setDeactivatingService(null);
    } catch (err) {
      console.warn('Deactivation failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setBillingType('all');
    setStatus('active');
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
              Operational Offerings
            </span>
          </div>

          <div className="flex items-center gap-2.5 mt-1">
            <Layers className="w-5 h-5 text-blue-600 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Services Master
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage company-specific service items, pricing specifications, citizen workflows, and operational catalogs.
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
              to="/admin/services/new"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </Link>
          )}
        </div>
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
            <p className="font-semibold">Unable to fetch services</p>
            <p className="text-[11px] text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Filters Toolbar */}
      <ServiceFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        billingType={billingType}
        onBillingTypeChange={setBillingType}
        status={status}
        onStatusChange={setStatus}
        onReset={handleResetFilters}
      />

      {/* Services Table */}
      <ServiceTable
        services={services}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalCount={count}
        onPageChange={setPage}
        onDeactivate={(id) => {
          const s = services.find((item) => item.id === id);
          if (s) setDeactivatingService(s);
        }}
        onReactivate={(id) => reactivateService(id)}
      />

      {/* Deactivation Confirmation Modal */}
      {deactivatingService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Wrench className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Deactivate Service Offering?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to deactivate{' '}
                <span className="font-semibold text-slate-800">
                  {deactivatingService.service_name} ({deactivatingService.service_code})
                </span>
                ? This will set its status to inactive. Existing enquiries and historical data will be preserved.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeactivatingService(null)}
                disabled={isProcessing}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeactivate}
                disabled={isProcessing}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Deactivating...' : 'Deactivate Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
