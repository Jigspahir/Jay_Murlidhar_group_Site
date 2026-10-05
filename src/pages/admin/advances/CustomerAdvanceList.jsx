import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, DollarSign, CheckCircle, Clock, Link as LinkIcon, X } from 'lucide-react';
import { useCompany } from '../../../contexts/CompanyContext';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { getCustomerAdvances, allocateCustomerAdvance } from '../../../features/advances/services/advanceService';

export default function CustomerAdvanceList() {
  const { currentCompanyId } = useCompany();
  const { user } = useAuth();
  const [advances, setAdvances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Allocation Modal State
  const [allocatingAdvance, setAllocatingAdvance] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [allocAmount, setAllocAmount] = useState('');
  const [allocLoading, setAllocLoading] = useState(false);
  const [allocError, setAllocError] = useState('');

  const loadData = useCallback(async () => {
    if (!currentCompanyId) return;
    setLoading(true);
    try {
      const data = await getCustomerAdvances({ companyId: currentCompanyId });
      setAdvances(data || []);
    } catch (err) {
      console.error('Failed to load customer advances:', err);
    } finally {
      setLoading(false);
    }
  }, [currentCompanyId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAllocationModal = async (adv) => {
    setAllocatingAdvance(adv);
    setAllocAmount(adv.remaining_balance);
    setAllocError('');
    setSelectedInvoiceId('');

    // Fetch unpaid invoices for this customer
    const { data: invs } = await supabase
      .from('invoices')
      .select('id, invoice_number, invoice_date, total_amount, balance_due')
      .eq('company_id', currentCompanyId)
      .eq('customer_id', adv.customer_id)
      .gt('balance_due', 0)
      .neq('status', 'draft')
      .neq('status', 'cancelled');

    setInvoices(invs || []);
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!selectedInvoiceId || !allocAmount) {
      setAllocError('Please select an invoice and enter amount');
      return;
    }

    setAllocLoading(true);
    setAllocError('');
    try {
      await allocateCustomerAdvance({
        companyId: currentCompanyId,
        advanceId: allocatingAdvance.id,
        invoiceId: selectedInvoiceId,
        allocatedAmount: Number(allocAmount),
        userId: user?.id
      });
      setAllocatingAdvance(null);
      loadData();
    } catch (err) {
      setAllocError(err.message || 'Failed to allocate advance');
    } finally {
      setAllocLoading(false);
    }
  };

  const filtered = advances.filter((adv) => {
    const s = search.toLowerCase();
    return (
      adv.advance_number?.toLowerCase().includes(s) ||
      adv.customer?.display_name?.toLowerCase().includes(s) ||
      adv.payment_mode?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-indigo-600" />
            Customer Advances (Unearned Liability)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Receipts from customers prior to invoicing (Liability 2300) with settlement allocations.
          </p>
        </div>
        <Link
          to="/admin/advances/customer/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Receive Advance
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search advance #, customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-600 tracking-wider">
              <tr>
                <th className="px-4 py-3">Advance #</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Payment Mode</th>
                <th className="px-4 py-3 text-right">Received (₹)</th>
                <th className="px-4 py-3 text-right">Allocated (₹)</th>
                <th className="px-4 py-3 text-right">Remaining (₹)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-slate-400">
                    Loading advances...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-slate-400">
                    No customer advances recorded.
                  </td>
                </tr>
              ) : (
                filtered.map((adv) => (
                  <tr key={adv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-indigo-700">{adv.advance_number}</td>
                    <td className="px-4 py-3 font-mono text-xs">{adv.receipt_date}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{adv.customer?.display_name}</td>
                    <td className="px-4 py-3 uppercase text-xs font-medium text-slate-600">{adv.payment_mode}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ₹{Number(adv.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-700">
                      ₹{Number(adv.allocated_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-indigo-700">
                      ₹{Number(adv.remaining_balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium uppercase ${
                          adv.status === 'fully_allocated'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {adv.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {Number(adv.remaining_balance) > 0 && (
                        <button
                          onClick={() => openAllocationModal(adv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded transition-colors"
                        >
                          <LinkIcon className="w-3 h-3" />
                          Allocate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocation Modal */}
      {allocatingAdvance && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Allocate Advance #{allocatingAdvance.advance_number}
              </h3>
              <button
                onClick={() => setAllocatingAdvance(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {allocError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded border border-rose-200">
                {allocError}
              </div>
            )}

            <form onSubmit={handleAllocate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer: <span className="font-normal text-slate-900">{allocatingAdvance.customer?.display_name}</span>
                </label>
                <div className="text-xs text-slate-500">
                  Remaining Advance: <span className="font-bold font-mono text-indigo-600">₹{allocatingAdvance.remaining_balance}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Open Invoice *</label>
                {invoices.length === 0 ? (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    No open unpaid invoices found for this customer.
                  </p>
                ) : (
                  <select
                    value={selectedInvoiceId}
                    onChange={(e) => setSelectedInvoiceId(e.target.value)}
                    required
                    className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="">-- Choose Invoice --</option>
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoice_number} (Due: ₹{inv.balance_due})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Allocation Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  max={allocatingAdvance.remaining_balance}
                  value={allocAmount}
                  onChange={(e) => setAllocAmount(e.target.value)}
                  required
                  className="w-full text-sm border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAllocatingAdvance(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={allocLoading || invoices.length === 0}
                  className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
                >
                  {allocLoading ? 'Allocating...' : 'Apply Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
