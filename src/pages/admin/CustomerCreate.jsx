import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { createCustomer } from '../../features/customers/customerService';
import CustomerForm from '../../features/customers/CustomerForm';
import { 
  ArrowLeft, 
  UserPlus, 
  AlertCircle 
} from 'lucide-react';

export default function CustomerCreate() {
  const navigate = useNavigate();
  const { availableCompanies, currentCompanyId } = useCompany();
  const { hasPermission } = usePermissions();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!hasPermission(PERMISSIONS.CUSTOMERS_CREATE)) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl border border-red-200 text-center shadow-xs">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h1 className="text-base font-bold text-slate-900">Access Denied</h1>
        <p className="text-xs text-slate-600 mt-1">
          You do not have administrative permissions to register customer records.
        </p>
        <Link 
          to="/admin/customers" 
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
        >
          Return to Customer Directory
        </Link>
      </div>
    );
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        company_id: formData.company_id || currentCompanyId
      };

      const created = await createCustomer(payload);
      navigate(`/admin/customers/${created.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create customer record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div>
        <Link 
          to="/admin/customers" 
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Customers</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Register New Customer</h1>
            <p className="text-xs text-slate-500">
              Onboard an individual citizen, client, or corporate account into your authorized JMG company.
            </p>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Customer Form */}
      <CustomerForm
        companies={availableCompanies}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEdit={false}
      />

    </div>
  );
}
