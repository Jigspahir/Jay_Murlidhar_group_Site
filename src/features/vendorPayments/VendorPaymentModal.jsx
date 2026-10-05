import React, { useState } from 'react';
import { X, DollarSign, Building2, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { VENDOR_PAYMENT_METHODS, recordVendorPayment } from './vendorPaymentService';

export default function VendorPaymentModal({
  isOpen,
  onClose,
  bill,
  onSuccess,
  currentUser
}) {
  const currentBal = bill ? (Number(bill.balance_due) || 0) : 0;
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Synchronize initial amount when bill is opened
  React.useEffect(() => {
    if (bill && isOpen) {
      const bal = Number(bill.balance_due) || 0;
      setAmount(bal > 0 ? String(bal) : '');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setError(null);
    }
  }, [bill, isOpen]);

  if (!isOpen || !bill) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payAmt = Number(amount);
    if (isNaN(payAmt) || payAmt <= 0) {
      setError('Please enter a valid disbursement amount greater than zero.');
      return;
    }

    if (payAmt > currentBal + 0.01) {
      setError(`Payment amount (₹${payAmt}) cannot exceed remaining balance (₹${currentBal.toFixed(2)}).`);
      return;
    }

    setIsSubmitting(true);
    try {
      await recordVendorPayment({
        billId: bill.id,
        amount: payAmt,
        paymentDate,
        paymentMethod,
        referenceNumber,
        notes,
        currentUser
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Vendor payment submission error:', err);
      setError(err.message || 'Failed to record vendor payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ven = bill.vendors || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold">
              ₹
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Record Vendor Disbursement</h3>
              <p className="text-[11px] font-mono text-slate-400">
                Bill: {bill.bill_number} &bull; Inv #{bill.vendor_invoice_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bill & Vendor Summary */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">SUPPLIER</span>
            <span className="font-bold text-slate-800">{ven.legal_name || 'Vendor'}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">BALANCE DUE</span>
            <span className="font-bold text-rose-600 text-sm">
              ₹{currentBal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Vendor Banking Details Helper Box (if available) */}
        {(ven.bank_account_no || ven.upi_id) && (
          <div className="mx-6 mt-3 p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl text-xs font-mono">
            <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1">
              Vendor Beneficiary Bank Info:
            </div>
            {ven.bank_name && <div className="text-blue-800">Bank: {ven.bank_name}</div>}
            {ven.bank_account_no && <div className="text-blue-800">A/C: {ven.bank_account_no}</div>}
            {ven.bank_ifsc && <div className="text-blue-800">IFSC: {ven.bank_ifsc}</div>}
            {ven.upi_id && <div className="text-blue-800">UPI VPA: {ven.upi_id}</div>}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Payment Amount (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={currentBal}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono font-bold text-sm"
              />
            </div>
            <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
              <span>Full Settlement Available</span>
              <button
                type="button"
                onClick={() => setAmount(currentBal)}
                className="text-blue-600 hover:underline font-mono"
              >
                Pay Full (₹{currentBal.toFixed(2)})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Disbursement Date *
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Disbursement Channel *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              >
                {VENDOR_PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Bank UTR / Transaction Reference / Cheque No.
            </label>
            <input
              type="text"
              placeholder="e.g. UTR12345678 or Cheque # 9921"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Internal Notes
            </label>
            <textarea
              rows={2}
              placeholder="Approved by finance manager for immediate clearing..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || Number(amount) <= 0}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording...' : 'Confirm Disbursement'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
