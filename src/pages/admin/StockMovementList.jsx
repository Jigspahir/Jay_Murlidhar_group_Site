import React, { useState, useEffect, useCallback } from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import {
  getStockMovements,
  getWarehouses,
  MOVEMENT_TYPES,
  StockMovementTable
} from '../../features/inventory';
import { History, Filter, RefreshCw } from 'lucide-react';

export default function StockMovementList() {
  const { currentCompanyId, isAllCompanies } = useCompany();

  const [movements, setMovements] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [movementTypeFilter, setMovementTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const targetCompanyId = isAllCompanies ? null : currentCompanyId;

      const [movRes, whRes] = await Promise.all([
        getStockMovements({
          companyId: targetCompanyId,
          isAllCompanies,
          warehouseId: warehouseFilter,
          movementType: movementTypeFilter,
          page,
          pageSize: 25
        }),
        getWarehouses({ companyId: targetCompanyId, pageSize: 50 })
      ]);

      setMovements(movRes.data || []);
      setTotalPages(movRes.totalPages || 1);
      setTotalCount(movRes.count || 0);
      setWarehouses(whRes.data || []);
    } catch (err) {
      console.error('Error loading stock movements:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentCompanyId, isAllCompanies, warehouseFilter, movementTypeFilter, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-7 h-7 text-blue-600" />
            Stock Movement Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable, append-only transaction audit trail &bull; Inward receipts, sales issues, reversals, and adjustments.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Ledger
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={warehouseFilter}
            onChange={(e) => {
              setWarehouseFilter(e.target.value);
              setPage(1);
            }}
            className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Warehouses</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.warehouse_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
          <select
            value={movementTypeFilter}
            onChange={(e) => {
              setMovementTypeFilter(e.target.value);
              setPage(1);
            }}
            className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Movement Types</option>
            {MOVEMENT_TYPES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label} ({m.direction.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <StockMovementTable
        movements={movements}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
      />
    </div>
  );
}
