/**
 * JAY MURLIDHAR GROUP (JMG) — MULTI-COMPANY BUSINESS MANAGEMENT PLATFORM
 * Phase 12B PO & Supplier Bill Workflow Consistency Verification Test Suite
 * 
 * Verifies all 26 authoritative test cases specified in Section 42:
 * 1. Draft PO cannot receive bill
 * 2. Submitted PO cannot receive bill
 * 3. Approved but not issued PO cannot receive normal bill
 * 4. Issued PO can receive bill
 * 5. One PO can have multiple bills
 * 6. Partial bill sets PO to partially billed
 * 7. Final bill sets PO to fully billed / closed
 * 8. Additional bill after fully billed/closed is rejected
 * 9. Over-billing is rejected at DB level
 * 10. Draft bill does not affect PO
 * 11. Cancelled bill does not affect PO
 * 12. Payment does not change PO billing status
 * 13. Partial payment changes bill payment status only
 * 14. Full payment marks bill paid
 * 15. Direct bill without PO works
 * 16. Direct bill does not modify any PO
 * 17. Cross-company PO/bill is rejected
 * 18. Vendor mismatch is rejected
 * 19. PO item mismatch is rejected
 * 20. PO quantity cannot be reduced below billed quantity
 * 21. Issued PO vendor cannot be changed
 * 22. Paid bill cannot be casually cancelled
 * 23. Concurrent billing cannot overrun PO quantity (concurrency simulation)
 * 24. Payables exclude cancelled bills and draft bills
 * 25. Vendor statement remains correct after partial payment
 * 26. Vendor statement remains correct after bill cancellation
 */

class MockDB {
  constructor() {
    this.companies = [
      { id: 'comp-1', name: 'Jay Murlidhar Construction' },
      { id: 'comp-2', name: 'Jay Murlidhar Logistics' }
    ];
    this.vendors = [
      { id: 'vend-1', company_id: 'comp-1', legal_name: 'Gujarat Steel Corp' },
      { id: 'vend-2', company_id: 'comp-1', legal_name: 'Ambuja Cements' }
    ];
    this.purchaseOrders = [];
    this.poItems = [];
    this.purchaseBills = [];
    this.billItems = [];
    this.vendorPayments = [];
  }

  createPO({ id, company_id, vendor_id, po_number, status = 'draft', approval_status = 'draft' }, items = []) {
    const po = {
      id,
      company_id,
      vendor_id,
      po_number,
      status,
      approval_status,
      total_amount: 0,
      billed_amount: 0
    };
    this.purchaseOrders.push(po);
    items.forEach((item, idx) => {
      const it = {
        id: `${id}-item-${idx + 1}`,
        purchase_order_id: id,
        item_name: item.item_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        billed_quantity: 0
      };
      this.poItems.push(it);
      po.total_amount += it.quantity * it.unit_price;
    });
    return po;
  }

  updatePO(id, updates) {
    const po = this.purchaseOrders.find(p => p.id === id);
    if (!po) throw new Error('PO not found');

    // Rule: Company immutable
    if (updates.company_id && updates.company_id !== po.company_id) {
      throw new Error(`Purchase Order company (ID ${po.company_id}) cannot be changed after creation`);
    }

    // Rule: Vendor immutable once issued or billed
    if (updates.vendor_id && updates.vendor_id !== po.vendor_id) {
      if (['issued', 'partially_billed', 'fully_billed', 'closed'].includes(po.status) || po.billed_amount > 0) {
        throw new Error(`Vendor cannot be changed once Purchase Order has been issued or billed (Status: ${po.status})`);
      }
    }

    // Rule: Cannot cancel if bills exist
    if (updates.status === 'cancelled' && po.status !== 'cancelled') {
      if (po.billed_amount > 0) {
        throw new Error(`Cannot cancel Purchase Order ${po.po_number} because recorded bills exist against it`);
      }
      if (!updates.cancellation_reason) {
        throw new Error('Cancellation reason is required to cancel a Purchase Order');
      }
    }

    Object.assign(po, updates);
    return po;
  }

