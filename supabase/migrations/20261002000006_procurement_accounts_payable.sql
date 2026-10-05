-- =============================================================================
-- JAY MURLIDHAR GROUP (JMG) — MULTI-COMPANY BUSINESS MANAGEMENT PLATFORM
-- Migration: 20261002000006_procurement_accounts_payable.sql
-- Description: Vendor Master, Purchase Orders, Supplier Bills, Accounts Payable,
--              Vendor Payments, Sequences, Triggers, RLS, & RBAC Permissions
-- =============================================================================

-- =============================================================================
-- 1. SEQUENCES & CONCURRENCY-SAFE CODE GENERATORS
-- =============================================================================

-- Vendor Code sequence: JMG-VEN-1001, JMG-VEN-1002, ...
CREATE SEQUENCE IF NOT EXISTS public.vendor_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_vendor_code()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.vendor_code_seq');
    RETURN 'JMG-VEN-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vendor Payment sequence: JMG-VPAY-1001, JMG-VPAY-1002, ...
CREATE SEQUENCE IF NOT EXISTS public.vendor_payment_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_vendor_payment_number()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.vendor_payment_code_seq');
    RETURN 'JMG-VPAY-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Company-prefixed PO counter table for atomic sequence per company
CREATE TABLE IF NOT EXISTS public.company_po_counters (
    company_id UUID PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
    prefix TEXT NOT NULL,
    current_number BIGINT NOT NULL DEFAULT 1000,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed prefix mapping for the 6 canonical companies
INSERT INTO public.company_po_counters (company_id, prefix, current_number)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'JMTS-PO', 1000), -- Tech Solutions
    ('c1000000-0000-0000-0000-000000000002', 'JMC-PO', 1000),  -- Computer / Jan Suvidha
    ('c1000000-0000-0000-0000-000000000003', 'JMI-PO', 1000),  -- Insurance
    ('c1000000-0000-0000-0000-000000000004', 'JMBS-PO', 1000), -- Business Services
    ('c1000000-0000-0000-0000-000000000005', 'JMT-PO', 1000),  -- Tours
    ('c1000000-0000-0000-0000-000000000006', 'JMMA-PO', 1000)  -- Mobile & Accessories
ON CONFLICT (company_id) DO NOTHING;

-- Function to generate next company-prefixed PO number safely
CREATE OR REPLACE FUNCTION public.generate_company_po_number(target_comp_id UUID)
RETURNS TEXT AS $$
DECLARE
    comp_prefix TEXT;
    next_num BIGINT;
BEGIN
    INSERT INTO public.company_po_counters (company_id, prefix, current_number)
    VALUES (target_comp_id, 'JMG-PO', 1001)
    ON CONFLICT (company_id) DO UPDATE
    SET current_number = public.company_po_counters.current_number + 1,
        updated_at = now()
    RETURNING prefix, current_number INTO comp_prefix, next_num;

    RETURN comp_prefix || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Company-prefixed Bill counter table for atomic sequence per company
CREATE TABLE IF NOT EXISTS public.company_bill_counters (
    company_id UUID PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
    prefix TEXT NOT NULL,
    current_number BIGINT NOT NULL DEFAULT 1000,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed prefix mapping for the 6 canonical companies
INSERT INTO public.company_bill_counters (company_id, prefix, current_number)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'JMTS-BIL', 1000), -- Tech Solutions
    ('c1000000-0000-0000-0000-000000000002', 'JMC-BIL', 1000),  -- Computer / Jan Suvidha
    ('c1000000-0000-0000-0000-000000000003', 'JMI-BIL', 1000),  -- Insurance
    ('c1000000-0000-0000-0000-000000000004', 'JMBS-BIL', 1000), -- Business Services
    ('c1000000-0000-0000-0000-000000000005', 'JMT-BIL', 1000),  -- Tours
    ('c1000000-0000-0000-0000-000000000006', 'JMMA-BIL', 1000)  -- Mobile & Accessories
ON CONFLICT (company_id) DO NOTHING;

-- Function to generate next company-prefixed Bill number safely
CREATE OR REPLACE FUNCTION public.generate_company_bill_number(target_comp_id UUID)
RETURNS TEXT AS $$
DECLARE
    comp_prefix TEXT;
    next_num BIGINT;
