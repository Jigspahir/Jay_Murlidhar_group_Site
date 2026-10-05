import React, { useState, useEffect, useCallback } from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import {
  getInvoiceRegisterReport,
  getReceivablesAgingReport,
  getPaymentLedgerReport,
  getExpenseAnalysisReport,
  getIncomeVsExpenseReport
} from '../../features/finance';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  Building2,
  RefreshCw,
  Clock,
  CreditCard,
  Receipt,
  Scale,
  FileText
} from 'lucide-react';

export default function FinanceReports() {
  const { currentCompany, currentCompanyId, isAllCompanies, availableCompanies } = useCompany();

  const [activeReport, setActiveReport] = useState('invoices'); // invoices | aging | payments | expenses | income_vs_expense
  const [scopedCompanyFilter, setScopedCompanyFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const effectiveCompanyId = isAllCompanies
    ? (scopedCompanyFilter === 'all' ? null : scopedCompanyFilter || null)
    : currentCompanyId;

  const loadReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        companyId: effectiveCompanyId,
        isAllCompanies: isAllCompanies && !scopedCompanyFilter,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null
      };

      let res = null;
      if (activeReport === 'invoices') {
        res = await getInvoiceRegisterReport(params);
      } else if (activeReport === 'aging') {
        res = await getReceivablesAgingReport(params);
      } else if (activeReport === 'payments') {
        res = await getPaymentLedgerReport(params);
      } else if (activeReport === 'expenses') {
        res = await getExpenseAnalysisReport(params);
      } else if (activeReport === 'income_vs_expense') {
        res = await getIncomeVsExpenseReport(params);
      }

      setReportData(res);
      setIsLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to generate financial report.');
      setIsLoading(false);
    }
  }, [activeReport, effectiveCompanyId, isAllCompanies, scopedCompanyFilter, dateFrom, dateTo]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const applyPreset = (preset) => {
    const today = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const toYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (preset === 'today') {
      const d = toYMD(today);
      setDateFrom(d);
      setDateTo(d);
    } else if (preset === 'this_month') {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setDateFrom(toYMD(first));
      setDateTo(toYMD(last));
    } else if (preset === 'prev_month') {
      const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const last = new Date(today.getFullYear(), today.getMonth(), 0);
      setDateFrom(toYMD(first));
      setDateTo(toYMD(last));
    } else if (preset === 'this_fy') {
      const currentYear = today.getFullYear();
      const fyStart = today.getMonth() >= 3 ? currentYear : currentYear - 1;
      const start = new Date(fyStart, 3, 1);
      const end = new Date(fyStart + 1, 2, 31);
      setDateFrom(toYMD(start));
      setDateTo(toYMD(end));
    } else if (preset === 'all_time') {
      setDateFrom('');
      setDateTo('');
    }
  };

  // CSV Export utility
  const exportToCSV = () => {
    if (!reportData) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    let filename = `JMG_${activeReport}_report_${new Date().toISOString().split('T')[0]}.csv`;

    if (activeReport === 'invoices') {
      csvContent += 'Invoice Number,Customer,Company,Invoice Date,Taxable Amount,CGST,SGST,IGST,Total,Paid,Balance,Status\n';
      reportData.forEach((row) => {
        csvContent += `"${row.invoice_number}","${row.customer_name}","${row.company_name}","${row.invoice_date}",${row.taxable_amount},${row.cgst_amount},${row.sgst_amount},${row.igst_amount},${row.total_amount},${row.amount_paid},${row.balance_due},"${row.status}"\n`;
      });
    } else if (activeReport === 'payments') {
      csvContent += 'Payment Number,Invoice Number,Customer,Company,Date,Method,Amount,Reference\n';
      reportData.forEach((row) => {
        csvContent += `"${row.payment_number}","${row.invoices?.invoice_number || ''}","${row.customers?.full_name || ''}","${row.companies?.name || ''}","${row.payment_date}","${row.payment_method}",${row.amount},"${row.reference_number || ''}"\n`;
      });
    } else if (activeReport === 'expenses') {
      csvContent += 'Expense Number,Company,Category,Payee,Date,Method,Base Amount,Tax Amount,Total Amount,Status\n';
      (reportData.rawExpenses || []).forEach((row) => {
        csvContent += `"${row.expense_number}","${row.companies?.name || ''}","${row.category}","${row.payee_name}","${row.expense_date}","${row.payment_method}",${row.amount},${row.tax_amount},${row.total_amount},"${row.status}"\n`;
      });
    } else if (activeReport === 'aging') {
      csvContent += 'Aging Bucket,Count,Total Balance Amount\n';
      Object.keys(reportData).forEach((key) => {
        const b = reportData[key];
        csvContent += `"${b.label}",${b.count},${b.amount}\n`;
      });
    } else if (activeReport === 'income_vs_expense') {
      csvContent += 'Metric,Amount\n';
      csvContent += `"Total Invoiced & Collected Income",${reportData.totalIncome}\n`;
      csvContent += `"Total Paid Operating Expenses",${reportData.totalExpense}\n`;
      csvContent += `"Net Operating Cash Position",${reportData.netPosition}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Strip (Hidden in print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {isAllCompanies
                ? 'Consolidated Group Reporting &bull; Jay Murlidhar Group'
                : currentCompany?.name || 'Company Scoped'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-blue-600" />
            <span>Commercial Financial Reports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-Ready Invoicing Registers, AR Aging Analysis, Payment Ledgers, and Cash Flow Statements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadReport}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs"
            title="Refresh Report"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={exportToCSV}
            disabled={isLoading || !reportData}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium shadow-xs disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm disabled:opacity-40"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Selector Tabs (Hidden in print) */}
      <div className="print:hidden flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveReport('invoices')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
            activeReport === 'invoices'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1. Invoice Register</span>
        </button>

        <button
          onClick={() => setActiveReport('aging')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
            activeReport === 'aging'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>2. AR Aging Breakdown</span>
        </button>

        <button
          onClick={() => setActiveReport('payments')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
            activeReport === 'payments'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>3. Payment Ledger</span>
        </button>

        <button
          onClick={() => setActiveReport('expenses')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
            activeReport === 'expenses'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>4. Expense Analysis</span>
        </button>

        <button
          onClick={() => setActiveReport('income_vs_expense')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
            activeReport === 'income_vs_expense'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>5. Income vs Expense</span>
        </button>
      </div>

      {/* Date & Company Filter Strip (Hidden in print) */}
      <div className="print:hidden bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Presets:
            </span>
            <button
              onClick={() => applyPreset('this_month')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              This Month
            </button>
            <button
              onClick={() => applyPreset('prev_month')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              Previous Month
            </button>
            <button
              onClick={() => applyPreset('this_fy')}
              className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium"
            >
              This FY (Apr-Mar)
            </button>
            <button
              onClick={() => applyPreset('all_time')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              All Time
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-2 py-1 rounded border border-slate-300 text-xs bg-white"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-2 py-1 rounded border border-slate-300 text-xs bg-white"
            />
          </div>
        </div>

        {isAllCompanies && (
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <span className="text-slate-600 font-medium">Filter Company:</span>
            <select
              value={scopedCompanyFilter}
              onChange={(e) => setScopedCompanyFilter(e.target.value)}
              className="px-2 py-1 rounded border border-slate-300 bg-white"
            >
              <option value="">All Companies (Consolidated)</option>
              {availableCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm print:border-none print:shadow-none print:p-0">
        {/* Printable Report Header */}
        <div className="border-b border-slate-300 pb-4 mb-6 flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isAllCompanies ? 'Jay Murlidhar Group — Consolidated Report' : (currentCompany?.name || 'JMG Commercial Report')}
            </h2>
            <div className="text-xs font-mono text-slate-500 uppercase">
              {activeReport.replace(/_/g, ' ')} &bull; As of {new Date().toLocaleDateString('en-IN')}
            </div>
          </div>
          <div className="text-right text-xs font-mono text-slate-500">
            <div>Scope: {scopedCompanyFilter ? 'Filtered' : (isAllCompanies ? 'All Companies' : currentCompany?.name)}</div>
            <div>Period: {dateFrom || 'Start'} &rarr; {dateTo || 'Present'}</div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-slate-500">
            Generating financial analysis...
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 text-rose-700 text-xs rounded-lg">{error}</div>
        ) : (
          <div>
            {/* REPORT 1: INVOICE REGISTER */}
            {activeReport === 'invoices' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-300 text-slate-700 font-bold uppercase text-[10px]">
                      <th className="py-2 px-2">Invoice #</th>
                      <th className="py-2 px-2">Customer</th>
                      <th className="py-2 px-2">Company</th>
                      <th className="py-2 px-2">Date</th>
                      <th className="py-2 px-2 text-right">Taxable</th>
                      <th className="py-2 px-2 text-right">CGST</th>
                      <th className="py-2 px-2 text-right">SGST</th>
                      <th className="py-2 px-2 text-right">IGST</th>
                      <th className="py-2 px-2 text-right">Total</th>
                      <th className="py-2 px-2 text-right">Paid</th>
                      <th className="py-2 px-2 text-right">Balance</th>
                      <th className="py-2 px-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {reportData?.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-2 font-bold text-slate-800">{r.invoice_number}</td>
                        <td className="py-2 px-2 font-sans font-medium text-slate-800">{r.customer_name}</td>
                        <td className="py-2 px-2 font-sans text-slate-600">{r.company_name}</td>
                        <td className="py-2 px-2">{r.invoice_date}</td>
                        <td className="py-2 px-2 text-right">₹{Number(r.taxable_amount).toFixed(2)}</td>
                        <td className="py-2 px-2 text-right">₹{Number(r.cgst_amount).toFixed(2)}</td>
                        <td className="py-2 px-2 text-right">₹{Number(r.sgst_amount).toFixed(2)}</td>
                        <td className="py-2 px-2 text-right">₹{Number(r.igst_amount).toFixed(2)}</td>
                        <td className="py-2 px-2 text-right font-bold text-slate-900">₹{Number(r.total_amount).toFixed(2)}</td>
                        <td className="py-2 px-2 text-right text-emerald-600">₹{Number(r.amount_paid).toFixed(2)}</td>
                        <td className="py-2 px-2 text-right font-bold text-rose-600">₹{Number(r.balance_due).toFixed(2)}</td>
                        <td className="py-2 px-2 text-center uppercase text-[10px]">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* REPORT 2: AR AGING BREAKDOWN */}
            {activeReport === 'aging' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {Object.keys(reportData || {}).map((key) => {
                    const b = reportData[key];
                    return (
                      <div key={key} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {b.label}
                        </div>
                        <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                          ₹{Number(b.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {b.count} invoices pending
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Aging Details Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="border-b-2 border-slate-300 text-slate-700 font-bold uppercase text-[10px]">
                        <th className="py-2 px-2">Invoice #</th>
                        <th className="py-2 px-2">Customer</th>
                        <th className="py-2 px-2">Due Date</th>
                        <th className="py-2 px-2 text-right">Days Overdue</th>
                        <th className="py-2 px-2 text-right">Total (₹)</th>
                        <th className="py-2 px-2 text-right">Paid (₹)</th>
                        <th className="py-2 px-2 text-right">Balance Due (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {Object.keys(reportData || {}).flatMap((k) => reportData[k].items).map((inv, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2 px-2 font-bold text-slate-800">{inv.invoice_number}</td>
                          <td className="py-2 px-2 font-sans font-medium text-slate-800">{inv.customer_name}</td>
                          <td className="py-2 px-2">{inv.due_date}</td>
                          <td className="py-2 px-2 text-right text-rose-600 font-bold">{inv.daysOverdue} days</td>
                          <td className="py-2 px-2 text-right">₹{Number(inv.total_amount).toFixed(2)}</td>
                          <td className="py-2 px-2 text-right text-emerald-600">₹{Number(inv.amount_paid).toFixed(2)}</td>
                          <td className="py-2 px-2 text-right font-bold text-slate-900">₹{Number(inv.balance_due).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* REPORT 3: PAYMENT LEDGER */}
            {activeReport === 'payments' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-300 text-slate-700 font-bold uppercase text-[10px]">
                      <th className="py-2 px-2">Receipt / Payment #</th>
                      <th className="py-2 px-2">Invoice #</th>
                      <th className="py-2 px-2">Customer</th>
                      <th className="py-2 px-2">Date</th>
                      <th className="py-2 px-2">Method</th>
                      <th className="py-2 px-2">Reference</th>
                      <th className="py-2 px-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {reportData?.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-2 font-bold text-blue-600">{p.payment_number}</td>
                        <td className="py-2 px-2 text-slate-800">{p.invoices?.invoice_number || '—'}</td>
                        <td className="py-2 px-2 font-sans font-medium text-slate-800">{p.customers?.full_name}</td>
                        <td className="py-2 px-2">{p.payment_date}</td>
                        <td className="py-2 px-2 uppercase">{p.payment_method}</td>
                        <td className="py-2 px-2 text-slate-500">{p.reference_number || '—'}</td>
                        <td className="py-2 px-2 text-right font-bold text-emerald-600">
                          ₹{Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* REPORT 4: EXPENSE ANALYSIS */}
            {activeReport === 'expenses' && (
              <div className="space-y-6">
                {/* Category Aggregates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.keys(reportData?.categorySummary || {}).map((cat) => {
                    const c = reportData.categorySummary[cat];
                    return (
                      <div key={cat} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                          {cat}
                        </span>
                        <div className="text-lg font-bold font-mono text-purple-700 mt-1">
                          ₹{Number(c.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {c.count} vouchers
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vouchers Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-300 text-slate-700 font-bold uppercase text-[10px]">
                        <th className="py-2 px-2">Expense #</th>
                        <th className="py-2 px-2">Category</th>
                        <th className="py-2 px-2">Payee Name</th>
                        <th className="py-2 px-2">Company</th>
                        <th className="py-2 px-2">Date</th>
                        <th className="py-2 px-2">Method</th>
                        <th className="py-2 px-2 text-right">Total (₹)</th>
                        <th className="py-2 px-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {reportData?.rawExpenses?.map((e, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2 px-2 font-bold text-slate-800">{e.expense_number}</td>
                          <td className="py-2 px-2 font-sans font-medium text-slate-800">{e.category}</td>
                          <td className="py-2 px-2 font-sans text-slate-700">{e.payee_name}</td>
                          <td className="py-2 px-2 font-sans text-slate-600">{e.companies?.name}</td>
                          <td className="py-2 px-2">{e.expense_date}</td>
                          <td className="py-2 px-2 uppercase">{e.payment_method}</td>
                          <td className="py-2 px-2 text-right font-bold text-slate-900">
                            ₹{Number(e.total_amount).toFixed(2)}
                          </td>
                          <td className="py-2 px-2 text-center uppercase text-[10px]">{e.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* REPORT 5: INCOME VS EXPENSE */}
            {activeReport === 'income_vs_expense' && (
              <div className="max-w-xl mx-auto space-y-4 font-mono">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-200">
                    <span className="font-sans font-semibold text-slate-700">Collected Income:</span>
                    <span className="text-emerald-600 font-bold text-base">
                      ₹{Number(reportData?.totalIncome || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-200">
                    <span className="font-sans font-semibold text-slate-700">Paid Operating Expenses:</span>
                    <span className="text-purple-600 font-bold text-base">
                      -₹{Number(reportData?.totalExpense || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-t-2 border-slate-400 text-lg">
                    <span className="font-sans font-bold text-slate-900">Net Operating Cash Position:</span>
                    <span className={`font-black ${reportData?.netPosition >= 0 ? 'text-teal-600' : 'text-rose-600'}`}>
                      ₹{Number(reportData?.netPosition || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="p-3 text-center text-xs text-slate-400 font-mono">
                  Calculated from {reportData?.paymentCount || 0} received payments and {reportData?.expenseCount || 0} paid expenses.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
