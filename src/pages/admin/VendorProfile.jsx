import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { vendorService } from '../../features/vendors';
import {
  ArrowLeft,
  Truck,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Copy,
  AlertCircle,
  ExternalLink,
  Edit,
  DollarSign,
  Printer,
  FileSpreadsheet,
  Receipt
} from 'lucide-react';

export default function VendorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { availableCompanies, isGroupOwner } = useCompany();
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(PERMISSIONS.VENDORS_EDIT);

  const [vendor, setVendor] = useState(null);
  const [statement, setStatement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tabs: 'statement', 'bills', 'orders', 'clone'
  const [activeTab, setActiveTab] = useState('statement');

  // Statement date range
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isLoadingStatement, setIsLoadingStatement] = useState(false);

  // Clone vendor modal/state
  const [targetCompanyId, setTargetCompanyId] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const [cloneError, setCloneError] = useState(null);
  const [cloneSuccess, setCloneSuccess] = useState(null);

  const fetchVendor = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vendorService.getVendorById(id);
      setVendor(data);
    } catch (err) {
      console.error('Error fetching vendor:', err);
      setError(err.message || 'Vendor not found or access denied');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchStatement = useCallback(async () => {
    if (!id) return;
    setIsLoadingStatement(true);
    try {
      const data = await vendorService.getVendorStatement(id, startDate, endDate);
      setStatement(data);
    } catch (err) {
      console.error('Error fetching vendor statement:', err);
    } finally {
      setIsLoadingStatement(false);
    }
  }, [id, startDate, endDate]);

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  useEffect(() => {
    if (vendor) {
      fetchStatement();
    }
  }, [vendor, fetchStatement]);

  const handleCloneVendor = async (e) => {
    e.preventDefault();
    if (!targetCompanyId) return;
    setIsCloning(true);
    setCloneError(null);
    setCloneSuccess(null);
    try {
      const cloned = await vendorService.cloneVendorToCompany(id, targetCompanyId);
      setCloneSuccess(`Successfully provisioned vendor to company as ${cloned.vendor_code}`);
      setTimeout(() => {
        navigate(`/admin/vendors/${cloned.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error cloning vendor:', err);
      setCloneError(err.message || 'Failed to clone vendor');
    } finally {
      setIsCloning(false);
    }
  };

  const exportStatementCSV = () => {
    if (!statement || !statement.transactions.length) return;
    const headers = ['Date', 'Type', 'Reference', 'Debit (Payment)', 'Credit (Bill)', 'Running Balance'];
    const rows = statement.transactions.map((t) => [
      t.date,
      t.type === 'BILL' ? 'Supplier Bill' : 'Vendor Payment',
      `"${t.reference || ''}"`,
      t.debit > 0 ? t.debit.toFixed(2) : '0.00',
      t.credit > 0 ? t.credit.toFixed(2) : '0.00',
      t.balance.toFixed(2)
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${vendor.vendor_code}_Statement_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent" />
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Loading vendor details...</p>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Vendor Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{error || 'Unable to access vendor details.'}</p>
        <Link
          to="/admin/vendors"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vendors
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/vendors"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{vendor.legal_name}</h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                {vendor.vendor_code}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                vendor.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : vendor.status === 'blacklisted'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {vendor.status}
              </span>
            </div>
            {vendor.trade_name && (
              <p className="text-sm text-slate-500 dark:text-slate-400">Trade: {vendor.trade_name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <Link
              to={`/admin/vendors/${vendor.id}/edit`}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm"
            >
              <Edit className="w-4 h-4" />
              Edit Vendor
            </Link>
          )}

          <Link
            to={`/admin/purchase-orders/new?vendor_id=${vendor.id}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <FileText className="w-4 h-4" />
            Create PO
          </Link>

          <Link
            to={`/admin/purchase-bills/new?vendor_id=${vendor.id}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            <Receipt className="w-4 h-4" />
            Direct Bill
          </Link>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Company & Ownership Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-500" />
            Company & Terms
          </h3>
          <div className="space-y-2.5 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Owner Company</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {vendor.companies?.name || 'Assigned Company'}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Vendor Category</span>
              <span className="capitalize font-medium text-slate-800 dark:text-slate-200">
                {vendor.vendor_type?.replace(/_/g, ' ') || 'General'}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Payment Terms</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {vendor.payment_terms_days} Days Net
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Address Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            Contact & Address
          </h3>
          <div className="space-y-2 text-sm">
            {vendor.contact_person && (
              <div className="font-medium text-slate-900 dark:text-white">
                {vendor.contact_person}
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Phone className="w-3.5 h-3.5" />
              <span>{vendor.phone}</span>
              {vendor.alternate_phone && <span className="text-xs text-slate-400">/ {vendor.alternate_phone}</span>}
            </div>
            {vendor.email && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Mail className="w-3.5 h-3.5" />
                <span>{vendor.email}</span>
              </div>
            )}
            <div className="text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
              {vendor.billing_address}, {vendor.billing_city}, {vendor.billing_state} - {vendor.billing_postal_code}
            </div>
          </div>
        </div>

        {/* Statutory & Bank Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-500" />
            Tax & Banking Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">GSTIN:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {vendor.gstin || 'Not Provided'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">PAN:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {vendor.pan || 'Not Provided'}
              </span>
            </div>
            {vendor.bank_name && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <div>Bank: <strong className="text-slate-800 dark:text-slate-200">{vendor.bank_name}</strong></div>
                {vendor.bank_account_no && <div>A/C: <span className="font-mono">{vendor.bank_account_no}</span></div>}
                {vendor.bank_ifsc && <div>IFSC: <span className="font-mono">{vendor.bank_ifsc}</span></div>}
                {vendor.upi_id && <div>UPI: <span className="font-mono">{vendor.upi_id}</span></div>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('statement')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'statement'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Statement of Account
          </button>

          {isGroupOwner && (
            <button
              onClick={() => setActiveTab('clone')}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'clone'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Copy className="w-4 h-4" />
              Provision to Another Company
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Statement of Account */}
      {activeTab === 'statement' && (
        <div className="space-y-6">
          {/* Statement Controls */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">From Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-xs rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">To Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-xs rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5"
                />
              </div>
              <button
                onClick={fetchStatement}
                disabled={isLoadingStatement}
                className="mt-4 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Apply
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportStatementCSV}
                disabled={!statement || !statement.transactions.length}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Export CSV
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Statement
              </button>
            </div>
          </div>

          {/* Statement Balance Summary */}
          {statement && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <span className="text-xs text-slate-400 block font-medium">Opening Balance</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  ₹{statement.openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <span className="text-xs text-slate-400 block font-medium">Total Bills (Credit)</span>
                <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                  ₹{statement.totalBills.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <span className="text-xs text-slate-400 block font-medium">Total Paid (Debit)</span>
                <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{statement.totalPayments.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <span className="text-xs text-slate-400 block font-medium">Closing Payable Balance</span>
                <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  ₹{statement.closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

          {/* Statement Transactions Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Reference / Number</th>
                    <th className="px-4 py-3 text-right">Debit (Payment Out)</th>
                    <th className="px-4 py-3 text-right">Credit (Bill Due)</th>
                    <th className="px-4 py-3 text-right">Running Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                  {isLoadingStatement ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400">
                        Calculating statement ledger...
                      </td>
                    </tr>
                  ) : statement?.transactions?.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400">
                        No transactions recorded for this vendor in the selected period.
                      </td>
                    </tr>
                  ) : (
                    statement?.transactions?.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-sans">
                          {new Date(t.date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            t.type === 'BILL'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          }`}>
                            {t.type === 'BILL' ? 'Supplier Bill' : 'Vendor Payment'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                          {t.reference}
                        </td>
                        <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                          {t.debit > 0 ? `₹${t.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right text-rose-600 dark:text-rose-400 font-semibold">
                          {t.credit > 0 ? `₹${t.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">
                          ₹{t.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Clone / Provision to Another Company (Group Owner Only) */}
      {activeTab === 'clone' && isGroupOwner && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl space-y-6 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Copy className="w-5 h-5 text-indigo-600" />
              Provision Vendor to Another Company
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Per strict JMG architecture, vendors are isolated per company. You can copy statutory and contact details to establish an independent vendor record in another company.
            </p>
          </div>

          {cloneError && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{cloneError}</span>
            </div>
          )}

          {cloneSuccess && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-sm">
              {cloneSuccess}
            </div>
          )}

          <form onSubmit={handleCloneVendor} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Destination Company
              </label>
              <select
                value={targetCompanyId}
                onChange={(e) => setTargetCompanyId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white"
              >
                <option value="">-- Choose Target Company --</option>
                {availableCompanies
                  .filter((c) => c.id !== vendor.company_id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isCloning || !targetCompanyId}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isCloning ? 'Provisioning...' : 'Provision Vendor Record'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
