import React, { useState, useEffect, useCallback } from 'react';
import { useCompany } from '../../../contexts/CompanyContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { getProfitAndLoss, getFiscalYears } from '../../../features/accounting';
import { 
  TrendingUp, 
  Download, 
  Printer, 
  RefreshCw, 
  AlertCircle,
  Building2
} from 'lucide-react';

export default function ProfitLossReport() {
  const { currentCompany } = useCompany();
  const { isGroupOwner } = usePermissions();

  const [pnl, setPnl] = useState({
    revenues: [],
    cogs: [],
    operatingExpenses: [],
    otherIncome: [],
    totalRevenue: 0,
    totalCogs: 0,
    grossProfit: 0,
    totalOperatingExpenses: 0,
    operatingProfit: 0,
    totalOtherIncome: 0,
    netProfit: 0
  });

  const [fiscalYears, setFiscalYears] = useState([]);
  const [selectedFyId, setSelectedFyId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

      const data = await getProfitAndLoss({
        companyId: currentCompany?.id,
        fiscalYearId: selectedFyId || null,
        startDate: startDate || null,
        endDate: endDate || null,
        isConsolidated
      });
      setPnl(data);
    } catch (err) {
      console.error('Failed to load P&L:', err);
      setError(err.message || 'Error generating Profit & Loss statement.');
    } finally {
      setIsLoading(false);
    }
  }, [currentCompany?.id, selectedFyId, startDate, endDate, isConsolidated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatCurr = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);

  const grossMarginPct = pnl.totalRevenue > 0
    ? ((pnl.grossProfit / pnl.totalRevenue) * 100).toFixed(1)
    : '0.0';

  const netMarginPct = pnl.totalRevenue > 0
    ? ((pnl.netProfit / pnl.totalRevenue) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Income Statement
            </span>
            {isConsolidated && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                Group Consolidated
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Profit & Loss (P&L)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Statement of Financial Performance for{' '}
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

      {/* Date Filter Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
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
          <label className="block text-slate-500 font-semibold mb-1">From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-slate-500 font-semibold mb-1">To Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
          />
        </div>
      </div>

      {/* P&L Statement Body */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        {/* Section 1: Operating Revenue */}
        <div className="border-b border-slate-200">
          <div className="bg-slate-50 px-6 py-2.5 font-bold uppercase tracking-wider text-slate-600 text-[11px]">
            1. Operating Revenue
          </div>
          <div className="divide-y divide-slate-100">
            {pnl.revenues.length === 0 ? (
              <div className="px-6 py-3 text-slate-400 italic">No revenue recorded in this period.</div>
            ) : (
              pnl.revenues.map((r) => (
                <div key={r.accountId} className="px-6 py-2.5 flex items-center justify-between">
                  <span className="text-slate-800">
                    <span className="font-mono text-slate-400 mr-2">{r.accountCode}</span>
                    {r.accountName}
                  </span>
                  <span className="font-mono font-medium text-slate-900">{formatCurr(r.amount)}</span>
                </div>
              ))
            )}
          </div>
          <div className="bg-slate-100/70 px-6 py-3 flex items-center justify-between font-bold border-t border-slate-200 text-slate-900">
            <span>Total Operating Revenue</span>
            <span className="font-mono text-sm text-blue-900">{formatCurr(pnl.totalRevenue)}</span>
          </div>
        </div>

        {/* Section 2: Cost of Goods Sold */}
        <div className="border-b border-slate-200">
          <div className="bg-slate-50 px-6 py-2.5 font-bold uppercase tracking-wider text-slate-600 text-[11px]">
            2. Cost of Goods Sold (COGS)
          </div>
          <div className="divide-y divide-slate-100">
            {pnl.cogs.length === 0 ? (
              <div className="px-6 py-3 text-slate-400 italic">No COGS recognized (Service-only activity).</div>
            ) : (
              pnl.cogs.map((c) => (
                <div key={c.accountId} className="px-6 py-2.5 flex items-center justify-between">
                  <span className="text-slate-800">
                    <span className="font-mono text-slate-400 mr-2">{c.accountCode}</span>
                    {c.accountName}
                  </span>
                  <span className="font-mono font-medium text-slate-900">{formatCurr(c.amount)}</span>
                </div>
              ))
            )}
          </div>
          <div className="bg-slate-100/70 px-6 py-3 flex items-center justify-between font-bold border-t border-slate-200 text-slate-900">
            <span>Total Cost of Goods Sold</span>
            <span className="font-mono text-sm text-amber-900">{formatCurr(pnl.totalCogs)}</span>
          </div>
        </div>

        {/* Gross Profit Callout */}
        <div className="bg-blue-50/60 px-6 py-4 flex items-center justify-between font-bold border-b border-blue-200 text-blue-900">
          <div>
            <span className="text-sm">GROSS PROFIT</span>
            <span className="text-xs font-normal text-blue-600 ml-2">
              (Margin: {grossMarginPct}%)
            </span>
          </div>
          <span className="font-mono text-base font-extrabold text-blue-900">
            {formatCurr(pnl.grossProfit)}
          </span>
        </div>

        {/* Section 3: Operating Expenses */}
        <div className="border-b border-slate-200">
          <div className="bg-slate-50 px-6 py-2.5 font-bold uppercase tracking-wider text-slate-600 text-[11px]">
            3. Operating & Administrative Expenses
          </div>
          <div className="divide-y divide-slate-100">
            {pnl.operatingExpenses.length === 0 ? (
              <div className="px-6 py-3 text-slate-400 italic">No operating expenses recorded.</div>
            ) : (
              pnl.operatingExpenses.map((exp) => (
                <div key={exp.accountId} className="px-6 py-2.5 flex items-center justify-between">
                  <span className="text-slate-800">
                    <span className="font-mono text-slate-400 mr-2">{exp.accountCode}</span>
                    {exp.accountName}
                  </span>
                  <span className="font-mono font-medium text-slate-900">{formatCurr(exp.amount)}</span>
                </div>
              ))
            )}
          </div>
          <div className="bg-slate-100/70 px-6 py-3 flex items-center justify-between font-bold border-t border-slate-200 text-slate-900">
            <span>Total Operating Expenses</span>
            <span className="font-mono text-sm text-slate-900">{formatCurr(pnl.totalOperatingExpenses)}</span>
          </div>
        </div>

        {/* Operating Profit */}
        <div className="bg-slate-100 px-6 py-3.5 flex items-center justify-between font-bold border-b border-slate-300 text-slate-900">
          <span className="text-xs uppercase tracking-wider">Operating Profit (EBITDA)</span>
          <span className="font-mono text-sm">{formatCurr(pnl.operatingProfit)}</span>
        </div>

        {/* Section 4: Other Income */}
        {pnl.otherIncome.length > 0 && (
          <div className="border-b border-slate-200">
            <div className="bg-slate-50 px-6 py-2 font-bold uppercase tracking-wider text-slate-600 text-[11px]">
              4. Other Income & Inventory Adjustments
            </div>
            <div className="divide-y divide-slate-100">
              {pnl.otherIncome.map((oi) => (
                <div key={oi.accountId} className="px-6 py-2 flex items-center justify-between">
                  <span className="text-slate-800">
                    <span className="font-mono text-slate-400 mr-2">{oi.accountCode}</span>
                    {oi.accountName}
                  </span>
                  <span className="font-mono font-medium text-slate-900">{formatCurr(oi.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Net Profit / (Loss) */}
        <div className={`px-6 py-5 flex items-center justify-between font-bold ${
          pnl.netProfit >= 0 ? 'bg-emerald-50 text-emerald-950' : 'bg-red-50 text-red-950'
        }`}>
          <div>
            <span className="text-base font-black">NET PROFIT / (LOSS)</span>
            <span className="text-xs font-normal ml-2 opacity-80">
              (Net Margin: {netMarginPct}%)
            </span>
          </div>
          <span className={`font-mono text-xl font-extrabold ${
            pnl.netProfit >= 0 ? 'text-emerald-800' : 'text-red-800'
          }`}>
            {formatCurr(pnl.netProfit)}
          </span>
        </div>
      </div>
    </div>
  );
}
