-- =============================================================================
-- JAY MURLIDHAR GROUP (JMG) — MULTI-COMPANY BUSINESS MANAGEMENT PLATFORM
-- Migration: 20261002000008_inventory_stock_management.sql
-- Description: Phase 13B — Inventory & Stock Management Module:
--              Units of Measure, Product Categories, Product Master,
--              Warehouses, Inventory Balances, Immutable Stock Ledger,
--              Goods Receipts (GRN), Stock Adjustments, Serial/IMEI Tracking,
--              PO & Customer Invoicing Integration, RLS & RBAC.
-- =============================================================================

-- =============================================================================
-- 1. SEQUENCES & CONCURRENCY-SAFE CODE GENERATORS
-- =============================================================================

-- Product Code: JMG-PRD-1001, JMG-PRD-1002, ...
CREATE SEQUENCE IF NOT EXISTS public.product_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_product_code()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.product_code_seq');
    RETURN 'JMG-PRD-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Warehouse Code: JMG-WH-1001, JMG-WH-1002, ...
CREATE SEQUENCE IF NOT EXISTS public.warehouse_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_warehouse_code()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.warehouse_code_seq');
    RETURN 'JMG-WH-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stock Movement Number: JMG-MOV-1001, JMG-MOV-1002, ...
CREATE SEQUENCE IF NOT EXISTS public.stock_movement_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_stock_movement_number()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.stock_movement_code_seq');
    RETURN 'JMG-MOV-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Goods Receipt Note (GRN): JMG-GRN-1001, JMG-GRN-1002, ...
CREATE SEQUENCE IF NOT EXISTS public.grn_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_grn_number()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.grn_code_seq');
    RETURN 'JMG-GRN-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stock Adjustment Number: JMG-ADJ-1001, JMG-ADJ-1002, ...
CREATE SEQUENCE IF NOT EXISTS public.adjustment_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_adjustment_number()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.adjustment_code_seq');
    RETURN 'JMG-ADJ-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 2. UNITS OF MEASURE (UOM Master)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.product_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_code TEXT UNIQUE NOT NULL,
    unit_name TEXT NOT NULL,
    is_fractional BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Canonical Units
INSERT INTO public.product_units (unit_code, unit_name, is_fractional)
VALUES
    ('PCS', 'Pieces', false),
    ('BOX', 'Box', false),
    ('SET', 'Set', false),
    ('PKT', 'Packet', false),
    ('KG', 'Kilogram', true),
    ('GRAM', 'Gram', true),
    ('LTR', 'Litre', true),
    ('MTR', 'Meter', true)
ON CONFLICT (unit_code) DO NOTHING;

-- =============================================================================
-- 3. PRODUCT CATEGORIES (Company Scoped)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    category_code TEXT,
    category_name TEXT NOT NULL,
    parent_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    CONSTRAINT uq_company_category_name UNIQUE (company_id, category_name)
);

CREATE INDEX IF NOT EXISTS idx_prod_cat_company ON public.product_categories(company_id);
CREATE INDEX IF NOT EXISTS idx_prod_cat_parent ON public.product_categories(parent_id);

CREATE TRIGGER set_product_categories_updated_at
BEFORE UPDATE ON public.product_categories
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 4. PRODUCT MASTER (Dedicated Products Table)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    product_code TEXT UNIQUE NOT NULL DEFAULT public.generate_product_code(),
    sku TEXT NOT NULL,
    barcode TEXT,
    product_name TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
    unit_code TEXT NOT NULL REFERENCES public.product_units(unit_code) DEFAULT 'PCS',
    brand TEXT,
    model TEXT,
    hsn_code TEXT,
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 18.00 CHECK (tax_rate >= 0),
    purchase_price NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (purchase_price >= 0),
    selling_price NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (selling_price >= 0),
    mrp NUMERIC(12,2) CHECK (mrp IS NULL OR mrp >= 0),
    reorder_level NUMERIC(10,2) NOT NULL DEFAULT 5.00 CHECK (reorder_level >= 0),
    min_stock_level NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (min_stock_level >= 0),
    is_serialized BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    CONSTRAINT uq_company_product_sku UNIQUE (company_id, sku)
);

