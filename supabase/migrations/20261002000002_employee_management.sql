-- =============================================================================
-- JAY MURLIDHAR GROUP (JMG) — MULTI-COMPANY BUSINESS MANAGEMENT PLATFORM
-- Migration: 20261002000002_employee_management.sql
-- Description: Employee Master, Multi-Company Assignment Bridge, Indexes & RLS
-- =============================================================================

-- =============================================================================
-- 1. EMPLOYEE CODE GENERATION SEQUENCE & FUNCTION
-- =============================================================================
CREATE SEQUENCE IF NOT EXISTS public.employee_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_employee_code()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.employee_code_seq');
    RETURN 'JMG-EMP-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 2. EMPLOYEES TABLE (Normalized Employee Master)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code TEXT UNIQUE NOT NULL DEFAULT public.generate_employee_code(),
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    full_name TEXT GENERATED ALWAYS AS (
        first_name || 
        CASE WHEN middle_name IS NOT NULL AND trim(middle_name) <> '' THEN ' ' || trim(middle_name) ELSE '' END || 
        ' ' || last_name
    ) STORED,
    email TEXT,
    phone TEXT,
    alternate_phone TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    employment_type TEXT NOT NULL DEFAULT 'full_time' CHECK (
        employment_type IN ('full_time', 'part_time', 'contract', 'intern', 'consultant')
    ),
    department TEXT,
    designation TEXT,
    reporting_manager_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    profile_photo_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Constraint: An employee cannot be their own reporting manager
    CONSTRAINT chk_employee_not_self_manager CHECK (
        id IS NULL OR reporting_manager_id IS NULL OR id <> reporting_manager_id
    )
);

CREATE TRIGGER set_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 3. EMPLOYEE_COMPANY_ASSIGNMENTS TABLE (Multi-Company Bridge)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.employee_company_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    designation TEXT,
    department TEXT,
    employment_type TEXT DEFAULT 'full_time' CHECK (
        employment_type IN ('full_time', 'part_time', 'contract', 'intern', 'consultant')
    ),
    joining_date DATE DEFAULT CURRENT_DATE,
    reporting_manager_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Constraints
    UNIQUE (employee_id, company_id),
    CONSTRAINT chk_eca_not_self_manager CHECK (
        employee_id IS NULL OR reporting_manager_id IS NULL OR employee_id <> reporting_manager_id
    )
);

CREATE TRIGGER set_employee_company_assignments_updated_at
BEFORE UPDATE ON public.employee_company_assignments
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 4. PERFORMANCE INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_employees_code ON public.employees(employee_code);
CREATE INDEX IF NOT EXISTS idx_employees_email ON public.employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_reporting_manager ON public.employees(reporting_manager_id);
CREATE INDEX IF NOT EXISTS idx_employees_created_at ON public.employees(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_eca_employee_id ON public.employee_company_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_eca_company_id ON public.employee_company_assignments(company_id);
CREATE INDEX IF NOT EXISTS idx_eca_is_active ON public.employee_company_assignments(is_active);
CREATE INDEX IF NOT EXISTS idx_eca_is_primary ON public.employee_company_assignments(is_primary);

-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS) & HELPER FUNCTIONS
-- =============================================================================

-- Security check: Can current user access this employee?
-- (Group owner OR user has active company membership in at least one company where employee is assigned)
CREATE OR REPLACE FUNCTION public.can_access_employee(target_emp_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    RETURN EXISTS (
        SELECT 1
        FROM public.employee_company_assignments eca
        JOIN public.user_companies uc ON uc.company_id = eca.company_id
        WHERE eca.employee_id = target_emp_id
          AND eca.is_active = true
          AND uc.user_id = auth.uid()
          AND uc.is_active = true
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Security check: Can current user manage this employee?
-- (Group owner OR company manager in at least one company where employee is assigned)
CREATE OR REPLACE FUNCTION public.can_manage_employee(target_emp_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    RETURN EXISTS (
        SELECT 1
        FROM public.employee_company_assignments eca
        JOIN public.user_companies uc ON uc.company_id = eca.company_id
        JOIN public.roles r ON r.id = uc.role_id
        WHERE eca.employee_id = target_emp_id
          AND eca.is_active = true
          AND uc.user_id = auth.uid()
          AND uc.is_active = true
          AND r.slug = 'company_manager'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Security check: Can current user manage assignments for a target company?
CREATE OR REPLACE FUNCTION public.can_manage_company_employees(target_company_id UUID)
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

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_company_assignments ENABLE ROW LEVEL SECURITY;

-- EMPLOYEES RLS POLICIES
CREATE POLICY "Employees viewable by authorized company members"
ON public.employees FOR SELECT
TO authenticated
USING (public.can_access_employee(id));

CREATE POLICY "Employees insertable by super admins and managers"
ON public.employees FOR INSERT
TO authenticated
WITH CHECK (public.is_super_admin() OR EXISTS (
    SELECT 1 FROM public.user_companies uc
    JOIN public.roles r ON r.id = uc.role_id
    WHERE uc.user_id = auth.uid()
      AND uc.is_active = true
      AND r.slug IN ('group_owner', 'company_manager')
));

CREATE POLICY "Employees updatable by super admins and company managers"
ON public.employees FOR UPDATE
TO authenticated
USING (public.can_manage_employee(id))
WITH CHECK (public.can_manage_employee(id));

CREATE POLICY "Employees deletable only by super admins"
ON public.employees FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- EMPLOYEE_COMPANY_ASSIGNMENTS RLS POLICIES
CREATE POLICY "Assignments viewable by company members"
ON public.employee_company_assignments FOR SELECT
TO authenticated
USING (public.has_company_access(company_id));

CREATE POLICY "Assignments manageable by super admins and company managers"
ON public.employee_company_assignments FOR ALL
TO authenticated
USING (public.can_manage_company_employees(company_id))
WITH CHECK (public.can_manage_company_employees(company_id));
