import React, { useState, useEffect, useCallback } from 'react';
import { useCompany } from '../../../contexts/CompanyContext';
import { getAccounts, getGeneralLedger } from '../../../features/accounting';
import { 
  BookOpen, 
  Search, 
  RefreshCw, 
  Printer, 
  Download, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function GeneralLedgerReport() {
  const { currentCompany } = useCompany();

  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [ledgerData, setLedgerData] = useState({ account: null, lines: [], finalBalance: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAccounts = useCallback(async () => {
    if (!currentCompany?.id) return;
    try {
      const data = await getAccounts(currentCompany.id);
      setAccounts(data);
      if (data.length > 0 && !selectedAccountId) {
        setSelectedAccountId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load accounts:', err);
    }
  }, [currentCompany?.id, selectedAccountId]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const loadLedger = useCallback(async () => {
    if (!currentCompany?.id || !selectedAccountId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getGeneralLedger({
        companyId: currentCompany.id,
        accountId: selectedAccountId,
        startDate: startDate || null,
        endDate: endDate || null
      });
      setLedgerData(data);
    } catch (err) {
      console.error('Failed to load GL:', err);
      setError(err.message || 'Error generating ledger.');
    } finally {
      setIsLoading(false);
    }
  }, [currentCompany?.id, selectedAccountId, startDate, endDate]);

  useEffect(() => {
    loadLedger();
  }, [loadLedger]);

  const formatCurr = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            General Ledger Statement
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Chronological audit trail and running balances for individual ledger accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={loadLedger}
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

      {/* Account Selector & Date Range Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Select Account *</label>
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.account_code} — {a.account_name} ({a.account_class.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">To Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
          />
        </div>
      </div>

      {/* Account Profile Strip */}
      {selectedAccount && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-blue-700">
                {selectedAccount.account_code}
              </span>
              <span className="text-base font-bold text-slate-900">
                {selectedAccount.account_name}
              </span>
              <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                {selectedAccount.account_class}
              </span>
            </div>
            <span className="text-xs text-slate-500 mt-0.5 block">
              Normal Balance: <strong className="uppercase font-mono">{selectedAccount.normal_balance}</strong> • Category: {selectedAccount.account_type}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Closing Balance</span>
            <span className="text-xl font-bold font-mono text-slate-900">
              {formatCurr(ledgerData.finalBalance)}
            </span>
          </div>
        </div>
      )}

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-28">Date</th>
                <th className="py-3 px-4 w-36">Voucher #</th>
                <th className="py-3 px-4 w-28">Reference</th>
                <th className="py-3 px-4">Narration / Line Description</th>
                <th className="py-3 px-4 text-right w-32">Debit (₹)</th>
                <th className="py-3 px-4 text-right w-32">Credit (₹)</th>
                <th className="py-3 px-4 text-right w-36">Running Balance (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading ledger statement...
                  </td>
                </tr>
              ) : ledgerData.lines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No transactions found for this account in the selected date range.
                  </td>
                </tr>
              ) : (
                ledgerData.lines.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-slate-600">
                      {l.date}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-blue-600">
                      {l.journalNumber}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600">
                      {l.referenceNumber || '—'}
                    </td>
                    <td className="py-2.5 px-4 text-slate-800">
                      {l.narration}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-medium text-slate-900">
                      {l.debit > 0 ? formatCurr(l.debit) : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-medium text-slate-900">
                      {l.credit > 0 ? formatCurr(l.credit) : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurr(l.runningBalance)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
