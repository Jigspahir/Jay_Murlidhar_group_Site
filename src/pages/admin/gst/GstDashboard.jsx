import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../../contexts/CompanyContext';
import { gstService } from '../../../features/gst/services/gstService';
import { formatCurrency } from '../../../utils/formatters';

export default function GstDashboard() {
  const navigate = useNavigate();
  const { currentCompany } = useCompany();

  // default to current month YYYY-MM
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [returnPeriod, setReturnPeriod] = useState(currentMonthStr);
  const [gstr1Data, setGstr1Data] = useState(null);
  const [gstr3bData, setGstr3bData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!currentCompany?.id) return;
      try {
        setLoading(true);
        setError(null);
        const [r1, r3b] = await Promise.all([
          gstService.generateGSTR1(currentCompany.id, returnPeriod),
          gstService.generateGSTR3B(currentCompany.id, returnPeriod)
        ]);
        setGstr1Data(r1);
        setGstr3bData(r3b);
      } catch (err) {
        console.error('Failed to load GST data:', err);
        setError(err.message || 'Failed to load GST summary');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentCompany?.id, returnPeriod]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GST Compliance Workspace</h1>
          <p className="text-sm text-gray-500">Statutory return preparation worksheets, summaries, and offline export</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-600">Return Period:</label>
          <input
            type="month"
            value={returnPeriod}
            onChange={(e) => setReturnPeriod(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-500">Calculating GST Return figures...</div>
      ) : (
        <div className="space-y-6">
          {/* Quick Action Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">GSTR-1 Worksheet</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Outward supplies statement detailing B2B, B2C, credit notes, and tax breakup.
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Taxable Outward:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(gstr1Data?.summary?.totalTaxableAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Output Tax:</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(gstr1Data?.summary?.totalTaxAmount || 0)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate(`/admin/gst/gstr-1?period=${returnPeriod}`)}
                  className="w-full py-2 bg-blue-50 text-blue-700 rounded text-sm font-medium hover:bg-blue-100 transition"
                >
                  View GSTR-1 Worksheet →
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">GSTR-3B Summary</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Monthly self-declaration summary of outward supplies, eligible ITC, and net liability.
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Output Tax:</span>
                    <span className="font-semibold text-red-600">{formatCurrency(gstr3bData?.totals?.totalOutputTax || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Eligible ITC:</span>
                    <span className="font-semibold text-emerald-600">{formatCurrency(gstr3bData?.totals?.totalITC || 0)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-1">
                    <span className="text-gray-700 font-medium">Net Tax Payable:</span>
                    <span className="font-bold text-gray-900">{formatCurrency(gstr3bData?.totals?.netPayable || 0)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate(`/admin/gst/gstr-3b?period=${returnPeriod}`)}
                  className="w-full py-2 bg-blue-50 text-blue-700 rounded text-sm font-medium hover:bg-blue-100 transition"
                >
                  View GSTR-3B Summary →
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">e-Invoice Offline Generator</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Generate NIC INV-1.03 compatible e-Invoice JSON payloads for B2B commercial invoices.
                </p>
                <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-800">
                  Strictly offline JSON export. No live IRP government APIs or credential storage.
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/admin/e-invoice')}
                  className="w-full py-2 bg-indigo-50 text-indigo-700 rounded text-sm font-medium hover:bg-indigo-100 transition"
                >
                  Open e-Invoice Generator →
                </button>
              </div>
            </div>
          </div>

          {/* Tax Breakdown Matrix */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900">Period Tax Reconciliation Matrix ({returnPeriod})</h3>
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Component</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">CGST (₹)</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">SGST (₹)</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">IGST (₹)</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-800">Gross Outward Tax Liability (3.1.a)</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(gstr3bData?.outwardSupplies?.cgst || 0)}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(gstr3bData?.outwardSupplies?.sgst || 0)}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(gstr3bData?.outwardSupplies?.igst || 0)}</td>
                  <td className="px-4 py-2 text-right font-semibold text-red-600">{formatCurrency(gstr3bData?.totals?.totalOutputTax || 0)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-800">Input Tax Credit Available (4.A.5)</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(gstr3bData?.eligibleITC?.cgst || 0)}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(gstr3bData?.eligibleITC?.sgst || 0)}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(gstr3bData?.eligibleITC?.igst || 0)}</td>
                  <td className="px-4 py-2 text-right font-semibold text-emerald-600">{formatCurrency(gstr3bData?.totals?.totalITC || 0)}</td>
                </tr>
                <tr className="bg-gray-50 font-bold">
                  <td className="px-4 py-2 text-gray-900">Net Estimated Tax Payable / (Credit)</td>
                  <td className="px-4 py-2 text-right">{formatCurrency((gstr3bData?.outwardSupplies?.cgst || 0) - (gstr3bData?.eligibleITC?.cgst || 0))}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency((gstr3bData?.outwardSupplies?.sgst || 0) - (gstr3bData?.eligibleITC?.sgst || 0))}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency((gstr3bData?.outwardSupplies?.igst || 0) - (gstr3bData?.eligibleITC?.igst || 0))}</td>
                  <td className="px-4 py-2 text-right text-blue-700">{formatCurrency(gstr3bData?.totals?.netPayable || 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
