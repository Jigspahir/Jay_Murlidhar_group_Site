import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getProductById,
  deactivateProduct,
  getProductSerialNumbers,
  getStockMovements,
  PRODUCT_STATUSES
} from '../../features/inventory';
import {
  Package,
  ArrowLeft,
  Edit3,
  Warehouse,
  History,
  Tag,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Truck,
  Sliders,
  DollarSign
} from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [serials, setSerials] = useState([]);
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProduct = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: err } = await getProductById(id);
      if (err) throw new Error(err);
      setProduct(data);

      if (data?.is_serialized) {
        const { data: serData } = await getProductSerialNumbers({ productId: id, status: 'all' });
        setSerials(serData || []);
      }

      const { data: movData } = await getStockMovements({ productId: id, pageSize: 10 });
      setMovements(movData || []);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Product not found');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate this product? Inactive products cannot be selected on new purchase orders or sales.')) {
      return;
    }
    try {
      await deactivateProduct(id);
      loadProduct();
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-4xl mx-auto">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-4xl mx-auto">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Product Not Found</h3>
        <p className="text-xs text-slate-500 mb-4">{error}</p>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Products
        </Link>
      </div>
    );
  }

  const balances = product.inventory_balances || [];
  const totalOnHand = balances.reduce((acc, b) => acc + Number(b.quantity_on_hand || 0), 0);
  const totalAvailable = balances.reduce((acc, b) => acc + Number(b.quantity_available || 0), 0);
  const totalValue = balances.reduce((acc, b) => acc + (Number(b.quantity_on_hand || 0) * Number(b.average_unit_cost || 0)), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{product.product_name}</h1>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {product.product_code}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                product.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {product.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              SKU: {product.sku} {product.barcode ? `• Barcode: ${product.barcode}` : ''} • Company: {product.companies?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/admin/products/${product.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit
          </Link>

          {product.status === 'active' && (
            <button
              onClick={handleDeactivate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Deactivate
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total Available Stock</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{totalAvailable}</span>
            <span className="text-xs text-slate-500 font-mono">{product.unit_code}</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            On Hand: {totalOnHand} | Reorder Level: {product.reorder_level || 0}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total Stock Valuation</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">
              ₹{Number(totalValue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            Purchase Price: ₹{Number(product.purchase_price || 0).toFixed(2)}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Selling Price & MRP</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-600">
              ₹{Number(product.selling_price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-400 line-through">
              MRP ₹{Number(product.mrp || 0).toFixed(2)}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            HSN: {product.hsn_code || '—'} • GST: {product.tax_rate}%
          </span>
        </div>
      </div>

      {/* Warehouse Balances Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Warehouse className="w-4 h-4 text-blue-600" />
          Warehouse Inventory Balances
        </h3>

        {balances.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            No stock received in any warehouse yet. Receive stock through Goods Receipt Note (GRN) to populate.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="py-2.5 px-3">Warehouse Code</th>
                  <th className="py-2.5 px-3">Warehouse Name</th>
                  <th className="py-2.5 px-3 text-right">On Hand</th>
                  <th className="py-2.5 px-3 text-right">Reserved</th>
                  <th className="py-2.5 px-3 text-right">Available</th>
                  <th className="py-2.5 px-3 text-right">Avg Unit Cost</th>
                  <th className="py-2.5 px-3 text-right">Stock Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {balances.map((b) => {
                  const qOnHand = Number(b.quantity_on_hand || 0);
                  const avgCost = Number(b.average_unit_cost || 0);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-mono font-medium text-blue-600">
                        {b.warehouses?.warehouse_code}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {b.warehouses?.warehouse_name}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">
                        {qOnHand}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                        {b.quantity_reserved || 0}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                        {b.quantity_available || 0}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700">
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

      {/* Serial Numbers List (if serialized) */}
      {product.is_serialized && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            Serialized Inventory Units ({serials.length} registered)
          </h3>

          {serials.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">
              No serial numbers registered yet. Receive stock with IMEI/Serial entries to populate.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {serials.map((s) => (
                <div
                  key={s.id}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs font-mono"
                >
                  <span className="font-semibold text-slate-800">{s.serial_number}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      s.status === 'in_stock'
                        ? 'bg-emerald-100 text-emerald-800'
                        : s.status === 'sold'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Movements Audit Trail */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-600" />
          Recent Stock Movements
        </h3>

        {movements.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            No stock movements recorded for this item.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="py-2.5 px-3">Movement #</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Warehouse</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Unit Cost</th>
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
                    <td className="py-2.5 px-3 font-mono">
                      {m.movement_type}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {m.warehouses?.warehouse_name}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold">
                      {m.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      ₹{Number(m.unit_cost || 0).toFixed(2)}
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
