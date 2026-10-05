import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { useAuth } from '../../hooks/useAuth';
import { ExpenseForm, getExpenseById, updateExpense } from '../../features/expenses';
import { Edit2, Building2, AlertCircle } from 'lucide-react';

export default function ExpenseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { availableCompanies, isAllCompanies } = useCompany();

  const [expense, setExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getExpenseById(id)
      .then((data) => {
        if (!isMounted) return;
        if (!data) {
          setError('Expense voucher not found.');
          setIsLoading(false);
          return;
        }

        if (data.status === 'cancelled') {
          setError('Cancelled expense vouchers cannot be edited.');
          setIsLoading(false);
          return;
        }

        setExpense(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Failed to load expense voucher.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateExpense(id, {
        ...formData,
        currentUser: user
      });
      setIsSubmitting(false);
      navigate('/admin/expenses');
    } catch (err) {
      setIsSubmitting(false);
      alert(err.message || 'Failed to update expense voucher.');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-purple-600 mb-3" />
        <p className="text-xs text-slate-500 font-mono">Loading expense voucher...</p>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
        <div className="p-3 rounded-full bg-rose-100 text-rose-600 w-12 h-12 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Cannot Edit Expense</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">{error || 'Expense voucher not found.'}</p>
        <button
          onClick={() => navigate('/admin/expenses')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg"
        >
          Back to Expenses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
          <Building2 className="w-3.5 h-3.5 text-purple-600" />
          <span>{expense.companies?.name || 'Company Expense'}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Edit2 className="w-6 h-6 text-purple-600" />
          <span>Edit Expense &bull; {expense.expense_number}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Modify disbursement amounts, payee details, reference numbers, or payment methods
        </p>
      </div>

      <ExpenseForm
        initialData={expense}
        companies={availableCompanies}
        selectedCompanyId={expense.company_id}
        isAllCompanies={isAllCompanies}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
