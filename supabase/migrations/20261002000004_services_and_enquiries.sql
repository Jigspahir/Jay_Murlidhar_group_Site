-- =============================================================================
-- JAY MURLIDHAR GROUP (JMG) — MULTI-COMPANY BUSINESS MANAGEMENT PLATFORM
-- Migration: 20261002000004_services_and_enquiries.sql
-- Description: Services Master, Enquiry CRM, Code Sequences, Constraints, 
--              Cross-Company Validation Triggers, RLS & Canonical Services Seed
-- =============================================================================

-- =============================================================================
-- 1. SERVICE & ENQUIRY CODE SEQUENCES & FUNCTIONS
-- =============================================================================
CREATE SEQUENCE IF NOT EXISTS public.service_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_service_code()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.service_code_seq');
    RETURN 'JMG-SRV-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE SEQUENCE IF NOT EXISTS public.enquiry_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_enquiry_code()
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
BEGIN
    next_val := nextval('public.enquiry_code_seq');
    RETURN 'JMG-ENQ-' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 2. SERVICES MASTER TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_code TEXT UNIQUE NOT NULL DEFAULT public.generate_service_code(),
    service_name TEXT NOT NULL,
    description TEXT,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    category TEXT,
    base_price NUMERIC NOT NULL DEFAULT 0 CHECK (base_price >= 0),
    billing_type TEXT NOT NULL DEFAULT 'fixed' CHECK (
        billing_type IN ('fixed', 'hourly', 'recurring_monthly', 'quote_based', 'government_fee')
    ),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Updated_at trigger for services
