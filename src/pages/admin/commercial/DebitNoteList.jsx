import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, FileText, CheckCircle, Clock } from 'lucide-react';
import { useCompany } from '../../../contexts/CompanyContext';
import { getDebitNotes } from '../../../features/commercialAdjustments/services/debitNoteService';

export default function DebitNoteList() {
  const { currentCompanyId } = useCompany();
  const [debitNotes, setDebitNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadData = useCallback(async () => {
    if (!currentCompanyId) return;
    setLoading(true);
    try {
      const data = await getDebitNotes({
        companyId: currentCompanyId,
        status: statusFilter || undefined
      });
      setDebitNotes(data || []);
    } catch (err) {
      console.error('Failed to load debit notes:', err);
    } finally {
      setLoading(false);
    }
  }, [currentCompanyId, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = debitNotes.filter((dn) => {
    const s = search.toLowerCase();
    return (
      dn.debit_note_number?.toLowerCase().includes(s) ||
      dn.vendor?.legal_name?.toLowerCase().includes(s) ||
      dn.bill?.bill_number?.toLowerCase().includes(s) ||
      dn.reason?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Purchase Debit Notes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Supplier purchase returns, damage allowances, and AP liability adjustments linked to purchase bills.
          </p>
        </div>
        <Link
          to="/admin/debit-notes/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Issue Debit Note
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Debit Note #, Vendor, Bill #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="recorded">Recorded</option>
          <option value="applied">Applied</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-600 tracking-wider">
              <tr>
                <th className="px-4 py-3">Debit Note #</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Bill #</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3 text-right">Taxable</th>
                <th className="px-4 py-3 text-right">Tax</th>
                <th className="px-4 py-3 text-right">Total (₹)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-4 py-8 text-center text-slate-400">
                    Loading debit notes...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-4 py-8 text-center text-slate-400">
                    No debit notes found for this company.
                  </td>
                </tr>
              ) : (
                filtered.map((dn) => (
                  <tr key={dn.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-indigo-700">
                      <Link to={`/admin/debit-notes/${dn.id}`} className="hover:underline">
                        {dn.debit_note_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{dn.debit_note_date}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {dn.vendor?.legal_name || 'Vendor'}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                      {dn.bill?.bill_number || '—'}
                    </td>
                    <td className="px-4 py-3 capitalize text-xs">
                      {dn.reason?.replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      ₹{Number(dn.taxable_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-slate-500">
                      ₹{Number(dn.total_tax_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ₹{Number(dn.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide ${
                          dn.status === 'recorded'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : dn.status === 'draft'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {dn.status === 'recorded' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {dn.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/debit-notes/${dn.id}`}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        View Note
                      </Link>
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
