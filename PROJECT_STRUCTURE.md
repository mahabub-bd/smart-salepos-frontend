# Smart Sale POS Frontend - Complete Project Structure

## Root Directory Overview
```
smart-salepos-frontend/
├── .claude/                          # Claude Code configuration
├── public/                           # Static assets (images, icons, logos)
├── src/                              # Source code
├── Configuration files               # Docker, ESLint, TypeScript, etc.
└── Documentation                     # README, LICENSE, etc.
```

---

## Detailed Structure

### 📁 Public Assets (`/public`)
```
public/
├── favicon.png
└── images/
    ├── brand/          # Brand logos (15 SVG files)
    ├── cards/          # Card images (6 files)
    ├── carousel/       # Carousel images (4 PNG files)
    ├── chat/           # Chat related images
    ├── country/        # Country flags (8 SVG files)
    ├── error/          # Error page illustrations (404, 500, 503, success, maintenance)
    ├── grid-image/     # Grid layout images (6 PNG files)
    ├── icons/          # File type icons (PDF, image, video)
    ├── logo/           # Application logos (salepos_logo.png, salepos_white_logo.png)
    ├── product/        # Product images (5 JPG files)
    ├── shape/          # Shape graphics
    ├── task/           # Task related images
    ├── user/           # User avatars (37 JPG files)
    └── video-thumb/    # Video thumbnails
```

---

### 📁 Source Code (`/src`)

#### **Components** (`/src/components`)
Reusable React components organized by functionality:

