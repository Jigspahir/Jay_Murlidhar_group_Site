-- =============================================================================
-- JAY MURLIDHAR GROUP (JMG) — MULTI-COMPANY BUSINESS MANAGEMENT PLATFORM
-- Migration: 20261002000003_customer_management.sql
-- Description: Customer Master, Sequence, Constraints, Indexes & RLS Policies
-- =============================================================================

-- =============================================================================
-- 1. CUSTOMER CODE GENERATION SEQUENCE & FUNCTION
-- =============================================================================
CREATE SEQUENCE IF NOT EXISTS public.customer_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_customer_code()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.customer_code_seq');
    RETURN 'JMG-CUS-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 2. VALIDATION TRIGGER: ASSIGNED EMPLOYEE COMPANY SCOPE
-- =============================================================================
CREATE OR REPLACE FUNCTION public.validate_customer_assigned_employee()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.assigned_employee_id IS NOT NULL THEN
        -- Verify that the assigned employee has an active assignment in the customer's company
        IF NOT EXISTS (
            SELECT 1 FROM public.employee_company_assignments eca
            WHERE eca.employee_id = NEW.assigned_employee_id
              AND eca.company_id = NEW.company_id
              AND eca.is_active = true
        ) THEN
            RAISE EXCEPTION 'Assigned employee (ID %) does not belong to or have an active assignment in company (ID %)', 
                NEW.assigned_employee_id, NEW.company_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 3. CUSTOMERS TABLE (Normalized Customer Master)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_code TEXT UNIQUE NOT NULL DEFAULT public.generate_customer_code(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_type TEXT NOT NULL DEFAULT 'individual' CHECK (customer_type IN ('individual', 'business')),
    first_name TEXT,
    last_name TEXT,
    company_name TEXT,
    display_name TEXT GENERATED ALWAYS AS (
        CASE
            WHEN customer_type = 'business' AND company_name IS NOT NULL AND trim(company_name) <> '' THEN trim(company_name)
            ELSE trim(CONCAT_WS(' ', first_name, last_name))
        END
    ) STORED,
    email TEXT,
    phone TEXT NOT NULL,
    alternate_phone TEXT,
    tax_id TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'India',
    assigned_employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Constraints
    CONSTRAINT chk_customer_name_required CHECK (
        (customer_type = 'individual' AND first_name IS NOT NULL AND trim(first_name) <> '') OR
        (customer_type = 'business' AND company_name IS NOT NULL AND trim(company_name) <> '')
    )
);

-- Updated_at trigger
CREATE TRIGGER set_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Assigned employee company boundary trigger
CREATE TRIGGER trg_validate_customer_assigned_employee
BEFORE INSERT OR UPDATE OF assigned_employee_id, company_id ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.validate_customer_assigned_employee();

-- =============================================================================
-- 4. PERFORMANCE INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_customers_code ON public.customers(customer_code);
CREATE INDEX IF NOT EXISTS idx_customers_company_id ON public.customers(company_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_assigned_employee ON public.customers(assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers(created_at DESC);

-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS) & HELPER FUNCTIONS
-- =============================================================================

-- Security check: Can current user access this customer?
CREATE OR REPLACE FUNCTION public.can_access_customer(target_cus_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.customers
    WHERE id = target_cus_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.has_company_access(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Security check: Can current user manage customers for a target company?
CREATE OR REPLACE FUNCTION public.can_manage_customer_for_company(target_company_id UUID)
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

-- Security check: Can current user manage this specific customer?
CREATE OR REPLACE FUNCTION public.can_manage_customer(target_cus_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.customers
    WHERE id = target_cus_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.can_manage_customer_for_company(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- CUSTOMERS RLS POLICIES
CREATE POLICY "Customers viewable by authorized company members"
ON public.customers FOR SELECT
TO authenticated
USING (public.can_access_customer(id));

CREATE POLICY "Customers insertable by super admins and company managers"
ON public.customers FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_customer_for_company(company_id));

CREATE POLICY "Customers updatable by super admins and company managers"
ON public.customers FOR UPDATE
TO authenticated
USING (public.can_manage_customer(id))
WITH CHECK (public.can_manage_customer(id));

CREATE POLICY "Customers deletable only by super admins"
ON public.customers FOR DELETE
TO authenticated
USING (public.is_super_admin());
