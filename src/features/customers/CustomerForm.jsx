import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { 
  CUSTOMER_TYPES, 
  CUSTOMER_STATUSES, 
  INDIAN_STATES,
  getAssignableEmployees 
} from './customerService';

export default function CustomerForm({
  initialData = null,
  companies = [],
  onSubmit,
  isSubmitting = false,
  isEdit = false
}) {
  const [formData, setFormData] = useState(() => ({
    company_id: '',
    customer_type: 'individual',
    first_name: '',
    last_name: '',
    company_name: '',
    phone: '',
    alternate_phone: '',
    email: '',
    tax_id: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    assigned_employee_id: '',
    status: 'active',
    notes: ''
  }));

  const [validationError, setValidationError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Populate form with initial data when in Edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        company_id: initialData.company_id || '',
        customer_type: initialData.customer_type || 'individual',
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        company_name: initialData.company_name || '',
        phone: initialData.phone || '',
        alternate_phone: initialData.alternate_phone || '',
        email: initialData.email || '',
        tax_id: initialData.tax_id || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        postal_code: initialData.postal_code || '',
        country: initialData.country || 'India',
        assigned_employee_id: initialData.assigned_employee_id || '',
        status: initialData.status || 'active',
        notes: initialData.notes || ''
      });
    } else if (companies.length > 0) {
      setFormData(prev => (prev.company_id ? prev : { ...prev, company_id: companies[0].id }));
    }
  }, [initialData, companies]);

  // Load assignable employees for selected company
  useEffect(() => {
    async function loadEmployees() {
      if (!formData.company_id) {
        setEmployees([]);
        return;
      }
      setLoadingEmployees(true);
      try {
        const list = await getAssignableEmployees({ companyId: formData.company_id });
        setEmployees(list || []);
      } catch (err) {
        console.warn('Failed to load assignable employees:', err);
      } finally {
        setLoadingEmployees(false);
      }
    }
    loadEmployees();
  }, [formData.company_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // Validations
    if (!formData.company_id) {
      setValidationError('Please select a company assignment.');
      return;
    }

    if (formData.customer_type === 'individual') {
      if (!formData.first_name.trim()) {
        setValidationError('First name is required for individual customers.');
        return;
      }
    } else if (formData.customer_type === 'business') {
      if (!formData.company_name.trim()) {
        setValidationError('Business / Company name is required for business customers.');
        return;
      }
    }

    if (!formData.phone.trim()) {
      setValidationError('Phone number is required.');
      return;
    }

    const digitsOnly = formData.phone.replace(/\D/g, '');
    if (digitsOnly.length < 7) {
      setValidationError('Please enter a valid phone number with at least 7 digits.');
      return;
    }

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setValidationError('Please enter a valid email address.');
        return;
      }
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Error Notification */}
      {validationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Customer Code banner in Edit mode */}
      {isEdit && initialData?.customer_code && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between text-xs">
          <span className="font-mono text-slate-500">Customer Code (Immutable):</span>
          <span className="font-mono font-bold text-blue-600 text-sm">
            {initialData.customer_code}
          </span>
        </div>
      )}

      {/* 1. IDENTITY & TYPE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <User className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Customer Identity</h2>
        </div>

        {/* Customer Type Toggle */}
        <div>
          <label className="block text-[11px] font-mono text-slate-500 mb-1.5">
            Customer Classification <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            {CUSTOMER_TYPES.map((t) => (
              <label 
                key={t.value} 
                className={`flex items-center gap-2 p-3 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  formData.customer_type === t.value 
                    ? 'border-blue-600 bg-blue-50/60 text-blue-900' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="customer_type"
                  value={t.value}
                  checked={formData.customer_type === t.value}
                  onChange={handleChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                {t.value === 'individual' ? (
                  <User className="w-4 h-4 text-blue-600 shrink-0" />
                ) : (
                  <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
                )}
                <span>{t.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Dynamic Name Fields */}
        {formData.customer_type === 'business' ? (
          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-[11px] font-mono text-slate-500 mb-1">
                Company / Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                required
                value={formData.company_name}
                onChange={handleChange}
                placeholder="e.g. Patel Engineering Works Pvt. Ltd."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-slate-500 mb-1">
                  Contact Person First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-500 mb-1">
                  Contact Person Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="e.g. Patel"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <label className="block text-[11px] font-mono text-slate-500 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                placeholder="e.g. Jigar"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-500 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="e.g. Ahir"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. CONTACT INFORMATION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Phone className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Contact Details</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Primary Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Alternate Phone <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="tel"
              name="alternate_phone"
              value={formData.alternate_phone}
              onChange={handleChange}
              placeholder="e.g. 0261-2345678"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Email Address <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="client@example.com"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-500 mb-1">
            Tax / Registration ID <span className="text-slate-400 font-normal">(GSTIN / PAN / Udyam — Optional)</span>
          </label>
          <input
            type="text"
            name="tax_id"
            value={formData.tax_id}
            onChange={handleChange}
            placeholder="e.g. 24AAACJ1234F1Z5 or ABCDE1234F"
            className="w-full sm:w-1/2 px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500 font-mono uppercase"
          />
        </div>
      </div>

      {/* 3. COMPANY ASSIGNMENT & ACCOUNT MANAGER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Briefcase className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Company &amp; Account Assignment</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Operating Company <span className="text-red-500">*</span>
            </label>
            <select
              name="company_id"
              required
              disabled={isEdit}
              value={formData.company_id}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {isEdit && (
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                Company cannot be changed after creation.
              </span>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Assigned Employee {loadingEmployees && <span className="text-slate-400 font-normal">(loading...)</span>}
            </label>
            <select
              name="assigned_employee_id"
              value={formData.assigned_employee_id}
              onChange={handleChange}
              disabled={loadingEmployees || !formData.company_id}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">No Direct Manager Assigned</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name} ({emp.employee_code} &bull; {emp.designation || 'Staff'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
            >
              {CUSTOMER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. ADDRESS INFORMATION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <MapPin className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Address Details</h2>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-500 mb-1">
            Street Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g. Shop 12, Jan Suvidha Complex, Ring Road"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Surat"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              State
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              placeholder="e.g. 395003"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="India"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 5. NOTES & SUMMARY */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <FileText className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Notes &amp; Internal Information</h2>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-500 mb-1">
            Internal Account Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Special customer preferences, corporate history, or specific operational directives..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500 resize-y"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
        >
          {isSubmitting 
            ? (isEdit ? 'Saving Changes...' : 'Registering Customer...') 
            : (isEdit ? 'Update Customer' : 'Register Customer')}
        </button>
      </div>

    </form>
  );
}
