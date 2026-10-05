import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  fetchCompanyById, 
  fetchDomains, 
  updateCompany, 
  deactivateCompany 
} from '../../services/companyService';
import { usePermissions } from '../../hooks/usePermissions';
import { 
  ArrowLeft, 
  Save, 
  AlertTriangle, 
  CheckCircle2, 
  Lock,
  Building2,
  Trash2
} from 'lucide-react';

export default function CompanyEdit() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { canEditCompany, canDeactivateCompany } = usePermissions();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [slug, setSlug] = useState('');
  const [domainId, setDomainId] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Available Domains
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setIsLoading(true);
      setError('');
      try {
        const [comp, doms] = await Promise.all([
          fetchCompanyById(companyId),
          fetchDomains()
        ]);

        if (mounted) {
          if (!comp) {
            setError(`Company "${companyId}" could not be located.`);
          } else {
            setName(comp.name || '');
            setLegalName(comp.legal_name || '');
            setSlug(comp.slug || '');
            setDomainId(comp.domain_id || comp.domain?.id || '');
            setDescription(comp.description || '');
            setLogoUrl(comp.logo_url || '');
            setIsActive(comp.is_active !== false);
          }
          setDomains(doms || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load company details.');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [companyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setError('Company name is required.');
      return;
    }

    if (!domainId) {
      setError('A valid domain assignment is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateCompany(companyId, {
        name,
        legal_name: legalName,
        domain_id: domainId,
        description,
        logo_url: logoUrl,
        is_active: isActive
      });

      setSuccessMessage('Company details updated successfully.');
      setTimeout(() => {
        navigate(`/admin/companies/${companyId}`);
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to update company.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate this company? It will remain in the database with historical records preserved, but will be disabled from active selection.')) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await deactivateCompany(companyId);
      setIsActive(false);
      setSuccessMessage('Company has been deactivated (is_active = false). Historical records preserved.');
    } catch (err) {
      setError(err.message || 'Failed to deactivate company.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="font-mono text-xs text-slate-500 uppercase tracking-wider">
          Loading company editor...
        </p>
      </div>
    );
  }

  // Permission authorization check
  if (!canEditCompany(companyId)) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-8 text-center shadow-sm">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-2" />
        <h2 className="text-base font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          You do not have administrative permissions to modify this company.
        </p>
        <Link
          to={`/admin/companies/${companyId}`}
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900"
        >
          Back to Overview
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link 
          to={`/admin/companies/${companyId}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Company Details</span>
        </Link>
        <span className="text-xs font-mono text-slate-400">
          Editing Entity: <span className="font-bold text-slate-700">{slug}</span>
        </span>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Edit Company Metadata
            </h1>
            <p className="text-xs text-slate-500">
              Update operational records and legal attributes for this business entity.
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label 
                htmlFor="edit-company-name"
                className="block text-xs font-mono font-medium text-slate-700 uppercase tracking-wider mb-2"
              >
                Company Display Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-company-name"
                type="text"
                value={name}
                disabled={isSubmitting}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jay Murlidhar Tech Solutions"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Legal Registered Name */}
            <div>
              <label 
                htmlFor="edit-legal-name"
                className="block text-xs font-mono font-medium text-slate-700 uppercase tracking-wider mb-2"
              >
                Legal Registered Entity Name
              </label>
              <input
                id="edit-legal-name"
                type="text"
                value={legalName}
                disabled={isSubmitting}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="e.g. Jay Murlidhar Tech Solutions Pvt. Ltd."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slug (Strictly Read-Only) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label 
                  htmlFor="edit-slug"
                  className="block text-xs font-mono font-medium text-slate-700 uppercase tracking-wider"
                >
                  Canonical Slug Identifier
                </label>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Immutable</span>
                </span>
              </div>
              <input
                id="edit-slug"
                type="text"
                value={slug}
                disabled
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-mono text-slate-500 cursor-not-allowed"
              />
              <p className="mt-1 text-[11px] text-slate-400 font-mono">
                Slugs are permanent system identifiers and cannot be altered casually.
              </p>
            </div>

            {/* JMG Domain Mapping */}
            <div>
              <label 
                htmlFor="edit-domain"
                className="block text-xs font-mono font-medium text-slate-700 uppercase tracking-wider mb-2"
              >
                Assigned Business Domain <span className="text-red-500">*</span>
              </label>
              <select
                id="edit-domain"
                value={domainId}
                disabled={isSubmitting}
                onChange={(e) => setDomainId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Select Valid Domain --</option>
                {domains.map((dom) => (
                  <option key={dom.id} value={dom.id}>
                    {dom.name} ({dom.slug})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-slate-400 font-mono">
                Only valid existing domains from the database can be selected.
              </p>
            </div>
          </div>

          {/* Logo URL */}
          <div>
            <label 
              htmlFor="edit-logo-url"
              className="block text-xs font-mono font-medium text-slate-700 uppercase tracking-wider mb-2"
            >
              Logo / Icon Resource URL
            </label>
            <input
              id="edit-logo-url"
              type="url"
              value={logoUrl}
              disabled={isSubmitting}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/assets/logo.png"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label 
              htmlFor="edit-description"
              className="block text-xs font-mono font-medium text-slate-700 uppercase tracking-wider mb-2"
            >
              Operational Scope &amp; Description
            </label>
            <textarea
              id="edit-description"
              rows={4}
              value={description}
              disabled={isSubmitting}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a descriptive overview of company operations..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Active Status Checkbox */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <input
              id="edit-active-status"
              type="checkbox"
              checked={isActive}
              disabled={isSubmitting}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <div>
              <label htmlFor="edit-active-status" className="text-xs font-bold text-slate-800 cursor-pointer">
                Active Operational Status (is_active)
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                When enabled, the company is visible and selectable for day-to-day operations. When unchecked, it is preserved in the database for historical and auditing continuity.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {canDeactivateCompany && isActive && (
                <button
                  type="button"
                  onClick={handleDeactivate}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Deactivate Entity</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 justify-end">
              <Link
                to={`/admin/companies/${companyId}`}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
