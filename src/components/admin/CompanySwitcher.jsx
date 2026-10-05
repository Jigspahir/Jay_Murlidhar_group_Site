import React, { useState, useRef, useEffect } from 'react';
import { useCompany, ALL_COMPANIES_ID } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { 
  Building2, 
  ChevronDown, 
  Check, 
  AlertCircle
} from 'lucide-react';

export default function CompanySwitcher() {
  const { 
    currentCompany, 
    currentCompanyId, 
    availableCompanies, 
    isAllCompanies, 
    isSuperAdmin, 
    switchCompany 
  } = useCompany();
  const { isGroupOwner } = usePermissions();
  const hasSuperAdminRights = isSuperAdmin || isGroupOwner;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        if (triggerRef.current) {
          triggerRef.current.focus();
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (companyId) => {
    switchCompany(companyId);
    setIsOpen(false);
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  // Case 1: 0 accessible companies
  if (!hasSuperAdminRights && availableCompanies.length === 0) {
    return (
      <div className="flex flex-col text-left">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          Company
        </span>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs font-mono">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>No Company Access</span>
        </div>
      </div>
    );
  }

  // Case 2: Employee or User with exactly 1 assigned company (and not Super Admin)
  // Per Section 18: "If assigned to one company: Do not show an unnecessary multi-company switcher list. The header can simply display: Jay Murlidhar Computer"
  if (!hasSuperAdminRights && availableCompanies.length === 1) {
    const singleCompany = availableCompanies[0];
    return (
      <div className="flex flex-col text-left">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          Company
        </span>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate max-w-[220px]">{singleCompany.name}</span>
        </div>
      </div>
    );
  }

  // Case 3: Multiple companies or Super Admin (Interactive Switcher)
  return (
    <div className="flex flex-col text-left relative" ref={dropdownRef}>
      <span 
        id="company-switcher-label"
        className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5"
      >
        Company
      </span>

      {/* Switcher Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id="company-switcher-button"
        aria-labelledby="company-switcher-label"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 sm:w-64"
      >
        <span className="text-xs font-semibold text-slate-100 truncate">
          {isAllCompanies ? 'All Companies' : currentCompany?.name || 'Select Company'}
        </span>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div 
          role="listbox"
          aria-labelledby="company-switcher-label"
          className="absolute left-0 top-full mt-1.5 w-64 sm:w-72 rounded-lg bg-[#0B1527] border border-slate-700 shadow-xl py-1 z-50 focus:outline-none text-xs"
        >
          {/* Consolidated View for Group Owner */}
          {hasSuperAdminRights && (
            <>
              <button
                type="button"
                role="option"
                aria-selected={isAllCompanies}
                onClick={() => handleSelect(ALL_COMPANIES_ID)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                  isAllCompanies 
                    ? 'bg-blue-600/20 text-white font-semibold' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs">All Companies</span>
                  <span className="text-[10px] font-mono text-slate-400">Consolidated</span>
                </div>
                {isAllCompanies && (
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                )}
              </button>
              <div className="my-1 border-t border-slate-800" />
            </>
          )}

          {/* Authorized Company List */}
          <div className="max-h-60 overflow-y-auto">
            {availableCompanies.map((comp) => {
              const isSelected = currentCompanyId === comp.id;
              const domainName = comp.domain?.name || 'Domain';
              return (
                <button
                  key={comp.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(comp.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-600/20 text-white font-semibold' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col truncate pr-2">
                    <span className="text-xs truncate">{comp.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{domainName}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
