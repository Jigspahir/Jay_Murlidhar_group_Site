import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useCompany } from '../../../contexts/CompanyContext';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { createCreditNote, recordCreditNote } from '../../../features/commercialAdjustments/services/creditNoteService';

export default function CreditNoteCreate() {
  const { currentCompanyId } = useCompany();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [creditNoteDate, setCreditNoteDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('sales_return');
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load invoices for company
  useEffect(() => {
    if (!currentCompanyId) return;
    async function loadInvoices() {
      const { data } = await supabase
        .from('invoices')
        .select('id, invoice_number, customer_id, customer_name, total_amount, invoice_date')
        .eq('company_id', currentCompanyId)
        .neq('status', 'draft')
        .neq('status', 'cancelled')
        .order('invoice_date', { ascending: false });
      setInvoices(data || []);
    }
    loadInvoices();
  }, [currentCompanyId]);

  // When invoice selected, load invoice details & line items
  useEffect(() => {
    if (!selectedInvoiceId) {
      setSelectedInvoice(null);
      setItems([]);
      return;
    }
    async function fetchInvDetails() {
      const { data } = await supabase
        .from('invoices')
        .select(`
          *,
          items:invoice_items(*)
        `)
        .eq('id', selectedInvoiceId)
        .single();

      if (data) {
        setSelectedInvoice(data);
        // Pre-populate items
        const initialItems = (data.items || []).map((it) => ({
          invoice_item_id: it.id,
          product_id: it.product_id || null,
          service_id: it.service_id || null,
          item_name: it.item_name,
          hsn_sac_code: it.hsn_sac_code || '',
          original_qty: Number(it.quantity) || 1,
          quantity: 1, // Default 1 for return
          unit_price: Number(it.unit_price) || 0,
          tax_rate: Number(it.tax_rate) || 0,
          return_selected: true,
          serial_numbers: []
        }));
        setItems(initialItems);
      }
    }
    fetchInvDetails();
  }, [selectedInvoiceId]);

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const calculateTotals = () => {
    let taxable = 0;
    let tax = 0;
    items.forEach((it) => {
      if (it.return_selected) {
        const lineTaxable = Number(it.quantity) * Number(it.unit_price);
        const lineTax = lineTaxable * (Number(it.tax_rate) / 100);
        taxable += lineTaxable;
        tax += lineTax;
      }
    });
    return {
      taxable: Math.round(taxable * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round((taxable + tax) * 100) / 100
    };
  };

  const totals = calculateTotals();

  const handleSubmit = async (recordImmediately = false) => {
    setError('');
    if (!selectedInvoiceId || !selectedInvoice) {
      setError('Please select an invoice.');
      return;
    }

    const selectedItems = items.filter((it) => it.return_selected && Number(it.quantity) > 0);
    if (selectedItems.length === 0) {
      setError('Please select at least one item to return or adjust.');
      return;
    }

    setLoading(true);
    try {
      const cn = await createCreditNote({
        companyId: currentCompanyId,
        invoiceId: selectedInvoiceId,
        customerId: selectedInvoice.customer_id,
        creditNoteDate,
        reason,
        items: selectedItems,
        notes,
        userId: user?.id
      });

      if (recordImmediately) {
        await recordCreditNote(cn.id, user?.id);
      }

      navigate(`/admin/credit-notes/${cn.id}`);
    } catch (err) {
      console.error('Failed to create credit note:', err);
      setError(err.message || 'Failed to create credit note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/credit-notes"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Issue Sales Credit Note</h1>
            <p className="text-xs text-slate-500">Record partial returns, post-sale adjustments, or service credits.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Invoice *
            </label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Choose Invoice --</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoice_number} — {inv.customer_name} (₹{Number(inv.total_amount).toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Credit Note Date *
            </label>
            <input
              type="date"
              value={creditNoteDate}
              onChange={(e) => setCreditNoteDate(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="sales_return">Sales Return (Product Back to Stock)</option>
              <option value="damaged_goods">Damaged Goods Replaced / Credited</option>
              <option value="deficiency_in_service">Deficiency in Service</option>
              <option value="post_sale_discount">Post-sale Volume Discount</option>
              <option value="correction">Billing Correction</option>
              <option value="cancellation">Invoice Cancellation</option>
            </select>
          </div>
        </div>

        {/* Items Table */}
        {items.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Return Items & Adjustments</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                  <tr>
                    <th className="px-3 py-2 text-center">Include</th>
                    <th className="px-3 py-2">Item Description</th>
                    <th className="px-3 py-2">HSN/SAC</th>
                    <th className="px-3 py-2 text-right">Invoiced Qty</th>
                    <th className="px-3 py-2 text-right">Return Qty</th>
                    <th className="px-3 py-2 text-right">Unit Price (₹)</th>
                    <th className="px-3 py-2 text-right">GST Rate</th>
                    <th className="px-3 py-2 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((it, idx) => (
                    <tr key={idx} className={it.return_selected ? 'bg-indigo-50/30' : 'bg-slate-50/50'}>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={it.return_selected}
                          onChange={(e) => handleItemChange(idx, 'return_selected', e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-3 py-2 font-medium text-slate-900">{it.item_name}</td>
                      <td className="px-3 py-2 font-mono text-slate-500">{it.hsn_sac_code || '—'}</td>
                      <td className="px-3 py-2 text-right font-mono">{it.original_qty}</td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          min="0.01"
                          max={it.original_qty}
                          step="1"
                          value={it.quantity}
                          disabled={!it.return_selected}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-20 text-right font-mono p-1 border border-slate-300 rounded bg-white"
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-mono">₹{it.unit_price}</td>
                      <td className="px-3 py-2 text-right font-mono">{it.tax_rate}%</td>
                      <td className="px-3 py-2 text-right font-mono font-semibold">
                        ₹{it.return_selected ? (Number(it.quantity) * Number(it.unit_price) * (1 + Number(it.tax_rate) / 100)).toFixed(2) : '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-slate-200 gap-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Remarks / Return Notes
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Return of 1 unit defective smartphone with serial #..."
              className="w-full text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full sm:w-80 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Return Taxable:</span>
              <span className="font-mono">₹{totals.taxable.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST Reversal:</span>
              <span className="font-mono">₹{totals.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-2">
              <span>Total Credit Note:</span>
              <span className="font-mono text-indigo-700">₹{totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit(false)}
            className="px-4 py-2 text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit(true)}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Posting...' : 'Record & Post to GL'}
          </button>
        </div>
      </div>
    </div>
  );
}
