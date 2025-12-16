import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";

import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/AuthPages/SignIn";

import Calendar from "./pages/Calendar";
import BarChart from "./pages/Charts/BarChart";
import LineChart from "./pages/Charts/LineChart";
import Home from "./pages/Dashboard/Home";
import FormElements from "./pages/Forms/FormElements";
import NotFound from "./pages/OtherPage/NotFound";
import BasicTables from "./pages/Tables/BasicTables";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import UserProfiles from "./pages/UserProfiles";

import { ToastContainer } from "react-toastify";
import PermissionsPage from "./pages/PermissionPage";

import BrandsPage from "./pages/Brand";
import CategoryPage from "./pages/Category";
import PermissionAssignPage from "./pages/PermissionAssignPage";
import ProductPage from "./pages/Product";
import ProductDetailPage from "./pages/Product/components/ProductDetailPage";
import ProductFormPage from "./pages/Product/components/ProductFormPage";
import PurchasePage from "./pages/Purchase";

import AccountBalancePage from "./pages/Accounts/AccountBalance";
import AccountLedgerPage from "./pages/Accounts/AccountLedgerPage";
import AccountListPage from "./pages/Accounts/AccountList";
import CashandBank from "./pages/Accounts/CashandBank";
import JournalPage from "./pages/Accounts/JournalPage";
import PaymentsPage from "./pages/Accounts/payments";
import PaymentDetailsPage from "./pages/Accounts/payments/components/PaymentDetails";
import TrialBalancePage from "./pages/Accounts/TrialBalance";
import BranchPage from "./pages/Branch";

import CustomerPage from "./pages/Customer";
import CustomerDetailPage from "./pages/Customer/components/CustomerDetailPage";
import CustomerFormPage from "./pages/Customer/components/CustomerFormPage";
import CustomerLedgerPage from "./pages/Customer/components/CustomerLedgerPage";
import CustomerGroupPage from "./pages/CustomerGroup";
import ExpenseCategoryPage from "./pages/ExpenseCategory";
import ExpensesPage from "./pages/Expenses";

import POSPage from "./pages/POS/POSPage";
import PosSaleDetailPage from "./pages/POS/PosSaleDetailPage";
import PosSalesListPage from "./pages/POS/PosSalesListPage";
import PosSalesSummaryPage from "./pages/POS/PosSalesSummaryPage";
import PosTransactionHistoryPage from "./pages/POS/PosTransactionHistoryPage";
import PurchaseCreate from "./pages/Purchase/components/PurchaseCreate";
import PurchaseDetailPage from "./pages/Purchase/components/PurchaseDetailPage";
import PurchaseEdit from "./pages/Purchase/components/PurchaseEdit";
import RolesPage from "./pages/Role";
import SalesPage from "./pages/Sales";
import SaleDetailPage from "./pages/Sales/components/SaleDetailPage";
import SaleFormPage from "./pages/Sales/components/SaleFormPage";

