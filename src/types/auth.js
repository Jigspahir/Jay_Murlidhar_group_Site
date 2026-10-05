/**
 * JAY MURLIDHAR GROUP — RBAC & AUTHENTICATION CONTRACTS
 * 
 * Phase 1 Architectural Definitions for Authentication & Roles.
 */

export const USER_ROLES = Object.freeze({
  GROUP_OWNER: 'group_owner',       // Super Admin across all companies
  COMPANY_MANAGER: 'company_manager', // Manager for one or more assigned companies
  EMPLOYEE: 'employee'               // Operational staff with company-scoped access
});

export const PERMISSION_MODULES = Object.freeze({
  COMPANIES: 'companies',
  EMPLOYEES: 'employees',
  CUSTOMERS: 'customers',
  SERVICES: 'services',
  ENQUIRIES: 'enquiries',
  FINANCE: 'finance',
  INVOICES: 'invoices',
  REPORTS: 'reports',
  ANALYTICS: 'analytics',
  AUDIT_LOGS: 'audit_logs'
});

export const PERMISSION_ACTIONS = Object.freeze({
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  EXPORT: 'export'
});
