import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import {
  postCustomerAdvanceJournal,
  postCustomerAdvanceAllocationJournal,
  postVendorAdvanceJournal,
  postVendorAdvanceAllocationJournal
} from '../../accounting/services/postingService';

/**
 * JAY MURLIDHAR GROUP (JMG) — ADVANCE MANAGEMENT SERVICE
 * 
 * Manages Customer Advances (Liability 2300) and Vendor Advances (Asset 1500)
 * along with their allocations against Invoices and Supplier Bills.
 * Per BD-04: No output GST is created at customer advance receipt.
 */

// =============================================================================
// 1. CUSTOMER ADVANCES
// =============================================================================

export async function getCustomerAdvances({ companyId, customerId, status } = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('customer_advances')
    .select(`
      *,
      customer:customers(id, display_name, customer_code),
      bank_account:company_bank_accounts(id, bank_name, account_number)
    `)
    .order('created_at', { ascending: false });

  if (companyId) query = query.eq('company_id', companyId);
  if (customerId) query = query.eq('customer_id', customerId);
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createCustomerAdvance({
  companyId,
  customerId,
  amount,
  paymentMode = 'bank_transfer',
  bankAccountId = null,
  referenceNumber = '',
  receiptDate = null,
  notes = '',
  userId = null
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const advAmount = Math.round(Number(amount) * 100) / 100;
  if (advAmount <= 0) throw new Error('Advance amount must be greater than zero');

  const { data: adv, error: advErr } = await supabase
    .from('customer_advances')
    .insert([
      {
        company_id: companyId,
        customer_id: customerId,
        amount: advAmount,
        allocated_amount: 0,
        remaining_balance: advAmount,
        payment_mode: paymentMode,
        bank_account_id: bankAccountId,
        reference_number: referenceNumber,
        receiptDate: receiptDate || new Date().toISOString().split('T')[0],
        status: 'available',
        notes,
        created_by: userId
      }
    ])
    .select()
    .single();

  if (advErr) throw advErr;

  // Post Double-Entry Journal: Debit Cash/Bank, Credit Customer Advance (2300)
  await postCustomerAdvanceJournal(adv.id, userId);

  return adv;
}

export async function allocateCustomerAdvance({
  companyId,
  advanceId,
  invoiceId,
  allocatedAmount,
  allocationDate = null,
  notes = '',
  userId = null
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const allocAmt = Math.round(Number(allocatedAmount) * 100) / 100;
  if (allocAmt <= 0) throw new Error('Allocation amount must be greater than zero');

  // Verify advance balance
  const { data: adv, error: advErr } = await supabase
    .from('customer_advances')
    .select('*')
    .eq('id', advanceId)
    .single();

  if (advErr || !adv) throw new Error('Advance record not found');
  if (adv.company_id !== companyId) throw new Error('Company mismatch on advance allocation');
  if (Number(adv.remaining_balance) < allocAmt) {
    throw new Error(`Allocated amount (₹${allocAmt}) exceeds remaining advance balance (₹${adv.remaining_balance})`);
  }

  // Verify invoice balance
  const { data: inv, error: invErr } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .single();

  if (invErr || !inv) throw new Error('Invoice not found');
  if (inv.company_id !== companyId) throw new Error('Company mismatch on invoice allocation');
  if (inv.customer_id !== adv.customer_id) {
    throw new Error('Advance customer does not match invoice customer');
  }
  if (inv.status === 'cancelled') {
    throw new Error('Cannot allocate advance to a cancelled invoice');
  }

  // Record allocation
  const { data: alloc, error: allocErr } = await supabase
    .from('customer_advance_allocations')
    .insert([
      {
        company_id: companyId,
        advance_id: advanceId,
        invoice_id: invoiceId,
        allocated_amount: allocAmt,
        allocation_date: allocationDate || new Date().toISOString().split('T')[0],
        notes,
        created_by: userId
      }
    ])
    .select()
    .single();

  if (allocErr) throw allocErr;

  // Update advance balance
  const newAllocated = Math.round((Number(adv.allocated_amount) + allocAmt) * 100) / 100;
  const newRemaining = Math.round((Number(adv.amount) - newAllocated) * 100) / 100;
  const newStatus = newRemaining <= 0 ? 'fully_allocated' : 'partially_allocated';

  await supabase
    .from('customer_advances')
    .update({
      allocated_amount: newAllocated,
      remaining_balance: newRemaining,
      status: newStatus
    })
    .eq('id', advanceId);

  // Update invoice balance_due
  const newAmountPaid = Math.round((Number(inv.amount_paid) + allocAmt) * 100) / 100;
  const newBalanceDue = Math.max(0, Math.round((Number(inv.total_amount) - newAmountPaid) * 100) / 100);
  const newInvStatus = newBalanceDue <= 0 ? 'paid' : 'partially_paid';

  await supabase
    .from('invoices')
    .update({
      amount_paid: newAmountPaid,
      balance_due: newBalanceDue,
      status: newInvStatus
    })
    .eq('id', invoiceId);

  // Post Double-Entry Journal: Debit Customer Advance (2300), Credit AR (1200)
  await postCustomerAdvanceAllocationJournal(alloc.id, userId);

  return alloc;
}

// =============================================================================
// 2. VENDOR ADVANCES
// =============================================================================

export async function getVendorAdvances({ companyId, vendorId, status } = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('vendor_advances')
    .select(`
      *,
      vendor:vendors(id, legal_name, vendor_code),
      bank_account:company_bank_accounts(id, bank_name, account_number)
    `)
    .order('created_at', { ascending: false });

  if (companyId) query = query.eq('company_id', companyId);
  if (vendorId) query = query.eq('vendor_id', vendorId);
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createVendorAdvance({
  companyId,
  vendorId,
  amount,
  paymentMode = 'bank_transfer',
  bankAccountId = null,
  referenceNumber = '',
  disbursementDate = null,
  notes = '',
  userId = null
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const advAmount = Math.round(Number(amount) * 100) / 100;
  if (advAmount <= 0) throw new Error('Advance amount must be greater than zero');

  const { data: adv, error: advErr } = await supabase
    .from('vendor_advances')
    .insert([
      {
        company_id: companyId,
        vendor_id: vendorId,
        amount: advAmount,
        allocated_amount: 0,
        remaining_balance: advAmount,
        payment_mode: paymentMode,
        bank_account_id: bankAccountId,
        reference_number: referenceNumber,
        disbursement_date: disbursementDate || new Date().toISOString().split('T')[0],
        status: 'available',
        notes,
        created_by: userId
      }
    ])
    .select()
    .single();

  if (advErr) throw advErr;

  // Post Double-Entry Journal: Debit Vendor Advance (1500), Credit Cash/Bank (1120)
  await postVendorAdvanceJournal(adv.id, userId);

  return adv;
}

export async function allocateVendorAdvance({
  companyId,
  advanceId,
  purchaseBillId,
  allocatedAmount,
  allocationDate = null,
  notes = '',
  userId = null
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const allocAmt = Math.round(Number(allocatedAmount) * 100) / 100;
  if (allocAmt <= 0) throw new Error('Allocation amount must be greater than zero');

  const { data: adv, error: advErr } = await supabase
    .from('vendor_advances')
    .select('*')
    .eq('id', advanceId)
    .single();

  if (advErr || !adv) throw new Error('Vendor advance record not found');
  if (adv.company_id !== companyId) throw new Error('Company mismatch on advance allocation');
  if (Number(adv.remaining_balance) < allocAmt) {
    throw new Error(`Allocated amount exceeds remaining advance balance`);
  }

  const { data: bill, error: billErr } = await supabase
    .from('purchase_bills')
    .select('*')
    .eq('id', purchaseBillId)
    .single();

  if (billErr || !bill) throw new Error('Purchase bill not found');
  if (bill.company_id !== companyId) throw new Error('Company mismatch on bill allocation');
  if (bill.vendor_id !== adv.vendor_id) {
    throw new Error('Advance vendor does not match bill vendor');
  }

  const { data: alloc, error: allocErr } = await supabase
    .from('vendor_advance_allocations')
    .insert([
      {
        company_id: companyId,
        advance_id: advanceId,
        purchase_bill_id: purchaseBillId,
        allocated_amount: allocAmt,
        allocation_date: allocationDate || new Date().toISOString().split('T')[0],
        notes,
        created_by: userId
      }
    ])
    .select()
    .single();

  if (allocErr) throw allocErr;

  // Update advance balance
  const newAllocated = Math.round((Number(adv.allocated_amount) + allocAmt) * 100) / 100;
  const newRemaining = Math.round((Number(adv.amount) - newAllocated) * 100) / 100;
  const newStatus = newRemaining <= 0 ? 'fully_allocated' : 'partially_allocated';

  await supabase
    .from('vendor_advances')
    .update({
      allocated_amount: newAllocated,
      remaining_balance: newRemaining,
      status: newStatus
    })
    .eq('id', advanceId);

  // Update bill balance_due
  const newAmountPaid = Math.round((Number(bill.amount_paid) + allocAmt) * 100) / 100;
  const newBalanceDue = Math.max(0, Math.round((Number(bill.total_amount) - newAmountPaid) * 100) / 100);
  const newBillStatus = newBalanceDue <= 0 ? 'paid' : 'partially_paid';

  await supabase
    .from('purchase_bills')
    .update({
      amount_paid: newAmountPaid,
      balance_due: newBalanceDue,
      status: newBillStatus
    })
    .eq('id', purchaseBillId);

  // Post Double-Entry Journal: Debit AP (2100), Credit Vendor Advance Asset (1500)
  await postVendorAdvanceAllocationJournal(alloc.id, userId);

  return alloc;
}

// Flexible adapters for component and test compatibility
export async function getCustomerAdvancesAdapter(arg1, arg2) {
  if (typeof arg1 === 'object' && arg1 !== null) {
    return getCustomerAdvances(arg1);
  }
  return getCustomerAdvances({ companyId: arg1, ...(arg2 || {}) });
}

export async function getVendorAdvancesAdapter(arg1, arg2) {
  if (typeof arg1 === 'object' && arg1 !== null) {
    return getVendorAdvances(arg1);
  }
  return getVendorAdvances({ companyId: arg1, ...(arg2 || {}) });
}

export async function recordCustomerAdvanceAdapter(params) {
  return createCustomerAdvance({
    companyId: params.company_id || params.companyId,
    customerId: params.customer_id || params.customerId,
    amount: params.amount,
    paymentMode: params.payment_mode || params.paymentMode,
    bankAccountId: params.bank_account_id || params.bankAccountId,
    referenceNumber: params.reference || params.reference_number || params.referenceNumber,
    receiptDate: params.receipt_date || params.receiptDate,
    notes: params.notes,
    userId: params.userId || params.user_id
  });
}

export async function recordVendorAdvanceAdapter(params) {
  return createVendorAdvance({
    companyId: params.company_id || params.companyId,
    vendorId: params.vendor_id || params.vendorId,
    amount: params.amount,
    paymentMode: params.payment_mode || params.paymentMode,
    bankAccountId: params.bank_account_id || params.bankAccountId,
    referenceNumber: params.reference || params.reference_number || params.referenceNumber,
    disbursementDate: params.payment_date || params.disbursement_date || params.disbursementDate,
    notes: params.notes,
    userId: params.userId || params.user_id
  });
}

export const advanceService = {
  getCustomerAdvances: getCustomerAdvancesAdapter,
  createCustomerAdvance,
  recordCustomerAdvance: recordCustomerAdvanceAdapter,
  receiveCustomerAdvance: recordCustomerAdvanceAdapter,
  allocateCustomerAdvance,
  getVendorAdvances: getVendorAdvancesAdapter,
  createVendorAdvance,
  recordVendorAdvance: recordVendorAdvanceAdapter,
  allocateVendorAdvance
};

export default advanceService;
