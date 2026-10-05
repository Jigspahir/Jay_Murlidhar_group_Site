import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { CUSTOMER_TYPES, INDIAN_STATES } from './customerService';

export default function CustomerFilters({
  filters,
  companies = [],
  selectedCompanyId,
  isAllCompanies = false,
  onCompanyChange
}) {
  const {
    search,
    setSearch,
    customerType,
    setCustomerType,
    status,
    setStatus,
    city,
    setCity,
    state,
    setState
  } = filters;

  const hasActiveFilters = Boolean(
    search || 
    customerType !== 'all' || 
    status !== 'active' || 
    city || 
    state
  );

  const resetFilters = () => {
    setSearch('');
    setCustomerType('all');
    setStatus('active');
    setCity('');
    setState('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3.5">
      
      {/* Search Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code (JMG-CUS-...), name, company, email, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1 border-t border-slate-100">
        
        {/* Company Filter (Visible in All Companies mode) */}
        {isAllCompanies && (
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Company
            </label>
            <select
              value={selectedCompanyId || 'all'}
              onChange={(e) => onCompanyChange && onCompanyChange(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500 truncate"
            >
              <option value="all">All Companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Customer Type Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Customer Type
          </label>
          <select
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500 truncate"
          >
            <option value="all">All Types</option>
            {CUSTOMER_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="all">All Statuses</option>
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Surat"
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500 truncate"
          />
        </div>

        {/* State Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            State
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500 truncate"
          >
            <option value="">All States</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

      </div>

    </div>
  );
}
