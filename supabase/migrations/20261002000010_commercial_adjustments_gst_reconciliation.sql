-- =============================================================================
-- JAY MURLIDHAR GROUP (JMG) — MULTI-COMPANY BUSINESS MANAGEMENT PLATFORM
-- Migration: 20261002000010_commercial_adjustments_gst_reconciliation.sql
-- Description: Phase 15B — Commercial Adjustments + GST Compliance Foundation:
--              1. Customer GSTIN & B2B/B2C Registration Extensions
--              2. Credit Notes Master & Line Items (with Stock Returns)
--              3. Debit Notes Master & Line Items (with Stock Adjustments)
--              4. Customer Advances & Invoice Allocations
--              5. Vendor Advances & Supplier Bill Allocations
--              6. Bank Statements, Transactions & Reconciliation
--              7. Sequences, Triggers, RLS Policies, and RBAC Permissions
-- =============================================================================

-- =============================================================================
-- 1. EXTEND CUSTOMERS WITH GSTIN & REGISTRATION TYPE
-- =============================================================================
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS gstin TEXT,
ADD COLUMN IF NOT EXISTS gst_registration_type TEXT NOT NULL DEFAULT 'consumer' 
    CHECK (gst_registration_type IN ('regular', 'composition', 'unregistered', 'consumer', 'overseas')),
ADD COLUMN IF NOT EXISTS pan TEXT;

CREATE INDEX IF NOT EXISTS idx_customers_gstin ON public.customers(gstin);
CREATE INDEX IF NOT EXISTS idx_customers_gst_reg_type ON public.customers(gst_registration_type);

-- =============================================================================
-- 2. SEQUENCES & CONCURRENCY-SAFE CODE GENERATORS
-- =============================================================================

-- Customer Advance Sequence: JMG-CADV-1001, JMG-CADV-1002...
CREATE SEQUENCE IF NOT EXISTS public.customer_advance_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_customer_advance_number()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.customer_advance_code_seq');
    RETURN 'JMG-CADV-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vendor Advance Sequence: JMG-VADV-1001, JMG-VADV-1002...
CREATE SEQUENCE IF NOT EXISTS public.vendor_advance_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_vendor_advance_number()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.vendor_advance_code_seq');
    RETURN 'JMG-VADV-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bank Statement Sequence: JMG-BST-1001, JMG-BST-1002...
CREATE SEQUENCE IF NOT EXISTS public.bank_statement_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_bank_statement_number()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.bank_statement_code_seq');
    RETURN 'JMG-BST-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bank Reconciliation Sequence: JMG-BRS-1001, JMG-BRS-1002...
CREATE SEQUENCE IF NOT EXISTS public.bank_reconciliation_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_bank_reconciliation_number()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.bank_reconciliation_code_seq');
    RETURN 'JMG-BRS-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Company Credit Note counter table
CREATE TABLE IF NOT EXISTS public.company_credit_note_counters (
    company_id UUID PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
    prefix TEXT NOT NULL,
    current_number BIGINT NOT NULL DEFAULT 1000,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed prefix mapping for the 6 canonical companies
INSERT INTO public.company_credit_note_counters (company_id, prefix, current_number)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'JMTS-CN', 1000), -- Tech Solutions
    ('c1000000-0000-0000-0000-000000000002', 'JMC-CN', 1000),  -- Computer / Jan Suvidha
    ('c1000000-0000-0000-0000-000000000003', 'JMI-CN', 1000),  -- Insurance
    ('c1000000-0000-0000-0000-000000000004', 'JMBS-CN', 1000), -- Business Services
    ('c1000000-0000-0000-0000-000000000005', 'JMT-CN', 1000),  -- Tours
    ('c1000000-0000-0000-0000-000000000006', 'JMMA-CN', 1000)  -- Mobile & Accessories
