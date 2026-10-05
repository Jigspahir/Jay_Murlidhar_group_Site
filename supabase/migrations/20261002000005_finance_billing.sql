-- =============================================================================
-- JAY MURLIDHAR GROUP (JMG) — MULTI-COMPANY BUSINESS MANAGEMENT PLATFORM
-- Migration: 20261002000005_finance_billing.sql
-- Description: Company Billing Extensions, Invoices, Invoice Items, Payments,
--              Expenses, Sequences, Auto-Sync Triggers, Cross-Company Validation,
--              RLS Policies, and Hardened RBAC Permissions
-- =============================================================================

-- =============================================================================
-- 1. EXTEND COMPANIES TABLE WITH OFFICIAL BILLING & BANK DETAILS
-- =============================================================================
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS gstin TEXT,
ADD COLUMN IF NOT EXISTS pan TEXT,
ADD COLUMN IF NOT EXISTS billing_address TEXT,
ADD COLUMN IF NOT EXISTS billing_city TEXT,
ADD COLUMN IF NOT EXISTS billing_state TEXT DEFAULT 'Gujarat',
ADD COLUMN IF NOT EXISTS billing_postal_code TEXT,
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS bank_account_no TEXT,
ADD COLUMN IF NOT EXISTS bank_ifsc TEXT,
ADD COLUMN IF NOT EXISTS upi_id TEXT;

-- =============================================================================
-- 2. SEQUENCES & CONCURRENCY-SAFE CODE GENERATORS
-- =============================================================================

-- Payment sequence: JMG-PAY-1001, JMG-PAY-1002, ...
CREATE SEQUENCE IF NOT EXISTS public.payment_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_payment_number()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.payment_code_seq');
    RETURN 'JMG-PAY-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Expense sequence: JMG-EXP-1001, JMG-EXP-1002, ...
CREATE SEQUENCE IF NOT EXISTS public.expense_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_expense_number()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.expense_code_seq');
    RETURN 'JMG-EXP-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Company-prefixed invoice counter table for atomic sequence per company
CREATE TABLE IF NOT EXISTS public.company_invoice_counters (
    company_id UUID PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
    prefix TEXT NOT NULL,
    current_number BIGINT NOT NULL DEFAULT 1000,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed prefix mapping for the 6 canonical companies
INSERT INTO public.company_invoice_counters (company_id, prefix, current_number)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'JMTS-INV', 1000), -- Tech Solutions
    ('c1000000-0000-0000-0000-000000000002', 'JMC-INV', 1000),  -- Computer / Jan Suvidha
    ('c1000000-0000-0000-0000-000000000003', 'JMI-INV', 1000),  -- Insurance
    ('c1000000-0000-0000-0000-000000000004', 'JMBS-INV', 1000), -- Business Services
    ('c1000000-0000-0000-0000-000000000005', 'JMT-INV', 1000),  -- Tours
    ('c1000000-0000-0000-0000-000000000006', 'JMMA-INV', 1000)  -- Mobile & Accessories
ON CONFLICT (company_id) DO NOTHING;

-- Function to generate next company-prefixed invoice number safely
CREATE OR REPLACE FUNCTION public.generate_company_invoice_number(target_comp_id UUID)
RETURNS TEXT AS $$
DECLARE
    comp_prefix TEXT;
    next_num BIGINT;
BEGIN
    -- Atomic update and retrieval of next sequence
    INSERT INTO public.company_invoice_counters (company_id, prefix, current_number)
    VALUES (target_comp_id, 'JMG-INV', 1001)
    ON CONFLICT (company_id) DO UPDATE
    SET current_number = public.company_invoice_counters.current_number + 1,
        updated_at = now()
    RETURNING prefix, current_number INTO comp_prefix, next_num;

    RETURN comp_prefix || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 3. INVOICES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
    
    -- Billing Dates
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '15 days'),
    
    -- Calculations & Totals (Precision NUMERIC 12,2)
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
    discount_type TEXT NOT NULL DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percentage')),
    discount_value NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (discount_value >= 0),
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (taxable_amount >= 0),
    
    -- Indian GST Breakup
    is_tax_invoice BOOLEAN NOT NULL DEFAULT true,
    place_of_supply TEXT NOT NULL DEFAULT 'Gujarat',
    is_interstate BOOLEAN NOT NULL DEFAULT false,
    cgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (cgst_amount >= 0),
    sgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (sgst_amount >= 0),
    igst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (igst_amount >= 0),
    total_tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (total_tax_amount >= 0),
    
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0),
    amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (amount_paid >= 0),
    balance_due NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (balance_due >= 0),
    
    -- Workflow Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (
        status IN ('draft', 'issued', 'partially_paid', 'paid', 'overdue', 'cancelled')
    ),
    
    -- Customer Historical Snapshot
    customer_name TEXT NOT NULL,
    customer_business_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    customer_address TEXT,
    customer_city TEXT,
    customer_state TEXT,
    customer_postal_code TEXT,
    customer_tax_id TEXT,
    
    -- Company Historical Snapshot
    company_name TEXT NOT NULL,
    company_legal_name TEXT,
    company_gstin TEXT,
    company_pan TEXT,
    company_address TEXT,
    company_bank_name TEXT,
    company_bank_account_no TEXT,
    company_bank_ifsc TEXT,
    company_upi_id TEXT,
    
    -- Terms & Remarks
    notes TEXT,
    terms_and_conditions TEXT,
    cancellation_reason TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    CONSTRAINT chk_amount_paid_not_exceed_total CHECK (amount_paid <= total_amount)
);

