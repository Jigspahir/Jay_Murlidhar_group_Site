import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { getWarehouseById, updateWarehouse, WarehouseForm } from '../../features/inventory';
import { Warehouse, AlertCircle } from 'lucide-react';

export default function WarehouseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentCompanyId } = useCompany();

  const [warehouse, setWarehouse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadWarehouse() {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await getWarehouseById(id);
        if (fetchError) throw new Error(fetchError);
        setWarehouse(data);
      } catch (err) {
        setError(err.message || 'Failed to load warehouse');
      } finally {
        setIsLoading(false);
      }
    }
    loadWarehouse();
  }, [id]);

  const handleSubmit = async (updatedData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { data, error: updateError } = await updateWarehouse(id, updatedData);
      if (updateError) throw new Error(updateError);
      navigate(`/admin/warehouses/${id}`);
    } catch (err) {
      console.error('Error updating warehouse:', err);
      setError(err.message || 'Failed to update warehouse');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-3xl mx-auto">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Loading warehouse for editing...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Warehouse className="w-7 h-7 text-blue-600" />
          Edit Warehouse: {warehouse?.warehouse_name}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Code: <span className="font-mono font-semibold">{warehouse?.warehouse_code}</span> &bull; Company: {warehouse?.companies?.name}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <WarehouseForm
        initialData={warehouse}
        companyId={warehouse?.company_id || currentCompanyId}
        isEdit={true}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
