import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import {
  getInventoryDashboardStats,
  isCompanyInventoryEligible,
  getInventoryBalances
} from '../../features/inventory/inventoryService';
import {
  Package,
  Layers,
  DollarSign,
  AlertTriangle,
  XCircle,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Warehouse,
  Truck,
  Sliders,
  History,
  FileBarChart,
  RefreshCw,
  Plus,
  Info
} from 'lucide-react';

export default function InventoryDashboard() {
  const { currentCompany, currentCompanyId, isAllCompanies } = useCompany();

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeSKUs: 0,
    totalStockValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    todayStockIn: 0,
    todayStockOut: 0,
    fastMovingProducts: []
  });

  const [lowStockList, setLowStockList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isEligible = isCompanyInventoryEligible(currentCompany?.slug);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const targetCompanyId = isAllCompanies ? null : currentCompanyId;
      const [statsData, lowStockData] = await Promise.all([
        getInventoryDashboardStats(targetCompanyId),
        getInventoryBalances({ companyId: targetCompanyId, lowStockOnly: true, pageSize: 5 })
      ]);
      setStats(statsData);
      setLowStockList(lowStockData.data || []);
    } catch (err) {
      console.error('Error loading inventory dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentCompanyId, isAllCompanies]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-7 h-7 text-blue-600" />
            Inventory & Stock Operations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time warehouse stock valuation, goods receipts, movements ledger, and low-stock controls.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
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
            <Truck className="w-3.5 h-3.5" />
            Receive Stock (GRN)
          </Link>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Product
          </Link>
        </div>
      </div>

      {/* Service Company Informational Notice (Section 48) */}
      {!isAllCompanies && !isEligible && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <p className="font-semibold mb-0.5">
              Inventory tracking is not enabled for {currentCompany?.name || 'this company'}.
            </p>
            <p className="text-amber-700">
              Pure service-oriented entities (e.g. Consultancy, Insurance, Tech Solutions) provide billable services without maintaining physical warehouse stock. For product-based operations, switch to <strong>Jay Murlidhar Mobile & Accessories</strong> or <strong>Jay Murlidhar Computer</strong>.
            </p>
          </div>
        </div>
      )}

      {/* 8 Authoritative Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Products */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {stats.totalProducts}
            </span>
            <span className="text-[11px] text-slate-400">catalog items</span>
          </div>
        </div>

        {/* 2. Active SKUs */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active SKUs</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {stats.activeSKUs}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">active tracking</span>
          </div>
        </div>

        {/* 3. Total Stock Value */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Stock Value</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">
              ₹{Number(stats.totalStockValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">Weighted Moving Average</span>
        </div>

        {/* 4. Low Stock Items */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Low Stock Items</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-600">
              {stats.lowStockItems}
            </span>
            <span className="text-[11px] text-slate-400">below reorder level</span>
          </div>
        </div>

        {/* 5. Out of Stock Items */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Out of Stock</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-600">
              {stats.outOfStockItems}
            </span>
            <span className="text-[11px] text-slate-400">zero on-hand</span>
          </div>
        </div>

        {/* 6. Today's Stock In */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Today's Stock In</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-teal-600">
              +{stats.todayStockIn}
            </span>
            <span className="text-[11px] text-slate-400">units received</span>
          </div>
        </div>

        {/* 7. Today's Stock Out */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Today's Stock Out</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-purple-600">
              -{stats.todayStockOut}
            </span>
            <span className="text-[11px] text-slate-400">units issued</span>
          </div>
        </div>

        {/* 8. Fast Moving Products */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Movement Velocity</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-blue-600">
              Active
            </span>
            <span className="text-[11px] text-slate-400">real-time sync</span>
          </div>
        </div>
      </div>

      {/* Navigation Quick Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link
          to="/admin/products"
          className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group transition-colors"
        >
          <Package className="w-5 h-5 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-slate-800">Products</span>
        </Link>

        <Link
          to="/admin/warehouses"
          className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group transition-colors"
        >
          <Warehouse className="w-5 h-5 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-slate-800">Warehouses</span>
        </Link>

        <Link
          to="/admin/inventory/receipts"
          className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group transition-colors"
        >
          <Truck className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-slate-800">Goods Receipts</span>
        </Link>

        <Link
          to="/admin/inventory/adjustments"
          className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group transition-colors"
        >
          <Sliders className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-slate-800">Adjustments</span>
        </Link>

        <Link
          to="/admin/inventory/movements"
          className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group transition-colors"
        >
          <History className="w-5 h-5 text-purple-600 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-slate-800">Stock Ledger</span>
        </Link>

        <Link
          to="/admin/reports/inventory"
          className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group transition-colors"
        >
          <FileBarChart className="w-5 h-5 text-rose-600 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-slate-800">Stock Reports</span>
        </Link>
      </div>

      {/* Low Stock Alerts Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Critical Low Stock Items
          </h3>
          <Link
            to="/admin/reports/inventory?tab=low_stock"
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            View Complete Low Stock Report &rarr;
          </Link>
        </div>

        {lowStockList.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            All inventory levels are above reorder thresholds. No immediate procurement action required.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Warehouse</th>
                  <th className="py-2.5 px-3 text-right">Available</th>
                  <th className="py-2.5 px-3 text-right">Reorder Level</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowStockList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {item.products?.product_name || '—'}
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {item.products?.product_code}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {item.warehouses?.warehouse_name || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                      {item.quantity_available} {item.products?.unit_code || 'PCS'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      {item.products?.reorder_level || 0}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        Reorder Needed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
