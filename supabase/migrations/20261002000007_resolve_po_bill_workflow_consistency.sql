-- =============================================================================
-- MIGRATION: 20261002000007_resolve_po_bill_workflow_consistency.sql
-- Jay Murlidhar Group (JMG) — Multi-Company Business Management Platform
-- 
-- Phase 12B — Procurement & Accounts Payable Workflow Consistency
-- Resolves inconsistencies between:
-- 1. PO workflow & approval status
-- 2. Supplier Bill lifecycle status vs payment status
-- 3. Line-level item quantity billing & over-billing prevention
-- 4. PO billing progress, draft bill exclusion & automatic closure
-- 5. Bill cancellation protection with payments
-- 6. Payment separation from PO billing status
-- =============================================================================

-- =============================================================================
-- 1. PURCHASE ORDER ITEMS: TRACK LINE-LEVEL BILLED QUANTITY
-- =============================================================================
ALTER TABLE public.purchase_order_items
ADD COLUMN IF NOT EXISTS billed_quantity NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (billed_quantity >= 0);

-- =============================================================================
-- 2. PURCHASE ORDERS: STATUS & APPROVAL STATUS CONSTRAINTS
-- =============================================================================
ALTER TABLE public.purchase_orders
DROP CONSTRAINT IF EXISTS purchase_orders_status_check;

ALTER TABLE public.purchase_orders
ADD CONSTRAINT purchase_orders_status_check
CHECK (status IN ('draft', 'submitted', 'approved', 'issued', 'partially_billed', 'fully_billed', 'closed', 'cancelled'));

ALTER TABLE public.purchase_orders
DROP CONSTRAINT IF EXISTS purchase_orders_approval_status_check;

ALTER TABLE public.purchase_orders
ADD CONSTRAINT purchase_orders_approval_status_check
CHECK (approval_status IN ('draft', 'submitted', 'pending_approval', 'approved', 'rejected'));

-- =============================================================================
-- 3. SUPPLIER BILLS: SEPARATE LIFECYCLE STATUS FROM PAYMENT STATUS
-- =============================================================================
-- Reconcile any existing rows that had payment statuses stored in the status column
UPDATE public.purchase_bills
SET status = 'recorded'
WHERE status IN ('partially_paid', 'paid', 'overdue');

ALTER TABLE public.purchase_bills
DROP CONSTRAINT IF EXISTS purchase_bills_status_check;

ALTER TABLE public.purchase_bills
ADD CONSTRAINT purchase_bills_status_check
CHECK (status IN ('draft', 'recorded', 'cancelled'));

ALTER TABLE public.purchase_bills
DROP CONSTRAINT IF EXISTS purchase_bills_payment_status_check;

ALTER TABLE public.purchase_bills
ADD CONSTRAINT purchase_bills_payment_status_check
CHECK (payment_status IN ('unpaid', 'partially_paid', 'paid'));

-- =============================================================================
-- 4. PO GUARDS: IMMUTABILITY OF COMPANY, VENDOR & CANCELLATION
-- =============================================================================
CREATE OR REPLACE FUNCTION public.guard_purchase_order_mutations()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Company is strictly immutable after creation
    IF NEW.company_id <> OLD.company_id THEN
        RAISE EXCEPTION 'Purchase Order company (ID %) cannot be changed after creation', OLD.company_id;
    END IF;

    -- 2. Vendor cannot be changed once issued or billed
    IF NEW.vendor_id <> OLD.vendor_id THEN
        IF OLD.status IN ('issued', 'partially_billed', 'fully_billed', 'closed') OR OLD.billed_amount > 0 THEN
            RAISE EXCEPTION 'Vendor cannot be changed once Purchase Order has been issued or billed (Status: %)', OLD.status;
        END IF;
    END IF;

    -- 3. Cannot cancel PO if bills have already been recorded against it
    IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
        IF OLD.billed_amount > 0 THEN
            RAISE EXCEPTION 'Cannot cancel Purchase Order % because recorded bills exist against it (Billed Amount: ₹%)',
                OLD.po_number, OLD.billed_amount;
        END IF;
        NEW.cancelled_at := COALESCE(NEW.cancelled_at, now());
        IF NEW.cancellation_reason IS NULL OR trim(NEW.cancellation_reason) = '' THEN
            RAISE EXCEPTION 'Cancellation reason is required to cancel a Purchase Order';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_guard_purchase_order_mutations ON public.purchase_orders;
CREATE TRIGGER trg_guard_purchase_order_mutations
BEFORE UPDATE OF company_id, vendor_id, status ON public.purchase_orders
FOR EACH ROW EXECUTE FUNCTION public.guard_purchase_order_mutations();