CREATE TRIGGER set_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Services Indexes
CREATE INDEX IF NOT EXISTS idx_services_code ON public.services(service_code);
CREATE INDEX IF NOT EXISTS idx_services_company_id ON public.services(company_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_billing_type ON public.services(billing_type);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON public.services(created_at DESC);

-- =============================================================================
-- 3. ENQUIRIES TABLE (CRM Leads & Customer Enquiries)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_code TEXT UNIQUE NOT NULL DEFAULT public.generate_enquiry_code(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    assigned_employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    subject TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (
        status IN ('new', 'contacted', 'in_progress', 'follow_up', 'converted', 'closed', 'lost')
    ),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (
        priority IN ('low', 'medium', 'high', 'urgent')
    ),
    source TEXT NOT NULL DEFAULT 'website' CHECK (
        source IN ('website', 'walk_in', 'phone', 'whatsapp', 'referral', 'social_media', 'email', 'other')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Updated_at trigger for enquiries
CREATE TRIGGER set_enquiries_updated_at
BEFORE UPDATE ON public.enquiries
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 4. CROSS-COMPANY DATA CONSISTENCY VALIDATION TRIGGER
-- =============================================================================
CREATE OR REPLACE FUNCTION public.validate_enquiry_company_boundaries()
RETURNS TRIGGER AS $$
DECLARE
    cust_comp_id UUID;
    srv_comp_id UUID;
BEGIN
    -- 1. Validate Customer Company Scope
    IF NEW.customer_id IS NOT NULL THEN
        SELECT company_id INTO cust_comp_id
        FROM public.customers
        WHERE id = NEW.customer_id;

        IF cust_comp_id IS NOT NULL AND cust_comp_id <> NEW.company_id THEN
            RAISE EXCEPTION 'Customer (ID %) belongs to company (ID %), which does not match enquiry company (ID %)',
                NEW.customer_id, cust_comp_id, NEW.company_id;
        END IF;
    END IF;

    -- 2. Validate Service Company Scope
    IF NEW.service_id IS NOT NULL THEN
        SELECT company_id INTO srv_comp_id
        FROM public.services
        WHERE id = NEW.service_id;

        IF srv_comp_id IS NOT NULL AND srv_comp_id <> NEW.company_id THEN
            RAISE EXCEPTION 'Service (ID %) belongs to company (ID %), which does not match enquiry company (ID %)',
                NEW.service_id, srv_comp_id, NEW.company_id;
        END IF;
    END IF;

    -- 3. Validate Assigned Employee Company Scope
    IF NEW.assigned_employee_id IS NOT NULL THEN
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

CREATE TRIGGER trg_validate_enquiry_company_boundaries
BEFORE INSERT OR UPDATE OF company_id, customer_id, service_id, assigned_employee_id ON public.enquiries
FOR EACH ROW EXECUTE FUNCTION public.validate_enquiry_company_boundaries();

-- Enquiries Indexes
CREATE INDEX IF NOT EXISTS idx_enquiries_code ON public.enquiries(enquiry_code);
CREATE INDEX IF NOT EXISTS idx_enquiries_company_id ON public.enquiries(company_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_customer_id ON public.enquiries(customer_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_service_id ON public.enquiries(service_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_assigned_employee ON public.enquiries(assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_priority ON public.enquiries(priority);
CREATE INDEX IF NOT EXISTS idx_enquiries_source ON public.enquiries(source);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);

-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS) FOR SERVICES
-- =============================================================================

CREATE OR REPLACE FUNCTION public.can_access_service(target_srv_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.services
    WHERE id = target_srv_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.has_company_access(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_manage_service_for_company(target_company_id UUID)
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

CREATE OR REPLACE FUNCTION public.can_manage_service(target_srv_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.services
    WHERE id = target_srv_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.can_manage_service_for_company(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services viewable by authorized company members"
ON public.services FOR SELECT
TO authenticated
USING (public.can_access_service(id));

CREATE POLICY "Services insertable by super admins and company managers"
ON public.services FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_service_for_company(company_id));

CREATE POLICY "Services updatable by super admins and company managers"
ON public.services FOR UPDATE
TO authenticated
USING (public.can_manage_service(id))
WITH CHECK (public.can_manage_service(id));

CREATE POLICY "Services deletable only by super admins"
ON public.services FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- =============================================================================
-- 6. ROW LEVEL SECURITY (RLS) FOR ENQUIRIES
-- =============================================================================

CREATE OR REPLACE FUNCTION public.can_access_enquiry(target_enq_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.enquiries
    WHERE id = target_enq_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.has_company_access(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_manage_enquiry_for_company(target_company_id UUID)
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

CREATE OR REPLACE FUNCTION public.can_manage_enquiry(target_enq_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    target_comp_id UUID;
BEGIN
    IF public.is_super_admin() THEN
        RETURN true;
    END IF;

    SELECT company_id INTO target_comp_id
    FROM public.enquiries
    WHERE id = target_enq_id;

    IF target_comp_id IS NULL THEN
        RETURN false;
    END IF;

    RETURN public.can_manage_enquiry_for_company(target_comp_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enquiries viewable by authorized company members"
ON public.enquiries FOR SELECT
TO authenticated
USING (public.can_access_enquiry(id));

CREATE POLICY "Enquiries insertable by super admins and company managers"
ON public.enquiries FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_enquiry_for_company(company_id));

CREATE POLICY "Enquiries updatable by super admins and company managers"
ON public.enquiries FOR UPDATE
TO authenticated
USING (public.can_manage_enquiry(id))
WITH CHECK (public.can_manage_enquiry(id));

CREATE POLICY "Enquiries deletable only by super admins"
ON public.enquiries FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- =============================================================================
-- 7. CANONICAL SERVICES SEED (69 Verified Services Across 6 Companies)
-- Mapped using canonical company IDs established in 20261001000002_seed_canonical_data.sql
-- =============================================================================

INSERT INTO public.services (
    id, service_code, company_id, service_name, category, billing_type, base_price, description, status
)
VALUES
    -- -------------------------------------------------------------------------
    -- Company 1: Jay Murlidhar Tech Solutions ('c1000000-0000-0000-0000-000000000001')
    -- Domain: Technology
    -- -------------------------------------------------------------------------
    ('s1000000-0000-0000-0000-000000000001', 'JMG-SRV-1001', 'c1000000-0000-0000-0000-000000000001', 'Website Design', 'Technology', 'fixed', 15000, 'Modern, responsive website design and UI/UX design tailored for business growth.', 'active'),
    ('s1000000-0000-0000-0000-000000000002', 'JMG-SRV-1002', 'c1000000-0000-0000-0000-000000000001', 'Website Development', 'Technology', 'fixed', 25000, 'Custom full-stack web application and portal engineering with high performance.', 'active'),
    ('s1000000-0000-0000-0000-000000000003', 'JMG-SRV-1003', 'c1000000-0000-0000-0000-000000000001', 'App Development', 'Technology', 'quote_based', 50000, 'Native and cross-platform mobile application development for Android and iOS.', 'active'),
    ('s1000000-0000-0000-0000-000000000004', 'JMG-SRV-1004', 'c1000000-0000-0000-0000-000000000001', 'Software Development', 'Technology', 'quote_based', 60000, 'Enterprise bespoke software engineering, workflow automation, and custom ERP systems.', 'active'),
    ('s1000000-0000-0000-0000-000000000005', 'JMG-SRV-1005', 'c1000000-0000-0000-0000-000000000001', 'Digital Marketing', 'Technology', 'recurring_monthly', 10000, 'Multi-channel digital marketing campaigns, lead generation, and growth consulting.', 'active'),
    ('s1000000-0000-0000-0000-000000000006', 'JMG-SRV-1006', 'c1000000-0000-0000-0000-000000000001', 'Social Media Marketing', 'Technology', 'recurring_monthly', 8000, 'End-to-end brand management, creative posts, and engagement across social channels.', 'active'),
    ('s1000000-0000-0000-0000-000000000007', 'JMG-SRV-1007', 'c1000000-0000-0000-0000-000000000001', 'Graphic Design', 'Technology', 'fixed', 5000, 'Corporate identity design, brochures, promotional banners, and marketing creatives.', 'active'),
    ('s1000000-0000-0000-0000-000000000008', 'JMG-SRV-1008', 'c1000000-0000-0000-0000-000000000001', 'SEO Services', 'Technology', 'recurring_monthly', 12000, 'Search engine optimization, keyword ranking, technical audit, and organic growth.', 'active'),
    ('s1000000-0000-0000-0000-000000000009', 'JMG-SRV-1009', 'c1000000-0000-0000-0000-000000000001', 'WhatsApp API Solutions', 'Technology', 'recurring_monthly', 3500, 'Official WhatsApp Business API integration, broadcast notifications, and CRM bots.', 'active'),
    ('s1000000-0000-0000-0000-000000000010', 'JMG-SRV-1010', 'c1000000-0000-0000-0000-000000000001', 'Bulk SMS Services', 'Technology', 'fixed', 2000, 'Transactional and promotional SMS gateway delivery with DLT compliance support.', 'active'),
    ('s1000000-0000-0000-0000-000000000011', 'JMG-SRV-1011', 'c1000000-0000-0000-0000-000000000001', 'Hosting & Domain', 'Technology', 'recurring_monthly', 4500, 'High-availability cloud hosting, SSL certificates, business email, and domain management.', 'active'),
    ('s1000000-0000-0000-0000-000000000012', 'JMG-SRV-1012', 'c1000000-0000-0000-0000-000000000001', 'AI Chatbot Development', 'Technology', 'quote_based', 30000, 'Intelligent generative conversational chatbots and automated customer service bots.', 'active'),

    -- -------------------------------------------------------------------------
    -- Company 2: Jay Murlidhar Computer ('c1000000-0000-0000-0000-000000000002')
    -- Domain: Jan Suvidha (CSC / Jan Suvidha Kendra / Academy)
    -- -------------------------------------------------------------------------
    -- RTO Services
    ('s1000000-0000-0000-0000-000000000013', 'JMG-SRV-1013', 'c1000000-0000-0000-0000-000000000002', 'Vehicle Registration', 'RTO Services', 'government_fee', 1500, 'New vehicle registration, RC renewal, and parivahan portal documentation support.', 'active'),
    ('s1000000-0000-0000-0000-000000000014', 'JMG-SRV-1014', 'c1000000-0000-0000-0000-000000000002', 'Ownership Transfer', 'RTO Services', 'government_fee', 1200, 'Complete assistance for vehicle ownership transfer, NOC, and hypothecation removal.', 'active'),
    ('s1000000-0000-0000-0000-000000000015', 'JMG-SRV-1015', 'c1000000-0000-0000-0000-000000000002', 'Driving Licence Assistance', 'RTO Services', 'government_fee', 1000, 'Learner licence, driving licence slot booking, renewal, and address change assistance.', 'active'),
    ('s1000000-0000-0000-0000-000000000016', 'JMG-SRV-1016', 'c1000000-0000-0000-0000-000000000002', 'Online RTO Documentation', 'RTO Services', 'fixed', 500, 'Online form submission, tax payments, and certified affidavit drafting for RTO matters.', 'active'),
    ('s1000000-0000-0000-0000-000000000017', 'JMG-SRV-1017', 'c1000000-0000-0000-0000-000000000002', 'RTO Support & Verification', 'RTO Services', 'fixed', 800, 'Document scrutiny and end-to-end follow-up with transport authority offices.', 'active'),
    -- CSC & Citizen Services
    ('s1000000-0000-0000-0000-000000000018', 'JMG-SRV-1018', 'c1000000-0000-0000-0000-000000000002', 'GST Registration & Filing', 'CSC & Citizen Services', 'fixed', 2500, 'New GSTIN registration, regular monthly/quarterly GSTR-1 and GSTR-3B filings.', 'active'),
    ('s1000000-0000-0000-0000-000000000019', 'JMG-SRV-1019', 'c1000000-0000-0000-0000-000000000002', 'MSME Registration', 'CSC & Citizen Services', 'fixed', 1000, 'Udyam/MSME certificate registration for micro, small, and medium businesses.', 'active'),
    ('s1000000-0000-0000-0000-000000000020', 'JMG-SRV-1020', 'c1000000-0000-0000-0000-000000000002', 'PAN / TAN Card', 'CSC & Citizen Services', 'government_fee', 200, 'New PAN card application, corrections, duplicate reprint, and TAN registration.', 'active'),
    ('s1000000-0000-0000-0000-000000000021', 'JMG-SRV-1021', 'c1000000-0000-0000-0000-000000000002', 'Shop Act License', 'CSC & Citizen Services', 'fixed', 1500, 'Gumasta / Shop & Establishment Act registration and annual municipal renewal.', 'active'),
    ('s1000000-0000-0000-0000-000000000022', 'JMG-SRV-1022', 'c1000000-0000-0000-0000-000000000002', 'FSSAI Registration', 'CSC & Citizen Services', 'fixed', 3000, 'Food safety license and basic registration for food business operators.', 'active'),
    ('s1000000-0000-0000-0000-000000000023', 'JMG-SRV-1023', 'c1000000-0000-0000-0000-000000000002', 'Income Tax Filing', 'CSC & Citizen Services', 'fixed', 1500, 'Individual, salaried, and business ITR preparation, verification, and e-filing.', 'active'),
    ('s1000000-0000-0000-0000-000000000024', 'JMG-SRV-1024', 'c1000000-0000-0000-0000-000000000002', 'Digital Signature (DSC)', 'CSC & Citizen Services', 'fixed', 1800, 'Class-3 Digital Signature Certificate issuance with USB cryptographic token.', 'active'),
    ('s1000000-0000-0000-0000-000000000025', 'JMG-SRV-1025', 'c1000000-0000-0000-0000-000000000002', 'Udyam Registration', 'CSC & Citizen Services', 'fixed', 800, 'Official government MSME Udyam registration and certificate issuance.', 'active'),
    ('s1000000-0000-0000-0000-000000000026', 'JMG-SRV-1026', 'c1000000-0000-0000-0000-000000000002', 'Government Schemes', 'CSC & Citizen Services', 'fixed', 300, 'Applications for PM-Kisan, Ayushman Bharat, pension schemes, and state subsidies.', 'active'),
    ('s1000000-0000-0000-0000-000000000027', 'JMG-SRV-1027', 'c1000000-0000-0000-0000-000000000002', 'Banking & AEPS Services', 'CSC & Citizen Services', 'fixed', 100, 'Aadhaar-enabled payment system (AEPS) cash withdrawal, balance inquiry, and remittances.', 'active'),
    ('s1000000-0000-0000-0000-000000000028', 'JMG-SRV-1028', 'c1000000-0000-0000-0000-000000000002', 'Utility Bill Payments', 'CSC & Citizen Services', 'fixed', 50, 'Electricity, water, gas, broadband, and municipal property tax payments.', 'active'),
    ('s1000000-0000-0000-0000-000000000029', 'JMG-SRV-1029', 'c1000000-0000-0000-0000-000000000002', 'Aadhaar Services', 'CSC & Citizen Services', 'government_fee', 100, 'Aadhaar demographic update, biometric linking, and PVC card printing assistance.', 'active'),
    -- Business Documentation
    ('s1000000-0000-0000-0000-000000000030', 'JMG-SRV-1030', 'c1000000-0000-0000-0000-000000000002', 'FSSAI Certification Assistance', 'Business Registration', 'fixed', 3500, 'Standard food operator certificate documentation, food safety compliance.', 'active'),
    ('s1000000-0000-0000-0000-000000000031', 'JMG-SRV-1031', 'c1000000-0000-0000-0000-000000000002', 'Commercial Business Documentation', 'Business Registration', 'fixed', 2000, 'Partnership deeds, rental agreements, affidavits, and trade registration dossiers.', 'active'),
    -- Academy Services (Tagline: "Learn. Build. Grow.")
    ('s1000000-0000-0000-0000-000000000032', 'JMG-SRV-1032', 'c1000000-0000-0000-0000-000000000002', 'Computer Courses', 'Academy', 'fixed', 3500, 'Basic computer literacy, MS Office, typing, and digital operating fundamentals.', 'active'),
    ('s1000000-0000-0000-0000-000000000033', 'JMG-SRV-1033', 'c1000000-0000-0000-0000-000000000002', 'Tally Course', 'Academy', 'fixed', 6000, 'Comprehensive Tally Prime with GST accounting, inventory, and payroll training.', 'active'),
    ('s1000000-0000-0000-0000-000000000034', 'JMG-SRV-1034', 'c1000000-0000-0000-0000-000000000002', 'Basic IT Training', 'Academy', 'fixed', 4000, 'Computer hardware basics, internet fundamentals, cybersecurity, and office tools.', 'active'),
    ('s1000000-0000-0000-0000-000000000035', 'JMG-SRV-1035', 'c1000000-0000-0000-0000-000000000002', 'Digital Marketing Training', 'Academy', 'fixed', 8000, 'Hands-on practical training on social media ads, SEO, and content creation.', 'active'),
    ('s1000000-0000-0000-0000-000000000036', 'JMG-SRV-1036', 'c1000000-0000-0000-0000-000000000002', 'Web Development Course', 'Academy', 'fixed', 12000, 'HTML, CSS, JavaScript, and responsive web programming fundamentals.', 'active'),
    ('s1000000-0000-0000-0000-000000000037', 'JMG-SRV-1037', 'c1000000-0000-0000-0000-000000000002', 'Spoken English', 'Academy', 'fixed', 4500, 'English communication, conversation practice, and professional interview readiness.', 'active'),
    ('s1000000-0000-0000-0000-000000000038', 'JMG-SRV-1038', 'c1000000-0000-0000-0000-000000000002', 'Government Exam Preparation', 'Academy', 'fixed', 5000, 'Competitive exam prep coaching, practice mock tests, and syllabus guidance.', 'active'),

    -- -------------------------------------------------------------------------
    -- Company 3: Jay Murlidhar Insurance ('c1000000-0000-0000-0000-000000000003')
    -- Domain: Insurance
    -- -------------------------------------------------------------------------
    ('s1000000-0000-0000-0000-000000000039', 'JMG-SRV-1039', 'c1000000-0000-0000-0000-000000000003', 'Life Insurance', 'Insurance', 'quote_based', 0, 'Term insurance, endowment plans, ULIPs, and retirement pension plans.', 'active'),
    ('s1000000-0000-0000-0000-000000000040', 'JMG-SRV-1040', 'c1000000-0000-0000-0000-000000000003', 'Health Insurance', 'Insurance', 'quote_based', 0, 'Individual, family floater, critical illness, and corporate group mediclaim policies.', 'active'),
    ('s1000000-0000-0000-0000-000000000041', 'JMG-SRV-1041', 'c1000000-0000-0000-0000-000000000003', 'Motor Insurance', 'Insurance', 'quote_based', 0, 'Comprehensive motor coverage, third-party liability, and zero depreciation riders.', 'active'),
    ('s1000000-0000-0000-0000-000000000042', 'JMG-SRV-1042', 'c1000000-0000-0000-0000-000000000003', 'Bike Insurance', 'Insurance', 'quote_based', 0, 'Two-wheeler insurance with instant policy issuance and roadside assistance.', 'active'),
    ('s1000000-0000-0000-0000-000000000043', 'JMG-SRV-1043', 'c1000000-0000-0000-0000-000000000003', 'Car Insurance', 'Insurance', 'quote_based', 0, 'Private four-wheeler insurance with cashless garage networks and quick claims.', 'active'),
    ('s1000000-0000-0000-0000-000000000044', 'JMG-SRV-1044', 'c1000000-0000-0000-0000-000000000003', 'Commercial Vehicle Insurance', 'Insurance', 'quote_based', 0, 'Coverage for trucks, passenger buses, taxis, and fleet transport vehicles.', 'active'),
    ('s1000000-0000-0000-0000-000000000045', 'JMG-SRV-1045', 'c1000000-0000-0000-0000-000000000003', 'Business Insurance', 'Insurance', 'quote_based', 0, 'Business interruption, public liability, and commercial asset protection.', 'active'),
    ('s1000000-0000-0000-0000-000000000046', 'JMG-SRV-1046', 'c1000000-0000-0000-0000-000000000003', 'Corporate Insurance', 'Insurance', 'quote_based', 0, 'Directors & Officers (D&O) liability, group medical, and corporate indemnities.', 'active'),
    ('s1000000-0000-0000-0000-000000000047', 'JMG-SRV-1047', 'c1000000-0000-0000-0000-000000000003', 'Shop Insurance', 'Insurance', 'quote_based', 0, 'Protection for retail shops, showrooms, stock burglary, and fire hazards.', 'active'),
    ('s1000000-0000-0000-0000-000000000048', 'JMG-SRV-1048', 'c1000000-0000-0000-0000-000000000003', 'Factory Insurance', 'Insurance', 'quote_based', 0, 'Industrial plant, machinery breakdown, boiler explosion, and warehouse cover.', 'active'),
    ('s1000000-0000-0000-0000-000000000049', 'JMG-SRV-1049', 'c1000000-0000-0000-0000-000000000003', 'Marine Insurance', 'Insurance', 'quote_based', 0, 'Marine cargo transit insurance for domestic and international goods shipments.', 'active'),
    ('s1000000-0000-0000-0000-000000000050', 'JMG-SRV-1050', 'c1000000-0000-0000-0000-000000000003', 'Fire Insurance', 'Insurance', 'quote_based', 0, 'Standard fire and special perils insurance for commercial and residential premises.', 'active'),
    ('s1000000-0000-0000-0000-000000000051', 'JMG-SRV-1051', 'c1000000-0000-0000-0000-000000000003', 'Travel Insurance', 'Insurance', 'quote_based', 0, 'Domestic and overseas travel medical emergencies, baggage loss, and trip cancellation.', 'active'),
    ('s1000000-0000-0000-0000-000000000052', 'JMG-SRV-1052', 'c1000000-0000-0000-0000-000000000003', 'Crop Insurance', 'Insurance', 'quote_based', 0, 'Agricultural yield loss and weather-based crop risk protection for farmers.', 'active'),
    ('s1000000-0000-0000-0000-000000000053', 'JMG-SRV-1053', 'c1000000-0000-0000-0000-000000000003', 'Cyber Insurance', 'Insurance', 'quote_based', 0, 'Enterprise cybersecurity liability, data breach restitution, and ransomware risk cover.', 'active'),

    -- -------------------------------------------------------------------------
    -- Company 4: Jay Murlidhar Business Services ('c1000000-0000-0000-0000-000000000004')
    -- Domain: Business Services
    -- -------------------------------------------------------------------------
    ('s1000000-0000-0000-0000-000000000054', 'JMG-SRV-1054', 'c1000000-0000-0000-0000-000000000004', 'Business Registration & Licensing Assistance', 'Business Compliance', 'fixed', 5000, 'End-to-end guidance through commercial registrations, trade licenses, and permits.', 'active'),
    ('s1000000-0000-0000-0000-000000000055', 'JMG-SRV-1055', 'c1000000-0000-0000-0000-000000000004', 'Regulatory Compliance & Filings', 'Business Compliance', 'recurring_monthly', 3500, 'Periodic statutory filing coordination, tax documentation, and corporate compliance.', 'active'),
    ('s1000000-0000-0000-0000-000000000056', 'JMG-SRV-1056', 'c1000000-0000-0000-0000-000000000004', 'Administrative Workflow Digitization', 'Business Compliance', 'quote_based', 15000, 'Transitioning manual paper documentation into structured digital document vaults.', 'active'),
    ('s1000000-0000-0000-0000-000000000057', 'JMG-SRV-1057', 'c1000000-0000-0000-0000-000000000004', 'Corporate Secretarial Support', 'Business Compliance', 'hourly', 2000, 'Meeting minutes recording, resolution drafting, and compliance verification support.', 'active'),
    ('s1000000-0000-0000-0000-000000000058', 'JMG-SRV-1058', 'c1000000-0000-0000-0000-000000000004', 'Contract & Legal Documentation Coordination', 'Business Compliance', 'fixed', 4000, 'Drafting commercial non-disclosure agreements, SLAs, and partnership contracts.', 'active'),
    ('s1000000-0000-0000-0000-000000000059', 'JMG-SRV-1059', 'c1000000-0000-0000-0000-000000000004', 'Institutional Audit Preparation', 'Business Compliance', 'quote_based', 20000, 'Preparing documentary records and compliance binders ahead of statutory audits.', 'active'),

    -- -------------------------------------------------------------------------
    -- Company 5: Jay Murlidhar Tours ('c1000000-0000-0000-0000-000000000005')
    -- Domain: Travel
    -- -------------------------------------------------------------------------
    ('s1000000-0000-0000-0000-000000000060', 'JMG-SRV-1060', 'c1000000-0000-0000-0000-000000000005', 'Student Industrial Visits & Field Tours', 'Travel & Tours', 'quote_based', 0, 'Curated technical visits to industrial manufacturing plants and scientific institutes.', 'active'),
    ('s1000000-0000-0000-0000-000000000061', 'JMG-SRV-1061', 'c1000000-0000-0000-0000-000000000005', 'Corporate Travel Management & Offsites', 'Travel & Tours', 'quote_based', 0, 'End-to-end coordination for company annual summits, team-building retreats, and conferences.', 'active'),
    ('s1000000-0000-0000-0000-000000000062', 'JMG-SRV-1062', 'c1000000-0000-0000-0000-000000000005', 'Domestic Cultural & Heritage Circuits', 'Travel & Tours', 'quote_based', 0, 'Guided historical, spiritual, and discovery expeditions across India’s cultural destinations.', 'active'),
    ('s1000000-0000-0000-0000-000000000063', 'JMG-SRV-1063', 'c1000000-0000-0000-0000-000000000005', 'Group Air & Rail Ticketing Coordination', 'Travel & Tours', 'fixed', 500, 'Seamless group seat reservations, bulk fare negotiations, and itinerary assistance.', 'active'),
    ('s1000000-0000-0000-0000-000000000064', 'JMG-SRV-1064', 'c1000000-0000-0000-0000-000000000005', 'Verified Hospitality & Luxury Fleet Logistics', 'Travel & Tours', 'quote_based', 0, 'Handpicked verified hotels, sanitized AC coach fleets, and catering coordination.', 'active'),
    ('s1000000-0000-0000-0000-000000000065', 'JMG-SRV-1065', 'c1000000-0000-0000-0000-000000000005', '24/7 On-Tour Safety & Medical Escort', 'Travel & Tours', 'hourly', 1500, 'Dedicated tour managers accompanying groups with medical first-response coordination.', 'active'),

    -- -------------------------------------------------------------------------
    -- Company 6: Jay Murlidhar Mobile & Accessories ('c1000000-0000-0000-0000-000000000006')
    -- Domain: Retail
    -- -------------------------------------------------------------------------
    ('s1000000-0000-0000-0000-000000000066', 'JMG-SRV-1066', 'c1000000-0000-0000-0000-000000000006', 'Smartphones & Tablet Retail', 'Retail & Hardware', 'fixed', 0, 'Authorized distribution of leading smartphone brands and tablets for academic and personal productivity.', 'active'),
    ('s1000000-0000-0000-0000-000000000067', 'JMG-SRV-1067', 'c1000000-0000-0000-0000-000000000006', 'Institutional Student Device Provisioning', 'Retail & Hardware', 'quote_based', 0, 'Bulk procurement of pre-configured tablets and portable laptops for digital classrooms.', 'active'),
    ('s1000000-0000-0000-0000-000000000068', 'JMG-SRV-1068', 'c1000000-0000-0000-0000-000000000006', 'Certified Mobility Accessories', 'Retail & Hardware', 'fixed', 499, 'High-speed fast chargers, braided cables, tempered protection, and ergonomic cases.', 'active'),
    ('s1000000-0000-0000-0000-000000000069', 'JMG-SRV-1069', 'c1000000-0000-0000-0000-000000000006', 'Quick Hardware Screen & Battery Service', 'Retail & Hardware', 'fixed', 1200, 'Precision on-site display repairs, certified battery replacements, and diagnostic resets.', 'active')
ON CONFLICT (service_code) DO UPDATE
SET service_name = EXCLUDED.service_name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    billing_type = EXCLUDED.billing_type,
    base_price = EXCLUDED.base_price,
    status = EXCLUDED.status;

-- Fast-forward service code sequence past the highest seeded service code (1069)
SELECT setval('public.service_code_seq', 1070, false);
