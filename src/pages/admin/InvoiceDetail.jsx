import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  getInvoiceById,
  issueInvoice,
  cancelInvoice,
  InvoicePrintView
} from '../../features/invoices';
import { PaymentModal, PaymentReceiptView } from '../../features/payments';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import {
  Printer,
  Edit2,
  Send,
  XCircle,
  CreditCard,
  Building2,
  ArrowLeft,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';

const STATUS_BADGES = {
  draft: 'bg-slate-100 text-slate-700 border-slate-300',
  issued: 'bg-blue-50 text-blue-700 border-blue-200',
  partially_paid: 'bg-amber-50 text-amber-700 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  overdue: 'bg-rose-50 text-rose-700 border-rose-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-300 line-through'
};

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPrintMode = searchParams.get('print') === '1';

  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(PERMISSIONS.INVOICES_EDIT);
  const canRecordPayment = hasPermission(PERMISSIONS.PAYMENTS_CREATE);

  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Cancellation Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelError, setCancelError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = useCallback(() => {
    setIsLoading(true);
    getInvoiceById(id)
      .then((data) => {
        if (!data) {
          setError('Invoice not found.');
        } else {
          setInvoice(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load invoice.');
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleIssue = async () => {
    if (!window.confirm('Are you sure you want to issue this invoice? Financial content will become permanently immutable.')) {
      return;
    }
    try {
      setIsProcessing(true);
      await issueInvoice(id);
      setIsProcessing(false);
      loadData();
    } catch (err) {
      setIsProcessing(false);
      alert(err.message || 'Failed to issue invoice.');
    }
  };

  const handleCancel = async () => {
    if (!cancellationReason.trim()) {
      setCancelError('Please specify the cancellation reason.');
      return;
    }
    try {
      setIsProcessing(true);
      await cancelInvoice(id, cancellationReason);
      setIsProcessing(false);
      setIsCancelModalOpen(false);
      loadData();
    } catch (err) {
      setIsProcessing(false);
      setCancelError(err.message || 'Failed to cancel invoice.');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-3" />
        <p className="text-xs text-slate-500 font-mono">Loading commercial invoice...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
        <div className="p-3 rounded-full bg-rose-100 text-rose-600 w-12 h-12 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Invoice Error</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">{error || 'Invoice not found.'}</p>
        <button
          onClick={() => navigate('/admin/invoices')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg"
        >
          Back to Invoices
        </button>
      </div>
    );
  }

  if (isPrintMode) {
    return <InvoicePrintView invoice={invoice} />;
  }

  const badgeCls = STATUS_BADGES[invoice.status] || STATUS_BADGES.draft;
  const isOverdue = invoice.due_date && invoice.status !== 'paid' && invoice.status !== 'cancelled' && invoice.due_date < todayStr;
  const displayStatus = isOverdue && invoice.status === 'issued' ? 'overdue' : invoice.status;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            to="/admin/invoices"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Invoices</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {invoice.invoice_number}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${badgeCls}`}>
              {displayStatus.replace('_', ' ')}
            </span>
            {invoice.is_tax_invoice && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-mono border border-slate-200">
                GST INVOICE
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{invoice.company_name}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Print / Save PDF View */}
          <Link
            to={`/admin/invoices/${invoice.id}?print=1`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </Link>

          {/* Edit Draft */}
          {invoice.status === 'draft' && canEdit && (
            <Link
              to={`/admin/invoices/${invoice.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Draft</span>
            </Link>
          )}

          {/* Issue Invoice */}
          {invoice.status === 'draft' && canEdit && (
            <button
              onClick={handleIssue}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Issuing...' : 'Issue Invoice'}</span>
            </button>
          )}

          {/* Record Payment */}
          {invoice.status !== 'draft' && invoice.status !== 'cancelled' && invoice.status !== 'paid' && canRecordPayment && (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-sm transition-all"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>
          )}

          {/* Cancel Invoice */}
          {invoice.status !== 'cancelled' && invoice.status !== 'paid' && Number(invoice.amount_paid) === 0 && canEdit && (
            <button
              onClick={() => {
                setCancellationReason('');
                setCancelError(null);
                setIsCancelModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium border border-rose-200 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Cancellation Notice if Cancelled */}
      {invoice.status === 'cancelled' && (
        <div className="p-4 rounded-xl bg-gray-100 border border-gray-300 text-xs text-gray-700 flex items-start gap-2 font-mono">
          <ShieldAlert className="w-4 h-4 mt-0.5 text-gray-600 shrink-0" />
          <div>
            <span className="font-bold block">INVOICE CANCELLED</span>
            <span>Reason: {invoice.cancellation_reason || 'Administrative cancellation'}</span>
          </div>
        </div>
      )}

      {/* Snapshot Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Billing Profile */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            ISSUING COMPANY SNAPSHOT
          </div>
          <div className="text-base font-bold text-slate-900">{invoice.company_name}</div>
          {invoice.company_legal_name && (
            <div className="text-xs text-slate-500 font-medium">{invoice.company_legal_name}</div>
          )}
          <div className="text-xs text-slate-600 leading-relaxed">
            {invoice.company_address || 'Gujarat, India'}
          </div>
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-mono text-slate-600">
            <div>GSTIN: <span className="font-semibold text-slate-800">{invoice.company_gstin || 'N/A'}</span></div>
            <div>PAN: <span className="font-semibold text-slate-800">{invoice.company_pan || 'N/A'}</span></div>
          </div>
        </div>

        {/* Customer Profile */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            CUSTOMER BILLING SNAPSHOT
          </div>
          <div className="text-base font-bold text-slate-900">{invoice.customer_name}</div>
          {invoice.customer_business_name && (
            <div className="text-xs text-slate-500 font-medium">{invoice.customer_business_name}</div>
          )}
          <div className="text-xs text-slate-600 leading-relaxed">
            {[invoice.customer_address, invoice.customer_city, invoice.customer_state, invoice.customer_postal_code].filter(Boolean).join(', ') || 'Address on file'}
          </div>
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-mono text-slate-600">
            <div>Phone: <span className="text-slate-800">{invoice.customer_phone || 'N/A'}</span></div>
            <div>Tax ID: <span className="text-slate-800">{invoice.customer_tax_id || 'N/A'}</span></div>
          </div>
        </div>
      </div>

      {/* Dates & Status Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <span className="text-slate-400 block text-[10px]">INVOICE DATE</span>
          <span className="font-semibold text-slate-800">{invoice.invoice_date}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">DUE DATE</span>
          <span className={`font-semibold ${isOverdue ? 'text-rose-600' : 'text-slate-800'}`}>
            {invoice.due_date}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">PLACE OF SUPPLY</span>
          <span className="font-semibold text-slate-800">{invoice.place_of_supply}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">TAXATION TYPE</span>
          <span className="font-semibold text-slate-800">
            {invoice.is_tax_invoice ? (invoice.is_interstate ? 'IGST (Interstate)' : 'CGST + SGST (Intrastate)') : 'Non-GST'}
          </span>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 font-semibold text-xs text-slate-700 uppercase tracking-wider">
          Invoice Line Items
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Item Name & Description</th>
                <th className="px-3 py-2.5">HSN/SAC</th>
                <th className="px-3 py-2.5 text-right">Qty</th>
                <th className="px-3 py-2.5 text-right">Unit Price (₹)</th>
                {invoice.is_tax_invoice && <th className="px-3 py-2.5 text-right">Tax Rate</th>}
                <th className="px-4 py-2.5 text-right">Line Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.invoice_items?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{item.item_name}</div>
                    {item.description && (
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.description}</div>
                    )}
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-500">{item.hsn_sac_code || '—'}</td>
                  <td className="px-3 py-3 text-right font-mono">{item.quantity}</td>
                  <td className="px-3 py-3 text-right font-mono">
                    ₹{Number(item.unit_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  {invoice.is_tax_invoice && (
                    <td className="px-3 py-3 text-right font-mono">{item.tax_rate}%</td>
                  )}
                  <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800">
                    ₹{Number(item.line_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Totals & Bank Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Notes & Terms */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Commercial Notes & Bank Instructions
          </h3>

          {invoice.notes && (
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-0.5">Customer Notes:</span>
              <p>{invoice.notes}</p>
            </div>
          )}

          {invoice.terms_and_conditions && (
            <div className="text-xs text-slate-500">
              <span className="font-bold text-slate-700 block mb-0.5">Terms:</span>
              <p className="whitespace-pre-line leading-relaxed font-mono text-[11px]">{invoice.terms_and_conditions}</p>
            </div>
          )}

          {invoice.company_bank_name && (
            <div className="pt-3 border-t border-slate-100 text-xs font-mono text-slate-600 space-y-0.5">
              <div className="font-bold text-slate-700">Bank Details for Transfer:</div>
              <div>Bank: {invoice.company_bank_name} &bull; A/C: {invoice.company_bank_account_no}</div>
              <div>IFSC: {invoice.company_bank_ifsc} {invoice.company_upi_id ? `• UPI: ${invoice.company_upi_id}` : ''}</div>
            </div>
          )}
        </div>

        {/* Totals Panel */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2 text-xs font-mono">
          <div className="flex justify-between py-1 text-slate-600">
            <span>Subtotal (Gross):</span>
            <span>₹{Number(invoice.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          {Number(invoice.discount_amount) > 0 && (
            <div className="flex justify-between py-1 text-amber-600">
              <span>Discount ({invoice.discount_type}):</span>
              <span>-₹{Number(invoice.discount_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          )}

          <div className="flex justify-between py-1 font-semibold text-slate-800">
            <span>Taxable Amount:</span>
            <span>₹{Number(invoice.taxable_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          {invoice.is_tax_invoice && (
            <>
              {Number(invoice.igst_amount) > 0 ? (
                <div className="flex justify-between py-1 text-slate-600">
                  <span>IGST:</span>
                  <span>₹{Number(invoice.igst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>CGST:</span>
                    <span>₹{Number(invoice.cgst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>SGST:</span>
                    <span>₹{Number(invoice.sgst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </>
              )}
            </>
          )}

          <div className="flex justify-between py-2 text-sm font-bold text-slate-900 border-t-2 border-slate-300">
            <span>Grand Total:</span>
            <span className="text-blue-700">
              ₹{Number(invoice.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between py-1 text-emerald-600">
            <span>Total Paid:</span>
            <span>₹{Number(invoice.amount_paid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="flex justify-between py-1.5 text-base font-bold text-slate-900 border-t border-slate-200">
            <span>Balance Due:</span>
            <span className={Number(invoice.balance_due) > 0 ? 'text-rose-600' : 'text-slate-800'}>
              ₹{Number(invoice.balance_due || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Payment History & Settlement Ledger */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
            Payment History & Receipts
          </h3>
          {invoice.status !== 'draft' && invoice.status !== 'cancelled' && invoice.status !== 'paid' && canRecordPayment && (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>
          )}
        </div>

        {invoice.payments && invoice.payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-2.5">Receipt #</th>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Method</th>
                  <th className="px-3 py-2.5">Reference / UTR</th>
                  <th className="px-4 py-2.5 text-right">Amount (₹)</th>
                  <th className="px-4 py-2.5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono font-medium text-blue-600">
                      {p.payment_number}
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-600">{p.payment_date}</td>
                    <td className="px-3 py-3 capitalize">{p.payment_method}</td>
                    <td className="px-3 py-3 font-mono text-slate-500">{p.reference_number || '—'}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                      ₹{Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedReceipt({ ...p, companies: invoice.companies, invoices: invoice, customers: invoice.customers })}
                        className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                        title="Print Payment Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 font-mono">
            No payments recorded yet for this invoice.
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoice={invoice}
        onSuccess={loadData}
      />

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <PaymentReceiptView
          payment={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      {/* Cancel Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cancel Invoice</h3>
                <p className="text-xs text-slate-500 font-mono">{invoice.invoice_number}</p>
              </div>
            </div>

            {cancelError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {cancelError}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Cancellation Reason *
              </label>
              <textarea
                rows="3"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Reason for cancellation..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg shadow-sm"
              >
                {isProcessing ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
