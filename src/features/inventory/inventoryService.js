import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — INVENTORY & STOCK MANAGEMENT SERVICE
 * 
 * Production data layer for Products, Categories, Warehouses, Balances,
 * Stock Movements, Goods Receipts (GRN), Adjustments, and Serial Numbers.
 * Enforces multi-company RLS and strict validation rules.
 */

// =============================================================================
// CONSTANTS & ENUMS
// =============================================================================

export const PRODUCT_STATUSES = Object.freeze([
  { value: 'active', label: 'Active', color: 'emerald' },
  { value: 'inactive', label: 'Inactive', color: 'slate' },
  { value: 'discontinued', label: 'Discontinued', color: 'rose' }
]);

export const MOVEMENT_TYPES = Object.freeze([
  { value: 'opening', label: 'Opening Stock', direction: 'in', color: 'blue' },
  { value: 'purchase_receipt', label: 'Purchase Receipt', direction: 'in', color: 'emerald' },
  { value: 'sales_issue', label: 'Sales Issue', direction: 'out', color: 'amber' },
  { value: 'adjustment_in', label: 'Adjustment (In)', direction: 'in', color: 'teal' },
  { value: 'adjustment_out', label: 'Adjustment (Out)', direction: 'out', color: 'rose' },
  { value: 'transfer_in', label: 'Transfer In', direction: 'in', color: 'indigo' },
  { value: 'transfer_out', label: 'Transfer Out', direction: 'out', color: 'purple' },
  { value: 'return_in', label: 'Sales Return In', direction: 'in', color: 'cyan' },
  { value: 'return_out', label: 'Purchase Return Out', direction: 'out', color: 'orange' }
]);

export const ADJUSTMENT_REASONS = Object.freeze([
  { value: 'damage', label: 'Damaged Goods' },
  { value: 'loss', label: 'Inventory Loss / Shrinkage' },
  { value: 'count_difference', label: 'Physical Count Difference' },
  { value: 'correction', label: 'Data Entry Correction' },
  { value: 'opening_stock', label: 'Initial Opening Stock' },
  { value: 'other', label: 'Other Reason' }
]);

export const ADJUSTMENT_STATUSES = Object.freeze([
  { value: 'draft', label: 'Draft', color: 'slate' },
  { value: 'submitted', label: 'Submitted for Approval', color: 'amber' },
  { value: 'approved', label: 'Approved & Applied', color: 'emerald' },
  { value: 'rejected', label: 'Rejected', color: 'rose' }
]);

export const GRN_STATUSES = Object.freeze([
  { value: 'draft', label: 'Draft Receipt', color: 'slate' },
  { value: 'received', label: 'Received (Stock In)', color: 'emerald' },
  { value: 'cancelled', label: 'Cancelled', color: 'rose' }
]);

export const SERIAL_STATUSES = Object.freeze([
  { value: 'in_stock', label: 'In Stock', color: 'emerald' },
  { value: 'sold', label: 'Sold', color: 'blue' },
  { value: 'damaged', label: 'Damaged', color: 'rose' },
  { value: 'returned', label: 'Returned', color: 'amber' }
]);

export const COMMON_UOMS = Object.freeze([
  { unit_code: 'PCS', unit_name: 'Pieces', is_fractional: false },
  { unit_code: 'BOX', unit_name: 'Box', is_fractional: false },
  { unit_code: 'SET', unit_name: 'Set', is_fractional: false },
  { unit_code: 'PKT', unit_name: 'Packet', is_fractional: false },
  { unit_code: 'KG', unit_name: 'Kilogram', is_fractional: true },
  { unit_code: 'GRAM', unit_name: 'Gram', is_fractional: true },
  { unit_code: 'LTR', unit_name: 'Litre', is_fractional: true },
  { unit_code: 'MTR', unit_name: 'Metre', is_fractional: true }
]);

/**
 * Check if inventory is applicable for a company based on its slug or domain
 */
export function isCompanyInventoryEligible(companySlug) {
  if (!companySlug) return true;
  const eligibleSlugs = [
    'jay-murlidhar-mobile',
    'jay-murlidhar-computer',
    'mobile',
    'computer',
    'retail',
    'jan-suvidha'
  ];
  return eligibleSlugs.some(s => companySlug.toLowerCase().includes(s));
}

// =============================================================================
// PRODUCT UNITS OF MEASURE
// =============================================================================