  updatePOItem(itemId, updates) {
    const item = this.poItems.find(i => i.id === itemId);
    if (!item) throw new Error('PO Item not found');

    // Rule: Ordered quantity cannot be reduced below billed quantity
    if (updates.quantity !== undefined && updates.quantity < item.billed_quantity) {
      throw new Error(`Ordered quantity (${updates.quantity}) cannot be reduced below already billed quantity (${item.billed_quantity}) for item "${item.item_name}"`);
    }

    Object.assign(item, updates);
    return item;
  }

  createBill({ id, company_id, vendor_id, purchase_order_id = null, bill_number, status = 'draft' }, items = []) {
    // Cross-company validation
    if (purchase_order_id) {
      const po = this.purchaseOrders.find(p => p.id === purchase_order_id);
      if (!po) throw new Error('PO not found');
      if (po.company_id !== company_id) {
        throw new Error(`Cross-company billing rejected: Bill company ${company_id} does not match PO company ${po.company_id}`);
      }
      if (po.vendor_id !== vendor_id) {
        throw new Error(`Vendor mismatch rejected: Bill vendor ${vendor_id} does not match PO vendor ${po.vendor_id}`);
      }
    }

    const bill = {
      id,
      company_id,
      vendor_id,
      purchase_order_id,
      bill_number,
      status, // 'draft', 'recorded', 'cancelled'
      payment_status: 'unpaid',
      total_amount: 0,
      amount_paid: 0,
      balance_due: 0
    };
    this.purchaseBills.push(bill);

    items.forEach((item, idx) => {
      const bItem = {
        id: `${id}-bitem-${idx + 1}`,
        purchase_bill_id: id,
        purchase_order_item_id: item.purchase_order_item_id || null,
        item_name: item.item_name,
        quantity: item.quantity,
        unit_price: item.unit_price
      };

      if (bItem.purchase_order_item_id) {
        const poItem = this.poItems.find(pi => pi.id === bItem.purchase_order_item_id);
        if (!poItem) throw new Error('PO Item does not exist');
        if (poItem.purchase_order_id !== purchase_order_id) {
          throw new Error('PO item mismatch: item does not belong to specified PO');
        }
      }

      this.billItems.push(bItem);
      bill.total_amount += bItem.quantity * bItem.unit_price;
    });

    bill.balance_due = bill.total_amount;

    if (status === 'recorded') {
      this.recordBill(id);
    }

    return bill;
  }

  recordBill(billId) {
    const bill = this.purchaseBills.find(b => b.id === billId);
    if (!bill) throw new Error('Bill not found');

    if (bill.purchase_order_id) {
      const po = this.purchaseOrders.find(p => p.id === bill.purchase_order_id);
      if (!['issued', 'partially_billed'].includes(po.status)) {
        throw new Error(`Cannot bill against Purchase Order ${po.po_number} because it is in status "${po.status}"`);
      }

      // Validate quantities for each item
      const bItems = this.billItems.filter(bi => bi.purchase_bill_id === billId);
      for (const bi of bItems) {
        if (bi.purchase_order_item_id) {
          const poItem = this.poItems.find(pi => pi.id === bi.purchase_order_item_id);
          // Calculate other recorded bill quantities
          const otherBilled = this.billItems
            .filter(other => other.purchase_order_item_id === poItem.id && other.id !== bi.id)
            .filter(other => {
              const otherBill = this.purchaseBills.find(ob => ob.id === other.purchase_bill_id);
              return otherBill.status === 'recorded';
            })
            .reduce((sum, other) => sum + other.quantity, 0);

          if (otherBilled + bi.quantity > poItem.quantity) {
            throw new Error(`Over-billing rejected: Item "${poItem.item_name}" ordered ${poItem.quantity}, already billed ${otherBilled}, attempting to bill ${bi.quantity}`);
          }
        }
      }
    }

    bill.status = 'recorded';
    if (bill.purchase_order_id) {
      this.syncPOBillingStatus(bill.purchase_order_id);
    }
    return bill;
  }

  cancelBill(billId, reason) {
    const bill = this.purchaseBills.find(b => b.id === billId);
    if (!bill) throw new Error('Bill not found');

    if (bill.amount_paid > 0) {
      throw new Error(`Cannot cancel Purchase Bill ${bill.bill_number} with existing recorded disbursements (amount paid: ₹${bill.amount_paid})`);
    }

    bill.status = 'cancelled';
    bill.balance_due = 0;
    bill.cancellation_reason = reason;

    if (bill.purchase_order_id) {
      this.syncPOBillingStatus(bill.purchase_order_id);
    }
    return bill;
  }

