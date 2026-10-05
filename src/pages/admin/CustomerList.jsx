import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  useCustomers, 
  CustomerTable, 
  CustomerFilters 
} from '../../features/customers';
import { 
  UserPlus, 
  Building2, 
  AlertCircle, 
  RefreshCw,
  Layers,
  UserCheck
} from 'lucide-react';

export default function CustomerList() {
  const { currentCompany, currentCompanyId, availableCompanies, isAllCompanies } = useCompany();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PERMISSIONS.CUSTOMERS_CREATE);

  // Filter overrides for company in All Companies mode
  const [scopedCompanyFilter, setScopedCompanyFilter] = useState('');

  const effectiveCompanyId = isAllCompanies 
    ? (scopedCompanyFilter === 'all' ? null : scopedCompanyFilter || null)
    : currentCompanyId;

  const {
    customers,
    count,
    page,
    totalPages,
    setPage,
    filters,
    isLoading,
    error,
    refetch,
    deactivateCustomer
  } = useCustomers({
    companyId: effectiveCompanyId,
    isAllCompanies: isAllCompanies && !scopedCompanyFilter
  });

  // Modal State for deactivation
  const [deactivatingCustomer, setDeactivatingCustomer] = useState(null);
  const [isProcessingDeactivation, setIsProcessingDeactivation] = useState(false);

  const confirmDeactivate = async () => {
    if (!deactivatingCustomer) return;
    setIsProcessingDeactivation(true);
    try {
      await deactivateCustomer(deactivatingCustomer.id);
      setDeactivatingCustomer(null);
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
            <span className="text-slate-300">&bull;</span>
            <span className="text-[10px] font-mono text-blue-600 font-semibold uppercase">
              Clients &amp; Accounts
            </span>
          </div>

          <div className="flex items-center gap-2.5 mt-1">
            <UserCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Customer Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage clients, corporate accounts, citizens, and retail customers across your authorized JMG companies.
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
              to="/admin/customers/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Customer</span>
            </Link>
          )}
        </div>
      </div>

      {/* Scope Indicator Pill */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          {isAllCompanies && !scopedCompanyFilter ? (
            <>
              <Layers className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-slate-800">Consolidated Group Scope:</span>
              <span className="text-slate-500">Showing customers across all authorized JMG companies</span>
            </>
          ) : (
            <>
              <Building2 className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800">Active Company Scope:</span>
              <span className="text-slate-600 font-medium">
                {currentCompany?.name || 'Selected Subsidiary'}
              </span>
            </>
          )}
        </div>

        <div className="font-mono text-slate-500 text-[11px]">
          Total: <span className="font-bold text-slate-800">{count}</span> records
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Component */}
      <CustomerFilters
        filters={filters}
        companies={availableCompanies}
        selectedCompanyId={scopedCompanyFilter}
        isAllCompanies={isAllCompanies}
        onCompanyChange={setScopedCompanyFilter}
      />

      {/* Customer Data Table & Cards */}
      <CustomerTable
        customers={customers}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalCount={count}
        onPageChange={setPage}
        onDeactivate={(c) => setDeactivatingCustomer(c)}
      />

      {/* Soft Deactivation Confirmation Modal */}
      {deactivatingCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Deactivate Customer Record?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to deactivate{' '}
                <strong className="text-slate-800">
                  {deactivatingCustomer.display_name}
                </strong>{' '}
                ({deactivatingCustomer.customer_code})? This will mark the customer as inactive. Historical records will be preserved.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeactivatingCustomer(null)}
                disabled={isProcessingDeactivation}
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeactivate}
                disabled={isProcessingDeactivation}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isProcessingDeactivation ? 'Deactivating...' : 'Confirm Deactivation'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
