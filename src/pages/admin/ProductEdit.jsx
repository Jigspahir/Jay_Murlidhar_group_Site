import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import {
  getProductById,
  updateProduct,
  getProductCategories,
  ProductForm
} from '../../features/inventory';
import { Package, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentCompanyId } = useCompany();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [prodRes, catsRes] = await Promise.all([
          getProductById(id),
          getProductCategories(currentCompanyId)
        ]);

        if (prodRes.error) throw new Error(prodRes.error);
        setProduct(prodRes.data);
        setCategories(catsRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id, currentCompanyId]);

  const handleSubmit = async (updatedData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { data, error: updateError } = await updateProduct(id, updatedData);
      if (updateError) throw new Error(updateError);
      navigate(`/admin/products/${id}`);
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-4xl mx-auto">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Loading product for editing...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Package className="w-7 h-7 text-blue-600" />
          Edit Product: {product?.product_name}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Code: <span className="font-mono font-semibold">{product?.product_code}</span> &bull; Modifying Product Master default prices does not affect historical invoices or bills.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <ProductForm
        initialData={product}
        companyId={product?.company_id || currentCompanyId}
        categories={categories}
        isEdit={true}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
