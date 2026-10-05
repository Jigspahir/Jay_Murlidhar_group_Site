import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, CheckCircle, Clock, FileText } from 'lucide-react';
import { getCreditNoteById, recordCreditNote } from '../../../features/commercialAdjustments/services/creditNoteService';
import { useAuth } from '../../../hooks/useAuth';

export default function CreditNoteDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [creditNote, setCreditNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCreditNoteById(id);
        setCreditNote(data);
      } catch (err) {
        console.error('Failed to load credit note:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleRecord = async () => {
    setRecording(true);
    try {
      const updated = await recordCreditNote(id, user?.id);
      setCreditNote(updated);
    } catch (err) {
      alert(`Error recording credit note: ${err.message}`);
    } finally {
      setRecording(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading credit note voucher...</div>;
  }

  if (!creditNote) {
    return <div className="p-8 text-center text-rose-500">Credit note not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/credit-notes"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Credit Note Voucher
            </h1>
            <span className="font-mono text-xs text-slate-500">{creditNote.credit_note_number}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
          >
            <Printer className="w-4 h-4" />
            Print Note
          </button>
          {creditNote.status === 'draft' && (
            <button
              onClick={handleRecord}
              disabled={recording}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              {recording ? 'Recording...' : 'Record & Post to GL'}
            </button>
          )}
        </div>
      </div>

      {/* Printable Voucher Shell */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6 print:border-none print:shadow-none">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-indigo-600 uppercase font-bold">
              CREDIT NOTE VOUCHER
            </span>
            <h2 className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {creditNote.credit_note_number}
            </h2>
            <div className="text-xs text-slate-500 mt-1">
              Issue Date: <span className="font-mono font-medium text-slate-700">{creditNote.credit_note_date}</span>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                creditNote.status === 'recorded'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {creditNote.status === 'recorded' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {creditNote.status}
            </span>
          </div>
        </div>

        {/* References */}
        <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 border border-slate-100 rounded-lg text-xs">
          <div>
            <span className="text-slate-400 font-semibold uppercase">Customer Details</span>
            <div className="font-bold text-slate-900 text-sm mt-1">{creditNote.customer?.display_name}</div>
            <div className="text-slate-600 mt-0.5">GSTIN: {creditNote.customer?.gstin || 'Unregistered'}</div>
          </div>
          <div>
            <span className="text-slate-400 font-semibold uppercase">Original Invoice</span>
            <div className="font-bold text-slate-900 text-sm mt-1 font-mono">
              {creditNote.invoice?.invoice_number || 'INV-000'}
            </div>
            <div className="text-slate-600 mt-0.5">Reason: {creditNote.reason?.replace(/_/g, ' ')}</div>
          </div>
        </div>

        {/* Items */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-2.5">Item Description</th>
                <th className="px-4 py-2.5">HSN/SAC</th>
                <th className="px-4 py-2.5 text-right">Return Qty</th>
                <th className="px-4 py-2.5 text-right">Rate (₹)</th>
                <th className="px-4 py-2.5 text-right">GST %</th>
                <th className="px-4 py-2.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(creditNote.items || []).map((it) => (
                <tr key={it.id}>
                  <td className="px-4 py-2.5 font-medium text-slate-900">{it.item_name}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">{it.hsn_sac_code || '—'}</td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold">{it.quantity}</td>
                  <td className="px-4 py-2.5 text-right font-mono">₹{it.unit_price}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{it.tax_rate}%</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                    ₹{Number(it.line_total).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <div className="w-72 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Taxable Amount:</span>
              <span className="font-mono">₹{Number(creditNote.taxable_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Output CGST Reversal:</span>
              <span className="font-mono">₹{Number(creditNote.cgst_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Output SGST Reversal:</span>
              <span className="font-mono">₹{Number(creditNote.sgst_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Output IGST Reversal:</span>
              <span className="font-mono">₹{Number(creditNote.igst_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
              <span>Total Credit Amount:</span>
              <span className="font-mono text-indigo-700">₹{Number(creditNote.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {creditNote.notes && (
          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
            <span className="font-semibold text-slate-700">Notes:</span> {creditNote.notes}
          </div>
        )}
      </div>
    </div>
  );
}