```
components/
├── auth/                             # Authentication components
│   ├── SignInForm.tsx
│   └── SignUpForm.tsx
│
├── cash-register/                    # Cash register UI
│   └── CashRegisterSidebar.tsx
│
├── charts/                           # Chart components
│   ├── bar/
│   │   └── BarChartOne.tsx
│   └── line/
│       └── LineChartOne.tsx
│
├── common/                           # Shared utility components
│   ├── AccountBadge.tsx              # Account type badge
│   ├── ChartTab.tsx                  # Chart tab switcher
│   ├── CompactMetricCard.tsx         # Metric display card
│   ├── ComponentCard.tsx             # Wrapper card component
│   ├── ConfirmDialog.tsx             # Confirmation dialog
│   ├── EmployeeActionButton.tsx      # Employee action menu
│   ├── GridShape.tsx                 # Grid background
│   ├── IconButton.tsx                # Icon-based button
│   ├── Info.tsx                      # Info tooltip
│   ├── LedgerSummaryCard.tsx         # Ledger summary display
│   ├── Loading.tsx                   # Loading spinner
│   ├── PageBreadCrumb.tsx            # Breadcrumb navigation
│   ├── PageHeader.tsx                # Page header with title
│   ├── PageMeta.tsx                  # Page metadata (title, description)
│   ├── ScrollToTop.tsx               # Scroll to top utility
│   ├── stat-card.tsx                 # Statistics card
│   ├── Table.tsx                     # Table component
│   ├── ThemeToggleButton.tsx         # Dark/light theme toggle
│   └── ThemeTogglerTwo.tsx           # Alternative theme toggle
│
├── ecommerce/                        # Dashboard/Analytics components
│   ├── CountryMap.tsx                # Geographic sales map
│   ├── DemographicCard.tsx           # Customer demographics
│   ├── EcommerceMetrics.tsx          # Key metrics display
│   ├── Last30DaysSalesChart.tsx      # 30-day sales trend
│   ├── MonthlySalesChart.tsx         # Monthly sales chart
│   ├── MonthlyTarget.tsx             # Monthly target tracker
│   ├── RecentOrders.tsx              # Recent orders list
│   ├── StatisticsChart.tsx           # Statistics visualization
│   └── YearlyMonthWiseSalesChart.tsx # Yearly sales breakdown
│
├── form/                             # Form components
│   ├── date-picker.tsx               # Date picker input
│   ├── Form.tsx                      # Form wrapper
│   ├── Label.tsx                     # Form label
│   ├── MultiSelect.tsx               # Multi-select dropdown
│   ├── Select.tsx                    # Select dropdown
│   ├── time-picker.tsx               # Time picker input
│   │
│   ├── form-elements/                # Form input components
│   │   ├── CheckboxComponents.tsx
│   │   ├── DefaultInputs.tsx
│   │   ├── DropZone.tsx              # File drag-drop zone
│   │   ├── FileInputExample.tsx
│   │   ├── InputGroup.tsx
│   │   ├── InputStates.tsx
│   │   ├── RadioButtons.tsx
│   │   ├── SelectFiled.tsx
│   │   ├── SelectInputs.tsx
│   │   ├── TextAreaInput.tsx
│   │   └── ToggleSwitch.tsx
│   │
│   ├── group-input/
│   │   └── PhoneInput.tsx            # Phone number input with country code
│   │
│   ├── input/                        # Basic input components
│   │   ├── Checkbox.tsx
│   │   ├── FileInput.tsx
│   │   ├── InputField.tsx
│   │   ├── PasswordInput.tsx
│   │   ├── Radio.tsx
│   │   ├── RadioSm.tsx
│   │   └── TextArea.tsx
│   │
│   └── switch/
│       └── Switch.tsx                # Toggle switch
│
├── header/                           # Application header
│   ├── Header.tsx                    # Main header component
│   ├── NotificationDropdown.tsx      # Notifications menu
│   └── UserDropdown.tsx              # User profile menu
│
├── qr-barcode/                       # QR and Barcode generation
│   ├── Barcode.tsx                   # Barcode generator
│   ├── index.ts
│   └── QRCode.tsx                    # QR code generator
│
├── receipt/                          # Receipt/Invoice templates
│   ├── ReceiptPDF.tsx                # PDF receipt template
│   └── ThermalReceipt58mm.tsx        # 58mm thermal printer receipt
│
├── tables/
│   └── BasicTables/
│       └── BasicTableOne.tsx
│
├── ui/                               # UI library components
│   ├── alert/
│   │   └── Alert.tsx
│   ├── avatar/
│   │   └── Avatar.tsx
│   ├── badge/
│   │   ├── Badge.tsx
│   │   └── StatCard.tsx
│   ├── button/
│   │   ├── button.tsx
│   │   └── Button.tsx
│   ├── dropdown/
│   │   ├── Dropdown.tsx
│   │   └── DropdownItem.tsx
│   ├── images/
│   │   ├── ResponsiveImage.tsx
│   │   ├── ThreeColumnImageGrid.tsx
│   │   └── TwoColumnImageGrid.tsx
│   ├── modal/
│   │   ├── index.tsx
│   │   └── Modal.tsx
│   ├── pagination/
│   │   └── Pagination.tsx
│   ├── table/
│   │   └── index.tsx
│   ├── tabs/
│   │   └── Tabs.tsx
│   └── videos/
│       ├── AspectRatioVideo.tsx
│       ├── FourIsToThree.tsx
│       ├── OneIsToOne.tsx
│       ├── SixteenIsToNine.tsx
│       └── TwentyOneIsToNine.tsx
│
└── UserProfile/                      # User profile components
    ├── UserAddressCard.tsx
    └── UserInfoCard.tsx
```

---

#### **Features** (`/src/features`)
Redux Toolkit slices and RTK Query API endpoints:

