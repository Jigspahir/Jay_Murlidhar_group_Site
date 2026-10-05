-- =============================================================================
-- JAY MURLIDHAR GROUP (JMG) — MULTI-COMPANY BUSINESS MANAGEMENT PLATFORM
-- Migration: 20261001000002_seed_canonical_data.sql
-- Description: Seed Canonical Domains, Canonical Companies, Roles, & Permissions
-- =============================================================================

-- =============================================================================
-- 1. SEED CANONICAL DOMAINS (Exact 6 Domains)
-- =============================================================================
INSERT INTO public.domains (id, name, slug, description)
VALUES
    ('d1000000-0000-0000-0000-000000000001', 'Technology', 'technology', 'Custom software engineering, cloud infrastructure, modern web platforms, and intelligent automation.'),
    ('d1000000-0000-0000-0000-000000000002', 'Jan Suvidha', 'jan-suvidha', 'Common Services Centre (CSC), digital public kiosk, government e-services, and digital education.'),
    ('d1000000-0000-0000-0000-000000000003', 'Insurance', 'insurance', 'Corporate underwriting, institutional liability risk mitigation, and comprehensive claims advocacy.'),
    ('d1000000-0000-0000-0000-000000000004', 'Business Services', 'business-services', 'Corporate workflow assistance, statutory compliance filings, legal certifications, and operational management.'),
    ('d1000000-0000-0000-0000-000000000005', 'Travel', 'travel', 'Curated institutional study tours, university student delegations, faculty expeditions, and corporate itineraries.'),
    ('d1000000-0000-0000-0000-000000000006', 'Retail', 'retail', 'Smart mobility hardware, student computing device provisioning, and certified electronics servicing.')
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- =============================================================================
-- 2. SEED CANONICAL COMPANIES (Exact 6 Companies)
-- NOTE: Jay Murlidhar Computer strictly linked to Jan Suvidha domain (NOT Technology).
-- =============================================================================
INSERT INTO public.companies (id, name, slug, legal_name, description, domain_id)
VALUES
    (
        'c1000000-0000-0000-0000-000000000001',
        'Jay Murlidhar Tech Solutions',
        'jay-murlidhar-tech-solutions',
        'Jay Murlidhar Tech Solutions Pvt. Ltd.',
        'Custom software engineering, cloud infrastructure, APIs, and modern digital applications.',
        'd1000000-0000-0000-0000-000000000001' -- Technology
    ),
    (
        'c1000000-0000-0000-0000-000000000002',
        'Jay Murlidhar Computer',
        'jay-murlidhar-computer',
        'Jay Murlidhar Computer (CSC & Jan Suvidha Kendra)',
        'Your trusted neighbourhood kiosk for all digital services, government schemes, and digital literacy.',
        'd1000000-0000-0000-0000-000000000002' -- Jan Suvidha (NOT Technology)
    ),
    (
        'c1000000-0000-0000-0000-000000000003',
        'Jay Murlidhar Insurance',
        'jay-murlidhar-insurance',
        'Jay Murlidhar Insurance Services',
        'Comprehensive institutional liability risk mitigation, life and general insurance, and claims advocacy.',
        'd1000000-0000-0000-0000-000000000003' -- Insurance
    ),
    (
        'c1000000-0000-0000-0000-000000000004',
        'Jay Murlidhar Business Services',
        'jay-murlidhar-business-services',
        'Jay Murlidhar Business Services',
        'Statutory business registrations (GST, MSME, PAN/TAN), tax filings, legal certifications, and corporate compliance.',
        'd1000000-0000-0000-0000-000000000004' -- Business Services
    ),
    (
        'c1000000-0000-0000-0000-000000000005',
        'Jay Murlidhar Tours',
        'jay-murlidhar-tours',
        'Jay Murlidhar Tours & Travels',
        'Institutional study tours, university student delegations, faculty expeditions, and corporate travel.',
        'd1000000-0000-0000-0000-000000000005' -- Travel
    ),
    (
        'c1000000-0000-0000-0000-000000000006',
        'Jay Murlidhar Mobile & Accessories',
        'jay-murlidhar-mobile-accessories',
        'Jay Murlidhar Mobile & Accessories',
        'Smart mobility hardware, student computing device provisioning, and certified electronics servicing.',
        'd1000000-0000-0000-0000-000000000006' -- Retail
    )
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    legal_name = EXCLUDED.legal_name,
    description = EXCLUDED.description,
    domain_id = EXCLUDED.domain_id;

