import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../config/permissions';
import { 
  LogOut, 
  ShieldCheck, 
  LayoutDashboard, 
  Building2, 
  Users, 
  UserCheck, 
  Layers, 
  HelpCircle,
  DollarSign,
  FileText,
  CreditCard,
  Receipt,
  FileBarChart,
  Truck,
  ShoppingBag,
  Package,
  Warehouse,
  BookOpen,
  FileMinus,
  FilePlus,
  Landmark,
  Scale,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import CompanySwitcher from '../components/admin/CompanySwitcher';

const CURRENT_YEAR = new Date().getFullYear();

export default function AdminLayout() {
  const { user, profile, signOut } = useAuth();
  const { roleLabel, hasPermission } = usePermissions();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* Admin Shell Header */}
      <header className="bg-[#07111F] text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-3 sm:gap-4">
            
            {/* Brand Identity */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center font-bold text-white text-sm shadow-sm">
                J
              </div>
              <div className="hidden md:flex flex-col">
                <span className="font-extrabold tracking-tight text-sm text-white flex items-center gap-1.5">
                  JAY MURLIDHAR GROUP
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#38BDF8]">
                  Business Management Platform
                </span>
              </div>
            </div>

            {/* Central Company Switcher */}
            <div className="flex-1 flex justify-center max-w-md mx-2">
              <CompanySwitcher />
            </div>

            {/* User Profile & Actions */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {/* User Details */}
              <div className="flex items-center gap-2.5 text-right">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-200">
                    {profile?.full_name || user?.email || 'Authenticated User'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {user?.email}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono font-medium text-[#38BDF8]">
                  <ShieldCheck className="w-3 h-3 text-[#38BDF8]" />
                  <span>{roleLabel}</span>
                </div>
              </div>

              {/* Logout Action */}
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-red-950/50 hover:text-red-300 text-slate-300 border border-slate-700 hover:border-red-800/60 text-xs font-medium transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Sign Out</span>
              </button>
            </div>

          </div>

          {/* Enterprise Navigation Strip (Permission-Gated) */}
          <nav className="flex items-center gap-1 -mb-px border-t border-slate-800/80 pt-1 pb-2">
            {hasPermission(PERMISSIONS.DASHBOARD_VIEW) && (
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Overview</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.COMPANIES_VIEW) && (
              <NavLink
                to="/admin/companies"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Companies</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.EMPLOYEES_VIEW) && (
              <NavLink
                to="/admin/employees"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Users className="w-3.5 h-3.5" />
                <span>Employees</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.CUSTOMERS_VIEW) && (
              <NavLink
                to="/admin/customers"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Customers</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.SERVICES_VIEW) && (
              <NavLink
                to="/admin/services"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Services</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.ENQUIRIES_VIEW) && (
              <NavLink
                to="/admin/enquiries"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Enquiries</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.FINANCE_VIEW) && (
              <NavLink
                to="/admin/finance"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Finance</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.INVOICES_VIEW) && (
              <NavLink
                to="/admin/invoices"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Invoices</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.PAYMENTS_VIEW) && (
              <NavLink
                to="/admin/payments"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payments</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.EXPENSES_VIEW) && (
              <NavLink
                to="/admin/expenses"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Expenses</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.FINANCE_REPORTS) && (
              <NavLink
                to="/admin/reports/finance"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <FileBarChart className="w-3.5 h-3.5" />
                <span>Reports</span>
              </NavLink>
            )}

            {/* Phase 12B: Procurement & Accounts Payable */}
            {hasPermission(PERMISSIONS.VENDORS_VIEW) && (
              <NavLink
                to="/admin/vendors"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Vendors</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.PURCHASE_ORDERS_VIEW) && (
              <NavLink
                to="/admin/purchase-orders"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Orders</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.PURCHASE_BILLS_VIEW) && (
              <NavLink
                to="/admin/purchase-bills"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Bills</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.FINANCE_PAYABLES) && (
              <NavLink
                to="/admin/payables"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Payables</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.VENDOR_PAYMENTS_VIEW) && (
              <NavLink
                to="/admin/vendor-payments"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Disbursements</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.FINANCE_REPORTS) && (
              <NavLink
                to="/admin/reports/payables"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <FileBarChart className="w-3.5 h-3.5 text-emerald-400" />
                <span>AP Reports</span>
              </NavLink>
            )}

            {/* Phase 13B: Inventory & Product Master */}
            {hasPermission(PERMISSIONS.PRODUCTS_VIEW) && (
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Package className="w-3.5 h-3.5" />
                <span>Products</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.INVENTORY_VIEW) && (
              <NavLink
                to="/admin/inventory"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Package className="w-3.5 h-3.5 text-blue-400" />
                <span>Inventory</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.WAREHOUSES_VIEW) && (
              <NavLink
                to="/admin/warehouses"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Warehouse className="w-3.5 h-3.5" />
                <span>Warehouses</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.INVENTORY_REPORTS) && (
              <NavLink
                to="/admin/reports/inventory"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <FileBarChart className="w-3.5 h-3.5 text-blue-400" />
                <span>Stock Reports</span>
              </NavLink>
            )}

            {/* Phase 14B: General Ledger & Accounting */}
            {hasPermission(PERMISSIONS.ACCOUNTING_VIEW) && (
              <NavLink
                to="/admin/accounting"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Accounting</span>
              </NavLink>
            )}

            {/* Phase 15B: Commercial Adjustments & GST Compliance */}
            {hasPermission(PERMISSIONS.CREDIT_NOTES_VIEW) && (
              <NavLink
                to="/admin/credit-notes"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <FileMinus className="w-3.5 h-3.5 text-rose-400" />
                <span>Credit Notes</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.DEBIT_NOTES_VIEW) && (
              <NavLink
                to="/admin/debit-notes"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <FilePlus className="w-3.5 h-3.5 text-indigo-400" />
                <span>Debit Notes</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.ADVANCES_VIEW) && (
              <NavLink
                to="/admin/advances/customer"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <ArrowDownLeft className="w-3.5 h-3.5 text-teal-400" />
                <span>Advances</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.GST_VIEW) && (
              <NavLink
                to="/admin/gst"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                <span>GST</span>
              </NavLink>
            )}

            {hasPermission(PERMISSIONS.BANK_RECONCILIATION_VIEW) && (
              <NavLink
                to="/admin/bank-reconciliation"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                <span>BRS (Bank)</span>
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Corporate Admin Footer */}
      <footer className="border-t border-slate-200 py-3.5 bg-white text-center text-xs font-mono text-slate-400">
        &copy; {CURRENT_YEAR} Jay Murlidhar Group &bull; Business Management Platform
      </footer>
    </div>
  );
}
