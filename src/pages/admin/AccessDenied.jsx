import React from 'react';
import { Link } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

/**
 * Access Denied / Access Restricted State
 * 
 * Reusable enterprise authorization fallback for unauthorized routes or views.
 * Clearly informs the user of missing credentials without exposing database internals.
 */
export default function AccessDenied({ 
  requiredPermission, 
  requiredRole,
  customMessage 
}) {
  const { roleLabel } = usePermissions();

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl border border-slate-200 shadow-xs">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 mb-2">
            <Lock className="w-3 h-3 text-rose-500" />
            <span>Access Restricted</span>
          </div>

          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Permission Denied
          </h1>

          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {customMessage || 'You do not have sufficient administrative permissions to access this section.'}
          </p>

          {/* Authorization Context Grid */}
          <div className="mt-5 p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-slate-400 text-[11px]">Your Active Role:</span>
              <span className="font-semibold text-slate-800">{roleLabel}</span>
            </div>

            {requiredPermission && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="font-mono text-slate-400 text-[11px]">Required Permission:</span>
                <code className="font-mono text-[11px] bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded">
                  {requiredPermission}
                </code>
              </div>
            )}

            {requiredRole && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="font-mono text-slate-400 text-[11px]">Required Role:</span>
                <span className="font-mono text-[11px] font-semibold text-slate-700">
                  {Array.isArray(requiredRole) ? requiredRole.join(', ') : requiredRole}
                </span>
              </div>
            )}
          </div>

          {/* Action CTA */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