export async function getProductUnits() {
  if (!isSupabaseConfigured) {
    return { data: COMMON_UOMS, error: null };
  }
  try {
    const { data, error } = await supabase
      .from('product_units')
      .select('*')
      .order('unit_code', { ascending: true });
    if (error) throw error;
    return { data: data && data.length > 0 ? data : COMMON_UOMS, error: null };
  } catch (err) {
    console.error('Error fetching product units:', err);
    return { data: COMMON_UOMS, error: err.message };
  }
}

// =============================================================================
// PRODUCT CATEGORIES
// =============================================================================

export async function getProductCategories(companyId = null) {
  if (!isSupabaseConfigured) {
    return { data: [], error: null };
  }
  try {
    let query = supabase
      .from('product_categories')
      .select('*')
      .order('category_name', { ascending: true });

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    console.error('Error fetching product categories:', err);
    return { data: [], error: err.message };
  }
}

export async function createProductCategory(categoryData) {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Database unconfigured' };
  }
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .insert([categoryData])
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function updateProductCategory(id, updates) {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Database unconfigured' };
  }
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

// =============================================================================
// PRODUCT MASTER
// =============================================================================

export async function getProducts({
  companyId = null,
  isAllCompanies = false,
  categoryId = null,
  status = 'all',
  search = '',
  isSerialized = null,
  page = 1,
  pageSize = 25
} = {}) {
  if (!isSupabaseConfigured) {
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('products')
      .select(`
        *,
        product_categories (
          id,
          category_code,
          category_name
        ),
        companies:company_id (
          id,
          name,
          slug
        )
      `, { count: 'exact' });

    if (!isAllCompanies && companyId) {
      query = query.eq('company_id', companyId);
    }

    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (isSerialized !== null && isSerialized !== undefined) {
      query = query.eq('is_serialized', isSerialized);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`product_name.ilike.${term},product_code.ilike.${term},sku.ilike.${term},barcode.ilike.${term},brand.ilike.${term},model.ilike.${term}`);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  } catch (err) {
    console.error('Error fetching products:', err);
    return { data: [], count: 0, page, pageSize, totalPages: 0, error: err.message };
  }
}

