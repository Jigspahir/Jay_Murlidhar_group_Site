import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import { resolveServiceDetailRedirect } from "../data/jmgRedirects";

// Layout
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// Admin & Auth
import AdminLogin from "../pages/admin/AdminLogin";
import AdminOverview from "../pages/admin/AdminOverview";
import CompanyList from "../pages/admin/CompanyList";
import CompanyCreate from "../pages/admin/CompanyCreate";
import CompanyDetail from "../pages/admin/CompanyDetail";
import CompanyEdit from "../pages/admin/CompanyEdit";
import CompanyMembers from "../pages/admin/CompanyMembers";
import EmployeeList from "../pages/admin/EmployeeList";
import EmployeeCreate from "../pages/admin/EmployeeCreate";
import EmployeeEdit from "../pages/admin/EmployeeEdit";
import EmployeeProfile from "../pages/admin/EmployeeProfile";
import CustomerList from "../pages/admin/CustomerList";
import CustomerCreate from "../pages/admin/CustomerCreate";
import CustomerEdit from "../pages/admin/CustomerEdit";
import CustomerProfile from "../pages/admin/CustomerProfile";
import ServiceList from "../pages/admin/ServiceList";
import ServiceCreate from "../pages/admin/ServiceCreate";
import ServiceEdit from "../pages/admin/ServiceEdit";
import ServiceProfile from "../pages/admin/ServiceProfile";
import EnquiryList from "../pages/admin/EnquiryList";
import EnquiryCreate from "../pages/admin/EnquiryCreate";
import EnquiryEdit from "../pages/admin/EnquiryEdit";
import EnquiryProfile from "../pages/admin/EnquiryProfile";
import InvoiceList from "../pages/admin/InvoiceList";
import InvoiceCreate from "../pages/admin/InvoiceCreate";
import InvoiceEdit from "../pages/admin/InvoiceEdit";
import InvoiceDetail from "../pages/admin/InvoiceDetail";
import PaymentList from "../pages/admin/PaymentList";
import ExpenseList from "../pages/admin/ExpenseList";
import ExpenseCreate from "../pages/admin/ExpenseCreate";
import ExpenseEdit from "../pages/admin/ExpenseEdit";
import FinanceDashboard from "../pages/admin/FinanceDashboard";
import FinanceReports from "../pages/admin/FinanceReports";

// Phase 12B — Procurement & Accounts Payable
import VendorList from "../pages/admin/VendorList";
import VendorCreate from "../pages/admin/VendorCreate";
import VendorProfile from "../pages/admin/VendorProfile";
import VendorEdit from "../pages/admin/VendorEdit";
import PurchaseOrderList from "../pages/admin/PurchaseOrderList";
import PurchaseOrderCreate from "../pages/admin/PurchaseOrderCreate";
import PurchaseOrderDetail from "../pages/admin/PurchaseOrderDetail";
import PurchaseOrderEdit from "../pages/admin/PurchaseOrderEdit";
import PurchaseBillList from "../pages/admin/PurchaseBillList";
import PurchaseBillCreate from "../pages/admin/PurchaseBillCreate";
import PurchaseBillDetail from "../pages/admin/PurchaseBillDetail";
import PurchaseBillEdit from "../pages/admin/PurchaseBillEdit";
import AccountsPayableDashboard from "../pages/admin/AccountsPayableDashboard";
import VendorPaymentList from "../pages/admin/VendorPaymentList";
import PayablesReports from "../pages/admin/PayablesReports";

// Phase 13B — Inventory & Stock Management
import InventoryDashboard from "../pages/admin/InventoryDashboard";
import ProductList from "../pages/admin/ProductList";
import ProductCreate from "../pages/admin/ProductCreate";
import ProductDetail from "../pages/admin/ProductDetail";
import ProductEdit from "../pages/admin/ProductEdit";
import WarehouseList from "../pages/admin/WarehouseList";
import WarehouseCreate from "../pages/admin/WarehouseCreate";
import WarehouseDetail from "../pages/admin/WarehouseDetail";
import WarehouseEdit from "../pages/admin/WarehouseEdit";
import GoodsReceiptList from "../pages/admin/GoodsReceiptList";
import GoodsReceiptCreate from "../pages/admin/GoodsReceiptCreate";
import GoodsReceiptDetail from "../pages/admin/GoodsReceiptDetail";
import StockAdjustmentList from "../pages/admin/StockAdjustmentList";
import StockAdjustmentCreate from "../pages/admin/StockAdjustmentCreate";
import StockAdjustmentDetail from "../pages/admin/StockAdjustmentDetail";
import StockMovementList from "../pages/admin/StockMovementList";
import InventoryReports from "../pages/admin/InventoryReports";

