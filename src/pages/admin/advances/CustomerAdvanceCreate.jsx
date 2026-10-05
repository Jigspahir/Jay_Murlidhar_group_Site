import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useCompany } from '../../../contexts/CompanyContext';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { createCustomerAdvance } from '../../../features/advances/services/advanceService';

export default function CustomerAdvanceCreate() {
  const { currentCompanyId } = useCompany();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('bank_transfer');
  const [bankAccountId, setBankAccountId] = useState('');
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentCompanyId) return;
    async function loadDropdowns() {
      const [custRes, bankRes] = await Promise.all([
        supabase
          .from('customers')
          .select('id, display_name, customer_code')
          .eq('company_id', currentCompanyId)
          .eq('status', 'active')
          .order('display_name'),
        supabase
          .from('company_bank_accounts')
          .select('id, bank_name, account_number')
          .eq('company_id', currentCompanyId)
          .eq('is_active', true)
      ]);
      setCustomers(custRes.data || []);
      setBankAccounts(bankRes.data || []);
      if (bankRes.data && bankRes.data.length > 0) {
        setBankAccountId(bankRes.data[0].id);
      }
    }
    loadDropdowns();
  }, [currentCompanyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!customerId || !amount) {
      setError('Customer and Amount are required.');
      return;
    }

    setLoading(true);
    try {
      await createCustomerAdvance({
        companyId: currentCompanyId,
        customerId,
        amount: Number(amount),
        paymentMode,
        bankAccountId: bankAccountId || null,
        referenceNumber,
        receiptDate,
        notes,
        userId: user?.id
      });
      navigate('/admin/advances/customer');
    } catch (err) {
      console.error('Failed to create customer advance:', err);
      setError(err.message || 'Failed to record advance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Link
          to="/admin/advances/customer"
          className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Record Customer Advance</h1>
          <p className="text-xs text-slate-500">
            Receipt prior to invoice generation. Recognizes unearned liability (GL 2300).
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Customer *
          </label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Select Customer --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.display_name} ({c.customer_code})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Advance Amount (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="0.00"
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Receipt Date *
            </label>
            <input
              type="date"
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
              required
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Payment Mode *
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="bank_transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
              <option value="upi">UPI / QR Code</option>
              <option value="cash">Cash on Hand</option>
              <option value="cheque">Cheque</option>
              <option value="card">Debit / Credit Card</option>
              <option value="online">Online Payment Gateway</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Deposited Bank Account
            </label>
            <select
              value={bankAccountId}
              onChange={(e) => setBankAccountId(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Operational Bank Account --</option>
              {bankAccounts.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bank_name} ({b.account_number})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Reference / UTR / Cheque #
          </label>
          <input
            type="text"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="e.g. UTR12345678 or Cheque #987654"
            className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Notes / Purpose
          </label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. 50% advance booking retainer for college industrial tour..."
            className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Link
            to="/admin/advances/customer"
            className="px-4 py-2 text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Recording...' : 'Record Advance & Post to GL'}
          </button>
        </div>
      </form>
    </div>
  );
}
