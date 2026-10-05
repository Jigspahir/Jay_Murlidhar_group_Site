import React, { useState, useEffect } from 'react';
import { 
  User, 
  Briefcase, 
  MapPin, 
  FileText, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { 
  EMPLOYMENT_TYPES, 
  EMPLOYEE_STATUSES, 
  STANDARD_DEPARTMENTS, 
  STANDARD_DESIGNATIONS,
  getPotentialManagers 
} from './employeeService';

export default function EmployeeForm({
  initialData = null,
  companies = [],
  onSubmit,
  isSubmitting = false,
  isEdit = false
}) {
  const [formData, setFormData] = useState(() => ({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    alternate_phone: '',
    date_of_birth: '',
    gender: 'prefer_not_to_say',
    company_id: '',
    department: 'Engineering & IT',
    designation: 'Senior Software Engineer',
    employment_type: 'full_time',
    joining_date: new Date().toISOString().split('T')[0],
    reporting_manager_id: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    profile_photo_url: '',
    status: 'active',
    notes: ''
  }));

  const [validationError, setValidationError] = useState('');
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  // Populate form with initial data when in Edit mode
  useEffect(() => {
    if (initialData) {
      const primaryAssignment = initialData.assignments?.find(a => a.is_primary && a.is_active) 
        || initialData.assignments?.[0];

      setFormData({
        first_name: initialData.first_name || '',
        middle_name: initialData.middle_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        alternate_phone: initialData.alternate_phone || '',
        date_of_birth: initialData.date_of_birth || '',
        gender: initialData.gender || 'prefer_not_to_say',
        company_id: primaryAssignment?.company_id || '',
        department: initialData.department || primaryAssignment?.department || 'Engineering & IT',
        designation: initialData.designation || primaryAssignment?.designation || 'Senior Software Engineer',
        employment_type: initialData.employment_type || primaryAssignment?.employment_type || 'full_time',
        joining_date: initialData.joining_date || new Date().toISOString().split('T')[0],
        reporting_manager_id: initialData.reporting_manager_id || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        postal_code: initialData.postal_code || '',
        profile_photo_url: initialData.profile_photo_url || '',
        status: initialData.status || 'active',
        notes: initialData.notes || ''
      });
    } else if (companies.length > 0) {
      setFormData(prev => (prev.company_id ? prev : { ...prev, company_id: companies[0].id }));
    }
  }, [initialData, companies]);

  // Load potential managers
  useEffect(() => {
    async function loadManagers() {
      setLoadingManagers(true);
      try {
        const potential = await getPotentialManagers({
          companyId: formData.company_id,
          excludeEmployeeId: initialData?.id
        });
        setManagers(potential || []);
      } catch (err) {
        console.warn('Failed to load managers:', err);
      } finally {
        setLoadingManagers(false);
      }
    }
    loadManagers();
  }, [formData.company_id, initialData?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // Validations
    if (!formData.first_name.trim()) {
      setValidationError('First name is required.');
      return;
    }
    if (!formData.last_name.trim()) {
      setValidationError('Last name is required.');
      return;
    }
    if (!isEdit && !formData.company_id) {
      setValidationError('Please select a company assignment.');
      return;
    }
    if (!formData.joining_date) {
      setValidationError('Joining date is required.');
      return;
    }

    // Email format validation if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setValidationError('Please provide a valid email address.');
      return;
    }

    // Reporting manager cannot be self
    if (initialData?.id && formData.reporting_manager_id === initialData.id) {
      setValidationError('An employee cannot be selected as their own reporting manager.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {validationError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{validationError}</span>
        </div>
      )}

      {/* 1. PERSONAL INFORMATION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <User className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Personal Information</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
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
              placeholder="e.g. Ramesh"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Middle Name
            </label>
            <input
              type="text"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              placeholder="e.g. Kumar"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="last_name"
              required
              value={formData.last_name}
              onChange={handleChange}
              placeholder="e.g. Patel"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Official Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ramesh@jaymurlidhargroup.co.in"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Primary Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Alternate Phone
            </label>
            <input
              type="tel"
              name="alternate_phone"
              value={formData.alternate_phone}
              onChange={handleChange}
              placeholder="+91 91234 56789"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. EMPLOYMENT INFORMATION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Briefcase className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Employment &amp; Company Assignment</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {!isEdit && (
            <div>
              <label className="block text-[11px] font-mono text-slate-500 mb-1">
                Primary Company <span className="text-red-500">*</span>
              </label>
              <select
                name="company_id"
                required
                value={formData.company_id}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Company Assignment</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <select
              name="employment_type"
              required
              value={formData.employment_type}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
            >
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Department
            </label>
            <input
              type="text"
              name="department"
              list="department-options"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Engineering &amp; IT"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
            <datalist id="department-options">
              {STANDARD_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Designation / Role Title
            </label>
            <input
              type="text"
              name="designation"
              list="designation-options"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g. Senior Software Engineer"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
            <datalist id="designation-options">
              {STANDARD_DESIGNATIONS.map((desig) => (
                <option key={desig} value={desig} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Joining Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="joining_date"
              required
              value={formData.joining_date}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Reporting Manager {loadingManagers && <span className="text-slate-400 font-normal">(loading...)</span>}
            </label>
            <select
              name="reporting_manager_id"
              value={formData.reporting_manager_id}
              onChange={handleChange}
              disabled={loadingManagers}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">No Direct Manager (Top Level)</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.first_name} {m.last_name} ({m.employee_code} &bull; {m.designation || 'Staff'})
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
              {EMPLOYEE_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. RESIDENTIAL & CONTACT ADDRESS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <MapPin className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Residential Address</h2>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Street Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Plot No., Building Name, Street"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-500 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ahmedabad"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-500 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Gujarat"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
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
                placeholder="380001"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. PROFILE & INTERNAL NOTES */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <FileText className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Profile Metadata &amp; Notes</h2>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Profile Photo URL (Optional)
            </label>
            <input
              type="url"
              name="profile_photo_url"
              value={formData.profile_photo_url}
              onChange={handleChange}
              placeholder="https://example.com/photos/avatar.jpg"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">
              Internal Administrative Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Confidential operational notes, emergency contacts, or certifications..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Saving Employee...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEdit ? 'Save Changes' : 'Register Employee'}</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}
