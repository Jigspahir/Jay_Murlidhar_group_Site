/**
 * JAY MURLIDHAR GROUP — PRIVATE APPLICATION ROUTE ARCHITECTURE
 * 
 * Phase 1 Conceptual Route Manifest for future Business Management Platform.
 * Note: These routes are NOT activated in Phase 1 as authentication infrastructure
 * is scheduled for Phase 2.
 */

export const ADMIN_ROUTES = Object.freeze({
  LOGIN: '/admin/login',
  DASHBOARD: '/admin',
  COMPANIES: '/admin/companies',
  EMPLOYEES: '/admin/employees',
  CUSTOMERS: '/admin/customers',
  SERVICES: '/admin/services',
  ENQUIRIES: '/admin/enquiries',
  INCOME: '/admin/income',
  EXPENSES: '/admin/expenses',
  INVOICES: '/admin/invoices',
  REPORTS: '/admin/reports',
  ANALYTICS: '/admin/analytics',
  SETTINGS: '/admin/settings'
});

export const ADMIN_ROUTE_CONFIG = Object.freeze([
  { path: ADMIN_ROUTES.LOGIN, name: 'Login', public: true },
  { path: ADMIN_ROUTES.DASHBOARD, name: 'Overview / Consolidated Dashboard', requiredPermission: 'read' },
  { path: ADMIN_ROUTES.COMPANIES, name: 'Companies Management', requiredRole: ['group_owner'] },
  { path: ADMIN_ROUTES.EMPLOYEES, name: 'Employees Directory', requiredPermission: 'employees' },
  { path: ADMIN_ROUTES.CUSTOMERS, name: 'Customer Directory', requiredPermission: 'customers' },
  { path: ADMIN_ROUTES.SERVICES, name: 'Services Catalog', requiredPermission: 'services' },
  { path: ADMIN_ROUTES.ENQUIRIES, name: 'Inbound Enquiries', requiredPermission: 'enquiries' },
  { path: ADMIN_ROUTES.INCOME, name: 'Income Records', requiredPermission: 'finance' },
  { path: ADMIN_ROUTES.EXPENSES, name: 'Expense Tracking', requiredPermission: 'finance' },
  { path: ADMIN_ROUTES.INVOICES, name: 'Invoicing & Billing', requiredPermission: 'invoices' },
  { path: ADMIN_ROUTES.REPORTS, name: 'Consolidated & Company Reports', requiredPermission: 'reports' },
  { path: ADMIN_ROUTES.ANALYTICS, name: 'Cross-Domain Analytics', requiredPermission: 'analytics' },
  { path: ADMIN_ROUTES.SETTINGS, name: 'Company & Security Settings', requiredRole: ['group_owner', 'company_manager'] }
]);