BEGIN
    INSERT INTO public.company_bill_counters (company_id, prefix, current_number)
    VALUES (target_comp_id, 'JMG-BIL', 1001)
    ON CONFLICT (company_id) DO UPDATE
    SET current_number = public.company_bill_counters.current_number + 1,
        updated_at = now()
    RETURNING prefix, current_number INTO comp_prefix, next_num;

    RETURN comp_prefix || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 2. VENDORS TABLE (Normalized Vendor Master)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_code TEXT UNIQUE NOT NULL DEFAULT public.generate_vendor_code(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    
    vendor_type TEXT NOT NULL CHECK (
        vendor_type IN ('distributor', 'service_provider', 'contractor', 'landlord', 'utility', 'government', 'other')
    ),
    legal_name TEXT NOT NULL,
    trade_name TEXT,
    contact_person TEXT,
    email TEXT,
    phone TEXT NOT NULL,
    alternate_phone TEXT,
    
    gstin TEXT,
    pan TEXT,
    msme_registration_no TEXT,
    
    billing_address TEXT NOT NULL,
    billing_city TEXT NOT NULL,
    billing_state TEXT NOT NULL DEFAULT 'Gujarat',
    billing_postal_code TEXT NOT NULL,
    
    payment_terms_days INTEGER NOT NULL DEFAULT 15 CHECK (payment_terms_days >= 0),
    
    bank_name TEXT,
    bank_account_no TEXT,
    bank_ifsc TEXT,
    bank_branch TEXT,
    upi_id TEXT,
    
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blacklisted')),
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TRIGGER set_vendors_updated_at
BEFORE UPDATE ON public.vendors
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_vendors_company_id ON public.vendors(company_id);
CREATE INDEX IF NOT EXISTS idx_vendors_code ON public.vendors(vendor_code);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON public.vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_legal_name ON public.vendors(legal_name);

-- =============================================================================
-- 3. PURCHASE ORDERS & ITEMS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number TEXT UNIQUE NOT NULL,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
    
    po_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_delivery_date DATE,
    payment_terms_days INTEGER NOT NULL DEFAULT 15 CHECK (payment_terms_days >= 0),
    
    -- Calculations & Totals (Precision NUMERIC 12,2)
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (taxable_amount >= 0),
    
    place_of_supply TEXT NOT NULL DEFAULT 'Gujarat',
    is_interstate BOOLEAN NOT NULL DEFAULT false,
    cgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (cgst_amount >= 0),
    sgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (sgst_amount >= 0),
    igst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (igst_amount >= 0),
    total_tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (total_tax_amount >= 0),
    
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0),
    billed_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (billed_amount >= 0),
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (
        status IN ('draft', 'submitted', 'approved', 'issued', 'partially_billed', 'fully_billed', 'closed', 'cancelled')
    ),
    approval_status TEXT NOT NULL DEFAULT 'draft' CHECK (
        approval_status IN ('draft', 'pending_approval', 'approved', 'rejected')
    ),
    
    notes TEXT,
    terms_and_conditions TEXT,
    
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    issued_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_purchase_orders_updated_at
BEFORE UPDATE ON public.purchase_orders
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-set PO number trigger
CREATE OR REPLACE FUNCTION public.set_po_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.po_number IS NULL OR NEW.po_number = '' THEN
        NEW.po_number := public.generate_company_po_number(NEW.company_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_set_po_number
BEFORE INSERT ON public.purchase_orders
FOR EACH ROW EXECUTE FUNCTION public.set_po_number();

CREATE INDEX IF NOT EXISTS idx_po_company_id ON public.purchase_orders(company_id);
CREATE INDEX IF NOT EXISTS idx_po_vendor_id ON public.purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON public.purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_po_approval_status ON public.purchase_orders(approval_status);
CREATE INDEX IF NOT EXISTS idx_po_date ON public.purchase_orders(po_date DESC);
CREATE INDEX IF NOT EXISTS idx_po_created_at ON public.purchase_orders(created_at DESC);

-- PURCHASE ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    
    item_name TEXT NOT NULL,
    description TEXT,
    hsn_sac_code TEXT,
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1.00 CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (unit_price >= 0),
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (tax_rate >= 0),
    
    taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (taxable_amount >= 0),
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    line_total NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (line_total >= 0),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_po_items_po_id ON public.purchase_order_items(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_po_items_service_id ON public.purchase_order_items(service_id);

-- =============================================================================
-- 4. PURCHASE BILLS & ITEMS (Accounts Payable)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.purchase_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_number TEXT UNIQUE NOT NULL,
    vendor_invoice_number TEXT NOT NULL,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
    purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE SET NULL,
    
    bill_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '15 days'),
    
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (taxable_amount >= 0),
    
    place_of_supply TEXT NOT NULL DEFAULT 'Gujarat',
    is_interstate BOOLEAN NOT NULL DEFAULT false,
    cgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (cgst_amount >= 0),
    sgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (sgst_amount >= 0),
    igst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (igst_amount >= 0),
    total_tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (total_tax_amount >= 0),
    
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0),
    amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (amount_paid >= 0),
    balance_due NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (balance_due >= 0),
    
    status TEXT NOT NULL DEFAULT 'recorded' CHECK (
        status IN ('draft', 'recorded', 'partially_paid', 'paid', 'overdue', 'cancelled')
    ),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (
        payment_status IN ('unpaid', 'partially_paid', 'paid')
    ),
    
    reference_number TEXT,
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    CONSTRAINT chk_purchase_bill_amount_paid CHECK (amount_paid <= total_amount)
);