// Phase 14B — General Ledger & Accounting
import AccountingDashboard from "../pages/admin/accounting/AccountingDashboard";
import AccountList from "../pages/admin/accounting/AccountList";
import FiscalYearList from "../pages/admin/accounting/FiscalYearList";
import JournalList from "../pages/admin/accounting/JournalList";
import JournalDetail from "../pages/admin/accounting/JournalDetail";
import ManualJournalCreate from "../pages/admin/accounting/ManualJournalCreate";
import TrialBalanceReport from "../pages/admin/accounting/TrialBalanceReport";
import GeneralLedgerReport from "../pages/admin/accounting/GeneralLedgerReport";
import ProfitLossReport from "../pages/admin/accounting/ProfitLossReport";
import BalanceSheetReport from "../pages/admin/accounting/BalanceSheetReport";
import OpeningBalanceSetup from "../pages/admin/accounting/OpeningBalanceSetup";
import BankAccountList from "../pages/admin/accounting/BankAccountList";

// Phase 15B: Commercial Adjustments & GST
import CreditNoteList from "../pages/admin/commercial/CreditNoteList";
import CreditNoteCreate from "../pages/admin/commercial/CreditNoteCreate";
import CreditNoteDetail from "../pages/admin/commercial/CreditNoteDetail";
import DebitNoteList from "../pages/admin/commercial/DebitNoteList";
import DebitNoteCreate from "../pages/admin/commercial/DebitNoteCreate";
import DebitNoteDetail from "../pages/admin/commercial/DebitNoteDetail";
import CustomerAdvanceList from "../pages/admin/advances/CustomerAdvanceList";
import CustomerAdvanceCreate from "../pages/admin/advances/CustomerAdvanceCreate";
import VendorAdvanceList from "../pages/admin/advances/VendorAdvanceList";
import VendorAdvanceCreate from "../pages/admin/advances/VendorAdvanceCreate";
import GstDashboard from "../pages/admin/gst/GstDashboard";
import Gstr1Report from "../pages/admin/gst/Gstr1Report";
import Gstr3bReport from "../pages/admin/gst/Gstr3bReport";
import EinvoiceExport from "../pages/admin/gst/EinvoiceExport";
import BankReconciliationList from "../pages/admin/banking/BankReconciliationList";
import BankStatementImport from "../pages/admin/banking/BankStatementImport";
import BankReconciliationWorkspace from "../pages/admin/banking/BankReconciliationWorkspace";
import ArAgeingReport from "../pages/admin/reports/ArAgeingReport";
import ApAgeingReport from "../pages/admin/reports/ApAgeingReport";

import ProtectedRoute from "../routes/ProtectedRoute";
import PermissionRoute from "../routes/PermissionRoute";
import { CompanyProvider } from "../contexts/CompanyContext";
import { PERMISSIONS } from "../config/permissions";

// Main pages
import Home from "../pages/Home";
import About from "../pages/About";
import Ecosystem from "../pages/Ecosystem";
import Solutions from "../pages/Solutions";
import Services from "../pages/Services";
import Careers from "../pages/Careers";
import CareersJobs from "../pages/CareersJobs";
import CareersInternships from "../pages/CareersInternships";
import AcademicInnovation from "../pages/AcademicInnovation";
import Contact from "../pages/Contact";

// Domain pages
import Technology from "../pages/domains/Technology";
import JanSuvidha from "../pages/domains/JanSuvidha";
import Finance from "../pages/domains/Finance";
import Insurance from "../pages/domains/Insurance";
import BusinessServices from "../pages/domains/BusinessServices";
import Infrastructure from "../pages/domains/Infrastructure";
import Travel from "../pages/domains/Travel";
import TradeExport from "../pages/domains/TradeExport";
import Retail from "../pages/domains/Retail";

// Company pages
import JayMurlidharComputer from "../pages/businesses/JayMurlidharComputer";
import JayMurlidharTechSolutions from "../pages/businesses/JayMurlidharTechSolutions";
import JayMurlidharFinance from "../pages/businesses/JayMurlidharFinance";
import JayMurlidharInsurance from "../pages/businesses/JayMurlidharInsurance";
import JayMurlidharBusinessServices from "../pages/businesses/JayMurlidharBusinessServices";
import JayMurlidharInfra from "../pages/businesses/JayMurlidharInfra";
import JayMurlidharTours from "../pages/businesses/JayMurlidharTours";
import JayMurlidharTradeSolutions from "../pages/businesses/JayMurlidharTradeSolutions";
import JayMurlidharExports from "../pages/businesses/JayMurlidharExports";
import JayMurlidharMobile from "../pages/businesses/JayMurlidharMobile";

// Error page
import NotFound from "../pages/NotFound";
import GlyphSystemTest from "../pages/GlyphSystemTest";

