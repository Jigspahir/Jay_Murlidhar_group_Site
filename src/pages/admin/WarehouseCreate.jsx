import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { createWarehouse, WarehouseForm } from '../../features/inventory';
import { Warehouse, AlertCircle } from 'lucide-react';

export default function WarehouseCreate() {
  const navigate = useNavigate();
  const { currentCompanyId, isAllCompanies } = useCompany();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (warehouseData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { data, error: createError } = await createWarehouse(warehouseData);
      if (createError) throw new Error(createError);
      navigate(`/admin/warehouses/${data.id}`);
    } catch (err) {
      console.error('Error creating warehouse:', err);
      setError(err.message || 'Failed to create warehouse');
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
          Please select a specific company from the top company switcher before creating a warehouse. Warehouses belong to a single company.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Warehouse className="w-7 h-7 text-blue-600" />
          Create New Warehouse
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Add a storage location, godown, or retail showroom counter for physical inventory holding.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <WarehouseForm
        companyId={currentCompanyId}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
