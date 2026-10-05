import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  getCustomerById, 
  deactivateCustomer, 
  reactivateCustomer 
} from '../../features/customers/customerService';
import { 
  Building2, 
  User, 
  ArrowLeft, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  FileText
} from 'lucide-react';

export default function CustomerProfile() {
  const { id } = useParams();
  const { hasPermission } = usePermissions();

  const canEdit = hasPermission(PERMISSIONS.CUSTOMERS_EDIT);
  const canDelete = hasPermission(PERMISSIONS.CUSTOMERS_DELETE);

  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');
  const [isProcessingStatus, setIsProcessingStatus] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCustomerById(id);
      if (!data) {
        setError(`Customer record "${id}" could not be located.`);
      } else {
        setCustomer(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve customer record.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleStatus = async () => {
    if (!customer) return;
    setIsProcessingStatus(true);
    setActionSuccess('');

    try {
      if (customer.status === 'active') {
        await deactivateCustomer(customer.id);
        setActionSuccess('Customer record deactivated successfully.');
      } else {
        await reactivateCustomer(customer.id);
        setActionSuccess('Customer record reactivated successfully.');
      }
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to update customer status.');
    } finally {
      setIsProcessingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto my-12 p-12 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
          Loading Customer Profile...
        </p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl border border-red-200 text-center shadow-xs">
        <Building2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h1 className="text-base font-bold text-slate-900">Customer Record Not Found</h1>
        <p className="text-xs text-slate-600 mt-1">{error || 'The requested customer does not exist or access is restricted.'}</p>
        <Link 
          to="/admin/customers" 
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
        >
          Return to Customer Directory
        </Link>
      </div>
    );
  }

  const isBusiness = customer.customer_type === 'business';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            to="/admin/customers"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Directory</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
              {customer.customer_code}
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold ${
              isBusiness 
                ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {isBusiness ? 'Business Account' : 'Individual Client'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <Link
              to={`/admin/customers/${customer.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </Link>
          )}

          {canDelete && (
            <button
              onClick={handleToggleStatus}
              disabled={isProcessingStatus}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
                customer.status === 'active'
                  ? 'border border-red-200 hover:bg-red-50 text-red-600'
                  : 'border border-emerald-200 hover:bg-emerald-50 text-emerald-700 bg-emerald-50/50'
              }`}
            >
              {customer.status === 'active' ? (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{isProcessingStatus ? 'Processing...' : 'Deactivate'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isProcessingStatus ? 'Processing...' : 'Reactivate'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Customer Header Identity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 ${
              isBusiness ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {isBusiness ? <Building2 className="w-8 h-8" /> : <User className="w-8 h-8" />}
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {customer.display_name}
                </h1>
                {customer.status === 'active' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-300 text-[10px] font-bold">
                    <XCircle className="w-3 h-3 text-slate-400" />
                    Inactive
                  </span>
                )}
              </div>

              {isBusiness && customer.first_name && (
                <p className="text-xs text-slate-500 mt-1">
                  Primary Contact Person:{' '}
                  <strong className="text-slate-700 font-medium">
                    {customer.first_name} {customer.last_name}
                  </strong>
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  {customer.phone}
                </span>

                {customer.email && (
                  <span className="flex items-center gap-1 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    {customer.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Operating Company Tag */}
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Operating Company
            </span>
            <span className="text-xs font-bold text-slate-800 block">
              {customer.company?.name || 'Unassigned'}
            </span>
            {customer.company?.legal_name && (
              <span className="text-[10px] text-slate-500 block">
                {customer.company.legal_name}
              </span>
            )}
          </div>
        </div>

        {/* Core Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 text-xs">
          
          {/* Tax / Registration ID */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
              Tax / Registration ID
            </span>
            {customer.tax_id ? (
              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">
                {customer.tax_id}
              </span>
            ) : (
              <span className="text-slate-400 italic font-mono">Not Provided</span>
            )}
          </div>

          {/* Alternate Phone */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
              Alternate Phone
            </span>
            {customer.alternate_phone ? (
              <span className="font-mono text-slate-800">{customer.alternate_phone}</span>
            ) : (
              <span className="text-slate-400 italic font-mono">—</span>
            )}
          </div>

          {/* Location */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
              City / State
            </span>
            <span className="text-slate-800 font-medium">
              {[customer.city, customer.state].filter(Boolean).join(', ') || (
                <span className="text-slate-400 italic font-mono">Not Provided</span>
              )}
            </span>
          </div>

          {/* Account Onboarded Date */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
              Account Created
            </span>
            <span className="text-slate-800 font-mono">
              {new Date(customer.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>

        </div>
      </div>

      {/* Grid: 2 Columns for Account Manager & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Account Manager / Assigned Employee Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Assigned Account Manager</h2>
          </div>

          {customer.assigned_employee ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {customer.assigned_employee.first_name[0]}
                  {customer.assigned_employee.last_name[0]}
                </div>
                <div>
                  <Link
                    to={`/admin/employees/${customer.assigned_employee.id}`}
                    className="font-bold text-sm text-slate-900 hover:text-blue-600 block"
                  >
                    {customer.assigned_employee.first_name} {customer.assigned_employee.last_name}
                  </Link>
                  <span className="text-xs text-slate-500 font-mono">
                    {customer.assigned_employee.designation || 'Staff Executive'} &bull; {customer.assigned_employee.employee_code}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                {customer.assigned_employee.department && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Department:</span>
                    <span className="font-medium text-slate-800">{customer.assigned_employee.department}</span>
                  </div>
                )}
                {customer.assigned_employee.email && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-mono text-slate-800">{customer.assigned_employee.email}</span>
                  </div>
                )}
                {customer.assigned_employee.phone && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-mono text-slate-800">{customer.assigned_employee.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-xs text-slate-500 italic">
                No internal staff member or relationship manager is assigned to this account.
              </p>
              {canEdit && (
                <Link
                  to={`/admin/customers/${customer.id}/edit`}
                  className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:underline"
                >
                  Assign Account Manager &rarr;
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Address Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Billing &amp; Registered Address</h2>
          </div>

          <div className="text-xs space-y-2 text-slate-700">
            {customer.address ? (
              <p className="leading-relaxed whitespace-pre-line font-medium text-slate-800">
                {customer.address}
              </p>
            ) : (
              <p className="text-slate-400 italic">No street address recorded.</p>
            )}

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">City</span>
                <span className="font-medium text-slate-800">{customer.city || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">State</span>
                <span className="font-medium text-slate-800">{customer.state || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Postal Code</span>
                <span className="font-mono text-slate-800">{customer.postal_code || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Country</span>
                <span className="font-medium text-slate-800">{customer.country || 'India'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Internal Notes Card */}
      {customer.notes && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Internal Account Notes</h2>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pt-1">
            {customer.notes}
          </p>
        </div>
      )}

      {/* Audit Metadata Strip */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
        <div>
          Record ID: <span className="text-slate-600">{customer.id}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Created: {new Date(customer.created_at).toLocaleString('en-IN')}</span>
          <span>Updated: {new Date(customer.updated_at).toLocaleString('en-IN')}</span>
        </div>
      </div>

    </div>
  );
}
