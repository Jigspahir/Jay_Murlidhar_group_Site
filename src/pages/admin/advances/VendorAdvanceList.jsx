import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../../contexts/CompanyContext';
import { advanceService } from '../../../features/advances/services/advanceService';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function VendorAdvanceList() {
  const navigate = useNavigate();
  const { currentCompany } = useCompany();
  const [advances, setAdvances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const loadAdvances = async () => {
    if (!currentCompany?.id) return;
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      const data = await advanceService.getVendorAdvances(currentCompany.id, filters);
      setAdvances(data || []);
    } catch (err) {
      console.error('Failed to load vendor advances:', err);
      setError(err.message || 'Failed to load vendor advances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdvances();
  }, [currentCompany?.id, statusFilter]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Advances</h1>
          <p className="text-sm text-gray-500">Record and track operational advances disbursed to suppliers</p>
        </div>
        <button
          onClick={() => navigate('/admin/advances/vendor/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
        >
          Disburse Advance
        </button>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-lg border border-gray-200">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="partially_allocated">Partially Allocated</option>
            <option value="fully_allocated">Fully Allocated</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading vendor advances...</div>
      ) : advances.length === 0 ? (
        <div className="py-12 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
          No vendor advances found.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Advance #</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Disbursement Date</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase">Allocated</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase">Remaining</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {advances.map((adv) => (
                <tr key={adv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-medium text-blue-600">
                    {adv.advance_number}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {adv.vendor?.name || '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(adv.payment_date)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    {formatCurrency(adv.amount)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    {formatCurrency(adv.amount_allocated)}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-emerald-600">
                    {formatCurrency(adv.balance_amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      adv.status === 'fully_allocated' ? 'bg-gray-100 text-gray-700' :
                      adv.status === 'partially_allocated' ? 'bg-amber-100 text-amber-800' :
                      adv.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {adv.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
