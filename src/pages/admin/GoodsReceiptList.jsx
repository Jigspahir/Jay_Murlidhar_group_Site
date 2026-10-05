import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { getGoodsReceipts, GoodsReceiptTable } from '../../features/inventory';
import { Truck, Plus, RefreshCw, Search } from 'lucide-react';

export default function GoodsReceiptList() {
  const { currentCompanyId, isAllCompanies } = useCompany();

  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadReceipts = useCallback(async () => {
    setIsLoading(true);
    try {
      const targetCompanyId = isAllCompanies ? null : currentCompanyId;
      const res = await getGoodsReceipts({
        companyId: targetCompanyId,
        isAllCompanies,
        status: statusFilter,
        search: searchTerm,
        page,
        pageSize: 20
      });
      setReceipts(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.count || 0);
    } catch (err) {
      console.error('Error loading goods receipts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentCompanyId, isAllCompanies, statusFilter, searchTerm, page]);

  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-7 h-7 text-blue-600" />
            Goods Receipts (GRN)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Stock Inward records &bull; Verified goods receipts from purchase orders and direct vendor deliveries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadReceipts}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <Link
            to="/admin/inventory/receipts/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Stock Inward
          </Link>
        </div>
      </div>

      {/* Filter strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by GRN Number, Challan, Notes..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft Receipts</option>
            <option value="received">Received (Posted)</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <GoodsReceiptTable
        receipts={receipts}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
      />
    </div>
  );
}
