import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Warehouse, Save, ArrowLeft } from 'lucide-react';

export default function WarehouseForm({
  initialData = null,
  companyId,
  isEdit = false,
  onSubmit,
  isSubmitting = false
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    warehouse_name: '',
    address: '',
    is_default: false,
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        warehouse_name: initialData.warehouse_name || '',
        address: initialData.address || '',
        is_default: Boolean(initialData.is_default),
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
    if (!formData.warehouse_name.trim()) newErrors.warehouse_name = 'Warehouse name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      company_id: companyId
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Warehouse className="w-4 h-4 text-blue-600" />
          Warehouse Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Warehouse / Location Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="warehouse_name"
              value={formData.warehouse_name}
              onChange={handleChange}
              placeholder="e.g. Main Showroom & Store, Godown A"
              className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                errors.warehouse_name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {errors.warehouse_name && (
              <p className="mt-1 text-[11px] text-rose-500">{errors.warehouse_name}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Physical Address / Location
            </label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address of the storage facility or counter..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-800">
                Set as Default Warehouse for this Company
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => navigate('/admin/warehouses')}
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
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Warehouse' : 'Create Warehouse'}
        </button>
      </div>
    </form>
  );
}
