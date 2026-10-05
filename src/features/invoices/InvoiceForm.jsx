import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Building2, FileText, AlertCircle, ArrowLeft, Save } from 'lucide-react';
import {
  calculateLineItem,
  calculateInvoiceTotals,
  getCompanyCustomers,
  getCompanyServices,
  DISCOUNT_TYPES,
  PLACE_OF_SUPPLY_STATES
} from './invoiceService';

export default function InvoiceForm({
  initialData = null,
  companies = [],
  selectedCompanyId,
  isAllCompanies,
  onSubmit,
  isSubmitting = false
}) {
  const navigate = useNavigate();

  // Company Selection: if an invoice is being edited or initialData exists, use its company_id
  const [companyId, setCompanyId] = useState(
    initialData?.company_id || (isAllCompanies ? (companies[0]?.id || '') : selectedCompanyId || '')
  );

  const [customerId, setCustomerId] = useState(initialData?.customer_id || '');
  const [invoiceDate, setInvoiceDate] = useState(
    initialData?.invoice_date || new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState(
    initialData?.due_date || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  );

  const [isTaxInvoice, setIsTaxInvoice] = useState(
    initialData?.is_tax_invoice !== undefined ? initialData.is_tax_invoice : true
  );
  const [placeOfSupply, setPlaceOfSupply] = useState(
    initialData?.place_of_supply || 'Gujarat'
  );
  const [isInterstate, setIsInterstate] = useState(
    initialData?.is_interstate || false
  );

  const [discountType, setDiscountType] = useState(
    initialData?.discount_type || 'fixed'
  );
  const [discountValue, setDiscountValue] = useState(
    initialData?.discount_value || 0
  );

  const [notes, setNotes] = useState(initialData?.notes || '');
  const [termsAndConditions, setTermsAndConditions] = useState(
    initialData?.terms_and_conditions || '1. Goods / Services once sold will not be returned.\n2. Payment is due within 15 days of invoice date.'
  );

  // Line items state
  const [items, setItems] = useState(
    initialData?.invoice_items?.map((it) => ({
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

  // Available Customers & Services for chosen company
  const [availableCustomers, setAvailableCustomers] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);
  const [formError, setFormError] = useState(null);

  // Load Customers & Services when company changes
  useEffect(() => {
    if (!companyId) return;

    let isMounted = true;
    setIsLoadingDropdowns(true);

    Promise.all([
      getCompanyCustomers(companyId),
      getCompanyServices(companyId)
    ])
      .then(([custs, srvs]) => {
        if (!isMounted) return;
        setAvailableCustomers(custs);
        setAvailableServices(srvs);
        setIsLoadingDropdowns(false);

        // If customerId is not in the new company's list, reset it
        if (!initialData || initialData.company_id !== companyId) {
          if (!custs.some((c) => c.id === customerId)) {
            setCustomerId(custs[0]?.id || '');
          }
        }
      })
      .catch((err) => {
        console.error('Dropdown load error:', err);
        if (isMounted) setIsLoadingDropdowns(false);
      });

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  // Auto-detect inter-state tax if place of supply is changed
  const handlePlaceOfSupplyChange = (val) => {
    setPlaceOfSupply(val);
    if (val !== 'Gujarat') {
      setIsInterstate(true);
    } else {
      setIsInterstate(false);
    }
  };

  // Line item manipulation
  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      const cur = { ...updated[index], [field]: value };

      // If user selects a service from dropdown, auto-populate snapshot fields
      if (field === 'service_id') {
        const selectedSrv = availableServices.find((s) => s.id === value);
        if (selectedSrv) {
          cur.item_name = selectedSrv.name;
          cur.description = selectedSrv.description || '';
          cur.hsn_sac_code = selectedSrv.hsn_sac_code || '';
          cur.unit_price = Number(selectedSrv.base_price) || 0;
          cur.tax_rate = Number(selectedSrv.tax_rate) || 18;
        }
      }

      updated[index] = cur;
      return updated;
    });
  };

  const addItem = () => {
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
        tax_rate: isTaxInvoice ? 18 : 0
      }
    ]);
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Live Totals Calculation
  const computedTotals = useMemo(() => {
    return calculateInvoiceTotals({
      items,
      discountType,
      discountValue,
      isTaxInvoice,
      isInterstate
    });
  }, [items, discountType, discountValue, isTaxInvoice, isInterstate]);

  const selectedCustomerDetails = useMemo(() => {
    return availableCustomers.find((c) => c.id === customerId);
  }, [availableCustomers, customerId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (!companyId) {
      setFormError('Please select a company.');
      return;
    }

    if (!customerId) {
      setFormError('Please select a customer.');
      return;
    }

    if (!items || items.length === 0) {
      setFormError('Please add at least one line item.');
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.item_name || !it.item_name.trim()) {
        setFormError(`Item #${i + 1} requires a valid item name.`);
        return;
      }
      if (Number(it.quantity) <= 0) {
        setFormError(`Item #${i + 1} quantity must be greater than zero.`);
        return;
      }
      if (Number(it.unit_price) < 0) {
        setFormError(`Item #${i + 1} unit price cannot be negative.`);
        return;
      }
    }

    onSubmit({
      companyId,
      customerId,
      invoiceDate,
      dueDate,
      isTaxInvoice,
      placeOfSupply,
      isInterstate,
      discountType,
      discountValue: Number(discountValue) || 0,
      items,
      notes,
      termsAndConditions
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
          <span>{formError}</span>
        </div>
      )}

      {/* TOP: Company & Customer Setup */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          Company & Customer Billing Header
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Company Picker */}
          <div className="md:col-span-6">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              JMG Operating Company *
            </label>
            <select
              value={companyId}
              disabled={!!initialData}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Picker */}
          <div className="md:col-span-6">
            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center justify-between">
              <span>Customer *</span>
              {isLoadingDropdowns && (
                <span className="text-[10px] text-blue-600 animate-pulse">Loading customers...</span>
              )}
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              disabled={isLoadingDropdowns || availableCustomers.length === 0}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="">-- Select Customer --</option>
              {availableCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.customer_code}) {c.phone ? `— ${c.phone}` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Customer Details Snapshot Preview */}
        {selectedCustomerDetails && (
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">CUSTOMER CODE:</span>
              <span className="font-semibold text-slate-800">{selectedCustomerDetails.customer_code}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">CONTACT PHONE:</span>
              <span>{selectedCustomerDetails.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ADDRESS:</span>
              <span className="truncate block">
                {[selectedCustomerDetails.city, selectedCustomerDetails.state].filter(Boolean).join(', ') || 'N/A'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* INVOICE PARAMETERS & TAX SETTINGS */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Invoice Dates & Tax Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Invoice Date *</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Due Date *</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Place of Supply *</label>
            <select
              value={placeOfSupply}
              onChange={(e) => handlePlaceOfSupplyChange(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
            >
              {PLACE_OF_SUPPLY_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <div className="flex items-center gap-4 py-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isTaxInvoice}
                  onChange={(e) => setIsTaxInvoice(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Tax Invoice (GST)</span>
              </label>

              {isTaxInvoice && (
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={isInterstate}
                    onChange={(e) => setIsInterstate(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Interstate (IGST)</span>
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LINE ITEMS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Commercial Line Items & Historical Price Snapshot
          </h3>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 w-48">Service / Catalog</th>
                <th className="px-3 py-2 w-56">Item Name & Description *</th>
                <th className="px-2 py-2 w-24">HSN / SAC</th>
                <th className="px-2 py-2 w-20 text-right">Qty *</th>
                <th className="px-2 py-2 w-28 text-right">Unit Price (₹) *</th>
                {isTaxInvoice && <th className="px-2 py-2 w-20 text-right">GST %</th>}
                <th className="px-3 py-2 w-28 text-right">Line Total</th>
                <th className="px-2 py-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => {
                const lineCalc = calculateLineItem(item);
                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    {/* Service Catalog Picker */}
                    <td className="px-3 py-2 align-top">
                      <select
                        value={item.service_id}
                        onChange={(e) => handleItemChange(idx, 'service_id', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="">-- Custom / Ad-hoc --</option>
                        {availableServices.map((srv) => (
                          <option key={srv.id} value={srv.id}>
                            {srv.name} (₹{srv.base_price})
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Item Name & Description */}
                    <td className="px-3 py-2 align-top space-y-1">
                      <input
                        type="text"
                        value={item.item_name}
                        onChange={(e) => handleItemChange(idx, 'item_name', e.target.value)}
                        placeholder="Item / Service Name *"
                        className="w-full px-2 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:border-blue-500"
                        required
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        placeholder="Optional description / details"
                        className="w-full px-2 py-1 text-[11px] rounded border border-slate-200 text-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </td>

                    {/* HSN / SAC */}
                    <td className="px-2 py-2 align-top">
                      <input
                        type="text"
                        value={item.hsn_sac_code}
                        onChange={(e) => handleItemChange(idx, 'hsn_sac_code', e.target.value)}
                        placeholder="e.g. 998313"
                        className="w-full px-2 py-1.5 text-xs rounded border border-slate-300 font-mono"
                      />
                    </td>

                    {/* Quantity */}
                    <td className="px-2 py-2 align-top">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs text-right rounded border border-slate-300 font-mono"
                        required
                      />
                    </td>

                    {/* Unit Price */}
                    <td className="px-2 py-2 align-top">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs text-right rounded border border-slate-300 font-mono"
                        required
                      />
                    </td>

                    {/* Tax Rate */}
                    {isTaxInvoice && (
                      <td className="px-2 py-2 align-top">
                        <select
                          value={item.tax_rate}
                          onChange={(e) => handleItemChange(idx, 'tax_rate', e.target.value)}
                          className="w-full px-1.5 py-1.5 text-xs text-right rounded border border-slate-300 font-mono bg-white"
                        >
                          <option value="0">0%</option>
                          <option value="5">5%</option>
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="28">28%</option>
                        </select>
                      </td>
                    )}

                    {/* Line Total */}
                    <td className="px-3 py-2 align-top text-right font-mono font-semibold text-slate-800">
                      ₹{lineCalc.lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Delete Item */}
                    <td className="px-2 py-2 align-top text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        disabled={items.length <= 1}
                        className="text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1"
                        title="Remove row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM: Discount, Live Summary & Remarks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Notes & Terms */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Invoice Notes & Commercial Terms
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Customer Notes / Remarks</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Thank you for your business. Project completed per agreement."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Terms & Conditions</label>
            <textarea
              rows="4"
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Discount & Totals Engine */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Commercial Summary
          </h3>

          {/* Discount Inputs */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-medium text-slate-700 block">Invoice-Level Discount</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded border border-slate-300 bg-white"
                >
                  {DISCOUNT_TYPES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="Discount value"
                  className="w-full px-2 py-1.5 text-xs text-right rounded border border-slate-300 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex justify-between py-1 text-slate-600">
              <span>Subtotal (Gross):</span>
              <span className="font-mono">
                ₹{computedTotals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {computedTotals.discountAmount > 0 && (
              <div className="flex justify-between py-1 text-amber-600">
                <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : 'Fixed'}):</span>
                <span className="font-mono">
                  -₹{computedTotals.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <div className="flex justify-between py-1 font-medium text-slate-700">
              <span>Taxable Amount:</span>
              <span className="font-mono">
                ₹{computedTotals.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {isTaxInvoice && (
              <>
                {!isInterstate ? (
                  <>
                    <div className="flex justify-between py-1 text-slate-600">
                      <span>CGST:</span>
                      <span className="font-mono">
                        ₹{computedTotals.cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 text-slate-600">
                      <span>SGST:</span>
                      <span className="font-mono">
                        ₹{computedTotals.sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>IGST (Interstate):</span>
                    <span className="font-mono">
                      ₹{computedTotals.igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1 text-slate-700 font-medium">
                  <span>Total Tax:</span>
                  <span className="font-mono">
                    ₹{computedTotals.totalTaxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between py-2 text-sm font-bold text-slate-900 border-t-2 border-slate-300">
              <span>Grand Total:</span>
              <span className="font-mono text-blue-600">
                ₹{computedTotals.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => navigate('/admin/invoices')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel & Back</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving Invoice...' : initialData ? 'Update Draft' : 'Save Invoice Draft'}</span>
        </button>
      </div>
    </form>
  );
}
