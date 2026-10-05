import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { getAccounts } from './accountService';
import { createManualJournal, reverseJournal } from './journalService';

/**
 * JAY MURLIDHAR GROUP (JMG) — POSTING ENGINE
 * 
 * Centralized automated posting dispatcher for operational transactions:
 * Invoices, Customer Payments, Supplier Bills, Vendor Payments, GRNs,
 * Inventory Adjustments, and Operational Expenses.
 */

// Helper to find account by standard code
function findAccount(accounts, code) {
  return accounts.find((a) => a.account_code === code) || null;
}

// Category to Account Code mapping for expenses
const EXPENSE_CATEGORY_CODE_MAP = {
  'Rent & Premises': '6110',
  'Staff Salaries & Honorarium': '6120',
  'Electricity & Utilities': '6130',
  'Stationery, Printing & Consumables': '6140',
  'Vehicle Maintenance & Transport': '6150',
  'Server, Cloud Hosting & Domains': '6160',
  'Statutory & Compliance Fees': '6170',
  'Marketing & Advertising': '6180',
  'Miscellaneous Office Expenses': '6190',
  'Hardware & Mobility Inventory': '1310'
};

/**
 * 1. Post Customer Invoice Journal (Revenue, GST, and COGS for products)
 */
export async function postInvoiceJournal(invoiceId, userId = null) {
  if (!isSupabaseConfigured || !invoiceId) return null;

  // Check idempotency: check if journal already exists
  const { data: existing } = await supabase
    .from('journal_entries')
    .select('id, journal_number')
    .eq('source_module', 'invoice')
    .eq('source_id', invoiceId)
    .eq('entry_type', 'sales')
    .maybeSingle();

  if (existing) return existing; // Idempotent: already posted

  // Fetch invoice with items
  const { data: invoice, error: invErr } = await supabase
    .from('invoices')
    .select(`
      *,
      items:invoice_items(*)
    `)
    .eq('id', invoiceId)
    .single();

  if (invErr || !invoice) throw new Error('Invoice not found for GL posting.');
  if (invoice.status === 'draft') return null; // Drafts do not post

  const accounts = await getAccounts(invoice.company_id);
  const arAccount = findAccount(accounts, '1210'); // Accounts Receivable
  const serviceRevAccount = findAccount(accounts, '4110'); // Service Revenue
  const productRevAccount = findAccount(accounts, '4210'); // Product Sales
  const cgstAccount = findAccount(accounts, '2210'); // Output CGST
  const sgstAccount = findAccount(accounts, '2220'); // Output SGST
  const igstAccount = findAccount(accounts, '2230'); // Output IGST
  const cogsAccount = findAccount(accounts, '5110'); // Product COGS
  const inventoryAccount = findAccount(accounts, '1310'); // Inventory Asset

  if (!arAccount) throw new Error('Accounts Receivable ledger (1210) not found.');

  // Calculate revenue splits
  let serviceTaxable = 0;
  let productTaxable = 0;
  let hasProducts = false;

  (invoice.items || []).forEach((item) => {
    const isProd = Boolean(item.product_id);
    const gross = (Number(item.quantity) || 1) * (Number(item.unit_price) || 0);
    const disc = Number(item.discount_amount) || 0;
    const taxable = Math.max(0, gross - disc);

    if (isProd) {
      productTaxable += taxable;
      hasProducts = true;
    } else {
      serviceTaxable += taxable;
    }
  });

  const totalAmount = Number(invoice.total_amount) || 0;
  const cgstAmount = Number(invoice.cgst_amount) || 0;
  const sgstAmount = Number(invoice.sgst_amount) || 0;
  const igstAmount = Number(invoice.igst_amount) || 0;

  const lines = [];

  // Line 1: Dr Accounts Receivable (Total invoice value)
  lines.push({
    accountId: arAccount.id,
    debit: totalAmount,
    credit: 0,
    description: `Invoice #${invoice.invoice_number} receivable`,
    entityType: 'customer',
    entityId: invoice.customer_id
  });

  // Line 2: Cr Service Revenue (if any)
  if (serviceTaxable > 0 && serviceRevAccount) {
    lines.push({
      accountId: serviceRevAccount.id,
      debit: 0,
      credit: Math.round(serviceTaxable * 100) / 100,
      description: `Service revenue for Invoice #${invoice.invoice_number}`
    });
  }

  // Line 3: Cr Product Sales Revenue (if any)
  if (productTaxable > 0 && productRevAccount) {
    lines.push({
      accountId: productRevAccount.id,
      debit: 0,
      credit: Math.round(productTaxable * 100) / 100,
      description: `Product sales revenue for Invoice #${invoice.invoice_number}`
    });
  }

  // Line 4-6: Cr Taxes
  if (cgstAmount > 0 && cgstAccount) {
    lines.push({
      accountId: cgstAccount.id,
      debit: 0,
      credit: cgstAmount,
      description: `Output CGST for Invoice #${invoice.invoice_number}`
    });
  }
  if (sgstAmount > 0 && sgstAccount) {
    lines.push({
      accountId: sgstAccount.id,
      debit: 0,
      credit: sgstAmount,
      description: `Output SGST for Invoice #${invoice.invoice_number}`
    });
  }
  if (igstAmount > 0 && igstAccount) {
    lines.push({
      accountId: igstAccount.id,
      debit: 0,
      credit: igstAmount,
      description: `Output IGST for Invoice #${invoice.invoice_number}`
    });
  }

  // Product COGS side: fetch stock movements for this invoice
  if (hasProducts && cogsAccount && inventoryAccount) {
    const { data: movements } = await supabase
      .from('stock_movements')
      .select('total_cost')
      .eq('reference_type', 'invoice')
      .eq('reference_id', invoiceId)
      .eq('movement_type', 'sales_issue');

    let totalCogs = 0;
    (movements || []).forEach((m) => {
      totalCogs += Number(m.total_cost) || 0;
    });
    totalCogs = Math.round(totalCogs * 100) / 100;

    if (totalCogs > 0) {
      lines.push({
        accountId: cogsAccount.id,
        debit: totalCogs,
        credit: 0,
        description: `COGS dispatch for Invoice #${invoice.invoice_number}`
      });
      lines.push({
        accountId: inventoryAccount.id,
        debit: 0,
        credit: totalCogs,
        description: `Inventory reduction for Invoice #${invoice.invoice_number}`
      });
    }
  }

  // Create commercial journal
  return await createManualJournal({
    companyId: invoice.company_id,
    entryDate: invoice.invoice_date || new Date().toISOString().split('T')[0],
    referenceNumber: invoice.invoice_number,
    narration: `Commercial sales invoice #${invoice.invoice_number}`,
    lines,
    entryType: 'sales',
    sourceModule: 'invoice',
    sourceId: invoice.id,
    userId
  });
}