-- =============================================================================
-- 5. PO ITEMS GUARDS: ORDERED QUANTITY VS BILLED QUANTITY
-- =============================================================================
CREATE OR REPLACE FUNCTION public.guard_po_item_mutations()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        -- Prevent reducing ordered quantity below already billed quantity
        IF NEW.quantity < OLD.billed_quantity THEN
            RAISE EXCEPTION 'Ordered quantity (%) cannot be reduced below already billed quantity (%) for item "%"',
                NEW.quantity, OLD.billed_quantity, OLD.item_name;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Prevent deleting item if already billed
        IF OLD.billed_quantity > 0 THEN
            RAISE EXCEPTION 'Cannot delete item "%" from Purchase Order as it has already been billed (%)',
                OLD.item_name, OLD.billed_quantity;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_guard_po_item_mutations ON public.purchase_order_items;
CREATE TRIGGER trg_guard_po_item_mutations
BEFORE UPDATE OF quantity OR DELETE ON public.purchase_order_items
FOR EACH ROW EXECUTE FUNCTION public.guard_po_item_mutations();

-- =============================================================================
-- 6. SUPPLIER BILL GUARDS: CANCELLATION RESTRICTIONS
-- =============================================================================
CREATE OR REPLACE FUNCTION public.guard_purchase_bill_mutations()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent cancelling a bill that has recorded disbursements
    IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
        IF OLD.amount_paid > 0 THEN
            RAISE EXCEPTION 'Cannot cancel Purchase Bill % with existing recorded disbursements (amount paid: ₹%)',
                OLD.bill_number, OLD.amount_paid;
        END IF;
        -- Zero out balance due upon cancellation
        NEW.balance_due := 0.00;
        NEW.payment_status := 'unpaid';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_guard_purchase_bill_mutations ON public.purchase_bills;
CREATE TRIGGER trg_guard_purchase_bill_mutations
BEFORE UPDATE OF status ON public.purchase_bills
FOR EACH ROW EXECUTE FUNCTION public.guard_purchase_bill_mutations();

-- =============================================================================
-- 7. LINE-ITEM OVER-BILLING VALIDATION & CONCURRENCY PROTECTION
-- =============================================================================
CREATE OR REPLACE FUNCTION public.validate_bill_item_quantity_and_po_state()
RETURNS TRIGGER AS $$
DECLARE
    bill_rec RECORD;
    po_item_rec RECORD;
    po_header_rec RECORD;
    existing_billed NUMERIC(10,2);
    attempted_total NUMERIC(10,2);
BEGIN
    -- Only applies to PO-linked bill items
    IF NEW.purchase_order_item_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Fetch parent bill to inspect status and PO link
    SELECT id, purchase_order_id, status INTO bill_rec
    FROM public.purchase_bills
    WHERE id = NEW.purchase_bill_id;

    IF NOT FOUND THEN
        RETURN NEW;
    END IF;

    -- Concurrency Protection: Lock PO Item and PO Header for update
    SELECT id, purchase_order_id, item_name, quantity, billed_quantity
    INTO po_item_rec
    FROM public.purchase_order_items
    WHERE id = NEW.purchase_order_item_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Linked Purchase Order Item (ID %) does not exist', NEW.purchase_order_item_id;
    END IF;

    SELECT id, po_number, status
    INTO po_header_rec
    FROM public.purchase_orders
    WHERE id = po_item_rec.purchase_order_id
    FOR UPDATE;

    -- A bill can only be recorded against an issued or partially billed PO
    IF bill_rec.status = 'recorded' THEN
        IF po_header_rec.status NOT IN ('issued', 'partially_billed') THEN
            RAISE EXCEPTION 'Cannot bill against Purchase Order % because it is in status "%" (Only "issued" or "partially_billed" POs accept bills)',
                po_header_rec.po_number, po_header_rec.status;
        END IF;

        -- Sum existing billed quantity from all other RECORDED bills for this PO item
        SELECT COALESCE(SUM(bi.quantity), 0.00) INTO existing_billed
        FROM public.purchase_bill_items bi
        JOIN public.purchase_bills b ON b.id = bi.purchase_bill_id
        WHERE bi.purchase_order_item_id = NEW.purchase_order_item_id
          AND b.status = 'recorded'
          AND bi.id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);

        attempted_total := existing_billed + NEW.quantity;

        IF attempted_total > po_item_rec.quantity THEN
            RAISE EXCEPTION 'Over-billing rejected: Item "%" ordered quantity is %, already billed %, attempting to bill %. Remaining billable quantity is %',
                po_item_rec.item_name, po_item_rec.quantity, existing_billed, NEW.quantity, (po_item_rec.quantity - existing_billed);
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_bill_item_quantity ON public.purchase_bill_items;
CREATE TRIGGER trg_validate_bill_item_quantity
BEFORE INSERT OR UPDATE OF purchase_order_item_id, quantity ON public.purchase_bill_items
FOR EACH ROW EXECUTE FUNCTION public.validate_bill_item_quantity_and_po_state();

