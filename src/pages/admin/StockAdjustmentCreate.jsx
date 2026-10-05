import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import {
  createStockAdjustment,
  getWarehouses,
  getProducts,
  StockAdjustmentForm
} from '../../features/inventory';
import { Sliders, AlertCircle } from 'lucide-react';

export default function StockAdjustmentCreate() {
  const navigate = useNavigate();
  const { currentCompanyId, isAllCompanies } = useCompany();

  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!currentCompanyId) return;
      setIsLoading(true);
      try {
        const [whRes, prodRes] = await Promise.all([
          getWarehouses({ companyId: currentCompanyId, status: 'active', pageSize: 50 }),
          getProducts({ companyId: currentCompanyId, status: 'active', pageSize: 100 })
        ]);
        setWarehouses(whRes.data || []);
        setProducts(prodRes.data || []);
      } catch (err) {
        console.error('Error loading adjustment data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [currentCompanyId]);

  const handleSubmit = async ({ adjustmentHeader, items }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { data, error: createError } = await createStockAdjustment(adjustmentHeader, items);
      if (createError) throw new Error(createError);
      navigate(`/admin/inventory/adjustments/${data.id}`);
    } catch (err) {
      console.error('Error creating stock adjustment:', err);
      setError(err.message || 'Failed to create adjustment');
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
          Please select a specific company to create a stock adjustment.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-4xl mx-auto">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Preparing Adjustment Form...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-7 h-7 text-blue-600" />
          Create Stock Adjustment
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Perform a physical count adjustment, write off damaged goods, or establish initial opening stock.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <StockAdjustmentForm
        companyId={currentCompanyId}
        warehouses={warehouses}
        products={products}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
