import React from 'react';

/**
 * Enterprise Metric Card Component
 * Strictly displays real database-backed values or neutral pending indicators.
 */
export default function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeVariant = 'neutral',
  isLoading = false
}) {
  const getBadgeClass = (variant) => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between transition-colors">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        {isLoading ? (
          <div className="h-7 w-20 bg-slate-200 rounded animate-pulse" />
        ) : (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {value !== undefined && value !== null ? value : '—'}
            </span>
            {badgeText && (
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${getBadgeClass(badgeVariant)}`}>
                {badgeText}
              </span>
            )}
          </div>
        )}

        {subtitle && (
          <span className="text-[11px] text-slate-500 font-mono mt-1 block truncate">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
