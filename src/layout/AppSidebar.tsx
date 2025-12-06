import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { RootState } from "../store";

import { BookOpenText, FileText, Package2Icon } from "lucide-react";
import { ChevronDownIcon, HorizontaLDots } from "../icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    requiredPermission?: string;
  }[];
  requiredPermission?: string;
};

import {
  Banknote,
  CalendarDays,
  GitBranch,
  LayoutDashboard,
  MonitorSmartphone,
  PieChart,
  Settings,
  ShieldCheck,
  Truck,
  UserCircle,
  Users,
  Warehouse,
} from "lucide-react";

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
        requiredPermission: "sale_return.view", // use permission if you have
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

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  // Get permissions from Redux
  const { permissions } = useSelector((state: RootState) => state.auth);

  // Permission checking (without hook)
  const hasPermission = useCallback(
    (permission?: string) => {
      if (!permission) return true;
      return permissions.includes(permission);
    },
    [permissions]
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev && prev.index === index ? null : { type: menuType, index }
    );
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items
        .filter((nav) => hasPermission(nav.requiredPermission))
        .map((nav, index) => (
          <li key={nav.name}>
            {nav.subItems ? (
              <>
                {nav.subItems.some((sub) =>
                  hasPermission(sub.requiredPermission)
                ) && (
                  <button
                    onClick={() => handleSubmenuToggle(index, menuType)}
                    className={`menu-item group ${
                      openSubmenu?.index === index
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    } `}
                  >
                    <span className="menu-item-icon-size">{nav.icon}</span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <>
                        <span className="menu-item-text">{nav.name}</span>
                        <ChevronDownIcon
                          className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                            openSubmenu?.type === menuType &&
                            openSubmenu?.index === index
                              ? "rotate-180 text-brand-500"
                              : ""
                          }`}
                        />
                      </>
                    )}
                  </button>
                )}

                {(isExpanded || isHovered || isMobileOpen) && (
                  <div
                    ref={(el) => {
                      subMenuRefs.current[`${menuType}-${index}`] = el;
                    }}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      height:
                        openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                          ? `${subMenuHeight[`${menuType}-${index}`]}px`
                          : "0px",
                    }}
                  >
                    <ul className="mt-2 space-y-1 ml-9">
                      {nav.subItems
                        .filter((subItem) =>
                          hasPermission(subItem.requiredPermission)
                        )
                        .map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              to={subItem.path}
                              className={`menu-dropdown-item ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-item-active"
                                  : "menu-dropdown-item-inactive"
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              nav.path &&
              hasPermission(nav.requiredPermission) && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span className="menu-item-icon-size">{nav.icon}</span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}
          </li>
        ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 h-screen transition-all duration-300 ease-in-out z-50 border-r
      ${
        isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
          ? "w-[290px]"
          : "w-[90px]"
      }
      ${
        isMobileOpen
          ? "translate-x-0 bg-white dark:bg-gray-900"
          : "-translate-x-full"
      } lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                src="/images/logo/salepos_logo.png"
                className="dark:hidden"
                width={100}
                height={40}
              />
              <img
                src="/images/logo/salepos_white_logo.png"
                className="hidden dark:block"
                width={100}
                height={40}
              />
            </>
          ) : (
            <img src="/images/logo/logo-icon.svg" width={32} height={32} />
          )}
        </Link>
      </div>

      {/* Menu Section */}
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xs uppercase text-gray-400">
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div>
              <h2 className="text-xs uppercase text-gray-400">
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
