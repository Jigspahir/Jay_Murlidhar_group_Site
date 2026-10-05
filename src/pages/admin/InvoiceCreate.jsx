import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { useAuth } from '../../hooks/useAuth';
import { InvoiceForm, createInvoice } from '../../features/invoices';
import { FilePlus, Building2 } from 'lucide-react';

export default function InvoiceCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentCompany, currentCompanyId, availableCompanies, isAllCompanies } = useCompany();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const created = await createInvoice({
        ...formData,
        currentUser: user
      });
      setIsSubmitting(false);
      navigate(`/admin/invoices/${created.id}`);
    } catch (err) {
      setIsSubmitting(false);
      alert(err.message || 'Failed to create invoice.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span>{currentCompany?.name || 'Company Billing'}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <FilePlus className="w-6 h-6 text-blue-600" />
          <span>New Commercial Invoice</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate an authoritative commercial or GST tax invoice with historical pricing snapshot
        </p>
      </div>

      <InvoiceForm
        companies={availableCompanies}
        selectedCompanyId={currentCompanyId}
        isAllCompanies={isAllCompanies}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