ON CONFLICT (company_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.generate_company_credit_note_number(target_comp_id UUID)
RETURNS TEXT AS $$
DECLARE
    comp_prefix TEXT;
    next_num BIGINT;
BEGIN
    INSERT INTO public.company_credit_note_counters (company_id, prefix, current_number)
    VALUES (target_comp_id, 'JMG-CN', 1001)
    ON CONFLICT (company_id) DO UPDATE
    SET current_number = public.company_credit_note_counters.current_number + 1,
        updated_at = now()
    RETURNING prefix, current_number INTO comp_prefix, next_num;

    RETURN comp_prefix || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Company Debit Note counter table
CREATE TABLE IF NOT EXISTS public.company_debit_note_counters (
    company_id UUID PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
    prefix TEXT NOT NULL,
    current_number BIGINT NOT NULL DEFAULT 1000,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed prefix mapping for the 6 canonical companies
INSERT INTO public.company_debit_note_counters (company_id, prefix, current_number)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'JMTS-DN', 1000), -- Tech Solutions
    ('c1000000-0000-0000-0000-000000000002', 'JMC-DN', 1000),  -- Computer / Jan Suvidha
    ('c1000000-0000-0000-0000-000000000003', 'JMI-DN', 1000),  -- Insurance
    ('c1000000-0000-0000-0000-000000000004', 'JMBS-DN', 1000), -- Business Services
    ('c1000000-0000-0000-0000-000000000005', 'JMT-DN', 1000),  -- Tours
    ('c1000000-0000-0000-0000-000000000006', 'JMMA-DN', 1000)  -- Mobile & Accessories
ON CONFLICT (company_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.generate_company_debit_note_number(target_comp_id UUID)
RETURNS TEXT AS $$
DECLARE
    comp_prefix TEXT;
    next_num BIGINT;
BEGIN
    INSERT INTO public.company_debit_note_counters (company_id, prefix, current_number)
    VALUES (target_comp_id, 'JMG-DN', 1001)
    ON CONFLICT (company_id) DO UPDATE
    SET current_number = public.company_debit_note_counters.current_number + 1,
        updated_at = now()
    RETURNING prefix, current_number INTO comp_prefix, next_num;

    RETURN comp_prefix || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 3. CREDIT NOTES MASTER & LINE ITEMS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.credit_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credit_note_number TEXT UNIQUE NOT NULL,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    
    credit_note_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reason TEXT NOT NULL CHECK (
        reason IN ('sales_return', 'damaged_goods', 'deficiency_in_service', 'post_sale_discount', 'correction', 'cancellation', 'other')
    ),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (
        status IN ('draft', 'recorded', 'applied', 'cancelled')
    ),
    
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (taxable_amount >= 0),
    
    cgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (cgst_amount >= 0),
    sgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (sgst_amount >= 0),
    igst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (igst_amount >= 0),
    total_tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (total_tax_amount >= 0),
    
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (total_amount > 0),
    amount_applied NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (amount_applied >= 0),
    balance_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (balance_amount >= 0),
    
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_cn_applied_not_exceed_total CHECK (amount_applied <= total_amount)
);

CREATE TRIGGER set_credit_notes_updated_at
BEFORE UPDATE ON public.credit_notes
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_credit_notes_company_id ON public.credit_notes(company_id);
CREATE INDEX IF NOT EXISTS idx_credit_notes_invoice_id ON public.credit_notes(invoice_id);
CREATE INDEX IF NOT EXISTS idx_credit_notes_customer_id ON public.credit_notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_credit_notes_status ON public.credit_notes(status);
CREATE INDEX IF NOT EXISTS idx_credit_notes_date ON public.credit_notes(credit_note_date DESC);

-- Credit Note Items
CREATE TABLE IF NOT EXISTS public.credit_note_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credit_note_id UUID NOT NULL REFERENCES public.credit_notes(id) ON DELETE CASCADE,
    invoice_item_id UUID REFERENCES public.invoice_items(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    
    item_name TEXT NOT NULL,
    description TEXT,
    hsn_sac_code TEXT,
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1.00 CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (unit_price >= 0),
    taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (taxable_amount >= 0),
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (tax_rate >= 0),
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    line_total NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (line_total >= 0),
    
    serial_numbers TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cn_items_cn_id ON public.credit_note_items(credit_note_id);
CREATE INDEX IF NOT EXISTS idx_cn_items_product_id ON public.credit_note_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cn_items_service_id ON public.credit_note_items(service_id);

-- =============================================================================
-- 4. DEBIT NOTES MASTER & LINE ITEMS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.debit_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debit_note_number TEXT UNIQUE NOT NULL,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    purchase_bill_id UUID NOT NULL REFERENCES public.purchase_bills(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
    
    debit_note_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reason TEXT NOT NULL CHECK (
        reason IN ('purchase_return', 'damaged_goods', 'short_shipment', 'price_discrepancy', 'discount', 'other')
    ),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (
        status IN ('draft', 'recorded', 'applied', 'cancelled')
    ),
    
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
    taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (taxable_amount >= 0),
    
    cgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (cgst_amount >= 0),
    sgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (sgst_amount >= 0),
    igst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (igst_amount >= 0),
    total_tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (total_tax_amount >= 0),
    
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (total_amount > 0),
    amount_applied NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (amount_applied >= 0),
    balance_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (balance_amount >= 0),
    
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_dn_applied_not_exceed_total CHECK (amount_applied <= total_amount)
);

CREATE TRIGGER set_debit_notes_updated_at
BEFORE UPDATE ON public.debit_notes
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_debit_notes_company_id ON public.debit_notes(company_id);
CREATE INDEX IF NOT EXISTS idx_debit_notes_bill_id ON public.debit_notes(purchase_bill_id);
CREATE INDEX IF NOT EXISTS idx_debit_notes_vendor_id ON public.debit_notes(vendor_id);
CREATE INDEX IF NOT EXISTS idx_debit_notes_status ON public.debit_notes(status);
CREATE INDEX IF NOT EXISTS idx_debit_notes_date ON public.debit_notes(debit_note_date DESC);

-- Debit Note Items
CREATE TABLE IF NOT EXISTS public.debit_note_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debit_note_id UUID NOT NULL REFERENCES public.debit_notes(id) ON DELETE CASCADE,
    purchase_bill_item_id UUID REFERENCES public.purchase_bill_items(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    
    item_name TEXT NOT NULL,
    description TEXT,
    hsn_sac_code TEXT,
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1.00 CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (unit_price >= 0),
    taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (taxable_amount >= 0),
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (tax_rate >= 0),
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    line_total NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (line_total >= 0),
    
    serial_numbers TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dn_items_dn_id ON public.debit_note_items(debit_note_id);
CREATE INDEX IF NOT EXISTS idx_dn_items_product_id ON public.debit_note_items(product_id);
CREATE INDEX IF NOT EXISTS idx_dn_items_service_id ON public.debit_note_items(service_id);

-- =============================================================================
-- 5. CUSTOMER ADVANCES & ALLOCATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.customer_advances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advance_number TEXT UNIQUE NOT NULL DEFAULT public.generate_customer_advance_number(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    
    receipt_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_mode TEXT NOT NULL CHECK (
        payment_mode IN ('bank_transfer', 'upi', 'cash', 'cheque', 'card', 'online', 'other')
    ),
    bank_account_id UUID REFERENCES public.company_bank_accounts(id) ON DELETE SET NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    allocated_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (allocated_amount >= 0),
    remaining_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (remaining_balance >= 0),
    
    reference_number TEXT,
    status TEXT NOT NULL DEFAULT 'available' CHECK (
        status IN ('available', 'partially_allocated', 'fully_allocated', 'refunded')
    ),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_cadv_allocated_not_exceed_total CHECK (allocated_amount <= amount)
);

CREATE TRIGGER set_customer_advances_updated_at
BEFORE UPDATE ON public.customer_advances
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_cadv_company_id ON public.customer_advances(company_id);
CREATE INDEX IF NOT EXISTS idx_cadv_customer_id ON public.customer_advances(customer_id);
CREATE INDEX IF NOT EXISTS idx_cadv_status ON public.customer_advances(status);
CREATE INDEX IF NOT EXISTS idx_cadv_date ON public.customer_advances(receipt_date DESC);

-- Customer Advance Allocations (Linking advance to future invoice)
CREATE TABLE IF NOT EXISTS public.customer_advance_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    advance_id UUID NOT NULL REFERENCES public.customer_advances(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
    
    allocated_amount NUMERIC(12,2) NOT NULL CHECK (allocated_amount > 0),
    allocation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cadv_alloc_company ON public.customer_advance_allocations(company_id);
CREATE INDEX IF NOT EXISTS idx_cadv_alloc_adv_id ON public.customer_advance_allocations(advance_id);
CREATE INDEX IF NOT EXISTS idx_cadv_alloc_inv_id ON public.customer_advance_allocations(invoice_id);

-- =============================================================================
-- 6. VENDOR ADVANCES & ALLOCATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.vendor_advances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advance_number TEXT UNIQUE NOT NULL DEFAULT public.generate_vendor_advance_number(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
    
    disbursement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_mode TEXT NOT NULL CHECK (
        payment_mode IN ('bank_transfer', 'upi', 'cash', 'cheque', 'card', 'other')
    ),
    bank_account_id UUID REFERENCES public.company_bank_accounts(id) ON DELETE SET NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    allocated_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (allocated_amount >= 0),
    remaining_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (remaining_balance >= 0),
    
    reference_number TEXT,
    status TEXT NOT NULL DEFAULT 'available' CHECK (
        status IN ('available', 'partially_allocated', 'fully_allocated', 'refunded')
    ),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_vadv_allocated_not_exceed_total CHECK (allocated_amount <= amount)
);

CREATE TRIGGER set_vendor_advances_updated_at
BEFORE UPDATE ON public.vendor_advances
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_vadv_company_id ON public.vendor_advances(company_id);
CREATE INDEX IF NOT EXISTS idx_vadv_vendor_id ON public.vendor_advances(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vadv_status ON public.vendor_advances(status);
CREATE INDEX IF NOT EXISTS idx_vadv_date ON public.vendor_advances(disbursement_date DESC);

-- Vendor Advance Allocations (Linking advance to future supplier bill)
CREATE TABLE IF NOT EXISTS public.vendor_advance_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    advance_id UUID NOT NULL REFERENCES public.vendor_advances(id) ON DELETE CASCADE,
    purchase_bill_id UUID NOT NULL REFERENCES public.purchase_bills(id) ON DELETE RESTRICT,
    
    allocated_amount NUMERIC(12,2) NOT NULL CHECK (allocated_amount > 0),
    allocation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vadv_alloc_company ON public.vendor_advance_allocations(company_id);
CREATE INDEX IF NOT EXISTS idx_vadv_alloc_adv_id ON public.vendor_advance_allocations(advance_id);
CREATE INDEX IF NOT EXISTS idx_vadv_alloc_bill_id ON public.vendor_advance_allocations(purchase_bill_id);

-- =============================================================================
-- 7. BANK STATEMENTS, STAGING TRANSACTIONS & RECONCILIATION
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.bank_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    statement_number TEXT UNIQUE NOT NULL DEFAULT public.generate_bank_statement_number(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    bank_account_id UUID NOT NULL REFERENCES public.company_bank_accounts(id) ON DELETE CASCADE,
    
    statement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    opening_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    closing_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_deposits NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_withdrawals NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_transactions INTEGER NOT NULL DEFAULT 0,
    
    file_name TEXT,
    status TEXT NOT NULL DEFAULT 'imported' CHECK (status IN ('imported', 'partially_reconciled', 'reconciled')),
    imported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bank_stmt_company ON public.bank_statements(company_id);
CREATE INDEX IF NOT EXISTS idx_bank_stmt_account ON public.bank_statements(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_bank_stmt_date ON public.bank_statements(statement_date DESC);

-- Bank Statement Staging Transactions
CREATE TABLE IF NOT EXISTS public.bank_statement_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    statement_id UUID NOT NULL REFERENCES public.bank_statements(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    bank_account_id UUID NOT NULL REFERENCES public.company_bank_accounts(id) ON DELETE CASCADE,
    
    transaction_date DATE NOT NULL,
    value_date DATE,
    description TEXT NOT NULL,
    cheque_reference_no TEXT,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit')),
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    balance_after NUMERIC(12,2),
    
    fingerprint TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unmatched' CHECK (status IN ('unmatched', 'matched', 'reconciled', 'ignored')),
    matched_entity_type TEXT CHECK (matched_entity_type IN ('payment', 'vendor_payment', 'expense', 'journal_entry', 'customer_advance', 'vendor_advance', 'manual')),
    matched_entity_id UUID,
    
    reconciled_at TIMESTAMPTZ,
    reconciled_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_bank_tx_fingerprint UNIQUE(company_id, bank_account_id, fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_bank_tx_company ON public.bank_statement_transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_bank_tx_statement ON public.bank_statement_transactions(statement_id);
CREATE INDEX IF NOT EXISTS idx_bank_tx_status ON public.bank_statement_transactions(status);
CREATE INDEX IF NOT EXISTS idx_bank_tx_date ON public.bank_statement_transactions(transaction_date);

-- Bank Reconciliation Statement (BRS) Records
CREATE TABLE IF NOT EXISTS public.bank_reconciliations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reconciliation_number TEXT UNIQUE NOT NULL DEFAULT public.generate_bank_reconciliation_number(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    bank_account_id UUID NOT NULL REFERENCES public.company_bank_accounts(id) ON DELETE CASCADE,
    statement_id UUID REFERENCES public.bank_statements(id) ON DELETE SET NULL,
    
    reconciliation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    as_of_date DATE NOT NULL,
    bank_statement_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    book_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    deposits_in_transit NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    outstanding_cheques NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    adjusted_bank_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    variance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'archived')),
    notes TEXT,
    finalized_at TIMESTAMPTZ,
    finalized_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bank_rec_company ON public.bank_reconciliations(company_id);
CREATE INDEX IF NOT EXISTS idx_bank_rec_account ON public.bank_reconciliations(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_bank_rec_status ON public.bank_reconciliations(status);

-- =============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.credit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_note_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debit_note_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_advance_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_advance_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_statement_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_reconciliations ENABLE ROW LEVEL SECURITY;

-- Helper check for assigned company or group owner
CREATE OR REPLACE FUNCTION public.can_access_company(target_comp_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    usr_id UUID;
    usr_role TEXT;
BEGIN
    usr_id := auth.uid();
    IF usr_id IS NULL THEN
        RETURN false;
    END IF;

    SELECT r.slug INTO usr_role
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = usr_id
    LIMIT 1;

    IF usr_role = 'group_owner' THEN
        RETURN true;
    END IF;

    RETURN EXISTS (
        SELECT 1
        FROM public.employee_company_assignments eca
        JOIN public.employees e ON eca.employee_id = e.id
        WHERE e.user_id = usr_id
          AND eca.company_id = target_comp_id
          AND eca.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS: Credit Notes
CREATE POLICY credit_notes_select_policy ON public.credit_notes
    FOR SELECT USING (public.can_access_company(company_id));
CREATE POLICY credit_notes_insert_policy ON public.credit_notes
    FOR INSERT WITH CHECK (public.can_access_company(company_id));
CREATE POLICY credit_notes_update_policy ON public.credit_notes
    FOR UPDATE USING (public.can_access_company(company_id));

-- RLS: Credit Note Items
CREATE POLICY cn_items_select_policy ON public.credit_note_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.credit_notes cn WHERE cn.id = credit_note_id AND public.can_access_company(cn.company_id))
    );
CREATE POLICY cn_items_insert_policy ON public.credit_note_items
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.credit_notes cn WHERE cn.id = credit_note_id AND public.can_access_company(cn.company_id))
    );
CREATE POLICY cn_items_update_policy ON public.credit_note_items
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.credit_notes cn WHERE cn.id = credit_note_id AND public.can_access_company(cn.company_id))
    );

-- RLS: Debit Notes
CREATE POLICY debit_notes_select_policy ON public.debit_notes
    FOR SELECT USING (public.can_access_company(company_id));
CREATE POLICY debit_notes_insert_policy ON public.debit_notes
    FOR INSERT WITH CHECK (public.can_access_company(company_id));
CREATE POLICY debit_notes_update_policy ON public.debit_notes
    FOR UPDATE USING (public.can_access_company(company_id));

-- RLS: Debit Note Items
CREATE POLICY dn_items_select_policy ON public.debit_note_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.debit_notes dn WHERE dn.id = debit_note_id AND public.can_access_company(dn.company_id))
    );
CREATE POLICY dn_items_insert_policy ON public.debit_note_items
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.debit_notes dn WHERE dn.id = debit_note_id AND public.can_access_company(dn.company_id))
    );
CREATE POLICY dn_items_update_policy ON public.debit_note_items
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.debit_notes dn WHERE dn.id = debit_note_id AND public.can_access_company(dn.company_id))
    );

