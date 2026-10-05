import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  getEnquiryById, 
  updateEnquiry,
  EnquiryForm 
} from '../../features/enquiries';
import { 
  ArrowLeft, 
  Edit3, 
  AlertCircle, 
  HelpCircle 
} from 'lucide-react';

export default function EnquiryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { availableCompanies } = useCompany();
  const { hasPermission } = usePermissions();

  const [enquiry, setEnquiry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setIsLoading(true);
      setError('');
      try {
        const enq = await getEnquiryById(id);
        if (mounted) {
          if (!enq) {
            setError(`Enquiry record "${id}" was not found.`);
          } else {
            setEnquiry(enq);
          }
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load enquiry.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!hasPermission(PERMISSIONS.ENQUIRIES_EDIT)) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl border border-red-200 text-center shadow-xs">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h1 className="text-base font-bold text-slate-900">Access Denied</h1>
        <p className="text-xs text-slate-600 mt-1">
          You do not have administrative permissions to edit enquiry records.
        </p>
        <Link 
          to="/admin/enquiries" 
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
        >
          Return to Enquiries
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-12 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
          Loading Enquiry Record...
        </p>
      </div>
    );
  }

  if (error && !enquiry) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl border border-red-200 text-center shadow-xs">
        <HelpCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h1 className="text-base font-bold text-slate-900">Enquiry Not Found</h1>
        <p className="text-xs text-slate-600 mt-1">{error}</p>
        <Link 
          to="/admin/enquiries" 
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
        >
          Back to Enquiries
        </Link>
      </div>
    );
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');

    try {
      await updateEnquiry(enquiry.id, formData);
      navigate(`/admin/enquiries/${enquiry.id}`);
    } catch (err) {
      setError(err.message || 'Failed to update enquiry record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div>
        <Link 
          to={`/admin/enquiries/${enquiry.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Profile</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                Edit Enquiry
              </h1>
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {enquiry.enquiry_code}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Update contact information, requested service, assignment, or pipeline priority.
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

      {/* Enquiry Form */}
      <EnquiryForm
        initialData={enquiry}
        companies={availableCompanies}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEdit={true}
      />
    </div>
  );
}
