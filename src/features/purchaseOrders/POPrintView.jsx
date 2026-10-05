import React from 'react';
import { Printer, ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';

export default function POPrintView({ purchaseOrder, onBack }) {
  if (!purchaseOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const comp = purchaseOrder.companies || {};
  const ven = purchaseOrder.vendors || {};
  const items = purchaseOrder.purchase_order_items || [];

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-8 print:p-0 print:bg-white">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="max-w-[850px] mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Purchase Order</span>
        </button>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-[850px] mx-auto bg-white border border-slate-200 shadow-lg print:shadow-none print:border-none p-8 sm:p-12 text-slate-900 font-sans">
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm">
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
              {comp.pan && <div className="font-mono">PAN: {comp.pan}</div>}
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-2xl font-black uppercase tracking-wider text-blue-700 mb-1">
              PURCHASE ORDER
            </h1>
            <div className="font-mono font-bold text-sm text-slate-900">
              {purchaseOrder.po_number}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-mono">
              Date: {purchaseOrder.po_date}
            </div>
            {purchaseOrder.expected_delivery_date && (
              <div className="text-xs text-slate-500 font-mono">
                Delivery Due: {purchaseOrder.expected_delivery_date}
              </div>
            )}
            <div className="text-xs text-slate-500 font-mono">
              Credit Terms: {purchaseOrder.payment_terms_days} Days
            </div>
          </div>
        </div>

        {/* Vendor & Delivery Recipient Grid */}
        <div className="grid grid-cols-2 gap-8 border-b border-slate-200 pb-6 mb-6 text-xs">
          <div>
            <div className="font-mono uppercase tracking-wider text-slate-400 font-bold mb-1.5 text-[10px]">
              VENDOR / SUPPLIER:
            </div>
            <div className="font-bold text-sm text-slate-900">{ven.legal_name}</div>
            {ven.trade_name && <div className="text-slate-600 font-medium">T/A: {ven.trade_name}</div>}
            <div className="text-slate-600 mt-1">{ven.billing_address}</div>
            <div className="text-slate-600">
              {ven.billing_city}, {ven.billing_state} - {ven.billing_postal_code}
            </div>
            <div className="mt-1 font-mono text-slate-700">Phone: {ven.phone}</div>
            {ven.email && <div className="text-slate-700">Email: {ven.email}</div>}
            {ven.gstin && <div className="font-mono font-semibold text-slate-800">GSTIN: {ven.gstin}</div>}
          </div>

          <div>
            <div className="font-mono uppercase tracking-wider text-slate-400 font-bold mb-1.5 text-[10px]">
              DELIVER / INVOICE TO:
            </div>
            <div className="font-bold text-sm text-slate-900">{comp.legal_name || comp.name}</div>
            <div className="text-slate-600 mt-1">{comp.billing_address || 'Corporate Headquarters'}</div>
            <div className="text-slate-600">
              {comp.billing_city || 'Ahmedabad'}, {comp.billing_state || 'Gujarat'} - {comp.billing_postal_code || '380001'}
            </div>
            <div className="mt-1 font-mono text-slate-700">
              Place of Supply: {purchaseOrder.place_of_supply || 'Gujarat'}
            </div>
            <div className="font-mono text-slate-700">
              Tax Regime: {purchaseOrder.is_interstate ? 'Interstate (IGST)' : 'Intrastate (CGST + SGST)'}
            </div>
          </div>
        </div>

        {/* Requisition Line Items */}
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

        {/* Totals Breakdown */}
        <div className="flex justify-end mb-8">
          <div className="w-72 bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>₹{Number(purchaseOrder.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {Number(purchaseOrder.discount_amount) > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Discount:</span>
                <span>-₹{Number(purchaseOrder.discount_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Taxable Value:</span>
              <span>₹{Number(purchaseOrder.taxable_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            {purchaseOrder.is_interstate ? (
              <div className="flex justify-between text-slate-600">
                <span>IGST:</span>
                <span>₹{Number(purchaseOrder.igst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-slate-600">
                  <span>CGST:</span>
                  <span>₹{Number(purchaseOrder.cgst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SGST:</span>
                  <span>₹{Number(purchaseOrder.sgst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </>
            )}

            <div className="flex justify-between py-2 border-t-2 border-slate-300 font-bold text-sm text-slate-900">
              <span>Total Commitment:</span>
              <span className="text-blue-700">
                ₹{Number(purchaseOrder.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Terms & Authorization Stamp */}
        <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-6 text-xs text-slate-600">
          <div>
            <div className="font-mono uppercase tracking-wider text-slate-400 font-bold mb-1 text-[10px]">
              COMMERCIAL TERMS:
            </div>
            <p className="whitespace-pre-line leading-relaxed text-[11px]">
              {purchaseOrder.terms_and_conditions || 'Standard procurement terms apply.'}
            </p>
          </div>

          <div className="text-right flex flex-col justify-end items-end">
            <div className="w-52 border-b border-slate-400 mb-1" />
            <div className="font-bold text-slate-900">Authorized Procurement Officer</div>
            <div className="text-[10px] text-slate-500 font-mono">
              For {comp.name || 'Jay Murlidhar Group'}
            </div>
            {purchaseOrder.approved_at && (
              <div className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-mono mt-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Digitally Approved ({new Date(purchaseOrder.approved_at).toLocaleDateString('en-IN')})</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
