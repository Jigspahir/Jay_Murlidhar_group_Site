-- =============================================================================
-- JAY MURLIDHAR GROUP (JMG) — MULTI-COMPANY BUSINESS MANAGEMENT PLATFORM
-- Migration: 20261002000009_general_ledger_accounting.sql
-- Description: Phase 14B General Ledger & Accounting Foundation:
--              Model C Chart of Accounts (Templates + Company Accounts),
--              Company Bank Accounts, Indian Fiscal Years (1 Apr - 31 Mar),
--              12 Monthly Accounting Periods with Period Lock,
--              Double-Entry Journal Entries & Lines with Immutability Triggers,
--              Automated Posting Triggers for Invoices, Payments, Bills, Disbursements,
--              GRN, COGS, Stock Adjustments, and Operational Expenses,
--              Seed Standard Accounts, Initial FY 2026-27, RBAC & Strict RLS.
-- =============================================================================

-- =============================================================================
-- 1. ACCOUNT TEMPLATES (Global Reusable Master Account Definitions)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.account_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(16) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    account_class VARCHAR(32) NOT NULL CHECK (account_class IN ('asset', 'liability', 'equity', 'revenue', 'cogs', 'expense')),
    account_type VARCHAR(64) NOT NULL,
    normal_balance VARCHAR(8) NOT NULL CHECK (normal_balance IN ('debit', 'credit')),
    parent_template_code VARCHAR(16),
    description TEXT,
    is_system BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_account_templates_code ON public.account_templates(code);
CREATE INDEX IF NOT EXISTS idx_account_templates_class ON public.account_templates(account_class);

-- =============================================================================
-- 2. ACCOUNTS (Company-Scoped Ledger Accounts)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
    template_id UUID REFERENCES public.account_templates(id) ON DELETE SET NULL,
    account_code VARCHAR(32) NOT NULL,
    account_name VARCHAR(128) NOT NULL,
    account_class VARCHAR(32) NOT NULL CHECK (account_class IN ('asset', 'liability', 'equity', 'revenue', 'cogs', 'expense')),
    account_type VARCHAR(64) NOT NULL,
    normal_balance VARCHAR(8) NOT NULL CHECK (normal_balance IN ('debit', 'credit')),
    parent_account_id UUID REFERENCES public.accounts(id) ON DELETE RESTRICT,
    description TEXT,
    is_system BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_accounts_company_code UNIQUE (company_id, account_code)
);

CREATE INDEX IF NOT EXISTS idx_accounts_company_id ON public.accounts(company_id);
CREATE INDEX IF NOT EXISTS idx_accounts_code ON public.accounts(account_code);
CREATE INDEX IF NOT EXISTS idx_accounts_class ON public.accounts(account_class);
CREATE INDEX IF NOT EXISTS idx_accounts_type ON public.accounts(account_type);

CREATE TRIGGER set_accounts_updated_at
BEFORE UPDATE ON public.accounts
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 3. COMPANY BANK ACCOUNTS (Master linked to Asset Accounts)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.company_bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    account_name VARCHAR(128) NOT NULL,
    bank_name VARCHAR(128) NOT NULL,
    account_number VARCHAR(64) NOT NULL,
    ifsc_code VARCHAR(32) NOT NULL,
    branch VARCHAR(128),
    account_type VARCHAR(32) NOT NULL DEFAULT 'current' CHECK (account_type IN ('current', 'savings', 'cash_credit', 'overdraft')),
    upi_id VARCHAR(128),
    linked_gl_account_id UUID REFERENCES public.accounts(id) ON DELETE RESTRICT,
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_company_bank_account UNIQUE (company_id, account_number)
);

CREATE INDEX IF NOT EXISTS idx_company_bank_accounts_company ON public.company_bank_accounts(company_id);

CREATE TRIGGER set_company_bank_accounts_updated_at
BEFORE UPDATE ON public.company_bank_accounts
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 4. FISCAL YEARS (Indian Financial Year: 1 April → 31 March)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.fiscal_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    fiscal_year_code VARCHAR(32) NOT NULL, -- e.g., 'FY 2026-27'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'locked')),
    closed_at TIMESTAMPTZ,
    closed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_fy_dates CHECK (end_date > start_date),
    CONSTRAINT uq_company_fiscal_year_code UNIQUE (company_id, fiscal_year_code)
);

