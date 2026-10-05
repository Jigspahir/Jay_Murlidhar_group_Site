import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  createCompany, 
  fetchDomains, 
  generateSlug 
} from '../../services/companyService';
import { usePermissions } from '../../hooks/usePermissions';
import { 
  ArrowLeft, 
  Plus, 
  AlertTriangle, 
  Building2, 
  Sparkles
} from 'lucide-react';

export default function CompanyCreate() {
  const navigate = useNavigate();
  const { canCreateCompany } = usePermissions();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [domainId, setDomainId] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Available Domains from DB
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function loadDomains() {
      setIsLoading(true);
      try {
        const doms = await fetchDomains();
        if (mounted) {
          setDomains(doms || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to retrieve available domains.');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadDomains();
    return () => {
      mounted = false;
    };
  }, []);

  const generatedSlug = generateSlug(name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Company display name is required.');
      return;
    }

    if (!generatedSlug) {
      setError('A valid slug could not be generated from the given name.');
      return;
    }

    if (!domainId) {
      setError('Please select an active business domain.');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await createCompany({
        name: name.trim(),
        legal_name: legalName.trim(),
        domain_id: domainId,
        description: description.trim(),
        logo_url: logoUrl.trim(),
        is_active: isActive
      });

      navigate(`/admin/companies/${created.id}`);
    } catch (err) {
      setError(err.message || 'Unable to create company.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canCreateCompany) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-8 text-center shadow-sm">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-2" />
        <h2 className="text-base font-bold text-slate-900">Permission Denied</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Only Group Owners / Super Admins have permission to register new companies into the JMG ecosystem.
        </p>
        <Link
          to="/admin/companies"
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900"
        >
          Return to Companies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link 
          to="/admin/companies" 
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Companies</span>
        </Link>
        <span className="text-xs font-mono text-slate-400">
          New Entity Setup
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Register New JMG Company
            </h1>
            <p className="text-xs text-slate-500">
              Establish a new connected corporate entity within the group ecosystem.
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label 
                htmlFor="new-company-name"
                className="block text-xs font-mono font-medium text-slate-700 uppercase tracking-wider mb-2"
              >
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="new-company-name"
                type="text"
                value={name}
                disabled={isSubmitting}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jay Murlidhar Cloud Systems"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Legal Registered Name */}
            <div>
              <label 
                htmlFor="new-legal-name"
                className="block text-xs font-mono font-medium text-slate-700 uppercase tracking-wider mb-2"
              >
                Legal Entity Name
              </label>
              <input
                id="new-legal-name"
                type="text"
                value={legalName}
                disabled={isSubmitting}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="e.g. Jay Murlidhar Cloud Systems Pvt. Ltd."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slug Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label 
                  htmlFor="new-slug"
                  className="block text-xs font-mono font-medium text-slate-700 uppercase tracking-wider"
                >
                  System Generated Slug
                </label>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <span>Auto-computed</span>
                </span>
              </div>
              <input
                id="new-slug"
                type="text"
                value={generatedSlug}
                readOnly
                placeholder="auto-generated-from-name"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-mono text-slate-600 select-all"
              />
              <p className="mt-1 text-[11px] text-slate-400 font-mono">
                Permanent unique URL and database identifier.
              </p>
            </div>

            {/* Domain Selection */}
            <div>
              <label 
                htmlFor="new-domain"
                className="block text-xs font-mono font-medium text-slate-700 uppercase tracking-wider mb-2"
              >
                Business Domain <span className="text-red-500">*</span>
              </label>
              <select
                id="new-domain"
                value={domainId}
                disabled={isSubmitting || isLoading}
                onChange={(e) => setDomainId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Choose Existing Domain --</option>
                {domains.map((dom) => (
                  <option key={dom.id} value={dom.id}>
                    {dom.name} ({dom.slug})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-slate-400 font-mono">
                Must be an existing active domain in the JMG platform.
              </p>
            </div>
          </div>

          {/* Logo URL */}
          <div>
            <label 
              htmlFor="new-logo-url"
              className="block text-xs font-mono font-medium text-slate-700 uppercase tracking-wider mb-2"
            >
              Logo URL (Optional)
            </label>
            <input
              id="new-logo-url"
              type="url"
              value={logoUrl}
              disabled={isSubmitting}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label 
              htmlFor="new-description"
              className="block text-xs font-mono font-medium text-slate-700 uppercase tracking-wider mb-2"
            >
              Operational Scope &amp; Summary
            </label>
            <textarea
              id="new-description"
              rows={3}
              value={description}
              disabled={isSubmitting}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of core business services, target clientele, and operational mandates..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Active Status */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <input
              id="new-active-status"
              type="checkbox"
              checked={isActive}
              disabled={isSubmitting}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <div>
              <label htmlFor="new-active-status" className="text-xs font-bold text-slate-800 cursor-pointer">
                Initial Status: Active
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Enable immediately for corporate access and member assignment.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/admin/companies"
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
                  <span>Registering Entity...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Company</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