CREATE TRIGGER set_purchase_bills_updated_at
BEFORE UPDATE ON public.purchase_bills
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-set Bill number trigger
CREATE OR REPLACE FUNCTION public.set_bill_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.bill_number IS NULL OR NEW.bill_number = '' THEN
        NEW.bill_number := public.generate_company_bill_number(NEW.company_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_set_bill_number
BEFORE INSERT ON public.purchase_bills
FOR EACH ROW EXECUTE FUNCTION public.set_bill_number();

CREATE INDEX IF NOT EXISTS idx_bills_company_id ON public.purchase_bills(company_id);
CREATE INDEX IF NOT EXISTS idx_bills_vendor_id ON public.purchase_bills(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bills_po_id ON public.purchase_bills(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_bills_due_date ON public.purchase_bills(due_date);
CREATE INDEX IF NOT EXISTS idx_bills_status ON public.purchase_bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_payment_status ON public.purchase_bills(payment_status);
CREATE INDEX IF NOT EXISTS idx_bills_date ON public.purchase_bills(bill_date DESC);
CREATE INDEX IF NOT EXISTS idx_bills_created_at ON public.purchase_bills(created_at DESC);

-- PURCHASE BILL ITEMS
CREATE TABLE IF NOT EXISTS public.purchase_bill_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_bill_id UUID NOT NULL REFERENCES public.purchase_bills(id) ON DELETE CASCADE,
    purchase_order_item_id UUID REFERENCES public.purchase_order_items(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    
    item_name TEXT NOT NULL,
    description TEXT,
    hsn_sac_code TEXT,
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1.00 CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (unit_price >= 0),
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (tax_rate >= 0),
    
    taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (taxable_amount >= 0),
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    line_total NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (line_total >= 0),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bill_items_bill_id ON public.purchase_bill_items(purchase_bill_id);
CREATE INDEX IF NOT EXISTS idx_bill_items_service_id ON public.purchase_bill_items(service_id);
CREATE INDEX IF NOT EXISTS idx_bill_items_po_item_id ON public.purchase_bill_items(purchase_order_item_id);

-- =============================================================================
-- 5. VENDOR PAYMENTS TABLE (Money OUT Ledger)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.vendor_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_number TEXT UNIQUE NOT NULL DEFAULT public.generate_vendor_payment_number(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    bill_id UUID NOT NULL REFERENCES public.purchase_bills(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
    
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method TEXT NOT NULL CHECK (
        payment_method IN ('bank_transfer', 'upi', 'cheque', 'cash', 'card', 'other')
    ),
    reference_number TEXT,
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_vpay_number ON public.vendor_payments(payment_number);
CREATE INDEX IF NOT EXISTS idx_vpay_company_id ON public.vendor_payments(company_id);
CREATE INDEX IF NOT EXISTS idx_vpay_bill_id ON public.vendor_payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_vpay_vendor_id ON public.vendor_payments(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vpay_date ON public.vendor_payments(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_vpay_created_at ON public.vendor_payments(created_at DESC);

-- =============================================================================
-- 6. EXTEND EXPENSES TABLE (Backward-Compatible Vendor Link)
-- =============================================================================
ALTER TABLE public.expenses
ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_expenses_vendor_id ON public.expenses(vendor_id);

-- =============================================================================
-- 7. CROSS-COMPANY CONSISTENCY VALIDATION TRIGGERS
-- =============================================================================

-- Validate Purchase Order Company Boundaries (Vendor)
CREATE OR REPLACE FUNCTION public.validate_po_company_boundaries()
RETURNS TRIGGER AS $$
DECLARE
    ven_comp_id UUID;
BEGIN
    SELECT company_id INTO ven_comp_id
    FROM public.vendors
    WHERE id = NEW.vendor_id;

    IF ven_comp_id IS NOT NULL AND ven_comp_id <> NEW.company_id THEN
        RAISE EXCEPTION 'Vendor (ID %) belongs to company (ID %), which does not match purchase order company (ID %)',
            NEW.vendor_id, ven_comp_id, NEW.company_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_po_company_boundaries
BEFORE INSERT OR UPDATE OF company_id, vendor_id ON public.purchase_orders
FOR EACH ROW EXECUTE FUNCTION public.validate_po_company_boundaries();

-- Validate Purchase Order Item Service Boundary
CREATE OR REPLACE FUNCTION public.validate_po_item_service_boundary()
RETURNS TRIGGER AS $$
DECLARE
    po_comp_id UUID;
    srv_comp_id UUID;
BEGIN
    IF NEW.service_id IS NOT NULL THEN
        SELECT company_id INTO po_comp_id
        FROM public.purchase_orders
        WHERE id = NEW.purchase_order_id;

        SELECT company_id INTO srv_comp_id
        FROM public.services
        WHERE id = NEW.service_id;

        IF po_comp_id IS NOT NULL AND srv_comp_id IS NOT NULL AND po_comp_id <> srv_comp_id THEN
            RAISE EXCEPTION 'Service (ID %) belongs to company (ID %), which does not match purchase order company (ID %)',
                NEW.service_id, srv_comp_id, po_comp_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_po_item_service_boundary
BEFORE INSERT OR UPDATE OF purchase_order_id, service_id ON public.purchase_order_items
FOR EACH ROW EXECUTE FUNCTION public.validate_po_item_service_boundary();

-- Validate Purchase Bill Company Boundaries (Vendor, PO)
CREATE OR REPLACE FUNCTION public.validate_bill_company_boundaries()
RETURNS TRIGGER AS $$
DECLARE
    ven_comp_id UUID;
    po_comp_id UUID;
    po_ven_id UUID;
BEGIN
    -- 1. Vendor must belong to bill company
    SELECT company_id INTO ven_comp_id
    FROM public.vendors
    WHERE id = NEW.vendor_id;

    IF ven_comp_id IS NOT NULL AND ven_comp_id <> NEW.company_id THEN
        RAISE EXCEPTION 'Vendor (ID %) belongs to company (ID %), which does not match bill company (ID %)',
            NEW.vendor_id, ven_comp_id, NEW.company_id;
    END IF;

    -- 2. PO (if linked) must belong to same company and vendor
    IF NEW.purchase_order_id IS NOT NULL THEN
        SELECT company_id, vendor_id INTO po_comp_id, po_ven_id
        FROM public.purchase_orders
        WHERE id = NEW.purchase_order_id;

        IF po_comp_id IS NOT NULL AND po_comp_id <> NEW.company_id THEN
            RAISE EXCEPTION 'Purchase Order (ID %) belongs to company (ID %), which does not match bill company (ID %)',
                NEW.purchase_order_id, po_comp_id, NEW.company_id;
        END IF;

        IF po_ven_id IS NOT NULL AND po_ven_id <> NEW.vendor_id THEN
            RAISE EXCEPTION 'Purchase Order vendor (ID %) does not match bill vendor (ID %)',
                po_ven_id, NEW.vendor_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_bill_company_boundaries
BEFORE INSERT OR UPDATE OF company_id, vendor_id, purchase_order_id ON public.purchase_bills
FOR EACH ROW EXECUTE FUNCTION public.validate_bill_company_boundaries();

-- Validate Vendor Payment Boundaries (Bill & Vendor)
CREATE OR REPLACE FUNCTION public.validate_vendor_payment_boundaries()
RETURNS TRIGGER AS $$
DECLARE
    bill_comp_id UUID;
    bill_ven_id UUID;
BEGIN
    SELECT company_id, vendor_id INTO bill_comp_id, bill_ven_id
    FROM public.purchase_bills
    WHERE id = NEW.bill_id;

    IF bill_comp_id IS NOT NULL AND bill_comp_id <> NEW.company_id THEN
        RAISE EXCEPTION 'Purchase Bill (ID %) belongs to company (ID %), which does not match vendor payment company (ID %)',
            NEW.bill_id, bill_comp_id, NEW.company_id;
    END IF;

    IF bill_ven_id IS NOT NULL AND bill_ven_id <> NEW.vendor_id THEN
        RAISE EXCEPTION 'Purchase Bill vendor (ID %) does not match payment vendor (ID %)',
            bill_ven_id, NEW.vendor_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_vendor_payment_boundaries
BEFORE INSERT OR UPDATE OF company_id, bill_id, vendor_id ON public.vendor_payments
FOR EACH ROW EXECUTE FUNCTION public.validate_vendor_payment_boundaries();

-- Validate Expense Vendor Boundary (if linked)
CREATE OR REPLACE FUNCTION public.validate_expense_vendor_boundary()
RETURNS TRIGGER AS $$
DECLARE
    ven_comp_id UUID;
BEGIN
    IF NEW.vendor_id IS NOT NULL THEN
        SELECT company_id INTO ven_comp_id
        FROM public.vendors
        WHERE id = NEW.vendor_id;

        IF ven_comp_id IS NOT NULL AND ven_comp_id <> NEW.company_id THEN
            RAISE EXCEPTION 'Vendor (ID %) belongs to company (ID %), which does not match expense company (ID %)',
                NEW.vendor_id, ven_comp_id, NEW.company_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_expense_vendor_boundary
BEFORE INSERT OR UPDATE OF company_id, vendor_id ON public.expenses
FOR EACH ROW EXECUTE FUNCTION public.validate_expense_vendor_boundary();

-- =============================================================================
-- 8. AUTOMATED FINANCIAL SYNCHRONIZATION TRIGGERS
-- =============================================================================

-- Recalculate purchase_bills.amount_paid and purchase_bills.balance_due on payment changes
CREATE OR REPLACE FUNCTION public.sync_purchase_bill_payments()
RETURNS TRIGGER AS $$
DECLARE
    target_bill_id UUID;
    total_paid NUMERIC(12,2);
    bill_total NUMERIC(12,2);
    new_bal NUMERIC(12,2);
    curr_status TEXT;
    new_status TEXT;
    new_pay_status TEXT;
    bill_due DATE;
BEGIN
    target_bill_id := COALESCE(NEW.bill_id, OLD.bill_id);

    -- Calculate total vendor payments for this bill
    SELECT COALESCE(SUM(amount), 0.00) INTO total_paid
    FROM public.vendor_payments
    WHERE bill_id = target_bill_id;

    -- Fetch current bill total and status
    SELECT total_amount, status, due_date INTO bill_total, curr_status, bill_due
    FROM public.purchase_bills
    WHERE id = target_bill_id;

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    -- Overpayment protection
    IF total_paid > bill_total THEN
        RAISE EXCEPTION 'Total vendor payments (₹%) cannot exceed purchase bill total (₹%)', total_paid, bill_total;
    END IF;

    new_bal := bill_total - total_paid;

    -- Determine payment status
    IF total_paid >= bill_total THEN
        new_pay_status := 'paid';
    ELSIF total_paid > 0 THEN
        new_pay_status := 'partially_paid';
    ELSE
        new_pay_status := 'unpaid';
    END IF;

    -- Determine overall status progression
    IF curr_status <> 'cancelled' AND curr_status <> 'draft' THEN
        IF total_paid >= bill_total THEN
            new_status := 'paid';
        ELSIF total_paid > 0 THEN
            new_status := 'partially_paid';
        ELSE
            IF CURRENT_DATE > bill_due THEN
                new_status := 'overdue';
            ELSE
                new_status := 'recorded';
            END IF;
        END IF;
    ELSE
        new_status := curr_status;
    END IF;

    -- Update purchase bill atomically
    UPDATE public.purchase_bills
    SET amount_paid = total_paid,
        balance_due = new_bal,
        payment_status = new_pay_status,
        status = new_status,
        updated_at = now()
    WHERE id = target_bill_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_purchase_bill_payments
AFTER INSERT OR UPDATE OR DELETE ON public.vendor_payments
FOR EACH ROW EXECUTE FUNCTION public.sync_purchase_bill_payments();

-- Recalculate purchase_orders.billed_amount on purchase_bills changes
CREATE OR REPLACE FUNCTION public.sync_po_billed_amount()
RETURNS TRIGGER AS $$
DECLARE
    target_po_id UUID;
    total_billed NUMERIC(12,2);
    po_total NUMERIC(12,2);
    curr_po_status TEXT;
    new_po_status TEXT;
BEGIN
    target_po_id := COALESCE(NEW.purchase_order_id, OLD.purchase_order_id);
    IF target_po_id IS NULL THEN
        RETURN NULL;
    END IF;

    -- Calculate total billed from non-cancelled bills
    SELECT COALESCE(SUM(total_amount), 0.00) INTO total_billed
    FROM public.purchase_bills
    WHERE purchase_order_id = target_po_id
      AND status <> 'cancelled';

    SELECT total_amount, status INTO po_total, curr_po_status
    FROM public.purchase_orders
    WHERE id = target_po_id;

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    -- Determine PO status progression if active
    IF curr_po_status IN ('issued', 'partially_billed', 'fully_billed') THEN
        IF total_billed >= po_total THEN
            new_po_status := 'fully_billed';
        ELSIF total_billed > 0 THEN
            new_po_status := 'partially_billed';
        ELSE
            new_po_status := 'issued';
        END IF;
    ELSE
        new_po_status := curr_po_status;
    END IF;

    UPDATE public.purchase_orders
    SET billed_amount = total_billed,
        status = new_po_status,
        updated_at = now()
    WHERE id = target_po_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_po_billed_amount
AFTER INSERT OR UPDATE OF purchase_order_id, total_amount, status OR DELETE ON public.purchase_bills
FOR EACH ROW EXECUTE FUNCTION public.sync_po_billed_amount();

-- =============================================================================
-- 9. ROW LEVEL SECURITY (RLS) HELPER FUNCTIONS
-- =============================================================================

CREATE OR REPLACE FUNCTION public.can_access_vendor(target_ven_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.vendors
    WHERE id = target_ven_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.has_company_access(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_manage_vendor_for_company(target_company_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    RETURN EXISTS (
        SELECT 1
        FROM public.user_companies uc
        JOIN public.roles r ON r.id = uc.role_id
        WHERE uc.company_id = target_company_id
          AND uc.user_id = auth.uid()
          AND uc.is_active = true
          AND r.slug = 'company_manager'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_manage_vendor(target_ven_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.vendors
    WHERE id = target_ven_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.can_manage_vendor_for_company(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_access_purchase_order(target_po_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.purchase_orders
    WHERE id = target_po_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.has_company_access(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_manage_po_for_company(target_company_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    -- Both company managers and assigned employees can create/edit drafts
    RETURN EXISTS (
        SELECT 1
        FROM public.user_companies uc
        JOIN public.roles r ON r.id = uc.role_id
        WHERE uc.company_id = target_company_id
          AND uc.user_id = auth.uid()
          AND uc.is_active = true
          AND r.slug IN ('company_manager', 'employee')
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_manage_purchase_order(target_po_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.purchase_orders
    WHERE id = target_po_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.can_manage_po_for_company(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_approve_po_for_company(target_company_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    -- Only Group Owner and Company Manager can approve POs
    RETURN EXISTS (
        SELECT 1
        FROM public.user_companies uc
        JOIN public.roles r ON r.id = uc.role_id
        WHERE uc.company_id = target_company_id
          AND uc.user_id = auth.uid()
          AND uc.is_active = true
          AND r.slug = 'company_manager'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_access_purchase_bill(target_bill_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.purchase_bills
    WHERE id = target_bill_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.has_company_access(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_manage_bill_for_company(target_company_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    RETURN EXISTS (
        SELECT 1
        FROM public.user_companies uc
        JOIN public.roles r ON r.id = uc.role_id
        WHERE uc.company_id = target_company_id
          AND uc.user_id = auth.uid()
          AND uc.is_active = true
          AND r.slug = 'company_manager'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_manage_purchase_bill(target_bill_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.purchase_bills
    WHERE id = target_bill_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.can_manage_bill_for_company(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_access_vendor_payment(target_vpay_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.vendor_payments
    WHERE id = target_vpay_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.has_company_access(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_manage_vendor_payment_for_company(target_company_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    RETURN EXISTS (
        SELECT 1
        FROM public.user_companies uc
        JOIN public.roles r ON r.id = uc.role_id
        WHERE uc.company_id = target_company_id
          AND uc.user_id = auth.uid()
          AND uc.is_active = true
          AND r.slug = 'company_manager'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- =============================================================================
-- 10. ENABLE RLS & POLICIES
-- =============================================================================

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_bill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_po_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_bill_counters ENABLE ROW LEVEL SECURITY;

-- VENDORS POLICIES
CREATE POLICY "Vendors viewable by authorized company members"
ON public.vendors FOR SELECT
TO authenticated
USING (public.can_access_vendor(id));

CREATE POLICY "Vendors insertable by super admins and company managers"
ON public.vendors FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_vendor_for_company(company_id));

CREATE POLICY "Vendors updatable by super admins and company managers"
ON public.vendors FOR UPDATE
TO authenticated
USING (public.can_manage_vendor(id))
WITH CHECK (public.can_manage_vendor(id));

CREATE POLICY "Vendors deletable only by super admins"
ON public.vendors FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- PURCHASE ORDERS POLICIES
CREATE POLICY "Purchase orders viewable by authorized company members"
ON public.purchase_orders FOR SELECT
TO authenticated
USING (public.can_access_purchase_order(id));

CREATE POLICY "Purchase orders insertable by managers and assigned employees"
ON public.purchase_orders FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_po_for_company(company_id));

CREATE POLICY "Purchase orders updatable by managers and creators"
ON public.purchase_orders FOR UPDATE
TO authenticated
USING (public.can_manage_purchase_order(id))
WITH CHECK (public.can_manage_purchase_order(id));

CREATE POLICY "Purchase orders deletable only by super admins"
ON public.purchase_orders FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- PURCHASE ORDER ITEMS POLICIES
CREATE POLICY "PO items viewable by authorized PO viewers"
ON public.purchase_order_items FOR SELECT
TO authenticated
USING (public.can_access_purchase_order(purchase_order_id));

CREATE POLICY "PO items insertable by PO managers"
ON public.purchase_order_items FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_purchase_order(purchase_order_id));

CREATE POLICY "PO items updatable by PO managers"
ON public.purchase_order_items FOR UPDATE
TO authenticated
USING (public.can_manage_purchase_order(purchase_order_id))
WITH CHECK (public.can_manage_purchase_order(purchase_order_id));

CREATE POLICY "PO items deletable by PO managers"
ON public.purchase_order_items FOR DELETE
TO authenticated
USING (public.can_manage_purchase_order(purchase_order_id));

-- PURCHASE BILLS POLICIES
CREATE POLICY "Purchase bills viewable by authorized company members"
ON public.purchase_bills FOR SELECT
TO authenticated
USING (public.can_access_purchase_bill(id));

CREATE POLICY "Purchase bills insertable by managers"
ON public.purchase_bills FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_bill_for_company(company_id));

CREATE POLICY "Purchase bills updatable by managers"
ON public.purchase_bills FOR UPDATE
TO authenticated
USING (public.can_manage_purchase_bill(id))
WITH CHECK (public.can_manage_purchase_bill(id));

CREATE POLICY "Purchase bills deletable only by super admins"
ON public.purchase_bills FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- PURCHASE BILL ITEMS POLICIES
CREATE POLICY "Bill items viewable by authorized bill viewers"
ON public.purchase_bill_items FOR SELECT
TO authenticated
USING (public.can_access_purchase_bill(purchase_bill_id));

CREATE POLICY "Bill items insertable by bill managers"
ON public.purchase_bill_items FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_purchase_bill(purchase_bill_id));

CREATE POLICY "Bill items updatable by bill managers"
ON public.purchase_bill_items FOR UPDATE
TO authenticated
USING (public.can_manage_purchase_bill(purchase_bill_id))
WITH CHECK (public.can_manage_purchase_bill(purchase_bill_id));

CREATE POLICY "Bill items deletable by bill managers"
ON public.purchase_bill_items FOR DELETE
TO authenticated
USING (public.can_manage_purchase_bill(purchase_bill_id));

-- VENDOR PAYMENTS POLICIES
CREATE POLICY "Vendor payments viewable by authorized company members"
ON public.vendor_payments FOR SELECT
TO authenticated
USING (public.can_access_vendor_payment(id));

CREATE POLICY "Vendor payments insertable by managers"
ON public.vendor_payments FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_vendor_payment_for_company(company_id));

CREATE POLICY "Vendor payments updatable only by super admins"
ON public.vendor_payments FOR UPDATE
TO authenticated
USING (public.is_super_admin());

CREATE POLICY "Vendor payments deletable only by super admins"
ON public.vendor_payments FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- COUNTER POLICIES
CREATE POLICY "PO counters viewable by authenticated users"
ON public.company_po_counters FOR SELECT
TO authenticated
USING (public.has_company_access(company_id));

CREATE POLICY "PO counters modifiable by authorized managers"
ON public.company_po_counters FOR ALL
TO authenticated
USING (public.can_manage_po_for_company(company_id));

CREATE POLICY "Bill counters viewable by authenticated users"
ON public.company_bill_counters FOR SELECT
TO authenticated
USING (public.has_company_access(company_id));

CREATE POLICY "Bill counters modifiable by authorized managers"
ON public.company_bill_counters FOR ALL
TO authenticated
USING (public.can_manage_bill_for_company(company_id));

-- =============================================================================
-- 11. RBAC PERMISSIONS SEED & ROLE ASSIGNMENTS
-- =============================================================================
INSERT INTO public.permissions (module, action, description)
VALUES
    ('vendors', 'view', 'View vendor directory and details'),
    ('vendors', 'create', 'Register new vendor'),
    ('vendors', 'edit', 'Update vendor details and payment terms'),
    ('vendors', 'delete', 'Archive or delete vendor profile'),
    ('purchase_orders', 'view', 'View procurement purchase orders'),
    ('purchase_orders', 'create', 'Draft purchase order requisition'),
    ('purchase_orders', 'edit', 'Modify purchase order line items'),
    ('purchase_orders', 'approve', 'Approve, reject, or issue purchase order'),
    ('purchase_bills', 'view', 'View supplier invoices and liabilities'),
    ('purchase_bills', 'create', 'Record supplier purchase bill'),
    ('purchase_bills', 'edit', 'Update supplier bill details'),
    ('vendor_payments', 'view', 'View vendor payment disbursements'),
    ('vendor_payments', 'create', 'Record vendor payment disbursement'),
    ('finance', 'payables', 'Access accounts payable overview and aging metrics')
ON CONFLICT (module, action) DO NOTHING;

-- Map to Group Owner (Universal Group Access)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'group_owner'
  AND (
    p.module IN ('vendors', 'purchase_orders', 'purchase_bills', 'vendor_payments') OR
    (p.module = 'finance' AND p.action = 'payables')
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Map to Company Manager (Management for assigned companies)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'company_manager'
  AND (
    (p.module = 'vendors' AND p.action IN ('view', 'create', 'edit')) OR
    (p.module = 'purchase_orders' AND p.action IN ('view', 'create', 'edit', 'approve')) OR
    (p.module = 'purchase_bills' AND p.action IN ('view', 'create', 'edit')) OR
    (p.module = 'vendor_payments' AND p.action IN ('view', 'create')) OR
    (p.module = 'finance' AND p.action = 'payables')
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Map to Employee (Requisition creation & read-only access)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'employee'
  AND (
    (p.module = 'vendors' AND p.action = 'view') OR
    (p.module = 'purchase_orders' AND p.action IN ('view', 'create', 'edit'))
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;
