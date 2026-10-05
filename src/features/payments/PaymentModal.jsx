import React, { useState } from 'react';
import { X, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { recordPayment, PAYMENT_METHODS } from './paymentService';
import { useAuth } from '../../hooks/useAuth';

export default function PaymentModal({
  isOpen,
  onClose,
  invoice,
  onSuccess
}) {
  const { user } = useAuth();

  const balance = Number(invoice?.balance_due || 0);

  const [amount, setAmount] = useState(balance > 0 ? balance : '');
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen || !invoice) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const payVal = Number(amount);
    if (isNaN(payVal) || payVal <= 0) {
      setErrorMessage('Please enter a valid payment amount greater than zero.');
      return;
    }

    if (payVal > balance + 0.01) {
      setErrorMessage(`Payment cannot exceed remaining balance (₹${balance.toFixed(2)}).`);
      return;
    }

    try {
      setIsSubmitting(true);
      await recordPayment({
        invoiceId: invoice.id,
        amount: payVal,
        paymentDate,
        paymentMethod,
        referenceNumber,
        notes,
        currentUser: user
      });
      setIsSubmitting(false);
      onSuccess?.();
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to record payment transaction.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Record Commercial Payment</h3>
              <p className="text-xs text-slate-500 font-mono">Invoice: {invoice.invoice_number}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Overview Card */}
        <div className="p-6 pb-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">TOTAL AMOUNT</span>
              <span className="font-semibold text-slate-800">
                ₹{Number(invoice.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ALREADY PAID</span>
              <span className="font-semibold text-emerald-600">
                ₹{Number(invoice.amount_paid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">BALANCE DUE</span>
              <span className="font-bold text-rose-600">
                ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mx-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Payment Amount (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 font-mono font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Reference / UTR / Cheque #
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. UPI Ref, NEFT UTR"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Internal Notes / Receipt Remarks
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Received via PhonePe QR scanner"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || balance <= 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition-all"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Recording...' : 'Record Payment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
