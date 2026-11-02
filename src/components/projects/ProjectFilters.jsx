import React from 'react';
import { Filter, Search, X } from 'lucide-react';
import { FILTER_OPTIONS } from '../../data/techProjectsData';

export default function ProjectFilters({ 
  activeFilter, 
  onFilterChange, 
  searchQuery, 
  onSearchChange,
  counts 
}) {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Filter Pills with Horizontal Scroll on Mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-400 font-mono text-[11px] uppercase mr-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Filter:
            </span>

            {FILTER_OPTIONS.map((filter) => {
              const isActive = activeFilter === filter.id;
              const count = counts[filter.id] ?? null;

              return (
                <button
                  key={filter.id}
                  onClick={() => onFilterChange(filter.id)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100/90 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                  }`}
                >
                  <span>{filter.label}</span>
                  {count !== null && (
                    <span 
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive 
                          ? 'bg-slate-700 text-slate-200' 
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search solutions & tech..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