-- RLS: Customer Advances & Allocations
CREATE POLICY cadv_select_policy ON public.customer_advances
    FOR SELECT USING (public.can_access_company(company_id));
CREATE POLICY cadv_insert_policy ON public.customer_advances
    FOR INSERT WITH CHECK (public.can_access_company(company_id));
CREATE POLICY cadv_update_policy ON public.customer_advances
    FOR UPDATE USING (public.can_access_company(company_id));

CREATE POLICY cadv_alloc_select_policy ON public.customer_advance_allocations
    FOR SELECT USING (public.can_access_company(company_id));
CREATE POLICY cadv_alloc_insert_policy ON public.customer_advance_allocations
    FOR INSERT WITH CHECK (public.can_access_company(company_id));

-- RLS: Vendor Advances & Allocations
CREATE POLICY vadv_select_policy ON public.vendor_advances
    FOR SELECT USING (public.can_access_company(company_id));
CREATE POLICY vadv_insert_policy ON public.vendor_advances
    FOR INSERT WITH CHECK (public.can_access_company(company_id));
CREATE POLICY vadv_update_policy ON public.vendor_advances
    FOR UPDATE USING (public.can_access_company(company_id));

CREATE POLICY vadv_alloc_select_policy ON public.vendor_advance_allocations
    FOR SELECT USING (public.can_access_company(company_id));
