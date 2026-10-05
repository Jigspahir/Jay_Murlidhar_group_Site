import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { getWarehouses, WarehouseTable } from '../../features/inventory';
import { Warehouse, Plus, RefreshCw } from 'lucide-react';

export default function WarehouseList() {
  const { currentCompanyId, isAllCompanies } = useCompany();

  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadWarehouses = useCallback(async () => {
    setIsLoading(true);
    try {
      const targetCompanyId = isAllCompanies ? null : currentCompanyId;
      const res = await getWarehouses({
        companyId: targetCompanyId,
        isAllCompanies,
        page,
        pageSize: 20
      });
      setWarehouses(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.count || 0);
    } catch (err) {
      console.error('Error loading warehouses:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentCompanyId, isAllCompanies, page]);

  useEffect(() => {
    loadWarehouses();
  }, [loadWarehouses]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Warehouse className="w-7 h-7 text-blue-600" />
            Warehouse Master
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Physical stock locations, godowns, retail counters, and distribution centers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadWarehouses}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <Link
            to="/admin/warehouses/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Warehouse
          </Link>
        </div>
      </div>

      <WarehouseTable
        warehouses={warehouses}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
      />
    </div>
  );
}