/**
 * 2. Post Invoice Cancellation Reversal
 */
export async function postInvoiceCancellationJournal(invoiceId, userId = null) {
  if (!isSupabaseConfigured || !invoiceId) return null;

  const { data: salesJournal } = await supabase
    .from('journal_entries')
    .select('id, status')
    .eq('source_module', 'invoice')
    .eq('source_id', invoiceId)
    .eq('entry_type', 'sales')
    .maybeSingle();

  if (!salesJournal || salesJournal.status === 'reversed') {
    return null; // Nothing to reverse or already reversed
  }

  return await reverseJournal(salesJournal.id, 'Customer invoice cancelled', userId);
}

/**
 * 3. Post Customer Payment Journal (Cash/Bank Dr, AR Cr)
 */
export async function postPaymentJournal(paymentId, userId = null) {
  if (!isSupabaseConfigured || !paymentId) return null;

  // Idempotency check
  const { data: existing } = await supabase
    .from('journal_entries')
    .select('id, journal_number')
    .eq('source_module', 'payment')
    .eq('source_id', paymentId)
    .eq('entry_type', 'customer_payment')
    .maybeSingle();

  if (existing) return existing;

  const { data: payment, error } = await supabase
    .from('payments')
    .select(`
      *,
      invoice:invoices(id, company_id, invoice_number, customer_id)
    `)
    .eq('id', paymentId)
    .single();

  if (error || !payment) throw new Error('Payment not found for GL posting.');

  const companyId = payment.invoice?.company_id;
  if (!companyId) throw new Error('Cannot determine company for payment.');

  const accounts = await getAccounts(companyId);
  const arAccount = findAccount(accounts, '1210');
  const cashAccount = findAccount(accounts, '1110');
  const bankAccount = findAccount(accounts, '1120');

  const isCash = payment.payment_method === 'cash';
  const debitAccount = isCash ? (cashAccount || bankAccount) : (bankAccount || cashAccount);

  if (!arAccount || !debitAccount) {
    throw new Error('Ledger accounts (AR/Bank/Cash) not found for payment.');
  }

  const amount = Number(payment.amount) || 0;
  if (amount <= 0) return null;

  const lines = [
    {
      accountId: debitAccount.id,
      debit: amount,
      credit: 0,
      description: `Payment received (${payment.payment_method}) - Ref: ${payment.payment_number}`
    },
    {
      accountId: arAccount.id,
      debit: 0,
      credit: amount,
      description: `Payment against Invoice #${payment.invoice?.invoice_number}`,
      entityType: 'customer',
      entityId: payment.invoice?.customer_id
    }
  ];

  return await createManualJournal({
    companyId,
    entryDate: payment.payment_date || new Date().toISOString().split('T')[0],
    referenceNumber: payment.payment_number,
    narration: `Customer payment received #${payment.payment_number}`,
    lines,
    entryType: 'customer_payment',
    sourceModule: 'payment',
    sourceId: payment.id,
    userId
  });
}

/**
 * 4. Post Supplier Bill Journal (GRNI / Expense Dr, Input GST Dr, AP Cr)
 */
