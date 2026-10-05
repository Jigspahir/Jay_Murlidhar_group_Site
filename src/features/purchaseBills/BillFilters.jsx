import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { BILL_STATUSES, BILL_PAYMENT_STATUSES } from './purchaseBillService';

export default function BillFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  paymentStatus,
  onPaymentStatusChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onReset
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Bill #, External Vendor Inv #, or Ref..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
          />
        </div>

        {/* Bill Lifecycle Status */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
        >
          <option value="all">All Bill Statuses</option>
          {BILL_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Payment Status */}
        <select
          value={paymentStatus}
          onChange={(e) => onPaymentStatusChange(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
        >
          <option value="all">All Settlement States</option>
          {BILL_PAYMENT_STATUSES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Bill Date:</span>
          <input
            type="date"
            value={dateFrom || ''}
            onChange={(e) => onDateFromChange(e.target.value || null)}
            className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
          />
          <span className="text-slate-400 text-xs">to</span>
          <input
            type="date"
            value={dateTo || ''}
            onChange={(e) => onDateToChange(e.target.value || null)}
            className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
          />
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
}
