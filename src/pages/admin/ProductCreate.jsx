import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import {
  createProduct,
  getProductCategories,
  ProductForm
} from '../../features/inventory';
import { Package, AlertCircle } from 'lucide-react';

export default function ProductCreate() {
  const navigate = useNavigate();
  const { currentCompanyId, isAllCompanies } = useCompany();

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      if (currentCompanyId) {
        const { data } = await getProductCategories(currentCompanyId);
        setCategories(data || []);
      }
    }
    loadCategories();
  }, [currentCompanyId]);

  const handleSubmit = async (productData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { data, error: createError } = await createProduct(productData);
      if (createError) throw new Error(createError);
      navigate(`/admin/products/${data.id}`);
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message || 'Failed to create product');
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
          Please select a specific company from the top company switcher before creating a product. Products belong to a single legal entity.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Package className="w-7 h-7 text-blue-600" />
          Create New Product
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Register a physical product in the catalog with unique SKU, barcode, unit of measure, and default pricing.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <ProductForm
        companyId={currentCompanyId}
        categories={categories}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
