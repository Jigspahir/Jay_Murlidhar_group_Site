import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { purchaseBillService, BillForm } from '../../features/purchaseBills';
import { ArrowLeft, Receipt, AlertCircle } from 'lucide-react';

export default function PurchaseBillEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBill() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await purchaseBillService.getPurchaseBillById(id);
        if (data.status !== 'draft') {
          throw new Error('Recorded or paid supplier bills are locked and cannot be edited directly.');
        }
        setBill(data);
      } catch (err) {
        console.error('Error loading purchase bill:', err);
        setError(err.message || 'Failed to load bill');
      } finally {
        setIsLoading(false);
      }
    }
    loadBill();
  }, [id]);

  const handleSubmit = async (billData, itemsData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updated = await purchaseBillService.updatePurchaseBill(id, billData, itemsData);
      navigate(`/admin/purchase-bills/${updated.id}`);
    } catch (err) {
      console.error('Error updating purchase bill:', err);
      setError(err.message || 'Failed to update purchase bill');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent" />
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Loading purchase bill...</p>
      </div>
    );
  }

  if (error && !bill) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Restricted</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
        <Link
          to={`/admin/purchase-bills/${id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bill Details
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/admin/purchase-bills/${id}`}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Edit Supplier Bill: {bill.bill_number}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Update line items, tax rates, and vendor invoice references.
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
        <BillForm
          initialData={bill}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          defaultCompanyId={bill.company_id}
          isEdit={true}
        />
      </div>
    </div>
  );
}