/**
 * Handles legacy /service-detail.html?service=... requests,
 * mapping legacy query params to their modern equivalent sections.
 */
function ServiceDetailLegacyRedirect() {
  const [searchParams] = useSearchParams();
  const service = searchParams.get('service');
  const target = resolveServiceDetailRedirect(service);
  return <Navigate to={target} replace />;
}

export default function AppRouter() {
  return (
    <Routes>

      {/* =====================================================
          ADMIN AUTHENTICATION & MANAGEMENT PLATFORM
      ===================================================== */}
      {/* Unprotected Admin Login Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Shell */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <CompanyProvider>
              <AdminLayout />
            </CompanyProvider>
          </ProtectedRoute>
        }
      >
        <Route 
          index 
          element={
            <PermissionRoute permission={PERMISSIONS.DASHBOARD_VIEW}>
              <AdminOverview />
            </PermissionRoute>
          } 
        />
        <Route 
          path="companies" 
          element={
            <PermissionRoute permission={PERMISSIONS.COMPANIES_VIEW}>
              <CompanyList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="companies/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.COMPANIES_CREATE}>
              <CompanyCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="companies/:companyId" 
          element={
            <PermissionRoute permission={PERMISSIONS.COMPANIES_VIEW} verifyCompanyParam={true}>
              <CompanyDetail />
            </PermissionRoute>
          } 
        />
        <Route 
          path="companies/:companyId/edit" 
          element={
            <PermissionRoute permission={PERMISSIONS.COMPANIES_EDIT} verifyCompanyParam={true}>
              <CompanyEdit />
            </PermissionRoute>
          } 
        />
        <Route 
          path="companies/:companyId/members" 
          element={
            <PermissionRoute permission={PERMISSIONS.MEMBERS_VIEW} verifyCompanyParam={true}>
              <CompanyMembers />
            </PermissionRoute>
          } 
        />

        {/* Phase 8: Employee Management */}
        <Route 
          path="employees" 
          element={
            <PermissionRoute permission={PERMISSIONS.EMPLOYEES_VIEW}>
              <EmployeeList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="employees/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.EMPLOYEES_CREATE}>
              <EmployeeCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="employees/:employeeId" 
          element={
            <PermissionRoute permission={PERMISSIONS.EMPLOYEES_VIEW}>
              <EmployeeProfile />
            </PermissionRoute>
          } 
        />
        <Route 
          path="employees/:employeeId/edit" 
          element={
            <PermissionRoute permission={PERMISSIONS.EMPLOYEES_EDIT}>
              <EmployeeEdit />
            </PermissionRoute>
          } 
        />

        {/* Phase 9: Customer Management */}
        <Route 
          path="customers" 
          element={
            <PermissionRoute permission={PERMISSIONS.CUSTOMERS_VIEW}>
              <CustomerList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="customers/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.CUSTOMERS_CREATE}>
              <CustomerCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="customers/:id" 
          element={
            <PermissionRoute permission={PERMISSIONS.CUSTOMERS_VIEW}>
              <CustomerProfile />
            </PermissionRoute>
          } 
        />
        <Route 
          path="customers/:id/edit" 
          element={
            <PermissionRoute permission={PERMISSIONS.CUSTOMERS_EDIT}>
              <CustomerEdit />
            </PermissionRoute>
          } 
        />

        {/* Phase 10B: Services Master */}
        <Route 
          path="services" 
          element={
            <PermissionRoute permission={PERMISSIONS.SERVICES_VIEW}>
              <ServiceList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="services/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.SERVICES_CREATE}>
              <ServiceCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="services/:id" 
          element={
            <PermissionRoute permission={PERMISSIONS.SERVICES_VIEW}>
              <ServiceProfile />
            </PermissionRoute>
          } 
        />
        <Route 
          path="services/:id/edit" 
          element={
            <PermissionRoute permission={PERMISSIONS.SERVICES_EDIT}>
              <ServiceEdit />
            </PermissionRoute>
          } 
        />

        {/* Phase 10B: Enquiry & Lead CRM */}
        <Route 
          path="enquiries" 
          element={
            <PermissionRoute permission={PERMISSIONS.ENQUIRIES_VIEW}>
              <EnquiryList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="enquiries/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.ENQUIRIES_CREATE}>
              <EnquiryCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="enquiries/:id" 
          element={
            <PermissionRoute permission={PERMISSIONS.ENQUIRIES_VIEW}>
              <EnquiryProfile />
            </PermissionRoute>
          } 
        />
        <Route 
          path="enquiries/:id/edit" 
          element={
            <PermissionRoute permission={PERMISSIONS.ENQUIRIES_EDIT}>
              <EnquiryEdit />
            </PermissionRoute>
          } 
        />

        {/* Phase 11B: Finance & Billing */}
        <Route 
          path="finance" 
          element={
            <PermissionRoute permission={PERMISSIONS.FINANCE_VIEW}>
              <FinanceDashboard />
            </PermissionRoute>
          } 
        />
        <Route 
          path="invoices" 
          element={
            <PermissionRoute permission={PERMISSIONS.INVOICES_VIEW}>
              <InvoiceList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="invoices/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.INVOICES_CREATE}>
              <InvoiceCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="invoices/:id" 
          element={
            <PermissionRoute permission={PERMISSIONS.INVOICES_VIEW}>
              <InvoiceDetail />
            </PermissionRoute>
          } 
        />
        <Route 
          path="invoices/:id/edit" 
          element={
            <PermissionRoute permission={PERMISSIONS.INVOICES_EDIT}>
              <InvoiceEdit />
            </PermissionRoute>
          } 
        />
        <Route 
          path="payments" 
          element={
            <PermissionRoute permission={PERMISSIONS.PAYMENTS_VIEW}>
              <PaymentList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="expenses" 
          element={
            <PermissionRoute permission={PERMISSIONS.EXPENSES_VIEW}>
              <ExpenseList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="expenses/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.EXPENSES_CREATE}>
              <ExpenseCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="expenses/:id/edit" 
          element={
            <PermissionRoute permission={PERMISSIONS.EXPENSES_EDIT}>
              <ExpenseEdit />
            </PermissionRoute>
          } 
        />
        <Route 
          path="reports/finance" 
          element={
            <PermissionRoute permission={PERMISSIONS.FINANCE_REPORTS}>
              <FinanceReports />
            </PermissionRoute>
          } 
        />

        {/* Phase 12B: Procurement & Accounts Payable */}
        {/* Vendors */}
        <Route 
          path="vendors" 
          element={
            <PermissionRoute permission={PERMISSIONS.VENDORS_VIEW}>
              <VendorList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="vendors/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.VENDORS_CREATE}>
              <VendorCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="vendors/:id" 
          element={
            <PermissionRoute permission={PERMISSIONS.VENDORS_VIEW}>
              <VendorProfile />
            </PermissionRoute>
          } 
        />
        <Route 
          path="vendors/:id/edit" 
          element={
            <PermissionRoute permission={PERMISSIONS.VENDORS_EDIT}>
              <VendorEdit />
            </PermissionRoute>
          } 
        />

        {/* Purchase Orders */}
        <Route 
          path="purchase-orders" 
          element={
            <PermissionRoute permission={PERMISSIONS.PURCHASE_ORDERS_VIEW}>
              <PurchaseOrderList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="purchase-orders/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.PURCHASE_ORDERS_CREATE}>
              <PurchaseOrderCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="purchase-orders/:id" 
          element={
            <PermissionRoute permission={PERMISSIONS.PURCHASE_ORDERS_VIEW}>
              <PurchaseOrderDetail />
            </PermissionRoute>
          } 
        />
        <Route 
          path="purchase-orders/:id/edit" 
          element={
            <PermissionRoute permission={PERMISSIONS.PURCHASE_ORDERS_EDIT}>
              <PurchaseOrderEdit />
            </PermissionRoute>
          } 
        />

        {/* Supplier Bills */}
        <Route 
          path="purchase-bills" 
          element={
            <PermissionRoute permission={PERMISSIONS.PURCHASE_BILLS_VIEW}>
              <PurchaseBillList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="purchase-bills/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.PURCHASE_BILLS_CREATE}>
              <PurchaseBillCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="purchase-bills/:id" 
          element={
            <PermissionRoute permission={PERMISSIONS.PURCHASE_BILLS_VIEW}>
              <PurchaseBillDetail />
            </PermissionRoute>
          } 
        />
        <Route 
          path="purchase-bills/:id/edit" 
          element={
            <PermissionRoute permission={PERMISSIONS.PURCHASE_BILLS_EDIT}>
              <PurchaseBillEdit />
            </PermissionRoute>
          } 
        />

        {/* Payables Dashboard & Ledger */}
        <Route 
          path="payables" 
          element={
            <PermissionRoute permission={PERMISSIONS.FINANCE_PAYABLES}>
              <AccountsPayableDashboard />
            </PermissionRoute>
          } 
        />
        <Route 
          path="vendor-payments" 
          element={
            <PermissionRoute permission={PERMISSIONS.VENDOR_PAYMENTS_VIEW}>
              <VendorPaymentList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="reports/payables" 
          element={
            <PermissionRoute permission={PERMISSIONS.FINANCE_REPORTS}>
              <PayablesReports />
            </PermissionRoute>
          } 
        />

        {/* =====================================================
            PHASE 13B: INVENTORY & STOCK MANAGEMENT
        ===================================================== */}
        {/* Inventory Operations Dashboard */}
        <Route 
          path="inventory" 
          element={
            <PermissionRoute permission={PERMISSIONS.INVENTORY_VIEW}>
              <InventoryDashboard />
            </PermissionRoute>
          } 
        />

        {/* Product Master */}
        <Route 
          path="products" 
          element={
            <PermissionRoute permission={PERMISSIONS.PRODUCTS_VIEW}>
              <ProductList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="products/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.PRODUCTS_CREATE}>
              <ProductCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="products/:id" 
          element={
            <PermissionRoute permission={PERMISSIONS.PRODUCTS_VIEW}>
              <ProductDetail />
            </PermissionRoute>
          } 
        />
        <Route 
          path="products/:id/edit" 
          element={
            <PermissionRoute permission={PERMISSIONS.PRODUCTS_EDIT}>
              <ProductEdit />
            </PermissionRoute>
          } 
        />

        {/* Warehouse Master */}
        <Route 
          path="warehouses" 
          element={
            <PermissionRoute permission={PERMISSIONS.WAREHOUSES_VIEW}>
              <WarehouseList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="warehouses/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.WAREHOUSES_MANAGE}>
              <WarehouseCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="warehouses/:id" 
          element={
            <PermissionRoute permission={PERMISSIONS.WAREHOUSES_VIEW}>
              <WarehouseDetail />
            </PermissionRoute>
          } 
        />
        <Route 
          path="warehouses/:id/edit" 
          element={
            <PermissionRoute permission={PERMISSIONS.WAREHOUSES_MANAGE}>
              <WarehouseEdit />
            </PermissionRoute>
          } 
        />

        {/* Goods Receipts (GRN) — Stock Inward */}
        <Route 
          path="inventory/receipts" 
          element={
            <PermissionRoute permission={PERMISSIONS.INVENTORY_VIEW}>
              <GoodsReceiptList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="inventory/receipts/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.INVENTORY_RECEIVE}>
              <GoodsReceiptCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="inventory/receipts/:id" 
          element={
            <PermissionRoute permission={PERMISSIONS.INVENTORY_VIEW}>
              <GoodsReceiptDetail />
            </PermissionRoute>
          } 
        />

        {/* Stock Adjustments & Reconciliation */}
        <Route 
          path="inventory/adjustments" 
          element={
            <PermissionRoute permission={PERMISSIONS.INVENTORY_VIEW}>
              <StockAdjustmentList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="inventory/adjustments/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.INVENTORY_ADJUST}>
              <StockAdjustmentCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="inventory/adjustments/:id" 
          element={
            <PermissionRoute permission={PERMISSIONS.INVENTORY_VIEW}>
              <StockAdjustmentDetail />
            </PermissionRoute>
          } 
        />

        {/* Stock Movement Ledger (Cardex) */}
        <Route 
          path="inventory/movements" 
          element={
            <PermissionRoute permission={PERMISSIONS.INVENTORY_VIEW}>
              <StockMovementList />
            </PermissionRoute>
          } 
        />

        {/* Stock & Valuation Reports */}
        <Route 
          path="reports/inventory" 
          element={
            <PermissionRoute permission={PERMISSIONS.INVENTORY_REPORTS}>
              <InventoryReports />
            </PermissionRoute>
          } 
        />

        {/* =====================================================
            PHASE 14B: GENERAL LEDGER & ACCOUNTING
        ===================================================== */}
        {/* Accounting Dashboard */}
        <Route 
          path="accounting" 
          element={
            <PermissionRoute permission={PERMISSIONS.ACCOUNTING_VIEW}>
              <AccountingDashboard />
            </PermissionRoute>
          } 
        />

        {/* Chart of Accounts */}
        <Route 
          path="accounting/accounts" 
          element={
            <PermissionRoute permission={PERMISSIONS.ACCOUNTING_ACCOUNTS_VIEW}>
              <AccountList />
            </PermissionRoute>
          } 
        />

        {/* Fiscal Years & Periods */}
        <Route 
          path="accounting/fiscal-years" 
          element={
            <PermissionRoute permission={PERMISSIONS.ACCOUNTING_PERIODS_VIEW}>
              <FiscalYearList />
            </PermissionRoute>
          } 
        />

        {/* Journal Entries Register */}
        <Route 
          path="accounting/journals" 
          element={
            <PermissionRoute permission={PERMISSIONS.ACCOUNTING_JOURNALS_VIEW}>
              <JournalList />
            </PermissionRoute>
          } 
        />

        {/* Journal Voucher Detail */}
        <Route 
          path="accounting/journals/:id" 
          element={
            <PermissionRoute permission={PERMISSIONS.ACCOUNTING_JOURNALS_VIEW}>
              <JournalDetail />
            </PermissionRoute>
          } 
        />

        {/* New Manual Journal Voucher */}
        <Route 
          path="accounting/manual-journal" 
          element={
            <PermissionRoute permission={PERMISSIONS.ACCOUNTING_JOURNALS_CREATE}>
              <ManualJournalCreate />
            </PermissionRoute>
          } 
        />

        {/* Trial Balance Statement */}
        <Route 
          path="accounting/trial-balance" 
          element={
            <PermissionRoute permission={PERMISSIONS.ACCOUNTING_REPORTS_VIEW}>
              <TrialBalanceReport />
            </PermissionRoute>
          } 
        />

        {/* General Ledger Statement */}
        <Route 
          path="accounting/general-ledger" 
          element={
            <PermissionRoute permission={PERMISSIONS.ACCOUNTING_REPORTS_VIEW}>
              <GeneralLedgerReport />
            </PermissionRoute>
          } 
        />

        {/* Profit & Loss Statement */}
        <Route 
          path="accounting/profit-loss" 
          element={
            <PermissionRoute permission={PERMISSIONS.ACCOUNTING_REPORTS_VIEW}>
              <ProfitLossReport />
            </PermissionRoute>
          } 
        />

        {/* Balance Sheet Statement */}
        <Route 
          path="accounting/balance-sheet" 
          element={
            <PermissionRoute permission={PERMISSIONS.ACCOUNTING_REPORTS_VIEW}>
              <BalanceSheetReport />
            </PermissionRoute>
          } 
        />

        {/* Opening Balances Wizard */}
        <Route 
          path="accounting/opening-balances" 
          element={
            <PermissionRoute permission={PERMISSIONS.ACCOUNTING_OPENING_BALANCES_MANAGE}>
              <OpeningBalanceSetup />
            </PermissionRoute>
          } 
        />

        {/* Company Bank Accounts Master */}
        <Route 
          path="accounting/bank-accounts" 
          element={
            <PermissionRoute permission={PERMISSIONS.ACCOUNTING_BANK_ACCOUNTS_VIEW}>
              <BankAccountList />
            </PermissionRoute>
          } 
        />

        {/* =====================================================
            PHASE 15B: COMMERCIAL ADJUSTMENTS & GST COMPLIANCE
        ===================================================== */}
        {/* Credit Notes */}
        <Route 
          path="credit-notes" 
          element={
            <PermissionRoute permission={PERMISSIONS.CREDIT_NOTES_VIEW}>
              <CreditNoteList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="credit-notes/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.CREDIT_NOTES_CREATE}>
              <CreditNoteCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="credit-notes/:id" 
          element={
            <PermissionRoute permission={PERMISSIONS.CREDIT_NOTES_VIEW}>
              <CreditNoteDetail />
            </PermissionRoute>
          } 
        />

        {/* Debit Notes */}
        <Route 
          path="debit-notes" 
          element={
            <PermissionRoute permission={PERMISSIONS.DEBIT_NOTES_VIEW}>
              <DebitNoteList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="debit-notes/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.DEBIT_NOTES_CREATE}>
              <DebitNoteCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="debit-notes/:id" 
          element={
            <PermissionRoute permission={PERMISSIONS.DEBIT_NOTES_VIEW}>
              <DebitNoteDetail />
            </PermissionRoute>
          } 
        />

        {/* Customer & Vendor Advances */}
        <Route 
          path="advances" 
          element={<Navigate to="/admin/advances/customer" replace />} 
        />
        <Route 
          path="advances/customer" 
          element={
            <PermissionRoute permission={PERMISSIONS.ADVANCES_VIEW}>
              <CustomerAdvanceList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="advances/customer/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.ADVANCES_CREATE}>
              <CustomerAdvanceCreate />
            </PermissionRoute>
          } 
        />
        <Route 
          path="advances/vendor" 
          element={
            <PermissionRoute permission={PERMISSIONS.ADVANCES_VIEW}>
              <VendorAdvanceList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="advances/vendor/new" 
          element={
            <PermissionRoute permission={PERMISSIONS.ADVANCES_CREATE}>
              <VendorAdvanceCreate />
            </PermissionRoute>
          } 
        />

        {/* GST Reporting Workspace */}
        <Route 
          path="gst" 
          element={
            <PermissionRoute permission={PERMISSIONS.GST_VIEW}>
              <GstDashboard />
            </PermissionRoute>
          } 
        />
        <Route 
          path="gst/gstr-1" 
          element={
            <PermissionRoute permission={PERMISSIONS.GST_VIEW}>
              <Gstr1Report />
            </PermissionRoute>
          } 
        />
        <Route 
          path="gst/gstr-3b" 
          element={
            <PermissionRoute permission={PERMISSIONS.GST_VIEW}>
              <Gstr3bReport />
            </PermissionRoute>
          } 
        />

        {/* Offline e-Invoice JSON Generator */}
        <Route 
          path="e-invoice" 
          element={
            <PermissionRoute permission={PERMISSIONS.EINVOICE_GENERATE}>
              <EinvoiceExport />
            </PermissionRoute>
          } 
        />

        {/* Bank Reconciliation (BRS) */}
        <Route 
          path="bank-reconciliation" 
          element={
            <PermissionRoute permission={PERMISSIONS.BANK_RECONCILIATION_VIEW}>
              <BankReconciliationList />
            </PermissionRoute>
          } 
        />
        <Route 
          path="bank-reconciliation/import" 
          element={
            <PermissionRoute permission={PERMISSIONS.BANK_RECONCILIATION_IMPORT}>
              <BankStatementImport />
            </PermissionRoute>
          } 
        />
        <Route 
          path="bank-reconciliation/:id" 
          element={
            <PermissionRoute permission={PERMISSIONS.BANK_RECONCILIATION_VIEW}>
              <BankReconciliationWorkspace />
            </PermissionRoute>
          } 
        />

        {/* AR & AP Ageing Reports */}
        <Route 
          path="reports/ar-ageing" 
          element={
            <PermissionRoute permission={PERMISSIONS.REPORTS_AR_AGEING}>
              <ArAgeingReport />
            </PermissionRoute>
          } 
        />
        <Route 
          path="reports/ap-ageing" 
          element={
            <PermissionRoute permission={PERMISSIONS.REPORTS_AP_AGEING}>
              <ApAgeingReport />
            </PermissionRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* Developer QA Test Grid for Glyph System */}
      <Route path="/test-glyphs" element={<GlyphSystemTest />} />

      {/* =====================================================
          MAIN WEBSITE (Wrapped in MainLayout)
      ===================================================== */}

      <Route element={<MainLayout />}>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Group & Story */}
        <Route path="/about" element={<About />} />

        {/* Dedicated Ecosystem Explorer */}
        <Route
          path="/ecosystem"
          element={<Ecosystem />}
        />

        {/* Solutions & ERP Showcase */}
        <Route
          path="/solutions"
          element={<Solutions />}
        />

        {/* Our Services / What We Do */}
        <Route
          path="/services"
          element={<Services />}
        />
        <Route
          path="/projects"
          element={<Services />}
        />

        {/* Careers & Engineering Culture */}
        <Route
          path="/careers"
          element={<Careers />}
        />
        <Route
          path="/careers/jobs"
          element={<CareersJobs />}
        />
        <Route
          path="/careers/internships"
          element={<AcademicInnovation />}
        />
        <Route
          path="/academic-innovation"
          element={<AcademicInnovation />}
        />

        {/* Direct Contact */}
        <Route
          path="/contact"
          element={<Contact />}
        />


        {/* =================================================
            BUSINESS DOMAINS
        ================================================= */}

        <Route
          path="/technology"
          element={<Technology />}
        />

        <Route
          path="/jan-suvidha"
          element={<JanSuvidha />}
        />

        <Route
          path="/finance"
          element={<Navigate to="/business-services" replace />}
        />

        <Route
          path="/insurance"
          element={<Insurance />}
        />

        <Route
          path="/business-services"
          element={<BusinessServices />}
        />

        <Route
          path="/infrastructure"
          element={<Navigate to="/technology" replace />}
        />

        <Route
          path="/travel"
          element={<Travel />}
        />

        <Route
          path="/trade-export"
          element={<Navigate to="/business-services" replace />}
        />

        <Route
          path="/retail"
          element={<Retail />}
        />


        {/* =================================================
            COMPANY PAGES
        ================================================= */}

        <Route
          path="/jan-suvidha/jay-murlidhar-computer"
          element={<JayMurlidharComputer />}
        />

        <Route
          path="/technology/jay-murlidhar-tech-solutions"
          element={<JayMurlidharTechSolutions />}
        />

        <Route
          path="/finance/jay-murlidhar-finance"
          element={<Navigate to="/business-services/jay-murlidhar-business-services" replace />}
        />

        <Route
          path="/insurance/jay-murlidhar-insurance"
          element={<JayMurlidharInsurance />}
        />

        <Route
          path="/business-services/jay-murlidhar-business-services"
          element={<JayMurlidharBusinessServices />}
        />

        <Route
          path="/infrastructure/jay-murlidhar-infra"
          element={<Navigate to="/technology/jay-murlidhar-tech-solutions" replace />}
        />

        <Route
          path="/travel/jay-murlidhar-tours"
          element={<JayMurlidharTours />}
        />

        <Route
          path="/trade-export/jay-murlidhar-trade-solutions"
          element={<Navigate to="/business-services/jay-murlidhar-business-services" replace />}
        />

        <Route
          path="/trade-export/jay-murlidhar-exports"
          element={<Navigate to="/business-services/jay-murlidhar-business-services" replace />}
        />

        <Route
          path="/trade-export/jay-murlidhar-exports"
          element={<JayMurlidharExports />}
        />

        <Route
          path="/retail/jay-murlidhar-mobile-accessories"
          element={<JayMurlidharMobile />}
        />


        {/* =================================================
            LEGACY REDIRECT
            Business Services was previously under Technology.
            Jay Murlidhar Computer is now under Jan Suvidha.
        ================================================= */}

        <Route
          path="/technology/jay-murlidhar-business-services"
          element={
            <Navigate
              to="/business-services/jay-murlidhar-business-services"
              replace
            />
          }
        />

        <Route
          path="/technology/jay-murlidhar-computer"
          element={
            <Navigate
              to="/jan-suvidha/jay-murlidhar-computer"
              replace
            />
          }
        />

        <Route
          path="/jay-murlidhar-computer"
          element={
            <Navigate
              to="/jan-suvidha/jay-murlidhar-computer"
              replace
            />
          }
        />

        {/* Additional alias redirects for URL robustness */}
        <Route
          path="/trade"
          element={<Navigate to="/trade-export" replace />}
        />
        <Route
          path="/trade/jay-murlidhar-trade"
          element={<Navigate to="/trade-export/jay-murlidhar-trade-solutions" replace />}
        />
        <Route
          path="/trade/jay-murlidhar-trade-solutions"
          element={<Navigate to="/trade-export/jay-murlidhar-trade-solutions" replace />}
        />
        <Route
          path="/trade/jay-murlidhar-exports"
          element={<Navigate to="/trade-export/jay-murlidhar-exports" replace />}
        />
        <Route
          path="/retail/jay-murlidhar-mobile"
          element={<Navigate to="/retail/jay-murlidhar-mobile-accessories" replace />}
        />

        {/* =================================================
            LEGACY PRE-V2 ROUTE REDIRECTS
        ================================================= */}
        {/* Legacy Insurance HTML & Path routes */}
        <Route path="/general-insurance.html" element={<Navigate to="/insurance" replace />} />
        <Route path="/general-insurance" element={<Navigate to="/insurance" replace />} />
        <Route path="/health-insurance.html" element={<Navigate to="/insurance" replace />} />
        <Route path="/health-insurance" element={<Navigate to="/insurance" replace />} />
        <Route path="/life-insurance.html" element={<Navigate to="/insurance" replace />} />
        <Route path="/life-insurance" element={<Navigate to="/insurance" replace />} />
        <Route path="/term-insurance.html" element={<Navigate to="/insurance" replace />} />
        <Route path="/term-insurance" element={<Navigate to="/insurance" replace />} />
        <Route path="/other-insurance.html" element={<Navigate to="/insurance" replace />} />
        <Route path="/other-insurance" element={<Navigate to="/insurance" replace />} />

        {/* Legacy Investment, Finance, Infrastructure & Legal routes */}
        <Route path="/investment.html" element={<Navigate to="/business-services" replace />} />
        <Route path="/investment" element={<Navigate to="/business-services" replace />} />
        <Route path="/terms.html" element={<Navigate to="/about" replace />} />
        <Route path="/terms" element={<Navigate to="/about" replace />} />

        {/* Legacy Service-Detail routes (with query param support) */}
        <Route path="/service-detail.html" element={<ServiceDetailLegacyRedirect />} />
        <Route path="/service-detail" element={<ServiceDetailLegacyRedirect />} />

        {/* Legacy Subfolder Deployments (Jay_Murlidhar_group_Site/) */}
        <Route path="/Jay_Murlidhar_group_Site/general-insurance.html" element={<Navigate to="/insurance" replace />} />
        <Route path="/Jay_Murlidhar_group_Site/health-insurance.html" element={<Navigate to="/insurance" replace />} />
        <Route path="/Jay_Murlidhar_group_Site/life-insurance.html" element={<Navigate to="/insurance" replace />} />
        <Route path="/Jay_Murlidhar_group_Site/term-insurance.html" element={<Navigate to="/insurance" replace />} />
        <Route path="/Jay_Murlidhar_group_Site/other-insurance.html" element={<Navigate to="/insurance" replace />} />
        <Route path="/Jay_Murlidhar_group_Site/investment.html" element={<Navigate to="/business-services" replace />} />
        <Route path="/Jay_Murlidhar_group_Site/index.html" element={<Navigate to="/" replace />} />
        <Route path="/Jay_Murlidhar_group_Site/*" element={<Navigate to="/" replace />} />
        <Route path="/jay_murlidhar_group_site/*" element={<Navigate to="/" replace />} />


        {/* =================================================
            404
        ================================================= */}

        <Route
          path="/404"
          element={<NotFound />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />

      </Route>

    </Routes>
  );
}
