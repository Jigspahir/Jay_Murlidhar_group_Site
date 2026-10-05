import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Building2, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { calculatePOLineItem, calculatePOTotals } from './purchaseOrderService';
import { getCompanyVendors, INDIAN_STATES } from '../vendors/vendorService';
import { getCompanyServices } from '../invoices/invoiceService';

export default function POForm({
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
  const [poDate, setPoDate] = useState(
    initialData?.po_date || new Date().toISOString().split('T')[0]
  );
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    initialData?.expected_delivery_date || ''
  );
  const [paymentTermsDays, setPaymentTermsDays] = useState(
    initialData?.payment_terms_days !== undefined ? initialData.payment_terms_days : 15
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

  const [notes, setNotes] = useState(initialData?.notes || '');
  const [termsAndConditions, setTermsAndConditions] = useState(
    initialData?.terms_and_conditions || '1. Goods / Services must be delivered strictly as per specifications.\n2. Payment terms as agreed upon delivery of valid tax invoice.'
  );

  // Line items state
  const [items, setItems] = useState(
    initialData?.purchase_order_items?.map((it) => ({
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
        // If editing and vendor is not in current selection, keep it
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

  // When vendor changes, sync payment terms and check interstate status
  useEffect(() => {
    if (!vendorId || availableVendors.length === 0) return;
    const matchedVendor = availableVendors.find((v) => v.id === vendorId);
    if (matchedVendor) {
      if (!initialData) {
        setPaymentTermsDays(matchedVendor.payment_terms_days || 15);
      }
      // If vendor state is different from Gujarat, suggest interstate
      if (matchedVendor.billing_state && matchedVendor.billing_state !== 'Gujarat') {
        setIsInterstate(true);
      } else {
        setIsInterstate(false);
      }
    }
  }, [vendorId, availableVendors, initialData]);

  // Live Totals calculation
  const calculatedTotals = useMemo(() => {
    return calculatePOTotals({
      items,
      discountAmount,
      isInterstate
    });
  }, [items, discountAmount, isInterstate]);

  // Item manipulation
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
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

      // If user selected a catalog service, copy its commercial snapshot
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
      setFormError('Please select a company for this purchase order.');
      return;
    }
    if (!vendorId) {
      setFormError('Please select a vendor.');
      return;
    }

    const invalidItem = items.find((it) => !it.item_name.trim() || Number(it.quantity) <= 0);
    if (invalidItem) {
      setFormError('All PO line items must have a valid item name and quantity > 0.');
      return;
    }

    try {
      await onSubmit({
        poData: {
          company_id: companyId,
          vendor_id: vendorId,
          po_date: poDate,
          expected_delivery_date: expectedDeliveryDate || null,
          payment_terms_days: paymentTermsDays,
          discount_amount: discountAmount,
          place_of_supply: placeOfSupply,
          is_interstate: isInterstate,
          notes,
          terms_and_conditions: termsAndConditions
        },
        items
      });
    } catch (err) {
      console.error('POForm error:', err);
      setFormError(err.message || 'Failed to save purchase order.');
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

      {/* 1. Header & Vendor Assignment */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100 pb-2">
          1. Procurement Header & Vendor
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Procuring Company *
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
              Vendor / Supplier *
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
              PO Date *
            </label>
            <input
              type="date"
              required
              value={poDate}
              onChange={(e) => setPoDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Expected Delivery Date
            </label>
            <input
              type="date"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Credit Terms (Days)
            </label>
            <input
              type="number"
              min={0}
              value={paymentTermsDays}
              onChange={(e) => setPaymentTermsDays(e.target.value)}
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
              id="isInterstate"
              checked={isInterstate}
              onChange={(e) => setIsInterstate(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <label htmlFor="isInterstate" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Interstate Purchase (IGST)
            </label>
          </div>
        </div>
      </div>

      {/* 2. Line Items Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
            2. Requisition Line Items
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
            const calc = calculatePOLineItem(item);
            return (
              <div
                key={index}
                className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg flex flex-col md:flex-row gap-3 items-start md:items-center text-xs"
              >
                <div className="w-full md:w-44">
                  <label className="block text-[10px] text-slate-500 uppercase font-mono mb-0.5">
                    Catalog Item (Opt)
                  </label>
                  <select
                    value={item.service_id}
                    onChange={(e) => handleItemChange(index, 'service_id', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded bg-white"
                  >
                    <option value="">Custom Item</option>
                    {availableServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.service_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-[10px] text-slate-500 uppercase font-mono mb-0.5">
                    Item Description / Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dell PowerEdge Server or 500 Reams A4 Paper"
                    value={item.item_name}
                    onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded bg-white"
                  />
                </div>

                <div className="w-24">
                  <label className="block text-[10px] text-slate-500 uppercase font-mono mb-0.5">
                    HSN/SAC
                  </label>
                  <input
                    type="text"
                    placeholder="8471"
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
              Internal PO Notes / Justification
            </label>
            <textarea
              rows={2}
              placeholder="Department procurement justification or delivery notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Terms & Conditions (Printed on PO)
            </label>
            <textarea
              rows={3}
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
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
            <span>Taxable Amount:</span>
            <span>₹{calculatedTotals.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          {isInterstate ? (
            <div className="flex justify-between py-1 text-slate-600">
              <span>IGST (Integrated Tax):</span>
              <span>₹{calculatedTotals.igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between py-1 text-slate-600">
                <span>CGST (Central Tax):</span>
                <span>₹{calculatedTotals.cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>SGST (State Tax):</span>
                <span>₹{calculatedTotals.sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </>
          )}

          <div className="flex justify-between py-2 border-t border-slate-300 font-bold text-sm text-slate-900">
            <span>Total Purchase Commitment:</span>
            <span className="text-blue-600">
              ₹{calculatedTotals.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Action Strip */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => navigate('/admin/purchase-orders')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Purchase Orders</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving...' : initialData ? 'Update Purchase Order' : 'Create Draft PO'}</span>
        </button>
      </div>
    </form>
  );
}
