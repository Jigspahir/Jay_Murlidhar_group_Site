import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../config/permissions';
import { 
  getServiceById, 
  deactivateService, 
  reactivateService,
  BILLING_TYPES
} from '../../features/services';
import { 
  Building2, 
  Layers, 
  ArrowLeft, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Tag, 
  IndianRupee, 
  Clock, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function ServiceProfile() {
  const { id } = useParams();
  const { hasPermission } = usePermissions();

  const canEdit = hasPermission(PERMISSIONS.SERVICES_EDIT);
  const canDelete = hasPermission(PERMISSIONS.SERVICES_DELETE);

  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');
  const [isProcessingStatus, setIsProcessingStatus] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getServiceById(id);
      if (!data) {
        setError(`Service record "${id}" could not be located.`);
      } else {
        setService(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve service record.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleStatus = async () => {
    if (!service) return;
    setIsProcessingStatus(true);
    setActionSuccess('');

    try {
      if (service.status === 'active') {
        await deactivateService(service.id);
        setActionSuccess('Service offering deactivated successfully.');
      } else {
        await reactivateService(service.id);
        setActionSuccess('Service offering reactivated successfully.');
      }
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to update service status.');
    } finally {
      setIsProcessingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto my-12 p-12 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
          Loading Service Profile...
        </p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl border border-red-200 text-center shadow-xs">
        <Layers className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h1 className="text-base font-bold text-slate-900">Service Record Not Found</h1>
        <p className="text-xs text-slate-600 mt-1">{error || 'The requested service does not exist or access is restricted.'}</p>
        <Link 
          to="/admin/services" 
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
        >
          Return to Service Master
        </Link>
      </div>
    );
  }

  const isActive = service.status === 'active';
  const billingLabel = BILLING_TYPES.find((b) => b.value === service.billing_type)?.label || service.billing_type;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link 
          to="/admin/services" 
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Services</span>
        </Link>

        <div className="flex items-center gap-2.5">
          {canEdit && (
            <Link
              to={`/admin/services/${service.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-600" />
              <span>Edit Service</span>
            </Link>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={isProcessingStatus}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
                isActive
                  ? 'border border-red-200 text-red-700 hover:bg-red-50'
                  : 'border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {isActive ? (
                <>
                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                  <span>{isProcessingStatus ? 'Updating...' : 'Deactivate'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isProcessingStatus ? 'Updating...' : 'Reactivate'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Success notification */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Layers className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {service.service_name}
                </h1>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                  {service.service_code}
                </span>
                {isActive ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Active Offering
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    <XCircle className="w-3 h-3 text-slate-400" />
                    Inactive / Archived
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {service.company?.name || 'Assigned Operating Company'}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {service.category || 'General'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {billingLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Highlight Pill */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-right shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
              Base Reference Price
            </span>
            <div className="text-xl font-mono font-bold text-slate-900 mt-0.5">
              {service.billing_type === 'quote_based'
                ? service.base_price > 0 ? `From ₹${Number(service.base_price).toLocaleString('en-IN')}` : 'Quote Based'
                : service.base_price === 0 ? 'Free / Citizen Scheme' : `₹${Number(service.base_price).toLocaleString('en-IN')}`}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Model: {billingLabel}
            </span>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Description */}
          <div className="md:col-span-2 space-y-2">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
              Description &amp; Operational Scope
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {service.description || 'No detailed description provided for this service catalog item.'}
            </p>
          </div>

          {/* Company Details */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
              Operating Company
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
              <div className="font-bold text-slate-900">{service.company?.name}</div>
              <div className="text-[11px] text-slate-500">{service.company?.legal_name}</div>
              <div className="text-[11px] font-mono text-blue-600 font-medium">Slug: {service.company?.slug}</div>
            </div>
          </div>
        </div>

        {/* Audit Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-100 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Created: {new Date(service.created_at).toLocaleString('en-IN')}</span>
          </div>
          {service.updated_at && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Last Updated: {new Date(service.updated_at).toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
