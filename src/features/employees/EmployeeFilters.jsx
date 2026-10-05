import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { 
  EMPLOYMENT_TYPES, 
  STANDARD_DEPARTMENTS, 
  STANDARD_DESIGNATIONS 
} from './employeeService';

export default function EmployeeFilters({
  filters,
  companies = [],
  selectedCompanyId,
  isAllCompanies = false,
  onCompanyChange
}) {
  const {
    search,
    setSearch,
    department,
    setDepartment,
    designation,
    setDesignation,
    employmentType,
    setEmploymentType,
    status,
    setStatus
  } = filters;

  const hasActiveFilters = Boolean(
    search || 
    department !== 'all' || 
    designation !== 'all' || 
    employmentType !== 'all' || 
    status !== 'active'
  );

  const resetFilters = () => {
    setSearch('');
    setDepartment('all');
    setDesignation('all');
    setEmploymentType('all');
    setStatus('active');
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
            placeholder="Search by code (JMG-EMP-...), name, email, phone, designation..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Structured Filter Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1 text-xs">
        
        {/* Company Filter (When in All Companies Mode) */}
        {isAllCompanies && (
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Company Scope
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

        {/* Department Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500 truncate"
          >
            <option value="all">All Departments</option>
            {STANDARD_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Designation Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Designation
          </label>
          <select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500 truncate"
          >
            <option value="all">All Designations</option>
            {STANDARD_DESIGNATIONS.map((desig) => (
              <option key={desig} value={desig}>
                {desig}
              </option>
            ))}
          </select>
        </div>

        {/* Employment Type Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Employment Type
          </label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500 truncate"
          >
            <option value="all">All Types</option>
            {EMPLOYMENT_TYPES.map((t) => (
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

      </div>

    </div>
  );
}
