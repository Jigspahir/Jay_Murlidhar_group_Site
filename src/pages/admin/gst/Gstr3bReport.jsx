import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCompany } from '../../../contexts/CompanyContext';
import { gstService } from '../../../features/gst/services/gstService';
import { formatCurrency } from '../../../utils/formatters';

export default function Gstr3bReport() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentCompany } = useCompany();

  const initialPeriod = searchParams.get('period') || new Date().toISOString().slice(0, 7);
  const [period, setPeriod] = useState(initialPeriod);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      if (!currentCompany?.id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await gstService.generateGSTR3B(currentCompany.id, period);
        setData(res);
      } catch (err) {
        console.error('Failed to generate GSTR-3B:', err);
        setError(err.message || 'Failed to generate GSTR-3B summary');
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [currentCompany?.id, period]);

  const handleExportJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GSTR3B_Summary_${period}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => navigate('/admin/gst')}
            className="text-xs text-blue-600 hover:underline mb-1 inline-block"
          >
            ← Back to GST Workspace
          </button>
          <h1 className="text-2xl font-bold text-gray-900">GSTR-3B Return Summary</h1>
          <p className="text-sm text-gray-500">Summary return of outward supplies and input tax credit for tax period {period}</p>
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
            onClick={handleExportJSON}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
          >
            Export JSON
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-500">Compiling GSTR-3B figures...</div>
      ) : !data ? null : (
        <div className="space-y-6">
          {/* Section 3.1: Outward Supplies */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-base font-bold text-gray-900">
                3.1 Details of Outward Supplies and inward supplies liable to reverse charge
              </h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Nature of Supplies</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Total Taxable Value (₹)</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Integrated Tax (₹)</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Central Tax (₹)</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">State/UT Tax (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    (a) Outward taxable supplies (other than zero rated, nil rated and exempted)
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    {formatCurrency(data.outwardSupplies?.taxableValue || 0)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700">
                    {formatCurrency(data.outwardSupplies?.igst || 0)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700">
                    {formatCurrency(data.outwardSupplies?.cgst || 0)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700">
                    {formatCurrency(data.outwardSupplies?.sgst || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: Eligible ITC */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-base font-bold text-gray-900">
                4. Eligible Input Tax Credit (ITC)
              </h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Details</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Integrated Tax (₹)</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Central Tax (₹)</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">State/UT Tax (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    (A) (5) All other ITC (Inputs & Input Services)
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700">
                    {formatCurrency(data.eligibleITC?.igst || 0)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700">
                    {formatCurrency(data.eligibleITC?.cgst || 0)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700">
                    {formatCurrency(data.eligibleITC?.sgst || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 5.1: Net Tax Computation */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900">5.1 Net Tax Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-xs font-semibold text-red-700 uppercase">Total Outward Tax</span>
                <div className="text-2xl font-bold text-red-900 mt-1">
                  {formatCurrency(data.totals?.totalOutputTax || 0)}
                </div>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-xs font-semibold text-emerald-700 uppercase">Total ITC Available</span>
                <div className="text-2xl font-bold text-emerald-900 mt-1">
                  {formatCurrency(data.totals?.totalITC || 0)}
                </div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-xs font-semibold text-blue-700 uppercase">Net Estimated Tax Liability</span>
                <div className="text-2xl font-bold text-blue-900 mt-1">
                  {formatCurrency(data.totals?.netPayable || 0)}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic mt-2">
              * Note: Statutory filing values must be verified against government portal ledger balance before final challan payment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
