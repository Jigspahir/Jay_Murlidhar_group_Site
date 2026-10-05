-- =============================================================================
-- JAY MURLIDHAR GROUP (JMG) — MULTI-COMPANY BUSINESS MANAGEMENT PLATFORM
-- Migration: 20261002000001_rbac_permissions.sql
-- Description: Standardized RBAC Permissions & Role-Permission Matrix Hardening
-- =============================================================================

-- =============================================================================
-- 1. SEED STANDARDIZED PERMISSIONS
-- Normalized schema: module (TEXT), action (TEXT), description (TEXT)
-- Identifier convention: <module>.<action>
-- =============================================================================

INSERT INTO public.permissions (module, action, description)
VALUES
    -- Dashboard
    ('dashboard', 'view', 'Access company dashboard overview'),
    ('dashboard', 'view_all', 'Access consolidated multi-company group overview'),

    -- Companies
    ('companies', 'view', 'View company overview and profiles'),
    ('companies', 'create', 'Register new business operating company'),
    ('companies', 'edit', 'Update company metadata and settings'),
    ('companies', 'deactivate', 'Deactivate or archive operating company'),

    -- Members (Company Personnel Assignments)
    ('members', 'view', 'View members assigned to company'),
    ('members', 'assign', 'Assign personnel to company with role'),
    ('members', 'edit', 'Modify member role and assignment parameters'),
    ('members', 'remove', 'Remove or deactivate member from company'),

    -- Global Users
    ('users', 'view', 'View system user accounts'),
    ('users', 'manage', 'Manage system user accounts and credentials'),

    -- Employees
    ('employees', 'view', 'View employee roster and operational profiles'),
    ('employees', 'create', 'Onboard new employee record'),
    ('employees', 'edit', 'Update employee profile details'),
    ('employees', 'delete', 'Archive or delete employee record'),

    -- Customers
    ('customers', 'view', 'View customer database and interaction history'),
    ('customers', 'create', 'Register new customer record'),
    ('customers', 'edit', 'Update customer record details'),
    ('customers', 'delete', 'Archive customer record'),

    -- Services
    ('services', 'view', 'View company service offerings and catalog'),
    ('services', 'create', 'Add new service item to catalog'),
    ('services', 'edit', 'Modify service details and pricing specifications'),
    ('services', 'delete', 'Remove service item from catalog'),

    -- Enquiries
    ('enquiries', 'view', 'View customer leads and inbound enquiries'),
    ('enquiries', 'create', 'Record new lead or customer enquiry'),
    ('enquiries', 'edit', 'Update enquiry workflow status and notes'),
    ('enquiries', 'delete', 'Archive or remove enquiry record'),

    -- Finance
    ('finance', 'view', 'View income and expense registers'),
    ('finance', 'create', 'Record financial revenue or expense entry'),
    ('finance', 'edit', 'Reconcile or update financial records'),

    -- Invoices
    ('invoices', 'view', 'View billing records and customer invoices'),
    ('invoices', 'create', 'Generate new customer invoice'),
    ('invoices', 'edit', 'Modify invoice parameters and status'),

    -- Reports & Analytics
    ('reports', 'view', 'Access operational and compliance reports'),
    ('analytics', 'view', 'Inspect cross-company telemetry and metrics'),

    -- System Settings
    ('settings', 'manage', 'Configure group-level security and operational parameters')
ON CONFLICT (module, action) DO NOTHING;

-- =============================================================================
-- 2. MAP ROLE PERMISSIONS MATRIX
-- =============================================================================

-- A. Group Owner / Super Admin ('group_owner')
-- Universal authority across all modules and actions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id AS role_id, p.id AS permission_id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'group_owner'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- B. Company Manager ('company_manager')
-- Company-scoped management permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id AS role_id, p.id AS permission_id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'company_manager'
  AND (
    (p.module = 'dashboard' AND p.action = 'view') OR
    (p.module = 'companies' AND p.action = 'view') OR
    (p.module = 'members' AND p.action IN ('view', 'assign', 'edit', 'remove')) OR
    (p.module = 'employees' AND p.action IN ('view', 'create', 'edit')) OR
    (p.module = 'customers' AND p.action IN ('view', 'create', 'edit')) OR
    (p.module = 'services' AND p.action IN ('view', 'create', 'edit')) OR
    (p.module = 'enquiries' AND p.action IN ('view', 'create', 'edit')) OR
    (p.module = 'finance' AND p.action = 'view') OR
    (p.module = 'invoices' AND p.action = 'view') OR
    (p.module = 'reports' AND p.action = 'view')
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- C. Employee ('employee')
-- Scoped operational staff access
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id AS role_id, p.id AS permission_id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'employee'
  AND (
    (p.module = 'dashboard' AND p.action = 'view') OR
    (p.module = 'companies' AND p.action = 'view') OR
    (p.module = 'employees' AND p.action = 'view') OR
    (p.module = 'customers' AND p.action = 'view') OR
    (p.module = 'services' AND p.action = 'view') OR
    (p.module = 'enquiries' AND p.action = 'view')
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;