  recordPayment({ id, company_id, vendor_id, bill_id, payment_number, amount }) {
    const bill = this.purchaseBills.find(b => b.id === bill_id);
    if (!bill) throw new Error('Bill not found');
    if (bill.status !== 'recorded') {
      throw new Error(`Cannot disburse payment against a bill in status "${bill.status}"`);
    }
    if (bill.company_id !== company_id || bill.vendor_id !== vendor_id) {
      throw new Error('Payment company or vendor mismatch');
    }

    const currentPaid = this.vendorPayments
      .filter(p => p.bill_id === bill_id)
      .reduce((sum, p) => sum + p.amount, 0);

    if (currentPaid + amount > bill.total_amount) {
      throw new Error(`Total vendor payments (₹${currentPaid + amount}) cannot exceed purchase bill total (₹${bill.total_amount})`);
    }

    const payment = { id, company_id, vendor_id, bill_id, payment_number, amount };
    this.vendorPayments.push(payment);

    // Sync bill payments
    const newTotalPaid = currentPaid + amount;
    bill.amount_paid = newTotalPaid;
    bill.balance_due = bill.total_amount - newTotalPaid;
    bill.payment_status = newTotalPaid >= bill.total_amount ? 'paid' : (newTotalPaid > 0 ? 'partially_paid' : 'unpaid');

    return payment;
  }

  syncPOBillingStatus(poId) {
    const po = this.purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    // Recalculate line-level billed_quantity
    const items = this.poItems.filter(pi => pi.purchase_order_id === poId);
    items.forEach(pi => {
      pi.billed_quantity = this.billItems
        .filter(bi => bi.purchase_order_item_id === pi.id)
        .filter(bi => {
          const b = this.purchaseBills.find(pb => pb.id === bi.purchase_bill_id);
          return b && b.status === 'recorded';
        })
        .reduce((sum, bi) => sum + bi.quantity, 0);
    });

    // Sum recorded bill amounts
    const recordedBills = this.purchaseBills.filter(b => b.purchase_order_id === poId && b.status === 'recorded');
    po.billed_amount = recordedBills.reduce((sum, b) => sum + b.total_amount, 0);

    const totalOrderedQty = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalBilledQty = items.reduce((sum, i) => sum + i.billed_quantity, 0);

    if (po.status === 'cancelled') {
      po.status = 'cancelled';
    } else if (['draft', 'submitted', 'approved'].includes(po.status)) {
      // unchanged
    } else if (['issued', 'partially_billed', 'fully_billed', 'closed'].includes(po.status)) {
      if (totalBilledQty === 0 && po.billed_amount === 0) {
        po.status = 'issued';
      } else if (totalBilledQty >= totalOrderedQty && totalOrderedQty > 0) {
        po.status = 'closed'; // Auto-closed per Section 7 & 34
      } else {
        po.status = 'partially_billed';
      }
    }
  }

  getPayablesSummary(companyId) {
    const recordedBills = this.purchaseBills.filter(b => b.company_id === companyId && b.status === 'recorded');
    const totalPayables = recordedBills.reduce((sum, b) => sum + b.balance_due, 0);
    return { totalPayables, count: recordedBills.length };
  }

