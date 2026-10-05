import React, { useState, useEffect, useCallback } from 'react';
import { useCompany } from '../../../contexts/CompanyContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { getTrialBalance, getFiscalYears } from '../../../features/accounting';
import { 
  FileBarChart, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Printer, 
  Download,
  Building2
} from 'lucide-react';

export default function TrialBalanceReport() {
  const { currentCompany } = useCompany();
  const { isGroupOwner } = usePermissions();

  const [report, setReport] = useState({ rows: [], totals: { debit: 0, credit: 0 }, isBalanced: true });
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

      const data = await getTrialBalance({
        companyId: currentCompany?.id,
        fiscalYearId: selectedFyId || null,
        startDate: startDate || null,
        endDate: endDate || null,
        isConsolidated
      });
      setReport(data);
    } catch (err) {
      console.error('Failed to load trial balance:', err);
      setError(err.message || 'Error generating trial balance.');
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

  const handleExportCsv = () => {
    const headers = ['Account Code', 'Account Name', 'Class', 'Period Debit', 'Period Credit', 'Closing Debit', 'Closing Credit'];
    const rows = report.rows.map((r) => [
      `"${r.accountCode}"`,
      `"${r.accountName}"`,
      `"${r.accountClass}"`,
      r.periodDebit,
      r.periodCredit,
      r.closingDebit,
      r.closingCredit
    ]);
    const totalsRow = [
      '"TOTALS"',
      '""',
      '""',
      '',
      '',
      report.totals.debit,
      report.totals.credit
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(',')), totalsRow.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `trial_balance_${currentCompany?.slug || 'jmg'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Statutory Statement
            </span>
            {isConsolidated && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                Group Consolidated
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Trial Balance
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Verification of Double-Entry Ledger Equilibrium for{' '}
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
            onClick={handleExportCsv}
            disabled={report.rows.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

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

      {/* Filter Strip */}
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-28">Code</th>
                <th className="py-3 px-4">Account Name</th>
                <th className="py-3 px-4 w-24">Class</th>
                <th className="py-3 px-4 text-right w-32">Period Debit</th>
                <th className="py-3 px-4 text-right w-32">Period Credit</th>
                <th className="py-3 px-4 text-right w-36">Closing Debit (₹)</th>
                <th className="py-3 px-4 text-right w-36">Closing Credit (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Generating trial balance...
                  </td>
                </tr>
              ) : report.rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No ledger activity found for selected criteria.
                  </td>
                </tr>
              ) : (
                report.rows.map((row) => (
                  <tr key={row.accountId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                      {row.accountCode}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-800">
                      {row.accountName}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="capitalize px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {row.accountClass}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                      {row.periodDebit > 0 ? formatCurr(row.periodDebit) : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                      {row.periodCredit > 0 ? formatCurr(row.periodCredit) : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-800">
                      {row.closingDebit > 0 ? formatCurr(row.closingDebit) : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-blue-800">
                      {row.closingCredit > 0 ? formatCurr(row.closingCredit) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Totals Row */}
            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
              <tr>
                <td colSpan={5} className="py-3.5 px-4 text-right uppercase tracking-wider text-xs">
                  Grand Totals:
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-sm text-emerald-800">
                  {formatCurr(report.totals.debit)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-sm text-blue-800">
                  {formatCurr(report.totals.credit)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Balance Status Banner */}
        <div className={`p-4 border-t text-xs flex items-center justify-between ${
          report.isBalanced
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {report.isBalanced ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-bold">TRIAL BALANCE BALANCED:</span>
                <span>Total Closing Debits match Total Closing Credits.</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="font-bold">OUT OF EQUILIBRIUM:</span>
                <span>
                  Discrepancy of {formatCurr(Math.abs(report.totals.debit - report.totals.credit))} detected.
                </span>
              </>
            )}
          </div>
          <span className="font-mono text-[11px] font-bold">
            Invariant: $\sum Dr = \sum Cr$
          </span>
        </div>
      </div>
    </div>
  );
}
