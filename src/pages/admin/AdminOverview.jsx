import React from 'react';
import { DashboardOverview } from '../../features/dashboard';

/**
 * PHASE 6: CONSOLIDATED DASHBOARD + COMPANY DASHBOARD FOUNDATION
 * 
 * Route: /admin (Protected Admin Index)
 * 
 * Renders the production multi-company dashboard.
 * Dynamically branches into:
 * - All Companies Mode: Consolidated group overview and company table
 * - Company-Specific Mode: Scoped operational summary and RBAC actions
 * - Empty State: No company access message
 */
export default function AdminOverview() {
  return <DashboardOverview />;
}
