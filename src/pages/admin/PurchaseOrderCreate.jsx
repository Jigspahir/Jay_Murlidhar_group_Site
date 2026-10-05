import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { purchaseOrderService, POForm } from '../../features/purchaseOrders';
import { ArrowLeft, ShoppingBag, AlertCircle } from 'lucide-react';

export default function PurchaseOrderCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedVendorId = searchParams.get('vendor_id');

  const { currentCompanyId, isAllCompanies } = useCompany();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (poData, itemsData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await purchaseOrderService.createPurchaseOrder(poData, itemsData);
      navigate(`/admin/purchase-orders/${created.id}`);
    } catch (err) {
      console.error('Error creating purchase order:', err);
      setError(err.message || 'Failed to create purchase order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/purchase-orders"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              New Purchase Order
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Create a procurement purchase order draft with company-scoped items and tax calculations.
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
        <POForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          defaultCompanyId={!isAllCompanies ? currentCompanyId : ''}
          preselectedVendorId={preselectedVendorId}
        />
      </div>
    </div>
  );
}
