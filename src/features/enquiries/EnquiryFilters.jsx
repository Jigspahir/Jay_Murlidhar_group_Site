import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { ENQUIRY_STATUSES, ENQUIRY_PRIORITIES, ENQUIRY_SOURCES } from './enquiryService';

export default function EnquiryFilters({
  search = '',
  onSearchChange,
  status = 'all',
  onStatusChange,
  priority = 'all',
  onPriorityChange,
  source = 'all',
  onSourceChange,
  onReset
}) {
  const hasActiveFilters = 
    search.trim() !== '' || 
    status !== 'all' || 
    priority !== 'all' || 
    source !== 'all';

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search code, name, phone, subject..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status */}
        <div>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by Status"
            className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Statuses</option>
            {ENQUIRY_STATUSES.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            aria-label="Filter by Priority"
            className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Priorities</option>
            {ENQUIRY_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div className="flex items-center gap-2">
          <select
            value={source}
            onChange={(e) => onSourceChange(e.target.value)}
            aria-label="Filter by Source"
            className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Sources</option>
            {ENQUIRY_SOURCES.map((src) => (
              <option key={src.value} value={src.value}>
                {src.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors shrink-0"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
