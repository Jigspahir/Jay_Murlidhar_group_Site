import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Save, ArrowLeft, AlertCircle, Info, Layers, Tag, ShieldCheck } from 'lucide-react';
import { PRODUCT_STATUSES, COMMON_UOMS } from './inventoryService';

export default function ProductForm({
  initialData = null,
  categories = [],
  companyId,
  isEdit = false,
  onSubmit,
  isSubmitting = false
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    product_name: '',
    sku: '',
    barcode: '',
    description: '',
    category_id: '',
    unit_code: 'PCS',
    brand: '',
    model: '',
    hsn_code: '',
    tax_rate: 18,
    purchase_price: 0,
    selling_price: 0,
    mrp: 0,
    reorder_level: 5,
    min_stock_level: 2,
    is_serialized: false,
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        product_name: initialData.product_name || '',
        sku: initialData.sku || '',
        barcode: initialData.barcode || '',
        description: initialData.description || '',
        category_id: initialData.category_id || '',
        unit_code: initialData.unit_code || 'PCS',
        brand: initialData.brand || '',
        model: initialData.model || '',
        hsn_code: initialData.hsn_code || '',
        tax_rate: initialData.tax_rate !== undefined ? initialData.tax_rate : 18,
        purchase_price: initialData.purchase_price || 0,
        selling_price: initialData.selling_price || 0,
        mrp: initialData.mrp || 0,
        reorder_level: initialData.reorder_level !== undefined ? initialData.reorder_level : 5,
        min_stock_level: initialData.min_stock_level !== undefined ? initialData.min_stock_level : 2,
        is_serialized: Boolean(initialData.is_serialized),
        status: initialData.status || 'active'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.product_name.trim()) newErrors.product_name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.unit_code) newErrors.unit_code = 'Unit of measure is required';
    if (Number(formData.purchase_price) < 0) newErrors.purchase_price = 'Purchase price cannot be negative';
    if (Number(formData.selling_price) < 0) newErrors.selling_price = 'Selling price cannot be negative';
    if (Number(formData.mrp) < 0) newErrors.mrp = 'MRP cannot be negative';
    if (Number(formData.tax_rate) < 0) newErrors.tax_rate = 'Tax rate cannot be negative';
    if (Number(formData.reorder_level) < 0) newErrors.reorder_level = 'Reorder level cannot be negative';
    if (Number(formData.min_stock_level) < 0) newErrors.min_stock_level = 'Minimum stock level cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      company_id: companyId,
      tax_rate: Number(formData.tax_rate),
      purchase_price: Number(formData.purchase_price),
      selling_price: Number(formData.selling_price),
      mrp: Number(formData.mrp),
      reorder_level: Number(formData.reorder_level),
      min_stock_level: Number(formData.min_stock_level),
      category_id: formData.category_id || null
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Primary Details Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          General Identification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              placeholder="e.g. Samsung Galaxy S24 Ultra 256GB"
              className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium ${
                errors.product_name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {errors.product_name && (
              <p className="mt-1 text-[11px] text-rose-500">{errors.product_name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              SKU (Stock Keeping Unit) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g. SAM-S24U-256"
              className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                errors.sku ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {errors.sku && <p className="mt-1 text-[11px] text-rose-500">{errors.sku}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Category
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">-- No Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Unit of Measure (UOM) <span className="text-rose-500">*</span>
            </label>
            <select
              name="unit_code"
              value={formData.unit_code}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {COMMON_UOMS.map((u) => (
                <option key={u.unit_code} value={u.unit_code}>
                  {u.unit_code} - {u.unit_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Barcode / EAN
            </label>
            <input
              type="text"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="e.g. 8901234567890"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. Samsung, Apple, HP"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g. S24 Ultra"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {PRODUCT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Description / Specs
            </label>
            <textarea
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional technical specifications or warranty notes..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Pricing & GST Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-600" />
          Pricing & Tax Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Purchase Price (₹)
            </label>
            <input
              type="number"
              step="0.01"
              name="purchase_price"
              value={formData.purchase_price}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Selling Price (₹)
            </label>
            <input
              type="number"
              step="0.01"
              name="selling_price"
              value={formData.selling_price}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              MRP (Maximum Retail Price ₹)
            </label>
            <input
              type="number"
              step="0.01"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              HSN Code
            </label>
            <input
              type="text"
              name="hsn_code"
              value={formData.hsn_code}
              onChange={handleChange}
              placeholder="e.g. 8517"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              GST Rate (%)
            </label>
            <select
              name="tax_rate"
              value={formData.tax_rate}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="0">0% (Nil / Exempt)</option>
              <option value="5">5% GST</option>
              <option value="12">12% GST</option>
              <option value="18">18% GST (Standard)</option>
              <option value="28">28% GST</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Control & Serial Tracking */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          Inventory Controls & Tracking
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Reorder Warning Level
            </label>
            <input
              type="number"
              name="reorder_level"
              value={formData.reorder_level}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Triggers low stock badge on dashboard</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Minimum Safety Stock
            </label>
            <input
              type="number"
              name="min_stock_level"
              value={formData.min_stock_level}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_serialized"
                checked={formData.is_serialized}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-800">
                Track IMEI / Serial Numbers
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
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
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
