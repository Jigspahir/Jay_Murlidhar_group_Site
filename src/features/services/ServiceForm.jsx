import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Layers, 
  Tag, 
  IndianRupee, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { BILLING_TYPES, SERVICE_CATEGORIES, SERVICE_STATUSES } from './serviceService';

export default function ServiceForm({
  initialData = null,
  companies = [],
  onSubmit,
  isSubmitting = false,
  isEdit = false
}) {
  const [formData, setFormData] = useState(() => ({
    company_id: '',
    service_name: '',
    description: '',
    category: 'Technology',
    base_price: 0,
    billing_type: 'fixed',
    status: 'active'
  }));

  const [validationError, setValidationError] = useState('');

  // Populate form with initial data when in Edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        company_id: initialData.company_id || '',
        service_name: initialData.service_name || '',
        description: initialData.description || '',
        category: initialData.category || 'Technology',
        base_price: initialData.base_price !== undefined ? initialData.base_price : 0,
        billing_type: initialData.billing_type || 'fixed',
        status: initialData.status || 'active'
      });
    } else if (companies.length > 0) {
      setFormData(prev => (prev.company_id ? prev : { ...prev, company_id: companies[0].id }));
    }
  }, [initialData, companies]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.company_id) {
      setValidationError('Please select a company.');
      return;
    }

    if (!formData.service_name.trim()) {
      setValidationError('Service name is required.');
      return;
    }

    const priceNum = Number(formData.base_price);
    if (isNaN(priceNum) || priceNum < 0) {
      setValidationError('Base price must be 0 or a positive number.');
      return;
    }

    onSubmit({
      ...formData,
      service_name: formData.service_name.trim(),
      description: formData.description.trim(),
      base_price: priceNum
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{validationError}</span>
        </div>
      )}

      {/* SECTION 1: Service Identity & Scope */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Layers className="w-4 h-4 text-blue-600" />
          Service Identity & Classification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Operating Company <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                disabled={isEdit || companies.length <= 1}
                className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Building2 className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Tag className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Service Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="service_name"
              placeholder="e.g. Website Development, GST Registration, Car Insurance"
              value={formData.service_name}
              onChange={handleChange}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Service Description
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Operational details, deliverables, citizen scope, or terms..."
              value={formData.description}
              onChange={handleChange}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Pricing & Commercial Model */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
          <IndianRupee className="w-4 h-4 text-blue-600" />
          Commercial & Billing Model
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Billing Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Billing Type <span className="text-red-500">*</span>
            </label>
            <select
              name="billing_type"
              value={formData.billing_type}
              onChange={handleChange}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {BILLING_TYPES.map((bt) => (
                <option key={bt.value} value={bt.value}>
                  {bt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Base Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Base Price (INR ₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                ₹
              </span>
              <input
                type="number"
                name="base_price"
                min="0"
                step="1"
                placeholder="0"
                value={formData.base_price}
                onChange={handleChange}
                className="w-full pl-7 pr-3 py-2 text-xs font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Default reference rate. Enter 0 for custom quotes or free citizen assistance.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Lifecycle & Status */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileText className="w-4 h-4 text-blue-600" />
          Lifecycle Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {SERVICE_STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Inactive services are hidden from new customer enquiries and public listings.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving Service...' : isEdit ? 'Update Service' : 'Create Service'}
        </button>
      </div>
    </form>
  );
}