-- =============================================================================
-- 8. AUTHORITATIVE PO BILLING PROGRESS SYNCHRONIZATION FUNCTION
-- =============================================================================
CREATE OR REPLACE FUNCTION public.sync_purchase_order_billing_status(target_po_id UUID)
RETURNS VOID AS $$
DECLARE
    po_rec RECORD;
    total_billed_val NUMERIC(12,2);
    total_ordered_qty NUMERIC(10,2);
    total_billed_qty NUMERIC(10,2);
    new_po_status TEXT;
BEGIN
    IF target_po_id IS NULL THEN
        RETURN;
    END IF;

    -- Lock PO row to serialize progress updates
    SELECT id, po_number, total_amount, status
    INTO po_rec
    FROM public.purchase_orders
    WHERE id = target_po_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- 1. Sync line-level billed_quantity for all items in this PO
    -- Only bills in status 'recorded' contribute to billed_quantity
    UPDATE public.purchase_order_items poi
    SET billed_quantity = COALESCE(
        (SELECT SUM(bi.quantity)
         FROM public.purchase_bill_items bi
         JOIN public.purchase_bills b ON b.id = bi.purchase_bill_id
         WHERE bi.purchase_order_item_id = poi.id
           AND b.status = 'recorded'),
        0.00
    )
    WHERE poi.purchase_order_id = target_po_id;

    -- 2. Sum recorded bill amounts
    SELECT COALESCE(SUM(total_amount), 0.00) INTO total_billed_val
    FROM public.purchase_bills
    WHERE purchase_order_id = target_po_id
      AND status = 'recorded';

    -- 3. Calculate quantity progression across items
    SELECT 
        COALESCE(SUM(quantity), 0.00),
        COALESCE(SUM(billed_quantity), 0.00)
    INTO total_ordered_qty, total_billed_qty
    FROM public.purchase_order_items
    WHERE purchase_order_id = target_po_id;

    -- 4. Determine PO status progression
    IF po_rec.status = 'cancelled' THEN
        new_po_status := 'cancelled';
    ELSIF po_rec.status IN ('draft', 'submitted', 'approved') THEN
        new_po_status := po_rec.status;
    ELSIF po_rec.status IN ('issued', 'partially_billed', 'fully_billed', 'closed') THEN
        IF total_billed_qty = 0 AND total_billed_val = 0 THEN
            new_po_status := 'issued';
        ELSIF total_billed_qty >= total_ordered_qty AND total_ordered_qty > 0 THEN
            -- Preferred Rule per Section 7 & 34: FULLY_BILLED -> CLOSED automatically
            new_po_status := 'closed';
        ELSE
            new_po_status := 'partially_billed';
        END IF;
    ELSE
        new_po_status := po_rec.status;
    END IF;

    -- 5. Commit updated progress to PO
    UPDATE public.purchase_orders
    SET billed_amount = total_billed_val,
        status = new_po_status,
        updated_at = now()
    WHERE id = target_po_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger wrapper for purchase_bills changes
CREATE OR REPLACE FUNCTION public.trg_fn_sync_po_from_bill()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        IF OLD.purchase_order_id IS NOT NULL THEN
            PERFORM public.sync_purchase_order_billing_status(OLD.purchase_order_id);
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.purchase_order_id IS NOT NULL AND OLD.purchase_order_id <> NEW.purchase_order_id THEN
            PERFORM public.sync_purchase_order_billing_status(OLD.purchase_order_id);
        END IF;
        IF NEW.purchase_order_id IS NOT NULL THEN
            PERFORM public.sync_purchase_order_billing_status(NEW.purchase_order_id);
        END IF;
    ELSIF TG_OP = 'INSERT' THEN
        IF NEW.purchase_order_id IS NOT NULL THEN
            PERFORM public.sync_purchase_order_billing_status(NEW.purchase_order_id);
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_po_billed_amount ON public.purchase_bills;
DROP TRIGGER IF EXISTS trg_sync_po_from_bill ON public.purchase_bills;
CREATE TRIGGER trg_sync_po_from_bill
AFTER INSERT OR UPDATE OF purchase_order_id, total_amount, status OR DELETE ON public.purchase_bills
FOR EACH ROW EXECUTE FUNCTION public.trg_fn_sync_po_from_bill();

