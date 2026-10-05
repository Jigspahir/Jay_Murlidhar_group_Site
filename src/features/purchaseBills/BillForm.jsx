import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Building2, Save, ArrowLeft, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { calculateBillLineItem, calculateBillTotals } from './purchaseBillService';
import { getCompanyVendors, INDIAN_STATES } from '../vendors/vendorService';
import { getApprovedPOsForCompany, getPurchaseOrderById } from '../purchaseOrders/purchaseOrderService';
import { getCompanyServices } from '../invoices/invoiceService';

export default function BillForm({
  initialData = null,
  companies = [],
  selectedCompanyId,
  isAllCompanies,
  onSubmit,
  isSubmitting = false
}) {
  const navigate = useNavigate();

  const [companyId, setCompanyId] = useState(
    initialData?.company_id || (isAllCompanies ? (companies[0]?.id || '') : selectedCompanyId || '')
  );

  const [vendorId, setVendorId] = useState(initialData?.vendor_id || '');
  const [purchaseOrderId, setPurchaseOrderId] = useState(initialData?.purchase_order_id || '');
  const [vendorInvoiceNumber, setVendorInvoiceNumber] = useState(initialData?.vendor_invoice_number || '');

  const [billDate, setBillDate] = useState(
    initialData?.bill_date || new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState(
    initialData?.due_date || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  );

  const [placeOfSupply, setPlaceOfSupply] = useState(
    initialData?.place_of_supply || 'Gujarat'
  );
  const [isInterstate, setIsInterstate] = useState(
    initialData?.is_interstate || false
  );

  const [discountAmount, setDiscountAmount] = useState(
    initialData?.discount_amount || 0
  );

  const [referenceNumber, setReferenceNumber] = useState(initialData?.reference_number || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Line items state
  const [items, setItems] = useState(
    initialData?.purchase_bill_items?.map((it) => ({
      purchase_order_item_id: it.purchase_order_item_id || '',
      service_id: it.service_id || '',
      item_name: it.item_name || '',
      description: it.description || '',
      hsn_sac_code: it.hsn_sac_code || '',
      quantity: Number(it.quantity) || 1,
      unit_price: Number(it.unit_price) || 0,
      discount_amount: Number(it.discount_amount) || 0,
      tax_rate: Number(it.tax_rate) || 0
    })) || [
      {
        purchase_order_item_id: '',
        service_id: '',
        item_name: '',
        description: '',
        hsn_sac_code: '',
        quantity: 1,
        unit_price: 0,
        discount_amount: 0,
        tax_rate: 18
      }
    ]
  );

  const [availableVendors, setAvailableVendors] = useState([]);
  const [availablePOs, setAvailablePOs] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);
  const [formError, setFormError] = useState(null);

  // Fetch vendors and services when company changes
  useEffect(() => {
    if (!companyId) return;

    let isMounted = true;
    setIsLoadingDropdowns(true);

    Promise.all([
      getCompanyVendors(companyId),
      getCompanyServices(companyId)
    ])
      .then(([vends, srvs]) => {
        if (!isMounted) return;
        setAvailableVendors(vends);
        setAvailableServices(srvs);
        if (!initialData && vends.length > 0 && !vends.some((v) => v.id === vendorId)) {
          setVendorId(vends[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to load company vendors/services:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingDropdowns(false);
      });

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  // Fetch POs for chosen company and vendor
  useEffect(() => {
    if (!companyId) return;

    let isMounted = true;
    getApprovedPOsForCompany(companyId, vendorId || null)
      .then((pos) => {
        if (isMounted) setAvailablePOs(pos);
      })
      .catch((err) => console.error('Error fetching approved POs:', err));

    return () => {
      isMounted = false;
    };
  }, [companyId, vendorId]);

  // Handle PO Selection -> Auto-populate Bill line items from PO
  const handleSelectPO = async (poId) => {
    setPurchaseOrderId(poId);
    if (!poId) return;

    try {
      const fullPO = await getPurchaseOrderById(poId);
      if (fullPO && fullPO.purchase_order_items?.length > 0) {
        if (fullPO.place_of_supply) setPlaceOfSupply(fullPO.place_of_supply);
        setIsInterstate(Boolean(fullPO.is_interstate));
        setDiscountAmount(Number(fullPO.discount_amount) || 0);

        const poItems = fullPO.purchase_order_items.map((it) => {
          const ordered = Number(it.quantity) || 1;
          const billed = Number(it.billed_quantity) || 0;
          const remaining = Math.max(0, ordered - billed);
          return {
            purchase_order_item_id: it.id,
            service_id: it.service_id || '',
            item_name: it.item_name,
            description: it.description || '',
            hsn_sac_code: it.hsn_sac_code || '',
            po_ordered_quantity: ordered,
            po_billed_quantity: billed,
            remaining_quantity: remaining,
            quantity: remaining > 0 ? remaining : 1,
            unit_price: Number(it.unit_price) || 0,
            discount_amount: Number(it.discount_amount) || 0,
            tax_rate: Number(it.tax_rate) || 0
          };
        });
        setItems(poItems);
      }
    } catch (err) {
      console.error('Error populating PO items:', err);
    }
  };

  // Live Totals calculation
  const calculatedTotals = useMemo(() => {
    return calculateBillTotals({
      items,
      discountAmount,
      isInterstate
    });
  }, [items, discountAmount, isInterstate]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        purchase_order_item_id: '',
        service_id: '',
        item_name: '',
        description: '',
        hsn_sac_code: '',
        quantity: 1,
        unit_price: 0,
        discount_amount: 0,
        tax_rate: 18
      }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };

      if (field === 'service_id' && value) {
        const srv = availableServices.find((s) => s.id === value);
        if (srv) {
          item.item_name = srv.service_name;
          item.description = srv.description || '';
          item.unit_price = Number(srv.base_price) || 0;
        }
      }

      updated[index] = item;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!companyId) {
      setFormError('Please select a company for this supplier bill.');
      return;
    }
    if (!vendorId) {
      setFormError('Please select a vendor.');
      return;
    }
    if (!vendorInvoiceNumber.trim()) {
      setFormError('External Vendor Invoice Number is required.');
      return;
    }

    const invalidItem = items.find((it) => !it.item_name.trim() || Number(it.quantity) <= 0);
    if (invalidItem) {
      setFormError('All bill line items must have a valid item name and quantity > 0.');
      return;
    }

    // Over-billing validation for PO-linked items when recording
    if (targetStatus === 'recorded') {
      const overBilled = items.find(
        (it) => it.purchase_order_item_id && it.remaining_quantity !== undefined && Number(it.quantity) > Number(it.remaining_quantity)
      );
      if (overBilled) {
        setFormError(
          `Over-billing rejected: Item "${overBilled.item_name}" quantity (${overBilled.quantity}) exceeds remaining PO quantity (${overBilled.remaining_quantity}).`
        );
        return;
      }
    }

    try {
      await onSubmit({
        billData: {
          company_id: companyId,
          vendor_id: vendorId,
          purchase_order_id: purchaseOrderId || null,
          vendor_invoice_number: vendorInvoiceNumber.trim(),
          bill_date: billDate,
          due_date: dueDate,
          discount_amount: discountAmount,
          place_of_supply: placeOfSupply,
          is_interstate: isInterstate,
          reference_number: referenceNumber,
          notes,
          status: targetStatus
        },
        items
      });
    } catch (err) {
      console.error('BillForm error:', err);
      setFormError(err.message || 'Failed to save purchase bill.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{formError}</span>
        </div>
      )}

      {/* 1. Header & PO Linking */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100 pb-2">
          1. Supplier & Invoice Identification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Billing Company *
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              disabled={Boolean(initialData)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vendor / Payee *
            </label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              disabled={isLoadingDropdowns || availableVendors.length === 0}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              {availableVendors.length === 0 ? (
                <option value="">No vendors found for company</option>
              ) : (
                availableVendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.legal_name} ({v.vendor_code})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link Purchase Order (Optional)
            </label>
            <select
              value={purchaseOrderId}
              onChange={(e) => handleSelectPO(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-mono"
            >
              <option value="">Direct Bill (No PO)</option>
              {availablePOs.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.po_number} (₹{Number(po.total_amount).toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vendor's Invoice / Bill No. *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. INV-2026-9921"
              value={vendorInvoiceNumber}
              onChange={(e) => setVendorInvoiceNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bill Date *
            </label>
            <input
              type="date"
              required
              value={billDate}
              onChange={(e) => setBillDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Due Date *
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Place of Supply
            </label>
            <select
              value={placeOfSupply}
              onChange={(e) => setPlaceOfSupply(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="billIsInterstate"
              checked={isInterstate}
              onChange={(e) => setIsInterstate(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <label htmlFor="billIsInterstate" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Interstate Purchase (IGST)
            </label>
          </div>
        </div>
      </div>

      {/* 2. Bill Items */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
            2. Invoiced Items & Input Tax Breakdown
          </h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const calc = calculateBillLineItem(item);
            return (
              <div
                key={index}
                className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg flex flex-col md:flex-row gap-3 items-start md:items-center text-xs"
              >
                <div className="w-full md:w-44">
                  <label className="block text-[10px] text-slate-500 uppercase font-mono mb-0.5">
                    Catalog Item
                  </label>
                  <select
                    value={item.service_id}
                    onChange={(e) => handleItemChange(index, 'service_id', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded bg-white"
                  >
                    <option value="">Ad-hoc Item</option>
                    {availableServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.service_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-[10px] text-slate-500 uppercase font-mono mb-0.5">
                    Item Description *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Broadband Fiber Commercial Plan 500Mbps"
                    value={item.item_name}
                    onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded bg-white"
                  />
                  {item.purchase_order_item_id && item.remaining_quantity !== undefined && (
                    <div className="flex items-center flex-wrap gap-2 mt-1 text-[10px] font-mono">
                      <span className="text-slate-500">Ordered: {item.po_ordered_quantity}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-slate-500">Billed: {item.po_billed_quantity}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className={`font-semibold ${Number(item.quantity) > item.remaining_quantity ? 'text-rose-600 font-bold' : 'text-emerald-600'}`}>
                        Remaining: {item.remaining_quantity}
                      </span>
                      {Number(item.quantity) > item.remaining_quantity && (
                        <span className="text-rose-600 font-bold bg-rose-50 px-1 py-0.5 rounded border border-rose-200">
                          Exceeds PO remaining qty
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="w-24">
                  <label className="block text-[10px] text-slate-500 uppercase font-mono mb-0.5">
                    HSN/SAC
                  </label>
                  <input
                    type="text"
                    placeholder="9984"
                    value={item.hsn_sac_code}
                    onChange={(e) => handleItemChange(index, 'hsn_sac_code', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded bg-white font-mono"
                  />
                </div>

                <div className="w-20">
                  <label className="block text-[10px] text-slate-500 uppercase font-mono mb-0.5">
                    Qty *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded bg-white font-mono text-center"
                  />
                </div>

                <div className="w-28">
                  <label className="block text-[10px] text-slate-500 uppercase font-mono mb-0.5">
                    Rate (₹) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded bg-white font-mono text-right"
                  />
                </div>

                <div className="w-20">
                  <label className="block text-[10px] text-slate-500 uppercase font-mono mb-0.5">
                    GST (%)
                  </label>
                  <select
                    value={item.tax_rate}
                    onChange={(e) => handleItemChange(index, 'tax_rate', e.target.value)}
                    className="w-full px-1.5 py-1.5 text-xs border border-slate-200 rounded bg-white font-mono text-center"
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>

                <div className="w-28 text-right font-mono font-bold text-slate-900 pt-3 md:pt-0">
                  <label className="block text-[10px] text-slate-500 uppercase font-mono mb-0.5 md:hidden">
                    Line Total
                  </label>
                  ₹{calc.lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors self-end md:self-center"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Summary & Financial Breakdown */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Internal Reference / Challan / Delivery Note
            </label>
            <input
              type="text"
              placeholder="e.g. GRN-2026-088 or Delivery Challan # 44"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Auditor / Accounting Notes
            </label>
            <textarea
              rows={3}
              placeholder="Verified against physical stock delivery. Approved for commercial payment."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Financial Calculation Summary Box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-mono">
          <div className="flex justify-between py-1 text-slate-600">
            <span>Subtotal:</span>
            <span>₹{calculatedTotals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-slate-600">Discount (₹):</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              className="w-28 px-2 py-0.5 text-right border border-slate-200 rounded bg-white text-xs font-mono"
            />
          </div>

          <div className="flex justify-between py-1 text-slate-600">
            <span>Taxable Amount (Base ITC):</span>
            <span>₹{calculatedTotals.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          {isInterstate ? (
            <div className="flex justify-between py-1 text-slate-600">
              <span>IGST (Integrated Input Tax):</span>
              <span>₹{calculatedTotals.igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between py-1 text-slate-600">
                <span>CGST (Central Input Tax):</span>
                <span>₹{calculatedTotals.cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>SGST (State Input Tax):</span>
                <span>₹{calculatedTotals.sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </>
          )}

          <div className="flex justify-between py-2 border-t border-slate-300 font-bold text-sm text-slate-900">
            <span>Total Payable Amount:</span>
            <span className="text-rose-600">
              ₹{calculatedTotals.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Action Strip */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => navigate('/admin/purchase-bills')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bills</span>
        </button>

        <div className="flex items-center gap-2.5">
          {!initialData && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={(e) => handleSubmit(e, 'draft')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>Save as Draft</span>
            </button>
          )}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={(e) => handleSubmit(e, 'recorded')}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Processing...' : initialData ? 'Update Bill' : 'Record Supplier Bill (AP)'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