CREATE POLICY vadv_alloc_insert_policy ON public.vendor_advance_allocations
    FOR INSERT WITH CHECK (public.can_access_company(company_id));

-- RLS: Banking & BRS
CREATE POLICY bstmt_select_policy ON public.bank_statements
    FOR SELECT USING (public.can_access_company(company_id));
CREATE POLICY bstmt_insert_policy ON public.bank_statements
    FOR INSERT WITH CHECK (public.can_access_company(company_id));
CREATE POLICY bstmt_update_policy ON public.bank_statements
    FOR UPDATE USING (public.can_access_company(company_id));

CREATE POLICY btx_select_policy ON public.bank_statement_transactions
    FOR SELECT USING (public.can_access_company(company_id));
CREATE POLICY btx_insert_policy ON public.bank_statement_transactions
    FOR INSERT WITH CHECK (public.can_access_company(company_id));
CREATE POLICY btx_update_policy ON public.bank_statement_transactions
    FOR UPDATE USING (public.can_access_company(company_id));

CREATE POLICY brec_select_policy ON public.bank_reconciliations
    FOR SELECT USING (public.can_access_company(company_id));
CREATE POLICY brec_insert_policy ON public.bank_reconciliations
    FOR INSERT WITH CHECK (public.can_access_company(company_id));
