import React, { useState, useEffect } from 'react';
import { useCompany } from '../../../contexts/CompanyContext';
import { einvoiceService } from '../../../features/gst/services/einvoiceService';
import { supabase } from '../../../lib/supabase';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function EinvoiceExport() {
  const { currentCompany } = useCompany();
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [payloadJson, setPayloadJson] = useState(null);

  useEffect(() => {
    async function loadInvoices() {
      if (!currentCompany?.id) return;
      try {
        setLoading(true);
        // Load recent finalized or sent invoices
        const { data, error: invErr } = await supabase
          .from('invoices')
          .select('id, invoice_number, invoice_date, total_amount, customer_id, customers(name, gstin)')
          .eq('company_id', currentCompany.id)
          .in('status', ['finalized', 'sent', 'paid'])
          .order('invoice_date', { ascending: false })
          .limit(50);

        if (invErr) throw invErr;
        setInvoices(data || []);
      } catch (err) {
        console.error('Failed to load invoices:', err);
        setError('Failed to load eligible invoices for e-Invoice generation');
      } finally {
        setLoading(false);
      }
    }
    loadInvoices();
  }, [currentCompany?.id]);

  const handleSelectInvoice = async (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setValidationResult(null);
    setPayloadJson(null);
    setError(null);

    if (!invoiceId) return;

    try {
      // Validate first
      const val = await einvoiceService.validateInvoiceForEinvoice(invoiceId);
      setValidationResult(val);

      if (val.isValid) {
        // Generate payload
        const payload = await einvoiceService.generateEinvoicePayload(invoiceId);
        setPayloadJson(payload);
      }
    } catch (err) {
      console.error('Validation error:', err);
      setError(err.message || 'Error inspecting invoice');
    }
  };

  const handleDownloadJson = () => {
    if (!payloadJson) return;
    const invNumber = payloadJson.DocDtls?.No || 'einvoice';
    const blob = new Blob([JSON.stringify(payloadJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `eInvoice_${invNumber}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Offline e-Invoice JSON Generator</h1>
        <p className="text-sm text-gray-500">
          Prepare NIC INV-1.03 standardized JSON payloads for B2B commercial invoices for offline bulk upload to IRP.
        </p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-1">
        <p className="font-semibold">Statutory Boundaries & Safety Rules:</p>
        <p>• Strictly offline preparation and export artifact generator.</p>
        <p>• No live IRP API calls, GSTN connections, or credential transmission occurs from this system.</p>
        <p>• Invoices missing mandatory seller/buyer GSTINs or line-item HSN codes are blocked with validation alerts.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-gray-500">Loading invoices...</div>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Select Invoice to Prepare</label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => handleSelectInvoice(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">— Choose a finalized invoice —</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoice_number} | {formatDate(inv.invoice_date)} | {inv.customers?.name || 'Customer'} ({inv.customers?.gstin || 'No GSTIN'}) | {formatCurrency(inv.total_amount)}
                </option>
              ))}
            </select>
          </div>

          {/* Validation Feedback */}
          {validationResult && (
            <div className={`p-4 rounded-lg border ${
              validationResult.isValid ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-bold text-sm ${validationResult.isValid ? 'text-emerald-800' : 'text-red-800'}`}>
                  {validationResult.isValid ? '✓ Invoice Passed e-Invoice Validation' : '⚠ Validation Blockers Found'}
                </span>
              </div>
              {validationResult.errors.length > 0 && (
                <ul className="list-disc pl-5 text-xs text-red-700 space-y-1">
                  {validationResult.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
              {validationResult.warnings.length > 0 && (
                <ul className="list-disc pl-5 text-xs text-amber-700 space-y-1 mt-2">
                  {validationResult.warnings.map((warn, i) => (
                    <li key={i}>{warn}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* JSON Preview and Export */}
          {payloadJson && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-900">NIC INV-1.03 Schema Payload Preview</h3>
                <button
                  onClick={handleDownloadJson}
                  className="px-4 py-2 bg-emerald-600 text-white rounded text-sm font-semibold hover:bg-emerald-700 transition"
                >
                  Download Payload JSON
                </button>
              </div>
              <pre className="p-4 bg-gray-900 text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto max-h-96">
                {JSON.stringify(payloadJson, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