```
features/
├── apiSlice.ts                       # Base RTK Query API configuration
│
├── accounts/
│   └── accountsApi.ts                # Chart of accounts, ledger, balance APIs
├── attachment/
│   └── attachmentApi.ts              # File upload/download APIs
├── attendance/
│   └── attendanceApi.ts              # Employee attendance APIs
├── auth/
│   ├── authApi.ts                    # Login, logout, register APIs
│   └── authSlice.ts                  # Auth state management
├── backup/
│   └── backupApi.ts                  # Database backup APIs
├── branch/
│   └── branchApi.ts                  # Branch management APIs
├── brand/
│   └── brandApi.ts                   # Brand management APIs
├── cash-register/
│   └── cashRegisterApi.ts            # Cash register operations APIs
├── category/
│   └── categoryApi.ts                # Product category APIs
├── customer/
│   └── customerApi.ts                # Customer management APIs
├── customer-group/
│   └── customerGroupApi.ts           # Customer group APIs
├── department/
│   └── departmentApi.ts              # Department management APIs
├── designation/
│   └── designationApi.ts             # Designation management APIs
├── employee/
│   └── employeeApi.ts                # Employee management APIs
├── expense-category/
│   └── expenseCategoryApi.ts         # Expense category APIs
├── expenses/
│   └── expensesApi.ts                # Expense management APIs
├── inventory/
│   └── inventoryApi.ts               # Inventory tracking APIs
├── invoice/
│   └── invoiceApi.ts                 # Invoice generation APIs
├── leave/
│   └── leaveApi.ts                   # Leave management APIs
├── manufacturer/
│   └── manufacturerApi.ts            # Manufacturer management APIs
├── payment/
│   └── paymentApi.ts                 # Payment processing APIs
├── permissions/
│   └── permissionsApi.ts             # Permission management APIs
├── pos/
│   └── posApi.ts                     # Point of Sale APIs
├── product/
│   └── productApi.ts                 # Product management APIs
├── production/
│   ├── hooks.ts                      # Production custom hooks
│   ├── productionApi.ts              # Production order APIs
│   ├── productionRecipeApi.ts        # Production recipe APIs
│   └── recipe-hooks.ts               # Recipe-specific hooks
├── purchase-return/
│   └── purchaseReturnApi.ts          # Purchase return APIs
├── purchases/
│   └── purchasesApi.ts               # Purchase order APIs
├── quotation/
│   └── quotationApi.ts               # Quotation management APIs
├── report/
│   ├── reportApi.ts                  # Reporting APIs
│   └── types.ts                      # Report-specific types
├── role/
│   └── roleApi.ts                    # Role management APIs
├── sale/
│   └── saleApi.ts                    # Sales management APIs
├── settings/
│   └── settingsApi.ts                # Application settings APIs
├── suppliers/
│   └── suppliersApi.ts               # Supplier management APIs
├── tag/
│   └── tagApi.ts                     # Tag management APIs
├── unit/
│   └── unitApi.ts                    # Unit of measurement APIs
├── user/
│   └── userApi.ts                    # User management APIs
└── warehouse/
    └── warehouseApi.ts               # Warehouse management APIs
```

---

#### **Pages** (`/src/pages`)
Application pages/routes organized by module:

```
pages/
├── index.ts                          # Page exports
│
├── Accounts/                         # 💰 Accounting Module
│   ├── AccountBalance/               # Account balance view
│   ├── AccountLedgerPage/            # Ledger entries
│   ├── AccountList/                  # Chart of accounts
│   │   └── components/
│   │       ├── AccountInfo.tsx
│   │       ├── AccountList.tsx
│   │       ├── AddBalanceModal.tsx
│   │       ├── AddCashModal.tsx
│   │       ├── formSchema.ts
│   │       └── FundTransferModal.tsx
│   ├── CashandBank/                  # Cash & bank accounts
│   ├── JournalPage/                  # Journal entries
│   ├── payments/                     # Payment management
│   │   ├── index.tsx
│   │   ├── PaymentList.tsx
│   │   └── components/
│   │       └── PaymentDetails.tsx
│   └── TrialBalance/                 # Trial balance report
│
├── Attendance/                       # 📅 Attendance Module
│   ├── AttendanceList/               # Daily attendance
│   │   └── components/
│   │       ├── attendance-form.schema.ts
│   │       ├── AttendanceFormModal.tsx
│   │       ├── AttendanceList.tsx
│   │       ├── bulk-attendance.schema.ts
│   │       ├── BulkAttendanceModal.tsx
│   │       ├── check-in-out.schema.ts
│   │       └── CheckInOutModal.tsx
│   ├── AttendanceSummary/            # Attendance summary reports
│   └── OvertimeReport/               # Overtime tracking
│
├── AuthPages/                        # 🔐 Authentication
│   ├── AuthPageLayout.tsx
│   ├── SignIn.tsx
│   └── SignUp.tsx
│
├── Backup/                           # 💾 Database Backup
│   ├── index.tsx
│   └── components/
│       ├── BackupFormModal.tsx
│       └── BackupList.tsx
│
├── Branch/                           # 🏢 Branch Management
│   ├── index.tsx
│   └── components/
│       ├── branch.schema.ts
│       ├── BranchFormModal.tsx
│       └── BranchList.tsx
│
├── Brand/                            # 🏷️ Brand Management
│   ├── index.tsx
│   └── components/
│       ├── BrandFormModal.tsx
│       └── BrandList.tsx
│
├── CashRegister/                     # 💵 Cash Register Module
│   ├── CashRegisterManagementPage.tsx    # Register setup
│   ├── CashRegisterOperationsPage.tsx    # Open/close operations
│   ├── CashRegisterTransactionsPage.tsx  # Transaction history
│   └── CashRegisterVarianceReportPage.tsx # Variance tracking
│
├── Category/                         # 📂 Product Categories
│   ├── index.tsx
│   └── components/
│       ├── CategoryFormModal.tsx
│       └── CategoryList.tsx
│
├── Charts/                           # 📊 Chart Demos
│   ├── BarChart.tsx
│   └── LineChart.tsx
│
├── Customer/                         # 👥 Customer Management
│   ├── index.tsx
│   └── components/
│       ├── CustomerDetail.tsx
│       ├── CustomerDetailPage.tsx
│       ├── CustomerFormModal.tsx
│       ├── CustomerFormPage.tsx
│       ├── CustomerLedgerPage.tsx
│       ├── CustomerList.tsx
│       ├── ReuseableComponent.tsx
│       └── SalesTable.tsx
│
├── CustomerGroup/                    # 👨‍👩‍👧‍👦 Customer Groups
│   ├── index.tsx
│   └── components/
│       ├── CustomerGroupFormModal.tsx
│       └── CustomerGroupList.tsx
│
├── Dashboard/                        # 🏠 Dashboard
│   └── Home.tsx
│
├── Departments/                      # 🏛️ Department Management
│   ├── index.tsx
│   ├── DepartmentProfilePage.tsx
│   └── components/
│       ├── DepartmentFormModal.tsx
│       ├── DepartmentList.tsx
│       └── DepartmentProfile.tsx
│
├── Designations/                     # 🎖️ Designation Management
│   ├── index.tsx
│   └── components/
│       ├── DesignationFormModal.tsx
│       └── DesignationList.tsx
│
├── Employees/                        # 👨‍💼 Employee Management
│   ├── index.tsx
│   ├── EmployeeProfilePage.tsx
│   └── components/
│       ├── EmployeeFormModal.tsx
│       ├── EmployeeList.tsx
│       ├── EmployeeProfile.tsx
│       ├── ResignEmployeeModal.tsx
│       └── TerminateEmployeeModal.tsx
│
├── ExpenseCategory/                  # 📝 Expense Categories
│   ├── index.tsx
│   └── components/
│       ├── ExpenseCategoryFormModal.tsx
│       └── ExpenseCategoryList.tsx
│
├── Expenses/                         # 💸 Expense Management
│   ├── index.tsx
│   └── components/
│       ├── ExpenseFormModal.tsx
│       ├── ExpenseList.tsx
│       └── expenseSchema.ts
│
├── Inventory/                        # 📦 Inventory Management
│   ├── batch-wise/                   # Batch tracking
│   ├── inventory-journal/            # Inventory movements journal
│   ├── product-wise/                 # Product-level inventory
│   │   ├── InventoryList.tsx
│   │   ├── InventoryListProductWise.tsx
│   │   ├── InventoryMaterialPage.tsx
│   │   └── InventoryProductPage.tsx
│   ├── stock-movement/               # Stock movement tracking
│   ├── warehouse-wise/               # Warehouse-level inventory
│   └── components/
│       ├── InventoryCard.tsx
│       ├── StockAdjustmentModal.tsx
│       └── StockTransferModal.tsx
│
├── Leave/                            # 🏖️ Leave Management
│   ├── index.tsx
│   └── components/
│       ├── LeaveRequestDetail.tsx
│       ├── LeaveRequestList.tsx
│       └── LeaveRequestModal.tsx
│
├── LeaveApprovals/                   # ✅ Leave Approvals
│   ├── index.tsx
│   └── components/
│       └── LeaveApprovalsList.tsx
│
├── PermissionAssignPage/             # 🔑 Permission Assignment
│   ├── index.tsx
│   └── components/
│       ├── PermissionActions.tsx
│       ├── PermissionCard.tsx
│       ├── PermissionGrid.tsx
│       └── RoleSelector.tsx
│
├── PermissionPage/                   # 🔐 Permission Management
│   ├── index.tsx
│   └── components/
│       ├── PermissionFormModal.tsx
│       └── PermissionList.tsx
│
├── POS/                              # 🛒 Point of Sale
│   ├── PaymentBox.tsx
│   ├── POSPage.tsx                   # Main POS interface
│   ├── PosSaleDetailPage.tsx         # Sale details
│   ├── PosSalesListPage.tsx          # Sales history
│   ├── PosSalesSummaryPage.tsx       # Sales summary
│   └── PosTransactionHistoryPage.tsx # Transaction history
│
├── Product/                          # 📦 Product Management
│   ├── index.tsx
│   ├── ComponentPage.tsx             # Product components/materials
│   └── components/
│       ├── ComponentList.tsx
│       ├── ProductDetail.tsx
│       ├── ProductDetailPage.tsx
│       ├── ProductFormPage.tsx
│       └── ProductList.tsx
│
├── Production/                       # 🏭 Production Module
│   ├── Order/                        # Production orders
│   │   ├── index.tsx
│   │   ├── ProductionOrderDetailPage.tsx
│   │   ├── ProductionOrderFormPage.tsx
│   │   └── ProductionOrderList.tsx
│   └── Recipe/                       # Production recipes/BOM
│       ├── index.tsx
│       ├── formSchema.ts
│       ├── ProductionRecipeFormPage.tsx
│       └── ProductionRecipeList.tsx
│
├── Purchase/                         # 🛍️ Purchase Management
│   ├── index.tsx
│   └── components/
│       ├── PurchaseCreate.tsx
│       ├── PurchaseDetail.tsx
│       ├── PurchaseDetailPage.tsx
│       ├── PurchaseEdit.tsx
│       ├── PurchaseForm.tsx
│       ├── PurchaseList.tsx
│       ├── PurchasePaymentModal.tsx
│       ├── PurchaseReceiveModal.tsx
│       ├── purchaseSchema.ts
│       ├── PurchaseStatusBadge.tsx
│       └── PurchaseStatusModal.tsx
│
├── Purchase-Return/                  # ↩️ Purchase Returns
│   ├── index.tsx
│   └── components/
│       ├── ApprovalModal.tsx
│       ├── CancelModal.tsx
│       ├── ProcessingModal.tsx
│       ├── PurchaseReturnDetailPage.tsx
│       ├── PurchaseReturnEditModal.tsx
│       ├── PurchaseReturnList.tsx
│       ├── PurchaseReturnModal.tsx
│       ├── PurchaseReturnStatusBadge.tsx
│       └── RefundModal.tsx
│
├── Quotation/                        # 📋 Quotation Management
│   ├── index.tsx
│   ├── Create.tsx
│   ├── Detail.tsx
│   ├── Edit.tsx
│   └── components/
│       ├── ConvertToSaleModal.tsx
│       ├── QuotationAnalytics.tsx
│       ├── QuotationDetail.tsx
│       ├── QuotationForm.tsx
│       ├── QuotationForm/
│       │   ├── BasicInfoFields.tsx
│       │   ├── QuotationItemRow.tsx
│       │   ├── QuotationSummary.tsx
│       │   └── useQuotationCalculations.ts
│       ├── QuotationList.tsx
│       ├── quotationSchema.ts
│       └── QuotationStatusBadge.tsx
│
├── Reports/                          # 📈 Reports & Analytics
│   ├── index.tsx
│   ├── ReportDashboard.tsx
│   ├── CustomersReportPage.tsx
│   ├── EmployeesReportPage.tsx
│   ├── ExpenseReportPage.tsx
│   ├── InventoryReportPage.tsx
│   ├── ProductsReportPage.tsx
│   ├── ProfitLossReportPage.tsx
│   ├── PurchaseReportPage.tsx
│   ├── SalesReportPage.tsx
│   ├── StockReportPage.tsx
│   ├── SummaryReportPage.tsx
│   └── components/
│       ├── CustomersReportView.tsx
│       ├── EmployeesReportView.tsx
│       ├── ExpenseReportView.tsx
│       ├── GenerateReportModal.tsx
│       ├── InventoryReportView.tsx
│       ├── ProductsReportView.tsx
│       ├── ReportList.tsx
│       ├── StockReportView.tsx
│       ├── SummaryReportView.tsx
│       ├── common/
│       │   ├── ComparisonSection.tsx
│       │   └── ReportFilters.tsx
│       ├── hooks/
│       │   ├── useBranchOptions.ts
│       │   ├── useCustomerOptions.ts
│       │   ├── useProductOptions.ts
│       │   ├── useSupplierOptions.ts
│       │   └── useWarehouseOptions.ts
│       ├── profit-loss/
│       │   └── ProfitLossReportView.tsx
│       ├── purchase-report/
│       │   └── PurchaseReportView.tsx
│       └── sales-report/
│           └── SalesReportView.tsx
│
├── Role/                             # 👔 Role Management
│   ├── index.tsx
│   └── components/
│       ├── RoleFormModal.tsx
│       └── RoleList.tsx
│
├── Sales/                            # 💰 Sales Management
│   ├── index.tsx
│   └── components/
│       ├── SaleDetailPage.tsx
│       ├── SaleFormPage.tsx
│       ├── SalePaymentModal.tsx
│       └── SalesList.tsx
│
├── Settings/                         # ⚙️ Settings
│   ├── index.tsx
│   ├── ReceiptSettings.tsx
│   └── Business/
│       ├── index.tsx
│       └── BusinessSettings.tsx
│
├── Supplier/                         # 🏭 Supplier Management
│   ├── index.tsx
│   └── components/
│       ├── SupplierDetailPage.tsx
│       ├── SupplierFormModal.tsx
│       ├── SupplierLedgerPage.tsx
│       └── SupplierList.tsx
│
├── Tag/                              # 🏷️ Tag Management
│   ├── index.tsx
│   └── components/
│       ├── TagFormModal.tsx
│       └── TagList.tsx
│
├── Unit/                             # 📏 Unit Management
│   ├── index.tsx
│   └── components/
│       ├── UnitFormModal.tsx
│       └── UnitList.tsx
│
├── UserPage/                         # 👤 User Management
│   ├── index.tsx
│   └── components/
│       ├── UserFormModal.tsx
│       └── UserList.tsx
│
├── Warehouse/                        # 🏭 Warehouse Management
│   ├── index.tsx
│   └── components/
│       ├── WarehouseFormModal.tsx
│       └── WarehouseList.tsx
│
├── Tables/                           # 📊 Table Demos
│   └── BasicTables.tsx
│
├── UiElements/                       # 🎨 UI Component Demos
│   ├── Alerts.tsx
│   ├── Avatars.tsx
│   ├── Badges.tsx
│   ├── Buttons.tsx
│   ├── Images.tsx
│   └── Videos.tsx
│
├── OtherPage/
│   └── NotFound.tsx
│
├── Blank.tsx
├── Calendar.tsx
└── UserProfiles.tsx
```