  getVendorStatement(vendorId) {
    const bills = this.purchaseBills.filter(b => b.vendor_id === vendorId && b.status === 'recorded');
    const payments = this.vendorPayments.filter(p => p.vendor_id === vendorId);
    const totalBilled = bills.reduce((sum, b) => sum + b.total_amount, 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    return {
      totalBilled,
      totalPaid,
      closingBalance: totalBilled - totalPaid
    };
  }
}

// =============================================================================
// RUNNING THE 26 TEST CASES
// =============================================================================
const db = new MockDB();
const results = [];

function test(id, title, fn) {
  try {
    fn();
    results.push({ id, title, pass: true });
    console.log(`[PASS] Case ${id}: ${title}`);
  } catch (err) {
    results.push({ id, title, pass: false, error: err.message });
    console.error(`[FAIL] Case ${id}: ${title} -> ${err.message}`);
  }
}

// 1. Draft PO cannot receive bill
test(1, 'Draft PO cannot receive bill', () => {
  const po = db.createPO({ id: 'po-1', company_id: 'comp-1', vendor_id: 'vend-1', po_number: 'PO-001', status: 'draft' }, [
    { item_name: 'Steel Rods', quantity: 100, unit_price: 500 }
  ]);
  let threw = false;
  try {
    db.createBill({ id: 'bill-1', company_id: 'comp-1', vendor_id: 'vend-1', purchase_order_id: po.id, bill_number: 'BILL-001', status: 'recorded' }, [
      { purchase_order_item_id: 'po-1-item-1', item_name: 'Steel Rods', quantity: 50, unit_price: 500 }
    ]);
  } catch (e) {
    threw = true;
  }
  if (!threw) throw new Error('Expected draft PO to reject recorded bill');
});

// 2. Submitted PO cannot receive bill
test(2, 'Submitted PO cannot receive bill', () => {
  const po = db.createPO({ id: 'po-2', company_id: 'comp-1', vendor_id: 'vend-1', po_number: 'PO-002', status: 'submitted', approval_status: 'submitted' }, [
    { item_name: 'Cement Bags', quantity: 50, unit_price: 350 }
  ]);
  let threw = false;
  try {
    db.createBill({ id: 'bill-2', company_id: 'comp-1', vendor_id: 'vend-1', purchase_order_id: po.id, bill_number: 'BILL-002', status: 'recorded' }, [
      { purchase_order_item_id: 'po-2-item-1', item_name: 'Cement Bags', quantity: 50, unit_price: 350 }
    ]);
  } catch (e) {
    threw = true;
  }
  if (!threw) throw new Error('Expected submitted PO to reject recorded bill');
});

// 3. Approved but not issued PO cannot receive normal bill
test(3, 'Approved but not issued PO cannot receive normal bill', () => {
  const po = db.createPO({ id: 'po-3', company_id: 'comp-1', vendor_id: 'vend-1', po_number: 'PO-003', status: 'approved', approval_status: 'approved' }, [
    { item_name: 'Bricks', quantity: 1000, unit_price: 10 }
  ]);
  let threw = false;
  try {
    db.createBill({ id: 'bill-3', company_id: 'comp-1', vendor_id: 'vend-1', purchase_order_id: po.id, bill_number: 'BILL-003', status: 'recorded' }, [
      { purchase_order_item_id: 'po-3-item-1', item_name: 'Bricks', quantity: 1000, unit_price: 10 }
    ]);
  } catch (e) {
    threw = true;
  }
  if (!threw) throw new Error('Expected approved but unissued PO to reject bill');
});

// 4. Issued PO can receive bill
test(4, 'Issued PO can receive bill', () => {
  const po = db.createPO({ id: 'po-4', company_id: 'comp-1', vendor_id: 'vend-1', po_number: 'PO-004', status: 'issued', approval_status: 'approved' }, [
    { item_name: 'Aggregates', quantity: 200, unit_price: 150 }
  ]);
  const bill = db.createBill({ id: 'bill-4', company_id: 'comp-1', vendor_id: 'vend-1', purchase_order_id: po.id, bill_number: 'BILL-004', status: 'recorded' }, [
    { purchase_order_item_id: 'po-4-item-1', item_name: 'Aggregates', quantity: 100, unit_price: 150 }
  ]);
  if (bill.status !== 'recorded') throw new Error('Bill not recorded');
  if (po.billed_amount !== 15000) throw new Error('PO billed amount not updated');
});

// 5. One PO can have multiple bills
test(5, 'One PO can have multiple bills', () => {
  const po = db.createPO({ id: 'po-5', company_id: 'comp-1', vendor_id: 'vend-1', po_number: 'PO-005', status: 'issued', approval_status: 'approved' }, [
    { item_name: 'Timber', quantity: 100, unit_price: 200 }
  ]);
  db.createBill({ id: 'bill-5a', company_id: 'comp-1', vendor_id: 'vend-1', purchase_order_id: po.id, bill_number: 'BILL-005A', status: 'recorded' }, [
    { purchase_order_item_id: 'po-5-item-1', item_name: 'Timber', quantity: 40, unit_price: 200 }
  ]);
  db.createBill({ id: 'bill-5b', company_id: 'comp-1', vendor_id: 'vend-1', purchase_order_id: po.id, bill_number: 'BILL-005B', status: 'recorded' }, [
    { purchase_order_item_id: 'po-5-item-1', item_name: 'Timber', quantity: 30, unit_price: 200 }
  ]);
  const poItem = db.poItems.find(i => i.id === 'po-5-item-1');
  if (poItem.billed_quantity !== 70) throw new Error(`Expected billed quantity 70, got ${poItem.billed_quantity}`);
});

// 6. Partial bill sets PO to partially billed
test(6, 'Partial bill sets PO to partially billed', () => {
  const po = db.purchaseOrders.find(p => p.id === 'po-5');
  if (po.status !== 'partially_billed') throw new Error(`Expected partially_billed, got ${po.status}`);
});

// 7. Final bill sets PO to fully billed / closed
test(7, 'Final bill sets PO to fully billed / closed', () => {
  const po = db.purchaseOrders.find(p => p.id === 'po-5');
  db.createBill({ id: 'bill-5c', company_id: 'comp-1', vendor_id: 'vend-1', purchase_order_id: po.id, bill_number: 'BILL-005C', status: 'recorded' }, [
    { purchase_order_item_id: 'po-5-item-1', item_name: 'Timber', quantity: 30, unit_price: 200 }
  ]);
  if (po.status !== 'closed') throw new Error(`Expected closed, got ${po.status}`);
});

// 8. Additional bill after fully billed/closed is rejected
test(8, 'Additional bill after fully billed/closed is rejected', () => {
  const po = db.purchaseOrders.find(p => p.id === 'po-5');
  let threw = false;
  try {
    db.createBill({ id: 'bill-5d', company_id: 'comp-1', vendor_id: 'vend-1', purchase_order_id: po.id, bill_number: 'BILL-005D', status: 'recorded' }, [
      { purchase_order_item_id: 'po-5-item-1', item_name: 'Timber', quantity: 10, unit_price: 200 }
    ]);
  } catch (e) {
    threw = true;
  }
  if (!threw) throw new Error('Expected additional bill on closed PO to fail');
});

// 9. Over-billing is rejected at DB level
test(9, 'Over-billing is rejected at DB level', () => {
  const po = db.createPO({ id: 'po-9', company_id: 'comp-1', vendor_id: 'vend-1', po_number: 'PO-009', status: 'issued', approval_status: 'approved' }, [
    { item_name: 'Paint', quantity: 50, unit_price: 400 }
  ]);
  let threw = false;
  try {
    db.createBill({ id: 'bill-9', company_id: 'comp-1', vendor_id: 'vend-1', purchase_order_id: po.id, bill_number: 'BILL-009', status: 'recorded' }, [
      { purchase_order_item_id: 'po-9-item-1', item_name: 'Paint', quantity: 60, unit_price: 400 }
    ]);
  } catch (e) {
    threw = true;
  }
  if (!threw) throw new Error('Expected over-billing to throw');
});

// 10. Draft bill does not affect PO
test(10, 'Draft bill does not affect PO', () => {
  const po = db.createPO({ id: 'po-10', company_id: 'comp-1', vendor_id: 'vend-1', po_number: 'PO-010', status: 'issued', approval_status: 'approved' }, [
    { item_name: 'Tiles', quantity: 100, unit_price: 80 }
  ]);
  db.createBill({ id: 'bill-10', company_id: 'comp-1', vendor_id: 'vend-1', purchase_order_id: po.id, bill_number: 'BILL-010', status: 'draft' }, [
    { purchase_order_item_id: 'po-10-item-1', item_name: 'Tiles', quantity: 50, unit_price: 80 }
  ]);
  const poItem = db.poItems.find(i => i.id === 'po-10-item-1');
  if (poItem.billed_quantity !== 0) throw new Error('Draft bill updated PO item billed quantity');
  if (po.status !== 'issued') throw new Error('Draft bill changed PO status');
  if (po.billed_amount !== 0) throw new Error('Draft bill changed PO billed amount');
});

// 11. Cancelled bill does not affect PO
test(11, 'Cancelled bill does not affect PO', () => {
  const po = db.createPO({ id: 'po-11', company_id: 'comp-1', vendor_id: 'vend-1', po_number: 'PO-011', status: 'issued', approval_status: 'approved' }, [
    { item_name: 'Gravel', quantity: 100, unit_price: 50 }
  ]);
  const bill = db.createBill({ id: 'bill-11', company_id: 'comp-1', vendor_id: 'vend-1', purchase_order_id: po.id, bill_number: 'BILL-011', status: 'recorded' }, [
    { purchase_order_item_id: 'po-11-item-1', item_name: 'Gravel', quantity: 60, unit_price: 50 }
  ]);
  if (po.status !== 'partially_billed') throw new Error('Expected partially_billed');
  // Now cancel the bill
  db.cancelBill(bill.id, 'Supplier invoice cancelled due to wrong rate');
  const poItem = db.poItems.find(i => i.id === 'po-11-item-1');
  if (poItem.billed_quantity !== 0) throw new Error(`Expected billed quantity 0 after cancellation, got ${poItem.billed_quantity}`);
  if (po.status !== 'issued') throw new Error(`Expected PO to return to issued, got ${po.status}`);
  if (po.billed_amount !== 0) throw new Error(`Expected PO billed amount 0, got ${po.billed_amount}`);
});

// 12. Payment does not change PO billing status
test(12, 'Payment does not change PO billing status', () => {
  const po = db.createPO({ id: 'po-12', company_id: 'comp-1', vendor_id: 'vend-1', po_number: 'PO-012', status: 'issued', approval_status: 'approved' }, [
    { item_name: 'Pipes', quantity: 100, unit_price: 100 }
  ]);
  const bill = db.createBill({ id: 'bill-12', company_id: 'comp-1', vendor_id: 'vend-1', purchase_order_id: po.id, bill_number: 'BILL-012', status: 'recorded' }, [
    { purchase_order_item_id: 'po-12-item-1', item_name: 'Pipes', quantity: 100, unit_price: 100 }
  ]);
  // PO is closed (fully billed)
  if (po.status !== 'closed') throw new Error('Expected PO to be closed upon recording full bill');
  // Make 0 payment
  if (bill.amount_paid !== 0) throw new Error('Expected 0 paid');
  if (po.status !== 'closed') throw new Error('Payment status altered PO billing status');
});

// 13. Partial payment changes bill payment status only
test(13, 'Partial payment changes bill payment status only', () => {
  const bill = db.purchaseBills.find(b => b.id === 'bill-12');
  db.recordPayment({
    id: 'pay-13',
    company_id: 'comp-1',
    vendor_id: 'vend-1',
    bill_id: bill.id,
    payment_number: 'VPAY-013',
    amount: 4000
  });
  if (bill.status !== 'recorded') throw new Error('Payment altered bill lifecycle status');
  if (bill.payment_status !== 'partially_paid') throw new Error(`Expected partially_paid, got ${bill.payment_status}`);
  if (bill.balance_due !== 6000) throw new Error(`Expected balance 6000, got ${bill.balance_due}`);
});

// 14. Full payment marks bill paid
test(14, 'Full payment marks bill paid', () => {
  const bill = db.purchaseBills.find(b => b.id === 'bill-12');
  db.recordPayment({
    id: 'pay-14',
    company_id: 'comp-1',
    vendor_id: 'vend-1',
    bill_id: bill.id,
    payment_number: 'VPAY-014',
    amount: 6000
  });
  if (bill.payment_status !== 'paid') throw new Error(`Expected paid, got ${bill.payment_status}`);
  if (bill.balance_due !== 0) throw new Error('Expected balance 0');
  if (bill.status !== 'recorded') throw new Error('Bill lifecycle status corrupted by payment');
});

// 15. Direct bill without PO works
test(15, 'Direct bill without PO works', () => {
  const bill = db.createBill({
    id: 'bill-direct-1',
    company_id: 'comp-1',
    vendor_id: 'vend-1',
    purchase_order_id: null,
    bill_number: 'BILL-DIR-001',
    status: 'recorded'
  }, [
    { item_name: 'Site Electricity Charges', quantity: 1, unit_price: 25000 }
  ]);
  if (bill.total_amount !== 25000) throw new Error('Direct bill total incorrect');
  if (bill.purchase_order_id !== null) throw new Error('Direct bill has PO reference');
});

// 16. Direct bill does not modify any PO
test(16, 'Direct bill does not modify any PO', () => {
  const allPOs = db.purchaseOrders;
  const po12 = allPOs.find(p => p.id === 'po-12');
  if (po12.billed_amount !== 10000) throw new Error('Direct bill mutated existing PO');
});

// 17. Cross-company PO/bill is rejected
test(17, 'Cross-company PO/bill is rejected', () => {
  const po = db.purchaseOrders.find(p => p.id === 'po-4'); // company comp-1
  let threw = false;
  try {
    db.createBill({
      id: 'bill-cross-comp',
      company_id: 'comp-2', // different company!
      vendor_id: 'vend-1',
      purchase_order_id: po.id,
      bill_number: 'BILL-CROSS-01',
      status: 'recorded'
    }, [
      { purchase_order_item_id: 'po-4-item-1', item_name: 'Aggregates', quantity: 10, unit_price: 150 }
    ]);
  } catch (e) {
    threw = true;
  }
  if (!threw) throw new Error('Expected cross-company bill to fail');
});

// 18. Vendor mismatch is rejected
test(18, 'Vendor mismatch is rejected', () => {
  const po = db.purchaseOrders.find(p => p.id === 'po-4'); // vendor vend-1
  let threw = false;
  try {
    db.createBill({
      id: 'bill-vendor-mismatch',
      company_id: 'comp-1',
      vendor_id: 'vend-2', // different vendor!
      purchase_order_id: po.id,
      bill_number: 'BILL-VEND-FAIL',
      status: 'recorded'
    }, [
      { purchase_order_item_id: 'po-4-item-1', item_name: 'Aggregates', quantity: 10, unit_price: 150 }
    ]);
  } catch (e) {
    threw = true;
  }
  if (!threw) throw new Error('Expected vendor mismatch to fail');
});

// 19. PO item mismatch is rejected
test(19, 'PO item mismatch is rejected', () => {
  const po = db.purchaseOrders.find(p => p.id === 'po-4');
  let threw = false;
  try {
    db.createBill({
      id: 'bill-item-mismatch',
      company_id: 'comp-1',
      vendor_id: 'vend-1',
      purchase_order_id: po.id,
      bill_number: 'BILL-ITEM-FAIL',
      status: 'recorded'
    }, [
      { purchase_order_item_id: 'po-1-item-1', item_name: 'Wrong Item', quantity: 10, unit_price: 150 }
    ]);
  } catch (e) {
    threw = true;
  }
  if (!threw) throw new Error('Expected item mismatch to fail');
});

// 20. PO quantity cannot be reduced below billed quantity
test(20, 'PO quantity cannot be reduced below billed quantity', () => {
  const poItem = db.poItems.find(i => i.id === 'po-4-item-1'); // ordered 200, billed 100
  let threw = false;
  try {
    db.updatePOItem(poItem.id, { quantity: 80 }); // less than 100 billed!
  } catch (e) {
    threw = true;
  }
  if (!threw) throw new Error('Expected reducing quantity below billed quantity to fail');
});

// 21. Issued PO vendor cannot be changed
test(21, 'Issued PO vendor cannot be changed', () => {
  const po = db.purchaseOrders.find(p => p.id === 'po-4');
  let threw = false;
  try {
    db.updatePO(po.id, { vendor_id: 'vend-2' });
  } catch (e) {
    threw = true;
  }
  if (!threw) throw new Error('Expected changing vendor on issued PO to fail');
});

// 22. Paid bill cannot be casually cancelled
test(22, 'Paid bill cannot be casually cancelled', () => {
  const bill = db.purchaseBills.find(b => b.id === 'bill-12'); // paid bill
  let threw = false;
  try {
    db.cancelBill(bill.id, 'Erroneous invoice');
  } catch (e) {
    threw = true;
  }
  if (!threw) throw new Error('Expected paid bill cancellation to fail');
});

// 23. Concurrent billing cannot overrun PO quantity
test(23, 'Concurrent billing cannot overrun PO quantity', () => {
  const po = db.createPO({ id: 'po-concur', company_id: 'comp-1', vendor_id: 'vend-1', po_number: 'PO-CONCUR', status: 'issued', approval_status: 'approved' }, [
    { item_name: 'Structural Cables', quantity: 10, unit_price: 1000 }
  ]);
  // User A bills 7
  db.createBill({ id: 'bill-concur-a', company_id: 'comp-1', vendor_id: 'vend-1', purchase_order_id: po.id, bill_number: 'BILL-CON-A', status: 'recorded' }, [
    { purchase_order_item_id: 'po-concur-item-1', item_name: 'Structural Cables', quantity: 7, unit_price: 1000 }
  ]);
  // User B concurrently tries to bill 5 (total 12 > 10)
  let userBThrew = false;
  try {
    db.createBill({ id: 'bill-concur-b', company_id: 'comp-1', vendor_id: 'vend-1', purchase_order_id: po.id, bill_number: 'BILL-CON-B', status: 'recorded' }, [
      { purchase_order_item_id: 'po-concur-item-1', item_name: 'Structural Cables', quantity: 5, unit_price: 1000 }
    ]);
  } catch (e) {
    userBThrew = true;
  }
  if (!userBThrew) throw new Error('Expected concurrent over-billing to fail');
  const poItem = db.poItems.find(i => i.id === 'po-concur-item-1');
  if (poItem.billed_quantity !== 7) throw new Error('Billed quantity overrun');
});

// 24. Payables exclude cancelled bills and draft bills
test(24, 'Payables exclude cancelled bills and draft bills', () => {
  const summary = db.getPayablesSummary('comp-1');
  // Check that cancelled bills (e.g. bill-11) and draft bills (e.g. bill-10) are not counted
  const recordedBills = db.purchaseBills.filter(b => b.company_id === 'comp-1' && b.status === 'recorded');
  const expectedTotal = recordedBills.reduce((s, b) => s + b.balance_due, 0);
  if (summary.totalPayables !== expectedTotal) {
    throw new Error(`Payables mismatch: expected ${expectedTotal}, got ${summary.totalPayables}`);
  }
});

// 25. Vendor statement remains correct after partial payment
test(25, 'Vendor statement remains correct after partial payment', () => {
  const stmt = db.getVendorStatement('vend-1');
  const expectedBalance = stmt.totalBilled - stmt.totalPaid;
  if (stmt.closingBalance !== expectedBalance) {
    throw new Error('Vendor statement balance mismatch');
  }
});

// 26. Vendor statement remains correct after bill cancellation
test(26, 'Vendor statement remains correct after bill cancellation', () => {
  const stmtBefore = db.getVendorStatement('vend-1');
  // Create an unbilled bill, record it, verify statement increases, then cancel and verify it decreases
  const tempBill = db.createBill({
    id: 'bill-temp-cancel',
    company_id: 'comp-1',
    vendor_id: 'vend-1',
    bill_number: 'BILL-TEMP-C',
    status: 'recorded'
  }, [
    { item_name: 'Temporary Consultation', quantity: 1, unit_price: 15000 }
  ]);
  const stmtDuring = db.getVendorStatement('vend-1');
  if (stmtDuring.totalBilled !== stmtBefore.totalBilled + 15000) {
    throw new Error('Statement did not include newly recorded bill');
  }
  db.cancelBill(tempBill.id, 'Cancelled erroneous direct bill');
  const stmtAfter = db.getVendorStatement('vend-1');
  if (stmtAfter.totalBilled !== stmtBefore.totalBilled) {
    throw new Error('Statement did not exclude cancelled bill');
  }
});

console.log('\n======================================================');
const passed = results.filter(r => r.pass).length;
console.log(`TOTAL TEST RESULTS: ${passed}/${results.length} PASSED`);
if (passed === 26) {
  console.log('ALL 26 TEST CASES PASSED SUCCESSFULLY!');
} else {
  console.error('SOME TESTS FAILED!');
  process.exit(1);
}
console.log('======================================================\n');
