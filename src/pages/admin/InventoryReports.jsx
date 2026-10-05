import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import {
  getStockSummaryReport,
  getStockLedgerReport,
  getLowStockReport,
  exportReportToCSV
} from '../../features/inventory/inventoryReportService';
import { getWarehouses, getProductCategories, getProducts } from '../../features/inventory';
import {
  FileBarChart,
  Download,
  Printer,
  RefreshCw,
  Filter,
  Package,
  History,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';

export default function InventoryReports() {
  const { currentCompanyId, isAllCompanies } = useCompany();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'summary';

  const [summaryData, setSummaryData] = useState([]);
  const [ledgerData, setLedgerData] = useState([]);
  const [lowStockData, setLowStockData] = useState([]);

  const [warehouses, setWarehouses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  // Load lookup options
  useEffect(() => {
    async function loadLookups() {
      const targetCompanyId = isAllCompanies ? null : currentCompanyId;
      const [whRes, catRes, prodRes] = await Promise.all([
        getWarehouses({ companyId: targetCompanyId, pageSize: 50 }),
        getProductCategories(targetCompanyId),
        getProducts({ companyId: targetCompanyId, pageSize: 100 })
      ]);
      setWarehouses(whRes.data || []);
      setCategories(catRes.data || []);
      setProducts(prodRes.data || []);
    }
    loadLookups();
  }, [currentCompanyId, isAllCompanies]);

  const loadReportData = useCallback(async () => {
    setIsLoading(true);
    try {
      const targetCompanyId = isAllCompanies ? null : currentCompanyId;

      if (activeTab === 'summary') {
        const { data } = await getStockSummaryReport({
          companyId: targetCompanyId,
          warehouseId: warehouseFilter,
          categoryId: categoryFilter
        });
        setSummaryData(data || []);
      } else if (activeTab === 'ledger') {
        const { data } = await getStockLedgerReport({
          companyId: targetCompanyId,
          productId: productFilter,
          warehouseId: warehouseFilter,
          startDate,
          endDate
        });
        setLedgerData(data || []);
      } else if (activeTab === 'low_stock') {
        const { data } = await getLowStockReport({
          companyId: targetCompanyId,
          warehouseId: warehouseFilter
        });
        setLowStockData(data || []);
      }
    } catch (err) {
      console.error('Error loading inventory report:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentCompanyId, isAllCompanies, warehouseFilter, categoryFilter, productFilter, startDate, endDate]);

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleExportCSV = () => {
    if (activeTab === 'summary') {
      exportReportToCSV(summaryData, `stock_summary_${new Date().toISOString().split('T')[0]}.csv`);
    } else if (activeTab === 'ledger') {
      exportReportToCSV(ledgerData, `stock_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    } else if (activeTab === 'low_stock') {
      exportReportToCSV(lowStockData, `low_stock_report_${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileBarChart className="w-7 h-7 text-blue-600" />
            Inventory & Stock Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative stock balances, cardex movement ledger, and low-stock reorder analyses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadReportData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            Export CSV
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 print:hidden">
        <button
          onClick={() => handleTabChange('summary')}
          className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'summary'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          Stock Summary & Valuation
        </button>

        <button
          onClick={() => handleTabChange('ledger')}
          className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'ledger'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          Stock Movement Ledger (Cardex)
        </button>

        <button
          onClick={() => handleTabChange('low_stock')}
          className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'low_stock'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Low Stock & Reorder Exceptions
        </button>
      </div>

      {/* Report Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center gap-3 print:hidden">
        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
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

        {activeTab === 'summary' && (
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeTab === 'ledger' && (
          <>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="all">All Products</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.product_code} - {p.product_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none"
                placeholder="From Date"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none"
                placeholder="To Date"
              />
            </div>
          </>
        )}
      </div>

      {/* REPORT CONTENT AREA */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-medium text-slate-500">Generating report tables...</p>
        </div>
      ) : activeTab === 'summary' ? (
        /* TAB 1: STOCK SUMMARY */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Warehouse</th>
                  <th className="py-3 px-4 text-right">On Hand</th>
                  <th className="py-3 px-4 text-right">Reserved</th>
                  <th className="py-3 px-4 text-right">Available</th>
                  <th className="py-3 px-4 text-right">Average Cost</th>
                  <th className="py-3 px-4 text-right">Stock Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summaryData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No stock balances found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  summaryData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {row.productName}
                        <span className="font-mono text-[10px] text-slate-400 block">
                          {row.productCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">{row.sku}</td>
                      <td className="py-3 px-4 text-slate-600">{row.warehouseName}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                        {row.quantityOnHand} {row.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">
                        {row.quantityReserved}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                        {row.quantityAvailable}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        ₹{row.averageCost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ₹{row.stockValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'ledger' ? (
        /* TAB 2: STOCK LEDGER */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Movement #</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Warehouse</th>
                  <th className="py-3 px-4 text-right">In (+)</th>
                  <th className="py-3 px-4 text-right">Out (-)</th>
                  <th className="py-3 px-4 text-right">Running Balance</th>
                  <th className="py-3 px-4 text-right">Unit Cost</th>
                  <th className="py-3 px-4">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledgerData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500">
                      No stock movement ledger transactions found.
                    </td>
                  </tr>
                ) : (
                  ledgerData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono text-slate-600">{row.date}</td>
                      <td className="py-3 px-4 font-mono font-medium text-blue-600">
                        {row.movementNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {row.productName}
                        <span className="font-mono text-[10px] text-slate-400 block">
                          {row.productCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{row.warehouse}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600">
                        {row.inQuantity > 0 ? `+${row.inQuantity}` : '—'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-amber-600">
                        {row.outQuantity > 0 ? `-${row.outQuantity}` : '—'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {row.runningBalance}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        ₹{row.unitCost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {row.reference}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TAB 3: LOW STOCK */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Warehouse</th>
                  <th className="py-3 px-4 text-right">Available Qty</th>
                  <th className="py-3 px-4 text-right">Reorder Level</th>
                  <th className="py-3 px-4 text-right">Shortfall</th>
                  <th className="py-3 px-4 text-right">Est. Reorder Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowStockData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No products are currently at or below their reorder threshold.
                    </td>
                  </tr>
                ) : (
                  lowStockData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {row.productName}
                        <span className="font-mono text-[10px] text-slate-400 block">
                          {row.productCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">{row.sku}</td>
                      <td className="py-3 px-4 text-slate-600">{row.warehouse}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                        {row.availableQuantity} {row.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        {row.reorderLevel}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-600">
                        {row.shortfall} {row.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                        ₹{row.estimatedReorderCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
