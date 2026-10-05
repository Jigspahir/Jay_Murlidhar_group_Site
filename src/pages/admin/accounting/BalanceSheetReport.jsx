import React, { useState, useEffect, useCallback } from 'react';
import { useCompany } from '../../../contexts/CompanyContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { getBalanceSheet, getFiscalYears } from '../../../features/accounting';
import { 
  CheckCircle, 
  AlertCircle, 
  Printer, 
  Download, 
  RefreshCw,
  Building2
} from 'lucide-react';

export default function BalanceSheetReport() {
  const { currentCompany } = useCompany();
  const { isGroupOwner } = usePermissions();

  const [bs, setBs] = useState({
    assets: [],
    liabilities: [],
    equity: [],
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0,
    totalLiabilitiesAndEquity: 0,
    isBalanced: true
  });

  const [fiscalYears, setFiscalYears] = useState([]);
  const [selectedFyId, setSelectedFyId] = useState('');
  const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isConsolidated, setIsConsolidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!currentCompany?.id && !isConsolidated) return;
    setIsLoading(true);
    setError(null);
    try {
      if (currentCompany?.id) {
        const fys = await getFiscalYears(currentCompany.id);
        setFiscalYears(fys);
      }

      const data = await getBalanceSheet({
        companyId: currentCompany?.id,
        fiscalYearId: selectedFyId || null,
        asOfDate: asOfDate || null,
        isConsolidated
      });
      setBs(data);
    } catch (err) {
      console.error('Failed to load Balance Sheet:', err);
      setError(err.message || 'Error generating balance sheet.');
    } finally {
      setIsLoading(false);
    }
  }, [currentCompany?.id, selectedFyId, asOfDate, isConsolidated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatCurr = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Balance Sheet
            </span>
            {isConsolidated && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                Group Consolidated
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Balance Sheet
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Statement of Financial Position as of <strong>{asOfDate}</strong> for{' '}
            <strong className="text-slate-800">
              {isConsolidated ? 'All JMG Group Entities (Consolidated)' : currentCompany?.name}
            </strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isGroupOwner && (
            <button
              onClick={() => setIsConsolidated(!isConsolidated)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                isConsolidated
                  ? 'bg-purple-600 text-white border-purple-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isConsolidated ? 'Viewing Consolidated' : 'Consolidate Group'}
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium"
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

      {/* Date Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-slate-500 font-semibold mb-1">Fiscal Year</label>
          <select
            value={selectedFyId}
            onChange={(e) => setSelectedFyId(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
          >
            <option value="">All Fiscal Years</option>
            {fiscalYears.map((fy) => (
              <option key={fy.id} value={fy.id}>
                {fy.fiscal_year_code}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-500 font-semibold mb-1">As of Date</label>
          <input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
          />
        </div>
      </div>

      {/* Balance Sheet Statement */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        {/* ASSETS SECTION */}
        <div className="border-b border-slate-200">
          <div className="bg-slate-900 text-white px-6 py-3 font-bold uppercase tracking-wider text-xs flex items-center justify-between">
            <span>ASSETS</span>
            <span className="font-mono text-emerald-400">{formatCurr(bs.totalAssets)}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {bs.assets.length === 0 ? (
              <div className="px-6 py-4 text-slate-400 italic">No asset ledger balances.</div>
            ) : (
              bs.assets.map((a) => (
                <div key={a.accountId} className="px-6 py-2.5 flex items-center justify-between hover:bg-slate-50">
                  <span className="text-slate-800">
                    <span className="font-mono text-slate-400 mr-2">{a.accountCode}</span>
                    {a.accountName}
                  </span>
                  <span className="font-mono font-medium text-slate-900">{formatCurr(a.amount)}</span>
                </div>
              ))
            )}
          </div>

          <div className="bg-slate-100 px-6 py-3 flex items-center justify-between font-bold border-t border-slate-200 text-slate-900">
            <span>TOTAL ASSETS</span>
            <span className="font-mono text-sm text-emerald-800">{formatCurr(bs.totalAssets)}</span>
          </div>
        </div>

        {/* LIABILITIES SECTION */}
        <div className="border-b border-slate-200">
          <div className="bg-slate-900 text-white px-6 py-3 font-bold uppercase tracking-wider text-xs flex items-center justify-between">
            <span>LIABILITIES</span>
            <span className="font-mono text-rose-400">{formatCurr(bs.totalLiabilities)}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {bs.liabilities.length === 0 ? (
              <div className="px-6 py-4 text-slate-400 italic">No liability ledger balances.</div>
            ) : (
              bs.liabilities.map((l) => (
                <div key={l.accountId} className="px-6 py-2.5 flex items-center justify-between hover:bg-slate-50">
                  <span className="text-slate-800">
                    <span className="font-mono text-slate-400 mr-2">{l.accountCode}</span>
                    {l.accountName}
                  </span>
                  <span className="font-mono font-medium text-slate-900">{formatCurr(l.amount)}</span>
                </div>
              ))
            )}
          </div>

          <div className="bg-slate-100 px-6 py-3 flex items-center justify-between font-bold border-t border-slate-200 text-slate-900">
            <span>TOTAL LIABILITIES</span>
            <span className="font-mono text-sm text-rose-800">{formatCurr(bs.totalLiabilities)}</span>
          </div>
        </div>

        {/* EQUITY SECTION */}
        <div className="border-b border-slate-200">
          <div className="bg-slate-900 text-white px-6 py-3 font-bold uppercase tracking-wider text-xs flex items-center justify-between">
            <span>EQUITY</span>
            <span className="font-mono text-purple-400">{formatCurr(bs.totalEquity)}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {bs.equity.length === 0 ? (
              <div className="px-6 py-4 text-slate-400 italic">No equity ledger balances.</div>
            ) : (
              bs.equity.map((eq) => (
                <div key={eq.accountId} className="px-6 py-2.5 flex items-center justify-between hover:bg-slate-50">
                  <span className="text-slate-800">
                    <span className="font-mono text-slate-400 mr-2">{eq.accountCode}</span>
                    {eq.accountName}
                  </span>
                  <span className={`font-mono font-medium ${
                    eq.amount >= 0 ? 'text-slate-900' : 'text-red-700'
                  }`}>
                    {formatCurr(eq.amount)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="bg-slate-100 px-6 py-3 flex items-center justify-between font-bold border-t border-slate-200 text-slate-900">
            <span>TOTAL EQUITY</span>
            <span className="font-mono text-sm text-purple-800">{formatCurr(bs.totalEquity)}</span>
          </div>
        </div>

        {/* Grand Total Liabilities & Equity */}
        <div className="bg-slate-200 px-6 py-4 flex items-center justify-between font-black text-sm text-slate-900 border-t-2 border-slate-300">
          <span>TOTAL LIABILITIES & EQUITY</span>
          <span className="font-mono text-base">{formatCurr(bs.totalLiabilitiesAndEquity)}</span>
        </div>

        {/* Fundamental Accounting Invariant Badge */}
        <div className={`p-4 border-t text-xs flex items-center justify-between ${
          bs.isBalanced
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {bs.isBalanced ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-bold">BALANCE SHEET BALANCED:</span>
                <span>Assets ({formatCurr(bs.totalAssets)}) = Liabilities & Equity ({formatCurr(bs.totalLiabilitiesAndEquity)}).</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="font-bold">IMBALANCE DETECTED:</span>
                <span>
                  Discrepancy of {formatCurr(Math.abs(bs.totalAssets - bs.totalLiabilitiesAndEquity))}.
                </span>
              </>
            )}
          </div>
          <span className="font-mono text-[11px] font-bold">
            Invariant: Assets = Liabilities + Equity
          </span>
        </div>
      </div>
    </div>
  );
}
