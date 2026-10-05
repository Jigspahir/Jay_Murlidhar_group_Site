import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import {
  createGoodsReceipt,
  receiveGoodsReceipt,
  getWarehouses,
  getProducts,
  GoodsReceiptForm
} from '../../features/inventory';
import { getVendors } from '../../features/vendors/vendorService';
import { getPurchaseOrders } from '../../features/purchaseOrders/purchaseOrderService';
import { Truck, AlertCircle } from 'lucide-react';

export default function GoodsReceiptCreate() {
  const navigate = useNavigate();
  const { currentCompanyId, isAllCompanies } = useCompany();

  const [warehouses, setWarehouses] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFormData() {
      if (!currentCompanyId) return;
      setIsLoading(true);
      try {
        const [whRes, vendRes, poRes, prodRes] = await Promise.all([
          getWarehouses({ companyId: currentCompanyId, status: 'active', pageSize: 50 }),
          getVendors({ companyId: currentCompanyId, status: 'active', pageSize: 100 }),
          getPurchaseOrders({ companyId: currentCompanyId, pageSize: 50 }),
          getProducts({ companyId: currentCompanyId, status: 'active', pageSize: 100 })
        ]);

        setWarehouses(whRes.data || []);
        setVendors(vendRes.data || []);
        setPurchaseOrders((poRes.data || []).filter(p => ['approved', 'issued', 'partially_billed'].includes(p.status)));
        setProducts(prodRes.data || []);
      } catch (err) {
        console.error('Error loading GRN form data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadFormData();
  }, [currentCompanyId]);

  const handleSubmit = async ({ grnHeader, items, receiveImmediately }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // 1. Create GRN
      const { data: grn, error: grnError } = await createGoodsReceipt(grnHeader, items);
      if (grnError) throw new Error(grnError);

      // 2. If immediate receipt, trigger stock in
      if (receiveImmediately) {
        const serialsByProduct = {};
        items.forEach((it) => {
          if (it.serials && it.serials.length > 0) {
            serialsByProduct[it.product_id] = it.serials;
          }
        });

        const { error: rxError } = await receiveGoodsReceipt(grn.id, { serialsByProduct });
        if (rxError) throw new Error(rxError);
      }

      navigate(`/admin/inventory/receipts/${grn.id}`);
    } catch (err) {
      console.error('Error submitting goods receipt:', err);
      setError(err.message || 'Failed to submit goods receipt');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAllCompanies) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-amber-900 mb-1">Company Selection Required</h3>
        <p className="text-xs text-amber-700">
          Please select a specific company from the top switcher to record a Goods Receipt.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-4xl mx-auto">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Preparing Goods Receipt Form...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Truck className="w-7 h-7 text-blue-600" />
          Record Goods Receipt (Stock Inward)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Verify physical delivery, record quantities received, and enter serial numbers for serialized devices.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <GoodsReceiptForm
        companyId={currentCompanyId}
        warehouses={warehouses}
        vendors={vendors}
        purchaseOrders={purchaseOrders}
        products={products}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
