import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  getEmployeeById, 
  updateEmployee 
} from '../../features/employees/employeeService';
import EmployeeForm from '../../features/employees/EmployeeForm';
import { 
  ArrowLeft, 
  Edit3, 
  AlertCircle, 
  Building2 
} from 'lucide-react';

export default function EmployeeEdit() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { availableCompanies } = useCompany();
  const { hasPermission } = usePermissions();

  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setIsLoading(true);
      setError('');
      try {
        const emp = await getEmployeeById(employeeId);
        if (mounted) {
          if (!emp) {
            setError(`Employee record "${employeeId}" was not found.`);
          } else {
            setEmployee(emp);
          }
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load employee.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [employeeId]);

  if (!hasPermission(PERMISSIONS.EMPLOYEES_EDIT)) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl border border-red-200 text-center shadow-xs">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h1 className="text-base font-bold text-slate-900">Access Denied</h1>
        <p className="text-xs text-slate-600 mt-1">
          You do not have administrative permissions to modify employee records.
        </p>
        <Link 
          to="/admin/employees" 
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
        >
          Return to Employee Roster
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-7 h-7 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="font-mono text-xs text-slate-500 uppercase tracking-wider">
          Loading employee details...
        </p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl border border-red-200 text-center shadow-xs">
        <Building2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Employee Record Unavailable</h2>
        <p className="text-xs text-slate-500 mt-1">{error || 'Record could not be retrieved.'}</p>
        <Link 
          to="/admin/employees" 
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
        >
          Back to Directory
        </Link>
      </div>
    );
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');

    try {
      await updateEmployee(employee.id, {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        alternate_phone: formData.alternate_phone,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        department: formData.department,
        designation: formData.designation,
        employment_type: formData.employment_type,
        joining_date: formData.joining_date,
        reporting_manager_id: formData.reporting_manager_id || null,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        profile_photo_url: formData.profile_photo_url,
        status: formData.status,
        notes: formData.notes
      });

      navigate(`/admin/employees/${employee.id}`);
    } catch (err) {
      setError(err.message || 'Failed to update employee details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link 
          to={`/admin/employees/${employee.id}`} 
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Profile</span>
        </Link>
        <span className="text-xs font-mono text-slate-400">
          Editing Record &bull; {employee.employee_code}
        </span>
      </div>

      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold shrink-0">
          <Edit3 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Edit Employee: {employee.full_name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Update personal metadata, designation, and reporting manager parameters.
          </p>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <EmployeeForm
        initialData={employee}
        companies={availableCompanies}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEdit={true}
      />

    </div>
  );
}
