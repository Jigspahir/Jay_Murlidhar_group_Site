import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — GST COMPLIANCE & STATUTORY SERVICE
 * 
 * Prepares GSTR-1 and GSTR-3B offline return worksheets derived from
 * actual posted invoices, credit notes, purchase bills, and debit notes.
 */

export async function getGstr1Data({ companyId, startDate, endDate } = {}) {
  if (!isSupabaseConfigured || !companyId) {
    return {
      b2bInvoices: [],
      b2cLarge: [],
      b2cSmall: [],
      creditDebitNotes: [],
      hsnSummary: [],
      summaryTotals: { taxable: 0, cgst: 0, sgst: 0, igst: 0, totalTax: 0, invoiceTotal: 0 }
    };
  }

  // 1. Fetch Invoices for Company in Date Range
  let invQuery = supabase
    .from('invoices')
    .select(`
      *,
      customer:customers(id, display_name, gstin, gst_registration_type, state),
      items:invoice_items(*)
    `)
    .eq('company_id', companyId)
    .neq('status', 'draft')
    .neq('status', 'cancelled');

  if (startDate) invQuery = invQuery.gte('invoice_date', startDate);
  if (endDate) invQuery = invQuery.lte('invoice_date', endDate);

  const { data: invoices, error: invErr } = await invQuery;
  if (invErr) throw invErr;

  // 2. Fetch Credit Notes for Company in Date Range
  let cnQuery = supabase
    .from('credit_notes')
    .select(`
      *,
      customer:customers(id, display_name, gstin),
      invoice:invoices(id, invoice_number, invoice_date)
    `)
    .eq('company_id', companyId)
    .neq('status', 'draft')
    .neq('status', 'cancelled');

  if (startDate) cnQuery = cnQuery.gte('credit_note_date', startDate);
  if (endDate) cnQuery = cnQuery.lte('credit_note_date', endDate);

  const { data: creditNotes } = await cnQuery;

  const b2bInvoices = [];
  const b2cLarge = [];
  const b2cSmall = [];
  const hsnMap = {};

  let totTaxable = 0;
  let totCgst = 0;
  let totSgst = 0;
  let totIgst = 0;
  let totGrand = 0;

  (invoices || []).forEach((inv) => {
    const custGstin = inv.customer?.gstin || (inv.customer_tax_id && inv.customer_tax_id.length === 15 ? inv.customer_tax_id : null);
    const isB2b = !!custGstin;
    const isInterstate = !!inv.is_interstate;
    const totalVal = Number(inv.total_amount) || 0;

    totTaxable += Number(inv.taxable_amount) || 0;
    totCgst += Number(inv.cgst_amount) || 0;
    totSgst += Number(inv.sgst_amount) || 0;
    totIgst += Number(inv.igst_amount) || 0;
    totGrand += totalVal;

    const row = {
      id: inv.id,
      invoiceNumber: inv.invoice_number,
      invoiceDate: inv.invoice_date,
      customerName: inv.customer_name || inv.customer?.display_name,
      customerGstin: custGstin || 'URP',
      placeOfSupply: inv.place_of_supply || 'Gujarat',
      isInterstate,
      taxableAmount: Number(inv.taxable_amount) || 0,
      cgstAmount: Number(inv.cgst_amount) || 0,
      sgstAmount: Number(inv.sgst_amount) || 0,
      igstAmount: Number(inv.igst_amount) || 0,
      totalTax: Number(inv.total_tax_amount) || 0,
      totalAmount: totalVal
    };

    if (isB2b) {
      b2bInvoices.push(row);
    } else if (isInterstate && totalVal > 250000) {
      b2cLarge.push(row);
    } else {
      b2cSmall.push(row);
    }

    // Accumulate HSN
    (inv.items || []).forEach((it) => {
      const code = it.hsn_sac_code || 'OTHER';
      if (!hsnMap[code]) {
        hsnMap[code] = { hsn: code, description: it.item_name, qty: 0, taxable: 0, tax: 0, total: 0 };
      }
      hsnMap[code].qty += Number(it.quantity) || 0;
      hsnMap[code].taxable += Number(it.taxable_amount) || 0;
      hsnMap[code].tax += Number(it.tax_amount) || 0;
      hsnMap[code].total += Number(it.line_total) || 0;
    });
  });

  const cdnrRows = (creditNotes || []).map((cn) => ({
    id: cn.id,
    noteNumber: cn.credit_note_number,
    noteDate: cn.credit_note_date,
    originalInvoiceNumber: cn.invoice?.invoice_number,
    customerName: cn.customer?.display_name,
    customerGstin: cn.customer?.gstin || 'URP',
    type: 'C', // Credit Note
    taxableAmount: Number(cn.taxable_amount) || 0,
    cgstAmount: Number(cn.cgst_amount) || 0,
    sgstAmount: Number(cn.sgst_amount) || 0,
    igstAmount: Number(cn.igst_amount) || 0,
    totalAmount: Number(cn.total_amount) || 0
  }));

  return {
    b2bInvoices,
    b2cLarge,
    b2cSmall,
    creditDebitNotes: cdnrRows,
    hsnSummary: Object.values(hsnMap),
    summaryTotals: {
      taxable: Math.round(totTaxable * 100) / 100,
      cgst: Math.round(totCgst * 100) / 100,
      sgst: Math.round(totSgst * 100) / 100,
      igst: Math.round(totIgst * 100) / 100,
      totalTax: Math.round((totCgst + totSgst + totIgst) * 100) / 100,
      invoiceTotal: Math.round(totGrand * 100) / 100
    }
  };
}

