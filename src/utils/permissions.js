/**
 * JAY MURLIDHAR GROUP (JMG) — PERMISSIONS UTILITY
 * 
 * Role-Based Access Control (RBAC) helpers.
 * System Roles:
 * - group_owner: Full group-wide administrative access
 * - company_manager: Management access scoped to assigned companies
 * - employee: Operational access within assigned companies
 */

export function isGroupOwner(roles = []) {
  return Array.isArray(roles) && roles.includes('group_owner');
}

export function isCompanyManager(userCompanies = [], companyId) {
  if (!Array.isArray(userCompanies) || !companyId) return false;
  return userCompanies.some(
    (uc) => uc.company_id === companyId && uc.role?.slug === 'company_manager' && uc.is_active !== false
  );
}

export function canCreateCompany(roles = []) {
  return isGroupOwner(roles);
}

export function canEditCompany(roles = [], userCompanies = [], companyId) {
  if (isGroupOwner(roles)) return true;
  return isCompanyManager(userCompanies, companyId);
}

export function canDeactivateCompany(roles = []) {
  return isGroupOwner(roles);
}

export function canManageMembers(roles = [], userCompanies = [], companyId) {
  if (isGroupOwner(roles)) return true;
  return isCompanyManager(userCompanies, companyId);
}