---

#### **Types** (`/src/types`)
TypeScript type definitions organized by domain:

```
types/
├── index.ts                          # Base types & re-exports
│   - BaseEntity
│   - BaseEntityWithStatus
│   - BaseEntityWithCode
│   - PaymentMethod
│   - PaymentTerm
│   - TransactionType
│   - PaginationMeta
│   - ApiResponse
│   - PaginatedResponse
│   - ListResponse
│   - CreatePayload<T>
│   - UpdatePayload<T>
│
├── accounts.ts                       # Accounting types
│   - Account
│   - AccountBasic
│   - JournalEntry
│   - JournalTransaction
│   - LedgerEntry
│   - TrialBalanceItem
│
├── analytics.ts                      # Analytics & metrics types
│
├── attendance.ts                     # Attendance types
│   - Attendance
│   - AttendanceStatus
│   - AttendanceSummary
│   - BulkAttendance
│   - CheckInOut
│
├── backup.ts                         # Backup types
│   - Backup
│   - BackupStatus
│
├── branch.ts                         # Branch & warehouse types
│   - Branch
│   - BranchBasic
│   - Warehouse
│   - WarehouseBasic
│
├── cashregister.ts                   # Cash register types
│   - CashRegister
│   - CashRegisterTransaction
│   - CashRegisterVariance
│
├── customer.ts                       # Customer types
│   - Customer
│   - CustomerBasic
│   - CustomerGroup
│
├── expenses.ts                       # Expense types
│   - Expense
│   - ExpenseCategory
│
├── hrm.ts                            # HR management types
│   - Employee
│   - Department
│   - Designation
│
├── inventory.ts                      # Inventory types
│   - InventoryItem
│   - StockMovement
│   - StockAdjustment
│   - StockTransfer
│
├── leave.ts                          # Leave management types
│   - LeaveRequest
│   - LeaveType
│   - LeaveBalance
│   - LeaveApproval
│
├── manufacturer.ts                   # Manufacturer types
│
├── payment.ts                        # Payment types
│   - Payment
│   - PaymentStatus
│
├── payroll.ts                        # Payroll types
│   - Payroll
│   - Salary
│
├── pos.ts                            # POS types
│   - PosSale
│   - PosSaleItem
│   - PosSalePayment
│
├── posPage.ts                        # POS page-specific types
│   - CartItem
│   - ProductData
│   - POSProduct
│   - PaymentMethodExtended
│   - SaleReceiptData
│
├── product.ts                        # Product types
│   - Product
│   - ProductBasic
│   - ProductCategory
│   - ProductBrand
│   - ProductTag
│   - ProductUnit
│
├── production.ts                     # Production types
│   - ProductionOrder
│   - ProductionOrderItem
│   - ProductionStatus
│
├── production-recipe.ts              # Production recipe types
│   - ProductionRecipe
│   - RecipeIngredient
│
├── purchase.ts                       # Purchase types
│   - Purchase
│   - PurchaseItem
│   - PurchaseStatus
│
├── purchase-return.ts                # Purchase return types
│   - PurchaseReturn
│   - PurchaseReturnItem
│   - PurchaseReturnStatus
│
├── quotation.ts                      # Quotation types
│   - Quotation
│   - QuotationItem
│   - QuotationStatus
│
├── report.ts                         # Report types
│   - ReportFilter
│   - SalesReport
│   - PurchaseReport
│   - InventoryReport
│   - ProfitLossReport
│
├── role.ts                           # Role & permission types
│   - Role
│   - RoleBasic
│   - Permission
│
├── sales.ts                          # Sales types
│   - Sale
│   - SaleData
│   - SaleItem
│   - SalePayment
│   - SaleStatus
│
├── settings.ts                       # Settings types
│   - BusinessSettings
│   - ReceiptSettings
│   - ReceiptPreviewData
│
├── supplier.ts                       # Supplier types
│   - Supplier
│   - SupplierBasic
│
├── user.ts                           # User types
│   - User
│   - UserBasic
│   - UserWithRoles
│   - LoginRequest
│   - LoginResponse
│   - CreateUserPayload
│   - UpdateUserPayload
│
└── IMPROVEMENTS.md                   # Type system improvements doc
```

