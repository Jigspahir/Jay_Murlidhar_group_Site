import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, XCircle } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { EXPENSE_PAYMENT_METHODS } from './expenseService';

const STATUS_BADGES = {
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  recorded: 'bg-amber-50 text-amber-700 border-amber-200',
  draft: 'bg-slate-100 text-slate-700 border-slate-300',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-300 line-through'
};

export default function ExpenseTable({
  expenses = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  count = 0,
  pageSize = 25,
  onPageChange,
  onCancelClick
}) {
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(PERMISSIONS.EXPENSES_EDIT);

  const getMethodLabel = (val) => {
    const found = EXPENSE_PAYMENT_METHODS.find((m) => m.value === val);
    return found ? found.label.split(' ')[0] : val;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-3" />
        <p className="text-xs text-slate-500 font-mono">Loading expense disbursements...</p>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-sm font-medium text-slate-700 mb-1">No expense vouchers found</p>
        <p className="text-xs text-slate-500">
          No records match the current company selection or active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-3">Expense #</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Payee Name</th>
              <th className="px-3 py-3 font-mono">Date</th>
              <th className="px-3 py-3">Method</th>
              <th className="px-3 py-3 text-right">Amount</th>
              <th className="px-3 py-3 text-right">Tax</th>
              <th className="px-3 py-3 text-right">Total (₹)</th>
              <th className="px-3 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((exp) => {
              const badgeCls = STATUS_BADGES[exp.status] || STATUS_BADGES.draft;

              return (
                <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Expense Number */}
                  <td className="px-4 py-3 font-mono font-medium text-slate-900 whitespace-nowrap">
                    {exp.expense_number}
                  </td>

                  {/* Company */}
                  <td className="px-4 py-3 text-slate-700">
                    <span className="truncate block max-w-[150px]" title={exp.companies?.name}>
                      {exp.companies?.name}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 font-medium text-slate-800">
                    <span className="truncate block max-w-[180px]" title={exp.category}>
                      {exp.category}
                    </span>
                  </td>

                  {/* Payee Name */}
                  <td className="px-4 py-3 text-slate-700">
                    <div className="font-medium text-slate-800">{exp.payee_name}</div>
                    {exp.reference_number && (
                      <div className="text-[10px] text-slate-400 font-mono">Ref: {exp.reference_number}</div>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-3 py-3 font-mono text-slate-600 whitespace-nowrap">
                    {exp.expense_date}
                  </td>

                  {/* Payment Method */}
                  <td className="px-3 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 border border-slate-200">
                      {getMethodLabel(exp.payment_method)}
                    </span>
                  </td>

                  {/* Base Amount */}
                  <td className="px-3 py-3 text-right font-mono text-slate-600">
                    ₹{Number(exp.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Tax */}
                  <td className="px-3 py-3 text-right font-mono text-slate-500">
                    ₹{Number(exp.tax_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Total Amount */}
                  <td className="px-3 py-3 text-right font-mono font-bold text-slate-900">
                    ₹{Number(exp.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Status */}
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border ${badgeCls}`}
                    >
                      {exp.status.toUpperCase()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {canEdit && exp.status !== 'cancelled' && (
                        <Link
                          to={`/admin/expenses/${exp.id}/edit`}
                          className="p-1 rounded text-amber-600 hover:text-amber-800 hover:bg-amber-50 transition-colors"
                          title="Edit Expense"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      {canEdit && exp.status !== 'cancelled' && (
                        <button
                          type="button"
                          onClick={() => onCancelClick(exp)}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Cancel Expense"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          Showing <span className="font-medium text-slate-800">{expenses.length}</span> of{' '}
          <span className="font-medium text-slate-800">{count}</span> records (Page {page} of {totalPages || 1})
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-2 font-mono">{page} / {totalPages}</span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