export async function postPurchaseBillJournal(billId, userId = null) {
  if (!isSupabaseConfigured || !billId) return null;

  // Idempotency check
  const { data: existing } = await supabase
    .from('journal_entries')
    .select('id, journal_number')
    .eq('source_module', 'purchase_bill')
    .eq('source_id', billId)
    .eq('entry_type', 'purchase')
    .maybeSingle();

  if (existing) return existing;

  const { data: bill, error } = await supabase
    .from('purchase_bills')
    .select('*')
    .eq('id', billId)
    .single();

  if (error || !bill) throw new Error('Supplier bill not found.');
  if (bill.status === 'draft' || bill.status === 'cancelled') return null;

  const accounts = await getAccounts(bill.company_id);
  const apAccount = findAccount(accounts, '2110'); // Accounts Payable
  const grniAccount = findAccount(accounts, '2120'); // GRNI Accrual
  const expenseAccount = findAccount(accounts, '6190'); // Misc Operating Expense fallback
  const inputCgstAccount = findAccount(accounts, '1410');
  const inputSgstAccount = findAccount(accounts, '1420');
  const inputIgstAccount = findAccount(accounts, '1430');

  if (!apAccount) throw new Error('Accounts Payable ledger (2110) not found.');

  const isPoLinked = Boolean(bill.purchase_order_id);
  const debitLedger = isPoLinked ? (grniAccount || expenseAccount) : expenseAccount;

  const subtotal = Number(bill.subtotal) || 0;
  const taxAmount = Number(bill.tax_amount) || 0;
  const totalAmount = Number(bill.total_amount) || 0;

  const lines = [];

  // Line 1: Dr GRNI / Expense
  lines.push({
    accountId: debitLedger.id,
    debit: subtotal,
    credit: 0,
    description: `Supplier bill #${bill.bill_number} (PO: ${bill.purchase_order_id ? 'Linked' : 'Direct'})`
  });

  // Line 2: Dr Input GST (Split equally CGST/SGST if tax present)
  if (taxAmount > 0) {
    const halfTax = Math.round((taxAmount / 2) * 100) / 100;
    const otherHalf = Math.round((taxAmount - halfTax) * 100) / 100;

    if (inputCgstAccount) {
      lines.push({
        accountId: inputCgstAccount.id,
        debit: halfTax,
        credit: 0,
        description: `Input CGST on Bill #${bill.bill_number}`
      });
    }
    if (inputSgstAccount) {
      lines.push({
        accountId: inputSgstAccount.id,
        debit: otherHalf,
        credit: 0,
        description: `Input SGST on Bill #${bill.bill_number}`
      });
    }
  }

  // Line 3: Cr Accounts Payable
  lines.push({
    accountId: apAccount.id,
    debit: 0,
    credit: totalAmount,
    description: `Accounts Payable for Bill #${bill.bill_number}`,
    entityType: 'vendor',
    entityId: bill.vendor_id
  });

  return await createManualJournal({
    companyId: bill.company_id,
    entryDate: bill.bill_date || new Date().toISOString().split('T')[0],
    referenceNumber: bill.bill_number,
    narration: `Supplier bill recorded #${bill.bill_number} (${bill.vendor_invoice_number || 'Direct'})`,
    lines,
    entryType: 'purchase',
    sourceModule: 'purchase_bill',
    sourceId: bill.id,
    userId
  });
}

/**
 * 5. Post Vendor Payment Journal (AP Dr, Cash/Bank Cr)
 */
export async function postVendorPaymentJournal(vendorPaymentId, userId = null) {
  if (!isSupabaseConfigured || !vendorPaymentId) return null;

  const { data: existing } = await supabase
    .from('journal_entries')
    .select('id, journal_number')
    .eq('source_module', 'vendor_payment')
    .eq('source_id', vendorPaymentId)
    .eq('entry_type', 'vendor_payment')
    .maybeSingle();

  if (existing) return existing;

  const { data: vpay, error } = await supabase
    .from('vendor_payments')
    .select(`
      *,
      bill:purchase_bills(id, company_id, bill_number, vendor_id)
    `)
    .eq('id', vendorPaymentId)
    .single();

  if (error || !vpay) throw new Error('Vendor payment not found.');

  const companyId = vpay.bill?.company_id;
  if (!companyId) throw new Error('Cannot determine company for vendor payment.');

  const accounts = await getAccounts(companyId);
  const apAccount = findAccount(accounts, '2110');
  const cashAccount = findAccount(accounts, '1110');
  const bankAccount = findAccount(accounts, '1120');

  const isCash = vpay.payment_method === 'cash';
  const creditAccount = isCash ? (cashAccount || bankAccount) : (bankAccount || cashAccount);

  if (!apAccount || !creditAccount) {
    throw new Error('Ledger accounts (AP/Bank/Cash) not found.');
  }

  const amount = Number(vpay.amount) || 0;
  if (amount <= 0) return null;

  const lines = [
    {
      accountId: apAccount.id,
      debit: amount,
      credit: 0,
      description: `Disbursement against Bill #${vpay.bill?.bill_number}`,
      entityType: 'vendor',
      entityId: vpay.bill?.vendor_id
    },
    {
      accountId: creditAccount.id,
      debit: 0,
      credit: amount,
      description: `Vendor payment disbursed (${vpay.payment_method}) - Ref: ${vpay.payment_number}`
    }
  ];

  return await createManualJournal({
    companyId,
    entryDate: vpay.payment_date || new Date().toISOString().split('T')[0],
    referenceNumber: vpay.payment_number,
    narration: `Vendor payment disbursement #${vpay.payment_number}`,
    lines,
    entryType: 'vendor_payment',
    sourceModule: 'vendor_payment',
    sourceId: vpay.id,
    userId
  });
}

/**
 * 6. Post Goods Receipt (GRN) Journal (Inventory Asset Dr, GRNI Cr)
 */