---

#### **Other Directories**

```
src/
├── constants/                        # Application constants
│   └── index.tsx
│
├── context/                          # React Context providers
│   ├── SidebarContext.tsx            # Sidebar state management
│   └── ThemeContext.tsx              # Dark/light theme management
│
├── hooks/                            # Custom React hooks
│   ├── useGoBack.ts                  # Navigation hook
│   ├── useHasPermission.tsx          # Permission checking hook
│   └── useModal.ts                   # Modal state management hook
│
├── icons/                            # SVG icon files (40+ icons)
│   ├── index.ts
│   ├── alert.svg
│   ├── calendar.svg
│   ├── check-circle.svg
│   ├── dollar-line.svg
│   ├── user-circle.svg
│   └── [and many more...]
│
├── layout/                           # Layout components
│   ├── AppHeader.tsx                 # Application header
│   ├── AppLayout.tsx                 # Main layout wrapper
│   ├── AppSidebar.tsx                # Sidebar navigation
│   ├── Backdrop.tsx                  # Modal backdrop
│   └── SidebarWidget.tsx             # Sidebar widget
│
├── lib/                              # Utility libraries
│   └── utils.ts                      # Utility functions
│
├── locales/                          # Internationalization
│   └── bangla.ts                     # Bangla translations
│
├── route/                            # Routing configuration
│   ├── protected.tsx                 # Protected route wrapper
│   └── public-route.tsx              # Public route wrapper
│
├── utlis/                            # Utility functions
│   ├── authUtils.ts                  # Authentication utilities
│   └── index.ts
│
├── App.tsx                           # Root App component
├── main.tsx                          # Application entry point
├── store.ts                          # Redux store configuration
├── index.css                         # Global styles
├── svg.d.ts                          # SVG type definitions
└── vite-env.d.ts                     # Vite environment types
```