CREATE POLICY brec_update_policy ON public.bank_reconciliations
    FOR UPDATE USING (public.can_access_company(company_id));

-- =============================================================================
-- 9. SEED PHASE 15B PERMISSIONS
-- =============================================================================
INSERT INTO public.permissions (module, action, description)
VALUES
    ('credit_notes', 'view', 'View sales credit notes'),
    ('credit_notes', 'create', 'Create and record sales credit notes'),
    ('credit_notes', 'edit', 'Edit and manage credit notes'),
    ('credit_notes', 'cancel', 'Cancel sales credit notes'),
    ('debit_notes', 'view', 'View purchase debit notes'),
    ('debit_notes', 'create', 'Create and record purchase debit notes'),
    ('debit_notes', 'edit', 'Edit and manage debit notes'),
    ('advances', 'view', 'View customer and vendor advances'),
    ('advances', 'create', 'Create advance payments or disbursements'),
    ('advances', 'allocate', 'Allocate advances against invoices or supplier bills'),
    ('gst', 'view', 'View GSTR-1, GSTR-3B and GST workspaces'),
    ('gst', 'export', 'Export GST datasets in JSON or Excel format'),
    ('gst', 'finalize', 'Finalize and lock GST return periods'),
    ('einvoice', 'generate', 'Generate offline e-Invoice JSON payloads'),
    ('bank_reconciliation', 'view', 'View bank statements and reconciliation reports'),
    ('bank_reconciliation', 'import', 'Import CSV/Excel bank statements'),
    ('bank_reconciliation', 'match', 'Match and stage bank transactions'),
    ('bank_reconciliation', 'finalize', 'Finalize monthly bank reconciliation statements'),
    ('reports', 'ar_ageing', 'View Accounts Receivable ageing reports'),
    ('reports', 'ap_ageing', 'View Accounts Payable ageing reports')
ON CONFLICT (module, action) DO NOTHING;

-- Grant Group Owner all permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'group_owner'
  AND p.module IN ('credit_notes', 'debit_notes', 'advances', 'gst', 'einvoice', 'bank_reconciliation', 'reports')
ON CONFLICT DO NOTHING;

-- Grant Company Manager operational permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'company_manager'
  AND (
      (p.module = 'credit_notes' AND p.action IN ('view', 'create', 'edit'))
   OR (p.module = 'debit_notes' AND p.action IN ('view', 'create', 'edit'))
   OR (p.module = 'advances' AND p.action IN ('view', 'create', 'allocate'))
   OR (p.module = 'gst' AND p.action IN ('view', 'export'))
   OR (p.module = 'einvoice' AND p.action IN ('generate'))
   OR (p.module = 'bank_reconciliation' AND p.action IN ('view', 'import', 'match'))
   OR (p.module = 'reports' AND p.action IN ('ar_ageing', 'ap_ageing'))
  )
ON CONFLICT DO NOTHING;
