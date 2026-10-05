import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCompany } from '../../../contexts/CompanyContext';
import { gstService } from '../../../features/gst/services/gstService';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function Gstr1Report() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentCompany } = useCompany();

  const initialPeriod = searchParams.get('period') || new Date().toISOString().slice(0, 7);
  const [period, setPeriod] = useState(initialPeriod);
  const [activeTab, setActiveTab] = useState('b2b'); // b2b | b2c | cdnr
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      if (!currentCompany?.id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await gstService.generateGSTR1(currentCompany.id, period);
        setData(res);
      } catch (err) {
        console.error('Failed to generate GSTR-1:', err);
        setError(err.message || 'Failed to generate GSTR-1 worksheet');
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [currentCompany?.id, period]);

  const handleExportCSV = () => {
    if (!data) return;
    let rows = [];
    if (activeTab === 'b2b') {
      rows = (data.sections.b2b || []).map(r => ({
        GSTIN: r.customer_gstin,
        Customer: r.customer_name,
        InvoiceNo: r.invoice_number,
        InvoiceDate: r.invoice_date,
        TaxableValue: r.taxable_amount,
        CGST: r.cgst_amount,
        SGST: r.sgst_amount,
        IGST: r.igst_amount,
        Total: r.total_amount,
        PlaceOfSupply: r.place_of_supply
      }));
    } else if (activeTab === 'b2c') {
      rows = (data.sections.b2cs || []).map(r => ({
        Customer: r.customer_name,
        InvoiceNo: r.invoice_number,
        InvoiceDate: r.invoice_date,
        TaxableValue: r.taxable_amount,
        CGST: r.cgst_amount,
        SGST: r.sgst_amount,
        IGST: r.igst_amount,
        Total: r.total_amount,
        PlaceOfSupply: r.place_of_supply
      }));
    } else {
      rows = (data.sections.cdnr || []).map(r => ({
        GSTIN: r.customer_gstin,
        Customer: r.customer_name,
        NoteNumber: r.note_number,
        NoteDate: r.note_date,
        OriginalInvoice: r.original_invoice_number,
        TaxableValue: r.taxable_amount,
        CGST: r.cgst_amount,
        SGST: r.sgst_amount,
        IGST: r.igst_amount,
        Total: r.total_amount
      }));
    }

    if (rows.length === 0) {
      alert('No data to export for this section');
      return;
    }

    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GSTR1_${activeTab.toUpperCase()}_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => navigate('/admin/gst')}
            className="text-xs text-blue-600 hover:underline mb-1 inline-block"
          >
            ← Back to GST Workspace
          </button>
          <h1 className="text-2xl font-bold text-gray-900">GSTR-1 Preparation Worksheet</h1>
          <p className="text-sm text-gray-500">Details of outward supplies of goods or services for tax period {period}</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              setSearchParams({ period: e.target.value });
            }}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          />
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
          >
            Export Active Tab (CSV)
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Summary KPI Cards */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-500 uppercase">Taxable Value</span>
            <div className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(data.summary?.totalTaxableAmount || 0)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-500 uppercase">CGST Total</span>
            <div className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(data.summary?.totalCGST || 0)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-500 uppercase">SGST Total</span>
            <div className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(data.summary?.totalSGST || 0)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-500 uppercase">IGST Total</span>
            <div className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(data.summary?.totalIGST || 0)}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-4">
        <button
          onClick={() => setActiveTab('b2b')}
          className={`py-2 px-4 text-sm font-medium border-b-2 ${
            activeTab === 'b2b'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          4A, 4B, 6B — B2B Invoices ({data?.sections?.b2b?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('b2c')}
          className={`py-2 px-4 text-sm font-medium border-b-2 ${
            activeTab === 'b2c'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          7 — B2C Invoices ({data?.sections?.b2cs?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('cdnr')}
          className={`py-2 px-4 text-sm font-medium border-b-2 ${
            activeTab === 'cdnr'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          9B — Credit / Debit Notes ({data?.sections?.cdnr?.length || 0})
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Compiling GSTR-1 records...</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {activeTab === 'b2b' && (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Customer GSTIN</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Receiver Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Invoice #</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Taxable Value</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">CGST</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">SGST</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">IGST</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Invoice Total</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">POS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(!data?.sections?.b2b || data.sections.b2b.length === 0) ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-gray-500">No B2B invoices in this period.</td>
                  </tr>
                ) : (
                  data.sections.b2b.map((inv) => (
                    <tr key={inv.invoice_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-semibold text-gray-900">{inv.customer_gstin}</td>
                      <td className="px-4 py-3 text-gray-900">{inv.customer_name}</td>
                      <td className="px-4 py-3 font-mono text-blue-600">{inv.invoice_number}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(inv.invoice_date)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(inv.taxable_amount)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(inv.cgst_amount)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(inv.sgst_amount)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(inv.igst_amount)}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(inv.total_amount)}</td>
                      <td className="px-4 py-3 text-center">{inv.place_of_supply}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'b2c' && (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Customer Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Invoice #</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Taxable Value</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">CGST</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">SGST</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">IGST</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Total</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">POS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(!data?.sections?.b2cs || data.sections.b2cs.length === 0) ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">No B2C invoices in this period.</td>
                  </tr>
                ) : (
                  data.sections.b2cs.map((inv) => (
                    <tr key={inv.invoice_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{inv.customer_name}</td>
                      <td className="px-4 py-3 font-mono text-blue-600">{inv.invoice_number}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(inv.invoice_date)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(inv.taxable_amount)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(inv.cgst_amount)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(inv.sgst_amount)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(inv.igst_amount)}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(inv.total_amount)}</td>
                      <td className="px-4 py-3 text-center">{inv.place_of_supply}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'cdnr' && (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Customer GSTIN</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Customer Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Note #</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Note Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Original Invoice #</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Taxable Value</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">CGST</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">SGST</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">IGST</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Note Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(!data?.sections?.cdnr || data.sections.cdnr.length === 0) ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-gray-500">No Credit/Debit Notes in this period.</td>
                  </tr>
                ) : (
                  data.sections.cdnr.map((cn) => (
                    <tr key={cn.note_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-semibold text-gray-900">{cn.customer_gstin}</td>
                      <td className="px-4 py-3 text-gray-900">{cn.customer_name}</td>
                      <td className="px-4 py-3 font-mono text-purple-600">{cn.note_number}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(cn.note_date)}</td>
                      <td className="px-4 py-3 font-mono text-gray-600">{cn.original_invoice_number}</td>
                      <td className="px-4 py-3 text-right text-red-600">-{formatCurrency(cn.taxable_amount)}</td>
                      <td className="px-4 py-3 text-right text-red-600">-{formatCurrency(cn.cgst_amount)}</td>
                      <td className="px-4 py-3 text-right text-red-600">-{formatCurrency(cn.sgst_amount)}</td>
                      <td className="px-4 py-3 text-right text-red-600">-{formatCurrency(cn.igst_amount)}</td>
                      <td className="px-4 py-3 text-right font-bold text-red-600">-{formatCurrency(cn.total_amount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
