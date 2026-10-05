import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { getStockAdjustments, StockAdjustmentTable } from '../../features/inventory';
import { Sliders, Plus, RefreshCw } from 'lucide-react';

export default function StockAdjustmentList() {
  const { currentCompanyId, isAllCompanies } = useCompany();

  const [adjustments, setAdjustments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadAdjustments = useCallback(async () => {
    setIsLoading(true);
    try {
      const targetCompanyId = isAllCompanies ? null : currentCompanyId;
      const res = await getStockAdjustments({
        companyId: targetCompanyId,
        isAllCompanies,
        status: statusFilter,
        page,
        pageSize: 20
      });
      setAdjustments(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.count || 0);
    } catch (err) {
      console.error('Error loading adjustments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentCompanyId, isAllCompanies, statusFilter, page]);

  useEffect(() => {
    loadAdjustments();
  }, [loadAdjustments]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-7 h-7 text-blue-600" />
            Stock Adjustments & Reconciliation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Physical stock counts, damage write-offs, shrinkage reconciliation, and opening balances with approval controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAdjustments}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <Link
            to="/admin/inventory/adjustments/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Adjustment
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600">Filter by Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted for Approval</option>
          <option value="approved">Approved & Applied</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <StockAdjustmentTable
        adjustments={adjustments}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
      />
    </div>
  );
}
