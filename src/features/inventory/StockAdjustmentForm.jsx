import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sliders, Plus, Trash2, Save, ArrowLeft, Package, Send } from 'lucide-react';
import { ADJUSTMENT_REASONS } from './inventoryService';

export default function StockAdjustmentForm({
  companyId,
  warehouses = [],
  products = [],
  onSubmit,
  isSubmitting = false
}) {
  const navigate = useNavigate();

  const [header, setHeader] = useState({
    warehouse_id: '',
    reason: 'count_difference',
    notes: '',
    submit_now: false
  });

  const [items, setItems] = useState([
    {
      product_id: '',
      current_quantity: 0,
      adjusted_quantity: 0,
      unit_cost: 0,
      notes: ''
    }
  ]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (warehouses && warehouses.length > 0 && !header.warehouse_id) {
      const def = warehouses.find((w) => w.is_default) || warehouses[0];
      setHeader((prev) => ({ ...prev, warehouse_id: def.id }));
    }
  }, [warehouses]);

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };

      if (field === 'product_id') {
        const prod = products.find((p) => p.id === value);
        if (prod) {
          item.unit_cost = prod.purchase_price || 0;
        }
      }

      updated[index] = item;
      return updated;
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        product_id: '',
        current_quantity: 0,
        adjusted_quantity: 0,
        unit_cost: 0,
        notes: ''
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
    if (!header.reason) newErrors.reason = 'Reason is required';

    if (!items || items.length === 0) {
      newErrors.items = 'At least one item is required';
    } else {
      items.forEach((it, idx) => {
        if (!it.product_id) newErrors[`item_${idx}_product`] = 'Product is required';
        if (Number(it.adjusted_quantity) < 0) {
          newErrors[`item_${idx}_qty`] = 'Adjusted quantity cannot be negative';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const adjustmentHeader = {
      company_id: companyId,
      warehouse_id: header.warehouse_id,
      reason: header.reason,
      status: header.submit_now ? 'submitted' : 'draft',
      notes: header.notes || null
    };

    const adjustmentItems = items.map((it) => ({
      product_id: it.product_id,
      current_quantity: Number(it.current_quantity || 0),
      adjusted_quantity: Number(it.adjusted_quantity || 0),
      unit_cost: Number(it.unit_cost || 0),
      notes: it.notes || null
    }));

    onSubmit({
      adjustmentHeader,
      items: adjustmentItems
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          Adjustment Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Target Warehouse <span className="text-rose-500">*</span>
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
              Adjustment Reason <span className="text-rose-500">*</span>
            </label>
            <select
              value={header.reason}
              onChange={(e) => setHeader((prev) => ({ ...prev, reason: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {ADJUSTMENT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Audit Notes & Justification
            </label>
            <textarea
              rows={2}
              value={header.notes}
              onChange={(e) => setHeader((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="e.g. Annual stock-take variance reconciliation or damaged packaging disposal"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Adjustment Items */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            Adjustment Lines
          </h3>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Line
          </button>
        </div>

        <div className="space-y-3">
          {items.map((it, idx) => {
            const diff = Number(it.adjusted_quantity || 0) - Number(it.current_quantity || 0);

            return (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 items-start"
              >
                <div className="md:col-span-4">
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
                        {p.product_code} - {p.product_name}
                      </option>
                    ))}
                  </select>
                  {errors[`item_${idx}_product`] && (
                    <p className="mt-1 text-[10px] text-rose-500">{errors[`item_${idx}_product`]}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Current Qty
                  </label>
                  <input
                    type="number"
                    value={it.current_quantity}
                    onChange={(e) => handleItemChange(idx, 'current_quantity', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    New Count <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={it.adjusted_quantity}
                    onChange={(e) => handleItemChange(idx, 'adjusted_quantity', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  {errors[`item_${idx}_qty`] && (
                    <p className="mt-1 text-[10px] text-rose-500">{errors[`item_${idx}_qty`]}</p>
                  )}
                </div>

                <div className="md:col-span-1">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Diff</label>
                  <div
                    className={`px-2 py-1.5 rounded-lg text-xs font-mono font-semibold text-center ${
                      diff > 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : diff < 0
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {diff > 0 ? `+${diff}` : diff}
                  </div>
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
            );
          })}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => navigate('/admin/inventory/adjustments')}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Cancel
        </button>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            onClick={() => setHeader((prev) => ({ ...prev, submit_now: false }))}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save as Draft
          </button>

          <button
            type="submit"
            onClick={() => setHeader((prev) => ({ ...prev, submit_now: true }))}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </div>
    </form>
  );
}