export async function postGoodsReceiptJournal(grnId, userId = null) {
  if (!isSupabaseConfigured || !grnId) return null;

  const { data: existing } = await supabase
    .from('journal_entries')
    .select('id, journal_number')
    .eq('source_module', 'goods_receipt')
    .eq('source_id', grnId)
    .eq('entry_type', 'grn')
    .maybeSingle();

  if (existing) return existing;

  const { data: grn, error } = await supabase
    .from('goods_receipts')
    .select(`
      *,
      items:goods_receipt_items(*)
    `)
    .eq('id', grnId)
    .single();

  if (error || !grn) throw new Error('GRN not found.');
  if (grn.status !== 'received') return null;

  const accounts = await getAccounts(grn.company_id);
  const inventoryAccount = findAccount(accounts, '1310');
  const grniAccount = findAccount(accounts, '2120');

  if (!inventoryAccount || !grniAccount) {
    throw new Error('Ledger accounts (Inventory Asset / GRNI) not found.');
  }

  let totalValuation = 0;
  (grn.items || []).forEach((item) => {
    totalValuation += Number(item.total_cost) || (Number(item.received_quantity) * Number(item.unit_cost));
  });
  totalValuation = Math.round(totalValuation * 100) / 100;

  if (totalValuation <= 0) return null;

  const lines = [
    {
      accountId: inventoryAccount.id,
      debit: totalValuation,
      credit: 0,
      description: `Inward stock valuation for GRN #${grn.grn_number}`
    },
    {
      accountId: grniAccount.id,
      debit: 0,
      credit: totalValuation,
      description: `GRNI clearing accrual for GRN #${grn.grn_number}`,
      entityType: 'vendor',
      entityId: grn.vendor_id
    }
  ];

  return await createManualJournal({
    companyId: grn.company_id,
    entryDate: grn.receipt_date || new Date().toISOString().split('T')[0],
    referenceNumber: grn.grn_number,
    narration: `Goods Receipt Note stock inward #${grn.grn_number}`,
    lines,
    entryType: 'grn',
    sourceModule: 'goods_receipt',
    sourceId: grn.id,
    userId
  });
}

/**
 * 7. Post Stock Adjustment Journal (Gain / Loss / Capital)
 */
export async function postStockAdjustmentJournal(adjustmentId, userId = null) {
  if (!isSupabaseConfigured || !adjustmentId) return null;

  const { data: existing } = await supabase
    .from('journal_entries')
    .select('id, journal_number')
    .eq('source_module', 'stock_adjustment')
    .eq('source_id', adjustmentId)
    .eq('entry_type', 'inventory_adjustment')
    .maybeSingle();

  if (existing) return existing;

  const { data: adj, error } = await supabase
    .from('stock_adjustments')
    .select(`
      *,
      items:stock_adjustment_items(*)
    `)
    .eq('id', adjustmentId)
    .single();

  if (error || !adj) throw new Error('Stock adjustment not found.');
  if (adj.status !== 'approved') return null;

  const accounts = await getAccounts(adj.company_id);
  const inventoryAccount = findAccount(accounts, '1310');
  const gainAccount = findAccount(accounts, '4920'); // Adjustment Gain
  const capitalAccount = findAccount(accounts, '3110'); // Owner Capital for opening stock
  const shrinkageAccount = findAccount(accounts, '5210'); // Shrinkage Loss
  const damageAccount = findAccount(accounts, '5220'); // Damage Loss
  const theftAccount = findAccount(accounts, '5230'); // Theft Loss
  const writeoffAccount = findAccount(accounts, '5240'); // General Write-off

  if (!inventoryAccount) throw new Error('Inventory Asset ledger not found.');

  let totalValuation = 0;
  (adj.items || []).forEach((item) => {
    totalValuation += Number(item.total_cost) || 0;
  });
  totalValuation = Math.round(totalValuation * 100) / 100;

  if (totalValuation <= 0) return null;

  const isPositive = adj.adjustment_type === 'increase';
  const lines = [];

  if (isPositive) {
    const isOpening = adj.reason === 'opening_stock';
    const creditAccount = isOpening ? (capitalAccount || gainAccount) : (gainAccount || capitalAccount);

    lines.push({
      accountId: inventoryAccount.id,
      debit: totalValuation,
      credit: 0,
      description: `Stock increase adjustment (${adj.reason})`
    });
    lines.push({
      accountId: creditAccount.id,
      debit: 0,
      credit: totalValuation,
      description: isOpening ? 'Opening stock equity recognition' : `Inventory surplus gain (${adj.reason})`
    });
  } else {
    // Negative adjustment
    let debitAccount = shrinkageAccount;
    if (adj.reason === 'damage' || adj.reason === 'expired') {
      debitAccount = damageAccount || shrinkageAccount;
    } else if (adj.reason === 'theft') {
      debitAccount = theftAccount || shrinkageAccount;
    } else if (adj.reason === 'internal_use') {
      debitAccount = writeoffAccount || shrinkageAccount;
    }

    lines.push({
      accountId: debitAccount.id,
      debit: totalValuation,
      credit: 0,
      description: `Inventory loss adjustment (${adj.reason})`
    });
    lines.push({
      accountId: inventoryAccount.id,
      debit: 0,
      credit: totalValuation,
      description: `Stock reduction adjustment (${adj.reason})`
    });
  }

  return await createManualJournal({
    companyId: adj.company_id,
    entryDate: adj.adjustment_date || new Date().toISOString().split('T')[0],
    referenceNumber: adj.adjustment_number,
    narration: `Stock adjustment #${adj.adjustment_number} (${adj.adjustment_type} - ${adj.reason})`,
    lines,
    entryType: 'inventory_adjustment',
    sourceModule: 'stock_adjustment',
    sourceId: adj.id,
    userId
  });
}

/**
 * 8. Post Operational Expense Journal
 */