---

## 📋 Configuration Files

```
Root/
├── .dockerignore                     # Docker ignore patterns
├── .env                              # Environment variables (development)
├── .env.production                   # Environment variables (production)
├── Dockerfile                        # Docker configuration
├── nginx.conf                        # Nginx web server configuration
├── eslint.config.js                  # ESLint configuration
├── postcss.config.js                 # PostCSS configuration
├── tsconfig.json                     # TypeScript base config
├── tsconfig.app.json                 # TypeScript app config
├── tsconfig.node.json                # TypeScript Node config
├── package.json                      # NPM dependencies and scripts
├── pnpm-lock.yaml                    # PNPM lock file
├── index.html                        # HTML entry template
├── README.md                         # Project documentation
├── LICENSE.md                        # License file
├── SOCIAL_MEDIA_POSTS.md             # Social media content
└── banner.png                        # Project banner
```

---

## 🛠️ Technology Stack

### **Core Technologies**
- **Frontend Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Package Manager:** PNPM
- **Language:** TypeScript 5+

### **State Management**
- Redux Toolkit
- RTK Query (API caching & data fetching)
- React Context (Theme, Sidebar)

### **Styling**
- Tailwind CSS 3+
- PostCSS
- CSS Modules

### **Forms & Validation**
- React Hook Form
- Zod (Schema validation)