CREATE TRIGGER set_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Database-generated invoice number trigger
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := public.generate_company_invoice_number(NEW.company_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_set_invoice_number
BEFORE INSERT ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.set_invoice_number();


-- Invoices Indexes
CREATE INDEX IF NOT EXISTS idx_invoices_number ON public.invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON public.invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date ON public.invoices(invoice_date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices(created_at DESC);

-- =============================================================================
-- 4. INVOICE ITEMS TABLE (Line Items with Service Snapshot)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_service_id ON public.invoice_items(service_id);

-- =============================================================================
-- 5. PAYMENTS TABLE (Payment Ledger & Receipts)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_number TEXT UNIQUE NOT NULL DEFAULT public.generate_payment_number(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method TEXT NOT NULL CHECK (
        payment_method IN ('cash', 'upi', 'bank_transfer', 'cheque', 'card', 'online', 'other')
    ),
    reference_number TEXT,
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_payments_number ON public.payments(payment_number);
CREATE INDEX IF NOT EXISTS idx_payments_company_id ON public.payments(company_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON public.payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON public.payments(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- =============================================================================
-- 6. EXPENSES TABLE (Operational Disbursements)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_number TEXT UNIQUE NOT NULL DEFAULT public.generate_expense_number(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    
    category TEXT NOT NULL CHECK (category IN (
        'Rent & Premises',
        'Electricity & Utilities',
        'Staff Salaries & Honorarium',
        'Hardware & Mobility Inventory',
        'Server, Cloud Hosting & Domains',
        'Vehicle Maintenance & Transport',
        'Stationery, Printing & Consumables',
        'Statutory & Compliance Fees',
        'Marketing & Advertising',
        'Miscellaneous Office Expenses'
    )),
    payee_name TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount > 0),
    
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method TEXT NOT NULL DEFAULT 'bank_transfer' CHECK (
        payment_method IN ('cash', 'upi', 'bank_transfer', 'cheque', 'card', 'other')
    ),
    reference_number TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('draft', 'recorded', 'paid', 'cancelled')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TRIGGER set_expenses_updated_at
BEFORE UPDATE ON public.expenses
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_expenses_number ON public.expenses(expense_number);
CREATE INDEX IF NOT EXISTS idx_expenses_company_id ON public.expenses(company_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON public.expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON public.expenses(created_at DESC);

-- =============================================================================
-- 7. AUTOMATED DATABASE TRIGGERS FOR PAYMENT & BALANCE SYNCHRONIZATION
-- =============================================================================

-- Recalculate invoice.amount_paid and invoice.balance_due atomically on payment changes
CREATE OR REPLACE FUNCTION public.sync_invoice_payments()
RETURNS TRIGGER AS $$
DECLARE
    target_inv_id UUID;
    total_paid NUMERIC(12,2);
    inv_total NUMERIC(12,2);
    new_bal NUMERIC(12,2);
    curr_status TEXT;
    new_status TEXT;
    inv_due DATE;
BEGIN
    target_inv_id := COALESCE(NEW.invoice_id, OLD.invoice_id);

    -- Calculate total payments received for this invoice
    SELECT COALESCE(SUM(amount), 0.00) INTO total_paid
    FROM public.payments
    WHERE invoice_id = target_inv_id;

    -- Fetch current invoice total and status
    SELECT total_amount, status, due_date INTO inv_total, curr_status, inv_due
    FROM public.invoices
    WHERE id = target_inv_id;

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    -- Overpayment protection
    IF total_paid > inv_total THEN
        RAISE EXCEPTION 'Total payments (₹%) cannot exceed invoice total (₹%)', total_paid, inv_total;
    END IF;

    new_bal := inv_total - total_paid;

    -- Determine status progression
    IF curr_status <> 'cancelled' AND curr_status <> 'draft' THEN
        IF total_paid >= inv_total THEN
            new_status := 'paid';
        ELSIF total_paid > 0 THEN
            new_status := 'partially_paid';
        ELSE
            IF CURRENT_DATE > inv_due THEN
                new_status := 'overdue';
            ELSE
                new_status := 'issued';
            END IF;
        END IF;
    ELSE
        new_status := curr_status;
    END IF;

    -- Update invoice atomically
    UPDATE public.invoices
    SET amount_paid = total_paid,
        balance_due = new_bal,
        status = new_status,
        updated_at = now()
    WHERE id = target_inv_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_invoice_payments
AFTER INSERT OR UPDATE OR DELETE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.sync_invoice_payments();

-- =============================================================================
-- 8. CROSS-COMPANY CONSISTENCY VALIDATION TRIGGERS
-- =============================================================================

-- Validate Invoice Company Boundaries (Customer, Enquiry)
CREATE OR REPLACE FUNCTION public.validate_invoice_company_boundaries()
RETURNS TRIGGER AS $$
DECLARE
    cust_comp_id UUID;
    enq_comp_id UUID;
BEGIN
    -- 1. Customer must belong to invoice company
    SELECT company_id INTO cust_comp_id
    FROM public.customers
    WHERE id = NEW.customer_id;

    IF cust_comp_id IS NOT NULL AND cust_comp_id <> NEW.company_id THEN
        RAISE EXCEPTION 'Customer (ID %) belongs to company (ID %), which does not match invoice company (ID %)',
            NEW.customer_id, cust_comp_id, NEW.company_id;
    END IF;

    -- 2. Enquiry (if linked) must belong to invoice company
    IF NEW.enquiry_id IS NOT NULL THEN
        SELECT company_id INTO enq_comp_id
        FROM public.enquiries
        WHERE id = NEW.enquiry_id;

        IF enq_comp_id IS NOT NULL AND enq_comp_id <> NEW.company_id THEN
            RAISE EXCEPTION 'Enquiry (ID %) belongs to company (ID %), which does not match invoice company (ID %)',
                NEW.enquiry_id, enq_comp_id, NEW.company_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_invoice_company_boundaries
BEFORE INSERT OR UPDATE OF company_id, customer_id, enquiry_id ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.validate_invoice_company_boundaries();

-- Validate Invoice Item Service Scope
CREATE OR REPLACE FUNCTION public.validate_invoice_item_service_boundary()
RETURNS TRIGGER AS $$
DECLARE
    inv_comp_id UUID;
    srv_comp_id UUID;
BEGIN
    IF NEW.service_id IS NOT NULL THEN
        SELECT company_id INTO inv_comp_id
        FROM public.invoices
        WHERE id = NEW.invoice_id;

        SELECT company_id INTO srv_comp_id
        FROM public.services
        WHERE id = NEW.service_id;

        IF inv_comp_id IS NOT NULL AND srv_comp_id IS NOT NULL AND inv_comp_id <> srv_comp_id THEN
            RAISE EXCEPTION 'Service (ID %) belongs to company (ID %), which does not match invoice company (ID %)',
                NEW.service_id, srv_comp_id, inv_comp_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_invoice_item_service_boundary
BEFORE INSERT OR UPDATE OF invoice_id, service_id ON public.invoice_items
FOR EACH ROW EXECUTE FUNCTION public.validate_invoice_item_service_boundary();

-- Validate Payment Boundaries (Invoice & Customer)
CREATE OR REPLACE FUNCTION public.validate_payment_boundaries()
RETURNS TRIGGER AS $$
DECLARE
    inv_comp_id UUID;
    inv_cust_id UUID;
BEGIN
    SELECT company_id, customer_id INTO inv_comp_id, inv_cust_id
    FROM public.invoices
    WHERE id = NEW.invoice_id;

    IF inv_comp_id IS NOT NULL AND inv_comp_id <> NEW.company_id THEN
        RAISE EXCEPTION 'Invoice (ID %) belongs to company (ID %), which does not match payment company (ID %)',
            NEW.invoice_id, inv_comp_id, NEW.company_id;
    END IF;

    IF inv_cust_id IS NOT NULL AND inv_cust_id <> NEW.customer_id THEN
        RAISE EXCEPTION 'Invoice customer (ID %) does not match payment customer (ID %)',
            inv_cust_id, NEW.customer_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_payment_boundaries
BEFORE INSERT OR UPDATE OF company_id, invoice_id, customer_id ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.validate_payment_boundaries();

-- =============================================================================
-- 9. ROW LEVEL SECURITY (RLS) FOR FINANCE ENTITIES
-- =============================================================================

-- Security Definer Helpers
CREATE OR REPLACE FUNCTION public.can_access_invoice(target_inv_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.invoices
    WHERE id = target_inv_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.has_company_access(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_manage_invoice_for_company(target_company_id UUID)
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

CREATE OR REPLACE FUNCTION public.can_manage_invoice(target_inv_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.invoices
    WHERE id = target_inv_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.can_manage_invoice_for_company(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_access_payment(target_pay_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.payments
    WHERE id = target_pay_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.has_company_access(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_manage_payment_for_company(target_company_id UUID)
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

CREATE OR REPLACE FUNCTION public.can_access_expense(target_exp_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.expenses
    WHERE id = target_exp_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.has_company_access(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_manage_expense_for_company(target_company_id UUID)
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

CREATE OR REPLACE FUNCTION public.can_manage_expense(target_exp_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.expenses
    WHERE id = target_exp_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.can_manage_expense_for_company(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_invoice_counters ENABLE ROW LEVEL SECURITY;

-- INVOICES RLS POLICIES
CREATE POLICY "Invoices viewable by authorized company members"
ON public.invoices FOR SELECT
TO authenticated
USING (public.can_access_invoice(id));

CREATE POLICY "Invoices insertable by super admins and company managers"
ON public.invoices FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_invoice_for_company(company_id));

CREATE POLICY "Invoices updatable by super admins and company managers"
ON public.invoices FOR UPDATE
TO authenticated
USING (public.can_manage_invoice(id))
WITH CHECK (public.can_manage_invoice(id));

CREATE POLICY "Invoices deletable only by super admins"
ON public.invoices FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- INVOICE ITEMS RLS POLICIES
CREATE POLICY "Invoice items viewable by authorized invoice viewers"
ON public.invoice_items FOR SELECT
TO authenticated
USING (public.can_access_invoice(invoice_id));

CREATE POLICY "Invoice items insertable by invoice managers"
ON public.invoice_items FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_invoice(invoice_id));

CREATE POLICY "Invoice items updatable by invoice managers"
ON public.invoice_items FOR UPDATE
TO authenticated
USING (public.can_manage_invoice(invoice_id))
WITH CHECK (public.can_manage_invoice(invoice_id));

CREATE POLICY "Invoice items deletable by invoice managers"
ON public.invoice_items FOR DELETE
TO authenticated
USING (public.can_manage_invoice(invoice_id));

-- PAYMENTS RLS POLICIES
CREATE POLICY "Payments viewable by authorized company members"
ON public.payments FOR SELECT
TO authenticated
USING (public.can_access_payment(id));

CREATE POLICY "Payments insertable by super admins and company managers"
ON public.payments FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_payment_for_company(company_id));

CREATE POLICY "Payments updatable only by super admins"
ON public.payments FOR UPDATE
TO authenticated
USING (public.is_super_admin());

CREATE POLICY "Payments deletable only by super admins"
ON public.payments FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- EXPENSES RLS POLICIES
CREATE POLICY "Expenses viewable by authorized company members"
ON public.expenses FOR SELECT
TO authenticated
USING (public.can_access_expense(id));

CREATE POLICY "Expenses insertable by super admins and company managers"
ON public.expenses FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_expense_for_company(company_id));

CREATE POLICY "Expenses updatable by super admins and company managers"
ON public.expenses FOR UPDATE
TO authenticated
USING (public.can_manage_expense(id))
WITH CHECK (public.can_manage_expense(id));

CREATE POLICY "Expenses deletable only by super admins"
ON public.expenses FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- COUNTERS RLS POLICIES
CREATE POLICY "Counters viewable by authenticated users"
ON public.company_invoice_counters FOR SELECT
TO authenticated
USING (public.has_company_access(company_id));

CREATE POLICY "Counters modifiable by authorized managers"
ON public.company_invoice_counters FOR ALL
TO authenticated
USING (public.can_manage_invoice_for_company(company_id));

-- =============================================================================
-- 10. EXTEND PERMISSIONS & MAP COMPANY MANAGER ROLES
-- =============================================================================
INSERT INTO public.permissions (module, action, description)
VALUES
    ('payments', 'view', 'View payment transaction ledger and receipts'),
    ('payments', 'create', 'Record invoice settlement payment'),
    ('expenses', 'view', 'View company operating expenses'),
    ('expenses', 'create', 'Log operational expense voucher'),
    ('expenses', 'edit', 'Update expense details and receipts'),
    ('finance', 'reports', 'Access commercial financial reports and analytics')
ON CONFLICT (module, action) DO NOTHING;

-- Map full finance management permissions to Group Owner
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'group_owner'
  AND (
    p.module IN ('invoices', 'payments', 'expenses', 'finance')
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Map Company Manager permissions (Now includes write access for invoices, payments, expenses)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'company_manager'
  AND (
    (p.module = 'invoices' AND p.action IN ('view', 'create', 'edit')) OR
    (p.module = 'payments' AND p.action IN ('view', 'create')) OR
    (p.module = 'expenses' AND p.action IN ('view', 'create', 'edit')) OR
    (p.module = 'finance' AND p.action IN ('view', 'create', 'edit', 'reports'))
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;
