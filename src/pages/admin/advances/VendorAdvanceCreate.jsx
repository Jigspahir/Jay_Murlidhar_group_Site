import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../../contexts/CompanyContext';
import { advanceService } from '../../../features/advances/services/advanceService';
import { supabase } from '../../../lib/supabase';

export default function VendorAdvanceCreate() {
  const navigate = useNavigate();
  const { currentCompany } = useCompany();

  const [vendors, setVendors] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    vendor_id: '',
    payment_date: new Date().toISOString().split('T')[0],
    amount: '',
    payment_mode: 'bank_transfer',
    bank_account_id: '',
    reference: '',
    notes: ''
  });

  useEffect(() => {
    async function loadData() {
      if (!currentCompany?.id) return;
      try {
        setLoading(true);
        const [vRes, bRes] = await Promise.all([
          supabase.from('vendors').select('id, name').eq('company_id', currentCompany.id).eq('status', 'active'),
          supabase.from('company_bank_accounts').select('id, bank_name, account_number').eq('company_id', currentCompany.id).eq('status', 'active')
        ]);
        setVendors(vRes.data || []);
        setBankAccounts(bRes.data || []);
        if (bRes.data?.length > 0) {
          setFormData(prev => ({ ...prev, bank_account_id: bRes.data[0].id }));
        }
      } catch (err) {
        console.error('Failed to load master data:', err);
        setError('Failed to load vendors or bank accounts');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentCompany?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vendor_id) {
      setError('Please select a vendor');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    if (['bank_transfer', 'cheque', 'upi', 'card'].includes(formData.payment_mode) && !formData.bank_account_id) {
      setError('Please select a company bank account');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await advanceService.recordVendorAdvance({
        company_id: currentCompany.id,
        vendor_id: formData.vendor_id,
        payment_date: formData.payment_date,
        amount: Number(formData.amount),
        payment_mode: formData.payment_mode,
        bank_account_id: formData.bank_account_id || null,
        reference: formData.reference,
        notes: formData.notes
      });
      navigate('/admin/advances/vendor');
    } catch (err) {
      console.error('Failed to record vendor advance:', err);
      setError(err.message || 'Failed to record vendor advance');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading form data...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disburse Vendor Advance</h1>
          <p className="text-sm text-gray-500">Record advance disbursement to vendor (Asset Dr 1500 / Cr Bank)</p>
        </div>
        <button
          onClick={() => navigate('/admin/advances/vendor')}
          className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Vendor *</label>
            <select
              value={formData.vendor_id}
              onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
            >
              <option value="">Select Vendor</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Disbursement Date *</label>
            <input
              type="date"
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Advance Amount (₹) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Mode *</label>
            <select
              value={formData.payment_mode}
              onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="bank_transfer">Bank Transfer / NEFT / RTGS</option>
              <option value="cheque">Cheque</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Bank Account</label>
            <select
              value={formData.bank_account_id}
              onChange={(e) => setFormData({ ...formData, bank_account_id: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Select Bank Account</option>
              {bankAccounts.map((b) => (
                <option key={b.id} value={b.id}>{b.bank_name} - {b.account_number}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Reference / UTR / Cheque #</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              placeholder="UTR or Cheque number"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            placeholder="Remarks or purpose of advance payment"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin/advances/vendor')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? 'Recording...' : 'Disburse & Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
