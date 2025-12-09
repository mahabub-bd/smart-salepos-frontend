import {
  Banknote,
  BookOpenText,
  CalendarDays,
  FileText,
  GitBranch,
  LayoutDashboard,
  MonitorSmartphone,
  Package2Icon,
  PieChart,
  Settings,
  ShieldCheck,
  Truck,
  UserCircle,
  Users,
  UsersRound,
  Warehouse,
} from "lucide-react";
import { NavItem } from "../layout/AppSidebar";

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard />,
    name: "Dashboard",
    path: "/",
    requiredPermission: "dashboard.view",
  },
  {
    icon: <MonitorSmartphone />,
    name: "POS",
    requiredPermission: "pos.view",
    subItems: [
      {
        name: "New Sale",
        path: "/pos",
        requiredPermission: "pos.view",
      },
      {
        name: "Today's Sales",
        path: "/pos/sales-summary",
        requiredPermission: "pos.view",
      },
      {
        name: "Transaction History",
        path: "/pos/transactions",
        requiredPermission: "pos.view",
      },
    ],
  },
  {
    icon: <Package2Icon />,
    name: "Products",
    requiredPermission: "product.view",
    subItems: [
      {
        name: "Products",
        path: "/products",
        requiredPermission: "product.view",
      },
      { name: "Brands", path: "/brands", requiredPermission: "brand.view" },
      {
        name: "Categories",
        path: "/categories",
        requiredPermission: "category.view",
      },
      { name: "Units", path: "/units", requiredPermission: "unit.view" },
      { name: "Tags", path: "/tags", requiredPermission: "tag.view" },
    ],
  },
  {
    icon: <CalendarDays />,
    name: "Purchase",
    requiredPermission: "purchase.view",
    subItems: [
      {
        name: "Purchase List",
        path: "/purchase",
        requiredPermission: "purchase.view",
      },
      {
        name: "Purchase Return",
        path: "/purchase-returns",
        requiredPermission: "purchase_return.view",
      },
    ],
  },
  {
    icon: <Warehouse />,
    name: "Inventory",
    requiredPermission: "inventory.view",
    subItems: [
      {
        name: "Warehouses",
        path: "/warehouses",
        requiredPermission: "warehouse.view",
      },
      {
        name: "Stock Batch Wise",
        path: "/inventory/stock-batch-wise",
        requiredPermission: "inventory.view",
      },

      {
        name: "Stock Product Wise",
        path: "/inventory/stock-product-wise",
        requiredPermission: "inventory.view",
      },

      {
        name: "Stock Warehouse Wise",
        path: "/inventory/stock-warehouse-wise",
        requiredPermission: "inventory.view",
      },

      {
        name: "Inventory Movement",
        path: "/inventory",
        requiredPermission: "inventory.view",
      },
    ],
  },
  {
    icon: <GitBranch />,
    name: "Branch",
    requiredPermission: "branch.view",
    subItems: [
      {
        name: "Branch List",
        path: "/branches",
        requiredPermission: "branch.view",
      },
    ],
  },

  {
    name: "Accounts",
    icon: <LayoutDashboard size={18} />,
    path: "/accounts",
    subItems: [
      {
        name: "Cash & Bank Accounts",
        path: "/accounts/cash-bank",
      },
      { name: "Account List", path: "/accounts/list" },
      { name: "Balance Sheet", path: "/accounts/balances" },
      { name: "Trial Balance", path: "/accounts/trial-balance" },
    ],
  },

  {
    name: "Journal",
    icon: <BookOpenText size={18} />,
    subItems: [
      {
        name: "All Journals",
        path: "/accounts/journal",
      },
      {
        name: "Payments",
        path: "/accounts/payment",
      },
    ],
  },
  {
    icon: <Truck />,
    name: "Supplier",
    path: "/suppliers",
    requiredPermission: "suppliers.view",
  },
  {
    icon: <PieChart />,
    name: "Sale",
    requiredPermission: "sales.view",
    subItems: [
      {
        name: "Sale List",
        path: "/sales",
        requiredPermission: "sales.view",
      },
      {
        name: "Sales Return",
        path: "/sales-return",
        requiredPermission: "sale_return.view",
      },
    ],
  },

  {
    icon: <Banknote />,
    name: "Expense",

    requiredPermission: "expense.view",
    subItems: [
      {
        name: "All Expenses",
        path: "/expenses",
      },

      {
        name: "Expense Category",
        path: "/expenses/category",
      },
    ],
  },
  {
    icon: <UserCircle />,
    name: "Customer",

    requiredPermission: "customer.view",
    subItems: [
      {
        name: "Customer List",
        path: "/customers",
        requiredPermission: "customer.view",
      },
      {
        name: "Customer Group",
        path: "/customers-groups",
        requiredPermission: "customergroup.view",
      },
    ],
  },
  {
    icon: <Users />,
    name: "Users",
    path: "/users",
    requiredPermission: "user.view",
  },
  {
    icon: <UsersRound />,
    name: "HRM",
    requiredPermission: "hrm.view",
    subItems: [
      {
        name: "Employees",
        path: "/hrm/employees",
        requiredPermission: "employee.view",
      },
      {
        name: "Departments",
        path: "/hrm/departments",
        requiredPermission: "department.view",
      },
      {
        name: "Payroll",
        path: "/hrm/payroll",
        requiredPermission: "payroll.view",
      },
      {
        name: "Attendance",
        path: "/hrm/attendance",
        requiredPermission: "attendance.view",
      },
      {
        name: "Leave Requests",
        path: "/hrm/leave-requests",
        requiredPermission: "leave_requests.view",
      },
      {
        name: "Designations",
        path: "/hrm/designations",
        requiredPermission: "designation.view",
      },
      {
        name: "Approval Delegations",
        path: "/hrm/approval-delegations",
        requiredPermission: "hrm.approval_delegations.view",
      },
      {
        name: "Leave Approvals",
        path: "/hrm/leave-approvals",
        requiredPermission: "hrm.leave_approvals.view",
      },
    ],
  },
  {
    icon: <Settings />,
    name: "Settings",
    subItems: [
      {
        name: "Business Setting",
        path: "/settings/business",
        requiredPermission: "settings.view",
      },
      {
        name: "Receipt Settings",
        path: "/settings/receipt",
        requiredPermission: "settings.view",
      },
    ],
  },
  {
    icon: <ShieldCheck />,
    name: "Roles & Permissions",
    requiredPermission: "role.view",
    subItems: [
      { name: "Roles", path: "/roles", requiredPermission: "role.view" },
      {
        name: "Permissions",
        path: "/permissions",
        requiredPermission: "permission.view",
      },
      {
        name: "Permission Assign",
        path: "/permissions/assign-role",
        requiredPermission: "permissionassign.view",
      },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <FileText />,
    name: "Reports",
    requiredPermission: "report.view",
    subItems: [
      {
        name: "Sales Report",
        path: "/reports/sales",
        requiredPermission: "report.sales",
      },
      {
        name: "Purchase Report",
        path: "/reports/purchase",
        requiredPermission: "report.purchase",
      },
      {
        name: "Inventory Report",
        path: "/reports/inventory",
        requiredPermission: "report.inventory",
      },
      {
        name: "Customer Report",
        path: "/reports/customers",
        requiredPermission: "report.customer",
      },
    ],
  },
];

export { navItems, othersItems };
