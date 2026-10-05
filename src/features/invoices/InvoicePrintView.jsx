import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InvoicePrintView({ invoice }) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden during print) */}
      <div className="flex items-center justify-between print:hidden bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <Link
          to={`/admin/invoices/${invoice.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Invoice Details</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Invoice Sheet */}
      <div className="bg-white border border-slate-300 rounded-xl p-8 sm:p-12 shadow-sm max-w-[850px] mx-auto print:border-none print:shadow-none print:p-0 print:m-0 text-slate-800 font-sans">
        {/* Header: Company & Invoice Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-300 pb-6">
          <div>
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              {invoice.company_name}
            </div>
            {invoice.company_legal_name && invoice.company_legal_name !== invoice.company_name && (
              <div className="text-xs text-slate-500 font-medium">
                ({invoice.company_legal_name})
              </div>
            )}
            <div className="text-xs text-slate-600 mt-2 max-w-sm whitespace-pre-line leading-relaxed">
              {invoice.company_address || 'Registered Office, Jay Murlidhar Group'}
            </div>
            {invoice.company_gstin && (
              <div className="text-xs font-mono font-medium text-slate-700 mt-1">
                GSTIN: <span className="font-bold">{invoice.company_gstin}</span>
              </div>
            )}
            {invoice.company_pan && (
              <div className="text-xs font-mono text-slate-600">
                PAN: <span>{invoice.company_pan}</span>
              </div>
            )}
          </div>

          <div className="sm:text-right">
            <div className="text-2xl font-black font-mono text-slate-900 tracking-wide">
              {invoice.is_tax_invoice ? 'TAX INVOICE' : 'COMMERCIAL INVOICE'}
            </div>
            <div className="text-sm font-mono font-bold text-blue-700 mt-1">
              {invoice.invoice_number}
            </div>

            <div className="mt-3 text-xs space-y-1 font-mono text-slate-600">
              <div>
                <span className="text-slate-400">Invoice Date:</span>{' '}
                <span className="font-semibold text-slate-800">{invoice.invoice_date}</span>
              </div>
              <div>
                <span className="text-slate-400">Due Date:</span>{' '}
                <span className="font-semibold text-slate-800">{invoice.due_date}</span>
              </div>
              <div>
                <span className="text-slate-400">Place of Supply:</span>{' '}
                <span className="font-medium text-slate-800">{invoice.place_of_supply || 'Gujarat'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To & Status Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 py-4 border-b border-slate-200">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              BILLED TO:
            </div>
            <div className="font-bold text-sm text-slate-900">{invoice.customer_name}</div>
            {invoice.customer_business_name && (
              <div className="text-xs text-slate-600 font-medium">{invoice.customer_business_name}</div>
            )}
            {invoice.customer_address && (
              <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                {[invoice.customer_address, invoice.customer_city, invoice.customer_state, invoice.customer_postal_code].filter(Boolean).join(', ')}
              </div>
            )}
            {invoice.customer_phone && (
              <div className="text-xs text-slate-600 mt-1">
                Phone: <span className="font-mono">{invoice.customer_phone}</span>
              </div>
            )}
            {invoice.customer_tax_id && (
              <div className="text-xs font-mono font-medium text-slate-700 mt-1">
                GSTIN / Tax ID: <span className="font-bold">{invoice.customer_tax_id}</span>
              </div>
            )}
          </div>

          <div className="sm:text-right flex flex-col justify-between items-start sm:items-end">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                INVOICE STATUS:
              </div>
              <div className="inline-block px-3 py-1 rounded text-xs font-bold font-mono uppercase tracking-wider bg-slate-100 border border-slate-300">
                {invoice.status.replace('_', ' ')}
              </div>
            </div>

            <div className="mt-4 text-xs font-mono">
              <span className="text-slate-400">Balance Due:</span>{' '}
              <span className="text-base font-bold text-slate-900">
                ₹{Number(invoice.balance_due || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="my-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-400 text-slate-700 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-2">#</th>
                <th className="py-2.5 px-2">Description of Goods / Services</th>
                <th className="py-2.5 px-2">HSN/SAC</th>
                <th className="py-2.5 px-2 text-right">Qty</th>
                <th className="py-2.5 px-2 text-right">Rate (₹)</th>
                {invoice.is_tax_invoice && <th className="py-2.5 px-2 text-right">GST %</th>}
                <th className="py-2.5 px-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoice.invoice_items?.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="py-3 px-2 font-mono text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-2">
                    <div className="font-semibold text-slate-900">{item.item_name}</div>
                    {item.description && (
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                    )}
                  </td>
                  <td className="py-3 px-2 font-mono text-slate-600">{item.hsn_sac_code || '—'}</td>
                  <td className="py-3 px-2 text-right font-mono">{item.quantity}</td>
                  <td className="py-3 px-2 text-right font-mono">
                    {Number(item.unit_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  {invoice.is_tax_invoice && (
                    <td className="py-3 px-2 text-right font-mono">{item.tax_rate}%</td>
                  )}
                  <td className="py-3 px-2 text-right font-mono font-medium text-slate-900">
                    {Number(item.line_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Tax Calculation Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 my-6 pt-4 border-t border-slate-300">
          {/* Bank Account Details */}
          <div className="w-full sm:w-1/2 text-xs space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              BANK SETTLEMENT DETAILS:
            </div>
            {invoice.company_bank_name || invoice.company_bank_account_no ? (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] space-y-1">
                <div>Bank: <span className="font-semibold text-slate-800">{invoice.company_bank_name || 'N/A'}</span></div>
                <div>A/C No: <span className="font-semibold text-slate-800">{invoice.company_bank_account_no || 'N/A'}</span></div>
                <div>IFSC: <span className="font-semibold text-slate-800">{invoice.company_bank_ifsc || 'N/A'}</span></div>
                {invoice.company_upi_id && (
                  <div>UPI ID: <span className="font-semibold text-slate-800">{invoice.company_upi_id}</span></div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 italic text-[11px]">
                Bank account details to be furnished upon request.
              </div>
            )}

            {invoice.notes && (
              <div className="mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  NOTES:
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">{invoice.notes}</p>
              </div>
            )}
          </div>

          {/* Calculation Table */}
          <div className="w-full sm:w-1/2 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
              <span>Subtotal:</span>
              <span>₹{Number(invoice.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            {Number(invoice.discount_amount) > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-100 text-amber-700">
                <span>Discount:</span>
                <span>-₹{Number(invoice.discount_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className="flex justify-between py-1 border-b border-slate-100 font-semibold text-slate-800">
              <span>Taxable Amount:</span>
              <span>₹{Number(invoice.taxable_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            {invoice.is_tax_invoice && (
              <>
                {Number(invoice.igst_amount) > 0 ? (
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>IGST:</span>
                    <span>₹{Number(invoice.igst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between py-1 text-slate-600">
                      <span>CGST:</span>
                      <span>₹{Number(invoice.cgst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-1 text-slate-600">
                      <span>SGST:</span>
                      <span>₹{Number(invoice.sgst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between py-1 text-slate-700 font-medium">
                  <span>Total GST:</span>
                  <span>₹{Number(invoice.total_tax_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </>
            )}

            <div className="flex justify-between py-2.5 text-sm font-bold text-slate-900 border-t-2 border-slate-400">
              <span>Grand Total:</span>
              <span className="text-blue-700">
                ₹{Number(invoice.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between py-1 text-emerald-700">
              <span>Amount Paid:</span>
              <span>₹{Number(invoice.amount_paid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between py-1 font-bold text-slate-900 border-t border-slate-200">
              <span>Balance Due:</span>
              <span>₹{Number(invoice.balance_due || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Terms & Conditions & Signatory */}
        <div className="mt-8 pt-6 border-t border-slate-300 flex flex-col sm:flex-row justify-between items-end gap-6 text-[11px] text-slate-500">
          <div className="max-w-md space-y-1">
            <span className="font-bold text-slate-700 block">Terms & Conditions:</span>
            <p className="whitespace-pre-line leading-relaxed">{invoice.terms_and_conditions}</p>
          </div>

          <div className="text-center sm:text-right">
            <div className="font-semibold text-slate-800 mb-12">
              For {invoice.company_name}
            </div>
            <div className="border-t border-slate-400 pt-1 text-[10px] text-slate-600 uppercase font-mono">
              Authorized Signatory
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono">
          This is a computer-generated commercial document issued by Jay Murlidhar Group Platform.
        </div>
      </div>
    </div>
  );
}
