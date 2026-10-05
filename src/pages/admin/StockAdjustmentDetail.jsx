import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  getStockAdjustmentById,
  submitStockAdjustment,
  approveStockAdjustment,
  rejectStockAdjustment,
  ADJUSTMENT_STATUSES,
  ADJUSTMENT_REASONS
} from '../../features/inventory';
import { PERMISSIONS } from '../../config/permissions';
import {
  Sliders,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Send,
  AlertTriangle,
  Package,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function StockAdjustmentDetail() {
  const { id } = useParams();
  const { user, hasPermission } = useAuth();

  const [adjustment, setAdjustment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const canApprove = hasPermission(PERMISSIONS.INVENTORY_ADJUST_APPROVE);

  const loadAdjustment = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await getStockAdjustmentById(id);
      if (fetchErr) throw new Error(fetchErr);
      setAdjustment(data);
    } catch (err) {
      console.error('Error loading adjustment:', err);
      setError(err.message || 'Adjustment not found');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAdjustment();
  }, [loadAdjustment]);

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      const { error: err } = await submitStockAdjustment(id);
      if (err) throw new Error(err);
      loadAdjustment();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this stock adjustment? This will permanently update inventory balances.')) {
      return;
    }
    setIsProcessing(true);
    try {
      const { error: err } = await approveStockAdjustment(id, user?.id);
      if (err) throw new Error(err);
      loadAdjustment();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this adjustment request?')) {
      return;
    }
    setIsProcessing(true);
    try {
      const { error: err } = await rejectStockAdjustment(id);
      if (err) throw new Error(err);
      loadAdjustment();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const meta = ADJUSTMENT_STATUSES.find((s) => s.value === status) || { label: status, color: 'slate' };
    const colorClasses = {
      slate: 'bg-slate-100 text-slate-700 border-slate-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rose: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium border ${colorClasses[meta.color] || colorClasses.slate}`}>
        {meta.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-4xl mx-auto">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Loading stock adjustment...</p>
      </div>
    );
  }

  if (error || !adjustment) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-4xl mx-auto">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Adjustment Not Found</h3>
        <p className="text-xs text-slate-500 mb-4">{error}</p>
        <Link
          to="/admin/inventory/adjustments"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Adjustments
        </Link>
      </div>
    );
  }

  const items = adjustment.stock_adjustment_items || [];
  const reasonLabel = ADJUSTMENT_REASONS.find((r) => r.value === adjustment.reason)?.label || adjustment.reason;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/inventory/adjustments"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{adjustment.adjustment_number}</h1>
              {getStatusBadge(adjustment.status)}
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Created: {new Date(adjustment.created_at).toLocaleDateString('en-IN')} &bull; Warehouse: {adjustment.warehouses?.warehouse_name}
            </p>
          </div>
        </div>

        {/* Action Buttons based on status & permissions */}
        <div className="flex items-center gap-2">
          {adjustment.status === 'draft' && (
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Submit for Approval
            </button>
          )}

          {canApprove && (adjustment.status === 'submitted' || adjustment.status === 'draft') && (
            <>
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>

              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve & Apply
              </button>
            </>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span className="text-xs font-medium text-slate-500 block mb-0.5">Adjustment Reason</span>
          <span className="font-semibold text-slate-800 text-xs">{reasonLabel}</span>
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500 block mb-0.5">Warehouse Location</span>
          <span className="font-semibold text-slate-800 text-xs">{adjustment.warehouses?.warehouse_name}</span>
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500 block mb-0.5">Approval Authority</span>
          <span className="font-semibold text-slate-800 text-xs">
            {adjustment.approved_at ? `Approved on ${new Date(adjustment.approved_at).toLocaleDateString('en-IN')}` : 'Pending Approval'}
          </span>
        </div>
      </div>

      {/* Adjustment Items Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          Stock Adjustment Line Items
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3 text-right">System Qty</th>
                <th className="py-2.5 px-3 text-right">Counted Qty</th>
                <th className="py-2.5 px-3 text-center">Variance (Diff)</th>
                <th className="py-2.5 px-3 text-right">Unit Cost</th>
                <th className="py-2.5 px-3">Item Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((it) => {
                const diff = Number(it.difference_quantity || (it.adjusted_quantity - it.current_quantity) || 0);

                return (
                  <tr key={it.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {it.products?.product_name || '—'}
                      <span className="font-mono text-[10px] text-slate-400 block">
                        {it.products?.product_code} &bull; {it.products?.sku}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      {it.current_quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {it.adjusted_quantity} {it.products?.unit_code || 'PCS'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                          diff > 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : diff < 0
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      ₹{Number(it.unit_cost || 0).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 italic">
                      {it.notes || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {adjustment.notes && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-600 block mb-1">Audit Notes:</span>
          <p className="text-xs text-slate-700">{adjustment.notes}</p>
        </div>
      )}
    </div>
  );
}
