import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { purchaseBillService, BillPrintView } from '../../features/purchaseBills';
import { VendorPaymentModal } from '../../features/vendorPayments';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Truck,
  CreditCard,
  Printer,
  FileEdit,
  AlertCircle,
  Ban,
  CheckCircle,
  FileText
} from 'lucide-react';

export default function PurchaseBillDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { isGroupOwner, isCompanyManager } = useCompany();
  const { hasPermission } = usePermissions();

  const canEdit = hasPermission(PERMISSIONS.PURCHASE_BILLS_EDIT);
  const canPay = hasPermission(PERMISSIONS.VENDOR_PAYMENTS_CREATE);

  const [bill, setBill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);

  // Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Cancellation modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  const loadBill = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await purchaseBillService.getPurchaseBillById(id);
      setBill(data);
    } catch (err) {
      console.error('Error loading purchase bill:', err);
      setError(err.message || 'Purchase bill not found or access denied');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBill();
  }, [loadBill]);

  const handleRecordBill = async () => {
    if (!window.confirm('Record this supplier bill in Accounts Payable? This will finalize commercial liability and update PO billing progress.')) return;
    setActionLoading(true);
    try {
      await purchaseBillService.recordPurchaseBill(id, user);
      await loadBill();
    } catch (err) {
      alert(err.message || 'Failed to record bill');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBillConfirm = async (e) => {
    e.preventDefault();
    if (!cancellationReason.trim()) return;
    setActionLoading(true);
    try {
      await purchaseBillService.cancelPurchaseBill(id, cancellationReason);
      setCancelModalOpen(false);
      setCancellationReason('');
      await loadBill();
    } catch (err) {
      alert(err.message || 'Failed to cancel bill');
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent" />
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Loading supplier bill...</p>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bill Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{error || 'Purchase bill not accessible.'}</p>
        <Link
          to="/admin/purchase-bills"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Supplier Bills
        </Link>
      </div>
    );
  }

  if (isPrintMode) {
    return (
      <div className="space-y-4">
        <div className="print:hidden flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl">
          <span>Print Preview Mode</span>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium"
            >
              Print Voucher
            </button>
            <button
              onClick={() => setIsPrintMode(false)}
              className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium"
            >
              Close Preview
            </button>
          </div>
        </div>
        <BillPrintView bill={bill} />
      </div>
    );
  }

  const isOverdue =
    new Date(bill.due_date) < new Date() &&
    bill.payment_status !== 'paid' &&
    bill.status !== 'cancelled';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/purchase-bills"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{bill.bill_number}</h1>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                Inv: {bill.vendor_invoice_number}
              </span>

              {/* Lifecycle status: draft / recorded / cancelled */}
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                bill.status === 'recorded'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : bill.status === 'cancelled'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
              }`}>
                Bill: {bill.status}
              </span>

              {/* Payment status (meaningful once recorded) */}
              {bill.status === 'recorded' && (
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                  bill.payment_status === 'paid'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : bill.payment_status === 'partially_paid'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                    : isOverdue
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-400'
                }`}>
                  Payment: {isOverdue ? 'Overdue' : bill.payment_status?.replace('_', ' ')}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Entity: {bill.companies?.name} &bull; Vendor: {bill.vendors?.legal_name}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Edit (only if draft) */}
          {canEdit && bill.status === 'draft' && (
            <Link
              to={`/admin/purchase-bills/${bill.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750"
            >
              <FileEdit className="w-4 h-4" />
              Edit
            </Link>
          )}

          {/* Record Draft Bill into AP & sync PO */}
          {canEdit && bill.status === 'draft' && (
            <button
              onClick={handleRecordBill}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Record Bill (AP)
            </button>
          )}

          {/* Record Vendor Payment (Only when recorded and balance > 0) */}
          {canPay && bill.status === 'recorded' && bill.payment_status !== 'paid' && Number(bill.balance_due) > 0 && (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              <CreditCard className="w-4 h-4" />
              Record Payment
            </button>
          )}

          {/* Print Voucher */}
          <button
            onClick={() => setIsPrintMode(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750"
          >
            <Printer className="w-4 h-4" />
            Print Voucher
          </button>

          {/* Cancel Bill (Forbidden if any payments have been recorded) */}
          {(isGroupOwner || isCompanyManager) &&
            bill.status !== 'cancelled' &&
            Number(bill.amount_paid || 0) === 0 && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
              >
                <Ban className="w-4 h-4" />
                Cancel Bill
              </button>
            )}
        </div>
      </div>

      {/* Draft Bill Notice */}
      {bill.status === 'draft' && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>
            <strong className="block font-semibold">Draft Supplier Bill</strong>
            <span>
              This bill is in Draft status. It has not yet created Accounts Payable liability, does not affect vendor statements, and does not consume PO item quantities until it is officially recorded.
            </span>
          </div>
        </div>
      )}

      {/* Rejection / Cancellation alerts */}
      {bill.cancellation_reason && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-sm text-rose-800 dark:text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Bill Cancelled</strong>
            <span>Reason: {bill.cancellation_reason}</span>
          </div>
        </div>
      )}

      {/* Financial Status Summary */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Accounts Payable Balance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Total Bill Amount</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              ₹{Number(bill.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Amount Paid (Disbursed)</span>
            <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              ₹{Number(bill.amount_paid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Current Balance Due</span>
            <span className={`text-xl font-bold font-mono ${
              Number(bill.balance_due) > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'
            }`}>
              ₹{Number(bill.balance_due || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vendor */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-500" />
            Supplier Details
          </h3>
          <div className="text-sm">
            <Link
              to={`/admin/vendors/${bill.vendor_id}`}
              className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {bill.vendors?.legal_name}
            </Link>
            <div className="font-mono text-xs text-slate-500">{bill.vendors?.vendor_code}</div>
            <div className="text-slate-600 dark:text-slate-400 text-xs mt-2">
              Phone: {bill.vendors?.phone}
            </div>
            {bill.vendors?.gstin && (
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                GSTIN: {bill.vendors.gstin}
              </div>
            )}
            <div className="text-xs text-slate-500 mt-2">
              {bill.vendors?.billing_address}, {bill.vendors?.billing_city}
            </div>
          </div>
        </div>

        {/* Commercial & PO Meta */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-500" />
            Entity & Reference
          </h3>
          <div className="text-sm space-y-1.5">
            <div>
              <span className="text-xs text-slate-400 block">Recipient Entity</span>
              <span className="font-semibold text-slate-900 dark:text-white">{bill.companies?.name}</span>
            </div>
            {bill.purchase_orders && (
              <div>
                <span className="text-xs text-slate-400 block">Originating PO</span>
                <Link
                  to={`/admin/purchase-orders/${bill.purchase_order_id}`}
                  className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {bill.purchase_orders.po_number}
                </Link>
              </div>
            )}
            {bill.reference_number && (
              <div>
                <span className="text-xs text-slate-400 block">External Ref</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{bill.reference_number}</span>
              </div>
            )}
          </div>
        </div>

        {/* Due Dates & Timestamps */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            Dates & Terms
          </h3>
          <div className="text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Bill Date:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {new Date(bill.bill_date).toLocaleDateString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Due Date:</span>
              <span className={`font-semibold ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                {new Date(bill.due_date).toLocaleDateString('en-IN')}
                {isOverdue && ' (Overdue)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Place of Supply:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {bill.place_of_supply || 'Intra-State'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Bill Line Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Item & Description</th>
                <th className="px-4 py-3 text-center">HSN/SAC</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-right">Discount</th>
                <th className="px-4 py-3 text-right">Tax Rate</th>
                <th className="px-4 py-3 text-right">Tax Amt</th>
                <th className="px-4 py-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {bill.items?.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{item.item_name}</div>
                    {item.description && (
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">{item.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-slate-500">
                    {item.hsn_sac_code || '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-800 dark:text-slate-200">
                    ₹{Number(item.unit_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500">
                    {Number(item.discount_amount) > 0 ? `₹${Number(item.discount_amount).toFixed(2)}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500">
                    {item.tax_rate}%
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">
                    ₹{Number(item.tax_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ₹{Number(item.line_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <div className="w-72 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal:</span>
              <span>₹{Number(bill.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {Number(bill.discount_amount) > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discount:</span>
                <span>-₹{Number(bill.discount_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Taxable Amount:</span>
              <span>₹{Number(bill.taxable_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {Number(bill.cgst_amount) > 0 && (
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>CGST:</span>
                <span>₹{Number(bill.cgst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {Number(bill.sgst_amount) > 0 && (
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>SGST:</span>
                <span>₹{Number(bill.sgst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {Number(bill.igst_amount) > 0 && (
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>IGST:</span>
                <span>₹{Number(bill.igst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-900 dark:text-white font-bold text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-sans">Total Bill Amount:</span>
              <span>₹{Number(bill.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
              <span className="font-sans">Amount Paid:</span>
              <span>₹{Number(bill.amount_paid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-rose-600 dark:text-rose-400 font-bold pt-1">
              <span className="font-sans">Balance Due:</span>
              <span>₹{Number(bill.balance_due || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Payments History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            Payments Disbursed
          </h3>
          {canPay && bill.payment_status !== 'paid' && bill.status !== 'cancelled' && (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              + Add Payment
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Payment #</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono">
              {!bill.payments || bill.payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 font-sans">
                    No vendor payments recorded yet for this bill.
                  </td>
                </tr>
              ) : (
                bill.payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {p.payment_number}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-sans">
                      {new Date(p.payment_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 uppercase text-[11px] text-slate-700 dark:text-slate-300 font-sans">
                      {p.payment_method?.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {p.reference_number || '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <VendorPaymentModal
          bill={bill}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={() => {
            setIsPaymentModalOpen(false);
            loadBill();
          }}
        />
      )}

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-600" />
              Cancel Supplier Bill
            </h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to cancel this supplier bill? This will void payables liability.
            </p>
            <form onSubmit={handleCancelBillConfirm} className="space-y-4">
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                required
                rows={3}
                placeholder="Authoritative cancellation reason..."
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !cancellationReason.trim()}
                  className="px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg disabled:opacity-50"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