-- =============================================================================
-- 3. SEED ROLES
-- =============================================================================
INSERT INTO public.roles (id, name, slug, description)
VALUES
    ('r1000000-0000-0000-0000-000000000001', 'Group Owner / Super Admin', 'group_owner', 'Full unrestricted administrative access across all JMG group companies and consolidated systems.'),
    ('r1000000-0000-0000-0000-000000000002', 'Company Manager', 'company_manager', 'Business management and operational administrative access scoped to assigned companies.'),
    ('r1000000-0000-0000-0000-000000000003', 'Employee', 'employee', 'Operational staff access for daily workflows and customer service within assigned companies.')
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- =============================================================================
-- 4. SEED NORMALIZED PERMISSIONS
-- =============================================================================
INSERT INTO public.permissions (module, action, description)
VALUES
    -- Companies
    ('companies', 'view', 'View company overview and details'),
    ('companies', 'create', 'Register new company entity'),
    ('companies', 'update', 'Update company profile and settings'),

    -- Employees
    ('employees', 'view', 'View employee roster and contact info'),
    ('employees', 'create', 'Add new employee to company'),
    ('employees', 'update', 'Update employee details and roles'),

    -- Customers
    ('customers', 'view', 'View customer database and interaction history'),
    ('customers', 'create', 'Register new customer record'),
    ('customers', 'update', 'Update customer details'),

    -- Services
    ('services', 'view', 'View service catalog and pricing'),
    ('services', 'create', 'Add new service item to catalog'),
    ('services', 'update', 'Modify service details and pricing'),

    -- Enquiries
    ('enquiries', 'view', 'View incoming leads and customer enquiries'),
    ('enquiries', 'create', 'Record new enquiry or service request'),
    ('enquiries', 'update', 'Update enquiry status and notes'),

    -- Finance
    ('finance', 'view', 'View income and expense registers'),
    ('finance', 'create', 'Log new income or expense transaction'),
    ('finance', 'update', 'Edit or reconcile financial transaction'),

    -- Reports
    ('reports', 'view', 'Access financial and operational analytics reports'),

    -- Analytics
    ('analytics', 'view', 'Inspect cross-company telemetry and metrics'),

    -- Settings
    ('settings', 'view', 'View system and security settings'),
    ('settings', 'update', 'Modify operational and security configurations')
ON CONFLICT (module, action) DO NOTHING;

-- =============================================================================
-- 5. MAP ROLE PERMISSIONS
-- =============================================================================

-- Group Owner / Super Admin gets ALL permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 'r1000000-0000-0000-0000-000000000001' AS role_id, id AS permission_id
FROM public.permissions
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Company Manager gets company-scoped management permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 'r1000000-0000-0000-0000-000000000002' AS role_id, id AS permission_id
FROM public.permissions
WHERE module IN ('employees', 'customers', 'services', 'enquiries', 'finance', 'reports', 'settings')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Employee gets daily operational permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 'r1000000-0000-0000-0000-000000000003' AS role_id, id AS permission_id
FROM public.permissions
WHERE (module = 'customers' AND action IN ('view', 'create'))
   OR (module = 'services' AND action = 'view')
   OR (module = 'enquiries' AND action IN ('view', 'create', 'update'))
   OR (module = 'reports' AND action = 'view')
ON CONFLICT (role_id, permission_id) DO NOTHING;