export async function getGstr3bData({ companyId, startDate, endDate } = {}) {
  if (!isSupabaseConfigured || !companyId) {
    return {
      outwardTaxableSupplies: { taxable: 0, igst: 0, cgst: 0, sgst: 0 },
      eligibleItc: { igst: 0, cgst: 0, sgst: 0 },
      netTaxPayable: { igst: 0, cgst: 0, sgst: 0 }
    };
  }

  // 1. Fetch Outward Supplies (Invoices minus Credit Notes)
  const gstr1 = await getGstr1Data({ companyId, startDate, endDate });

  let outTaxable = gstr1.summaryTotals.taxable;
  let outCgst = gstr1.summaryTotals.cgst;
  let outSgst = gstr1.summaryTotals.sgst;
  let outIgst = gstr1.summaryTotals.igst;

  // Subtract credit notes from output liability
  (gstr1.creditDebitNotes || []).forEach((cn) => {
    outTaxable = Math.max(0, outTaxable - cn.taxableAmount);
    outCgst = Math.max(0, outCgst - cn.cgstAmount);
    outSgst = Math.max(0, outSgst - cn.sgstAmount);
    outIgst = Math.max(0, outIgst - cn.igstAmount);
  });

  // 2. Fetch Inward Supplies (Purchase Bills & Operational Expenses for Eligible ITC)
  let billQuery = supabase
    .from('purchase_bills')
    .select('taxable_amount, cgst_amount, sgst_amount, igst_amount')
    .eq('company_id', companyId)
    .neq('status', 'draft')
    .neq('status', 'cancelled');

  if (startDate) billQuery = billQuery.gte('bill_date', startDate);
  if (endDate) billQuery = billQuery.lte('bill_date', endDate);

  const { data: bills } = await billQuery;

  let itcCgst = 0;
  let itcSgst = 0;
  let itcIgst = 0;

  (bills || []).forEach((b) => {
    itcCgst += Number(b.cgst_amount) || 0;
    itcSgst += Number(b.sgst_amount) || 0;
    itcIgst += Number(b.igst_amount) || 0;
  });

  // 3. Compute Net Tax Payable
  const netCgst = Math.max(0, Math.round((outCgst - itcCgst) * 100) / 100);
  const netSgst = Math.max(0, Math.round((outSgst - itcSgst) * 100) / 100);
  const netIgst = Math.max(0, Math.round((outIgst - itcIgst) * 100) / 100);

  return {
    outwardTaxableSupplies: {
      taxable: Math.round(outTaxable * 100) / 100,
      cgst: Math.round(outCgst * 100) / 100,
      sgst: Math.round(outSgst * 100) / 100,
      igst: Math.round(outIgst * 100) / 100
    },
    eligibleItc: {
      cgst: Math.round(itcCgst * 100) / 100,
      sgst: Math.round(itcSgst * 100) / 100,
      igst: Math.round(itcIgst * 100) / 100
    },
    netTaxPayable: {
      cgst: netCgst,
      sgst: netSgst,
      igst: netIgst
    }
  };
}

