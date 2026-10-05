import React, { useState, useEffect, useCallback } from 'react';
import { useCompany } from '../../../contexts/CompanyContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../config/permissions';
import { 
  getFiscalYears, 
  getAccountingPeriods, 
  closePeriod, 
  reopenPeriod, 
  lockPeriod,
  provisionCompanyFiscalYear 
} from '../../../features/accounting';
import { 
  Calendar, 
  Lock, 
  Unlock, 
  CheckCircle, 
  AlertCircle, 
  ShieldAlert, 
  RefreshCw,
  Plus
} from 'lucide-react';

export default function FiscalYearList() {
  const { currentCompany } = useCompany();
  const { hasPermission, isGroupOwner } = usePermissions();

  const [fiscalYears, setFiscalYears] = useState([]);
  const [selectedFyId, setSelectedFyId] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const loadData = useCallback(async () => {
    if (!currentCompany?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const fys = await getFiscalYears(currentCompany.id);
      setFiscalYears(fys);
      const activeFy = fys.find((f) => f.status === 'open') || fys[0];
      if (activeFy) {
        setSelectedFyId(activeFy.id);
        const pers = await getAccountingPeriods(currentCompany.id, activeFy.id);
        setPeriods(pers);
      } else {
        setPeriods([]);
      }
    } catch (err) {
      console.error('Failed to load fiscal periods:', err);
      setError(err.message || 'Error fetching fiscal periods.');
    } finally {
      setIsLoading(false);
    }
  }, [currentCompany?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFyChange = async (fyId) => {
    setSelectedFyId(fyId);
    if (!currentCompany?.id) return;
    try {
      const pers = await getAccountingPeriods(currentCompany.id, fyId);
      setPeriods(pers);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePeriodAction = async (periodId, action) => {
    if (!isGroupOwner) {
      setError('Only Group Owner has authority to close, reopen, or lock accounting periods.');
      return;
    }
    setError(null);
    try {
      if (action === 'close') {
        await closePeriod(periodId);
        setSuccessMsg('Accounting period closed. Routine postings are now blocked.');
      } else if (action === 'reopen') {
        await reopenPeriod(periodId);
        setSuccessMsg('Accounting period reopened by Group Owner.');
      } else if (action === 'lock') {
        await lockPeriod(periodId);
        setSuccessMsg('Accounting period hard-locked.');
      }
      const pers = await getAccountingPeriods(currentCompany.id, selectedFyId);
      setPeriods(pers);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || 'Period update failed.');
    }
  };

  const handleProvisionFy = async () => {
    if (!currentCompany?.id) return;
    try {
      await provisionCompanyFiscalYear(currentCompany.id, 2026);
      setSuccessMsg('Fiscal year FY 2026-27 (1 Apr – 31 Mar) provisioned with 12 monthly periods.');
      await loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Fiscal Years & Accounting Periods
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Indian Financial Calendar (1 April to 31 March) & 12 monthly period lock controls for{' '}
            <strong className="text-slate-800">{currentCompany?.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {fiscalYears.length === 0 && hasPermission(PERMISSIONS.ACCOUNTING_PERIODS_CLOSE) && (
            <button
              onClick={handleProvisionFy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Provision FY 2026-27</span>
            </button>
          )}
          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Fiscal Year Selector */}
      {fiscalYears.length > 0 && (
        <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-slate-700">Select Fiscal Year:</span>
          <div className="flex flex-wrap gap-2">
            {fiscalYears.map((fy) => (
              <button
                key={fy.id}
                onClick={() => handleFyChange(fy.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedFyId === fy.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {fy.fiscal_year_code} ({fy.start_date} → {fy.end_date})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Periods Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Monthly Accounting Periods (12 Months)
          </h2>
          <span className="text-xs text-slate-500">
            Period Lock Authority: <strong>Group Owner Only</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Period Code</th>
                <th className="py-3 px-4">Period Name</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading periods...
                  </td>
                </tr>
              ) : periods.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No periods provisioned for this fiscal year.
                  </td>
                </tr>
              ) : (
                periods.map((p) => {
                  const isOpen = p.status === 'open';
                  const isClosed = p.status === 'closed';
                  const isLocked = p.status === 'locked';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {p.period_code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {p.period_name}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {p.start_date}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {p.end_date}
                      </td>
                      <td className="py-3 px-4">
                        {isOpen && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <Unlock className="w-3 h-3" />
                            <span>OPEN</span>
                          </span>
                        )}
                        {isClosed && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>CLOSED</span>
                          </span>
                        )}
                        {isLocked && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            <span>LOCKED</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isGroupOwner ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {isOpen && (
                              <button
                                onClick={() => handlePeriodAction(p.id, 'close')}
                                className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-medium transition-all"
                              >
                                Close Period
                              </button>
                            )}
                            {isClosed && (
                              <>
                                <button
                                  onClick={() => handlePeriodAction(p.id, 'reopen')}
                                  className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-medium transition-all"
                                >
                                  Reopen
                                </button>
                                <button
                                  onClick={() => handlePeriodAction(p.id, 'lock')}
                                  className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-medium transition-all"
                                >
                                  Lock
                                </button>
                              </>
                            )}
                            {isLocked && (
                              <button
                                onClick={() => handlePeriodAction(p.id, 'reopen')}
                                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-medium transition-all"
                              >
                                Unlock
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">
                            Read Only
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
