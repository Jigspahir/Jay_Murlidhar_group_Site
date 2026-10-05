import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bankReconciliationService } from '../../../features/banking/services/bankReconciliationService';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function BankReconciliationWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [statement, setStatement] = useState(null);
  const [bankTxns, setBankTxns] = useState([]);
  const [bookTxns, setBookTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [finalizing, setFinalizing] = useState(false);

  // Manual matching selection
  const [selectedBankTxnId, setSelectedBankTxnId] = useState(null);
  const [selectedBookTxn, setSelectedBookTxn] = useState(null); // { id, type }

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const brs = await bankReconciliationService.getBRSStatement(id);
      setStatement(brs);

      const [bTxns, bkTxns] = await Promise.all([
        bankReconciliationService.getStagedTransactions(brs.reconciliation.bank_account_id, brs.reconciliation.statement_date),
        bankReconciliationService.getUnreconciledBookTransactions(brs.reconciliation.company_id, brs.reconciliation.bank_account_id, brs.reconciliation.statement_date)
      ]);
      setBankTxns(bTxns || []);
      setBookTxns(bkTxns || []);
    } catch (err) {
      console.error('Failed to load BRS data:', err);
      setError(err.message || 'Failed to load reconciliation workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleMatch = async () => {
    if (!selectedBankTxnId || !selectedBookTxn) {
      alert('Please select both a Bank Statement row and a Book Transaction row to match');
      return;
    }
    try {
      await bankReconciliationService.matchTransaction({
        bank_transaction_id: selectedBankTxnId,
        book_transaction_id: selectedBookTxn.id,
        book_transaction_type: selectedBookTxn.type,
        reconciliation_id: id
      });
      setSelectedBankTxnId(null);
      setSelectedBookTxn(null);
      await loadData();
    } catch (err) {
      console.error('Match error:', err);
      alert(err.message || 'Failed to match transactions');
    }
  };

  const handleUnmatch = async (bankTxnId) => {
    try {
      await bankReconciliationService.unmatchTransaction(bankTxnId);
      await loadData();
    } catch (err) {
      console.error('Unmatch error:', err);
      alert(err.message || 'Failed to unmatch transaction');
    }
  };

  const handleFinalize = async () => {
    if (!window.confirm('Are you sure you want to finalize this reconciliation period? Once finalized, it becomes immutable.')) {
      return;
    }
    try {
      setFinalizing(true);
      await bankReconciliationService.finalizeReconciliation(id);
      await loadData();
      alert('Reconciliation successfully finalized!');
    } catch (err) {
      console.error('Finalization error:', err);
      alert(err.message || 'Failed to finalize reconciliation');
    } finally {
      setFinalizing(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading reconciliation workspace...</div>;
  }

  if (!statement) {
    return <div className="p-8 text-center text-red-500">Reconciliation record not found</div>;
  }

  const { reconciliation, summary } = statement;
  const isFinalized = reconciliation.status === 'finalized';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => navigate('/admin/bank-reconciliation')}
            className="text-xs text-blue-600 hover:underline mb-1 inline-block"
          >
            ← Back to Reconciliations
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Bank Reconciliation Statement (BRS)
          </h1>
          <p className="text-sm text-gray-500">
            {reconciliation.bank_account?.bank_name} — {reconciliation.bank_account?.account_number} | As of {formatDate(reconciliation.statement_date)}
          </p>
        </div>
        <div className="flex gap-3">
          {!isFinalized && (
            <button
              onClick={handleFinalize}
              disabled={finalizing}
              className="px-4 py-2 bg-emerald-600 text-white rounded text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {finalizing ? 'Finalizing...' : 'Finalize Reconciliation Period'}
            </button>
          )}
          {isFinalized && (
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-xs flex items-center">
              ✓ RECONCILIATION FINALIZED & LOCKED
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* BRS Summary Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-gray-900">Bank Reconciliation Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded border border-gray-100">
            <span className="text-xs text-gray-500">Balance Per Bank Statement</span>
            <div className="text-lg font-bold text-gray-900 mt-1">
              {formatCurrency(summary.closing_balance_per_bank)}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded border border-gray-100">
            <span className="text-xs text-gray-500">Balance Per Books (GL)</span>
            <div className="text-lg font-bold text-gray-900 mt-1">
              {formatCurrency(summary.closing_balance_per_books)}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded border border-gray-100">
            <span className="text-xs text-gray-500">Uncredited Receipts / Payments</span>
            <div className="text-lg font-semibold text-gray-700 mt-1">
              {formatCurrency(summary.total_uncredited_receipts - summary.total_unpresented_payments)}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded border border-gray-100">
            <span className="text-xs text-gray-500">Net Discrepancy</span>
            <div className={`text-lg font-bold mt-1 ${
              Number(summary.difference) === 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {formatCurrency(summary.difference)}
            </div>
          </div>
        </div>
      </div>

      {/* Matching Controls */}
      {!isFinalized && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs text-blue-900">
            <span className="font-bold">Match Selected: </span>
            {selectedBankTxnId ? '1 Bank line selected' : 'No Bank line selected'} | {' '}
            {selectedBookTxn ? `1 Book line selected (${selectedBookTxn.type})` : 'No Book line selected'}
          </div>
          <button
            onClick={handleMatch}
            disabled={!selectedBankTxnId || !selectedBookTxn}
            className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            Confirm Match
          </button>
        </div>
      )}

      {/* Two-Column Comparison Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Bank Statement Transactions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900">
              Bank Statement Transactions ({bankTxns.length})
            </h3>
          </div>
          <div className="overflow-x-auto flex-1 max-h-[500px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {!isFinalized && <th className="px-2 py-2"></th>}
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Date</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Narration</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500">Amount (₹)</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-500">Status</th>
                  {!isFinalized && <th className="px-2 py-2"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bankTxns.map((t) => {
                  const isSelected = selectedBankTxnId === t.id;
                  const isMatched = t.status === 'matched' || t.status === 'reconciled';
                  return (
                    <tr
                      key={t.id}
                      className={`${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'} ${isMatched ? 'opacity-60' : ''}`}
                    >
                      {!isFinalized && (
                        <td className="px-2 py-2 text-center">
                          {!isMatched && (
                            <input
                              type="radio"
                              name="bankTxn"
                              checked={isSelected}
                              onChange={() => setSelectedBankTxnId(t.id)}
                            />
                          )}
                        </td>
                      )}
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">{formatDate(t.transaction_date)}</td>
                      <td className="px-3 py-2 text-gray-900 font-medium">
                        <div>{t.description}</div>
                        {t.reference && <div className="text-[10px] text-gray-400 font-mono">Ref: {t.reference}</div>}
                      </td>
                      <td className={`px-3 py-2 text-right font-mono font-medium ${
                        t.transaction_type === 'credit' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {t.transaction_type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          isMatched ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {t.status.toUpperCase()}
                        </span>
                      </td>
                      {!isFinalized && (
                        <td className="px-2 py-2 text-right">
                          {isMatched && (
                            <button
                              onClick={() => handleUnmatch(t.id)}
                              className="text-red-500 hover:underline text-[10px]"
                            >
                              Unmatch
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Book Ledger Transactions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900">
              Unreconciled Book Ledger Transactions ({bookTxns.length})
            </h3>
          </div>
          <div className="overflow-x-auto flex-1 max-h-[500px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {!isFinalized && <th className="px-2 py-2"></th>}
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Date</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Type / Details</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookTxns.map((b) => {
                  const isSelected = selectedBookTxn?.id === b.id && selectedBookTxn?.type === b.type;
                  return (
                    <tr
                      key={`${b.type}_${b.id}`}
                      className={isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                    >
                      {!isFinalized && (
                        <td className="px-2 py-2 text-center">
                          <input
                            type="radio"
                            name="bookTxn"
                            checked={isSelected}
                            onChange={() => setSelectedBookTxn({ id: b.id, type: b.type })}
                          />
                        </td>
                      )}
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">{formatDate(b.date)}</td>
                      <td className="px-3 py-2 text-gray-900 font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1 py-0.5 rounded text-[9px] font-bold uppercase ${
                            b.type === 'customer_payment' ? 'bg-green-100 text-green-800' :
                            b.type === 'vendor_payment' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {b.type.replace('_', ' ')}
                          </span>
                          <span className="font-mono text-gray-700">{b.number}</span>
                        </div>
                        <div className="text-[11px] text-gray-600 mt-0.5">{b.party}</div>
                        {b.reference && <div className="text-[10px] text-gray-400 font-mono">Ref: {b.reference}</div>}
                      </td>
                      <td className={`px-3 py-2 text-right font-mono font-medium ${
                        b.direction === 'inflow' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {b.direction === 'inflow' ? '+' : '-'}{formatCurrency(b.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
