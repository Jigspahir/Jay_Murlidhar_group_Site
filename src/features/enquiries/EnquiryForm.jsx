import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  Layers, 
  HelpCircle, 
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';
import { 
  ENQUIRY_STATUSES, 
  ENQUIRY_PRIORITIES, 
  ENQUIRY_SOURCES,
  getCompanyCustomers 
} from './enquiryService';
import { getCompanyServices } from '../services/serviceService';
import { getAssignableEmployees } from '../customers/customerService';

export default function EnquiryForm({
  initialData = null,
  companies = [],
  onSubmit,
  isSubmitting = false,
  isEdit = false
}) {
  const [formData, setFormData] = useState(() => ({
    company_id: '',
    customer_id: '',
    service_id: '',
    assigned_employee_id: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    subject: '',
    message: '',
    status: 'new',
    priority: 'medium',
    source: 'website'
  }));

  const [validationError, setValidationError] = useState('');

  // Scoped options for the selected company
  const [companyCustomers, setCompanyCustomers] = useState([]);
  const [companyServices, setCompanyServices] = useState([]);
  const [companyEmployees, setCompanyEmployees] = useState([]);
  const [isLoadingDependencies, setIsLoadingDependencies] = useState(false);

  // Populate initial data in edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        company_id: initialData.company_id || '',
        customer_id: initialData.customer_id || '',
        service_id: initialData.service_id || '',
        assigned_employee_id: initialData.assigned_employee_id || '',
        contact_name: initialData.contact_name || '',
        contact_phone: initialData.contact_phone || '',
        contact_email: initialData.contact_email || '',
        subject: initialData.subject || '',
        message: initialData.message || '',
        status: initialData.status || 'new',
        priority: initialData.priority || 'medium',
        source: initialData.source || 'website'
      });
    } else if (companies.length > 0) {
      setFormData(prev => (prev.company_id ? prev : { ...prev, company_id: companies[0].id }));
    }
  }, [initialData, companies]);

  // Reactive dependency loading when company changes
  useEffect(() => {
    async function loadCompanyDependencies() {
      if (!formData.company_id) {
        setCompanyCustomers([]);
        setCompanyServices([]);
        setCompanyEmployees([]);
        return;
      }

      setIsLoadingDependencies(true);
      try {
        const [customers, services, employees] = await Promise.all([
          getCompanyCustomers(formData.company_id),
          getCompanyServices(formData.company_id),
          getAssignableEmployees({ companyId: formData.company_id })
        ]);

        setCompanyCustomers(customers || []);
        setCompanyServices(services || []);
        setCompanyEmployees(employees || []);
      } catch (err) {
        console.warn('Failed to load company scoped dependencies:', err);
      } finally {
        setIsLoadingDependencies(false);
      }
    }

    loadCompanyDependencies();
  }, [formData.company_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle Company Switch: Reset customer, service, and employee if company changed
    if (name === 'company_id' && value !== formData.company_id) {
      setFormData(prev => ({
        ...prev,
        company_id: value,
        customer_id: '',
        service_id: '',
        assigned_employee_id: ''
      }));
      setValidationError('');
      return;
    }

    // Handle Customer Selection: Auto-populate contact fields if an existing customer is selected
    if (name === 'customer_id') {
      const selectedCus = companyCustomers.find(c => c.id === value);
      if (selectedCus) {
        setFormData(prev => ({
          ...prev,
          customer_id: value,
          contact_name: selectedCus.display_name || `${selectedCus.first_name || ''} ${selectedCus.last_name || ''}`.trim() || selectedCus.company_name || prev.contact_name,
          contact_phone: selectedCus.phone || prev.contact_phone,
          contact_email: selectedCus.email || prev.contact_email
        }));
      } else {
        setFormData(prev => ({ ...prev, customer_id: '' }));
      }
      setValidationError('');
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.company_id) {
      setValidationError('Please select an operating company.');
      return;
    }

    if (!formData.contact_name.trim()) {
      setValidationError('Contact name is required.');
      return;
    }

    if (!formData.contact_phone.trim()) {
      setValidationError('Contact phone number is required.');
      return;
    }

    if (!formData.subject.trim()) {
      setValidationError('Subject / Enquiry topic is required.');
      return;
    }

    onSubmit({
      ...formData,
      contact_name: formData.contact_name.trim(),
      contact_phone: formData.contact_phone.trim(),
      contact_email: formData.contact_email ? formData.contact_email.trim() : null,
      subject: formData.subject.trim(),
      message: formData.message ? formData.message.trim() : null,
      customer_id: formData.customer_id || null,
      service_id: formData.service_id || null,
      assigned_employee_id: formData.assigned_employee_id || null
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

      {/* SECTION 1: Scope & Contact Details */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
          <User className="w-4 h-4 text-blue-600" />
          Lead &amp; Contact Details
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

          {/* Existing Customer Link (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link Existing Customer (Optional)
            </label>
            <div className="relative">
              <select
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                disabled={isLoadingDependencies || companyCustomers.length === 0}
                className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50"
              >
                <option value="">Guest Lead (No Linked Customer)</option>
                {companyCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.customer_code} &bull; {c.display_name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.company_name} ({c.phone})
                  </option>
                ))}
              </select>
              <UserCheck className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Selecting an existing client auto-populates contact details.
            </p>
          </div>

          {/* Contact Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contact_name"
              placeholder="e.g. Ramesh Patel, Shanti Traders"
              value={formData.contact_name}
              onChange={handleChange}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                name="contact_phone"
                placeholder="+91 98765 43210"
                value={formData.contact_phone}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Contact Email */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Email (Optional)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                name="contact_email"
                placeholder="client@example.com"
                value={formData.contact_email}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Enquiry Details & Service Focus */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          Enquiry Subject &amp; Requested Service
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Requested Service */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Requested Service (Optional)
            </label>
            <div className="relative">
              <select
                name="service_id"
                value={formData.service_id}
                onChange={handleChange}
                disabled={isLoadingDependencies}
                className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">General Inquiry / Consultation</option>
                {companyServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.service_name} ({s.service_code})
                  </option>
                ))}
              </select>
              <Layers className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lead Source <span className="text-red-500">*</span>
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {ENQUIRY_SOURCES.map((src) => (
                <option key={src.value} value={src.value}>
                  {src.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject / Request Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              placeholder="e.g. Requirement for School Website & Portal, Inquiry regarding Health Insurance renewal"
              value={formData.subject}
              onChange={handleChange}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Message */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Enquiry Notes / Requirements
            </label>
            <textarea
              name="message"
              rows={3}
              placeholder="Details on client needs, budget, preferred timelines, or initial conversation notes..."
              value={formData.message}
              onChange={handleChange}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Assignment & Workflow Status */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileText className="w-4 h-4 text-blue-600" />
          Assignment &amp; Pipeline Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {ENQUIRY_PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Workflow Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {ENQUIRY_STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Employee */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Staff (Optional)
            </label>
            <select
              name="assigned_employee_id"
              value={formData.assigned_employee_id}
              onChange={handleChange}
              disabled={isLoadingDependencies}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">Unassigned</option>
              {companyEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name} ({emp.employee_code})
                </option>
              ))}
            </select>
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
          {isSubmitting ? 'Saving Enquiry...' : isEdit ? 'Update Enquiry' : 'Create Enquiry'}
        </button>
      </div>
    </form>
  );
}
