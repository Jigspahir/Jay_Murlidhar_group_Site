import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { vendorService, VendorForm } from '../../features/vendors';
import { ArrowLeft, Truck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VendorCreate() {
  const navigate = useNavigate();
  const { currentCompanyId, isAllCompanies } = useCompany();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await vendorService.createVendor(formData);
      navigate(`/admin/vendors/${created.id}`);
    } catch (err) {
      console.error('Error creating vendor:', err);
      setError(err.message || 'Failed to create vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/vendors"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Add New Vendor
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Register a supplier or contractor with company ownership and statutory details.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <VendorForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          defaultCompanyId={!isAllCompanies ? currentCompanyId : ''}
        />
      </div>
    </div>
  );
}
