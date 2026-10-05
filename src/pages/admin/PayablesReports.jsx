import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { payablesService } from '../../features/finance';
import { vendorService } from '../../features/vendors';
import {
  FileSpreadsheet,
  Printer,
  Calendar,
  Building2,
  RefreshCw,
  Clock,
  Receipt,
  ShoppingBag,
  CreditCard,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export default function PayablesReports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'aging';

  const { currentCompany, currentCompanyId, isAllCompanies, availableCompanies } = useCompany();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [scopedCompanyFilter, setScopedCompanyFilter] = useState('');
  const [datePreset, setDatePreset] = useState('this_month');

  // Date ranges
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Selected vendor for statement
  const [vendorsList, setVendorsList] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState('');

  // Report Data States
  const [reportData, setReportData] = useState([]);
  const [vendorStatementData, setVendorStatementData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const effectiveCompanyId = isAllCompanies
    ? (scopedCompanyFilter === 'all' ? null : scopedCompanyFilter || null)
    : currentCompanyId;

  // Apply Date Preset
  const applyPreset = useCallback((preset) => {
    setDatePreset(preset);
    const now = new Date();
    let from = new Date();
    let to = new Date();

    switch (preset) {
      case 'today':
        from = new Date();
        to = new Date();
        break;
      case 'this_week': {
        const first = now.getDate() - now.getDay();
        from = new Date(now.setDate(first));
        to = new Date();
        break;
      }
      case 'this_month':
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'prev_month':
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        to = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'this_quarter': {
        const qMonth = Math.floor(now.getMonth() / 3) * 3;
        from = new Date(now.getFullYear(), qMonth, 1);
        to = new Date(now.getFullYear(), qMonth + 3, 0);
        break;
      }
      case 'this_fy': {
        const currentYear = now.getFullYear();
        const fyStartYear = now.getMonth() >= 3 ? currentYear : currentYear - 1;
        from = new Date(fyStartYear, 3, 1);
        to = new Date(fyStartYear + 1, 2, 31);
        break;
      }
      default:
        return;
    }

    setDateFrom(from.toISOString().split('T')[0]);
    setDateTo(to.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    applyPreset('this_month');
  }, [applyPreset]);

  // Load vendors for Vendor Statement dropdown
  useEffect(() => {
    async function loadVendors() {
      try {
        const { vendors } = await vendorService.getVendors({
          companyId: effectiveCompanyId,
          pageSize: 200
        });
        setVendorsList(vendors || []);
        if (vendors?.length && !selectedVendorId) {
          setSelectedVendorId(vendors[0].id);
        }
      } catch (err) {
        console.error('Error loading vendors:', err);
      }
    }
    loadVendors();
  }, [effectiveCompanyId, selectedVendorId]);

  // Fetch Report
  const loadReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === 'aging') {
        const data = await payablesService.getPayablesAging(effectiveCompanyId);
        setReportData(data.agingDetails || []);
      } else if (activeTab === 'purchase_register') {
        const data = await payablesService.getPurchaseRegister({
          companyId: effectiveCompanyId,
          dateFrom,
          dateTo
        });
        setReportData(data || []);
      } else if (activeTab === 'po_register') {
        const data = await payablesService.getPurchaseOrderRegister({
          companyId: effectiveCompanyId,
          dateFrom,
          dateTo
        });
        setReportData(data || []);
      } else if (activeTab === 'payment_ledger') {
        const data = await payablesService.getDisbursementLedger({
          companyId: effectiveCompanyId,
          dateFrom,
          dateTo
        });
        setReportData(data || []);
      } else if (activeTab === 'vendor_statement') {
        if (!selectedVendorId) {
          setVendorStatementData(null);
          return;
        }
        const data = await vendorService.getVendorStatement(selectedVendorId, dateFrom, dateTo);
        setVendorStatementData(data);
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.message || 'Failed to fetch report');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, effectiveCompanyId, dateFrom, dateTo, selectedVendorId]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // CSV Export for each report type
  const handleExportCSV = () => {
    let headers = [];
    let rows = [];
    let filename = `Report_${activeTab}_${dateFrom}_to_${dateTo}.csv`;

    if (activeTab === 'aging') {
      headers = ['Vendor', 'Company', 'Bill Number', 'Vendor Invoice Number', 'Bill Date', 'Due Date', 'Total', 'Paid', 'Balance', 'Aging Bucket', 'Status'];
      rows = reportData.map((r) => [
        `"${r.vendor_name || ''}"`,
        `"${r.company_name || ''}"`,
        r.bill_number,
        `"${r.vendor_invoice_number || ''}"`,
        r.bill_date,
        r.due_date,
        r.total_amount.toFixed(2),
        r.amount_paid.toFixed(2),
        r.balance_due.toFixed(2),
        r.bucket,
        r.status
      ]);
    } else if (activeTab === 'purchase_register') {
      headers = ['Bill Number', 'Vendor Invoice Number', 'Vendor', 'Company', 'Bill Date', 'Taxable Amount', 'CGST', 'SGST', 'IGST', 'Total', 'Vendor GSTIN', 'Payment Status'];
      rows = reportData.map((r) => [
        r.bill_number,
        `"${r.vendor_invoice_number || ''}"`,
        `"${r.vendor_name || ''}"`,
        `"${r.company_name || ''}"`,
        r.bill_date,
        r.taxable_amount.toFixed(2),
        r.cgst_amount.toFixed(2),
        r.sgst_amount.toFixed(2),
        r.igst_amount.toFixed(2),
        r.total_amount.toFixed(2),
        r.vendor_gstin || '',
        r.payment_status
      ]);
    } else if (activeTab === 'po_register') {
      headers = ['PO Number', 'Vendor', 'Company', 'PO Date', 'Total Amount', 'Billed Amount', 'Outstanding Commitment', 'Status'];
      rows = reportData.map((r) => [
        r.po_number,
        `"${r.vendor_name || ''}"`,
        `"${r.company_name || ''}"`,
        r.po_date,
        r.total_amount.toFixed(2),
        r.billed_amount.toFixed(2),
        r.outstanding_commitment.toFixed(2),
        r.status
      ]);
    } else if (activeTab === 'payment_ledger') {
      headers = ['Payment Number', 'Vendor', 'Bill Number', 'Company', 'Payment Date', 'Method', 'Reference', 'Amount'];
      rows = reportData.map((r) => [
        r.payment_number,
        `"${r.vendor_name || ''}"`,
        r.bill_number,
        `"${r.company_name || ''}"`,
        r.payment_date,
        r.payment_method,
        `"${r.reference_number || ''}"`,
        r.amount.toFixed(2)
      ]);
    } else if (activeTab === 'vendor_statement' && vendorStatementData) {
      headers = ['Date', 'Type', 'Reference', 'Debit (Payment)', 'Credit (Bill)', 'Running Balance'];
      rows = vendorStatementData.transactions.map((t) => [
        t.date,
        t.type,
        `"${t.reference || ''}"`,
        t.debit.toFixed(2),
        t.credit.toFixed(2),
        t.balance.toFixed(2)
      ]);
    }

    if (!rows.length) return;
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Payables & Procurement Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Authoritative financial reports, statutory tax registries, aging schedules, and vendor statements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadReport}
            disabled={isLoading}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            title="Refresh report"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex overflow-x-auto gap-2">
        <button
          onClick={() => handleTabChange('aging')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'aging'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Clock className="w-4 h-4" />
          1. Payables Aging
        </button>

        <button
          onClick={() => handleTabChange('purchase_register')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'purchase_register'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Receipt className="w-4 h-4" />
          2. Purchase Register (Input Tax)
        </button>

        <button
          onClick={() => handleTabChange('vendor_statement')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'vendor_statement'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          3. Vendor Statement
        </button>

        <button
          onClick={() => handleTabChange('po_register')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'po_register'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          4. Purchase Order Register
        </button>

        <button
          onClick={() => handleTabChange('payment_ledger')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'payment_ledger'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          5. Vendor Payment Ledger
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Company Selector (if All Companies) */}
          {isAllCompanies && (
            <div className="min-w-[180px]">
              <label className="text-xs text-slate-400 block mb-1">Company Scope</label>
              <select
                value={scopedCompanyFilter}
                onChange={(e) => setScopedCompanyFilter(e.target.value)}
                className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">All Group Companies</option>
                {availableCompanies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Vendor picker if Vendor Statement tab */}
          {activeTab === 'vendor_statement' && (
            <div className="min-w-[220px]">
              <label className="text-xs text-slate-400 block mb-1">Select Vendor</label>
              <select
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                {vendorsList.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vendor_code} - {v.legal_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Presets (except aging which is as-of-today) */}
          {activeTab !== 'aging' && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Period Preset</label>
              <select
                value={datePreset}
                onChange={(e) => applyPreset(e.target.value)}
                className="py-1.5 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="prev_month">Previous Month</option>
                <option value="this_quarter">This Quarter</option>
                <option value="this_fy">This Financial Year (Apr-Mar)</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          )}

          {/* Custom Date Pickers */}
          {activeTab !== 'aging' && (
            <>
              <div>
                <label className="text-xs text-slate-400 block mb-1">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDatePreset('custom');
                    setDateFrom(e.target.value);
                  }}
                  className="py-1.5 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDatePreset('custom');
                    setDateTo(e.target.value);
                  }}
                  className="py-1.5 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </>
          )}

          <div className="self-end pb-0.5">
            <button
              onClick={loadReport}
              disabled={isLoading}
              className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={loadReport} className="ml-auto underline font-medium">Retry</button>
        </div>
      )}

      {/* Report Tables Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Report 1: Payables Aging */}
        {activeTab === 'aging' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-sans text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Bill Number</th>
                  <th className="px-4 py-3">Vendor Inv #</th>
                  <th className="px-4 py-3">Bill Date</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Paid</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                  <th className="px-4 py-3 text-center">Bucket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr><td colSpan="10" className="py-12 text-center text-slate-400 font-sans">Generating aging schedule...</td></tr>
                ) : !reportData.length ? (
                  <tr><td colSpan="10" className="py-12 text-center text-slate-400 font-sans">No outstanding supplier bills found.</td></tr>
                ) : (
                  reportData.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-white">{r.vendor_name}</td>
                      <td className="px-4 py-3 font-sans text-slate-500">{r.company_name}</td>
                      <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-semibold">{r.bill_number}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{r.vendor_invoice_number}</td>
                      <td className="px-4 py-3 text-slate-500">{r.bill_date}</td>
                      <td className="px-4 py-3 text-slate-500">{r.due_date}</td>
                      <td className="px-4 py-3 text-right">₹{r.total_amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-emerald-600">₹{r.amount_paid.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-bold text-rose-600">₹{r.balance_due.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center font-sans">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          r.bucket === 'current'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : r.bucket === 'days_1_15'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}>
                          {r.bucket?.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Report 2: Purchase Register */}
        {activeTab === 'purchase_register' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-sans text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Bill Number</th>
                  <th className="px-4 py-3">Vendor Inv #</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Taxable</th>
                  <th className="px-4 py-3 text-right">CGST</th>
                  <th className="px-4 py-3 text-right">SGST</th>
                  <th className="px-4 py-3 text-right">IGST</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">GSTIN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr><td colSpan="11" className="py-12 text-center text-slate-400 font-sans">Generating purchase register...</td></tr>
                ) : !reportData.length ? (
                  <tr><td colSpan="11" className="py-12 text-center text-slate-400 font-sans">No supplier bills found in this period.</td></tr>
                ) : (
                  reportData.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-semibold">{r.bill_number}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{r.vendor_invoice_number}</td>
                      <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-white">{r.vendor_name}</td>
                      <td className="px-4 py-3 font-sans text-slate-500">{r.company_name}</td>
                      <td className="px-4 py-3 text-slate-500">{r.bill_date}</td>
                      <td className="px-4 py-3 text-right">₹{r.taxable_amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">₹{r.cgst_amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">₹{r.sgst_amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">₹{r.igst_amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">₹{r.total_amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{r.vendor_gstin || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Report 3: Vendor Statement */}
        {activeTab === 'vendor_statement' && (
          <div className="space-y-4">
            {vendorStatementData && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block font-sans">Opening Balance</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    ₹{vendorStatementData.openingBalance.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">Total Bills</span>
                  <span className="font-bold text-rose-600 text-sm">
                    ₹{vendorStatementData.totalBills.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">Total Disbursed</span>
                  <span className="font-bold text-emerald-600 text-sm">
                    ₹{vendorStatementData.totalPayments.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">Closing Balance Due</span>
                  <span className="font-bold text-indigo-600 text-sm">
                    ₹{vendorStatementData.closingBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-slate-800/60 font-sans text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3 text-right">Debit (Payment Out)</th>
                    <th className="px-4 py-3 text-right">Credit (Bill Due)</th>
                    <th className="px-4 py-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {isLoading ? (
                    <tr><td colSpan="6" className="py-12 text-center text-slate-400 font-sans">Loading vendor statement...</td></tr>
                  ) : !vendorStatementData?.transactions?.length ? (
                    <tr><td colSpan="6" className="py-12 text-center text-slate-400 font-sans">No transactions recorded for this vendor.</td></tr>
                  ) : (
                    vendorStatementData.transactions.map((t, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t.date}</td>
                        <td className="px-4 py-3 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            t.type === 'BILL'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{t.reference}</td>
                        <td className="px-4 py-3 text-right text-emerald-600">
                          {t.debit > 0 ? `₹${t.debit.toFixed(2)}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right text-rose-600">
                          {t.credit > 0 ? `₹${t.credit.toFixed(2)}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">
                          ₹{t.balance.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Report 4: Purchase Order Register */}
        {activeTab === 'po_register' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-sans text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">PO Number</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">PO Date</th>
                  <th className="px-4 py-3 text-right">Total Amount</th>
                  <th className="px-4 py-3 text-right">Billed Amount</th>
                  <th className="px-4 py-3 text-right">Outstanding Commitment</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr><td colSpan="8" className="py-12 text-center text-slate-400 font-sans">Generating PO register...</td></tr>
                ) : !reportData.length ? (
                  <tr><td colSpan="8" className="py-12 text-center text-slate-400 font-sans">No purchase orders found in this period.</td></tr>
                ) : (
                  reportData.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-semibold">{r.po_number}</td>
                      <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-white">{r.vendor_name}</td>
                      <td className="px-4 py-3 font-sans text-slate-500">{r.company_name}</td>
                      <td className="px-4 py-3 text-slate-500">{r.po_date}</td>
                      <td className="px-4 py-3 text-right">₹{r.total_amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-emerald-600">₹{r.billed_amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-bold text-indigo-600">₹{r.outstanding_commitment.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center font-sans capitalize">{r.status?.replace('_', ' ')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Report 5: Vendor Payment Ledger */}
        {activeTab === 'payment_ledger' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-sans text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Payment Number</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Bill Number</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Payment Date</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3 text-right">Amount Disbursed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr><td colSpan="8" className="py-12 text-center text-slate-400 font-sans">Generating payment ledger...</td></tr>
                ) : !reportData.length ? (
                  <tr><td colSpan="8" className="py-12 text-center text-slate-400 font-sans">No vendor payments recorded in this period.</td></tr>
                ) : (
                  reportData.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-semibold">{r.payment_number}</td>
                      <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-white">{r.vendor_name}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{r.bill_number}</td>
                      <td className="px-4 py-3 font-sans text-slate-500">{r.company_name}</td>
                      <td className="px-4 py-3 text-slate-500">{r.payment_date}</td>
                      <td className="px-4 py-3 uppercase text-[11px] text-slate-700 dark:text-slate-300 font-sans">{r.payment_method?.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-slate-500">{r.reference_number || '—'}</td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-600">₹{r.amount.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
