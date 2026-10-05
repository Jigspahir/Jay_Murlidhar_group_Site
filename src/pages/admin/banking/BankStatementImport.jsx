import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../../contexts/CompanyContext';
import { bankReconciliationService } from '../../../features/banking/services/bankReconciliationService';
import { supabase } from '../../../lib/supabase';

export default function BankStatementImport() {
  const navigate = useNavigate();
  const { currentCompany } = useCompany();

  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [file, setFile] = useState(null);
  const [csvPreviewRows, setCsvPreviewRows] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [columnMap, setColumnMap] = useState({
    date: 'Date',
    description: 'Description',
    reference: 'Reference',
    debit: 'Debit',
    credit: 'Credit',
    balance: 'Balance'
  });

  const [openingBalance, setOpeningBalance] = useState('');
  const [closingBalance, setClosingBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [importResult, setImportResult] = useState(null);

  useEffect(() => {
    async function loadAccounts() {
      if (!currentCompany?.id) return;
      try {
        const { data, error: accErr } = await supabase
          .from('company_bank_accounts')
          .select('id, bank_name, account_number')
          .eq('company_id', currentCompany.id)
          .eq('status', 'active');
        if (accErr) throw accErr;
        setBankAccounts(data || []);
        if (data?.length > 0) setSelectedAccountId(data[0].id);
      } catch (err) {
        console.error('Failed to load accounts:', err);
      }
    }
    loadAccounts();
  }, [currentCompany?.id]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setError(null);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) {
        setError('CSV file must have a header row and at least one data row');
        return;
      }

      // Parse headers
      const headers = lines[0].split(',').map(h => h.replace(/["']/g, '').trim());
      setCsvHeaders(headers);

      // Guess column mapping
      const newMap = { ...columnMap };
      headers.forEach(h => {
        const lh = h.toLowerCase();
        if (lh.includes('date')) newMap.date = h;
        else if (lh.includes('narration') || lh.includes('desc') || lh.includes('particular')) newMap.description = h;
        else if (lh.includes('ref') || lh.includes('chq') || lh.includes('cheque') || lh.includes('utr')) newMap.reference = h;
        else if (lh.includes('debit') || lh.includes('dr') || lh.includes('withdrawal')) newMap.debit = h;
        else if (lh.includes('credit') || lh.includes('cr') || lh.includes('deposit')) newMap.credit = h;
        else if (lh.includes('bal')) newMap.balance = h;
      });
      setColumnMap(newMap);

      // Preview top 5 rows
      const preview = lines.slice(1, 6).map(line => {
        const cells = line.split(',').map(c => c.replace(/["']/g, '').trim());
        const rowObj = {};
        headers.forEach((h, idx) => {
          rowObj[h] = cells[idx] || '';
        });
        return rowObj;
      });
      setCsvPreviewRows(preview);
    };
    reader.readAsText(f);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a CSV bank statement file');
      return;
    }
    if (!selectedAccountId) {
      setError('Please select a bank account');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const csvText = await file.text();

      const result = await bankReconciliationService.importCsvStatement({
        company_id: currentCompany.id,
        bank_account_id: selectedAccountId,
        file_name: file.name,
        csv_text: csvText,
        column_mapping: columnMap,
        opening_balance: Number(openingBalance || 0),
        closing_balance: Number(closingBalance || 0)
      });

      setImportResult(result);
    } catch (err) {
      console.error('Import error:', err);
      setError(err.message || 'Failed to import bank statement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate('/admin/bank-reconciliation')}
            className="text-xs text-blue-600 hover:underline mb-1 inline-block"
          >
            ← Back to Reconciliations
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Import Bank Statement (CSV)</h1>
          <p className="text-sm text-gray-500">
            Upload and stage physical bank statement lines for matching. Duplicate entries are automatically detected and skipped.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {importResult && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-sm border border-emerald-200 space-y-2">
          <p className="font-bold">✓ Bank Statement Staged Successfully!</p>
          <p className="text-xs">
            Imported Rows: <strong>{importResult.imported_count}</strong> |
            Duplicate Rows Skipped: <strong>{importResult.duplicate_count}</strong> |
            Date Span: <strong>{importResult.statement?.statement_from} to {importResult.statement?.statement_to}</strong>
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/admin/bank-reconciliation')}
              className="px-4 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700"
            >
              Go to Reconciliation Workspace →
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleImport} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Target Bank Account *</label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
            >
              {bankAccounts.map((b) => (
                <option key={b.id} value={b.id}>{b.bank_name} — {b.account_number}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Select Statement File (.csv) *</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Statement Opening Balance (₹)</label>
            <input
              type="number"
              step="0.01"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              placeholder="0.00"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Statement Closing Balance (₹)</label>
            <input
              type="number"
              step="0.01"
              value={closingBalance}
              onChange={(e) => setClosingBalance(e.target.value)}
              placeholder="0.00"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Column Mapping Section */}
        {csvHeaders.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Map CSV Columns to System Fields</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {['date', 'description', 'reference', 'debit', 'credit', 'balance'].map((field) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    {field} {field === 'date' && '*'}
                  </label>
                  <select
                    value={columnMap[field] || ''}
                    onChange={(e) => setColumnMap({ ...columnMap, [field]: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                  >
                    <option value="">— Select Column —</option>
                    {csvHeaders.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CSV Preview */}
        {csvPreviewRows.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">First 5 Rows Preview</h3>
            <div className="overflow-x-auto border border-gray-200 rounded">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {csvHeaders.map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {csvPreviewRows.map((row, idx) => (
                    <tr key={idx}>
                      {csvHeaders.map((h) => (
                        <td key={h} className="px-3 py-1.5 whitespace-nowrap text-gray-700">{row[h]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin/bank-reconciliation')}
            className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !file}
            className="px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Importing & Validating...' : 'Import & Stage Transactions'}
          </button>
        </div>
      </form>
    </div>
  );
}