import AttendanceListPage from "./pages/Attendance/AttendanceList";
import AttendanceSummaryPage from "./pages/Attendance/AttendanceSummary";
import CashRegisterManagementPage from "./pages/CashRegister/CashRegisterManagementPage";
import CashRegisterOperationsPage from "./pages/CashRegister/CashRegisterOperationsPage";
import CashRegisterTransactionsPage from "./pages/CashRegister/CashRegisterTransactionsPage";
import CashRegisterVarianceReportPage from "./pages/CashRegister/CashRegisterVarianceReportPage";
import DepartmentPage from "./pages/Departments";
import DepartmentProfilePage from "./pages/Departments/DepartmentProfilePage";
import DesignationPage from "./pages/Designations";
import EmployeePage from "./pages/Employees";
import EmployeeProfilePage from "./pages/Employees/EmployeeProfilePage";
import LeaveRequestPage from "./pages/Leave";
import LeaveRequestDetail from "./pages/Leave/components/LeaveRequestDetail";
import LeaveApprovalsPage from "./pages/LeaveApprovals";
import PurchaseReturnPage from "./pages/Purchase-Return";
import PurchaseReturnDetailPage from "./pages/Purchase-Return/components/PurchaseReturnDetailPage";
import ReceiptSettingsPage from "./pages/Settings";
import BusinessSettingsPage from "./pages/Settings/Business";
import SuppliersPage from "./pages/Supplier";
import SupplierDetailPage from "./pages/Supplier/components/SupplierDetailPage";
import SupplierLedgerPage from "./pages/Supplier/components/SupplierLedgerPage";
import TagPage from "./pages/Tag";
import UnitPage from "./pages/Unit";
import UsersPage from "./pages/UserPage";
import WarehousePage from "./pages/Warehouse";
import BackupPage from "./pages/Backup";
import ProtectedRoute from "./route/protected";
import PublicRoute from "./route/public-route";
import InventoryProductWisePage from "./pages/Inventory/product-wise";
import InventoryProductWarehouseWise from "./pages/Inventory/warehouse-wise";
import InventoryPageBatchWise from "./pages/Inventory/batch-wise";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Home />} />
          {/* Pages */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<div>Blank Page</div>} />
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings/business" element={<BusinessSettingsPage />} />
          <Route path="/settings/receipt" element={<ReceiptSettingsPage />} />
          <Route path="/backup" element={<BackupPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/units" element={<UnitPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />
          <Route
            path="/permissions/assign-role"
            element={<PermissionAssignPage />}
          />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/tags" element={<TagPage />} />
          <Route path="/warehouses" element={<WarehousePage />} />
          <Route path="/products" element={<ProductPage />} />
          // For creating a product
          <Route path="/products/create" element={<ProductFormPage />} />
          // For viewing a product
          <Route path="/products/view/:id" element={<ProductDetailPage />} />
          // For editing a product
          <Route path="/products/edit/:id" element={<ProductFormPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/suppliers/:id" element={<SupplierDetailPage />} />
          <Route
            path="/suppliers/:id/ledger"
            element={<SupplierLedgerPage />}
          />
          {/* Purchase List */}
          <Route path="/purchase" element={<PurchasePage />} />
          <Route path="/purchases/create" element={<PurchaseCreate />} />
          <Route path="/purchases/edit/:id" element={<PurchaseEdit />} />
          {/* Purchase Detail */}
          <Route path="/purchases/:id" element={<PurchaseDetailPage />} />
          <Route
            path="/inventory/stock-batch-wise"
            element={<InventoryPageBatchWise />}
          />
          <Route
            path="/inventory/stock-product-wise"
            element={<InventoryProductWisePage />}
          />
          <Route
            path="/inventory/stock-warehouse-wise"
            element={<InventoryProductWarehouseWise />}
          />
          <Route path="/accounts/balances" element={<AccountBalancePage />} />
          <Route path="/accounts/journal" element={<JournalPage />} />
          <Route path="/accounts/payment" element={<PaymentsPage />} />
          <Route path="/payments/:id" element={<PaymentDetailsPage />} />
          <Route path="/accounts/list" element={<AccountListPage />} />
          <Route path="/accounts/cash-bank" element={<CashandBank />} />
          <Route
            path="/accounts/ledger/:accountCode"
            element={<AccountLedgerPage />}
          />
          <Route
            path="/accounts/trial-balance"
            element={<TrialBalancePage />}
          />
          <Route path="/branches" element={<BranchPage />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/customers/new" element={<CustomerFormPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
          <Route
            path="/customers/:id/ledger"
            element={<CustomerLedgerPage />}
          />
          <Route path="customers-groups" element={<CustomerGroupPage />} />
          <Route path="/expenses/category" element={<ExpenseCategoryPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/sales/create" element={<SaleFormPage />} />
          <Route path="/sales/:id" element={<SaleDetailPage />} />
          <Route
            path="/sales-return"
            element={<div>Sales Return - Coming Soon</div>}
          />
          <Route path="/purchase-returns" element={<PurchaseReturnPage />} />
          <Route
            path="/purchase-returns/:id"
            element={<PurchaseReturnDetailPage />}
          />
          {/* POS Routes */}
          <Route path="/pos" element={<POSPage />} />
          <Route path="/pos/sales-list" element={<PosSalesListPage />} />
          <Route path="/pos/sales/:id" element={<PosSaleDetailPage />} />
          <Route path="/pos/sales-summary" element={<PosSalesSummaryPage />} />
          <Route
            path="/pos/transactions"
            element={<PosTransactionHistoryPage />}
          />
          {/* Cash Register Routes */}
          <Route
            path="/cash-register"
            element={<CashRegisterManagementPage />}
          />
          <Route
            path="/cash-register/operations"
            element={<CashRegisterOperationsPage />}
          />
          <Route
            path="/cash-register/transactions"
            element={<CashRegisterTransactionsPage />}
          />
          <Route
            path="/cash-register/variance-reports"
            element={<CashRegisterVarianceReportPage />}
          />
          {/* HRM */}
          <Route path="/hrm/departments" element={<DepartmentPage />} />
          <Route
            path="/hrm/departments/:id"
            element={<DepartmentProfilePage />}
          />
          <Route path="/departments" element={<DepartmentPage />} />
          <Route path="/departments/:id" element={<DepartmentProfilePage />} />
          <Route path="/hrm/designations" element={<DesignationPage />} />
          <Route path="/hrm/employees" element={<EmployeePage />} />
          <Route path="/hrm/attendance" element={<AttendanceListPage />} />
          <Route
            path="/hrm/attendance/summary-report"
            element={<AttendanceSummaryPage />}
          />
          <Route path="/hrm/leave-requests" element={<LeaveRequestPage />} />
          <Route
            path="/hrm/leave-requests/:id"
            element={<LeaveRequestDetail />}
          />
          <Route path="/hrm/leave-approvals" element={<LeaveApprovalsPage />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/employees/:id" element={<EmployeeProfilePage />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
