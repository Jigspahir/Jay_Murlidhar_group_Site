import React from 'react';
import { Search, RotateCcw, Calendar } from 'lucide-react';
import { EXPENSE_CATEGORIES, EXPENSE_STATUSES } from './expenseService';

export default function ExpenseFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onReset
}) {
  const applyPreset = (preset) => {
    const today = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const toYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (preset === 'today') {
      const d = toYMD(today);
      onDateFromChange(d);
      onDateToChange(d);
    } else if (preset === 'this_month') {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      onDateFromChange(toYMD(first));
      onDateToChange(toYMD(last));
    } else if (preset === 'prev_month') {
      const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const last = new Date(today.getFullYear(), today.getMonth(), 0);
      onDateFromChange(toYMD(first));
      onDateToChange(toYMD(last));
    } else if (preset === 'this_fy') {
      const currentYear = today.getFullYear();
      const fyStart = today.getMonth() >= 3 ? currentYear : currentYear - 1;
      const start = new Date(fyStart, 3, 1);
      const end = new Date(fyStart + 1, 2, 31);
      onDateFromChange(toYMD(start));
      onDateToChange(toYMD(end));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-6 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by expense #, payee, reference..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-3">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="all">All Expense Categories</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="md:col-span-2">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="all">All Statuses</option>
            {EXPENSE_STATUSES.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div className="md:col-span-1">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            title="Expense Date From"
            className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>

        {/* Date To */}
        <div className="md:col-span-1">
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            title="Expense Date To"
            className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>

        {/* Reset */}
        <div className="md:col-span-1 flex items-center">
          <button
            onClick={onReset}
            type="button"
            className="w-full h-[34px] inline-flex items-center justify-center gap-1 px-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Clear all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Date Quick Presets */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-500 flex items-center gap-1 font-medium text-[11px]">
          <Calendar className="w-3 h-3 text-slate-400" />
          Quick Range:
        </span>
        <button
          type="button"
          onClick={() => applyPreset('today')}
          className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => applyPreset('this_month')}
          className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700"
        >
          This Month
        </button>
        <button
          type="button"
          onClick={() => applyPreset('prev_month')}
          className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700"
        >
          Previous Month
        </button>
        <button
          type="button"
          onClick={() => applyPreset('this_fy')}
          className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700"
        >
          This FY (Apr-Mar)
        </button>
      </div>
    </div>
  );
}