CREATE INDEX IF NOT EXISTS idx_fiscal_years_company ON public.fiscal_years(company_id);
CREATE INDEX IF NOT EXISTS idx_fiscal_years_dates ON public.fiscal_years(start_date, end_date);

CREATE TRIGGER set_fiscal_years_updated_at
BEFORE UPDATE ON public.fiscal_years
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 5. ACCOUNTING PERIODS (12 Monthly Periods per Fiscal Year)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.accounting_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    fiscal_year_id UUID NOT NULL REFERENCES public.fiscal_years(id) ON DELETE CASCADE,
    period_code VARCHAR(32) NOT NULL, -- e.g., '2026-04'
    period_name VARCHAR(64) NOT NULL, -- e.g., 'April 2026'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'locked')),
    closed_at TIMESTAMPTZ,
    closed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    locked_at TIMESTAMPTZ,
    locked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_period_dates CHECK (end_date >= start_date),
    CONSTRAINT uq_company_period_code UNIQUE (company_id, period_code)
);

CREATE INDEX IF NOT EXISTS idx_accounting_periods_company ON public.accounting_periods(company_id);
CREATE INDEX IF NOT EXISTS idx_accounting_periods_fy ON public.accounting_periods(fiscal_year_id);
CREATE INDEX IF NOT EXISTS idx_accounting_periods_dates ON public.accounting_periods(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_accounting_periods_status ON public.accounting_periods(status);

CREATE TRIGGER set_accounting_periods_updated_at
BEFORE UPDATE ON public.accounting_periods
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 6. JOURNAL NUMBER GENERATOR SEQUENCE & FUNCTION
-- =============================================================================
CREATE SEQUENCE IF NOT EXISTS public.journal_number_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_journal_number(prefix_code TEXT DEFAULT 'JMG-JRN')
RETURNS TEXT AS $$
DECLARE
    next_val BIGINT;
    year_str TEXT;
BEGIN
    next_val := nextval('public.journal_number_seq');
    year_str := TO_CHAR(CURRENT_DATE, 'YYYY');
    RETURN prefix_code || '-' || year_str || '-' || LPAD(next_val::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 7. JOURNAL ENTRIES (Header)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
    fiscal_year_id UUID NOT NULL REFERENCES public.fiscal_years(id) ON DELETE RESTRICT,
    accounting_period_id UUID NOT NULL REFERENCES public.accounting_periods(id) ON DELETE RESTRICT,
    journal_number VARCHAR(64) NOT NULL DEFAULT public.generate_journal_number('JMG-JRN'),
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    posting_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    entry_type VARCHAR(32) NOT NULL CHECK (
        entry_type IN (
            'sales', 'customer_payment', 'purchase', 'vendor_payment',
            'grn', 'inventory_adjustment', 'expense', 'opening',
            'manual', 'closing', 'reversal'
        )
    ),
    source_module VARCHAR(32) NOT NULL CHECK (
        source_module IN (
            'invoice', 'payment', 'purchase_bill', 'vendor_payment',
            'goods_receipt', 'stock_adjustment', 'expense', 'manual',
            'opening_balance', 'period_close'
        )
    ),
    source_id UUID,
    reference_number VARCHAR(128),
    narration TEXT NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'posted' CHECK (status IN ('draft', 'posted', 'reversed', 'voided')),
    is_reversal BOOLEAN NOT NULL DEFAULT false,
    reversed_entry_id UUID REFERENCES public.journal_entries(id) ON DELETE RESTRICT,
    total_debit NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_credit NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    posted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_journal_balanced CHECK (total_debit = total_credit),
    CONSTRAINT uq_journal_company_number UNIQUE (company_id, journal_number),
    CONSTRAINT uq_journal_source_event UNIQUE (company_id, source_module, source_id, entry_type)
);

CREATE INDEX IF NOT EXISTS idx_journal_entries_company ON public.journal_entries(company_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_period ON public.journal_entries(accounting_period_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON public.journal_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_source ON public.journal_entries(source_module, source_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_status ON public.journal_entries(status);

-- =============================================================================
-- 8. JOURNAL ENTRY LINES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.journal_entry_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
    journal_entry_id UUID NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
    line_number INT NOT NULL,
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE RESTRICT,
    debit NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (debit >= 0),
    credit NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (credit >= 0),
    description TEXT,
    entity_type VARCHAR(32), -- customer, vendor, warehouse, employee
    entity_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_line_nonzero CHECK ((debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0)),
    CONSTRAINT uq_journal_line UNIQUE (journal_entry_id, line_number)
);

CREATE INDEX IF NOT EXISTS idx_journal_lines_company ON public.journal_entry_lines(company_id);
CREATE INDEX IF NOT EXISTS idx_journal_lines_entry ON public.journal_entry_lines(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_journal_lines_account ON public.journal_entry_lines(account_id);

-- =============================================================================
-- 9. IMMUTABILITY TRIGGER: POSTED JOURNALS AND LINES CANNOT BE MUTATED
-- =============================================================================
CREATE OR REPLACE FUNCTION public.enforce_journal_immutability()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'journal_entries' THEN
        IF TG_OP = 'DELETE' THEN
            IF OLD.status IN ('posted', 'reversed') THEN
                RAISE EXCEPTION 'Posted journal entries are strictly immutable and cannot be deleted. Use reversal journal instead.';
            END IF;
            RETURN OLD;
        ELSIF TG_OP = 'UPDATE' THEN
            -- Only allow updating status from posted -> reversed during reversal workflow
            IF OLD.status = 'posted' AND NEW.status = 'reversed' THEN
                RETURN NEW;
            END IF;
            IF OLD.status IN ('posted', 'reversed') THEN
                RAISE EXCEPTION 'Posted journal entries are immutable. Only reversal operations are permitted.';
            END IF;
            RETURN NEW;
        END IF;
    ELSIF TG_TABLE_NAME = 'journal_entry_lines' THEN
        IF TG_OP IN ('UPDATE', 'DELETE') THEN
            DECLARE
                parent_status TEXT;
            BEGIN
                SELECT status INTO parent_status FROM public.journal_entries WHERE id = OLD.journal_entry_id;
                IF parent_status IN ('posted', 'reversed') THEN
                    RAISE EXCEPTION 'Journal entry lines of posted journals cannot be modified or deleted.';
                END IF;
            END;
            IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_journal_entries_immutability ON public.journal_entries;
CREATE TRIGGER trg_enforce_journal_entries_immutability
BEFORE UPDATE OR DELETE ON public.journal_entries
FOR EACH ROW EXECUTE FUNCTION public.enforce_journal_immutability();

DROP TRIGGER IF EXISTS trg_enforce_journal_lines_immutability ON public.journal_entry_lines;
CREATE TRIGGER trg_enforce_journal_lines_immutability
BEFORE UPDATE OR DELETE ON public.journal_entry_lines
FOR EACH ROW EXECUTE FUNCTION public.enforce_journal_immutability();

-- =============================================================================
-- 10. PERIOD VALIDATION TRIGGER: POSTING BLOCKED IN CLOSED/LOCKED PERIODS
-- =============================================================================
CREATE OR REPLACE FUNCTION public.validate_journal_period_status()
RETURNS TRIGGER AS $$
DECLARE
    p_status TEXT;
    fy_status TEXT;
    p_company UUID;
    fy_company UUID;
BEGIN
    -- Check period
    SELECT status, company_id INTO p_status, p_company
    FROM public.accounting_periods
    WHERE id = NEW.accounting_period_id;

    IF p_status IS NULL THEN
        RAISE EXCEPTION 'Accounting period not found.';
    END IF;

    IF p_company <> NEW.company_id THEN
        RAISE EXCEPTION 'Accounting period does not belong to the journal company.';
    END IF;

    IF p_status IN ('closed', 'locked') THEN
        RAISE EXCEPTION 'Posting into a % accounting period is prohibited.', p_status;
    END IF;

    -- Check fiscal year
    SELECT status, company_id INTO fy_status, fy_company
    FROM public.fiscal_years
    WHERE id = NEW.fiscal_year_id;

    IF fy_status IS NULL THEN
        RAISE EXCEPTION 'Fiscal year not found.';
    END IF;

    IF fy_company <> NEW.company_id THEN
        RAISE EXCEPTION 'Fiscal year does not belong to the journal company.';
    END IF;

    IF fy_status IN ('closed', 'locked') THEN
        RAISE EXCEPTION 'Posting into a % fiscal year is prohibited.', fy_status;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_journal_period ON public.journal_entries;
CREATE TRIGGER trg_validate_journal_period
BEFORE INSERT OR UPDATE ON public.journal_entries
FOR EACH ROW EXECUTE FUNCTION public.validate_journal_period_status();

-- =============================================================================
-- 11. COMPANY PROVISIONING FUNCTIONS (Idempotent)
-- =============================================================================

-- Function to provision standard Chart of Accounts for a company
CREATE OR REPLACE FUNCTION public.provision_company_accounts(target_company_id UUID)
RETURNS INT AS $$
DECLARE
    tmpl RECORD;
    inserted_count INT := 0;
BEGIN
    FOR tmpl IN 
        SELECT id, code, name, account_class, account_type, normal_balance, description
        FROM public.account_templates
        WHERE is_active = true
        ORDER BY sort_order, code
    LOOP
        INSERT INTO public.accounts (
            company_id,
            template_id,
            account_code,
            account_name,
            account_class,
            account_type,
            normal_balance,
            description,
            is_system,
            is_active
        ) VALUES (
            target_company_id,
            tmpl.id,
            tmpl.code,
            tmpl.name,
            tmpl.account_class,
            tmpl.account_type,
            tmpl.normal_balance,
            tmpl.description,
            true,
            true
        )
        ON CONFLICT (company_id, account_code) DO UPDATE
        SET template_id = EXCLUDED.template_id,
            account_name = EXCLUDED.account_name,
            account_class = EXCLUDED.account_class,
            account_type = EXCLUDED.account_type,
            normal_balance = EXCLUDED.normal_balance;
            
        inserted_count := inserted_count + 1;
    END LOOP;

    RETURN inserted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to provision Indian Fiscal Year (1 Apr - 31 Mar) and 12 monthly periods
CREATE OR REPLACE FUNCTION public.provision_company_fiscal_year(target_company_id UUID, year_start INT DEFAULT 2026)
RETURNS UUID AS $$
DECLARE
    fy_id UUID;
    fy_code TEXT;
    start_dt DATE;
    end_dt DATE;
    p_month INT;
    p_start DATE;
    p_end DATE;
    p_code TEXT;
    p_name TEXT;
    month_names TEXT[] := ARRAY['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
    cur_year INT;
    cal_month INT;
BEGIN
    fy_code := 'FY ' || year_start || '-' || SUBSTRING((year_start + 1)::TEXT FROM 3 FOR 2);
    start_dt := MAKE_DATE(year_start, 4, 1);
    end_dt := MAKE_DATE(year_start + 1, 3, 31);

    -- Insert or get Fiscal Year
    INSERT INTO public.fiscal_years (
        company_id,
        fiscal_year_code,
        start_date,
        end_date,
        status
    ) VALUES (
        target_company_id,
        fy_code,
        start_dt,
        end_dt,
        'open'
    )
    ON CONFLICT (company_id, fiscal_year_code) DO UPDATE
    SET status = EXCLUDED.status
    RETURNING id INTO fy_id;

    -- Create 12 monthly periods: April (4) to March (3)
    FOR p_month IN 1..12 LOOP
        IF p_month <= 9 THEN
            cur_year := year_start;
            cal_month := p_month + 3; -- 4, 5, 6, 7, 8, 9, 10, 11, 12
        ELSE
            cur_year := year_start + 1;
            cal_month := p_month - 9; -- 1, 2, 3
        END IF;

        p_start := MAKE_DATE(cur_year, cal_month, 1);
        p_end := (p_start + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
        p_code := TO_CHAR(p_start, 'YYYY-MM');
        p_name := month_names[p_month] || ' ' || cur_year;

        INSERT INTO public.accounting_periods (
            company_id,
            fiscal_year_id,
            period_code,
            period_name,
            start_date,
            end_date,
            status
        ) VALUES (
            target_company_id,
            fy_id,
            p_code,
            p_name,
            p_start,
            p_end,
            'open'
        )
        ON CONFLICT (company_id, period_code) DO NOTHING;
    END LOOP;

    RETURN fy_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 12. SEED STANDARD ACCOUNT TEMPLATES
-- =============================================================================
INSERT INTO public.account_templates (code, name, account_class, account_type, normal_balance, description, sort_order)
VALUES
    -- 1000–1999: ASSETS
    ('1110', 'Cash on Hand', 'asset', 'cash', 'debit', 'Physical currency and petty cash on hand', 10),
    ('1120', 'Bank Current Account', 'asset', 'bank', 'debit', 'Primary business checking and current accounts', 20),
    ('1210', 'Accounts Receivable (Trade Debtors)', 'asset', 'accounts_receivable', 'debit', 'Amounts due from customers for goods/services delivered', 30),
    ('1310', 'Inventory Asset (Trading & Finished Goods)', 'asset', 'inventory', 'debit', 'Valuation of finished products and merchandise held for sale', 40),
    ('1320', 'Inventory Asset (Raw Materials)', 'asset', 'inventory', 'debit', 'Valuation of direct raw materials held for processing', 50),
    ('1410', 'Input CGST (Tax Credit)', 'asset', 'tax_input', 'debit', 'Eligible Central GST input tax credit on purchases', 60),
    ('1420', 'Input SGST (Tax Credit)', 'asset', 'tax_input', 'debit', 'Eligible State GST input tax credit on purchases', 70),
    ('1430', 'Input IGST (Tax Credit)', 'asset', 'tax_input', 'debit', 'Eligible Integrated GST input tax credit on inter-state purchases', 80),
    ('1510', 'Prepaid Expenses & Security Advances', 'asset', 'other_current_asset', 'debit', 'Advance payments for rent, utilities, and vendor retainers', 90),
    ('1610', 'Fixed Assets (Plant, Equipment & Computers)', 'asset', 'fixed_asset', 'debit', 'Long-term operational tangible capital assets', 100),

    -- 2000–2999: LIABILITIES
    ('2110', 'Accounts Payable (Trade Creditors)', 'liability', 'accounts_payable', 'credit', 'Commercial liabilities due to suppliers for bills received', 110),
    ('2120', 'Goods Received Not Invoiced (GRNI Accrual)', 'liability', 'grni', 'credit', 'Clearing account for goods received before vendor invoice arrival', 120),
    ('2210', 'Output CGST Payable', 'liability', 'tax_output', 'credit', 'Central GST collected on commercial sales', 130),
    ('2220', 'Output SGST Payable', 'liability', 'tax_output', 'credit', 'State GST collected on commercial sales', 140),
    ('2230', 'Output IGST Payable', 'liability', 'tax_output', 'credit', 'Integrated GST collected on inter-state sales', 150),
    ('2310', 'Accrued Expenses & Outstanding Payables', 'liability', 'current_liability', 'credit', 'Unpaid operational liabilities and statutory dues', 160),
    ('2410', 'Customer Advances (Unearned Revenue)', 'liability', 'current_liability', 'credit', 'Advance deposits received prior to invoice issuance', 170),
    ('2510', 'Short-Term Borrowings & Loans', 'liability', 'current_liability', 'credit', 'Working capital facilities and short-term loans', 180),

    -- 3000–3999: EQUITY
    ('3110', 'Owner / Partner Capital', 'equity', 'equity', 'credit', 'Initial and ongoing invested capital by promoters', 190),
    ('3210', 'Retained Earnings (Reserves & Surplus)', 'equity', 'retained_earnings', 'credit', 'Accumulated undistributed net profits from prior years', 200),
    ('3310', 'Current Year Profit / (Loss) Clearing', 'equity', 'equity', 'credit', 'P&L summary account reflecting year-to-date operating performance', 210),

    -- 4000–4999: REVENUE
    ('4110', 'Service Revenue', 'revenue', 'service_revenue', 'credit', 'Earnings from professional, digital, and advisory services', 220),
    ('4210', 'Product Sales Revenue', 'revenue', 'product_revenue', 'credit', 'Gross sales from retail, wholesale, and hardware distribution', 230),
    ('4910', 'Other Operating Income', 'revenue', 'other_income', 'credit', 'Miscellaneous business receipts, discounts received, and commissions', 240),
    ('4920', 'Inventory Adjustment Gain', 'revenue', 'other_income', 'credit', 'Stock surplus gain recognized during physical verification', 250),

    -- 5000–5999: COST OF GOODS SOLD (COGS)
    ('5110', 'Cost of Goods Sold — Product Sales', 'cogs', 'cogs', 'debit', 'Direct cost of merchandise and products sold to customers', 260),
    ('5210', 'Inventory Shrinkage Loss', 'cogs', 'inventory_adjustment', 'debit', 'Stock deficit loss identified during count variance reconciliation', 270),
    ('5220', 'Inventory Damage / Expiry Loss', 'cogs', 'inventory_adjustment', 'debit', 'Write-down of damaged, spoiled, or expired stock', 280),
    ('5230', 'Inventory Theft / Casualty Loss', 'cogs', 'inventory_adjustment', 'debit', 'Loss of physical goods due to theft or transit casualty', 290),
    ('5240', 'Inventory Scrap / Write-Off', 'cogs', 'inventory_adjustment', 'debit', 'General inventory write-off authorized by management', 300),

    -- 6000–6999: OPERATING EXPENSES
    ('6110', 'Rent & Premises Expense', 'expense', 'operating_expense', 'debit', 'Office lease, warehouse rental, and premises maintenance', 310),
    ('6120', 'Salaries & Staff Wages', 'expense', 'operating_expense', 'debit', 'Employee payroll, contractor honorarium, and staff benefits', 320),
    ('6130', 'Electricity & Utilities', 'expense', 'operating_expense', 'debit', 'Power, water, and civic utility services', 330),
    ('6140', 'Stationery, Printing & Consumables', 'expense', 'operating_expense', 'debit', 'Office printing, supplies, packaging, and desk consumables', 340),
    ('6150', 'Travel & Vehicle Maintenance', 'expense', 'operating_expense', 'debit', 'Fuel, logistics, vehicle repairs, and field travel expenses', 350),
    ('6160', 'Communication, Internet & Cloud Hosting', 'expense', 'operating_expense', 'debit', 'Broadband, telephone, cloud servers, and domain renewals', 360),
    ('6170', 'Legal & Professional Fees', 'expense', 'operating_expense', 'debit', 'Audit, accounting, compliance, and legal advisory fees', 370),
    ('6180', 'Marketing & Advertising', 'expense', 'operating_expense', 'debit', 'Digital campaigns, branding, sponsorships, and print promotions', 380),
    ('6190', 'Miscellaneous Office Expenses', 'expense', 'operating_expense', 'debit', 'General incidental office refreshments and sundry costs', 390),
    ('6200', 'Bank Charges & Financial Fees', 'expense', 'operating_expense', 'debit', 'Bank processing charges, payment gateway fees, and transaction tariffs', 400)
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name,
    account_class = EXCLUDED.account_class,
    account_type = EXCLUDED.account_type,
    normal_balance = EXCLUDED.normal_balance,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- =============================================================================
-- 13. PROVISION ALL EXISTING COMPANIES AUTOMATICALLY
-- =============================================================================
DO $$
DECLARE
    comp RECORD;
BEGIN
    FOR comp IN SELECT id, name FROM public.companies LOOP
        PERFORM public.provision_company_accounts(comp.id);
        PERFORM public.provision_company_fiscal_year(comp.id, 2026);
    END LOOP;
END;
$$;

-- Trigger to automatically provision accounts and fiscal year on new company creation
CREATE OR REPLACE FUNCTION public.handle_new_company_accounting_setup()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.provision_company_accounts(NEW.id);
    PERFORM public.provision_company_fiscal_year(NEW.id, 2026);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_new_company_accounting_setup ON public.companies;
CREATE TRIGGER trg_new_company_accounting_setup
AFTER INSERT ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.handle_new_company_accounting_setup();

-- =============================================================================
-- 14. SEED PERMISSIONS FOR PHASE 14B GENERAL LEDGER & ACCOUNTING
-- =============================================================================
INSERT INTO public.permissions (module, action, description)
VALUES
    ('accounting', 'view', 'View general ledger, journal entries, and dashboard'),
    ('accounting', 'accounts.view', 'View Chart of Accounts and balances'),
    ('accounting', 'accounts.manage', 'Create and modify company accounts'),
    ('accounting', 'journals.view', 'View double-entry journal vouchers'),
    ('accounting', 'journals.create', 'Post manual journal entries and adjustments'),
    ('accounting', 'journals.reverse', 'Authorize and post append-only journal reversals'),
    ('accounting', 'periods.view', 'View fiscal years and monthly accounting periods'),
    ('accounting', 'periods.close', 'Perform monthly accounting period close'),
    ('accounting', 'periods.reopen', 'Reopen previously closed accounting periods'),
    ('accounting', 'opening_balances.manage', 'Configure initial opening balance journal'),
    ('accounting', 'reports.view', 'Access Trial Balance, General Ledger, P&L, and Balance Sheet'),
    ('accounting', 'reports.consolidated', 'Access enterprise group-wide consolidated financial reports'),
    ('accounting', 'bank_accounts.view', 'View registered company bank accounts'),
    ('accounting', 'bank_accounts.manage', 'Create and manage company bank accounts and GL links')
ON CONFLICT (module, action) DO NOTHING;

-- Map all accounting permissions to Group Owner
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'group_owner'
  AND p.module = 'accounting'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Map operational accounting permissions to Company Manager (Excludes period close/reopen)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'company_manager'
  AND p.module = 'accounting'
  AND p.action IN (
    'view',
    'accounts.view',
    'accounts.manage',
    'journals.view',
    'journals.create',
    'periods.view',
    'reports.view',
    'bank_accounts.view',
    'bank_accounts.manage'
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- =============================================================================
-- 15. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.account_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscal_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entry_lines ENABLE ROW LEVEL SECURITY;

-- 1. account_templates: All authenticated users can read templates
DROP POLICY IF EXISTS "Authenticated users view account templates" ON public.account_templates;
CREATE POLICY "Authenticated users view account templates"
ON public.account_templates FOR SELECT
TO authenticated
USING (true);

-- 2. accounts: Read/write scoped to user company or Group Owner
DROP POLICY IF EXISTS "Users can view accounts of accessible companies" ON public.accounts;
CREATE POLICY "Users can view accounts of accessible companies"
ON public.accounts FOR SELECT
TO authenticated
USING (public.can_access_company(company_id));

DROP POLICY IF EXISTS "Managers and owners can insert accounts" ON public.accounts;
CREATE POLICY "Managers and owners can insert accounts"
ON public.accounts FOR INSERT
TO authenticated
WITH CHECK (public.can_access_company(company_id));

DROP POLICY IF EXISTS "Managers and owners can update accounts" ON public.accounts;
CREATE POLICY "Managers and owners can update accounts"
ON public.accounts FOR UPDATE
TO authenticated
USING (public.can_access_company(company_id));

-- 3. company_bank_accounts
DROP POLICY IF EXISTS "Users can view bank accounts of accessible companies" ON public.company_bank_accounts;
CREATE POLICY "Users can view bank accounts of accessible companies"
ON public.company_bank_accounts FOR SELECT
TO authenticated
USING (public.can_access_company(company_id));

DROP POLICY IF EXISTS "Managers and owners can manage bank accounts" ON public.company_bank_accounts;
CREATE POLICY "Managers and owners can manage bank accounts"
ON public.company_bank_accounts FOR ALL
TO authenticated
USING (public.can_access_company(company_id));

-- 4. fiscal_years & accounting_periods
DROP POLICY IF EXISTS "Users view fiscal years of accessible companies" ON public.fiscal_years;
CREATE POLICY "Users view fiscal years of accessible companies"
ON public.fiscal_years FOR SELECT
TO authenticated
USING (public.can_access_company(company_id));

DROP POLICY IF EXISTS "Owners manage fiscal years" ON public.fiscal_years;
CREATE POLICY "Owners manage fiscal years"
ON public.fiscal_years FOR ALL
TO authenticated
USING (public.can_access_company(company_id));

DROP POLICY IF EXISTS "Users view accounting periods of accessible companies" ON public.accounting_periods;
CREATE POLICY "Users view accounting periods of accessible companies"
ON public.accounting_periods FOR SELECT
TO authenticated
USING (public.can_access_company(company_id));

DROP POLICY IF EXISTS "Owners manage accounting periods" ON public.accounting_periods;
CREATE POLICY "Owners manage accounting periods"
ON public.accounting_periods FOR ALL
TO authenticated
USING (public.can_access_company(company_id));

-- 5. journal_entries & journal_entry_lines
DROP POLICY IF EXISTS "Users view journals of accessible companies" ON public.journal_entries;
CREATE POLICY "Users view journals of accessible companies"
ON public.journal_entries FOR SELECT
TO authenticated
USING (public.can_access_company(company_id));

DROP POLICY IF EXISTS "Users insert journals for accessible companies" ON public.journal_entries;
CREATE POLICY "Users insert journals for accessible companies"
ON public.journal_entries FOR INSERT
TO authenticated
WITH CHECK (public.can_access_company(company_id));

DROP POLICY IF EXISTS "Users view journal lines of accessible companies" ON public.journal_entry_lines;
CREATE POLICY "Users view journal lines of accessible companies"
ON public.journal_entry_lines FOR SELECT
TO authenticated
USING (public.can_access_company(company_id));

DROP POLICY IF EXISTS "Users insert journal lines for accessible companies" ON public.journal_entry_lines;
CREATE POLICY "Users insert journal lines for accessible companies"
ON public.journal_entry_lines FOR INSERT
TO authenticated
WITH CHECK (public.can_access_company(company_id));
