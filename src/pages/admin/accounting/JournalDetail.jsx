import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../config/permissions';
import { getJournalById, reverseJournal } from '../../../features/accounting';
import { 
  ArrowLeft, 
  CheckCircle, 
  RotateCcw, 
  AlertCircle, 
  FileText, 
  Calendar, 
  Building2, 
  ShieldCheck,
  Printer
} from 'lucide-react';

export default function JournalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission, isGroupOwner } = usePermissions();

  const [journal, setJournal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isReversing, setIsReversing] = useState(false);
  const [showReversalModal, setShowReversalModal] = useState(false);
  const [reversalReason, setReversalReason] = useState('');

  const loadData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getJournalById(id);
      setJournal(data);
    } catch (err) {
      console.error('Failed to load journal:', err);
      setError(err.message || 'Error loading journal voucher.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReverse = async (e) => {
    e.preventDefault();
    if (!journal) return;
    setIsReversing(true);
    setError(null);
    try {
      const rev = await reverseJournal(journal.id, reversalReason);
      setShowReversalModal(false);
      setSuccessMsg(`Journal successfully reversed. Reversal Voucher: ${rev.journal_number}`);
      await loadData();
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      console.error('Reversal error:', err);
      setError(err.message || 'Failed to reverse journal.');
    } finally {
      setIsReversing(false);
    }
  };

  const formatCurr = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400">
        Loading journal voucher...
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
        <h2 className="text-base font-bold text-slate-900">Journal Voucher Not Found</h2>
        <Link to="/admin/accounting/journals" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
          ← Back to Journal Register
        </Link>
      </div>
    );
  }

  const canReverse = hasPermission(PERMISSIONS.ACCOUNTING_JOURNALS_REVERSE) && journal.status === 'posted' && !journal.is_reversal;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/accounting/journals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journal Register</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Voucher</span>
          </button>

          {canReverse && (
            <button
              onClick={() => setShowReversalModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reverse Voucher</span>
            </button>
          )}
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

      {/* Main Voucher Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Voucher Header Banner */}
        <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
              <span>JOURNAL VOUCHER</span>
              <span>•</span>
              <span>{journal.fiscal_year?.fiscal_year_code}</span>
              <span>•</span>
              <span>{journal.period?.period_name}</span>
            </div>
            <h1 className="text-2xl font-bold font-mono tracking-tight mt-1">
              {journal.journal_number}
            </h1>
            <div className="text-xs text-slate-300 mt-1">
              Narration: <span className="text-white font-medium">{journal.narration}</span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1.5">
            <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider ${
              journal.status === 'posted' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {journal.status}
            </span>
            {journal.is_reversal && (
              <span className="text-[11px] font-mono text-red-300 bg-red-950/60 px-2 py-0.5 rounded border border-red-800">
                REVERSAL ENTRY
              </span>
            )}
            <span className="text-xs text-slate-400 font-mono">
              Date: {journal.entry_date}
            </span>
          </div>
        </div>

        {/* Voucher Metadata Grid */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Voucher Type</span>
            <span className="font-mono font-bold text-slate-800 uppercase">{journal.entry_type}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Source Module</span>
            <span className="font-mono text-slate-800">{journal.source_module}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Reference No.</span>
            <span className="font-mono text-slate-800">{journal.reference_number || '—'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Posted At</span>
            <span className="font-mono text-slate-800">
              {new Date(journal.posting_date || journal.created_at).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Lines Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-28">Account Code</th>
                <th className="py-3 px-4">Account Name & Class</th>
                <th className="py-3 px-4">Line Description</th>
                <th className="py-3 px-4 text-right w-36">Debit (₹)</th>
                <th className="py-3 px-4 text-right w-36">Credit (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(journal.lines || []).map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 text-center font-mono text-slate-400">
                    {l.line_number}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">
                    {l.account?.account_code}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{l.account?.account_name}</div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      {l.account?.account_class} • {l.account?.account_type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {l.description || '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {Number(l.debit) > 0 ? formatCurr(l.debit) : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {Number(l.credit) > 0 ? formatCurr(l.credit) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Voucher Footer Summary */}
            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
              <tr>
                <td colSpan={4} className="py-3.5 px-4 text-right uppercase tracking-wider text-xs">
                  Voucher Totals:
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-sm text-emerald-800">
                  {formatCurr(journal.total_debit)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-sm text-blue-800">
                  {formatCurr(journal.total_credit)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Double-Entry Compliance Badge */}
        <div className="p-4 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Double-Entry Rule Satisfied:</span>
            <span>Total Debits exactly equal Total Credits (₹{journal.total_debit}).</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
            Invariant: Total Dr = Total Cr
          </span>
        </div>
      </div>

      {/* Reversal Confirmation Modal */}
      {showReversalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-red-600" />
                <span>Reverse Journal Voucher</span>
              </h2>
              <button
                onClick={() => setShowReversalModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReverse} className="p-4 space-y-3.5 text-xs">
              <p className="text-slate-600">
                You are about to post an append-only reversal journal for voucher{' '}
                <strong className="font-mono text-slate-900">{journal.journal_number}</strong>.
                Debits will become Credits, and Credits will become Debits. The original journal will be locked as REVERSED.
              </p>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Reversal Reason / Narration *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  placeholder="Mandatory audit explanation for reversal..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowReversalModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReversing}
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm"
                >
                  {isReversing ? 'Reversing...' : 'Confirm Reversal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
