import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  getEnquiryById, 
  updateEnquiryStatus, 
  convertEnquiryToCustomer,
  ENQUIRY_STATUSES,
  ENQUIRY_PRIORITIES,
  ENQUIRY_SOURCES
} from '../../features/enquiries';
import { 
  Building2, 
  HelpCircle, 
  ArrowLeft, 
  Edit3, 
  User, 
  Phone, 
  Mail, 
  Layers, 
  Calendar, 
  Clock, 
  UserCheck, 
  ArrowRightCircle, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function EnquiryProfile() {
  const { id } = useParams();
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(PERMISSIONS.ENQUIRIES_EDIT);
  const canCreateCustomer = hasPermission(PERMISSIONS.CUSTOMERS_CREATE);

  const [enquiry, setEnquiry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');
  const [isProcessingStatus, setIsProcessingStatus] = useState(false);

  // Conversion Modal State
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [convertForm, setConvertForm] = useState({
    customer_type: 'individual',
    first_name: '',
    last_name: '',
    company_name: '',
    phone: '',
    email: '',
    city: '',
    state: 'Gujarat',
    address: ''
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEnquiryById(id);
      if (!data) {
        setError(`Enquiry record "${id}" could not be located.`);
      } else {
        setEnquiry(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve enquiry record.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Quick Status Transition
  const handleStatusChange = async (newStatus) => {
    if (!enquiry) return;
    setIsProcessingStatus(true);
    setActionSuccess('');

    try {
      await updateEnquiryStatus(enquiry.id, newStatus);
      setActionSuccess(`Enquiry workflow status updated to "${newStatus.replace('_', ' ')}".`);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to update enquiry status.');
    } finally {
      setIsProcessingStatus(false);
    }
  };

  // Open Convert Modal
  const openConvertModal = () => {
    if (!enquiry) return;

    // Pre-populate name fields
    const nameParts = (enquiry.contact_name || '').trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setConvertForm({
      customer_type: 'individual',
      first_name: firstName,
      last_name: lastName,
      company_name: '',
      phone: enquiry.contact_phone || '',
      email: enquiry.contact_email || '',
      city: '',
      state: 'Gujarat',
      address: ''
    });
    setShowConvertModal(true);
  };

  // Execute Conversion
  const handleExecuteConversion = async (e) => {
    e.preventDefault();
    setIsConverting(true);
    setError(null);
    setActionSuccess('');

    try {
      if (enquiry.customer_id) {
        // Already linked, just mark converted
        await handleStatusChange('converted');
        setShowConvertModal(false);
        return;
      }

      const customerPayload = {
        company_id: enquiry.company_id,
        customer_type: convertForm.customer_type,
        first_name: convertForm.customer_type === 'individual' ? convertForm.first_name.trim() : null,
        last_name: convertForm.customer_type === 'individual' ? convertForm.last_name.trim() : null,
        company_name: convertForm.customer_type === 'business' ? convertForm.company_name.trim() : null,
        phone: convertForm.phone.trim(),
        email: convertForm.email ? convertForm.email.trim() : null,
        city: convertForm.city ? convertForm.city.trim() : null,
        state: convertForm.state || 'Gujarat',
        address: convertForm.address ? convertForm.address.trim() : null,
        assigned_employee_id: enquiry.assigned_employee_id || null,
        notes: `Converted from CRM Enquiry ${enquiry.enquiry_code} (${enquiry.subject})`
      };

      const res = await convertEnquiryToCustomer({
        enquiryId: enquiry.id,
        customerData: customerPayload
      });

      setShowConvertModal(false);
      setActionSuccess('Enquiry successfully converted and customer record registered!');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to convert enquiry to customer.');
    } finally {
      setIsConverting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto my-12 p-12 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
          Loading Enquiry Profile...
        </p>
      </div>
    );
  }

  if (error || !enquiry) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl border border-red-200 text-center shadow-xs">
        <HelpCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h1 className="text-base font-bold text-slate-900">Enquiry Record Not Found</h1>
        <p className="text-xs text-slate-600 mt-1">{error || 'The requested enquiry does not exist or access is restricted.'}</p>
        <Link 
          to="/admin/enquiries" 
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
        >
          Return to Enquiries
        </Link>
      </div>
    );
  }

  const statusMeta = ENQUIRY_STATUSES.find(s => s.value === enquiry.status);
  const priorityMeta = ENQUIRY_PRIORITIES.find(p => p.value === enquiry.priority);
  const sourceLabel = ENQUIRY_SOURCES.find(src => src.value === enquiry.source)?.label || enquiry.source;
  const isConverted = enquiry.status === 'converted';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link 
          to="/admin/enquiries" 
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Enquiries</span>
        </Link>

        <div className="flex items-center gap-2.5">
          {canEdit && (
            <Link
              to={`/admin/enquiries/${enquiry.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-600" />
              <span>Edit Enquiry</span>
            </Link>
          )}

          {canCreateCustomer && !isConverted && (
            <button
              type="button"
              onClick={openConvertModal}
              disabled={isProcessingStatus}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Convert to Customer</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                {enquiry.enquiry_code}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusMeta?.badgeBg || 'bg-slate-100 text-slate-700'}`}>
                Status: {statusMeta?.label || enquiry.status}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${priorityMeta?.color || 'bg-slate-100 text-slate-700'}`}>
                {priorityMeta?.label || enquiry.priority} Priority
              </span>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                Source: {sourceLabel}
              </span>
            </div>

            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {enquiry.subject}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {enquiry.company?.name}
              </span>
              {enquiry.service && (
                <span className="flex items-center gap-1 text-blue-700 font-medium">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  {enquiry.service.service_name} ({enquiry.service.service_code})
                </span>
              )}
            </div>
          </div>

          {/* Linked Customer Badge / Action */}
          {enquiry.customer ? (
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs shrink-0 max-w-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Linked Customer Account
              </div>
              <div className="font-semibold text-slate-900">
                {enquiry.customer.display_name || `${enquiry.customer.first_name || ''} ${enquiry.customer.last_name || ''}`.trim() || enquiry.customer.company_name}
              </div>
              <div className="text-[11px] font-mono text-emerald-700 mt-0.5">
                {enquiry.customer.customer_code} &bull; {enquiry.customer.phone}
              </div>
              <Link
                to={`/admin/customers/${enquiry.customer.id}`}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
              >
                <span>View Customer Profile</span>
                <ArrowRightCircle className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs shrink-0 max-w-xs text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Lead Category</span>
              <span className="font-semibold text-slate-700 block mt-0.5">Guest Inbound Lead</span>
              <span className="text-[11px] text-slate-500 block">Not yet converted to customer</span>
            </div>
          )}
        </div>

        {/* Workflow Progression Controls */}
        {canEdit && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
              Workflow Status Progression
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleStatusChange('contacted')}
                disabled={isProcessingStatus || enquiry.status === 'contacted'}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 cursor-pointer"
              >
                Mark Contacted
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('in_progress')}
                disabled={isProcessingStatus || enquiry.status === 'in_progress'}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 disabled:opacity-40 cursor-pointer"
              >
                Start Work (In Progress)
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('follow_up')}
                disabled={isProcessingStatus || enquiry.status === 'follow_up'}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 disabled:opacity-40 cursor-pointer"
              >
                Schedule Follow-up
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('closed')}
                disabled={isProcessingStatus || enquiry.status === 'closed'}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 cursor-pointer"
              >
                Close / Fulfilled
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('lost')}
                disabled={isProcessingStatus || enquiry.status === 'lost'}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 disabled:opacity-40 cursor-pointer"
              >
                Mark Lost
              </button>
            </div>
          </div>
        )}

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Details */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <h3 className="font-mono text-[10px] uppercase font-bold text-slate-400">
              Contact Information
            </h3>
            <div className="font-bold text-slate-900 text-sm">{enquiry.contact_name}</div>
            <div className="flex items-center gap-1.5 text-slate-600 font-mono">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {enquiry.contact_phone}
            </div>
            {enquiry.contact_email ? (
              <div className="flex items-center gap-1.5 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {enquiry.contact_email}
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 italic">No email provided</div>
            )}
          </div>

          {/* Service & Commercial Focus */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <h3 className="font-mono text-[10px] uppercase font-bold text-slate-400">
              Service Offering Scope
            </h3>
            {enquiry.service ? (
              <>
                <div className="font-bold text-slate-900">{enquiry.service.service_name}</div>
                <div className="text-[11px] text-slate-500 font-mono">Code: {enquiry.service.service_code}</div>
                <div className="text-[11px] text-slate-600">Category: {enquiry.service.category}</div>
                <div className="text-[11px] font-mono text-slate-700 font-semibold">
                  Base Price: ₹{Number(enquiry.service.base_price).toLocaleString('en-IN')} ({enquiry.service.billing_type})
                </div>
              </>
            ) : (
              <div className="text-slate-500 italic py-2">
                General inquiry / consultation with no specific service item tagged.
              </div>
            )}
          </div>

          {/* Assigned Staff */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <h3 className="font-mono text-[10px] uppercase font-bold text-slate-400">
              Assigned Staff Member
            </h3>
            {enquiry.assigned_employee ? (
              <>
                <div className="font-bold text-slate-900">
                  {enquiry.assigned_employee.first_name} {enquiry.assigned_employee.last_name}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {enquiry.assigned_employee.employee_code}
                </div>
                <div className="text-[11px] text-slate-600">
                  {enquiry.assigned_employee.designation || 'Staff Personnel'}
                </div>
                {enquiry.assigned_employee.email && (
                  <div className="text-[11px] text-slate-500">{enquiry.assigned_employee.email}</div>
                )}
              </>
            ) : (
              <div className="text-slate-500 italic py-2">
                Unassigned. Use Edit Enquiry to assign an operational staff member.
              </div>
            )}
          </div>

          {/* Message / Requirement Notes */}
          <div className="md:col-span-3 space-y-2">
            <h3 className="font-mono text-[10px] uppercase font-bold text-slate-400">
              Enquiry Notes &amp; Client Requirement Message
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
              {enquiry.message || 'No additional notes or detailed message logged.'}
            </div>
          </div>
        </div>

        {/* Audit Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-100 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Created: {new Date(enquiry.created_at).toLocaleString('en-IN')}</span>
          </div>
          {enquiry.updated_at && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Last Updated: {new Date(enquiry.updated_at).toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Convert to Customer Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Convert Enquiry to Customer Record
                </h3>
                <p className="text-[11px] text-slate-500">
                  This will register an official customer account in {enquiry.company?.name}.
                </p>
              </div>
            </div>

            <form onSubmit={handleExecuteConversion} className="space-y-4 text-xs">
              {/* Customer Type */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="modal_customer_type"
                    checked={convertForm.customer_type === 'individual'}
                    onChange={() => setConvertForm(prev => ({ ...prev, customer_type: 'individual' }))}
                  />
                  <span>Individual Citizen / Personal</span>
                </label>
                <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="modal_customer_type"
                    checked={convertForm.customer_type === 'business'}
                    onChange={() => setConvertForm(prev => ({ ...prev, customer_type: 'business' }))}
                  />
                  <span>Corporate / Business</span>
                </label>
              </div>

              {convertForm.customer_type === 'individual' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={convertForm.first_name}
                      onChange={(e) => setConvertForm(prev => ({ ...prev, first_name: e.target.value }))}
                      className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Last Name</label>
                    <input
                      type="text"
                      value={convertForm.last_name}
                      onChange={(e) => setConvertForm(prev => ({ ...prev, last_name: e.target.value }))}
                      className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Business / Company Name *</label>
                  <input
                    type="text"
                    required
                    value={convertForm.company_name}
                    onChange={(e) => setConvertForm(prev => ({ ...prev, company_name: e.target.value }))}
                    className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={convertForm.phone}
                    onChange={(e) => setConvertForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full py-1.5 px-2.5 text-xs font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={convertForm.email}
                    onChange={(e) => setConvertForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Surat, Ahmedabad"
                    value={convertForm.city}
                    onChange={(e) => setConvertForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">State</label>
                  <input
                    type="text"
                    value={convertForm.state}
                    onChange={(e) => setConvertForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  disabled={isConverting}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConverting}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isConverting ? 'Creating Customer...' : 'Confirm & Convert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
