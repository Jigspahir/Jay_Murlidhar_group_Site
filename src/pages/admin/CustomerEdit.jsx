import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  getCustomerById, 
  updateCustomer 
} from '../../features/customers/customerService';
import CustomerForm from '../../features/customers/CustomerForm';
import { 
  ArrowLeft, 
  Edit3, 
  AlertCircle, 
  Building2 
} from 'lucide-react';

export default function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { availableCompanies } = useCompany();
  const { hasPermission } = usePermissions();

  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setIsLoading(true);
      setError('');
      try {
        const cus = await getCustomerById(id);
        if (mounted) {
          if (!cus) {
            setError(`Customer record "${id}" was not found.`);
          } else {
            setCustomer(cus);
          }
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load customer.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!hasPermission(PERMISSIONS.CUSTOMERS_EDIT)) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl border border-red-200 text-center shadow-xs">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h1 className="text-base font-bold text-slate-900">Access Denied</h1>
        <p className="text-xs text-slate-600 mt-1">
          You do not have administrative permissions to edit customer records.
        </p>
        <Link 
          to="/admin/customers" 
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
        >
          Return to Customer Directory
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-12 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
          Loading Customer Record...
        </p>
      </div>
    );
  }

  if (error && !customer) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl border border-red-200 text-center shadow-xs">
        <Building2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h1 className="text-base font-bold text-slate-900">Customer Not Found</h1>
        <p className="text-xs text-slate-600 mt-1">{error}</p>
        <Link 
          to="/admin/customers" 
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
        >
          Back to Customer Directory
        </Link>
      </div>
    );
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');

    try {
      await updateCustomer(customer.id, formData);
      navigate(`/admin/customers/${customer.id}`);
    } catch (err) {
      setError(err.message || 'Failed to update customer record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div>
        <Link 
          to={`/admin/customers/${customer.id}`} 
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Profile</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Edit Customer: {customer.display_name}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Code: <span className="text-blue-600 font-bold">{customer.customer_code}</span> &bull; {customer.company?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Customer Form */}
      <CustomerForm
        initialData={customer}
        companies={availableCompanies}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEdit={true}
      />

    </div>
  );
}
