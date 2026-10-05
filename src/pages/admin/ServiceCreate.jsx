import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { createService, ServiceForm } from '../../features/services';
import { 
  ArrowLeft, 
  Layers, 
  AlertCircle 
} from 'lucide-react';

export default function ServiceCreate() {
  const navigate = useNavigate();
  const { availableCompanies, currentCompanyId } = useCompany();
  const { hasPermission } = usePermissions();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!hasPermission(PERMISSIONS.SERVICES_CREATE)) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl border border-red-200 text-center shadow-xs">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h1 className="text-base font-bold text-slate-900">Access Denied</h1>
        <p className="text-xs text-slate-600 mt-1">
          You do not have administrative permissions to create service items.
        </p>
        <Link 
          to="/admin/services" 
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
        >
          Return to Service Master
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

      const created = await createService(payload);
      navigate(`/admin/services/${created.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create service item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div>
        <Link 
          to="/admin/services" 
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Services</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Add New Service Item</h1>
            <p className="text-xs text-slate-500">
              Create an operational service offering, rate structure, and deliverables for your company.
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

      {/* Service Form */}
      <ServiceForm
        companies={availableCompanies}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEdit={false}
      />
    </div>
  );
}
