import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  useEmployees, 
  EmployeeTable, 
  EmployeeFilters 
} from '../../features/employees';
import { 
  UserPlus, 
  Building2, 
  AlertCircle, 
  RefreshCw,
  Layers
} from 'lucide-react';

export default function EmployeeList() {
  const { currentCompany, currentCompanyId, availableCompanies, isAllCompanies } = useCompany();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PERMISSIONS.EMPLOYEES_CREATE);

  // Filter overrides for company in All Companies mode
  const [scopedCompanyFilter, setScopedCompanyFilter] = useState('');

  const effectiveCompanyId = isAllCompanies 
    ? (scopedCompanyFilter === 'all' ? null : scopedCompanyFilter || null)
    : currentCompanyId;

  const {
    employees,
    count,
    page,
    totalPages,
    setPage,
    filters,
    isLoading,
    error,
    refetch,
    deactivateEmployee
  } = useEmployees({
    companyId: effectiveCompanyId,
    isAllCompanies: isAllCompanies && !scopedCompanyFilter
  });

  // Modal State for deactivation
  const [deactivatingEmployee, setDeactivatingEmployee] = useState(null);
  const [isProcessingDeactivation, setIsProcessingDeactivation] = useState(false);

  const confirmDeactivate = async () => {
    if (!deactivatingEmployee) return;
    setIsProcessingDeactivation(true);
    try {
      await deactivateEmployee(deactivatingEmployee.id);
      setDeactivatingEmployee(null);
    } catch (err) {
      console.warn('Deactivation failed:', err);
    } finally {
      setIsProcessingDeactivation(false);
    }
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
            <span className="text-slate-300">•</span>
            <span className="text-[10px] font-mono text-blue-600 font-semibold uppercase">
              Personnel
            </span>
          </div>

          <div className="flex items-center gap-2.5 mt-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Employee Management
            </h1>
            {isAllCompanies ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-medium">
                <Layers className="w-3 h-3 text-blue-600" />
                <span>ALL COMPANIES</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-medium">
                <Building2 className="w-3 h-3 text-emerald-600" />
                <span>{currentCompany?.name || 'Assigned Scope'}</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            {isAllCompanies 
              ? 'Consolidated employee roster across all connected JMG operating companies.' 
              : `Active personnel roster for ${currentCompany?.name || 'this company'}.`}
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={refetch}
            disabled={isLoading}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Employees"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {canCreate && (
            <Link
              to="/admin/employees/new"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </Link>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
          <button 
            type="button" 
            onClick={refetch}
            className="text-xs font-semibold text-red-800 underline hover:no-underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <EmployeeFilters
        filters={filters}
        companies={availableCompanies}
        selectedCompanyId={scopedCompanyFilter}
        isAllCompanies={isAllCompanies}
        onCompanyChange={setScopedCompanyFilter}
      />

      {/* Main Employee Table */}
      <EmployeeTable
        employees={employees}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalCount={count}
        onPageChange={setPage}
        onDeactivate={(id, name) => setDeactivatingEmployee({ id, name })}
      />

      {/* Soft Deactivation Confirmation Modal */}
      {deactivatingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <AlertCircle className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Deactivate Employee?
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Are you sure you want to deactivate <strong className="text-slate-900">{deactivatingEmployee.name}</strong>?
                This employee will be marked as inactive and will no longer appear in default active lists. Historical assignments and records will be preserved.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isProcessingDeactivation}
                onClick={() => setDeactivatingEmployee(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isProcessingDeactivation}
                onClick={confirmDeactivate}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {isProcessingDeactivation ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Deactivating...</span>
                  </>
                ) : (
                  <span>Confirm Deactivation</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
