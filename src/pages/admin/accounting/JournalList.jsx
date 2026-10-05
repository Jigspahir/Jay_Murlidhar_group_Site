import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../../contexts/CompanyContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../config/permissions';
import { getJournals, ENTRY_TYPES } from '../../../features/accounting';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  ArrowUpRight, 
  CheckCircle, 
  AlertCircle,
  Eye
} from 'lucide-react';

export default function JournalList() {
  const { currentCompany } = useCompany();
  const { hasPermission } = usePermissions();

  const [journals, setJournals] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!currentCompany?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getJournals(currentCompany.id, {
        entryType: selectedType === 'all' ? null : selectedType,
        status: selectedStatus === 'all' ? null : selectedStatus,
        startDate: startDate || null,
        endDate: endDate || null,
        search: searchQuery || null
      });
      setJournals(data);
    } catch (err) {
      console.error('Failed to load journals:', err);
      setError(err.message || 'Error fetching journals.');
    } finally {
      setIsLoading(false);
    }
  }, [currentCompany?.id, selectedType, selectedStatus, startDate, endDate, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatCurr = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);

  // Compute total debit/credit across all listed journals
  const { totalDebit, totalCredit } = useMemo(() => {
    let dr = 0;
    let cr = 0;
    journals.forEach((j) => {
      dr += Number(j.total_debit) || 0;
      cr += Number(j.total_credit) || 0;
    });
    return {
      totalDebit: Math.round(dr * 100) / 100,
      totalCredit: Math.round(cr * 100) / 100
    };
  }, [journals]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Journal Entries Register
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Double-entry financial vouchers for{' '}
            <strong className="text-slate-800">{currentCompany?.name}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {hasPermission(PERMISSIONS.ACCOUNTING_JOURNALS_CREATE) && (
            <Link
              to="/admin/accounting/manual-journal"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Journal Voucher</span>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Invariant Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Voucher Count</span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {journals.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total Debits</span>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
            {formatCurr(totalDebit)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total Credits</span>
          <div className="text-xl font-bold font-mono text-blue-700 mt-1">
            {formatCurr(totalCredit)}
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Type Filter */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Voucher Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="all">All Types</option>
              {ENTRY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="all">All Statuses</option>
              <option value="posted">Posted</option>
              <option value="reversed">Reversed</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>

          {/* End Date */}
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

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journal number, reference, or narration..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Journal #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Source / Reference</th>
                <th className="py-3 px-4">Narration</th>
                <th className="py-3 px-4 text-right">Debit (₹)</th>
                <th className="py-3 px-4 text-right">Credit (₹)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Loading journal vouchers...
                  </td>
                </tr>
              ) : journals.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No journal entries found.
                  </td>
                </tr>
              ) : (
                journals.map((j) => {
                  const typeObj = ENTRY_TYPES.find((t) => t.value === j.entry_type) || { label: j.entry_type };
                  const isRev = j.is_reversal;
                  const isReversed = j.status === 'reversed';

                  return (
                    <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">
                        <Link to={`/admin/accounting/journals/${j.id}`} className="hover:underline">
                          {j.journal_number}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {j.entry_date}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isRev ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {typeObj.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-800">
                          {j.reference_number || j.source_module || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={j.narration}>
                        {j.narration}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {formatCurr(j.total_debit)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {formatCurr(j.total_credit)}
                      </td>
                      <td className="py-3 px-4">
                        {isReversed ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            REVERSED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            POSTED
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/admin/accounting/journals/${j.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-all"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </Link>
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
