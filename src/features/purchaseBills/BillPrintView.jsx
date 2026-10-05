import React from 'react';
import { Printer, ArrowLeft, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BillPrintView({ bill, onBack }) {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const comp = bill.companies || {};
  const ven = bill.vendors || {};
  const items = bill.purchase_bill_items || [];
  const payments = bill.vendor_payments || [];

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-8 print:p-0 print:bg-white">
      {/* Top Action Bar */}
      <div className="max-w-[850px] mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bill</span>
        </button>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Voucher / Save as PDF</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-[850px] mx-auto bg-white border border-slate-200 shadow-lg print:shadow-none print:border-none p-8 sm:p-12 text-slate-900 font-sans">
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm">
                J
              </span>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                {comp.legal_name || comp.name || 'JAY MURLIDHAR GROUP'}
              </span>
            </div>
            <div className="text-xs text-slate-500 max-w-sm leading-relaxed">
              {comp.billing_address && <div>{comp.billing_address}</div>}
              {(comp.billing_city || comp.billing_state) && (
                <div>
                  {comp.billing_city}, {comp.billing_state} - {comp.billing_postal_code}
                </div>
              )}
              {comp.gstin && <div className="font-mono mt-1">GSTIN: {comp.gstin}</div>}
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900 mb-1">
              ACCOUNTS PAYABLE VOUCHER
            </h1>
            <div className="font-mono font-bold text-sm text-blue-700">
              JMG Ref: {bill.bill_number}
            </div>
            <div className="font-mono font-bold text-xs text-slate-700 mt-1">
              Vendor Inv #: {bill.vendor_invoice_number}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-mono">
              Bill Date: {bill.bill_date}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Due Date: {bill.due_date}
            </div>
          </div>
        </div>

        {/* Vendor & Entity Information */}
        <div className="grid grid-cols-2 gap-8 border-b border-slate-200 pb-6 mb-6 text-xs">
          <div>
            <div className="font-mono uppercase tracking-wider text-slate-400 font-bold mb-1 text-[10px]">
              SUPPLIER CREDITOR:
            </div>
            <div className="font-bold text-sm text-slate-900">{ven.legal_name}</div>
            <div className="text-slate-600 mt-1">{ven.billing_address}</div>
            <div className="text-slate-600">
              {ven.billing_city}, {ven.billing_state} - {ven.billing_postal_code}
            </div>
            <div className="mt-1 font-mono text-slate-700">Phone: {ven.phone}</div>
            {ven.gstin && <div className="font-mono font-semibold text-slate-800">GSTIN: {ven.gstin}</div>}
          </div>

          <div>
            <div className="font-mono uppercase tracking-wider text-slate-400 font-bold mb-1 text-[10px]">
              VOUCHER AUDIT SUMMARY:
            </div>
            <div className="space-y-1 font-mono text-slate-700">
              <div>Settlement Status: <span className="uppercase font-bold">{bill.payment_status}</span></div>
              <div>Lifecycle Status: <span className="uppercase font-bold">{bill.status}</span></div>
              {bill.purchase_orders?.po_number && (
                <div>Purchase Order: {bill.purchase_orders.po_number}</div>
              )}
              {bill.reference_number && (
                <div>Internal Ref: {bill.reference_number}</div>
              )}
            </div>
          </div>
        </div>

        {/* Invoiced Items */}
        <table className="w-full text-left border-collapse text-xs mb-6">
          <thead>
            <tr className="bg-slate-100 border-y border-slate-300 text-[10px] font-mono uppercase tracking-wider text-slate-700">
              <th className="py-2.5 px-3 w-10 text-center">#</th>
              <th className="py-2.5 px-3">Item Description</th>
              <th className="py-2.5 px-3 w-20">HSN/SAC</th>
              <th className="py-2.5 px-3 w-16 text-center">Qty</th>
              <th className="py-2.5 px-3 w-24 text-right">Unit Rate (₹)</th>
              <th className="py-2.5 px-3 w-16 text-center">Tax %</th>
              <th className="py-2.5 px-3 w-28 text-right">Line Total (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item, idx) => (
              <tr key={item.id || idx}>
                <td className="py-2.5 px-3 font-mono text-center text-slate-500">{idx + 1}</td>
                <td className="py-2.5 px-3">
                  <div className="font-semibold text-slate-900">{item.item_name}</div>
                  {item.description && (
                    <div className="text-[11px] text-slate-500">{item.description}</div>
                  )}
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-600">{item.hsn_sac_code || '—'}</td>
                <td className="py-2.5 px-3 font-mono text-center font-medium">{item.quantity}</td>
                <td className="py-2.5 px-3 font-mono text-right">
                  {Number(item.unit_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2.5 px-3 font-mono text-center">{item.tax_rate}%</td>
                <td className="py-2.5 px-3 font-mono text-right font-semibold">
                  {Number(item.line_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals & Payments Summary */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 text-[10px]">
              DISBURSEMENT SETTLEMENTS:
            </div>
            {payments.length === 0 ? (
              <div className="text-xs text-slate-400 italic">No payments recorded against this bill yet.</div>
            ) : (
              <div className="space-y-1.5 font-mono text-xs">
                {payments.map((p) => (
                  <div key={p.id} className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">{p.payment_date} ({p.payment_number}):</span>
                    <span className="font-semibold text-emerald-700">
                      ₹{Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>₹{Number(bill.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {Number(bill.discount_amount) > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Discount:</span>
                <span>-₹{Number(bill.discount_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Taxable (Input Base):</span>
              <span>₹{Number(bill.taxable_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            {bill.is_interstate ? (
              <div className="flex justify-between text-slate-600">
                <span>IGST:</span>
                <span>₹{Number(bill.igst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-slate-600">
                  <span>CGST:</span>
                  <span>₹{Number(bill.cgst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SGST:</span>
                  <span>₹{Number(bill.sgst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </>
            )}

            <div className="flex justify-between py-1.5 border-t border-slate-300 font-bold text-slate-900">
              <span>Total Invoiced:</span>
              <span>₹{Number(bill.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between py-1 text-emerald-700">
              <span>Disbursed Paid:</span>
              <span>-₹{Number(bill.amount_paid).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between py-2 border-t-2 border-slate-300 font-bold text-sm text-slate-900">
              <span>Outstanding Payable:</span>
              <span className={Number(bill.balance_due) > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                ₹{Number(bill.balance_due).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Verification Footer */}
        <div className="border-t border-slate-200 pt-6 flex justify-between items-end text-xs text-slate-500 font-mono">
          <div>
            <div>System Generated: {new Date().toLocaleDateString('en-IN')}</div>
            <div>Internal JMG Accounts Payable Voucher</div>
          </div>

          <div className="text-right">
            <div className="w-48 border-b border-slate-400 mb-1" />
            <div className="font-bold text-slate-900 font-sans">Accounts Department Verification</div>
          </div>
        </div>
      </div>
    </div>
  );
}
