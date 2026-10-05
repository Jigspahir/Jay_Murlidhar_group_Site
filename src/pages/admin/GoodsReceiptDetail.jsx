import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getGoodsReceiptById,
  receiveGoodsReceipt,
  GRN_STATUSES
} from '../../features/inventory';
import {
  Truck,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Package,
  Building2,
  Calendar,
  FileText
} from 'lucide-react';

export default function GoodsReceiptDetail() {
  const { id } = useParams();

  const [receipt, setReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const loadReceipt = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await getGoodsReceiptById(id);
      if (fetchErr) throw new Error(fetchErr);
      setReceipt(data);
    } catch (err) {
      console.error('Error loading goods receipt:', err);
      setError(err.message || 'Goods receipt not found');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadReceipt();
  }, [loadReceipt]);

  const handlePostStock = async () => {
    if (!window.confirm('Are you sure you want to receive this stock? This will post immutable stock movements and update warehouse inventory.')) {
      return;
    }
    setIsProcessing(true);
    try {
      const { error: rxErr } = await receiveGoodsReceipt(id);
      if (rxErr) throw new Error(rxErr);
      loadReceipt();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const meta = GRN_STATUSES.find((s) => s.value === status) || { label: status, color: 'slate' };
    const colorClasses = {
      slate: 'bg-slate-100 text-slate-700 border-slate-200',
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
        <p className="text-xs font-medium text-slate-500">Loading Goods Receipt...</p>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-4xl mx-auto">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Receipt Not Found</h3>
        <p className="text-xs text-slate-500 mb-4">{error}</p>
        <Link
          to="/admin/inventory/receipts"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Receipts
        </Link>
      </div>
    );
  }

  const items = receipt.goods_receipt_items || [];
  const totalReceivedQty = items.reduce((acc, it) => acc + Number(it.received_quantity || 0), 0);
  const totalValuation = items.reduce((acc, it) => acc + Number(it.total_cost || 0), 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/inventory/receipts"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{receipt.grn_number}</h1>
              {getStatusBadge(receipt.status)}
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Receipt Date: {receipt.receipt_date ? new Date(receipt.receipt_date).toLocaleDateString('en-IN') : '—'} &bull; Company: {receipt.companies?.name}
            </p>
          </div>
        </div>

        {receipt.status === 'draft' && (
          <button
            onClick={handlePostStock}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isProcessing ? 'Posting Stock...' : 'Confirm & Post Stock In'}
          </button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Destination Warehouse</span>
          <div className="mt-2 font-semibold text-slate-900 text-sm">
            {receipt.warehouses?.warehouse_name}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {receipt.warehouses?.warehouse_code}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Vendor / Supplier</span>
          <div className="mt-2 font-semibold text-slate-900 text-sm">
            {receipt.vendors?.trade_name || receipt.vendors?.legal_name}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {receipt.purchase_orders?.po_number ? `PO: ${receipt.purchase_orders.po_number}` : 'Direct Receipt'}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total Inward Value</span>
          <div className="mt-2 font-bold font-mono text-slate-900 text-lg">
            ₹{totalValuation.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {totalReceivedQty} total units received
          </span>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          Received Items Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3 text-right">Ordered Qty</th>
                <th className="py-2.5 px-3 text-right">Received Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Cost</th>
                <th className="py-2.5 px-3 text-right">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((it) => (
                <tr key={it.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {it.products?.product_name}
                    <span className="font-mono text-[10px] text-slate-400 block">
                      {it.products?.product_code}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">
                    {it.products?.sku}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                    {it.ordered_quantity || 0}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                    {it.received_quantity} {it.products?.unit_code || 'PCS'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    ₹{Number(it.unit_cost || 0).toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                    ₹{Number(it.total_cost || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {receipt.notes && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-600 block mb-1">Receipt Remarks:</span>
          <p className="text-xs text-slate-700">{receipt.notes}</p>
        </div>
      )}
    </div>
  );
}