CREATE INDEX IF NOT EXISTS idx_products_company ON public.products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON public.products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products(product_name);

CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 5. WAREHOUSES MASTER
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    warehouse_code TEXT NOT NULL DEFAULT public.generate_warehouse_code(),
    warehouse_name TEXT NOT NULL,
    address TEXT,
    is_default BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    CONSTRAINT uq_company_warehouse_code UNIQUE (company_id, warehouse_code)
);

CREATE INDEX IF NOT EXISTS idx_warehouses_company ON public.warehouses(company_id);
CREATE INDEX IF NOT EXISTS idx_warehouses_status ON public.warehouses(status);

CREATE TRIGGER set_warehouses_updated_at
BEFORE UPDATE ON public.warehouses
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Seed Default Warehouse for Retail & Computer companies
INSERT INTO public.warehouses (company_id, warehouse_code, warehouse_name, is_default)
VALUES
    ('c1000000-0000-0000-0000-000000000006', 'JMG-WH-1001', 'Main Retail Showroom', true),
    ('c1000000-0000-0000-0000-000000000002', 'JMG-WH-1002', 'Central Hardware Store', true)
ON CONFLICT (company_id, warehouse_code) DO NOTHING;

-- =============================================================================
-- 6. INVENTORY BALANCES (Fast-Access Snapshot)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.inventory_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    quantity_on_hand NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (quantity_on_hand >= 0),
    quantity_reserved NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (quantity_reserved >= 0),
    quantity_available NUMERIC(10,2) GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
    average_unit_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (average_unit_cost >= 0),
    last_stock_take_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_inventory_balance_item UNIQUE (company_id, product_id, warehouse_id)
);

CREATE INDEX IF NOT EXISTS idx_inv_bal_company ON public.inventory_balances(company_id);
CREATE INDEX IF NOT EXISTS idx_inv_bal_product ON public.inventory_balances(product_id);
CREATE INDEX IF NOT EXISTS idx_inv_bal_warehouse ON public.inventory_balances(warehouse_id);