export async function postExpenseJournal(expenseId, userId = null) {
  if (!isSupabaseConfigured || !expenseId) return null;

  const { data: existing } = await supabase
    .from('journal_entries')
    .select('id, journal_number')
    .eq('source_module', 'expense')
    .eq('source_id', expenseId)
    .eq('entry_type', 'expense')
    .maybeSingle();

  if (existing) return existing;

  const { data: exp, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', expenseId)
    .single();

  if (error || !exp) throw new Error('Expense record not found.');
  if (exp.status === 'cancelled') return null;

  const accounts = await getAccounts(exp.company_id);
  const targetCode = EXPENSE_CATEGORY_CODE_MAP[exp.category] || '6190';
  const expenseAccount = findAccount(accounts, targetCode) || findAccount(accounts, '6190');
  const cashAccount = findAccount(accounts, '1110');
  const bankAccount = findAccount(accounts, '1120');
  const inputCgstAccount = findAccount(accounts, '1410');
  const inputSgstAccount = findAccount(accounts, '1420');

  const isCash = exp.payment_method === 'cash';
  const creditAccount = isCash ? (cashAccount || bankAccount) : (bankAccount || cashAccount);

  if (!expenseAccount || !creditAccount) {
    throw new Error('Ledger accounts (Expense/Cash/Bank) not found.');
  }

  const netAmount = Number(exp.amount) || 0;
  const taxAmount = Number(exp.tax_amount) || 0;
  const totalAmount = Number(exp.total_amount) || (netAmount + taxAmount);

  const lines = [];

  // Dr Expense
  lines.push({
    accountId: expenseAccount.id,
    debit: netAmount,
    credit: 0,
    description: `Expense: ${exp.category} (${exp.payee_name})`
  });

  // Dr Input GST (if tax captured)
  if (taxAmount > 0) {
    const halfTax = Math.round((taxAmount / 2) * 100) / 100;
    const otherHalf = Math.round((taxAmount - halfTax) * 100) / 100;

    if (inputCgstAccount) {
      lines.push({
        accountId: inputCgstAccount.id,
        debit: halfTax,
        credit: 0,
        description: `Input CGST on Expense #${exp.expense_number}`
      });
    }
    if (inputSgstAccount) {
      lines.push({
        accountId: inputSgstAccount.id,
        debit: otherHalf,
        credit: 0,
        description: `Input SGST on Expense #${exp.expense_number}`
      });
    }
  }

  // Cr Cash/Bank
  lines.push({
    accountId: creditAccount.id,
    debit: 0,
    credit: totalAmount,
    description: `Payment for Expense #${exp.expense_number} (${exp.payment_method})`
  });

  return await createManualJournal({
    companyId: exp.company_id,
    entryDate: exp.expense_date || new Date().toISOString().split('T')[0],
    referenceNumber: exp.expense_number,
    narration: `Operational expense #${exp.expense_number} - ${exp.category} (${exp.payee_name})`,
    lines,
    entryType: 'expense',
    sourceModule: 'expense',
    sourceId: exp.id,
    userId
  });
}

/**
 * 9. Controlled Opening Balance Journal
 */
export async function postOpeningBalanceJournal({
  companyId,
  asOfDate,
  accountsWithBalances = [],
  userId = null
}) {
  if (!isSupabaseConfigured || !companyId) throw new Error('Missing company ID');

  const lines = accountsWithBalances
    .filter((a) => (Number(a.debit) || 0) > 0 || (Number(a.credit) || 0) > 0)
    .map((a) => ({
      accountId: a.accountId,
      debit: Math.round((Number(a.debit) || 0) * 100) / 100,
      credit: Math.round((Number(a.credit) || 0) * 100) / 100,
      description: a.description || 'Opening balance recognition'
    }));

  if (lines.length < 2) {
    throw new Error('Opening balance requires at least 2 balanced ledger accounts.');
  }

  return await createManualJournal({
    companyId,
    entryDate: asOfDate || new Date().toISOString().split('T')[0],
    referenceNumber: `OPN-${companyId.slice(0, 6)}`,
    narration: `Official accounting go-live opening balance journal`,
    lines,
    entryType: 'opening',
    sourceModule: 'opening_balance',
    sourceId: null,
    userId
  });
}

/**
 * 10. Post Sales Credit Note Journal (Reverse Revenue, Output GST, AR, and COGS/Inventory for returns)
 */
export async function postCreditNoteJournal(creditNoteId, userId = null) {
  if (!isSupabaseConfigured || !creditNoteId) return null;

  // Check idempotency
  const { data: existing } = await supabase
    .from('journal_entries')
    .select('id, journal_number')
    .eq('source_module', 'credit_note')
    .eq('source_id', creditNoteId)
    .maybeSingle();

  if (existing) return existing;

  const { data: cn, error: cnErr } = await supabase
    .from('credit_notes')
    .select(`
      *,
      items:credit_note_items(*)
    `)
    .eq('id', creditNoteId)
    .single();

  if (cnErr || !cn) throw new Error('Credit Note not found for GL posting.');
  if (cn.status === 'draft') return null;

  const accounts = await getAccounts(cn.company_id);
  const arAccount = findAccount(accounts, '1200') || findAccount(accounts, '1210');
  const serviceRevAccount = findAccount(accounts, '4100') || findAccount(accounts, '4110');
  const productRevAccount = findAccount(accounts, '4300') || findAccount(accounts, '4310');
  const outputCgstAccount = findAccount(accounts, '2210');
  const outputSgstAccount = findAccount(accounts, '2220');
  const outputIgstAccount = findAccount(accounts, '2230');
  const invAccount = findAccount(accounts, '1300') || findAccount(accounts, '1310');
  const cogsAccount = findAccount(accounts, '5100') || findAccount(accounts, '5110');

  if (!arAccount) throw new Error('Accounts Receivable GL account not found.');

  const lines = [];

  // Partition items into service vs product
  let serviceTaxable = 0;
  let productTaxable = 0;

  (cn.items || []).forEach((item) => {
    if (item.product_id) {
      productTaxable += Number(item.taxable_amount) || 0;
    } else {
      serviceTaxable += Number(item.taxable_amount) || 0;
    }
  });

  // Reversal of Revenue (Debit Revenue)
  if (serviceTaxable > 0 && serviceRevAccount) {
    lines.push({
      accountId: serviceRevAccount.id,
      debit: Math.round(serviceTaxable * 100) / 100,
      credit: 0,
      description: `Sales Return / Credit Note - Service: ${cn.credit_note_number}`
    });
  }

  if (productTaxable > 0 && productRevAccount) {
    lines.push({
      accountId: productRevAccount.id,
      debit: Math.round(productTaxable * 100) / 100,
      credit: 0,
      description: `Sales Return / Credit Note - Products: ${cn.credit_note_number}`
    });
  }

  // Fallback if no specific split
  if (lines.length === 0 && Number(cn.taxable_amount) > 0) {
    const revAccount = serviceRevAccount || productRevAccount;
    if (revAccount) {
      lines.push({
        accountId: revAccount.id,
        debit: Math.round(Number(cn.taxable_amount) * 100) / 100,
        credit: 0,
        description: `Sales Credit Note taxable reversal: ${cn.credit_note_number}`
      });
    }
  }

  // Reversal of Output GST (Debit Output GST)
  if (Number(cn.cgst_amount) > 0 && outputCgstAccount) {
    lines.push({
      accountId: outputCgstAccount.id,
      debit: Math.round(Number(cn.cgst_amount) * 100) / 100,
      credit: 0,
      description: `Credit Note Output CGST reversal: ${cn.credit_note_number}`
    });
  }
  if (Number(cn.sgst_amount) > 0 && outputSgstAccount) {
    lines.push({
      accountId: outputSgstAccount.id,
      debit: Math.round(Number(cn.sgst_amount) * 100) / 100,
      credit: 0,
      description: `Credit Note Output SGST reversal: ${cn.credit_note_number}`
    });
  }
  if (Number(cn.igst_amount) > 0 && outputIgstAccount) {
    lines.push({
      accountId: outputIgstAccount.id,
      debit: Math.round(Number(cn.igst_amount) * 100) / 100,
      credit: 0,
      description: `Credit Note Output IGST reversal: ${cn.credit_note_number}`
    });
  }

  // Reversal of AR (Credit AR for total credit note amount)
  const totalCredited = Math.round(Number(cn.total_amount) * 100) / 100;
  lines.push({
    accountId: arAccount.id,
    debit: 0,
    credit: totalCredited,
    description: `Credit Note AR reduction: ${cn.credit_note_number}`
  });

  // Calculate COGS / Inventory reversal for returned physical products
  let totalCogsReversal = 0;
  (cn.items || []).forEach((item) => {
    if (item.product_id && (Number(item.quantity) || 0) > 0) {
      // Estimated at cost (or 60% standard margin if movement unavailable)
      const unitCost = Number(item.unit_price) * 0.7; // Authoritative default ratio
      totalCogsReversal += Math.round(unitCost * Number(item.quantity) * 100) / 100;
    }
  });

  if (totalCogsReversal > 0 && invAccount && cogsAccount) {
    lines.push({
      accountId: invAccount.id,
      debit: totalCogsReversal,
      credit: 0,
      description: `Inventory restoration on Sales Return: ${cn.credit_note_number}`
    });
    lines.push({
      accountId: cogsAccount.id,
      debit: 0,
      credit: totalCogsReversal,
      description: `COGS reversal on Sales Return: ${cn.credit_note_number}`
    });
  }

  return await createManualJournal({
    companyId: cn.company_id,
    entryDate: cn.credit_note_date,
    referenceNumber: cn.credit_note_number,
    narration: `Credit Note #${cn.credit_note_number} against Invoice #${cn.invoice_id}`,
    lines,
    entryType: 'credit_note',
    sourceModule: 'credit_note',
    sourceId: cn.id,
    userId
  });
}

/**
 * 11. Post Purchase Debit Note Journal (Reduce AP, Input GST, and Expense/Inventory)
 */
export async function postDebitNoteJournal(debitNoteId, userId = null) {
  if (!isSupabaseConfigured || !debitNoteId) return null;

  const { data: existing } = await supabase
    .from('journal_entries')
    .select('id, journal_number')
    .eq('source_module', 'debit_note')
    .eq('source_id', debitNoteId)
    .maybeSingle();

  if (existing) return existing;

  const { data: dn, error: dnErr } = await supabase
    .from('debit_notes')
    .select(`
      *,
      items:debit_note_items(*)
    `)
    .eq('id', debitNoteId)
    .single();

  if (dnErr || !dn) throw new Error('Debit Note not found for GL posting.');
  if (dn.status === 'draft') return null;

  const accounts = await getAccounts(dn.company_id);
  const apAccount = findAccount(accounts, '2100') || findAccount(accounts, '2110');
  const expAccount = findAccount(accounts, '6900') || findAccount(accounts, '6190');
  const inputCgstAccount = findAccount(accounts, '1410');
  const inputSgstAccount = findAccount(accounts, '1420');
  const inputIgstAccount = findAccount(accounts, '1430');

  if (!apAccount) throw new Error('Accounts Payable GL account not found.');

  const lines = [];

  // Debit AP (Reduction of liability)
  lines.push({
    accountId: apAccount.id,
    debit: Math.round(Number(dn.total_amount) * 100) / 100,
    credit: 0,
    description: `Debit Note AP liability reduction: ${dn.debit_note_number}`
  });

  // Credit Expense/Purchase (Reduction of cost)
  if (Number(dn.taxable_amount) > 0 && expAccount) {
    lines.push({
      accountId: expAccount.id,
      debit: 0,
      credit: Math.round(Number(dn.taxable_amount) * 100) / 100,
      description: `Purchase Return / Debit Note cost reduction: ${dn.debit_note_number}`
    });
  }

  // Credit Input GST (Reduction of claimable ITC)
  if (Number(dn.cgst_amount) > 0 && inputCgstAccount) {
    lines.push({
      accountId: inputCgstAccount.id,
      debit: 0,
      credit: Math.round(Number(dn.cgst_amount) * 100) / 100,
      description: `Debit Note Input CGST reversal: ${dn.debit_note_number}`
    });
  }
  if (Number(dn.sgst_amount) > 0 && inputSgstAccount) {
    lines.push({
      accountId: inputSgstAccount.id,
      debit: 0,
      credit: Math.round(Number(dn.sgst_amount) * 100) / 100,
      description: `Debit Note Input SGST reversal: ${dn.debit_note_number}`
    });
  }
  if (Number(dn.igst_amount) > 0 && inputIgstAccount) {
    lines.push({
      accountId: inputIgstAccount.id,
      debit: 0,
      credit: Math.round(Number(dn.igst_amount) * 100) / 100,
      description: `Debit Note Input IGST reversal: ${dn.debit_note_number}`
    });
  }

  return await createManualJournal({
    companyId: dn.company_id,
    entryDate: dn.debit_note_date,
    referenceNumber: dn.debit_note_number,
    narration: `Debit Note #${dn.debit_note_number} against Bill #${dn.purchase_bill_id}`,
    lines,
    entryType: 'debit_note',
    sourceModule: 'debit_note',
    sourceId: dn.id,
    userId
  });
}

/**
 * 12. Post Customer Advance Receipt Journal (Debit Cash/Bank, Credit Customer Advance Liability)
 */
export async function postCustomerAdvanceJournal(advanceId, userId = null) {
  if (!isSupabaseConfigured || !advanceId) return null;

  const { data: existing } = await supabase
    .from('journal_entries')
    .select('id, journal_number')
    .eq('source_module', 'customer_advance')
    .eq('source_id', advanceId)
    .maybeSingle();

  if (existing) return existing;

  const { data: adv, error: advErr } = await supabase
    .from('customer_advances')
    .select('*')
    .eq('id', advanceId)
    .single();

  if (advErr || !adv) throw new Error('Customer Advance record not found.');

  const accounts = await getAccounts(adv.company_id);
  const bankAccount = findAccount(accounts, '1120') || findAccount(accounts, '1110');
  const advanceLiabilityAccount = findAccount(accounts, '2300') || findAccount(accounts, '2400');

  if (!bankAccount || !advanceLiabilityAccount) {
    throw new Error('Bank or Customer Advance GL account not found.');
  }

  const amount = Math.round(Number(adv.amount) * 100) / 100;
  const lines = [
    {
      accountId: bankAccount.id,
      debit: amount,
      credit: 0,
      description: `Customer advance receipt (${adv.payment_mode}): ${adv.advance_number}`
    },
    {
      accountId: advanceLiabilityAccount.id,
      debit: 0,
      credit: amount,
      description: `Customer unearned advance liability: ${adv.advance_number}`
    }
  ];

  return await createManualJournal({
    companyId: adv.company_id,
    entryDate: adv.receipt_date,
    referenceNumber: adv.advance_number,
    narration: `Customer advance receipt #${adv.advance_number} via ${adv.payment_mode}`,
    lines,
    entryType: 'customer_advance',
    sourceModule: 'customer_advance',
    sourceId: adv.id,
    userId
  });
}

/**
 * 13. Post Customer Advance Allocation Journal (Debit Customer Advance Liability, Credit AR)
 */
export async function postCustomerAdvanceAllocationJournal(allocationId, userId = null) {
  if (!isSupabaseConfigured || !allocationId) return null;

  const { data: existing } = await supabase
    .from('journal_entries')
    .select('id, journal_number')
    .eq('source_module', 'advance_allocation')
    .eq('source_id', allocationId)
    .maybeSingle();

  if (existing) return existing;

  const { data: alloc, error: allocErr } = await supabase
    .from('customer_advance_allocations')
    .select(`
      *,
      advance:customer_advances(*)
    `)
    .eq('id', allocationId)
    .single();

  if (allocErr || !alloc) throw new Error('Advance allocation record not found.');

  const accounts = await getAccounts(alloc.company_id);
  const arAccount = findAccount(accounts, '1200') || findAccount(accounts, '1210');
  const advanceLiabilityAccount = findAccount(accounts, '2300') || findAccount(accounts, '2400');

  if (!arAccount || !advanceLiabilityAccount) {
    throw new Error('AR or Customer Advance GL account not found.');
  }

  const amount = Math.round(Number(alloc.allocated_amount) * 100) / 100;
  const lines = [
    {
      accountId: advanceLiabilityAccount.id,
      debit: amount,
      credit: 0,
      description: `Customer advance allocated: ${alloc.advance?.advance_number || ''}`
    },
    {
      accountId: arAccount.id,
      debit: 0,
      credit: amount,
      description: `AR clearance from customer advance`
    }
  ];

  return await createManualJournal({
    companyId: alloc.company_id,
    entryDate: alloc.allocation_date,
    referenceNumber: `ALLOC-${allocationId.slice(0, 8)}`,
    narration: `Customer advance allocation against invoice #${alloc.invoice_id}`,
    lines,
    entryType: 'allocation',
    sourceModule: 'advance_allocation',
    sourceId: alloc.id,
    userId
  });
}

/**
 * 14. Post Vendor Advance Disbursement Journal (Debit Vendor Advance Asset, Credit Cash/Bank)
 */
export async function postVendorAdvanceJournal(advanceId, userId = null) {
  if (!isSupabaseConfigured || !advanceId) return null;

  const { data: existing } = await supabase
    .from('journal_entries')
    .select('id, journal_number')
    .eq('source_module', 'vendor_advance')
    .eq('source_id', advanceId)
    .maybeSingle();

  if (existing) return existing;

  const { data: adv, error: advErr } = await supabase
    .from('vendor_advances')
    .select('*')
    .eq('id', advanceId)
    .single();

  if (advErr || !adv) throw new Error('Vendor advance record not found.');

  const accounts = await getAccounts(adv.company_id);
  const bankAccount = findAccount(accounts, '1120') || findAccount(accounts, '1110');
  const advanceAssetAccount = findAccount(accounts, '1500') || findAccount(accounts, '1510');

  if (!bankAccount || !advanceAssetAccount) {
    throw new Error('Bank or Vendor Advance GL account not found.');
  }

  const amount = Math.round(Number(adv.amount) * 100) / 100;
  const lines = [
    {
      accountId: advanceAssetAccount.id,
      debit: amount,
      credit: 0,
      description: `Vendor advance disbursement: ${adv.advance_number}`
    },
    {
      accountId: bankAccount.id,
      debit: 0,
      credit: amount,
      description: `Bank disbursement for vendor advance (${adv.payment_mode})`
    }
  ];

  return await createManualJournal({
    companyId: adv.company_id,
    entryDate: adv.disbursement_date,
    referenceNumber: adv.advance_number,
    narration: `Vendor advance disbursement #${adv.advance_number} via ${adv.payment_mode}`,
    lines,
    entryType: 'vendor_advance',
    sourceModule: 'vendor_advance',
    sourceId: adv.id,
    userId
  });
}

/**
 * 15. Post Vendor Advance Allocation Journal (Debit Accounts Payable, Credit Vendor Advance Asset)
 */
export async function postVendorAdvanceAllocationJournal(allocationId, userId = null) {
  if (!isSupabaseConfigured || !allocationId) return null;

  const { data: existing } = await supabase
    .from('journal_entries')
    .select('id, journal_number')
    .eq('source_module', 'vendor_advance_allocation')
    .eq('source_id', allocationId)
    .maybeSingle();

  if (existing) return existing;

  const { data: alloc, error: allocErr } = await supabase
    .from('vendor_advance_allocations')
    .select(`
      *,
      advance:vendor_advances(*)
    `)
    .eq('id', allocationId)
    .single();

  if (allocErr || !alloc) throw new Error('Vendor advance allocation not found.');

  const accounts = await getAccounts(alloc.company_id);
  const apAccount = findAccount(accounts, '2100') || findAccount(accounts, '2110');
  const advanceAssetAccount = findAccount(accounts, '1500') || findAccount(accounts, '1510');

  if (!apAccount || !advanceAssetAccount) {
    throw new Error('AP or Vendor Advance GL account not found.');
  }

  const amount = Math.round(Number(alloc.allocated_amount) * 100) / 100;
  const lines = [
    {
      accountId: apAccount.id,
      debit: amount,
      credit: 0,
      description: `AP reduction from vendor advance: ${alloc.advance?.advance_number || ''}`
    },
    {
      accountId: advanceAssetAccount.id,
      debit: 0,
      credit: amount,
      description: `Vendor advance asset reduction`
    }
  ];

  return await createManualJournal({
    companyId: alloc.company_id,
    entryDate: alloc.allocation_date,
    referenceNumber: `VALLOC-${allocationId.slice(0, 8)}`,
    narration: `Vendor advance allocation against supplier bill #${alloc.purchase_bill_id}`,
    lines,
    entryType: 'allocation',
    sourceModule: 'vendor_advance_allocation',
    sourceId: alloc.id,
    userId
  });
}

/**
 * 16. Post Bank Adjustment Journal (Charges, Interest, or Clearing Adjustments)
 */
export async function postBankAdjustmentJournal({
  companyId,
  amount,
  type = 'charges', // 'charges' | 'interest'
  description = '',
  referenceNumber = '',
  entryDate = null,
  userId = null
}) {
  if (!isSupabaseConfigured || !companyId) throw new Error('Missing company ID');

  const accounts = await getAccounts(companyId);
  const bankAccount = findAccount(accounts, '1120') || findAccount(accounts, '1110');
  const chargesAccount = findAccount(accounts, '6800') || findAccount(accounts, '6190');
  const interestIncomeAccount = findAccount(accounts, '4900') || findAccount(accounts, '4190');

  const adjAmount = Math.round(Number(amount) * 100) / 100;
  if (adjAmount <= 0) throw new Error('Adjustment amount must be positive');

  let lines = [];
  if (type === 'charges') {
    lines = [
      {
        accountId: chargesAccount.id,
        debit: adjAmount,
        credit: 0,
        description: description || 'Bank service charges & processing fee'
      },
      {
        accountId: bankAccount.id,
        debit: 0,
        credit: adjAmount,
        description: 'Bank balance debit for charges'
      }
    ];
  } else {
    // Interest credited
    lines = [
      {
        accountId: bankAccount.id,
        debit: adjAmount,
        credit: 0,
        description: 'Bank balance credit for interest'
      },
      {
        accountId: interestIncomeAccount.id,
        debit: 0,
        credit: adjAmount,
        description: description || 'Bank interest income'
      }
    ];
  }

  return await createManualJournal({
    companyId,
    entryDate: entryDate || new Date().toISOString().split('T')[0],
    referenceNumber: referenceNumber || `BADJ-${Date.now().toString().slice(-6)}`,
    narration: `Bank reconciliation adjustment: ${description}`,
    lines,
    entryType: 'manual',
    sourceModule: 'bank_reconciliation',
    sourceId: null,
    userId
  });
}