export async function getProductById(id) {
  if (!isSupabaseConfigured) return { data: null, error: 'Database unconfigured' };
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_categories (
          id,
          category_code,
          category_name
        ),
        companies:company_id (
          id,
          name,
          slug
        ),
        inventory_balances (
          id,
          warehouse_id,
          quantity_on_hand,
          quantity_reserved,
          quantity_available,
          average_unit_cost,
          warehouses:warehouse_id (
            id,
            warehouse_code,
            warehouse_name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function createProduct(productData) {
  if (!isSupabaseConfigured) return { data: null, error: 'Database unconfigured' };
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function updateProduct(id, updates) {
  if (!isSupabaseConfigured) return { data: null, error: 'Database unconfigured' };
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function deactivateProduct(id) {
  return updateProduct(id, { status: 'inactive' });
}

// =============================================================================
// WAREHOUSES
// =============================================================================

export async function getWarehouses({
  companyId = null,
  isAllCompanies = false,
  status = 'all',
  page = 1,
  pageSize = 50
} = {}) {
  if (!isSupabaseConfigured) return { data: [], count: 0, totalPages: 0 };
  try {
    let query = supabase
      .from('warehouses')
      .select(`
        *,
        companies:company_id (
          id,
          name,
          slug
        )
      `, { count: 'exact' });

    if (!isAllCompanies && companyId) {
      query = query.eq('company_id', companyId);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    query = query.order('is_default', { ascending: false }).order('warehouse_name', { ascending: true });

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  } catch (err) {
    console.error('Error fetching warehouses:', err);
    return { data: [], count: 0, error: err.message };
  }
}

export async function getWarehouseById(id) {
  if (!isSupabaseConfigured) return { data: null, error: 'Database unconfigured' };
  try {
    const { data, error } = await supabase
      .from('warehouses')
      .select(`
        *,
        companies:company_id (
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function createWarehouse(warehouseData) {
  if (!isSupabaseConfigured) return { data: null, error: 'Database unconfigured' };
  try {
    const { data, error } = await supabase
      .from('warehouses')
      .insert([warehouseData])
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function updateWarehouse(id, updates) {
  if (!isSupabaseConfigured) return { data: null, error: 'Database unconfigured' };
  try {
    const { data, error } = await supabase
      .from('warehouses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

// =============================================================================
// INVENTORY BALANCES & MOVEMENTS
// =============================================================================

export async function getInventoryBalances({
  companyId = null,
  isAllCompanies = false,
  warehouseId = null,
  productId = null,
  lowStockOnly = false,
  page = 1,
  pageSize = 50
} = {}) {
  if (!isSupabaseConfigured) return { data: [], count: 0, totalPages: 0 };
  try {
    let query = supabase
      .from('inventory_balances')
      .select(`
        *,
        products:product_id (
          id,
          product_code,
          product_name,
          sku,
          unit_code,
          reorder_level,
          min_stock_level,
          is_serialized,
          status
        ),
        warehouses:warehouse_id (
          id,
          warehouse_code,
          warehouse_name,
          status
        ),
        companies:company_id (
          id,
          name,
          slug
        )
      `, { count: 'exact' });

    if (!isAllCompanies && companyId) {
      query = query.eq('company_id', companyId);
    }
    if (warehouseId && warehouseId !== 'all') {
      query = query.eq('warehouse_id', warehouseId);
    }
    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    let filtered = data || [];
    if (lowStockOnly) {
      filtered = filtered.filter(b => 
        b.products && b.quantity_available <= (b.products.reorder_level || 0)
      );
    }

    return {
      data: filtered,
      count: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize)
    };
  } catch (err) {
    console.error('Error fetching inventory balances:', err);
    return { data: [], count: 0, error: err.message };
  }
}

export async function getStockMovements({
  companyId = null,
  isAllCompanies = false,
  warehouseId = null,
  productId = null,
  movementType = 'all',
  page = 1,
  pageSize = 50
} = {}) {
  if (!isSupabaseConfigured) return { data: [], count: 0, totalPages: 0 };
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('stock_movements')
      .select(`
        *,
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
        ),
        companies:company_id (
          id,
          name,
          slug
        )
      `, { count: 'exact' });

    if (!isAllCompanies && companyId) {
      query = query.eq('company_id', companyId);
    }
    if (warehouseId && warehouseId !== 'all') {
      query = query.eq('warehouse_id', warehouseId);
    }
    if (productId) {
      query = query.eq('product_id', productId);
    }
    if (movementType && movementType !== 'all') {
      query = query.eq('movement_type', movementType);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  } catch (err) {
    console.error('Error fetching stock movements:', err);
    return { data: [], count: 0, error: err.message };
  }
}

// =============================================================================
// GOODS RECEIPTS (GRN) — STOCK IN
// =============================================================================

export async function getGoodsReceipts({
  companyId = null,
  isAllCompanies = false,
  status = 'all',
  search = '',
  page = 1,
  pageSize = 25
} = {}) {
  if (!isSupabaseConfigured) return { data: [], count: 0, totalPages: 0 };
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('goods_receipts')
      .select(`
        *,
        warehouses:warehouse_id (
          id,
          warehouse_code,
          warehouse_name
        ),
        vendors:vendor_id (
          id,
          legal_name,
          trade_name
        ),
        purchase_orders:purchase_order_id (
          id,
          po_number
        ),
        companies:company_id (
          id,
          name,
          slug
        )
      `, { count: 'exact' });

    if (!isAllCompanies && companyId) {
      query = query.eq('company_id', companyId);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`grn_number.ilike.${term},notes.ilike.${term}`);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  } catch (err) {
    console.error('Error fetching goods receipts:', err);
    return { data: [], count: 0, error: err.message };
  }
}

export async function getGoodsReceiptById(id) {
  if (!isSupabaseConfigured) return { data: null, error: 'Database unconfigured' };
  try {
    const { data, error } = await supabase
      .from('goods_receipts')
      .select(`
        *,
        warehouses:warehouse_id (
          id,
          warehouse_code,
          warehouse_name,
          address
        ),
        vendors:vendor_id (
          id,
          legal_name,
          trade_name,
          gstin
        ),
        purchase_orders:purchase_order_id (
          id,
          po_number,
          order_date
        ),
        companies:company_id (
          id,
          name,
          slug
        ),
        goods_receipt_items (
          id,
          product_id,
          purchase_order_item_id,
          ordered_quantity,
          received_quantity,
          unit_cost,
          total_cost,
          batch_number,
          products:product_id (
            id,
            product_code,
            product_name,
            sku,
            unit_code,
            is_serialized
          )
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function createGoodsReceipt(grnHeader, items = []) {
  if (!isSupabaseConfigured) return { data: null, error: 'Database unconfigured' };
  try {
    // 1. Insert header
    const { data: grn, error: grnError } = await supabase
      .from('goods_receipts')
      .insert([grnHeader])
      .select()
      .single();

    if (grnError) throw grnError;

    // 2. Insert items
    if (items && items.length > 0) {
      const itemsToInsert = items.map(item => ({
        goods_receipt_id: grn.id,
        purchase_order_item_id: item.purchase_order_item_id || null,
        product_id: item.product_id,
        ordered_quantity: item.ordered_quantity || 0,
        received_quantity: item.received_quantity,
        unit_cost: item.unit_cost || 0,
        total_cost: Number((item.received_quantity * (item.unit_cost || 0)).toFixed(2)),
        batch_number: item.batch_number || null
      }));

      const { error: itemsError } = await supabase
        .from('goods_receipt_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;
    }

    return { data: grn, error: null };
  } catch (err) {
    console.error('Error creating goods receipt:', err);
    return { data: null, error: err.message };
  }
}

export async function receiveGoodsReceipt(grnId, { serialsByProduct = {} } = {}) {
  if (!isSupabaseConfigured) return { data: null, error: 'Database unconfigured' };
  try {
    // Updating status to 'received' activates the database trigger `process_received_goods_receipt`
    // which generates immutable `purchase_receipt` stock movements and updates inventory balances
    const { data, error } = await supabase
      .from('goods_receipts')
      .update({ status: 'received' })
      .eq('id', grnId)
      .select()
      .single();

    if (error) throw error;

    // If serialized items were provided, register them in product_serial_numbers
    if (serialsByProduct && Object.keys(serialsByProduct).length > 0) {
      const serialRows = [];
      for (const [prodId, serialList] of Object.entries(serialsByProduct)) {
        for (const s of serialList) {
          if (s && s.trim()) {
            serialRows.push({
              company_id: data.company_id,
              product_id: prodId,
              serial_number: s.trim().toUpperCase(),
              warehouse_id: data.warehouse_id,
              status: 'in_stock',
              goods_receipt_id: grnId
            });
          }
        }
      }
      if (serialRows.length > 0) {
        const { error: serialError } = await supabase
          .from('product_serial_numbers')
          .insert(serialRows);
        if (serialError) {
          console.warn('Warning: Some serial numbers may have failed to record:', serialError);
        }
      }
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

// =============================================================================
// STOCK ADJUSTMENTS
// =============================================================================

export async function getStockAdjustments({
  companyId = null,
  isAllCompanies = false,
  status = 'all',
  page = 1,
  pageSize = 25
} = {}) {
  if (!isSupabaseConfigured) return { data: [], count: 0, totalPages: 0 };
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('stock_adjustments')
      .select(`
        *,
        warehouses:warehouse_id (
          id,
          warehouse_code,
          warehouse_name
        ),
        companies:company_id (
          id,
          name,
          slug
        )
      `, { count: 'exact' });

    if (!isAllCompanies && companyId) {
      query = query.eq('company_id', companyId);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  } catch (err) {
    console.error('Error fetching stock adjustments:', err);
    return { data: [], count: 0, error: err.message };
  }
}

export async function getStockAdjustmentById(id) {
  if (!isSupabaseConfigured) return { data: null, error: 'Database unconfigured' };
  try {
    const { data, error } = await supabase
      .from('stock_adjustments')
      .select(`
        *,
        warehouses:warehouse_id (
          id,
          warehouse_code,
          warehouse_name
        ),
        companies:company_id (
          id,
          name,
          slug
        ),
        stock_adjustment_items (
          id,
          product_id,
          current_quantity,
          adjusted_quantity,
          difference_quantity,
          unit_cost,
          notes,
          products:product_id (
            id,
            product_code,
            product_name,
            sku,
            unit_code
          )
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function createStockAdjustment(adjustmentHeader, items = []) {
  if (!isSupabaseConfigured) return { data: null, error: 'Database unconfigured' };
  try {
    const { data: adj, error: adjError } = await supabase
      .from('stock_adjustments')
      .insert([adjustmentHeader])
      .select()
      .single();

    if (adjError) throw adjError;

    if (items && items.length > 0) {
      const itemsToInsert = items.map(item => ({
        stock_adjustment_id: adj.id,
        product_id: item.product_id,
        current_quantity: item.current_quantity || 0,
        adjusted_quantity: item.adjusted_quantity,
        difference_quantity: item.adjusted_quantity - (item.current_quantity || 0),
        unit_cost: item.unit_cost || 0,
        notes: item.notes || null
      }));

      const { error: itemsError } = await supabase
        .from('stock_adjustment_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;
    }

    return { data: adj, error: null };
  } catch (err) {
    console.error('Error creating stock adjustment:', err);
    return { data: null, error: err.message };
  }
}

export async function submitStockAdjustment(id) {
  if (!isSupabaseConfigured) return { data: null, error: 'Database unconfigured' };
  try {
    const { data, error } = await supabase
      .from('stock_adjustments')
      .update({ status: 'submitted' })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function approveStockAdjustment(id, approvedBy) {
  if (!isSupabaseConfigured) return { data: null, error: 'Database unconfigured' };
  try {
    // Updating status to 'approved' activates trigger `process_approved_stock_adjustment`
    // which generates ledger entries and recalculates inventory balances
    const { data, error } = await supabase
      .from('stock_adjustments')
      .update({
        status: 'approved',
        approved_by: approvedBy || null,
        approved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function rejectStockAdjustment(id) {
  if (!isSupabaseConfigured) return { data: null, error: 'Database unconfigured' };
  try {
    const { data, error } = await supabase
      .from('stock_adjustments')
      .update({ status: 'rejected' })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

// =============================================================================
// SERIAL NUMBERS
// =============================================================================

export async function getProductSerialNumbers({
  companyId = null,
  productId = null,
  warehouseId = null,
  status = 'in_stock'
} = {}) {
  if (!isSupabaseConfigured) return { data: [], error: null };
  try {
    let query = supabase
      .from('product_serial_numbers')
      .select(`
        *,
        products:product_id (
          id,
          product_code,
          product_name
        ),
        warehouses:warehouse_id (
          id,
          warehouse_code,
          warehouse_name
        )
      `);

    if (companyId) query = query.eq('company_id', companyId);
    if (productId) query = query.eq('product_id', productId);
    if (warehouseId) query = query.eq('warehouse_id', warehouseId);
    if (status && status !== 'all') query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    return { data: [], error: err.message };
  }
}

// =============================================================================
// INVENTORY DASHBOARD STATISTICS
// =============================================================================

export async function getInventoryDashboardStats(companyId = null) {
  if (!isSupabaseConfigured) {
    return {
      totalProducts: 0,
      activeSKUs: 0,
      totalStockValue: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      todayStockIn: 0,
      todayStockOut: 0,
      fastMovingProducts: []
    };
  }

  try {
    // 1. Products count
    let prodQuery = supabase.from('products').select('id, status, sku, reorder_level', { count: 'exact' });
    if (companyId) prodQuery = prodQuery.eq('company_id', companyId);
    const { data: prods, count: totalProducts } = await prodQuery;

    const activeSKUs = (prods || []).filter(p => p.status === 'active').length;

    // 2. Inventory Balances & Value
    let balQuery = supabase
      .from('inventory_balances')
      .select('quantity_on_hand, quantity_available, average_unit_cost, product_id');
    if (companyId) balQuery = balQuery.eq('company_id', companyId);
    const { data: balances } = await balQuery;

    let totalStockValue = 0;
    let outOfStockItems = 0;
    let lowStockItems = 0;

    const prodMap = new Map((prods || []).map(p => [p.id, p]));

    (balances || []).forEach(b => {
      const qOnHand = Number(b.quantity_on_hand || 0);
      const qAvail = Number(b.quantity_available || 0);
      const avgCost = Number(b.average_unit_cost || 0);
      totalStockValue += qOnHand * avgCost;

      if (qOnHand <= 0) {
        outOfStockItems++;
      }

      const prod = prodMap.get(b.product_id);
      if (prod && qAvail <= (prod.reorder_level || 0)) {
        lowStockItems++;
      }
    });

    // 3. Today's Movements
    const today = new Date().toISOString().split('T')[0];
    let movQuery = supabase
      .from('stock_movements')
      .select('movement_type, quantity, created_at')
      .gte('created_at', `${today}T00:00:00.000Z`);

    if (companyId) movQuery = movQuery.eq('company_id', companyId);
    const { data: todayMovs } = await movQuery;

    let todayStockIn = 0;
    let todayStockOut = 0;

    (todayMovs || []).forEach(m => {
      const q = Number(m.quantity || 0);
      if (['purchase_receipt', 'adjustment_in', 'opening', 'transfer_in', 'return_in'].includes(m.movement_type)) {
        todayStockIn += q;
      } else {
        todayStockOut += q;
      }
    });

    return {
      totalProducts: totalProducts || 0,
      activeSKUs,
      totalStockValue: Number(totalStockValue.toFixed(2)),
      lowStockItems,
      outOfStockItems,
      todayStockIn,
      todayStockOut,
      fastMovingProducts: []
    };
  } catch (err) {
    console.error('Error fetching inventory dashboard stats:', err);
    return {
      totalProducts: 0,
      activeSKUs: 0,
      totalStockValue: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      todayStockIn: 0,
      todayStockOut: 0,
      fastMovingProducts: []
    };
  }
}
