import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getWarehouseById,
  getInventoryBalances,
  getStockMovements
} from '../../features/inventory';
import {
  Warehouse,
  ArrowLeft,
  Edit3,
  Package,
  History,
  AlertTriangle,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export default function WarehouseDetail() {
  const { id } = useParams();

  const [warehouse, setWarehouse] = useState(null);
  const [balances, setBalances] = useState([]);
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [whRes, balRes, movRes] = await Promise.all([
        getWarehouseById(id),
        getInventoryBalances({ warehouseId: id, pageSize: 50 }),
        getStockMovements({ warehouseId: id, pageSize: 15 })
      ]);

      if (whRes.error) throw new Error(whRes.error);
      setWarehouse(whRes.data);
      setBalances(balRes.data || []);
      setMovements(movRes.data || []);
    } catch (err) {
      console.error('Error loading warehouse:', err);
      setError(err.message || 'Warehouse not found');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-4xl mx-auto">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Loading warehouse...</p>
      </div>
    );
  }

  if (error || !warehouse) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-4xl mx-auto">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Warehouse Not Found</h3>
        <p className="text-xs text-slate-500 mb-4">{error}</p>
        <Link
          to="/admin/warehouses"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Warehouses
        </Link>
      </div>
    );
  }

  const totalOnHand = balances.reduce((acc, b) => acc + Number(b.quantity_on_hand || 0), 0);
  const totalValuation = balances.reduce(
    (acc, b) => acc + Number(b.quantity_on_hand || 0) * Number(b.average_unit_cost || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/warehouses"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{warehouse.warehouse_name}</h1>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {warehouse.warehouse_code}
              </span>
              {warehouse.is_default && (
                <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  Default Warehouse
                </span>
              )}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                warehouse.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {warehouse.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {warehouse.address || 'No physical address specified'} • Company: {warehouse.companies?.name}
            </p>
          </div>
        </div>

        <Link
          to={`/admin/warehouses/${warehouse.id}/edit`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit Warehouse
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Products in Stock</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{balances.length}</span>
            <span className="text-xs text-slate-500">SKUs</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total Units On Hand</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{totalOnHand}</span>
            <span className="text-xs text-slate-500">total units</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Warehouse Stock Valuation</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">
              ₹{totalValuation.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Inventory Balances */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          Current Stock Balances
        </h3>

        {balances.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            No stock currently residing in this warehouse.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3 text-right">On Hand</th>
                  <th className="py-2.5 px-3 text-right">Available</th>
                  <th className="py-2.5 px-3 text-right">Average Cost</th>
                  <th className="py-2.5 px-3 text-right">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {balances.map((b) => {
                  const qOnHand = Number(b.quantity_on_hand || 0);
                  const avgCost = Number(b.average_unit_cost || 0);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {b.products?.product_name || '—'}
                        <span className="font-mono text-[10px] text-slate-400 block">
                          {b.products?.product_code}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">
                        {b.products?.sku}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">
                        {qOnHand} {b.products?.unit_code || 'PCS'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                        {b.quantity_available || 0}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        ₹{avgCost.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{(qOnHand * avgCost).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Movements in this Warehouse */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-600" />
          Recent Inward & Outward Movements
        </h3>

        {movements.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            No movements recorded for this warehouse.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="py-2.5 px-3">Movement #</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-mono font-medium text-blue-600">
                      {m.movement_number}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {m.created_at ? new Date(m.created_at).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono">{m.movement_type}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {m.products?.product_name}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold">
                      {m.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      ₹{Number(m.total_cost || 0).toFixed(2)}
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
