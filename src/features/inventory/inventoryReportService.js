import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — INVENTORY REPORTING SERVICE
 * 
 * Generates audit-ready reports for:
 * 1. Stock Summary (Balances & Valuation)
 * 2. Stock Ledger (Cardex / Movement Audit Trail)
 * 3. Low Stock & Reorder Exceptions
 * With CSV export and print-ready capabilities.
 */

/**
 * Stock Summary Report
 */
export async function getStockSummaryReport({
  companyId = null,
  warehouseId = null,
  categoryId = null
} = {}) {
  if (!isSupabaseConfigured) return { data: [], error: null };
  try {
    let query = supabase
      .from('inventory_balances')
      .select(`
        id,
        quantity_on_hand,
        quantity_reserved,
        quantity_available,
        average_unit_cost,
        last_stock_take_at,
        products:product_id (
          id,
          product_code,
          product_name,
          sku,
          unit_code,
          category_id,
          reorder_level,
          purchase_price,
          selling_price
        ),
        warehouses:warehouse_id (
          id,
          warehouse_code,
          warehouse_name
        ),
        companies:company_id (
          id,
          name
        )
      `);

    if (companyId) query = query.eq('company_id', companyId);
    if (warehouseId && warehouseId !== 'all') query = query.eq('warehouse_id', warehouseId);

    const { data, error } = await query;
    if (error) throw error;

    let rows = (data || []).map(b => {
      const qOnHand = Number(b.quantity_on_hand || 0);
      const avgCost = Number(b.average_unit_cost || 0);
      return {
        id: b.id,
        productId: b.products?.id,
        productCode: b.products?.product_code || '—',
        productName: b.products?.product_name || '—',
        sku: b.products?.sku || '—',
        categoryId: b.products?.category_id,
        unit: b.products?.unit_code || 'PCS',
        warehouseCode: b.warehouses?.warehouse_code || '—',
        warehouseName: b.warehouses?.warehouse_name || '—',
        quantityOnHand: qOnHand,
        quantityReserved: Number(b.quantity_reserved || 0),
        quantityAvailable: Number(b.quantity_available || 0),
        averageCost: avgCost,
        stockValue: Number((qOnHand * avgCost).toFixed(2))
      };
    });

    if (categoryId && categoryId !== 'all') {
      rows = rows.filter(r => r.categoryId === categoryId);
    }

    return { data: rows, error: null };
  } catch (err) {
    console.error('Error in getStockSummaryReport:', err);
    return { data: [], error: err.message };
  }
}

/**
 * Stock Ledger Report (Detailed Movements)
 */
export async function getStockLedgerReport({
  companyId = null,
  productId = null,
  warehouseId = null,
  startDate = null,
  endDate = null
} = {}) {
  if (!isSupabaseConfigured) return { data: [], error: null };
  try {
    let query = supabase
      .from('stock_movements')
      .select(`
        id,
        movement_number,
        movement_type,
        quantity,
        unit_cost,
        total_cost,
        reference_type,
        reference_id,
        notes,
        created_at,
        created_by,
        products:product_id (
          id,
          product_code,
          product_name,
          sku,
          unit_code
        ),
        warehouses:warehouse_id (
          id,
          warehouse_code,
          warehouse_name
        )
      `)
      .order('created_at', { ascending: true });

    if (companyId) query = query.eq('company_id', companyId);
    if (productId && productId !== 'all') query = query.eq('product_id', productId);
    if (warehouseId && warehouseId !== 'all') query = query.eq('warehouse_id', warehouseId);
    if (startDate) query = query.gte('created_at', `${startDate}T00:00:00.000Z`);
    if (endDate) query = query.lte('created_at', `${endDate}T23:59:59.999Z`);

    const { data, error } = await query;
    if (error) throw error;

    let runningBalance = 0;
    const rows = (data || []).map(m => {
      const isIn = ['opening', 'purchase_receipt', 'adjustment_in', 'transfer_in', 'return_in'].includes(m.movement_type);
      const qty = Number(m.quantity || 0);
      const inQty = isIn ? qty : 0;
      const outQty = isIn ? 0 : qty;

      runningBalance = runningBalance + inQty - outQty;

      return {
        id: m.id,
        date: m.created_at ? new Date(m.created_at).toLocaleDateString('en-IN') : '—',
        timestamp: m.created_at,
        movementNumber: m.movement_number,
        movementType: m.movement_type,
        productCode: m.products?.product_code || '—',
        productName: m.products?.product_name || '—',
        sku: m.products?.sku || '—',
        warehouse: m.warehouses?.warehouse_name || '—',
        inQuantity: inQty,
        outQuantity: outQty,
        runningBalance,
        unitCost: Number(m.unit_cost || 0),
        totalCost: Number(m.total_cost || 0),
        reference: m.reference_type ? `${m.reference_type}: ${m.reference_id?.slice(0, 8) || ''}` : '—',
        notes: m.notes || '—'
      };
    });

    return { data: rows, error: null };
  } catch (err) {
    console.error('Error in getStockLedgerReport:', err);
    return { data: [], error: err.message };
  }
}

/**
 * Low Stock & Reorder Report
 */
export async function getLowStockReport({
  companyId = null,
  warehouseId = null
} = {}) {
  if (!isSupabaseConfigured) return { data: [], error: null };
  try {
    let query = supabase
      .from('inventory_balances')
      .select(`
        id,
        quantity_on_hand,
        quantity_reserved,
        quantity_available,
        average_unit_cost,
        products:product_id (
          id,
          product_code,
          product_name,
          sku,
          unit_code,
          reorder_level,
          min_stock_level,
          purchase_price
        ),
        warehouses:warehouse_id (
          id,
          warehouse_code,
          warehouse_name
        )
      `);

    if (companyId) query = query.eq('company_id', companyId);
    if (warehouseId && warehouseId !== 'all') query = query.eq('warehouse_id', warehouseId);

    const { data, error } = await query;
    if (error) throw error;

    const lowStockRows = [];

    (data || []).forEach(b => {
      const qAvail = Number(b.quantity_available || 0);
      const reorderLevel = Number(b.products?.reorder_level || 0);

      if (qAvail <= reorderLevel) {
        lowStockRows.push({
          id: b.id,
          productCode: b.products?.product_code || '—',
          productName: b.products?.product_name || '—',
          sku: b.products?.sku || '—',
          unit: b.products?.unit_code || 'PCS',
          warehouse: b.warehouses?.warehouse_name || '—',
          availableQuantity: qAvail,
          reorderLevel,
          minStockLevel: Number(b.products?.min_stock_level || 0),
          shortfall: Math.max(0, reorderLevel - qAvail),
          estimatedReorderCost: Number((Math.max(0, reorderLevel - qAvail) * Number(b.products?.purchase_price || 0)).toFixed(2))
        });
      }
    });

    return { data: lowStockRows, error: null };
  } catch (err) {
    console.error('Error in getLowStockReport:', err);
    return { data: [], error: err.message };
  }
}

/**
 * Generic CSV exporter for tabular report rows
 */
export function exportReportToCSV(data = [], filename = 'inventory_report.csv') {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Header row
  csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));

  // Value rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
