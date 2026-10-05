import React from 'react';
import { Navigate, useLocation, useParams, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import AccessDenied from '../pages/admin/AccessDenied';

/**
 * Route Guard: PermissionRoute
 * 
 * Verifies that the authenticated user possesses the specific permissions, roles,
 * and company scope required to access the child route.
 * 
 * Fails closed: renders <AccessDenied /> if unauthorized.
 */
export default function PermissionRoute({
  permission,
  anyOf = [],
  allOf = [],
  requiredRole,
  verifyCompanyParam = false,
  companyParamName = 'companyId',
  children
}) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    role, 
    isGroupOwner, 
    canAccessCompany 
  } = usePermissions();
  
  const location = useLocation();
  const params = useParams();

  // 1. Loading state
  if (authLoading) {
    return (
      <div className="p-12 text-center">
        <div className="w-7 h-7 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs font-mono text-slate-400">Verifying Permissions...</span>
      </div>
    );
  }

  // 2. Unauthenticated check (Handled by auth flow)
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 3. Required Role Check
  if (requiredRole) {
    const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!rolesArray.includes(role) && !isGroupOwner) {
      return <AccessDenied requiredRole={requiredRole} />;
    }
  }

  // 4. Single Permission Check
  if (permission && !hasPermission(permission)) {
    return <AccessDenied requiredPermission={permission} />;
  }

  // 5. anyOf Permission Check
  if (anyOf.length > 0 && !hasAnyPermission(anyOf)) {
    return <AccessDenied requiredPermission={anyOf.join(' OR ')} />;
  }

  // 6. allOf Permission Check
  if (allOf.length > 0 && !hasAllPermissions(allOf)) {
    return <AccessDenied requiredPermission={allOf.join(' AND ')} />;
  }

  // 7. Route URL Company Scope Check (Section 10 & 17)
  if (verifyCompanyParam && params[companyParamName]) {
    const targetCompanyId = params[companyParamName];
    if (!canAccessCompany(targetCompanyId)) {
      return (
        <AccessDenied 
          customMessage={`You do not have administrative authorization for company scope "${targetCompanyId}".`}
        />
      );
    }
  }

  return children ? children : <Outlet />;
}
