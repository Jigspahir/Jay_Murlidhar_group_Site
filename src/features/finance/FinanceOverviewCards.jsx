import React from 'react';
import {
  TrendingUp,
  CreditCard,
  Clock,
  AlertTriangle,
  Receipt,
  Scale
} from 'lucide-react';

export default function FinanceOverviewCards({ summary, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm animate-pulse space-y-3"
          >
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-8 bg-slate-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  const {
    grossInvoicedRevenue = 0,
    totalCollected = 0,
    outstandingReceivables = 0,
    overdueReceivables = 0,
    totalExpenses = 0,
    netOperatingPosition = 0,
    statusCounts = {}
  } = summary || {};

  const cards = [
    {
      title: 'Gross Invoiced Revenue',
      amount: grossInvoicedRevenue,
      sub: `${summary?.invoiceCount || 0} commercial invoices`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      title: 'Total Collected Cash',
      amount: totalCollected,
      sub: `${summary?.paymentCount || 0} settlement receipts`,
      icon: CreditCard,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      title: 'Outstanding Receivables',
      amount: outstandingReceivables,
      sub: 'Pending invoice balances',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    },
    {
      title: 'Overdue Receivables',
      amount: overdueReceivables,
      sub: 'Invoices past due date',
      icon: AlertTriangle,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100'
    },
    {
      title: 'Operating Expenses',
      amount: totalExpenses,
      sub: `${summary?.expenseCount || 0} disbursement vouchers`,
      icon: Receipt,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100'
    },
    {
      title: 'Net Operating Position',
      amount: netOperatingPosition,
      sub: 'Collected cash minus paid expenses',
      icon: Scale,
      color: netOperatingPosition >= 0 ? 'text-teal-600' : 'text-rose-600',
      bg: netOperatingPosition >= 0 ? 'bg-teal-50' : 'bg-rose-50',
      border: netOperatingPosition >= 0 ? 'border-teal-100' : 'border-rose-100'
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* 6 Primary Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-white rounded-xl border ${card.border} p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-2 font-mono text-2xl font-bold text-slate-900 tracking-tight">
                ₹{Number(card.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>

              <div className="mt-1 text-xs text-slate-400 font-mono">
                {card.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoice Status Lifecycle Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Invoice Status Pipeline Breakdown
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px]">DRAFT</span>
            <span className="text-lg font-bold text-slate-700">{statusCounts.draft || 0}</span>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <span className="text-blue-500 block text-[10px]">ISSUED</span>
            <span className="text-lg font-bold text-blue-700">{statusCounts.issued || 0}</span>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <span className="text-amber-500 block text-[10px]">PARTIALLY PAID</span>
            <span className="text-lg font-bold text-amber-700">{statusCounts.partially_paid || 0}</span>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-500 block text-[10px]">PAID</span>
            <span className="text-lg font-bold text-emerald-700">{statusCounts.paid || 0}</span>
          </div>
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
            <span className="text-rose-500 block text-[10px]">OVERDUE</span>
            <span className="text-lg font-bold text-rose-700">{statusCounts.overdue || 0}</span>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
            <span className="text-gray-400 block text-[10px]">CANCELLED</span>
            <span className="text-lg font-bold text-gray-500">{statusCounts.cancelled || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
