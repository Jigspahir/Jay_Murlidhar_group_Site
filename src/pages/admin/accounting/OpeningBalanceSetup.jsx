import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../../contexts/CompanyContext';
import { useAuth } from '../../../hooks/useAuth';
import { getAccounts, postOpeningBalanceJournal } from '../../../features/accounting';
import { 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  Save, 
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';

export default function OpeningBalanceSetup() {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [balances, setBalances] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!currentCompany?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const accs = await getAccounts(currentCompany.id, { isActive: true });
      setAccounts(accs);

      // Pre-fill initial balance state
      const initial = {};
      accs.forEach((a) => {
        initial[a.id] = { debit: '', credit: '' };
      });
      setBalances(initial);
    } catch (err) {
      console.error('Failed to load accounts for opening balance:', err);
      setError('Failed to load chart of accounts.');
    } finally {
      setIsLoading(false);
    }
  }, [currentCompany?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAmountChange = (accountId, field, val) => {
    setBalances((prev) => ({
      ...prev,
      [accountId]: {
        ...prev[accountId],
        [field]: val,
        [field === 'debit' ? 'credit' : 'debit']: val && Number(val) > 0 ? '' : prev[accountId]?.[field === 'debit' ? 'credit' : 'debit']
      }
    }));
  };

  const { totalDebit, totalCredit, difference, isBalanced } = useMemo(() => {
    let dr = 0;
    let cr = 0;
    Object.values(balances).forEach((b) => {
      dr += Number(b?.debit) || 0;
      cr += Number(b?.credit) || 0;
    });

    dr = Math.round(dr * 100) / 100;
    cr = Math.round(cr * 100) / 100;
    const diff = Math.round(Math.abs(dr - cr) * 100) / 100;

    return {
      totalDebit: dr,
      totalCredit: cr,
      difference: diff,
      isBalanced: dr > 0 && cr > 0 && diff === 0
    };
  }, [balances]);

  const handleAutoBalanceCapital = () => {
    const capitalAcc = accounts.find((a) => a.account_code === '3110');
    if (!capitalAcc) {
      setError('Owner / Partner Capital ledger (3110) not found.');
      return;
    }

    let dr = 0;
    let cr = 0;
    Object.entries(balances).forEach(([accId, b]) => {
      if (accId !== capitalAcc.id) {
        dr += Number(b?.debit) || 0;
        cr += Number(b?.credit) || 0;
      }
    });

    const net = Math.round((dr - cr) * 100) / 100;
    if (net > 0) {
      // Net debits > credits -> credit Capital
      setBalances((prev) => ({
        ...prev,
        [capitalAcc.id]: { debit: '', credit: net.toString() }
      }));
    } else if (net < 0) {
      // Net credits > debits -> debit Capital
      setBalances((prev) => ({
        ...prev,
        [capitalAcc.id]: { debit: Math.abs(net).toString(), credit: '' }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentCompany?.id) return;
    if (!isBalanced) {
      setError(`Opening balance must be balanced. Discrepancy: ₹${difference.toFixed(2)}.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const activeRows = Object.entries(balances)
        .filter(([_, b]) => (Number(b?.debit) || 0) > 0 || (Number(b?.credit) || 0) > 0)
        .map(([accId, b]) => ({
          accountId: accId,
          debit: Number(b?.debit) || 0,
          credit: Number(b?.credit) || 0
        }));

      const journal = await postOpeningBalanceJournal({
        companyId: currentCompany.id,
        asOfDate,
        accountsWithBalances: activeRows,
        userId: user?.id
      });

      navigate(`/admin/accounting/journals/${journal.id}`);
    } catch (err) {
      console.error('Opening balance posting error:', err);
      setError(err.message || 'Failed to post opening balance journal.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Accounting Go-Live
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Opening Balance Setup Wizard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Controlled initial double-entry balance setup for{' '}
            <strong className="text-slate-800">{currentCompany?.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isBalanced ? (
            <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>BALANCED (₹{totalDebit.toFixed(2)})</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold font-mono flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>UNBALANCED (₹{difference.toFixed(2)})</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Info Callout */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Controlled Opening Balance Rules:</p>
          <ul className="list-disc list-inside space-y-1 mt-1 text-blue-800">
            <li>Existing operational invoices and bills remain as subledger history. Do NOT back-generate historical vouchers.</li>
            <li>Enter your cut-off opening debtors (AR), creditors (AP), stock valuation, and cash/bank balances.</li>
            <li>Use the <strong>"Auto-balance to Capital"</strong> button to automatically assign the net difference to Owner Capital (3110).</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        {/* Date Selector Strip */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-700">Accounting Cut-off Date *</label>
            <input
              type="date"
              required
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="p-1.5 bg-white border border-slate-300 rounded-lg font-mono"
            />
          </div>

          <button
            type="button"
            onClick={handleAutoBalanceCapital}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Auto-balance to Owner Capital (3110)</span>
          </button>
        </div>

        {/* Dense Account Balances Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4 w-28">Account Code</th>
                <th className="py-2.5 px-4">Account Name & Class</th>
                <th className="py-2.5 px-4 w-24">Normal</th>
                <th className="py-2.5 px-4 text-right w-40">Opening Debit (₹)</th>
                <th className="py-2.5 px-4 text-right w-40">Opening Credit (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {accounts.map((acc) => {
                const b = balances[acc.id] || { debit: '', credit: '' };
                const isDebitNormal = acc.normal_balance === 'debit';

                return (
                  <tr key={acc.id} className="hover:bg-slate-50/70">
                    <td className="py-2 px-4 font-mono font-bold text-slate-900">
                      {acc.account_code}
                    </td>
                    <td className="py-2 px-4">
                      <span className="font-semibold text-slate-800">{acc.account_name}</span>
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">
                        {acc.account_class} • {acc.account_type}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                        isDebitNormal ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {acc.normal_balance}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={b.debit}
                        onChange={(e) => handleAmountChange(acc.id, 'debit', e.target.value)}
                        placeholder="0.00"
                        className="w-full p-1.5 bg-white border border-slate-300 rounded text-right font-mono font-bold focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-4 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={b.credit}
                        onChange={(e) => handleAmountChange(acc.id, 'credit', e.target.value)}
                        placeholder="0.00"
                        className="w-full p-1.5 bg-white border border-slate-300 rounded text-right font-mono font-bold focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Table Footer */}
            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
              <tr>
                <td colSpan={3} className="py-3 px-4 text-right uppercase tracking-wider">
                  Total Opening Balances:
                </td>
                <td className="py-3 px-4 text-right font-mono text-sm text-emerald-800">
                  ₹{totalDebit.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-sm text-blue-800">
                  ₹{totalCredit.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Submit Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {isBalanced ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Balances in equilibrium. Ready to commit opening voucher.
              </span>
            ) : (
              <span className="text-red-700 font-semibold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Difference of ₹{difference.toFixed(2)}. Auto-balance or adjust entries.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isBalanced || isSubmitting}
            className={`inline-flex items-center gap-1.5 px-6 py-2 rounded-lg text-white font-semibold text-xs shadow-sm transition-all ${
              isBalanced && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                : 'bg-slate-400 cursor-not-allowed opacity-70'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Posting Opening Journal...' : 'Commit Opening Balance'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