CREATE TRIGGER set_inventory_balances_updated_at
BEFORE UPDATE ON public.inventory_balances
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 7. IMMUTABLE STOCK MOVEMENT LEDGER
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movement_number TEXT UNIQUE NOT NULL DEFAULT public.generate_stock_movement_number(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    movement_type TEXT NOT NULL CHECK (
        movement_type IN (
            'opening',
            'purchase_receipt',
            'sales_issue',
            'adjustment_in',
            'adjustment_out',
            'transfer_in',
            'transfer_out',
            'return_in',
            'return_out'
        )
    ),
    quantity NUMERIC(10,2) NOT NULL CHECK (quantity > 0),
    unit_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (unit_cost >= 0),
    total_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (total_cost >= 0),
    reference_type TEXT CHECK (
        reference_type IN (
            'purchase_order',
            'purchase_bill',
            'goods_receipt',
            'invoice',
            'stock_adjustment',
            'stock_transfer',
            'opening_entry',
            'manual'
        )
    ),
    reference_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_stock_mov_company ON public.stock_movements(company_id);
CREATE INDEX IF NOT EXISTS idx_stock_mov_product ON public.stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_mov_warehouse ON public.stock_movements(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_stock_mov_type ON public.stock_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_stock_mov_date ON public.stock_movements(created_at DESC);

-- Guard: Immutable Stock Ledger (No Updates or Deletions)
CREATE OR REPLACE FUNCTION public.guard_stock_movements_immutability()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Stock movement ledger entries are strictly immutable and cannot be updated or deleted (Movement ID %)', OLD.id;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_guard_stock_movements_immutability
BEFORE UPDATE OR DELETE ON public.stock_movements
FOR EACH ROW EXECUTE FUNCTION public.guard_stock_movements_immutability();

-- Trigger: Apply Stock Movement to Inventory Balances
CREATE OR REPLACE FUNCTION public.apply_stock_movement_to_balance()
RETURNS TRIGGER AS $$
DECLARE
    bal_rec RECORD;
    is_inward BOOLEAN;
    new_qty NUMERIC(10,2);
    new_avg_cost NUMERIC(12,2);
    wh_status TEXT;
BEGIN
    -- 1. Validate Warehouse is active
    SELECT status INTO wh_status
    FROM public.warehouses
    WHERE id = NEW.warehouse_id;

    IF wh_status <> 'active' THEN
        RAISE EXCEPTION 'Cannot execute stock movement on inactive warehouse (ID %)', NEW.warehouse_id;
    END IF;

    -- Determine movement direction
    IF NEW.movement_type IN ('opening', 'purchase_receipt', 'adjustment_in', 'transfer_in', 'return_in') THEN
        is_inward := true;
    ELSE
        is_inward := false;
    END IF;

    -- 2. Lock / Fetch Inventory Balance row
    SELECT id, quantity_on_hand, quantity_reserved, average_unit_cost
    INTO bal_rec
    FROM public.inventory_balances
    WHERE company_id = NEW.company_id
      AND product_id = NEW.product_id
      AND warehouse_id = NEW.warehouse_id
    FOR UPDATE;

    IF NOT FOUND THEN
        -- If outward movement on non-existent balance row -> Reject
        IF NOT is_inward THEN
            RAISE EXCEPTION 'Insufficient stock: No inventory balance record exists for Product ID % in Warehouse ID %',
                NEW.product_id, NEW.warehouse_id;
        END IF;

        -- Create initial balance record for inward
        INSERT INTO public.inventory_balances (
            company_id,
            product_id,
            warehouse_id,
            quantity_on_hand,
            quantity_reserved,
            average_unit_cost
        ) VALUES (
            NEW.company_id,
            NEW.product_id,
            NEW.warehouse_id,
            NEW.quantity,
            0.00,
            NEW.unit_cost
        );
        RETURN NEW;
    END IF;

    -- 3. Balance exists: Apply inward or outward calculation
    IF is_inward THEN
        new_qty := bal_rec.quantity_on_hand + NEW.quantity;
        
        -- Weighted Moving Average (WMA) cost formula
        IF new_qty > 0 THEN
            new_avg_cost := (
                (bal_rec.quantity_on_hand * bal_rec.average_unit_cost) +
                (NEW.quantity * NEW.unit_cost)
            ) / new_qty;
        ELSE
            new_avg_cost := NEW.unit_cost;
        END IF;

        UPDATE public.inventory_balances
        SET quantity_on_hand = new_qty,
            average_unit_cost = ROUND(new_avg_cost, 2),
            updated_at = now()
        WHERE id = bal_rec.id;
    ELSE
        -- Outward: Strict Negative Stock Check
        IF bal_rec.quantity_on_hand < NEW.quantity THEN
            RAISE EXCEPTION 'Strict stock block: Insufficient stock for product %. Available: %, Requested: %',
                NEW.product_id, bal_rec.quantity_on_hand, NEW.quantity;
        END IF;

        new_qty := bal_rec.quantity_on_hand - NEW.quantity;

        UPDATE public.inventory_balances
        SET quantity_on_hand = new_qty,
            updated_at = now()
        WHERE id = bal_rec.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_apply_stock_movement_to_balance
AFTER INSERT ON public.stock_movements
FOR EACH ROW EXECUTE FUNCTION public.apply_stock_movement_to_balance();

-- =============================================================================
-- 8. GOODS RECEIPTS (GRN / Stock Inward)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.goods_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grn_number TEXT UNIQUE NOT NULL DEFAULT public.generate_grn_number(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
    purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE SET NULL,
    receipt_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'received', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    received_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    received_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_grn_company ON public.goods_receipts(company_id);
CREATE INDEX IF NOT EXISTS idx_grn_po ON public.goods_receipts(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_grn_status ON public.goods_receipts(status);

CREATE TRIGGER set_goods_receipts_updated_at
BEFORE UPDATE ON public.goods_receipts
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Goods Receipt Items
CREATE TABLE IF NOT EXISTS public.goods_receipt_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goods_receipt_id UUID NOT NULL REFERENCES public.goods_receipts(id) ON DELETE CASCADE,
    purchase_order_item_id UUID REFERENCES public.purchase_order_items(id) ON DELETE SET NULL,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    ordered_quantity NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (ordered_quantity >= 0),
    received_quantity NUMERIC(10,2) NOT NULL CHECK (received_quantity > 0),
    unit_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (unit_cost >= 0),
    total_cost NUMERIC(12,2) GENERATED ALWAYS AS (received_quantity * unit_cost) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_grn_items_grn ON public.goods_receipt_items(goods_receipt_id);
CREATE INDEX IF NOT EXISTS idx_grn_items_product ON public.goods_receipt_items(product_id);

-- Trigger: When GRN transitions to 'received', create Stock Movements
CREATE OR REPLACE FUNCTION public.process_received_goods_receipt()
RETURNS TRIGGER AS $$
DECLARE
    item_rec RECORD;
    grn_header RECORD;
BEGIN
    IF NEW.status = 'received' AND OLD.status <> 'received' THEN
        NEW.received_at := now();
        NEW.received_by := COALESCE(NEW.received_by, auth.uid());

        -- Loop through items and create stock_movements
        FOR item_rec IN
            SELECT product_id, received_quantity, unit_cost
            FROM public.goods_receipt_items
            WHERE goods_receipt_id = NEW.id
        LOOP
            INSERT INTO public.stock_movements (
                company_id,
                product_id,
                warehouse_id,
                movement_type,
                quantity,
                unit_cost,
                total_cost,
                reference_type,
                reference_id,
                notes,
                created_by
            ) VALUES (
                NEW.company_id,
                item_rec.product_id,
                NEW.warehouse_id,
                'purchase_receipt',
                item_rec.received_quantity,
                item_rec.unit_cost,
                ROUND(item_rec.received_quantity * item_rec.unit_cost, 2),
                'goods_receipt',
                NEW.id,
                'Received via GRN #' || NEW.grn_number,
                auth.uid()
            );
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_process_received_goods_receipt
BEFORE UPDATE OF status ON public.goods_receipts
FOR EACH ROW EXECUTE FUNCTION public.process_received_goods_receipt();

-- =============================================================================
-- 9. STOCK ADJUSTMENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.stock_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adjustment_number TEXT UNIQUE NOT NULL DEFAULT public.generate_adjustment_number(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    adjustment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reason TEXT NOT NULL CHECK (
        reason IN ('damage', 'loss', 'count_difference', 'correction', 'opening_stock', 'other')
    ),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (
        status IN ('draft', 'submitted', 'approved', 'rejected')
    ),
    notes TEXT,
    requested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stock_adj_company ON public.stock_adjustments(company_id);
CREATE INDEX IF NOT EXISTS idx_stock_adj_status ON public.stock_adjustments(status);

CREATE TRIGGER set_stock_adjustments_updated_at
BEFORE UPDATE ON public.stock_adjustments
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Stock Adjustment Items
CREATE TABLE IF NOT EXISTS public.stock_adjustment_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adjustment_id UUID NOT NULL REFERENCES public.stock_adjustments(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    current_quantity NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    adjusted_quantity NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    difference_quantity NUMERIC(10,2) NOT NULL,
    unit_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (unit_cost >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stock_adj_items_adj ON public.stock_adjustment_items(adjustment_id);
CREATE INDEX IF NOT EXISTS idx_stock_adj_items_prod ON public.stock_adjustment_items(product_id);

-- Trigger: When adjustment is approved, post stock movements
CREATE OR REPLACE FUNCTION public.process_approved_stock_adjustment()
RETURNS TRIGGER AS $$
DECLARE
    item_rec RECORD;
    mov_type TEXT;
    abs_qty NUMERIC(10,2);
BEGIN
    IF NEW.status = 'approved' AND OLD.status <> 'approved' THEN
        NEW.approved_at := now();
        NEW.approved_by := COALESCE(NEW.approved_by, auth.uid());

        FOR item_rec IN
            SELECT product_id, difference_quantity, unit_cost
            FROM public.stock_adjustment_items
            WHERE adjustment_id = NEW.id
        LOOP
            IF item_rec.difference_quantity > 0 THEN
                mov_type := CASE WHEN NEW.reason = 'opening_stock' THEN 'opening' ELSE 'adjustment_in' END;
                abs_qty := item_rec.difference_quantity;
            ELSIF item_rec.difference_quantity < 0 THEN
                mov_type := 'adjustment_out';
                abs_qty := ABS(item_rec.difference_quantity);
            ELSE
                CONTINUE; -- Difference is 0
            END IF;

            INSERT INTO public.stock_movements (
                company_id,
                product_id,
                warehouse_id,
                movement_type,
                quantity,
                unit_cost,
                total_cost,
                reference_type,
                reference_id,
                notes,
                created_by
            ) VALUES (
                NEW.company_id,
                item_rec.product_id,
                NEW.warehouse_id,
                mov_type,
                abs_qty,
                item_rec.unit_cost,
                ROUND(abs_qty * item_rec.unit_cost, 2),
                'stock_adjustment',
                NEW.id,
                'Stock adjustment #' || NEW.adjustment_number || ' (' || NEW.reason || ')',
                auth.uid()
            );
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_process_approved_stock_adjustment
BEFORE UPDATE OF status ON public.stock_adjustments
FOR EACH ROW EXECUTE FUNCTION public.process_approved_stock_adjustment();

-- =============================================================================
-- 10. PRODUCT SERIAL / IMEI TRACKING
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.product_serial_numbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    serial_number TEXT NOT NULL,
    warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'sold', 'damaged', 'returned')),
    purchase_bill_id UUID REFERENCES public.purchase_bills(id) ON DELETE SET NULL,
    goods_receipt_id UUID REFERENCES public.goods_receipts(id) ON DELETE SET NULL,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    warranty_months INTEGER DEFAULT 12 CHECK (warranty_months >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_company_serial_number UNIQUE (company_id, serial_number)
);

CREATE INDEX IF NOT EXISTS idx_prod_serials_company ON public.product_serial_numbers(company_id);
CREATE INDEX IF NOT EXISTS idx_prod_serials_product ON public.product_serial_numbers(product_id);
CREATE INDEX IF NOT EXISTS idx_prod_serials_status ON public.product_serial_numbers(status);
CREATE INDEX IF NOT EXISTS idx_prod_serials_serial ON public.product_serial_numbers(serial_number);

CREATE TRIGGER set_product_serial_numbers_updated_at
BEFORE UPDATE ON public.product_serial_numbers
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 11. EXTEND EXISTING TABLES SAFELY (PO, BILLS, INVOICES)
-- =============================================================================
-- 11.1 Purchase Order Items: add product_id
ALTER TABLE public.purchase_order_items
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_po_items_product_id ON public.purchase_order_items(product_id);

-- 11.2 Purchase Bill Items: add product_id and goods_receipt_item_id
ALTER TABLE public.purchase_bill_items
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE SET NULL;

ALTER TABLE public.purchase_bill_items
ADD COLUMN IF NOT EXISTS goods_receipt_item_id UUID REFERENCES public.goods_receipt_items(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bill_items_product_id ON public.purchase_bill_items(product_id);

-- 11.3 Invoice Items: add product_id
ALTER TABLE public.invoice_items
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_inv_items_product_id ON public.invoice_items(product_id);

-- =============================================================================
-- 12. INVOICE STOCK-OUT TRIGGER (Sales Issue on Issued Invoice)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.process_invoice_stock_impact()
RETURNS TRIGGER AS $$
DECLARE
    item_rec RECORD;
    def_wh_id UUID;
BEGIN
    -- Scenario A: Invoice transitioned to 'issued' -> Stock Outward
    IF NEW.status = 'issued' AND OLD.status = 'draft' THEN
        -- Find default warehouse for invoice company
        SELECT id INTO def_wh_id
        FROM public.warehouses
        WHERE company_id = NEW.company_id AND is_default = true
        LIMIT 1;

        IF def_wh_id IS NULL THEN
            SELECT id INTO def_wh_id
            FROM public.warehouses
            WHERE company_id = NEW.company_id AND status = 'active'
            LIMIT 1;
        END IF;

        -- For each product item on the invoice, record sales_issue
        FOR item_rec IN
            SELECT product_id, quantity, unit_price
            FROM public.invoice_items
            WHERE invoice_id = NEW.id AND product_id IS NOT NULL
        LOOP
            IF def_wh_id IS NOT NULL THEN
                INSERT INTO public.stock_movements (
                    company_id,
                    product_id,
                    warehouse_id,
                    movement_type,
                    quantity,
                    unit_cost,
                    total_cost,
                    reference_type,
                    reference_id,
                    notes,
                    created_by
                ) VALUES (
                    NEW.company_id,
                    item_rec.product_id,
                    def_wh_id,
                    'sales_issue',
                    item_rec.quantity,
                    item_rec.unit_price,
                    ROUND(item_rec.quantity * item_rec.unit_price, 2),
                    'invoice',
                    NEW.id,
                    'Sales dispatch for Invoice #' || NEW.invoice_number,
                    auth.uid()
                );
            END IF;
        END LOOP;

    -- Scenario B: Invoice cancelled after being issued -> Reversal (return_in)
    ELSIF NEW.status = 'cancelled' AND OLD.status IN ('issued', 'partially_paid') THEN
        SELECT id INTO def_wh_id
        FROM public.warehouses
        WHERE company_id = NEW.company_id AND is_default = true
        LIMIT 1;

        FOR item_rec IN
            SELECT product_id, quantity, unit_price
            FROM public.invoice_items
            WHERE invoice_id = NEW.id AND product_id IS NOT NULL
        LOOP
            IF def_wh_id IS NOT NULL THEN
                INSERT INTO public.stock_movements (
                    company_id,
                    product_id,
                    warehouse_id,
                    movement_type,
                    quantity,
                    unit_cost,
                    total_cost,
                    reference_type,
                    reference_id,
                    notes,
                    created_by
                ) VALUES (
                    NEW.company_id,
                    item_rec.product_id,
                    def_wh_id,
                    'return_in',
                    item_rec.quantity,
                    item_rec.unit_price,
                    ROUND(item_rec.quantity * item_rec.unit_price, 2),
                    'invoice',
                    NEW.id,
                    'Stock restored upon cancellation of Invoice #' || NEW.invoice_number,
                    auth.uid()
                );
            END IF;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_process_invoice_stock_impact ON public.invoices;
CREATE TRIGGER trg_process_invoice_stock_impact
AFTER UPDATE OF status ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.process_invoice_stock_impact();

-- =============================================================================
-- 13. ROW LEVEL SECURITY (RLS) HELPER FUNCTIONS & POLICIES
-- =============================================================================

-- Helpers
CREATE OR REPLACE FUNCTION public.can_access_product(target_prod_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN RETURN true; END IF;

    SELECT company_id INTO target_comp_id
    FROM public.products
    WHERE id = target_prod_id;

    IF target_comp_id IS NULL THEN RETURN false; END IF;
    RETURN public.has_company_access(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_manage_product_for_company(target_comp_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_super_admin() THEN RETURN true; END IF;

    RETURN EXISTS (
        SELECT 1
        FROM public.user_companies uc
        JOIN public.roles r ON r.id = uc.role_id
        WHERE uc.company_id = target_comp_id
          AND uc.user_id = auth.uid()
          AND uc.is_active = true
          AND r.slug IN ('company_manager')
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Enable RLS on all Phase 13B tables
ALTER TABLE public.product_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goods_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goods_receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_adjustment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_serial_numbers ENABLE ROW LEVEL SECURITY;

-- Product Units Policies (Readable by all authenticated)
CREATE POLICY "Product units viewable by authenticated users"
ON public.product_units FOR SELECT
TO authenticated USING (true);

-- Product Categories Policies
CREATE POLICY "Categories viewable by authorized company members"
ON public.product_categories FOR SELECT
TO authenticated USING (public.has_company_access(company_id));

CREATE POLICY "Categories manageable by company managers"
ON public.product_categories FOR ALL
TO authenticated
USING (public.can_manage_product_for_company(company_id))
WITH CHECK (public.can_manage_product_for_company(company_id));

-- Products Policies
CREATE POLICY "Products viewable by authorized company members"
ON public.products FOR SELECT
TO authenticated USING (public.has_company_access(company_id));

CREATE POLICY "Products insertable by company managers"
ON public.products FOR INSERT
TO authenticated WITH CHECK (public.can_manage_product_for_company(company_id));

CREATE POLICY "Products updatable by company managers"
ON public.products FOR UPDATE
TO authenticated
USING (public.can_manage_product_for_company(company_id))
WITH CHECK (public.can_manage_product_for_company(company_id));

CREATE POLICY "Products deletable only by super admins"
ON public.products FOR DELETE
TO authenticated USING (public.is_super_admin());

-- Warehouses Policies
CREATE POLICY "Warehouses viewable by authorized company members"
ON public.warehouses FOR SELECT
TO authenticated USING (public.has_company_access(company_id));

CREATE POLICY "Warehouses manageable by company managers"
ON public.warehouses FOR ALL
TO authenticated
USING (public.can_manage_product_for_company(company_id))
WITH CHECK (public.can_manage_product_for_company(company_id));

-- Inventory Balances Policies
CREATE POLICY "Balances viewable by authorized company members"
ON public.inventory_balances FOR SELECT
TO authenticated USING (public.has_company_access(company_id));

CREATE POLICY "Balances manageable by company managers"
ON public.inventory_balances FOR ALL
TO authenticated
USING (public.has_company_access(company_id))
WITH CHECK (public.has_company_access(company_id));

-- Stock Movements Policies (Read-only for company members; append-only)
CREATE POLICY "Stock movements viewable by authorized company members"
ON public.stock_movements FOR SELECT
TO authenticated USING (public.has_company_access(company_id));

CREATE POLICY "Stock movements insertable by authorized users"
ON public.stock_movements FOR INSERT
TO authenticated WITH CHECK (public.has_company_access(company_id));

-- Goods Receipts Policies
CREATE POLICY "GRN viewable by authorized company members"
ON public.goods_receipts FOR SELECT
TO authenticated USING (public.has_company_access(company_id));

CREATE POLICY "GRN manageable by authorized company members"
ON public.goods_receipts FOR ALL
TO authenticated
USING (public.has_company_access(company_id))
WITH CHECK (public.has_company_access(company_id));

CREATE POLICY "GRN items viewable by authorized company members"
ON public.goods_receipt_items FOR SELECT
TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.goods_receipts gr
        WHERE gr.id = goods_receipt_id AND public.has_company_access(gr.company_id)
    )
);

CREATE POLICY "GRN items manageable by authorized company members"
ON public.goods_receipt_items FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.goods_receipts gr
        WHERE gr.id = goods_receipt_id AND public.has_company_access(gr.company_id)
    )
);

-- Stock Adjustments Policies
CREATE POLICY "Stock adjustments viewable by authorized company members"
ON public.stock_adjustments FOR SELECT
TO authenticated USING (public.has_company_access(company_id));

CREATE POLICY "Stock adjustments manageable by authorized company members"
ON public.stock_adjustments FOR ALL
TO authenticated
USING (public.has_company_access(company_id))
WITH CHECK (public.has_company_access(company_id));

CREATE POLICY "Stock adjustment items viewable by authorized company members"
ON public.stock_adjustment_items FOR SELECT
TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.stock_adjustments sa
        WHERE sa.id = adjustment_id AND public.has_company_access(sa.company_id)
    )
);

CREATE POLICY "Stock adjustment items manageable by authorized company members"
ON public.stock_adjustment_items FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.stock_adjustments sa
        WHERE sa.id = adjustment_id AND public.has_company_access(sa.company_id)
    )
);

-- Serial Numbers Policies
CREATE POLICY "Serial numbers viewable by authorized company members"
ON public.product_serial_numbers FOR SELECT
TO authenticated USING (public.has_company_access(company_id));

CREATE POLICY "Serial numbers manageable by authorized company members"
ON public.product_serial_numbers FOR ALL
TO authenticated
USING (public.has_company_access(company_id))
WITH CHECK (public.has_company_access(company_id));
