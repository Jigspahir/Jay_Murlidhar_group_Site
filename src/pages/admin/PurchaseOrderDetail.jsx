import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { purchaseOrderService, POPrintView } from '../../features/purchaseOrders';
import {
  ArrowLeft,
  ShoppingBag,
  Building2,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  Send,
  Printer,
  Receipt,
  FileEdit,
  AlertCircle,
  Clock,
  Ban
} from 'lucide-react';

export default function PurchaseOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isGroupOwner, isCompanyManager } = useCompany();
  const { hasPermission } = usePermissions();

  const canEdit = hasPermission(PERMISSIONS.PURCHASE_ORDERS_EDIT);
  const canApprove = hasPermission(PERMISSIONS.PURCHASE_ORDERS_APPROVE);
  const canCreateBill = hasPermission(PERMISSIONS.PURCHASE_BILLS_CREATE);

  const [po, setPo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);

  // Cancellation / Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [reasonText, setReasonText] = useState('');

  const loadPO = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await purchaseOrderService.getPurchaseOrderById(id);
      setPo(data);
    } catch (err) {
      console.error('Error loading purchase order:', err);
      setError(err.message || 'Purchase order not found or access denied');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPO();
  }, [loadPO]);

  const handleSubmitForApproval = async () => {
    if (!window.confirm('Submit this purchase order for manager approval?')) return;
    setActionLoading(true);
    try {
      await purchaseOrderService.submitForApproval(id);
      await loadPO();
    } catch (err) {
      alert(err.message || 'Failed to submit PO');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Approve this purchase order?')) return;
    setActionLoading(true);
    try {
      await purchaseOrderService.approvePurchaseOrder(id);
      await loadPO();
    } catch (err) {
      alert(err.message || 'Failed to approve PO');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async (e) => {
    e.preventDefault();
    if (!reasonText.trim()) return;
    setActionLoading(true);
    try {
      await purchaseOrderService.rejectPurchaseOrder(id, reasonText);
      setRejectModalOpen(false);
      setReasonText('');
      await loadPO();
    } catch (err) {
      alert(err.message || 'Failed to reject PO');
    } finally {
      setActionLoading(false);
    }
  };

  const handleIssue = async () => {
    if (!window.confirm('Issue this approved purchase order to the vendor?')) return;
    setActionLoading(true);
    try {
      await purchaseOrderService.issuePurchaseOrder(id);
      await loadPO();
    } catch (err) {
      alert(err.message || 'Failed to issue PO');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelConfirm = async (e) => {
    e.preventDefault();
    if (!reasonText.trim()) return;
    setActionLoading(true);
    try {
      await purchaseOrderService.cancelPurchaseOrder(id, reasonText);
      setCancelModalOpen(false);
      setReasonText('');
      await loadPO();
    } catch (err) {
      alert(err.message || 'Failed to cancel PO');
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent" />
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Loading purchase order details...</p>
      </div>
    );
  }

  if (error || !po) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{error || 'Purchase order not accessible.'}</p>
        <Link
          to="/admin/purchase-orders"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Purchase Orders
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
              Print Document
            </button>
            <button
              onClick={() => setIsPrintMode(false)}
              className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium"
            >
              Close Preview
            </button>
          </div>
        </div>
        <POPrintView purchaseOrder={po} />
      </div>
    );
  }

  const remainingCommitment = Math.max(0, Number(po.total_amount || 0) - Number(po.billed_amount || 0));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/purchase-orders"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{po.po_number}</h1>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                po.status === 'issued' || po.status === 'fully_billed'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : po.status === 'cancelled'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                  : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-400'
              }`}>
                {po.status?.replace('_', ' ')}
              </span>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded border capitalize ${
                po.approval_status === 'approved'
                  ? 'border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400'
                  : po.approval_status === 'rejected'
                  ? 'border-rose-300 text-rose-700 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400'
                  : 'border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400'
              }`}>
                {po.approval_status}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Issued by {po.companies?.name} &bull; Vendor: {po.vendors?.legal_name}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Edit (only if draft or rejected) */}
          {canEdit && (po.status === 'draft' || po.approval_status === 'rejected') && (
            <Link
              to={`/admin/purchase-orders/${po.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750"
            >
              <FileEdit className="w-4 h-4" />
              Edit
            </Link>
          )}

          {/* Submit (if draft) */}
          {po.status === 'draft' && po.approval_status === 'draft' && (
            <button
              onClick={handleSubmitForApproval}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              <Send className="w-4 h-4" />
              Submit for Approval
            </button>
          )}

          {/* Approve / Reject (Company Manager or Group Owner) */}
          {canApprove && po.approval_status === 'submitted' && (
            <>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => setRejectModalOpen(true)}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 hover:bg-rose-100 rounded-lg"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </>
          )}

          {/* Issue PO (Company Manager or Group Owner after approval) */}
          {canApprove && po.approval_status === 'approved' && po.status === 'approved' && (
            <button
              onClick={handleIssue}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Issue PO
            </button>
          )}

          {/* Create Supplier Bill from this PO */}
          {canCreateBill && (po.status === 'issued' || po.status === 'partially_billed') && (
            <Link
              to={`/admin/purchase-bills/new?po_id=${po.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              <Receipt className="w-4 h-4" />
              {po.status === 'partially_billed' ? 'Create Additional Supplier Bill' : 'Create Supplier Bill'}
            </Link>
          )}

          {/* Print */}
          <button
            onClick={() => setIsPrintMode(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>

          {/* Cancel PO (Only permitted if no bills have been recorded against it) */}
          {(isGroupOwner || isCompanyManager) &&
            po.status !== 'cancelled' &&
            po.status !== 'closed' &&
            po.status !== 'fully_billed' &&
            Number(po.billed_amount || 0) === 0 && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
              >
                <Ban className="w-4 h-4" />
                Cancel PO
              </button>
            )}
        </div>
      </div>

      {/* Rejection / Cancellation alerts */}
      {po.cancellation_reason && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-sm text-rose-800 dark:text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">
              {po.status === 'cancelled' ? 'Order Cancelled' : 'Order Rejected'}
            </strong>
            <span>Reason: {po.cancellation_reason}</span>
          </div>
        </div>
      )}

      {/* Commercial Progress Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Procurement Commitment & Billing Progress
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Total PO Commitment</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              ₹{Number(po.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Billed to Date</span>
            <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              ₹{Number(po.billed_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Remaining Commitment</span>
            <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
              ₹{remainingCommitment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
            Vendor Details
          </h3>
          <div className="text-sm">
            <Link
              to={`/admin/vendors/${po.vendor_id}`}
              className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {po.vendors?.legal_name}
            </Link>
            <div className="font-mono text-xs text-slate-500">{po.vendors?.vendor_code}</div>
            <div className="text-slate-600 dark:text-slate-400 text-xs mt-2">
              Phone: {po.vendors?.phone}
            </div>
            {po.vendors?.gstin && (
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                GSTIN: {po.vendors.gstin}
              </div>
            )}
            <div className="text-xs text-slate-500 mt-2">
              {po.vendors?.billing_address}, {po.vendors?.billing_city}
            </div>
          </div>
        </div>

        {/* Company & Order Meta */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-500" />
            Company & Terms
          </h3>
          <div className="text-sm space-y-1.5">
            <div>
              <span className="text-xs text-slate-400 block">Issuing Entity</span>
              <span className="font-semibold text-slate-900 dark:text-white">{po.companies?.name}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Payment Terms</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {po.payment_terms_days ? `${po.payment_terms_days} Days` : 'Due upon delivery'}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Expected Delivery</span>
              <span className="text-slate-700 dark:text-slate-300">
                {po.expected_delivery_date
                  ? new Date(po.expected_delivery_date).toLocaleDateString('en-IN')
                  : 'Not specified'}
              </span>
            </div>
          </div>
        </div>

        {/* Audit & Timestamps */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500" />
            Workflow & Audit
          </h3>
          <div className="text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">PO Date:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {new Date(po.po_date).toLocaleDateString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Created:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {new Date(po.created_at).toLocaleDateString('en-IN')}
              </span>
            </div>
            {po.approved_at && (
              <div className="flex justify-between">
                <span className="text-slate-400">Approved:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {new Date(po.approved_at).toLocaleDateString('en-IN')}
                </span>
              </div>
            )}
            {po.issued_at && (
              <div className="flex justify-between">
                <span className="text-slate-400">Issued:</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  {new Date(po.issued_at).toLocaleDateString('en-IN')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Purchase Order Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Item & Description</th>
                <th className="px-4 py-3 text-center">HSN/SAC</th>
                <th className="px-4 py-3 text-right">Ordered Qty</th>
                <th className="px-4 py-3 text-right">Billed Qty</th>
                <th className="px-4 py-3 text-right">Remaining Qty</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-right">Discount</th>
                <th className="px-4 py-3 text-right">Tax Rate</th>
                <th className="px-4 py-3 text-right">Tax Amt</th>
                <th className="px-4 py-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {po.items?.map((item, idx) => {
                const orderedQty = Number(item.quantity || 0);
                const billedQty = Number(item.billed_quantity || 0);
                const remainingQty = Math.max(0, orderedQty - billedQty);
                return (
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
                      {orderedQty}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      {billedQty}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-indigo-600 dark:text-indigo-400">
                      {remainingQty}
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
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <div className="w-72 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal:</span>
              <span>₹{Number(po.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {Number(po.discount_amount) > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discount:</span>
                <span>-₹{Number(po.discount_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Taxable Amount:</span>
              <span>₹{Number(po.taxable_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {Number(po.cgst_amount) > 0 && (
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>CGST:</span>
                <span>₹{Number(po.cgst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {Number(po.sgst_amount) > 0 && (
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>SGST:</span>
                <span>₹{Number(po.sgst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {Number(po.igst_amount) > 0 && (
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>IGST:</span>
                <span>₹{Number(po.igst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-900 dark:text-white font-bold text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-sans">Total Amount:</span>
              <span>₹{Number(po.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              Reject Purchase Order
            </h3>
            <p className="text-xs text-slate-500">
              Please specify the reason for rejecting this PO. The record will be preserved for revision.
            </p>
            <form onSubmit={handleRejectConfirm} className="space-y-4">
              <textarea
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                required
                rows={3}
                placeholder="Reason for rejection..."
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !reasonText.trim()}
                  className="px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-600" />
              Cancel Purchase Order
            </h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to cancel this purchase order? Please provide an authoritative cancellation reason.
            </p>
            <form onSubmit={handleCancelConfirm} className="space-y-4">
              <textarea
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
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
                  disabled={actionLoading || !reasonText.trim()}
                  className="px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg disabled:opacity-50"
                >
                  Cancel Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
