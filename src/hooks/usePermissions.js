import { useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useCompany } from '../contexts/CompanyContext';
import { 
  PERMISSIONS, 
  ROLES, 
  ROLE_PERMISSIONS, 
  getRoleLabel 
} from '../config/permissions';

/**
 * Custom Hook: usePermissions
 * 
 * Centralized Role-Based Access Control (RBAC) engine for JMG Platform.
 * Connects AuthContext (user credentials & global roles) with CompanyContext
 * (active operational scope) to determine precise runtime permissions.
 */
export function usePermissions() {
  const { user, profile, roles = [] } = useAuth();
  const { 
    currentCompanyId, 
    availableCompanies = [], 
    isAllCompanies 
  } = useCompany();

  // 1. Is user a universal Group Owner / Super Admin?
  const isGroupOwner = useMemo(() => {
    return Array.isArray(roles) && roles.includes(ROLES.GROUP_OWNER);
  }, [roles]);

  // 2. Active membership context in current company
  const currentMembership = useMemo(() => {
    if (!currentCompanyId || isAllCompanies) return null;
    return availableCompanies.find(
      (c) => c.id === currentCompanyId || c.slug === currentCompanyId
    ) || null;
  }, [currentCompanyId, isAllCompanies, availableCompanies]);

  // 3. Resolve active effective role
  const role = useMemo(() => {
    if (isGroupOwner) {
      return ROLES.GROUP_OWNER;
    }
    if (currentMembership?.role?.slug) {
      return currentMembership.role.slug;
    }
    if (roles.includes(ROLES.COMPANY_MANAGER)) {
      return ROLES.COMPANY_MANAGER;
    }
    return ROLES.EMPLOYEE;
  }, [isGroupOwner, currentMembership, roles]);

  const isCompanyManager = role === ROLES.COMPANY_MANAGER;
  const isEmployee = role === ROLES.EMPLOYEE;
  const roleLabel = getRoleLabel(role);

  // 4. Resolve granted permissions for active role
  const permissions = useMemo(() => {
    return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ROLES.EMPLOYEE];
  }, [role]);

  // 5. Permission Check Helpers
  const hasPermission = useCallback((permission) => {
    if (!permission) return false;
    // Group Owner has universal access to all permissions
    if (isGroupOwner) return true;
    return permissions.includes(permission);
  }, [isGroupOwner, permissions]);

  const hasAnyPermission = useCallback((perms = []) => {
    if (!Array.isArray(perms) || perms.length === 0) return false;
    if (isGroupOwner) return true;
    return perms.some((p) => permissions.includes(p));
  }, [isGroupOwner, permissions]);

  const hasAllPermissions = useCallback((perms = []) => {
    if (!Array.isArray(perms)) return false;
    if (perms.length === 0) return true;
    if (isGroupOwner) return true;
    return perms.every((p) => permissions.includes(p));
  }, [isGroupOwner, permissions]);

  // 6. Company Scope Verification (Section 10)
  const canAccessCompany = useCallback((targetCompanyId) => {
    if (!targetCompanyId) return false;

    // All Companies mode is restricted exclusively to Group Owner
    if (targetCompanyId === 'ALL') {
      return isGroupOwner;
    }

    // Group Owner can access any active company
    if (isGroupOwner) {
      return true;
    }

    // Company Manager & Employee must have an active membership for this target company
    return availableCompanies.some(
      (c) => (c.id === targetCompanyId || c.slug === targetCompanyId) && c.is_active !== false
    );
  }, [isGroupOwner, availableCompanies]);

  // 7. Backward-compatible helpers for existing modules
  const canCreateCompany = isGroupOwner || hasPermission(PERMISSIONS.COMPANIES_CREATE);
  
  const canEditCompany = useCallback((companyId) => {
    if (!hasPermission(PERMISSIONS.COMPANIES_EDIT)) return false;
    return canAccessCompany(companyId);
  }, [hasPermission, canAccessCompany]);

  const canDeactivateCompany = isGroupOwner || hasPermission(PERMISSIONS.COMPANIES_DEACTIVATE);

  const canManageMembers = useCallback((companyId) => {
    if (!hasPermission(PERMISSIONS.MEMBERS_VIEW)) return false;
    return canAccessCompany(companyId);
  }, [hasPermission, canAccessCompany]);

  return {
    // Core RBAC State
    role,
    roleLabel,
    permissions,
    isGroupOwner,
    isCompanyManager,
    isEmployee,
    userProfile: profile,
    authUser: user,

    // Permission Check Functions
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessCompany,

    // Backward-Compatibility Helpers
    isSuperAdmin: isGroupOwner,
    canCreateCompany,
    canEditCompany,
    canDeactivateCompany,
    canManageMembers
  };
}
