import React, { useState, useEffect } from 'react';
import { useCompany } from '../../../contexts/CompanyContext';
import { ageingReportService } from '../../../features/reports/services/ageingReportService';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function ArAgeingReport() {
  const { currentCompany } = useCompany();
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      if (!currentCompany?.id) return;
      try {
        setLoading(true);
        setError(null);
        const report = await ageingReportService.getARAgeingReport(currentCompany.id, asOfDate);
        setData(report);
      } catch (err) {
        console.error('Failed to load AR Ageing report:', err);
        setError(err.message || 'Failed to generate AR Ageing report');
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [currentCompany?.id, asOfDate]);

  const handleExportCSV = () => {
    if (!data?.customers || data.customers.length === 0) {
      alert('No data to export');
      return;
    }
    const headers = ['Customer', 'Current', '1-30 Days', '31-60 Days', '61-90 Days', '91-180 Days', '180+ Days', 'Total Outstanding'];
    const rows = data.customers.map(c => [
      `"${c.customer_name}"`,
      c.current.toFixed(2),
      c['1_30'].toFixed(2),
      c['31_60'].toFixed(2),
      c['61_90'].toFixed(2),
      c['91_180'].toFixed(2),
      c['180_plus'].toFixed(2),
      c.total_outstanding.toFixed(2)
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AR_Ageing_${asOfDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts Receivable (AR) Ageing Report</h1>
          <p className="text-sm text-gray-500">
            Customer balance analysis factoring invoices, credit notes, payments, and allocated advances
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-600">As Of Date:</label>
          <input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          />
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
          >
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Grand Totals Bucket Cards */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Current</span>
            <div className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(data.totals.current)}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">1-30 Days</span>
            <div className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(data.totals['1_30'])}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">31-60 Days</span>
            <div className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(data.totals['31_60'])}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">61-90 Days</span>
            <div className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(data.totals['61_90'])}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">91-180 Days</span>
            <div className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(data.totals['91_180'])}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">180+ Days</span>
            <div className="text-sm font-bold text-red-600 mt-1">{formatCurrency(data.totals['180_plus'])}</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <span className="text-[10px] text-blue-700 uppercase font-semibold">Total Outstanding</span>
            <div className="text-sm font-bold text-blue-900 mt-1">{formatCurrency(data.totals.total_outstanding)}</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-500">Calculating aged receivables...</div>
      ) : (!data || data.customers.length === 0) ? (
        <div className="py-12 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
          No outstanding customer receivables as of {formatDate(asOfDate)}.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
                <th className="px-3 py-3 text-right font-medium text-gray-500">Current (₹)</th>
                <th className="px-3 py-3 text-right font-medium text-gray-500">1-30 Days (₹)</th>
                <th className="px-3 py-3 text-right font-medium text-gray-500">31-60 Days (₹)</th>
                <th className="px-3 py-3 text-right font-medium text-gray-500">61-90 Days (₹)</th>
                <th className="px-3 py-3 text-right font-medium text-gray-500">91-180 Days (₹)</th>
                <th className="px-3 py-3 text-right font-medium text-gray-500">180+ Days (₹)</th>
                <th className="px-4 py-3 text-right font-medium text-gray-900">Total Due (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.customers.map((c) => (
                <tr key={c.customer_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.customer_name}</td>
                  <td className="px-3 py-3 text-right text-gray-700">{c.current > 0 ? formatCurrency(c.current) : '—'}</td>
                  <td className="px-3 py-3 text-right text-gray-700">{c['1_30'] > 0 ? formatCurrency(c['1_30']) : '—'}</td>
                  <td className="px-3 py-3 text-right text-gray-700">{c['31_60'] > 0 ? formatCurrency(c['31_60']) : '—'}</td>
                  <td className="px-3 py-3 text-right text-gray-700">{c['61_90'] > 0 ? formatCurrency(c['61_90']) : '—'}</td>
                  <td className="px-3 py-3 text-right text-gray-700">{c['91_180'] > 0 ? formatCurrency(c['91_180']) : '—'}</td>
                  <td className="px-3 py-3 text-right text-red-600 font-medium">{c['180_plus'] > 0 ? formatCurrency(c['180_plus']) : '—'}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(c.total_outstanding)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-bold border-t-2 border-gray-300">
              <tr>
                <td className="px-4 py-3 text-gray-900">Total</td>
                <td className="px-3 py-3 text-right">{formatCurrency(data.totals.current)}</td>
                <td className="px-3 py-3 text-right">{formatCurrency(data.totals['1_30'])}</td>
                <td className="px-3 py-3 text-right">{formatCurrency(data.totals['31_60'])}</td>
                <td className="px-3 py-3 text-right">{formatCurrency(data.totals['61_90'])}</td>
                <td className="px-3 py-3 text-right">{formatCurrency(data.totals['91_180'])}</td>
                <td className="px-3 py-3 text-right text-red-600">{formatCurrency(data.totals['180_plus'])}</td>
                <td className="px-4 py-3 text-right text-blue-700">{formatCurrency(data.totals.total_outstanding)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