export function exportGstr1JsonPayload(gstr1Data, companyGstin) {
  // Format matching Government GST Offline Tool
  return {
    gstin: companyGstin || '24AAACJ1234F1Z5',
    fp: new Date().toISOString().slice(5, 7) + new Date().getFullYear(),
    version: 'GSTR1_Offline_Tool_v1.0',
    b2b: gstr1Data.b2bInvoices.map((inv) => ({
      ctin: inv.customerGstin,
      inv: [
        {
          inum: inv.invoiceNumber,
          idt: inv.invoiceDate,
          val: inv.totalAmount,
          pos: inv.placeOfSupply.slice(0, 2),
          rchrg: 'N',
          inv_typ: 'R',
          itms: [
            {
              num: 1,
              itm_det: {
                txval: inv.taxableAmount,
                rt: 18,
                camt: inv.cgstAmount,
                samt: inv.sgstAmount,
                iamt: inv.igstAmount
              }
            }
          ]
        }
      ]
    })),
    b2cs: gstr1Data.b2cSmall.map((inv) => ({
      sply_ty: inv.isInterstate ? 'INTER' : 'INTRA',
      pos: inv.placeOfSupply.slice(0, 2),
      typ: 'OE',
      txval: inv.taxableAmount,
      rt: 18,
      camt: inv.cgstAmount,
      samt: inv.sgstAmount,
      iamt: inv.igstAmount
    })),
    cdnr: gstr1Data.creditDebitNotes.map((cn) => ({
      ctin: cn.customerGstin,
      nt: [
        {
          nt_num: cn.noteNumber,
          nt_dt: cn.noteDate,
          ntty: cn.type,
          inum: cn.originalInvoiceNumber || 'INV-001',
          idt: cn.noteDate,
          val: cn.totalAmount,
          itms: [
            {
              num: 1,
              itm_det: {
                txval: cn.taxableAmount,
                rt: 18,
                camt: cn.cgstAmount,
                samt: cn.sgstAmount,
                iamt: cn.igstAmount
              }
            }
          ]
        }
      ]
    }))
  };
}

export async function generateGSTR1(companyId, returnPeriod) {
  const [year, month] = (returnPeriod || '').split('-');
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  const startDate = `${year}-${month}-01`;
  const lastDay = new Date(y, m, 0).getDate();
  const endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

  const data = await getGstr1Data({ companyId, startDate, endDate });
  return {
    period: returnPeriod,
    summary: {
      totalTaxableAmount: data.summaryTotals.taxable,
      totalCGST: data.summaryTotals.cgst,
      totalSGST: data.summaryTotals.sgst,
      totalIGST: data.summaryTotals.igst,
      totalTaxAmount: data.summaryTotals.totalTax
    },
    sections: {
      b2b: data.b2bInvoices.map(b => ({
        invoice_id: b.id,
        invoice_number: b.invoiceNumber,
        invoice_date: b.invoiceDate,
        customer_gstin: b.customerGstin,
        customer_name: b.customerName,
        taxable_amount: b.taxableAmount,
        cgst_amount: b.cgstAmount,
        sgst_amount: b.sgstAmount,
        igst_amount: b.igstAmount,
        total_amount: b.totalAmount,
        place_of_supply: b.placeOfSupply
      })),
      b2cs: data.b2cSmall.concat(data.b2cLarge || []).map(b => ({
        invoice_id: b.id,
        invoice_number: b.invoiceNumber,
        invoice_date: b.invoiceDate,
        customer_name: b.customerName,
        taxable_amount: b.taxableAmount,
        cgst_amount: b.cgstAmount,
        sgst_amount: b.sgstAmount,
        igst_amount: b.igstAmount,
        total_amount: b.totalAmount,
        place_of_supply: b.placeOfSupply
      })),
      cdnr: data.creditDebitNotes.map(c => ({
        note_id: c.id,
        note_number: c.noteNumber,
        note_date: c.noteDate,
        original_invoice_number: c.originalInvoiceNumber,
        customer_gstin: c.customerGstin,
        customer_name: c.customerName,
        taxable_amount: c.taxableAmount,
        cgst_amount: c.cgstAmount,
        sgst_amount: c.sgstAmount,
        igst_amount: c.igstAmount,
        total_amount: c.totalAmount
      }))
    }
  };
}

export async function generateGSTR3B(companyId, returnPeriod) {
  const [year, month] = (returnPeriod || '').split('-');
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  const startDate = `${year}-${month}-01`;
  const lastDay = new Date(y, m, 0).getDate();
  const endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

  const data = await getGstr3bData({ companyId, startDate, endDate });
  return {
    period: returnPeriod,
    outwardSupplies: {
      taxableValue: data.outwardTaxableSupplies.taxable,
      igst: data.outwardTaxableSupplies.igst,
      cgst: data.outwardTaxableSupplies.cgst,
      sgst: data.outwardTaxableSupplies.sgst
    },
    eligibleITC: {
      igst: data.eligibleItc.allOtherItc.igst,
      cgst: data.eligibleItc.allOtherItc.cgst,
      sgst: data.eligibleItc.allOtherItc.sgst
    },
    totals: {
      totalOutputTax: data.netTaxPayable.total,
      totalITC: data.eligibleItc.allOtherItc.total,
      netPayable: Math.max(0, data.netTaxPayable.total - data.eligibleItc.allOtherItc.total)
    }
  };
}

export const exportGstr1Json = exportGstr1JsonPayload;

export const gstService = {
  getGstr1Data,
  getGstr3bData,
  exportGstr1Json,
  generateGSTR1,
  generateGSTR3B
};

export default gstService;
