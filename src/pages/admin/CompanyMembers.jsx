import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  fetchCompanyById, 
  fetchCompanyMembers, 
  fetchAvailableProfiles, 
  fetchRoles, 
  assignUserToCompany, 
  updateCompanyMembership, 
  removeUserFromCompany 
} from '../../services/companyService';
import { usePermissions } from '../../hooks/usePermissions';
import { 
  Users, 
  ArrowLeft, 
  UserPlus, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  X,
  Building2
} from 'lucide-react';

export default function CompanyMembers() {
  const { companyId } = useParams();
  const { canManageMembers } = usePermissions();

  const [company, setCompany] = useState(null);
  const [members, setMembers] = useState([]);
  const [availableProfiles, setAvailableProfiles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Assign Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignUserId, setAssignUserId] = useState('');
  const [assignRoleId, setAssignRoleId] = useState('');
  const [assignIsPrimary, setAssignIsPrimary] = useState(false);
  const [assignIsActive, setAssignIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [comp, mems, profs, rls] = await Promise.all([
        fetchCompanyById(companyId),
        fetchCompanyMembers(companyId),
        fetchAvailableProfiles(),
        fetchRoles()
      ]);

      setCompany(comp || null);
      setMembers(mems || []);
      setAvailableProfiles(profs || []);
      setRoles(rls || []);

      // Default selected role
      const defaultRole = rls?.find((r) => r.slug === 'employee') || rls?.[0];
      if (defaultRole) {
        setAssignRoleId(defaultRole.id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load company memberships.');
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Assigning an Existing User to this Company
  const handleAssignUser = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!assignUserId) {
      setModalError('Please select a user from the registered profiles list.');
      return;
    }

    if (!assignRoleId) {
      setModalError('Please choose a valid role for this assignment.');
      return;
    }

    setIsSubmitting(true);

    try {
      await assignUserToCompany({
        user_id: assignUserId,
        company_id: company.id,
        role_id: assignRoleId,
        is_primary: assignIsPrimary,
        is_active: assignIsActive
      });

      setShowAssignModal(false);
      setAssignUserId('');
      setAssignIsPrimary(false);
      setActionSuccess('User successfully assigned to company.');
      await loadData();
    } catch (err) {
      setModalError(err.message || 'Failed to assign user to company.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Primary Status
  const handleTogglePrimary = async (membership) => {
    setError('');
    setActionSuccess('');
    try {
      const newPrimaryState = !membership.is_primary;
      await updateCompanyMembership(membership.id, {
        user_id: membership.user_id,
        is_primary: newPrimaryState
      });
      setActionSuccess(
        newPrimaryState 
          ? `Primary company set for ${membership.user?.full_name || membership.user?.email}. Other primary assignments for this user were reset.`
          : `Primary flag cleared for ${membership.user?.full_name || membership.user?.email}.`
      );
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to update primary company status.');
    }
  };

  // Change Role
  const handleChangeRole = async (membershipId, newRoleId) => {
    setError('');
    setActionSuccess('');
    try {
      await updateCompanyMembership(membershipId, { role_id: newRoleId });
      setActionSuccess('Member role updated.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to update role.');
    }
  };

  // Deactivate (Soft-Remove) Membership
  const handleDeactivateMembership = async (membership) => {
    if (!window.confirm(`Deactivate access for ${membership.user?.full_name || membership.user?.email} from ${company.name}? The user will remain in the system, but will lose access to this company.`)) {
      return;
    }

    setError('');
    setActionSuccess('');
    try {
      await removeUserFromCompany(membership.id);
      setActionSuccess('Membership deactivated (is_active = false). User remains registered.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to deactivate membership.');
    }
  };

  // Reactivate Membership
  const handleReactivateMembership = async (membershipId) => {
    setError('');
    setActionSuccess('');
    try {
      await updateCompanyMembership(membershipId, { is_active: true });
      setActionSuccess('Membership reactivated.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to reactivate membership.');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="font-mono text-xs text-slate-500 uppercase tracking-wider">
          Retrieving company membership roster...
        </p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-4">
        <Link 
          to="/admin/companies" 
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Companies</span>
        </Link>
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center shadow-sm">
          <Building2 className="w-10 h-10 text-red-300 mx-auto mb-2" />
          <h2 className="text-base font-bold text-slate-900">Company Not Found</h2>
        </div>
      </div>
    );
  }

  const hasManageRights = canManageMembers(company.id);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Link 
            to={`/admin/companies/${company.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {company.name}</span>
          </Link>
          <span className="text-slate-300">&bull;</span>
          <span className="text-xs font-mono text-slate-400">
            Domain: <span className="font-semibold text-slate-700">{company.domain?.name || 'Unassigned'}</span>
          </span>
        </div>

        {hasManageRights && (
          <button
            type="button"
            onClick={() => {
              setModalError('');
              setShowAssignModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Assign User to Company</span>
          </button>
        )}
      </div>

      {/* Title Block */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold">
              User-Company Bridge (public.user_companies)
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {company.name} &bull; Personnel &amp; Roles
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure personnel assignments, access roles, and designate primary operating entities.
            </p>
          </div>
          <div className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 shrink-0">
            Total Members: <span className="font-bold text-slate-900">{members.length}</span>
          </div>
        </div>

        {/* Action alerts */}
        {error && (
          <div className="mt-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {actionSuccess && (
          <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}
      </div>

      {/* Members List */}
      {members.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center shadow-sm">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Members Assigned</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No registered users have been mapped to this corporate entity yet.
          </p>
          {hasManageRights && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Assign First User</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5">User</th>
                  <th className="py-3.5 px-5">Email</th>
                  <th className="py-3.5 px-5">Role</th>
                  <th className="py-3.5 px-5">Primary Company</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* User */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                          {m.user?.full_name?.charAt(0) || m.user?.email?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {m.user?.full_name || 'Profile Name Not Set'}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 block truncate max-w-[200px]">
                            ID: {m.user_id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-5 font-mono text-slate-600 text-xs">
                      {m.user?.email || '—'}
                    </td>

                    {/* Role */}
                    <td className="py-4 px-5">
                      {hasManageRights ? (
                        <select
                          value={m.role_id || ''}
                          onChange={(e) => handleChangeRole(m.id, e.target.value)}
                          className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px]">
                          <ShieldCheck className="w-3 h-3 text-slate-500" />
                          <span>{m.role?.name || m.role?.slug || 'Member'}</span>
                        </span>
                      )}
                    </td>

                    {/* Primary Company */}
                    <td className="py-4 px-5">
                      {m.is_primary ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Primary</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">
                          Secondary
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      {m.is_active !== false ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-semibold">
                          <XCircle className="w-3 h-3 text-slate-400" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      {hasManageRights && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleTogglePrimary(m)}
                            className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-colors cursor-pointer ${
                              m.is_primary 
                                ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                            title={m.is_primary ? 'Unset primary company' : 'Set as user primary company'}
                          >
                            {m.is_primary ? 'Unset Primary' : 'Make Primary'}
                          </button>

                          {m.is_active !== false ? (
                            <button
                              type="button"
                              onClick={() => handleDeactivateMembership(m)}
                              className="px-2.5 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-medium transition-colors cursor-pointer"
                              title="Revoke access (is_active = false)"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleReactivateMembership(m.id)}
                              className="px-2.5 py-1 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-[11px] font-medium transition-colors cursor-pointer"
                              title="Reactivate membership"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {members.map((m) => (
              <div key={m.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">
                      {m.user?.full_name || 'Name Not Set'}
                    </span>
                    <span className="font-mono text-xs text-slate-500 block">
                      {m.user?.email || '—'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {m.is_primary && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">
                        Primary
                      </span>
                    )}
                    {m.is_active !== false ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="font-mono text-slate-500">
                    Role: {m.role?.name || m.role?.slug || 'Member'}
                  </span>
                  
                  {hasManageRights && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTogglePrimary(m)}
                        className="text-[11px] font-medium text-blue-600 hover:underline"
                      >
                        {m.is_primary ? 'Unset Primary' : 'Make Primary'}
                      </button>

                      {m.is_active !== false ? (
                        <button
                          type="button"
                          onClick={() => handleDeactivateMembership(m)}
                          className="text-[11px] font-medium text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleReactivateMembership(m.id)}
                          className="text-[11px] font-medium text-emerald-600 hover:underline"
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="p-4 bg-slate-50/70 border-t border-slate-200 text-xs font-mono text-slate-400">
            Removing a user only sets <span className="font-semibold text-slate-600">user_companies.is_active = false</span>. Their primary authentication account and profile remain intact.
          </div>

        </div>
      )}

      {/* Assign User Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Assign User to Company
                  </h3>
                  <span className="font-mono text-xs text-slate-500">
                    Target: {company.name}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleAssignUser} className="mt-5 space-y-4">
              
              {/* User Selection */}
              <div>
                <label 
                  htmlFor="assign-user"
                  className="block text-xs font-mono font-medium text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Select Registered User <span className="text-red-500">*</span>
                </label>
                <select
                  id="assign-user"
                  value={assignUserId}
                  disabled={isSubmitting}
                  onChange={(e) => setAssignUserId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Existing User Profile --</option>
                  {availableProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name ? `${p.full_name} (${p.email})` : p.email}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-400 font-mono">
                  Loaded from public.profiles. No new credentials are created here.
                </p>
              </div>

              {/* Role Selection */}
              <div>
                <label 
                  htmlFor="assign-role"
                  className="block text-xs font-mono font-medium text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Assignment Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="assign-role"
                  value={assignRoleId}
                  disabled={isSubmitting}
                  onChange={(e) => setAssignRoleId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.slug})
                    </option>
                  ))}
                </select>
              </div>

              {/* Primary Toggle */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <input
                  id="assign-is-primary"
                  type="checkbox"
                  checked={assignIsPrimary}
                  disabled={isSubmitting}
                  onChange={(e) => setAssignIsPrimary(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <label htmlFor="assign-is-primary" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Designate as Primary Company
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    A user can only have one active primary company. Checking this unsets any other primary company for this user.
                  </p>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <input
                  id="assign-is-active"
                  type="checkbox"
                  checked={assignIsActive}
                  disabled={isSubmitting}
                  onChange={(e) => setAssignIsActive(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <label htmlFor="assign-is-active" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Active Membership Status
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Permits the user to immediately access this company.
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
