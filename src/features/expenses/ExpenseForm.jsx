import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Receipt } from 'lucide-react';
import {
  EXPENSE_CATEGORIES,
  EXPENSE_STATUSES,
  EXPENSE_PAYMENT_METHODS
} from './expenseService';
import { getCompanyVendors } from '../vendors/vendorService';

export default function ExpenseForm({
  initialData = null,
  companies = [],
  selectedCompanyId,
  isAllCompanies,
  onSubmit,
  isSubmitting = false
}) {
  const navigate = useNavigate();

  const [companyId, setCompanyId] = useState(
    initialData?.company_id || (isAllCompanies ? (companies[0]?.id || '') : selectedCompanyId || '')
  );
  const [vendorId, setVendorId] = useState(initialData?.vendor_id || '');
  const [availableVendors, setAvailableVendors] = useState([]);
  const [category, setCategory] = useState(
    initialData?.category || EXPENSE_CATEGORIES[0]
  );
  const [payeeName, setPayeeName] = useState(initialData?.payee_name || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [taxAmount, setTaxAmount] = useState(initialData?.tax_amount || 0);
  const [expenseDate, setExpenseDate] = useState(
    initialData?.expense_date || new Date().toISOString().split('T')[0]
  );
  const [paymentMethod, setPaymentMethod] = useState(
    initialData?.payment_method || 'bank_transfer'
  );
  const [referenceNumber, setReferenceNumber] = useState(
    initialData?.reference_number || ''
  );
  const [description, setDescription] = useState(
    initialData?.description || ''
  );
  const [status, setStatus] = useState(initialData?.status || 'paid');

  const [formError, setFormError] = useState(null);

  // Load available vendors when company changes
  useEffect(() => {
    if (!companyId) return;
    let isMounted = true;
    getCompanyVendors(companyId)
      .then((vends) => {
        if (isMounted) setAvailableVendors(vends);
      })
      .catch((err) => console.error('Failed to load vendors for expense:', err));
    return () => {
      isMounted = false;
    };
  }, [companyId]);

  // When vendor selected, auto-populate payeeName
  const handleVendorSelect = (selectedId) => {
    setVendorId(selectedId);
    if (selectedId) {
      const matched = availableVendors.find((v) => v.id === selectedId);
      if (matched) {
        setPayeeName(matched.legal_name);
      }
    }
  };

  // Computed Total Amount
  const baseNum = Number(amount) || 0;
  const taxNum = Number(taxAmount) || 0;
  const totalAmount = Number((baseNum + taxNum).toFixed(2));

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (!companyId) {
      setFormError('Please select a company.');
      return;
    }

    if (!category) {
      setFormError('Please select an expense category.');
      return;
    }

    if (!payeeName || !payeeName.trim()) {
      setFormError('Please provide a payee / vendor name.');
      return;
    }

    if (baseNum <= 0) {
      setFormError('Expense amount must be greater than zero.');
      return;
    }

    if (taxNum < 0) {
      setFormError('Tax amount cannot be negative.');
      return;
    }

    onSubmit({
      companyId,
      vendorId: vendorId || null,
      category,
      payeeName: payeeName.trim(),
      amount: baseNum,
      taxAmount: taxNum,
      expenseDate,
      paymentMethod,
      referenceNumber: referenceNumber.trim(),
      description: description.trim(),
      status
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {formError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
          <span>{formError}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Receipt className="w-4 h-4 text-blue-600" />
          Operating Expense Voucher Information
        </h3>

        {/* Company & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              JMG Operating Company *
            </label>
            <select
              value={companyId}
              disabled={!!initialData}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-100"
              required
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Expense Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
              required
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Optional Registered Vendor Selection */}
        {availableVendors.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Select Registered Vendor (Optional)
            </label>
            <select
              value={vendorId}
              onChange={(e) => handleVendorSelect(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="">Direct / Unregistered Payee</option>
              {availableVendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.legal_name} ({v.vendor_code})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Selecting a vendor links this expense to their profile while maintaining backward compatibility.
            </p>
          </div>
        )}

        {/* Payee Name & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Payee Name (Vendor / Service Provider / Individual) *
            </label>
            <input
              type="text"
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
              placeholder="e.g. Torrent Power Ltd, Landlord Name, Google Cloud"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Disbursement / Bill Date *
            </label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Financial Amounts (Base, Tax, Total) */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Base Amount (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 text-xs text-right rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 font-mono font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Applicable Tax (₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={taxAmount}
              onChange={(e) => setTaxAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 text-xs text-right rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Total Disbursement (₹)
            </label>
            <div className="w-full px-3 py-2 text-xs text-right rounded-lg border border-slate-300 bg-white font-mono font-bold text-slate-900">
              ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Payment Instrument & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Payment Method *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
            >
              {EXPENSE_PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Reference / Cheque / UTR #
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. NEFT123847"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Voucher Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
            >
              {EXPENSE_STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Description / Purpose of Expense
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details of the commercial expense or invoice paid..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => navigate('/admin/expenses')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel & Back</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving Voucher...' : initialData ? 'Update Expense' : 'Record Expense'}</span>
        </button>
      </div>
    </form>
  );
}
