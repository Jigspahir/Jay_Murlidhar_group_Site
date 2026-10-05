import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { createEmployee } from '../../features/employees/employeeService';
import EmployeeForm from '../../features/employees/EmployeeForm';
import { 
  ArrowLeft, 
  UserPlus, 
  AlertCircle 
} from 'lucide-react';

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const { availableCompanies, currentCompanyId } = useCompany();
  const { hasPermission } = usePermissions();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!hasPermission(PERMISSIONS.EMPLOYEES_CREATE)) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl border border-red-200 text-center shadow-xs">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h1 className="text-base font-bold text-slate-900">Access Denied</h1>
        <p className="text-xs text-slate-600 mt-1">
          You do not have administrative permissions to onboard employees.
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

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');

    try {
      const initialAssignment = {
        company_id: formData.company_id || currentCompanyId,
        designation: formData.designation,
        department: formData.department,
        employment_type: formData.employment_type,
        joining_date: formData.joining_date,
        reporting_manager_id: formData.reporting_manager_id || null
      };

      const created = await createEmployee(formData, initialAssignment);
      navigate(`/admin/employees/${created.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create employee.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link 
          to="/admin/employees" 
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Employee Directory</span>
        </Link>
        <span className="text-xs font-mono text-slate-400">
          Onboarding Form
        </span>
      </div>

      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold shrink-0">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Register New Employee
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Onboard an employee into the canonical JMG multi-company personnel master.
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

      {/* Employee Form */}
      <EmployeeForm
        companies={availableCompanies}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEdit={false}
      />

    </div>
  );
}
