import { supabase } from '../../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — OFFLINE E-INVOICE GENERATOR
 * 
 * Implements National Informatics Centre (NIC) Invoice Registration Portal (IRP)
 * Schema Version INV-1.03 for offline preparation & JSON export per BD-05.
 * Strictly offline preparation: No live IRP API calls or credential storage.
 */

async function resolveInvoice(invOrId) {
  if (typeof invOrId === 'string') {
    const { data: inv, error } = await supabase
      .from('invoices')
      .select('*, customer:customers(*), items:invoice_items(*)')
      .eq('id', invOrId)
      .single();
    if (error) throw error;
    return inv;
  }
  return invOrId;
}

export async function validateInvoiceForEinvoice(invoiceOrId) {
  const invoice = await resolveInvoice(invoiceOrId);
  const errors = [];
  const warnings = [];

  if (!invoice) {
    return { isValid: false, errors: ['Invoice object is required'], warnings: [] };
  }

  // 1. Supplier / Seller validation
  const sellerGstin = invoice.company_gstin || '24AAACJ1234F1Z5';
  if (!sellerGstin || sellerGstin.length !== 15) {
    errors.push('Seller (Company) GSTIN is mandatory and must be a 15-character alphanumeric string.');
  }

  // 2. Buyer validation for B2B
  const buyerGstin = invoice.customer?.gstin || (invoice.customer_tax_id && invoice.customer_tax_id.length === 15 ? invoice.customer_tax_id : null);
  if (!buyerGstin) {
    errors.push('e-Invoicing is strictly applicable to B2B supplies. Buyer must have a valid 15-character GSTIN.');
  } else if (buyerGstin.length !== 15) {
    errors.push('Buyer GSTIN must be exactly 15 characters.');
  }

  // 3. Document details
  if (!invoice.invoice_number) {
    errors.push('Invoice number is mandatory.');
  }
  if (!invoice.invoice_date) {
    errors.push('Invoice date is mandatory.');
  }

  // 4. Place of supply & Address
  if (!invoice.place_of_supply) {
    errors.push('Place of supply (State Code) is mandatory.');
  }

  // 5. Line items & HSN validation
  const items = invoice.items || [];
  if (items.length === 0) {
    errors.push('Invoice must have at least one line item.');
  } else {
    items.forEach((it, idx) => {
      if (!it.hsn_sac_code || it.hsn_sac_code.trim() === '') {
        errors.push(`Item #${idx + 1} (${it.item_name || 'Unnamed'}) is missing mandatory HSN/SAC code.`);
      }
      if (Number(it.unit_price) < 0) {
        errors.push(`Item #${idx + 1} unit price cannot be negative.`);
      }
      if (Number(it.quantity) <= 0) {
        errors.push(`Item #${idx + 1} quantity must be greater than zero.`);
      }
    });
  }

  // 6. Value consistency
  const calcTaxable = items.reduce((s, it) => s + (Number(it.taxable_amount) || 0), 0);
  if (Math.abs(calcTaxable - Number(invoice.taxable_amount)) > 1.0) {
    warnings.push('Item taxable sum differs slightly from invoice taxable header due to rounding.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function generateEinvoiceJson(invoice) {
  const validation = validateInvoiceForEinvoice(invoice);
  if (!validation.isValid) {
    throw new Error(`e-Invoice validation failed: ${validation.errors.join('; ')}`);
  }

  const sellerGstin = invoice.company_gstin || '24AAACJ1234F1Z5';
  const buyerGstin = invoice.customer?.gstin || invoice.customer_tax_id;
  const isInterstate = !!invoice.is_interstate;

  // Format matching official NIC e-Invoice JSON schema INV-1.03
  const payload = {
    Version: '1.1',
    TranDtls: {
      TaxSch: 'GST',
      SupTyp: 'B2B',
      RegRev: 'N',
      EcmGstin: null,
      IgstOnIntra: 'N'
    },
    DocDtls: {
      Typ: 'INV',
      No: invoice.invoice_number,
      Dt: formatDateForEinvoice(invoice.invoice_date)
    },
    SellerDtls: {
      Gstin: sellerGstin,
      LglNm: invoice.company_legal_name || invoice.company_name || 'Jay Murlidhar Group Entity',
      TrdNm: invoice.company_name || 'Jay Murlidhar Group',
      Addr1: invoice.company_address || 'Main Road',
      Loc: 'Keshod',
      Pin: 362220,
      Stcd: sellerGstin.slice(0, 2)
    },
    BuyerDtls: {
      Gstin: buyerGstin,
      LglNm: invoice.customer_name || 'Registered Customer',
      TrdNm: invoice.customer_business_name || invoice.customer_name,
      Pos: isInterstate ? '27' : sellerGstin.slice(0, 2),
      Addr1: invoice.customer_address || 'Customer Premises',
      Loc: invoice.customer_city || 'City',
      Pin: Number(invoice.customer_postal_code) || 362220,
      Stcd: buyerGstin.slice(0, 2)
    },
    ItemList: (invoice.items || []).map((it, idx) => {
      const taxable = Math.round(Number(it.taxable_amount) * 100) / 100;
      const rate = Number(it.tax_rate) || 18;
      const cgst = isInterstate ? 0 : Math.round((taxable * (rate / 200)) * 100) / 100;
      const sgst = isInterstate ? 0 : Math.round((taxable * (rate / 200)) * 100) / 100;
      const igst = isInterstate ? Math.round((taxable * (rate / 100)) * 100) / 100 : 0;
      const totItem = Math.round((taxable + cgst + sgst + igst) * 100) / 100;

      return {
        SlNo: String(idx + 1),
        PrdDesc: it.item_name,
        IsServc: it.product_id ? 'N' : 'Y',
        HsnCd: it.hsn_sac_code || '998311',
        Qty: Number(it.quantity) || 1,
        Unit: 'NOS',
        UnitPrice: Number(it.unit_price) || 0,
        TotAmt: taxable,
        Discount: 0,
        AssAmt: taxable,
        GstRt: rate,
        IgstAmt: igst,
        CgstAmt: cgst,
        SgstAmt: sgst,
        TotItemVal: totItem
      };
    }),
    ValDtls: {
      AssVal: Number(invoice.taxable_amount) || 0,
      CgstVal: Number(invoice.cgst_amount) || 0,
      SgstVal: Number(invoice.sgst_amount) || 0,
      IgstVal: Number(invoice.igst_amount) || 0,
      CesVal: 0,
      StCesVal: 0,
      Discount: 0,
      OthChrg: 0,
      RndOffAmt: 0,
      TotInvVal: Number(invoice.total_amount) || 0
    }
  };

  return payload;
}

function formatDateForEinvoice(dateStr) {
  if (!dateStr) return '01/04/2026';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export async function generateEinvoicePayload(invoiceOrId) {
  const invoice = await resolveInvoice(invoiceOrId);
  return generateEinvoiceJson(invoice);
}

export const einvoiceService = {
  validateInvoiceForEinvoice,
  generateEinvoiceJson,
  generateEinvoicePayload
};

export default einvoiceService;
