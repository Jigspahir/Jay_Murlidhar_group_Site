import React from 'react';
import { Printer, X } from 'lucide-react';
import { PAYMENT_METHODS } from './paymentService';

export default function PaymentReceiptView({ payment, onClose }) {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const getMethodLabel = (val) => {
    const found = PAYMENT_METHODS.find((m) => m.value === val);
    return found ? found.label : val;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Action Bar (hidden when printing) */}
        <div className="print:hidden px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="text-xs font-mono text-slate-500">
            OFFICIAL PAYMENT RECEIPT &bull; {payment.payment_number}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 sm:p-10 font-sans text-slate-800 print:p-0">
          {/* Company & Receipt Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {payment.companies?.name || 'Jay Murlidhar Group'}
              </h2>
              {payment.companies?.legal_name && (
                <div className="text-[11px] text-slate-500">{payment.companies.legal_name}</div>
              )}
              <div className="text-xs text-slate-600 mt-1 max-w-xs leading-relaxed">
                {payment.companies?.billing_address || 'Gujarat, India'}
              </div>
              {payment.companies?.gstin && (
                <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                  GSTIN: <span className="font-semibold">{payment.companies.gstin}</span>
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-base font-black font-mono text-slate-900 uppercase tracking-wider">
                PAYMENT RECEIPT
              </div>
              <div className="text-sm font-bold font-mono text-blue-700 mt-0.5">
                {payment.payment_number}
              </div>
              <div className="text-xs font-mono text-slate-500 mt-1">
                Date: <span className="font-semibold text-slate-800">{payment.payment_date}</span>
              </div>
            </div>
          </div>

          {/* Received From */}
          <div className="my-6 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                RECEIVED FROM:
              </span>
              <div className="font-bold text-slate-900 text-sm">{payment.customers?.full_name}</div>
              <div className="text-slate-600 font-mono text-[11px]">{payment.customers?.customer_code}</div>
              {payment.customers?.phone && (
                <div className="text-slate-600 mt-0.5">Phone: {payment.customers.phone}</div>
              )}
              {payment.customers?.address && (
                <div className="text-slate-500 text-[11px] mt-0.5">{payment.customers.address}</div>
              )}
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                AGAINST INVOICE:
              </span>
              <div className="font-bold font-mono text-slate-900 text-sm">
                {payment.invoices?.invoice_number || 'N/A'}
              </div>
              <div className="text-slate-500 text-[11px] font-mono">
                Invoice Total: ₹{Number(payment.invoices?.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Amount Box */}
          <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                AMOUNT RECEIVED
              </span>
              <span className="text-2xl font-black text-emerald-600">
                ₹{Number(payment.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-right text-xs">
              <div className="text-slate-500">
                Method: <span className="font-bold capitalize text-slate-800">{getMethodLabel(payment.payment_method)}</span>
              </div>
              {payment.reference_number && (
                <div className="text-slate-500 mt-0.5">
                  Ref / UTR: <span className="font-semibold text-slate-800">{payment.reference_number}</span>
                </div>
              )}
            </div>
          </div>

          {/* Remaining Balance Summary */}
          {payment.invoices && (
            <div className="my-4 p-3 rounded-lg border border-slate-200 text-xs font-mono grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span>Total Settled to Date:</span>{' '}
                <span className="font-semibold text-slate-800">
                  ₹{Number(payment.invoices.amount_paid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-right">
                <span>Remaining Balance Due:</span>{' '}
                <span className="font-bold text-rose-600">
                  ₹{Number(payment.invoices.balance_due || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

          {payment.notes && (
            <div className="my-4 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Remarks:</span> {payment.notes}
            </div>
          )}

          {/* Signatory Footer */}
          <div className="mt-10 pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
            <div className="text-[10px] font-mono text-slate-400">
              Generated via JMG Finance Platform &bull; Concurrency Safe
            </div>
            <div className="text-right">
              <div className="font-semibold text-slate-800 mb-8">
                For {payment.companies?.name || 'Jay Murlidhar Group'}
              </div>
              <div className="border-t border-slate-300 pt-1 text-[10px] uppercase font-mono text-slate-500">
                Authorized Cashier / Officer
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
