-- =============================================================================
-- JAY MURLIDHAR GROUP (JMG) — MULTI-COMPANY BUSINESS MANAGEMENT PLATFORM
-- Migration: 20261001000001_core_schema.sql
-- Description: Core Schema, Multi-Company Bridge, Roles, Permissions, Indexes & RLS
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. HELPER FUNCTIONS & TRIGGERS
-- =============================================================================

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 2. DOMAINS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_domains_updated_at
BEFORE UPDATE ON public.domains
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 3. COMPANIES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    legal_name TEXT,
    description TEXT,
    logo_url TEXT,
    domain_id UUID REFERENCES public.domains(id) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 4. PROFILES TABLE (Linked to auth.users)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatically create profile on user signup in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 5. ROLES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 6. PERMISSIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(module, action)
);

-- =============================================================================
-- 7. ROLE_PERMISSIONS TABLE (Many-to-Many Bridge)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(role_id, permission_id)
);

-- =============================================================================
-- 8. USER_COMPANIES TABLE (Central Multi-Company Relationship Bridge)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, company_id)
);

CREATE TRIGGER set_user_companies_updated_at
BEFORE UPDATE ON public.user_companies
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 9. PERFORMANCE INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_domains_slug ON public.domains(slug);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_domain_id ON public.companies(domain_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_roles_slug ON public.roles(slug);
CREATE INDEX IF NOT EXISTS idx_permissions_module ON public.permissions(module);
CREATE INDEX IF NOT EXISTS idx_permissions_action ON public.permissions(action);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON public.user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON public.user_companies(company_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_role_id ON public.user_companies(role_id);

-- =============================================================================
-- 10. ROW LEVEL SECURITY (RLS) & HELPER FUNCTIONS
-- =============================================================================

-- Security check: Is caller a Group Owner / Super Admin?
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_companies uc
        JOIN public.roles r ON r.id = uc.role_id
        WHERE uc.user_id = auth.uid() 
          AND uc.is_active = true
          AND r.slug = 'group_owner'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Security check: Does caller have access to target company?
CREATE OR REPLACE FUNCTION public.has_company_access(target_company_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Super admins have global access across all companies
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    -- Regular users must have an active association with target company
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_companies uc
        WHERE uc.user_id = auth.uid()
          AND uc.company_id = target_company_id
          AND uc.is_active = true
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_companies ENABLE ROW LEVEL SECURITY;

-- DOMAINS RLS POLICIES
CREATE POLICY "Domains are viewable by authenticated users"
ON public.domains FOR SELECT
TO authenticated
USING (true);

-- COMPANIES RLS POLICIES
CREATE POLICY "Users can view assigned companies or all if super admin"
ON public.companies FOR SELECT
TO authenticated
USING (public.has_company_access(id));

CREATE POLICY "Super admins can manage companies"
ON public.companies FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- PROFILES RLS POLICIES
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ROLES & PERMISSIONS RLS POLICIES
CREATE POLICY "Roles are viewable by authenticated users"
ON public.roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Permissions are viewable by authenticated users"
ON public.permissions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Role permissions are viewable by authenticated users"
ON public.role_permissions FOR SELECT
TO authenticated
USING (true);

-- USER_COMPANIES RLS POLICIES
CREATE POLICY "Users can view their own company memberships"
ON public.user_companies FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Super admins and company managers can manage company assignments"
ON public.user_companies FOR ALL
TO authenticated
USING (
    public.is_super_admin() OR 
    EXISTS (
        SELECT 1 FROM public.user_companies manager_uc
        JOIN public.roles r ON r.id = manager_uc.role_id
        WHERE manager_uc.user_id = auth.uid()
          AND manager_uc.company_id = user_companies.company_id
          AND manager_uc.is_active = true
          AND r.slug = 'company_manager'
    )
);
