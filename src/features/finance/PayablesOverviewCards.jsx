import React from 'react';
import { DollarSign, Clock, AlertTriangle, CheckCircle2, ShoppingBag, Receipt, ArrowUpRight } from 'lucide-react';

export default function PayablesOverviewCards({ summary, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm animate-pulse">
            <div className="w-8 h-8 bg-slate-200 rounded-lg mb-3" />
            <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
            <div className="h-7 bg-slate-200 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  const {
    totalPayables = 0,
    overduePayables = 0,
    dueThisWeek = 0,
    pendingPOApprovals = 0,
    totalPOCommitment = 0,
    totalDisbursed = 0,
    purchaseTaxCaptured = 0,
    agingBuckets = {}
  } = summary || {};

  return (
    <div className="space-y-4 mb-8">
      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Outstanding Payables */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Total Payables (AP)
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            ₹{totalPayables.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Unsettled liabilities on recorded bills
          </div>
        </div>

        {/* Card 2: Overdue Payables */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-rose-600 font-semibold">
              Overdue Payables
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono tracking-tight">
            ₹{overduePayables.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-rose-400 mt-1 font-mono">
            Passed payment credit terms
          </div>
        </div>

        {/* Card 3: Due in Next 7 Days */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 font-semibold">
              Due Within 7 Days
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            ₹{dueThisWeek.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-amber-500 mt-1 font-mono">
            Approaching commercial settlement date
          </div>
        </div>

        {/* Card 4: Total Disbursements Paid */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 font-semibold">
              Total Disbursed (Paid)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
            ₹{totalDisbursed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-500 mt-1 font-mono">
            Cumulative outflow to suppliers
          </div>
        </div>
      </div>

      {/* Secondary Row: Procurement & Compliance Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 5: PO Commitments */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Active PO Commitment
            </div>
            <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">
              ₹{totalPOCommitment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-400">Approved orders awaiting supplier bill</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        {/* Card 6: Pending PO Approvals */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Pending Requisitions
            </div>
            <div className="text-lg font-bold text-amber-600 font-mono mt-0.5">
              {pendingPOApprovals} Orders
            </div>
            <div className="text-[10px] text-slate-400">POs submitted awaiting managerial sign-off</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Card 7: Input GST Captured */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Input GST Captured (ITC Base)
            </div>
            <div className="text-lg font-bold text-indigo-700 font-mono mt-0.5">
              ₹{purchaseTaxCaptured.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-400">Total CGST + SGST + IGST on supplier bills</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
