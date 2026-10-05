import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../../contexts/CompanyContext';
import { bankReconciliationService } from '../../../features/banking/services/bankReconciliationService';
import { supabase } from '../../../lib/supabase';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function BankReconciliationList() {
  const navigate = useNavigate();
  const { currentCompany } = useCompany();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [reconciliations, setReconciliations] = useState([]);
  const [statements, setStatements] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New reconciliation modal state
  const [showModal, setShowModal] = useState(false);
  const [newReconDate, setNewReconDate] = useState(new Date().toISOString().split('T')[0]);
  const [newClosingBal, setNewClosingBal] = useState('');

  useEffect(() => {
    async function loadAccounts() {
      if (!currentCompany?.id) return;
      try {
        setLoading(true);
        const { data, error: accErr } = await supabase
          .from('company_bank_accounts')
          .select('id, bank_name, account_number, account_type')
          .eq('company_id', currentCompany.id)
          .eq('status', 'active');
        if (accErr) throw accErr;
        setBankAccounts(data || []);
        if (data?.length > 0) {
          setSelectedAccountId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load bank accounts:', err);
        setError('Failed to load bank accounts');
      } finally {
        setLoading(false);
      }
    }
    loadAccounts();
  }, [currentCompany?.id]);

  useEffect(() => {
    async function loadData() {
      if (!currentCompany?.id || !selectedAccountId) return;
      try {
        setLoading(true);
        const [recons, stmts] = await Promise.all([
          bankReconciliationService.getReconciliations(currentCompany.id, selectedAccountId),
          bankReconciliationService.getStatements(currentCompany.id, selectedAccountId)
        ]);
        setReconciliations(recons || []);
        setStatements(stmts || []);
      } catch (err) {
        console.error('Failed to load bank reconciliation history:', err);
        setError('Failed to load reconciliation records');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentCompany?.id, selectedAccountId]);

  const handleStartReconciliation = async (e) => {
    e.preventDefault();
    if (!selectedAccountId) return;
    try {
      const recon = await bankReconciliationService.startReconciliation({
        company_id: currentCompany.id,
        bank_account_id: selectedAccountId,
        statement_date: newReconDate,
        closing_balance_per_bank: Number(newClosingBal || 0)
      });
      setShowModal(false);
      navigate(`/admin/bank-reconciliation/${recon.id}`);
    } catch (err) {
      console.error('Failed to start reconciliation:', err);
      alert(err.message || 'Failed to start reconciliation');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bank Reconciliation (BRS)</h1>
          <p className="text-sm text-gray-500">
            Reconcile physical bank statements against accounting books with CSV staging and matching
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/bank-reconciliation/import')}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
          >
            Import Bank Statement (CSV)
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition"
          >
            New Reconciliation Period
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Account Selector */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4">
        <label className="text-xs font-semibold text-gray-600">Company Bank Account:</label>
        <select
          value={selectedAccountId}
          onChange={(e) => setSelectedAccountId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm min-w-[280px]"
        >
          {bankAccounts.map((b) => (
            <option key={b.id} value={b.id}>
              {b.bank_name} — {b.account_number} ({b.account_type})
            </option>
          ))}
        </select>
      </div>

      {/* Reconciliation Periods Table */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-900">Reconciliation Periods</h2>
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading reconciliation records...</div>
        ) : reconciliations.length === 0 ? (
          <div className="py-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
            No reconciliation periods initiated for this bank account yet.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Period / Date</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Bank Statement Balance</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Book Balance</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Discrepancy</th>
                  <th className="px-6 py-3 text-center font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reconciliations.map((rec) => {
                  const diff = Number(rec.difference || 0);
                  return (
                    <tr key={rec.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {formatDate(rec.statement_date)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-gray-900">
                        {formatCurrency(rec.closing_balance_per_bank)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-gray-700">
                        {formatCurrency(rec.closing_balance_per_books)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        <span className={diff === 0 ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {formatCurrency(diff)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          rec.status === 'finalized'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rec.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/admin/bank-reconciliation/${rec.id}`)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {rec.status === 'finalized' ? 'View BRS Statement →' : 'Open Workspace →'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Staged Statements History */}
      <div className="space-y-4 pt-4">
        <h2 className="text-base font-bold text-gray-900">Imported Statement Batches</h2>
        {statements.length === 0 ? (
          <div className="py-6 text-center text-xs text-gray-400 bg-white rounded-lg border border-gray-200">
            No bank statements imported yet for this bank account.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">File Name</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Statement Period</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">Imported Rows</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">Opening Balance</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">Closing Balance</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Imported Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {statements.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono font-medium text-gray-900">{s.file_name}</td>
                    <td className="px-4 py-2 text-gray-600">
                      {formatDate(s.statement_from)} – {formatDate(s.statement_to)}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-700">{s.total_rows}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(s.opening_balance)}</td>
                    <td className="px-4 py-2 text-right font-semibold text-gray-900">{formatCurrency(s.closing_balance)}</td>
                    <td className="px-4 py-2 text-gray-500">{formatDate(s.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Start Reconciliation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Initiate Reconciliation Period</h3>
            <form onSubmit={handleStartReconciliation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Reconciliation As Of Date *</label>
                <input
                  type="date"
                  value={newReconDate}
                  onChange={(e) => setNewReconDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Bank Statement Closing Balance (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newClosingBal}
                  onChange={(e) => setNewClosingBal(e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-semibold"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the exact balance reported on your bank physical/e-statement for this cutoff date.
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
                >
                  Create & Launch Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
