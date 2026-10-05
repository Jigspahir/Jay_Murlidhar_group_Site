import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCompany } from '../../../contexts/CompanyContext';
import { useAuth } from '../../../hooks/useAuth';
import { 
  getAccounts, 
  createManualJournal 
} from '../../../features/accounting';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  DollarSign,
  Save
} from 'lucide-react';

export default function ManualJournalCreate() {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [narration, setNarration] = useState('');
  const [lines, setLines] = useState([
    { accountId: '', debit: '', credit: '', description: '' },
    { accountId: '', debit: '', credit: '', description: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadAccounts = useCallback(async () => {
    if (!currentCompany?.id) return;
    try {
      const data = await getAccounts(currentCompany.id, { isActive: true });
      setAccounts(data);
    } catch (err) {
      console.error('Failed to load accounts:', err);
      setError('Failed to load chart of accounts.');
    }
  }, [currentCompany?.id]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleAddLine = () => {
    setLines([...lines, { accountId: '', debit: '', credit: '', description: '' }]);
  };

  const handleRemoveLine = (idx) => {
    if (lines.length <= 2) {
      setError('A double-entry voucher requires at least two lines.');
      return;
    }
    const updated = lines.filter((_, i) => i !== idx);
    setLines(updated);
  };

  const handleLineChange = (index, field, value) => {
    const updated = [...lines];
    const line = { ...updated[index] };

    if (field === 'debit') {
      line.debit = value;
      if (value && Number(value) > 0) line.credit = ''; // Mutual exclusivity
    } else if (field === 'credit') {
      line.credit = value;
      if (value && Number(value) > 0) line.debit = ''; // Mutual exclusivity
    } else {
      line[field] = value;
    }

    updated[index] = line;
    setLines(updated);
  };

  // Compute live totals
  const { totalDebit, totalCredit, difference, isBalanced } = useMemo(() => {
    let dr = 0;
    let cr = 0;
    lines.forEach((l) => {
      dr += Number(l.debit) || 0;
      cr += Number(l.credit) || 0;
    });

    dr = Math.round(dr * 100) / 100;
    cr = Math.round(cr * 100) / 100;
    const diff = Math.round(Math.abs(dr - cr) * 100) / 100;
    const balanced = dr > 0 && cr > 0 && diff === 0;

    return {
      totalDebit: dr,
      totalCredit: cr,
      difference: diff,
      isBalanced: balanced
    };
  }, [lines]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentCompany?.id) return;
    if (!isBalanced) {
      setError(`Cannot post unbalanced journal voucher. Total Debit (₹${totalDebit}) must equal Total Credit (₹${totalCredit}).`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const journal = await createManualJournal({
        companyId: currentCompany.id,
        entryDate,
        referenceNumber,
        narration,
        lines: lines.map((l) => ({
          accountId: l.accountId,
          debit: Number(l.debit) || 0,
          credit: Number(l.credit) || 0,
          description: l.description || narration
        })),
        entryType: 'manual',
        sourceModule: 'manual',
        userId: user?.id
      });

      navigate(`/admin/accounting/journals/${journal.id}`);
    } catch (err) {
      console.error('Manual journal posting error:', err);
      setError(err.message || 'Failed to post journal entry.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/accounting/journals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel & Back to Journals</span>
        </Link>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              Double-Entry Financial Voucher
            </span>
            <h1 className="text-xl font-bold tracking-tight mt-1">
              New Manual Journal Entry
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Company: <strong className="text-white">{currentCompany?.name}</strong>
            </p>
          </div>

          {/* Live Invariant Status */}
          <div className="flex items-center gap-2">
            {isBalanced ? (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>BALANCED (₹{totalDebit.toFixed(2)})</span>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold font-mono flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>UNBALANCED (Diff: ₹{difference.toFixed(2)})</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="m-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Voucher Meta Form */}
        <div className="p-6 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Voucher Date *
            </label>
            <input
              type="date"
              required
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Reference / Document Number
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. ADJ-2026-001"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Narration / Audit Purpose *
            </label>
            <input
              type="text"
              required
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="e.g. Month-end depreciation adjustment"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Journal Lines Editor */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Journal Lines (Minimum 2 Lines Required)
            </h2>
            <button
              type="button"
              onClick={handleAddLine}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Line</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3 w-72">Ledger Account *</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 w-36 text-right">Debit (₹)</th>
                  <th className="py-2.5 px-3 w-36 text-right">Credit (₹)</th>
                  <th className="py-2.5 px-3 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 text-center font-mono text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3">
                      <select
                        required
                        value={line.accountId}
                        onChange={(e) => handleLineChange(idx, 'accountId', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded font-medium focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">-- Select Ledger Account --</option>
                        {accounts.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.account_code} — {a.account_name} ({a.account_class.toUpperCase()})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={line.description}
                        onChange={(e) => handleLineChange(idx, 'description', e.target.value)}
                        placeholder="Line description (defaults to narration)"
                        className="w-full p-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                      >
                      </input>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={line.debit}
                        onChange={(e) => handleLineChange(idx, 'debit', e.target.value)}
                        placeholder="0.00"
                        className="w-full p-2 bg-white border border-slate-300 rounded text-right font-mono font-bold focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={line.credit}
                        onChange={(e) => handleLineChange(idx, 'credit', e.target.value)}
                        placeholder="0.00"
                        className="w-full p-2 bg-white border border-slate-300 rounded text-right font-mono font-bold focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      {lines.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(idx)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                          title="Remove line"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-right uppercase tracking-wider text-xs">
                    Running Totals:
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-sm text-emerald-800">
                    ₹{totalDebit.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-sm text-blue-800">
                    ₹{totalCredit.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {isBalanced ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Ready to post. Total Debits match Total Credits.
              </span>
            ) : (
              <span className="text-red-700 font-semibold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Out of balance by ₹{difference.toFixed(2)}. Correct lines to post.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/accounting/journals"
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={!isBalanced || isSubmitting}
              className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-white text-xs font-semibold shadow-sm transition-all ${
                isBalanced && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                  : 'bg-slate-400 cursor-not-allowed opacity-70'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Posting Voucher...' : 'Post Journal Voucher'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
