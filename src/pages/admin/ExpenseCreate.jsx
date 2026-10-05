import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { useAuth } from '../../hooks/useAuth';
import { ExpenseForm, createExpense } from '../../features/expenses';
import { Receipt, Building2 } from 'lucide-react';

export default function ExpenseCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentCompany, currentCompanyId, availableCompanies, isAllCompanies } = useCompany();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await createExpense({
        ...formData,
        currentUser: user
      });
      setIsSubmitting(false);
      navigate('/admin/expenses');
    } catch (err) {
      setIsSubmitting(false);
      alert(err.message || 'Failed to record expense voucher.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span>{currentCompany?.name || 'Company Disbursement'}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Receipt className="w-6 h-6 text-purple-600" />
          <span>Record Operating Expense</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Record commercial disbursements, vendor payments, utility bills, and premises costs
        </p>
      </div>

      <ExpenseForm
        companies={availableCompanies}
        selectedCompanyId={currentCompanyId}
        isAllCompanies={isAllCompanies}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
