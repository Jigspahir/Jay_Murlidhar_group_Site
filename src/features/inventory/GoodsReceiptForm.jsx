import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Plus, Trash2, Save, ArrowLeft, AlertCircle, CheckCircle, Package } from 'lucide-react';

export default function GoodsReceiptForm({
  companyId,
  warehouses = [],
  vendors = [],
  purchaseOrders = [],
  products = [],
  onSubmit,
  isSubmitting = false
}) {
  const navigate = useNavigate();

  const [header, setHeader] = useState({
    warehouse_id: '',
    vendor_id: '',
    purchase_order_id: '',
    receipt_date: new Date().toISOString().split('T')[0],
    notes: '',
    receive_immediately: true
  });

  const [items, setItems] = useState([
    {
      product_id: '',
      purchase_order_item_id: null,
      ordered_quantity: 0,
      received_quantity: 1,
      unit_cost: 0,
      batch_number: '',
      serials: [] // array of strings for serialized products
    }
  ]);

  const [errors, setErrors] = useState({});

  // Auto-set default warehouse
  useEffect(() => {
    if (warehouses && warehouses.length > 0 && !header.warehouse_id) {
      const def = warehouses.find((w) => w.is_default) || warehouses[0];
      setHeader((prev) => ({ ...prev, warehouse_id: def.id }));
    }
  }, [warehouses]);

  // Handle PO selection
  const handlePOChange = (poId) => {
    setHeader((prev) => ({ ...prev, purchase_order_id: poId }));
    if (!poId) return;

    const selectedPO = purchaseOrders.find((p) => p.id === poId);
    if (selectedPO) {
      if (selectedPO.vendor_id) {
        setHeader((prev) => ({ ...prev, vendor_id: selectedPO.vendor_id }));
      }
      // Populate items from PO product lines if available
      if (selectedPO.items && selectedPO.items.length > 0) {
        const prodItems = selectedPO.items.filter((it) => it.product_id);
        if (prodItems.length > 0) {
          setItems(
            prodItems.map((it) => ({
              product_id: it.product_id,
              purchase_order_item_id: it.id,
              ordered_quantity: it.quantity,
              received_quantity: Math.max(1, it.quantity - (it.received_quantity || 0)),
              unit_cost: it.unit_price || 0,
              batch_number: '',
              serials: []
            }))
          );
        }
      }
    }
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };

      if (field === 'product_id') {
        const prod = products.find((p) => p.id === value);
        if (prod) {
          item.unit_cost = prod.purchase_price || 0;
          item.is_serialized = Boolean(prod.is_serialized);
        }
      }

      updated[index] = item;
      return updated;
    });
  };

  const handleSerialsChange = (index, text) => {
    const lines = text
      .split('\n')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], serials: lines };
      return updated;
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        product_id: '',
        purchase_order_item_id: null,
        ordered_quantity: 0,
        received_quantity: 1,
        unit_cost: 0,
        batch_number: '',
        serials: []
      }
    ]);
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!header.warehouse_id) newErrors.warehouse_id = 'Warehouse is required';
    if (!header.vendor_id) newErrors.vendor_id = 'Vendor is required';
    if (!header.receipt_date) newErrors.receipt_date = 'Receipt date is required';

    if (!items || items.length === 0) {
      newErrors.items = 'At least one line item is required';
    } else {
      items.forEach((it, idx) => {
        if (!it.product_id) {
          newErrors[`item_${idx}_product`] = 'Product is required';
        }
        if (Number(it.received_quantity) <= 0) {
          newErrors[`item_${idx}_qty`] = 'Quantity must be positive';
        }
        const prod = products.find((p) => p.id === it.product_id);
        if (prod && prod.is_serialized) {
          const serialCount = (it.serials || []).length;
          if (serialCount !== Number(it.received_quantity)) {
            newErrors[`item_${idx}_serials`] = `Expected ${it.received_quantity} serial numbers, got ${serialCount}`;
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const grnHeader = {
      company_id: companyId,
      warehouse_id: header.warehouse_id,
      vendor_id: header.vendor_id,
      purchase_order_id: header.purchase_order_id || null,
      receipt_date: header.receipt_date,
      status: header.receive_immediately ? 'received' : 'draft',
      notes: header.notes || null
    };

    const grnItems = items.map((it) => ({
      product_id: it.product_id,
      purchase_order_item_id: it.purchase_order_item_id || null,
      ordered_quantity: Number(it.ordered_quantity || 0),
      received_quantity: Number(it.received_quantity),
      unit_cost: Number(it.unit_cost || 0),
      batch_number: it.batch_number || null,
      serials: it.serials || []
    }));

    onSubmit({
      grnHeader,
      items: grnItems,
      receiveImmediately: header.receive_immediately
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-600" />
          Receipt Header Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Destination Warehouse <span className="text-rose-500">*</span>
            </label>
            <select
              value={header.warehouse_id}
              onChange={(e) => setHeader((prev) => ({ ...prev, warehouse_id: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">-- Select Warehouse --</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.warehouse_name} {w.is_default ? '(Default)' : ''}
                </option>
              ))}
            </select>
            {errors.warehouse_id && (
              <p className="mt-1 text-[11px] text-rose-500">{errors.warehouse_id}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Vendor / Supplier <span className="text-rose-500">*</span>
            </label>
            <select
              value={header.vendor_id}
              onChange={(e) => setHeader((prev) => ({ ...prev, vendor_id: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">-- Select Vendor --</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.trade_name || v.legal_name}
                </option>
              ))}
            </select>
            {errors.vendor_id && (
              <p className="mt-1 text-[11px] text-rose-500">{errors.vendor_id}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Purchase Order (Optional)
            </label>
            <select
              value={header.purchase_order_id}
              onChange={(e) => handlePOChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">-- Direct Receipt (No PO) --</option>
              {purchaseOrders.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.po_number} ({po.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Receipt Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={header.receipt_date}
              onChange={(e) => setHeader((prev) => ({ ...prev, receipt_date: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">Notes / Remarks</label>
            <input
              type="text"
              value={header.notes}
              onChange={(e) => setHeader((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="e.g. Challan No. 4481, Carrier BlueDart"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            Received Product Items
          </h3>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((it, idx) => {
            const prod = products.find((p) => p.id === it.product_id);
            const isSerialized = Boolean(prod?.is_serialized);

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  <div className="md:col-span-5">
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Product <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={it.product_id}
                      onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="">-- Select Product --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.product_code} - {p.product_name} ({p.sku})
                        </option>
                      ))}
                    </select>
                    {errors[`item_${idx}_product`] && (
                      <p className="mt-1 text-[10px] text-rose-500">{errors[`item_${idx}_product`]}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Received Qty <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={it.received_quantity}
                      onChange={(e) => handleItemChange(idx, 'received_quantity', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    {errors[`item_${idx}_qty`] && (
                      <p className="mt-1 text-[10px] text-rose-500">{errors[`item_${idx}_qty`]}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Unit Cost (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={it.unit_cost}
                      onChange={(e) => handleItemChange(idx, 'unit_cost', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Total Cost (₹)
                    </label>
                    <div className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-700">
                      ₹{(Number(it.received_quantity || 0) * Number(it.unit_cost || 0)).toFixed(2)}
                    </div>
                  </div>

                  <div className="md:col-span-1 flex justify-end pt-5">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      disabled={items.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Serial Numbers entry if product is serialized */}
                {isSerialized && (
                  <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-semibold text-purple-900">
                        Enter IMEI / Serial Numbers (One per line)
                      </label>
                      <span className="text-[10px] font-mono text-purple-700">
                        Entered: {(it.serials || []).length} / {it.received_quantity}
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={(it.serials || []).join('\n')}
                      onChange={(e) => handleSerialsChange(idx, e.target.value)}
                      placeholder="e.g.&#10;IMEI890123456789012&#10;IMEI890123456789013"
                      className="w-full px-2.5 py-1.5 bg-white border border-purple-300 rounded-md text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                    />
                    {errors[`item_${idx}_serials`] && (
                      <p className="mt-1 text-[11px] text-rose-600 font-medium">
                        {errors[`item_${idx}_serials`]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Immediate Stock In Switch */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-800">Receive Stock Immediately</h4>
          <p className="text-[11px] text-slate-500">
            Automatically increments warehouse inventory balances and adds immutable purchase receipt movements.
          </p>
        </div>
        <input
          type="checkbox"
          checked={header.receive_immediately}
          onChange={(e) => setHeader((prev) => ({ ...prev, receive_immediately: e.target.checked }))}
          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
        />
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => navigate('/admin/inventory/receipts')}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          {isSubmitting
            ? 'Processing...'
            : header.receive_immediately
            ? 'Receive & Post Stock'
            : 'Save as Draft'}
        </button>
      </div>
    </form>
  );
}
