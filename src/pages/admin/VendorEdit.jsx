import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { vendorService, VendorForm } from '../../features/vendors';
import { ArrowLeft, Truck, AlertCircle } from 'lucide-react';

export default function VendorEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadVendor() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await vendorService.getVendorById(id);
        setVendor(data);
      } catch (err) {
        console.error('Error loading vendor:', err);
        setError(err.message || 'Vendor not found or access denied');
      } finally {
        setIsLoading(false);
      }
    }
    loadVendor();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updated = await vendorService.updateVendor(id, formData);
      navigate(`/admin/vendors/${updated.id}`);
    } catch (err) {
      console.error('Error updating vendor:', err);
      setError(err.message || 'Failed to update vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent" />
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Loading vendor...</p>
      </div>
    );
  }

  if (error && !vendor) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Vendor Error</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
        <Link
          to="/admin/vendors"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vendors
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/admin/vendors/${id}`}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Edit Vendor: {vendor.vendor_code}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Update commercial details, contact information, and banking profile.
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
          initialData={vendor}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          defaultCompanyId={vendor.company_id}
          isEdit={true}
        />
      </div>
    </div>
  );
}
