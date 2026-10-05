import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  getEmployeeById, 
  assignEmployeeToCompany, 
  removeEmployeeCompanyAssignment,
  setPrimaryCompanyAssignment,
  deactivateEmployee,
  reactivateEmployee
} from '../../features/employees/employeeService';
import { 
  Building2, 
  ArrowLeft, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Star,
  Briefcase,
  Mail
} from 'lucide-react';

export default function EmployeeProfile() {
  const { employeeId } = useParams();
  const { availableCompanies } = useCompany();
  const { hasPermission } = usePermissions();

  const canEdit = hasPermission(PERMISSIONS.EMPLOYEES_EDIT);
  const canDelete = hasPermission(PERMISSIONS.EMPLOYEES_DELETE);

  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  // Modal State for adding company assignment
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignCompanyId, setAssignCompanyId] = useState('');
  const [assignDesignation, setAssignDesignation] = useState('');
  const [assignDepartment, setAssignDepartment] = useState('');
  const [assignIsPrimary, setAssignIsPrimary] = useState(false);
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
  const [assignError, setAssignError] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEmployeeById(employeeId);
      if (!data) {
        setError(`Employee record "${employeeId}" could not be located.`);
      } else {
        setEmployee(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve employee record.');
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Add Company Assignment
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    setAssignError('');
    if (!assignCompanyId) {
      setAssignError('Please select a company.');
      return;
    }

    setIsSubmittingAssignment(true);
    try {
      await assignEmployeeToCompany({
        employee_id: employee.id,
        company_id: assignCompanyId,
        designation: assignDesignation || employee.designation,
        department: assignDepartment || employee.department,
        is_primary: assignIsPrimary
      });

      setShowAssignModal(false);
      setAssignCompanyId('');
      setAssignDesignation('');
      setAssignDepartment('');
      setAssignIsPrimary(false);
      setActionSuccess('Company assignment successfully added.');
      await loadData();
    } catch (err) {
      setAssignError(err.message || 'Failed to add company assignment.');
    } finally {
      setIsSubmittingAssignment(false);
    }
  };

  // Toggle Primary Assignment
  const handleSetPrimary = async (assignmentId) => {
    setActionSuccess('');
    try {
      await setPrimaryCompanyAssignment(employee.id, assignmentId);
      setActionSuccess('Primary company assignment updated.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to set primary company.');
    }
  };

  // Deactivate Assignment
  const handleRemoveAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to deactivate this company assignment?')) {
      return;
    }

    setActionSuccess('');
    try {
      await removeEmployeeCompanyAssignment(assignmentId);
      setActionSuccess('Company assignment deactivated.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to deactivate assignment.');
    }
  };

  // Status Toggle (Active/Inactive)
  const handleToggleStatus = async () => {
    if (employee.status === 'active') {
      if (!window.confirm('Deactivate this employee? They will no longer appear in default active lists.')) {
        return;
      }
      await deactivateEmployee(employee.id);
      setActionSuccess('Employee has been deactivated.');
    } else {
      await reactivateEmployee(employee.id);
      setActionSuccess('Employee has been reactivated.');
    }
    await loadData();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-7 h-7 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="font-mono text-xs text-slate-500 uppercase tracking-wider">
          Loading employee profile...
        </p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl border border-red-200 text-center shadow-xs">
        <Building2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Record Unavailable</h2>
        <p className="text-xs text-slate-500 mt-1">{error || 'Employee record could not be retrieved.'}</p>
        <Link 
          to="/admin/employees" 
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
        >
          Return to Directory
        </Link>
      </div>
    );
  }

  const primaryAssignment = employee.assignments?.find(a => a.is_primary && a.is_active) 
    || employee.assignments?.[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <Link 
          to="/admin/employees" 
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Employee Directory</span>
        </Link>

        <div className="flex items-center gap-2.5">
          {canEdit && (
            <Link
              to={`/admin/employees/${employee.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Link>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={handleToggleStatus}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                employee.status === 'active'
                  ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {employee.status === 'active' ? (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Deactivate</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Reactivate</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setActionSuccess('')} 
            className="text-xs text-emerald-600 hover:text-emerald-900 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Profile Card Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {employee.profile_photo_url ? (
              <img 
                src={employee.profile_photo_url} 
                alt={employee.full_name} 
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" 
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-2xl shrink-0">
                {employee.first_name?.charAt(0)}{employee.last_name?.charAt(0)}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {employee.full_name}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {employee.employee_code}
                </span>
                {employee.status === 'active' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold">
                    <XCircle className="w-3 h-3 text-slate-400" />
                    <span>Inactive</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="font-semibold text-slate-700">{employee.designation || 'Staff'}</span>
                <span>&bull;</span>
                <span>{employee.department || 'Operations'}</span>
                <span>&bull;</span>
                <span className="capitalize">{employee.employment_type?.replace('_', ' ') || 'Full Time'}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs font-mono w-full sm:w-auto">
            <span className="text-slate-400 block text-[10px] uppercase">Primary Operating Company:</span>
            <span className="font-semibold text-slate-800 text-sm mt-0.5 block truncate max-w-xs">
              {primaryAssignment?.company?.name || 'Unassigned'}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Details & Multi-Company Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Identity & Employment Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Employment Details */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Employment Specifications</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] font-mono">Joining Date:</span>
                <span className="font-semibold text-slate-800">
                  {employee.joining_date ? new Date(employee.joining_date).toLocaleDateString('en-IN', {
                    dateStyle: 'medium'
                  }) : '—'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-mono">Reporting Manager:</span>
                <span className="font-semibold text-slate-800">
                  {employee.reporting_manager ? (
                    <Link 
                      to={`/admin/employees/${employee.reporting_manager.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {employee.reporting_manager.first_name} {employee.reporting_manager.last_name} ({employee.reporting_manager.employee_code})
                    </Link>
                  ) : (
                    'No Direct Reporting Manager (Top Level)'
                  )}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-mono">Department:</span>
                <span className="font-semibold text-slate-800">{employee.department || '—'}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-mono">Designation:</span>
                <span className="font-semibold text-slate-800">{employee.designation || '—'}</span>
              </div>
            </div>
          </div>

          {/* Contact & Identity */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Mail className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Contact &amp; Identification</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] font-mono">Email Address:</span>
                <span className="font-semibold text-slate-800">{employee.email || '—'}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-mono">Primary Phone:</span>
                <span className="font-semibold text-slate-800">{employee.phone || '—'}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-mono">Alternate Phone:</span>
                <span className="font-semibold text-slate-800">{employee.alternate_phone || '—'}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-mono">Date of Birth:</span>
                <span className="font-semibold text-slate-800">
                  {employee.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString('en-IN', {
                    dateStyle: 'medium'
                  }) : '—'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-slate-400 block text-[11px] font-mono">Residential Address:</span>
              <p className="text-xs text-slate-700 mt-0.5">
                {[employee.address, employee.city, employee.state, employee.postal_code].filter(Boolean).join(', ') || 'No address recorded.'}
              </p>
            </div>
          </div>

          {/* Notes */}
          {employee.notes && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider text-slate-400">
                Internal Administrative Notes
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                {employee.notes}
              </p>
            </div>
          )}

        </div>

        {/* Right Col: Multi-Company Assignments (Section 14) */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Company Assignments</h2>
              </div>

              {canEdit && (
                <button
                  type="button"
                  onClick={() => setShowAssignModal(true)}
                  className="p-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  title="Add Company Assignment"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Operating entities in JMG where this employee is assigned to work.
            </p>

            <div className="space-y-3">
              {employee.assignments?.map((assignment) => (
                <div 
                  key={assignment.id}
                  className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                    assignment.is_primary 
                      ? 'border-blue-500/40 bg-blue-50/30' 
                      : assignment.is_active 
                      ? 'border-slate-200 bg-slate-50/50' 
                      : 'border-slate-200 bg-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900 block">
                          {assignment.company?.name}
                        </span>
                        {assignment.is_primary && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-800">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            <span>PRIMARY</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                        Domain: {assignment.company?.domain?.name || 'Assigned'}
                      </span>
                    </div>

                    {!assignment.is_active && (
                      <span className="text-[10px] font-mono text-slate-400 font-medium">
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span>{assignment.designation || employee.designation || 'Staff'}</span>
                    
                    {canEdit && (
                      <div className="flex items-center gap-2">
                        {!assignment.is_primary && assignment.is_active && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(assignment.id)}
                            className="text-blue-600 hover:underline font-mono text-[10px] cursor-pointer"
                          >
                            Set Primary
                          </button>
                        )}
                        {assignment.is_active && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAssignment(assignment.id)}
                            className="text-red-500 hover:text-red-700 font-mono text-[10px] cursor-pointer"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Company Assignment CTA */}
            {canEdit && (
              <button
                type="button"
                onClick={() => setShowAssignModal(true)}
                className="w-full py-2 px-3 rounded-lg border border-dashed border-slate-300 hover:border-slate-400 text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Additional Company</span>
              </button>
            )}
          </div>

          {/* System Audit Information */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1 text-slate-400">
            <div>Created: {employee.created_at ? new Date(employee.created_at).toLocaleString('en-IN') : '—'}</div>
            <div>Updated: {employee.updated_at ? new Date(employee.updated_at).toLocaleString('en-IN') : '—'}</div>
          </div>

        </div>

      </div>

      {/* Add Company Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Assign Additional Company
              </h2>
              <button 
                type="button" 
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {assignError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {assignError}
              </div>
            )}

            <form onSubmit={handleAddAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-slate-500 mb-1">
                  Target Company <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={assignCompanyId}
                  onChange={(e) => setAssignCompanyId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Company</option>
                  {availableCompanies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-500 mb-1">
                  Role / Designation at this Company
                </label>
                <input
                  type="text"
                  value={assignDesignation}
                  onChange={(e) => setAssignDesignation(e.target.value)}
                  placeholder={employee.designation || 'e.g. Lead Consultant'}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="assign-primary-cb"
                  checked={assignIsPrimary}
                  onChange={(e) => setAssignIsPrimary(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="assign-primary-cb" className="text-xs text-slate-700 font-medium">
                  Set as Primary Company Assignment
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAssignment}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAssignment ? 'Assigning...' : 'Add Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
