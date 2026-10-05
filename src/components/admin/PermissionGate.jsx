import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

/**
 * UI Permission Guard: PermissionGate
 * 
 * Conditionally renders child components based on user's active RBAC permissions,
 * role, and company scope. Renders fallback or null if unauthorized.
 */
export default function PermissionGate({
  permission,
  anyOf = [],
  allOf = [],
  requiredRole,
  companyId,
  fallback = null,
  children
}) {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    role, 
    isGroupOwner, 
    canAccessCompany 
  } = usePermissions();

  // 1. Role Check
  if (requiredRole) {
    const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!rolesArray.includes(role) && !isGroupOwner) {
      return fallback;
    }
  }

  // 2. Single Permission Check
  if (permission && !hasPermission(permission)) {
    return fallback;
  }

  // 3. anyOf Permission Check
  if (anyOf.length > 0 && !hasAnyPermission(anyOf)) {
    return fallback;
  }

  // 4. allOf Permission Check
  if (allOf.length > 0 && !hasAllPermissions(allOf)) {
    return fallback;
  }

  // 5. Company Scope Check
  if (companyId && !canAccessCompany(companyId)) {
    return fallback;
  }

  return <>{children}</>;
}
