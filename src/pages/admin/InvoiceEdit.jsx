import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { useAuth } from '../../hooks/useAuth';
import { InvoiceForm, getInvoiceById, updateInvoice } from '../../features/invoices';
import { Edit2, Building2, AlertCircle } from 'lucide-react';

export default function InvoiceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { availableCompanies, isAllCompanies } = useCompany();

  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getInvoiceById(id)
      .then((data) => {
        if (!isMounted) return;
        if (!data) {
          setError('Invoice not found.');
          setIsLoading(false);
          return;
        }

        if (data.status !== 'draft') {
          setError('Only draft invoices can be edited. Issued invoices are historically immutable.');
          setIsLoading(false);
          return;
        }

        setInvoice(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Failed to load invoice draft.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateInvoice(id, {
        ...formData,
        currentUser: user
      });
      setIsSubmitting(false);
      navigate(`/admin/invoices/${id}`);
    } catch (err) {
      setIsSubmitting(false);
      alert(err.message || 'Failed to update invoice draft.');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-3" />
        <p className="text-xs text-slate-500 font-mono">Loading invoice draft...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
        <div className="p-3 rounded-full bg-rose-100 text-rose-600 w-12 h-12 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Cannot Edit Invoice</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">{error || 'Invoice not found.'}</p>
        <button
          onClick={() => navigate('/admin/invoices')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg"
        >
          Back to Invoices
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span>{invoice.company_name}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Edit2 className="w-6 h-6 text-amber-600" />
          <span>Edit Draft Invoice &bull; {invoice.invoice_number}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Modify draft line items, rates, taxes, and customer terms before issuing
        </p>
      </div>

      <InvoiceForm
        initialData={invoice}
        companies={availableCompanies}
        selectedCompanyId={invoice.company_id}
        isAllCompanies={isAllCompanies}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
