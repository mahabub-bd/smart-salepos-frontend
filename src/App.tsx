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
import ProductFormPage from "./pages/Product/components/ProductFormPage";
import ProductDetailPage from "./pages/Product/components/ProductDetailPage";
import PurchasePage from "./pages/Purchase";

import AccountBalancePage from "./pages/Accounts/AccountBalance";
import AccountListPage from "./pages/Accounts/AccountList";
import CashandBank from "./pages/Accounts/CashandBank";
import JournalPage from "./pages/Accounts/JournalPage";
import PaymentsPage from "./pages/Accounts/payments";
import TrialBalancePage from "./pages/Accounts/TrialBalance";
import PaymentDetailsPage from "./pages/Accounts/payments/components/PaymentDetails";
import BranchPage from "./pages/Branch";
import CustomerPage from "./pages/Customer";
import CustomerDetailPage from "./pages/Customer/components/CustomerDetailPage";
import CustomerGroupPage from "./pages/CustomerGroup";
import ExpenseCategoryPage from "./pages/ExpenseCategory";
import ExpensesPage from "./pages/Expenses";
import InventoryPageBatchWise from "./pages/Inventory/components/batch-wise";
import InventoryProductWisePage from "./pages/Inventory/components/product-wise";
import InventoryProductWarehouseWise from "./pages/Inventory/components/warehouse-wise";
import POSPage from "./pages/POS/POSPage";
import PosSalesSummaryPage from "./pages/POS/PosSalesSummaryPage";
import PosTransactionHistoryPage from "./pages/POS/PosTransactionHistoryPage";
import PurchaseCreate from "./pages/Purchase/components/PurchaseCreate";
import PurchaseDetailPage from "./pages/Purchase/components/PurchaseDetailPage";
import PurchaseEdit from "./pages/Purchase/components/PurchaseEdit";
import RolesPage from "./pages/Role";
import SalesPage from "./pages/Sales";
import SaleDetailPage from "./pages/Sales/components/SaleDetailPage";
import SaleFormPage from "./pages/Sales/components/SaleFormPage";
import SuppliersPage from "./pages/Supplier";
import SupplierDetailPage from "./pages/Supplier/components/SupplierDetailPage";
import TagPage from "./pages/Tag";
import UnitPage from "./pages/Unit";
import UsersPage from "./pages/UserPage";
import WarehousePage from "./pages/Warehouse";
import ProtectedRoute from "./route/protected";
import PublicRoute from "./route/public-route";

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
          <Route path="/accounts/trial-balance" element={<TrialBalancePage />} />
          <Route path="/branches" element={<BranchPage />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="customers-groups" element={<CustomerGroupPage />} />
          <Route path="/expenses/category" element={<ExpenseCategoryPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/sales/create" element={<SaleFormPage />} />
          <Route path="/sales/:id" element={<SaleDetailPage />} />
          {/* POS Routes */}
          <Route path="/pos" element={<POSPage />} />
          <Route path="/pos/sales-summary" element={<PosSalesSummaryPage />} />
          <Route
            path="/pos/transactions"
            element={<PosTransactionHistoryPage />}
          />
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