### **UI Components**
- Custom component library
- Lucide React (Icons)
- Recharts (Data visualization)

### **Data & API**
- Axios (via RTK Query)
- REST API integration
- Real-time data updates

### **Document Generation**
- @react-pdf/renderer (PDF generation)
- Thermal receipt printing (58mm)
- Barcode & QR code generation

### **Utilities**
- date-fns (Date manipulation)
- clsx (Class name utilities)
- React Router v6 (Navigation)

### **Development Tools**
- ESLint (Code linting)
- TypeScript (Type checking)
- Vite HMR (Hot module replacement)

### **Deployment**
- Docker containerization
- Nginx web server
- Multi-stage builds

---

## 📊 Module Overview

### **Business Operations**
1. **Point of Sale (POS)** - Complete POS system with cash register
2. **Sales Management** - Sales orders, invoices, customer management
3. **Purchase Management** - Purchase orders, receiving, supplier management
4. **Inventory Management** - Multi-location stock tracking
5. **Production** - Manufacturing orders and bill of materials
6. **Quotations** - Quote generation and conversion to sales

### **Financial Management**
7. **Accounting** - Double-entry accounting system
8. **Payments** - Payment processing and tracking
9. **Expenses** - Expense management and categorization
10. **Cash Register** - Multi-register cash management

### **Human Resources**
11. **Employees** - Employee records and profiles
12. **Attendance** - Time tracking and attendance management
13. **Leave Management** - Leave requests and approvals
14. **Departments** - Department and designation management

### **Product & Inventory**
15. **Products** - Product catalog with variants
16. **Categories** - Product categorization
17. **Brands** - Brand management
18. **Warehouses** - Multi-location inventory

### **System Management**
19. **Users & Roles** - User management and RBAC
20. **Permissions** - Granular permission control
21. **Settings** - Business and system settings
22. **Backups** - Database backup management
23. **Reports** - Comprehensive reporting across modules

---

## 📈 Key Features

### POS Features
- Multi-register support
- Cash management with variance tracking
- Multiple payment methods (cash, bank, mobile)
- Thermal receipt printing (58mm)
- Barcode scanning
- Real-time inventory updates

### Inventory Features
- Batch tracking
- Serial number tracking
- Multi-location inventory
- Stock movements and adjustments
- Stock transfers between warehouses
- Low stock alerts

### Accounting Features
- Double-entry accounting
- Chart of accounts
- Journal entries
- Ledger reports
- Trial balance
- Profit & loss statements

### Reporting
- Sales reports
- Purchase reports
- Inventory reports
- Financial reports
- Employee reports
- Custom date range filtering

---

## 🔒 Security Features
- Role-based access control (RBAC)
- Permission-based UI rendering
- JWT authentication
- Protected routes
- Secure API communication

---

## 🌐 Deployment
- Docker containerization
- Nginx reverse proxy
- Environment-based configuration
- Production optimizations
- Multi-stage build process

---

**Total Files:** 500+ files
**Total Components:** 200+ React components
**Total API Endpoints:** 30+ feature modules
**Total Type Definitions:** 25+ type files
**Lines of Code:** ~50,000+ lines

---

*Last Updated: January 2026*
