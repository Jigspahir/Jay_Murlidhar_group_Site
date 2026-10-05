import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchCompanies, fetchDomains } from '../../services/companyService';
import { usePermissions } from '../../hooks/usePermissions';
import { 
  Building2, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Users, 
  ExternalLink, 
  CheckCircle2, 
  XCircle,
  Edit3
} from 'lucide-react';

export default function CompanyList() {
  const { canCreateCompany, canEditCompany, canManageMembers } = usePermissions();

  const [companies, setCompanies] = useState([]);
  const [domains, setDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [compData, domData] = await Promise.all([
          fetchCompanies(),
          fetchDomains()
        ]);
        if (mounted) {
          setCompanies(compData || []);
          setDomains(domData || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load companies.');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      // Search matching name, legal name, or slug
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        company.name?.toLowerCase().includes(q) ||
        company.legal_name?.toLowerCase().includes(q) ||
        company.slug?.toLowerCase().includes(q);

      // Domain matching
      const matchesDomain = selectedDomain === 'all' || 
        company.domain_id === selectedDomain ||
        company.domain?.slug === selectedDomain;

      // Status matching
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && company.is_active !== false) ||
        (statusFilter === 'inactive' && company.is_active === false);

      return matchesSearch && matchesDomain && matchesStatus;
    });
  }, [companies, searchQuery, selectedDomain, statusFilter]);

  // Color mapping for canonical domains
  const getDomainBadge = (domain) => {
    const slug = domain?.slug || '';
    switch (slug) {
      case 'technology':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'jan-suvidha':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'insurance':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'business-services':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'travel':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'retail':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight">
            Companies
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage companies connected to the JMG business ecosystem.
          </p>
        </div>

        {canCreateCompany && (
          <Link
            to="/admin/companies/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Company</span>
          </Link>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name, legal name, or slug..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Filter:</span>
          </div>

          {/* Domain Dropdown */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Domains</option>
            {domains.map((dom) => (
              <option key={dom.id} value={dom.id}>
                {dom.name}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="font-mono text-xs text-slate-500 uppercase tracking-wider">
            Loading companies from database...
          </p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center shadow-sm">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No companies found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedDomain !== 'all' || statusFilter !== 'all'
              ? 'No companies matched your current search and filter criteria.'
              : 'No companies are currently registered in the database.'}
          </p>
          {(searchQuery || selectedDomain !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDomain('all');
                setStatusFilter('all');
              }}
              className="mt-4 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        /* Company List / Table */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5">Company Name</th>
                  <th className="py-3.5 px-5">Domain</th>
                  <th className="py-3.5 px-5">Slug</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Created Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredCompanies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Company Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <Link 
                            to={`/admin/companies/${c.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
                          >
                            {c.name}
                          </Link>
                          {c.legal_name && (
                            <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                              {c.legal_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Domain */}
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border ${getDomainBadge(c.domain)}`}>
                        {c.domain?.name || 'Unassigned'}
                      </span>
                    </td>

                    {/* Slug */}
                    <td className="py-4 px-5 font-mono text-slate-500 text-[11px]">
                      {c.slug}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      {c.is_active !== false ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-semibold">
                          <XCircle className="w-3 h-3 text-slate-400" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-5 font-mono text-slate-500 text-[11px]">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : '—'}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/companies/${c.id}`}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
                          title="View Company Details"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View</span>
                        </Link>

                        {canManageMembers(c.id) && (
                          <Link
                            to={`/admin/companies/${c.id}/members`}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
                            title="Manage Members"
                          >
                            <Users className="w-3 h-3" />
                            <span>Members</span>
                          </Link>
                        )}

                        {canEditCompany(c.id) && (
                          <Link
                            to={`/admin/companies/${c.id}/edit`}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-blue-700 hover:bg-blue-50 text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
                            title="Edit Metadata"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View (Responsive Stacked Rows) */}
          <div className="lg:hidden divide-y divide-slate-100">
            {filteredCompanies.map((c) => (
              <div key={c.id} className="p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <Link 
                        to={`/admin/companies/${c.id}`}
                        className="font-bold text-slate-900 hover:text-blue-600 text-sm transition-colors block"
                      >
                        {c.name}
                      </Link>
                      <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
                        {c.slug}
                      </span>
                    </div>
                  </div>

                  {c.is_active !== false ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold">
                      Inactive
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${getDomainBadge(c.domain)}`}>
                    {c.domain?.name || 'Unassigned'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Created: {c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN') : '—'}
                  </span>
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Link
                    to={`/admin/companies/${c.id}`}
                    className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 text-center text-xs font-medium hover:bg-slate-50"
                  >
                    View
                  </Link>
                  {canManageMembers(c.id) && (
                    <Link
                      to={`/admin/companies/${c.id}/members`}
                      className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 text-center text-xs font-medium hover:bg-slate-50 flex items-center justify-center gap-1"
                    >
                      <Users className="w-3 h-3" />
                      <span>Members</span>
                    </Link>
                  )}
                  {canEditCompany(c.id) && (
                    <Link
                      to={`/admin/companies/${c.id}/edit`}
                      className="py-1.5 px-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-center text-xs font-medium hover:bg-blue-100"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* List Footer */}
          <div className="p-4 bg-slate-50/70 border-t border-slate-200 text-xs font-mono text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              Showing {filteredCompanies.length} of {companies.length} connected {companies.length === 1 ? 'company' : 'companies'}
            </span>
            <span className="text-[11px] text-slate-400">
              JMG Multi-Company Ecosystem &bull; Phase 4 Company Management
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