-- Trigger wrapper for purchase_bill_items changes
CREATE OR REPLACE FUNCTION public.trg_fn_sync_po_from_bill_item()
RETURNS TRIGGER AS $$
DECLARE
    po_id_to_sync UUID;
    target_bill_id UUID;
BEGIN
    target_bill_id := COALESCE(NEW.purchase_bill_id, OLD.purchase_bill_id);
    
    SELECT purchase_order_id INTO po_id_to_sync
    FROM public.purchase_bills
    WHERE id = target_bill_id;

    IF po_id_to_sync IS NOT NULL THEN
        PERFORM public.sync_purchase_order_billing_status(po_id_to_sync);
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_po_from_bill_item ON public.purchase_bill_items;
CREATE TRIGGER trg_sync_po_from_bill_item
AFTER INSERT OR UPDATE OF quantity, purchase_order_item_id OR DELETE ON public.purchase_bill_items
FOR EACH ROW EXECUTE FUNCTION public.trg_fn_sync_po_from_bill_item();

-- =============================================================================
-- 9. PAYMENT SYNCHRONIZATION: CLEAN SEPARATION
-- =============================================================================
CREATE OR REPLACE FUNCTION public.sync_purchase_bill_payments()
RETURNS TRIGGER AS $$
DECLARE
    target_bill_id UUID;
    total_paid NUMERIC(12,2);
    bill_total NUMERIC(12,2);
    new_bal NUMERIC(12,2);
    curr_status TEXT;
    new_pay_status TEXT;
BEGIN
    target_bill_id := COALESCE(NEW.bill_id, OLD.bill_id);

    -- Calculate total vendor payments for this bill
    SELECT COALESCE(SUM(amount), 0.00) INTO total_paid
    FROM public.vendor_payments
    WHERE bill_id = target_bill_id;

    -- Fetch current bill total and status
    SELECT total_amount, status INTO bill_total, curr_status
    FROM public.purchase_bills
    WHERE id = target_bill_id;

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    -- Overpayment protection at DB trigger level
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

    -- Lifecycle status remains unchanged ('draft', 'recorded', 'cancelled')
    -- Payment status reflects payment progression ('unpaid', 'partially_paid', 'paid')
    UPDATE public.purchase_bills
    SET amount_paid = total_paid,
        balance_due = new_bal,
        payment_status = new_pay_status,
        updated_at = now()
    WHERE id = target_bill_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_purchase_bill_payments ON public.vendor_payments;
CREATE TRIGGER trg_sync_purchase_bill_payments
AFTER INSERT OR UPDATE OF amount, bill_id OR DELETE ON public.vendor_payments
FOR EACH ROW EXECUTE FUNCTION public.sync_purchase_bill_payments();

-- =============================================================================
-- 10. DATA RECONCILIATION ROUTINE
-- =============================================================================
DO $$
DECLARE
    r RECORD;
BEGIN
    -- 1. Sync all existing PO line-item billed quantities
    UPDATE public.purchase_order_items poi
    SET billed_quantity = COALESCE(
        (SELECT SUM(bi.quantity)
         FROM public.purchase_bill_items bi
         JOIN public.purchase_bills b ON b.id = bi.purchase_bill_id
         WHERE bi.purchase_order_item_id = poi.id
           AND b.status = 'recorded'),
        0.00
    );

    -- 2. Sync all purchase orders
    FOR r IN SELECT id FROM public.purchase_orders LOOP
        PERFORM public.sync_purchase_order_billing_status(r.id);
    END LOOP;

    -- 3. Sync all bill payments and balances
    FOR r IN SELECT id, total_amount FROM public.purchase_bills LOOP
        UPDATE public.purchase_bills b
        SET amount_paid = COALESCE((SELECT SUM(amount) FROM public.vendor_payments vp WHERE vp.bill_id = r.id), 0.00),
            balance_due = r.total_amount - COALESCE((SELECT SUM(amount) FROM public.vendor_payments vp WHERE vp.bill_id = r.id), 0.00),
            payment_status = CASE 
                WHEN COALESCE((SELECT SUM(amount) FROM public.vendor_payments vp WHERE vp.bill_id = r.id), 0.00) >= r.total_amount THEN 'paid'
                WHEN COALESCE((SELECT SUM(amount) FROM public.vendor_payments vp WHERE vp.bill_id = r.id), 0.00) > 0 THEN 'partially_paid'
                ELSE 'unpaid'
            END
        WHERE b.id = r.id;
    END LOOP;
END;
$$;
