import { JSX } from "react/jsx-runtime";
import { Role } from "./role";

export interface Attachment {
  id: string | number;
  file_name: string;
  url: string;
  mime_type?: string;
  size?: string | number;
  storage_type?: string;
  uploaded_by?: string | number;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string | null;
  logo_attachment?: Attachment | null;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  roles: Role[];
  branches?: Branch[];
  status: string;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  avatar?: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface Unit {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUnitRequest {
  name: string;
  code: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateUnitRequest extends Partial<CreateUnitRequest> {
  id: number;
}

export interface Category {
  id: number;
  name: string;
  slug?: string | null;
  description?: string;
  status: boolean;
  category_id?: string;
  logo_attachment: Attachment;
  logo_attachment_id?: number;
  created_at: string;
  updated_at: string;
}

export interface SubCategory extends Category {
  category_id: string;
}

export interface CategoryWithChildren extends Category {
  children?: SubCategory[];
}
export interface Tag {
  id: number;
  name: string;
  slug?: string;
  description?: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface Warehouse {
  id: number;
  name: string;
  location?: string;
  address?: string;
  status?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  selling_price: string;
  purchase_price: string;
  discount_price?: string;
  status: boolean;
  brand?: Brand;
  category?: Category;

  subcategory?: SubCategory;
  unit?: Unit;
  supplier?: Supplier;
  tags?: Tag[];
  images?: Attachment[];
  purchase_value?: number;
  sale_value?: number;
  created_at: string;
  total_stock: number;
  total_sold: number;
  available_stock: number;
  updated_at: string;
}
export interface ProductRequest {
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  selling_price: number;
  purchase_price: number;
  discount_price?: number;
  status?: boolean;
  brand_id?: number;
  category_id?: number;
  subcategory_id?: number;
  unit_id?: number;
  supplier_id?: number;
  tag_ids?: number[];
  image_ids?: number[];
}

export interface Supplier {
  id: number;
  name: string;
  supplier_code: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  payment_terms?: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  totalPurchased: number;
  account: Account;
  purchase_history: Purchase;
  products: Product[];
}

export interface PurchaseProduct {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  description: string;
  selling_price: string;
  purchase_price: string;
  discount_price: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}
export interface PurchaseItem {
  id: number;
  purchase_id: number;
  product_id: number;
  quantity: number;
  price: string;
  product: PurchaseProduct | null;
}
export interface Purchase {
  map(arg0: (purchase: Purchase) => JSX.Element): import("react").ReactNode;
  id: number;
  po_no: string;
  supplier_id: number;
  supplier: Supplier;
  warehouse_id: number;
  warehouse: Warehouse;

  items: PurchaseItem[];
  payment_history: PaymentHistory[];

  total: string;
  paid_amount: string;
  due_amount: string;
  status: PurchaseStatus;
  created_at: string;
  updated_at: string;
}
export interface PaymentHistory {
  id: number;
  type: "supplier" | "customer";
  amount: number;
  method: "cash" | "bank" | "mobile";
  note?: string;
  supplier_id?: number;
  purchase_id?: number;
  created_at: string;
}

export interface InventoryItem {
  id: number;
  product: Product;
  product_id: number;
  warehouse: Warehouse;
  warehouse_id: number;
  batch_no: string;
  quantity: number;
  sold_quantity: number;
  expiry_date: string | null;
  purchase_price: string;
  supplier: string;
  purchase_item_id: number;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id?: number;
  account_number: string;
  code: string;
  name: string;
  type: "asset" | "liability" | "equity" | "income" | "expense";
  isCash: boolean;
  isBank: boolean;
  debit?: number;
  credit?: number;
  balance?: number;
}

export interface AccountType {
  id: number;
  account_number: string;
  code: string;
  name: string;
  type: "asset" | "liability" | "equity" | "income" | "expense";
}

export interface JournalEntryItem {
  account_code: string;
  account_name: string;
  debit: string;
  credit: string;
  narration: string;
}
export interface JournalEntry {
  transaction_id: number;
  reference_type: string;
  reference_id: number;
  date: string;
  entries: JournalEntryItem[];
}
export interface Branch {
  id: number;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  default_warehouse_id: number | null;
  created_at: string;
  default_warehouse: Warehouse;
  updated_at: string;
}

export interface Address {
  contact_name?: string;
  phone?: string;
  street?: string;
  city?: string;
  country?: string;
}

export interface Customer {
  id: number;
  name: string;
  customer_code: string;
  email: string;
  phone: string;

  billing_address?: Address;
  shipping_address?: Address;
  status: boolean;
  account: Account;
  account_id: number;
  group_id?: number;
  group?: CustomerGroup;
  reward_points?: number;
  sales: Sale[];
  created_at: string;
  updated_at: string;
}

// Pagination Meta (for when pagination is included)
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Paginated Response
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Response can be either paginated or simple array
export interface CustomerListResponse {
  data: Customer[];
  meta?: PaginationMeta; // Optional, in case API adds it later
}

// Expense Category Type
export interface ExpenseCategory {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: number;
  title: string;
  description: string;
  amount: string;
  category: ExpenseCategory;
  category_id: number;
  receipt_url: string | null;
  branch: Branch | null;
  branch_id?: number | null;
  payment_method?: string;
  account_code?: string;
  created_by: User;
  created_at: string;
  updated_at: string;
}

export interface CreateExpensePayload {
  title: string;
  description?: string;
  amount: number;
  category_id: number;
  receipt_url?: string;
  branch_id?: number;
  payment_method?: string;
  account_code?: string;
}
export interface SaleItem {
  id: number;
  quantity: number;
  warehouse_id: number;
  unit_price: string;
  discount: string;
  tax: string;
  line_total: string;
  product: Product;
}

export interface SalePayment {
  id: number;
  method: string;
  amount: string;
  account_code: string;
  created_at: string;
  reference?: string;
}

export interface Sale {
  id: number;
  invoice_no: string;
  items: SaleItem[];
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
  paid_amount: string;
  payments: SalePayment[];
  status:
    | "held"
    | "completed"
    | "refunded"
    | "partial_refund"
    | "draft"
    | "pending"
    | "cancelled";
  created_at: string;
  updated_at: string;
  sale_type: string;
  served_by: User;
  customer: Customer;
}
export interface CustomerGroup {
  id: number;
  name: string;
  description?: string;
  discount_percentage?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateExpensePayload extends Partial<CreateExpensePayload> {
  id: number;
}
export interface WarehouseInventory {
  warehouse: Warehouse;
  purchased_quantity: number;
  sold_quantity: number;
  remaining_quantity: number;
  batch_no: string;
  purchase_value: number;
  sale_value: number;
}

export interface ProductWiseInventoryItem {
  product_id: number;
  product: Product;
  total_stock: number;
  total_sold_quantity: number;
  remaining_stock: number;
  purchase_value: number;
  sale_value: number;
  warehouses: WarehouseInventory[];
}

export interface ProductBatchWise {
  id: number;
  product_id: number;
  product: Product;
  warehouse_id: number;
  warehouse: Warehouse;

  batch_no: string;
  quantity: number;
  sold_quantity: number;
  expiry_date: string | null;
  purchase_price: string;
  supplier: string;
  purchase_item_id: number;
  created_at: string;
  updated_at: string;
  remaining_quantity: number;
  purchase_value: number;
  sale_value: number;
  potential_profit: number;
}
// 📌 types.ts

export interface TransactionEntry {
  id: number;
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  narration: string;
}

export interface JournalTransaction {
  id: number;
  reference_type: string;
  reference_id: number;
  created_at: string;
  entries: TransactionEntry[];
}

export interface SaleDetail {
  sale_id: number;
  invoice_no: string;
  total: number;
  created_at: string;
  customer?: { id: number; name: string; phone: string };
  served_by?: { id: number; full_name: string };
  transactions: JournalTransaction[];
}

export interface SaleTransactionsResponse {
  statusCode: number;
  message: string;
  data: SaleDetail[];
}

export type Inventory = InventoryItem[];
export type PurchaseStatus = "draft" | "ordered" | "received" | "cancelled";
// Type definitions for settings
export interface SettingsData {
  id: number;
  business_name: string | null;
  tagline: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  country: string;
  website: string | null;
  currency: string;
  currency_symbol: string;
  tax_registration: string | null;
  company_registration: string | null;
  default_tax_percentage: string;
  low_stock_threshold: string;
  logo_attachment_id: number | null;
  logo_attachment?: Attachment;
  footer_text: string | null;
  receipt_header: string | null;
  include_barcode: boolean;
  include_customer_details: boolean;
  enable_auto_backup: boolean;
  backup_retention_days: number;
  default_invoice_layout: string;
  show_product_images: boolean;
  show_product_skus: boolean;
  show_item_tax_details: boolean;
  show_payment_breakdown: boolean;
  invoice_paper_size: string;
  print_duplicate_copy: boolean;
  invoice_footer_message: string | null;
  use_thermal_printer: boolean;
  created_at: string;
  updated_at: string;
}

export interface SettingsUpdateRequest {
  business_name?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  website?: string;
  currency?: string;
  currency_symbol?: string;
  tax_registration?: string;
  company_registration?: string;
  default_tax_percentage?: number;
  low_stock_threshold?: number;
  footer_text?: string;
  receipt_header?: string;
  include_barcode?: boolean;
  include_customer_details?: boolean;
  enable_auto_backup?: boolean;
  backup_retention_days?: number;
  default_invoice_layout?: string;
  show_product_images?: boolean;
  show_product_skus?: boolean;
  show_item_tax_details?: boolean;
  show_payment_breakdown?: boolean;
  invoice_paper_size?: string;
  print_duplicate_copy?: boolean;
  invoice_footer_message?: string;
  use_thermal_printer?: boolean;
}

export interface ReceiptPreviewData {
  business_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  currency: string;
  currency_symbol: string;
  tax_registration: string | null;
  company_registration: string | null;
  footer_text: string | null;
  receipt_header: string | null;
  include_barcode: boolean;
  include_customer_details: boolean;
  logo_url: string;
  default_invoice_layout: string;
  show_product_images: boolean;
  show_product_skus: boolean;
  show_item_tax_details: boolean;
  show_payment_breakdown: boolean;
  invoice_paper_size: string;
  print_duplicate_copy: boolean;
  invoice_footer_message: string | null;
  use_thermal_printer: boolean;
}
export interface DailySale {
  date: string;
  total: number;
  orders: number;
}

export interface Last30DaysAnalytics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  dailySales: DailySale[];
}

export interface MonthlySale {
  month: number; // 1, 2, 3, etc.
  monthName: string; // "January", "February", etc.
  total: number;
  orders: number;
}

export interface MonthWiseAnalytics {
  year: number;
  monthlySales: MonthlySale[];
  totalYearlySales: number;
  totalYearlyOrders: number;
}

export interface SaleItem {
  product: Product;
  quantity: number;
  unit_price: string;
  discount: string;
  tax: string;
  line_total: string;
}

export interface SaleCustomer {
  id: number;
  customer_code: string;
  name: string;
  phone: string;
  email: string;
  billing_address?: Address;
  shipping_address?: Address;
  status: boolean;
  reward_points: string;
  account_id: number;
  group_id: number;
  created_at: string;
  updated_at: string;
}

export interface SalePayment {
  method: string;
  amount: string;
  account_code: string;
  reference?: string;
  created_at: string;
}

export interface SaleBranch {
  id: number;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SaleUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  roles: Role[];

  status: string;
  last_login_at: string;
  created_at: string;
  updated_at: string;
}

export interface SaleData {
  invoice_no: string;
  items: SaleItem[];
  subtotal: string;
  discount: string;
  manual_discount: string;
  group_discount: string;
  tax: string;
  total: string;
  paid_amount: string;
  payments: SalePayment[];
  customer: SaleCustomer;
  created_by: SaleUser;
  branch: SaleBranch;
  served_by: SaleUser;
  created_at: string;
  updated_at: string;
}

// API Response Types for Sales
export interface SaleResponse {
  id: number;
  invoice_no: string;
  items: SaleItem[];
  subtotal: string;
  discount: string;
  manual_discount: string;
  group_discount: string;
  tax: string;
  total: string;
  paid_amount: string;
  payments: SalePayment[];
  customer: SaleCustomer;
  created_by: SaleUser;
  branch: SaleBranch;
  served_by: SaleUser;
  status: string;
  sale_type: string;
  created_at: string;
  updated_at: string;
}

export interface SaleListResponse {
  data: SaleResponse[];
  meta?: PaginationMeta;
}

export interface PurchaseReturnItemCreate {
  product_id: number;
  purchase_item_id: number;
  returned_quantity: number;
  price: number; // Create API expects number
  line_total?: string; // Optional for create payload
}

export interface PurchaseReturnItem {
  id: number;
  purchase_return_id: number;
  purchase_item_id: number;
  purchase_item?: PurchaseItem;
  product_id: number;
  product?: Product;
  returned_quantity: number;
  price: string;
  line_total: string;
}

export interface CreatePurchaseReturnPayload {
  purchase_id: number;
  supplier_id: number;
  warehouse_id: number;
  reason: string;
  items: PurchaseReturnItemCreate[];
}

export interface UpdatePurchaseReturnPayload {
  return_date?: string;
  items?: PurchaseReturnItemCreate[];
  reason?: string;
  note?: string;
}

export interface ApprovePurchaseReturnPayload {
  approval_notes?: string;
}

export interface ProcessPurchaseReturnPayload {
  processing_notes?: string;
  refund_to_supplier?: boolean;
  refund_amount?: number;
  refund_payment_method?: "cash" | "bank";
  refund_reference?: string;
  debit_account_code?: string;
  refund_later?: boolean;
}

export interface RefundPurchaseReturnPayload {
  refund_amount: number;
  payment_method: "cash" | "bank_transfer" | "check";
  refund_reference?: string;
  debit_account_code: string;
  refund_notes?: string;
}

export interface RefundHistory {
  id: number;
  type: string;
  amount: string;
  method: string;
  note?: string;
  purchase_return_id: number;
  debit_account_code: string;
  credit_account_code: string;
  created_at: string;
}

export interface PurchaseReturn {
  id: number;
  return_no: string;
  purchase_id: number;
  purchase?: Purchase;
  supplier_id: number;
  supplier?: Supplier;
  warehouse_id: number;
  warehouse?: Warehouse;
  items: PurchaseReturnItem[];
  total: string;
  reason: string;
  status: "draft" | "approved" | "processed" | "cancelled";
  approved_at?: string;
  approved_by?: number;
  approved_user?: User;
  processed_at?: string;
  processed_by?: number;
  processed_user?: User;
  approval_notes?: string;
  processing_notes?: string;
  created_at: string;
  updated_at: string;
  refund_to_supplier: boolean;
  refund_reference: string;
  refund_payment_method: "cash" | "bank";
  refunded_at: string;
  debit_account_code: string;
  refund_amount: string;
  refund_history?: RefundHistory[];
}

// HRM - Department Types
export interface Department {
  id: number;
  name: string;
  description?: string;
  status: EmployeeStatus;
  code: string;
  manager_name?: string;
  manager_email?: string;
  notes?: string;
  employees?: Employee[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateDepartmentPayload {
  name: string;
  description?: string;
  status?: "active" | "inactive";
  code: string;
  manager_name?: string;
  manager_email?: string;
  notes?: string;
}

export interface UpdateDepartmentPayload
  extends Partial<CreateDepartmentPayload> {
  id: number;
}

export interface DepartmentEmployeeCount {
  department_id?: number;
  department_name?: string;
  total_employees: number;
  active_employees: number;
  inactive_employees: number;
}

// HRM - Designation Types
export interface Designation {
  id: number;
  title: string;
  code: string;
  level:
    | "junior_officer"
    | "officer"
    | "senior_officer"
    | "manager"
    | "senior_manager"
    | "director"
    | string;
  description?: string;
  minSalary: string;
  maxSalary: string;
  autoApproveLeaveDays: number;
  canApproveLeave: boolean;
  canApprovePayroll: boolean;
  parentDesignation?: Designation | null;
  parentDesignationId?: number | null;
  childDesignations?: Designation[];
  employees?: Employee[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateDesignationPayload {
  title: string;
  code: string;
  level: string;
  description?: string;
  minSalary: number;
  maxSalary: number;
  autoApproveLeaveDays?: number;
  canApproveLeave?: boolean;
  canApprovePayroll?: boolean;
  parentDesignationId?: number | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateDesignationPayload
  extends Partial<CreateDesignationPayload> {
  id: number;
}

export interface DesignationHierarchy {
  id: number;
  title: string;
  code: string;
  level: string;
  children?: DesignationHierarchy[];
}

export interface AssignEmployeeToDesignationPayload {
  employee_id: number;
  designation_id: number;
}

// HRM - Employee Types
export interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  hire_date: string;
  termination_date?: string | null;
  status: EmployeeStatus;
  employee_type: EmployeeType;
  department?: Department;
  departmentId: number;
  base_salary: string;
  branch?: Branch;
  user: User;
  userId: number;
  designation?: Designation;
  designationId: number;
  reportingManagerId?: number | null;
  __reportingManager__?: Employee;
  __subordinates__?: Employee[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeePayload {
  employee_code?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  hire_date: string;
  status?: EmployeeStatus;
  employee_type?: EmployeeType;
  designationId: number;
  departmentId: number;
  base_salary: number;
  branch_id: number;
  userId?: number;
  notes?: string;
  reportingManagerId?: number;
}

export interface UpdateEmployeePayload extends Partial<CreateEmployeePayload> {
  id: number;
  termination_date?: string | null;
}

export enum EmployeeStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  TERMINATED = "terminated",
  ON_LEAVE = "on_leave",
}

export enum EmployeeType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  CONTRACT = "contract",
  INTERN = "intern",
}

export interface GetEmployeesParams {
  search?: string;
  status?: "active" | "inactive" | "terminated";
  department_id?: number;
  designation_id?: number;
  branch_id?: number;
  page?: number;
  limit?: number;
}

export interface GetAttendanceParams {
  start_date: string;
  end_date: string;
}

export interface PayrollHistory {
  id: number;
  employee_id: number;
  month: string;
  year: number;
  basic_salary: string;
  allowance: string;
  deduction: string;
  overtime: string;
  net_salary: string;
  pay_date: string | null;
  status: "pending" | "paid" | "failed";
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: number;
  employee_id?: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  break_start?: string | null;
  break_end?: string | null;
  regular_hours: string;
  overtime_hours: string;
  status: "present" | "absent" | "late" | "half_day" | "leave";
  notes?: string | null;
  employee?: Employee;
  branch?: Branch;
  created_at: string;
  updated_at?: string;
}

// Attendance API Payloads
export interface CheckInPayload {
  employee_id: number;
  branch_id: number;
  check_in_time: string;
}

export interface CheckOutPayload {
  employee_id: number;
  branch_id: number;
  check_out_time: string;
}

export interface BulkAttendanceRecord {
  employee_id: number;
  date: string;
  status: "present" | "absent" | "late" | "half_day" | "leave";
  check_in?: string;
  check_out?: string;
  regular_hours?: number;
  overtime_hours?: number;
  notes?: string;
}

export interface BulkAttendancePayload {
  attendance_records: BulkAttendanceRecord[];
  branch_id: number;
}

export interface UpdateAttendancePayload {
  id: number;
  date?: string;
  check_in?: string;
  check_out?: string;
  break_start?: string;
  break_end?: string;
  status?: "present" | "absent" | "late" | "half_day" | "leave";
  regular_hours?: string;
  overtime_hours?: string;
  notes?: string;
}

export interface GetAttendanceListParams {
  employee_id?: number;
  branch_id?: number;
  start_date?: string;
  end_date?: string;
  status?: "present" | "absent" | "late" | "half_day" | "leave";
  page?: number;
  limit?: number;
}

export interface AttendanceSummaryParams {
  start_date: string;
  end_date: string;
  branch_id?: number;
  department?: number;
}

export interface OvertimeReportParams {
  start_date: string;
  end_date: string;
  branch_id?: number;
}

export interface AttendanceSummary {
  total_records: number;
  total_employees: number;
  status_breakdown: {
    present: number;
    absent: number;
    late: number;
    half_day: number;
    on_leave: number;
  };
  total_regular_hours: string;
  total_overtime_hours: string;
}

export interface OvertimeReport {
  total_overtime_hours: number;
  total_employees_with_overtime: number;
  employee_breakdown: Array<{
    employee_id: number;
    employee_name: string;
    total_overtime_hours: string;
    days_with_overtime: number;
    average_overtime_per_day: string;
    total_regular_hours: string;
  }>;
}

// HRM - Leave Request Types
export enum LeaveStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export enum LeaveType {
  ANNUAL = "annual",
  SICK = "sick",
  MATERNITY = "maternity",
  PATERNITY = "paternity",
  UNPAID = "unpaid",
  COMPASSIONATE = "compassionate",
}

export interface LeaveRequest {
  id: number;
  start_date: string;
  end_date: string;
  days_count: string;
  leave_type: LeaveType;
  status: LeaveStatus;
  reason: string;
  rejection_reason?: string | null;
  approved_date?: string | null;
  approver_notes?: string | null;
  employee?: {
    id: number;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    date_of_birth: string;
    hire_date: string;
    termination_date?: string | null;
    status: string;
    employee_type: string;
    department?: {
      id: number;
      name: string;
      description: string;
      status: string;
      code: string;
      manager_name: string;
      manager_email: string;
      notes: string;
      created_at: string;
      updated_at: string;
      deleted_at?: string | null;
    };
    departmentId: number;
    base_salary: string;
    user?: {
      id: number;
      username: string;
      email: string;
      full_name: string;
      phone: string;
      status: string;
      last_login_at?: string;
      created_at: string;
      updated_at?: string;
    };
    userId: number;
    designation?: {
      id: number;
      title: string;
      code: string;
      level: string;
      description: string;
      minSalary: string;
      maxSalary: string;
      autoApproveLeaveDays: number;
      canApproveLeave: boolean;
      canApprovePayroll: boolean;
      parentDesignationId?: number;
      isActive: boolean;
      sortOrder: number;
      createdAt: string;
      updatedAt: string;
      deletedAt?: string | null;
    };
    designationId: number;
    reportingManagerId?: number;
    notes?: string;
    created_at: string;
    updated_at?: string;
  };
  branch?: {
    id: number;
    code: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  currentApproverId?: number | null;
  currentApprovalLevel?: number | null;
  totalApprovalLevels?: number | null;
  completedApprovalLevels: number;
  isFullyApproved: boolean;
  requiresMultiLevelApproval: boolean;
  created_at: string;
  updated_at?: string;
  leave_balance?: {
    employee_id: number;
    year: number;
    entitlements: {
      annual: string;
      sick: string;
      maternity: string;
      paternity: string;
      unpaid: string;
      compassionate: string;
      study: string;
    };
    used: {
      annual: string;
      sick: string;
      maternity: string;
      paternity: string;
      unpaid: string;
      compassionate: string;
      study: string;
    };
    available: {
      annual: string;
      sick: string;
      maternity: string;
      paternity: string;
      unpaid: string;
      compassionate: string;
      study: string;
    };
  };
}

export interface CreateLeaveRequestPayload {
  start_date: string;
  end_date: string;
  leave_type: LeaveType;
  reason: string;
  employee_id: number;
  branch_id: number;
}

export interface UpdateLeaveRequestPayload {
  start_date?: string;
  end_date?: string;
  leave_type?: LeaveType;
  reason?: string;
  employee_id?: number;
  branch_id?: number;
}

export interface GetLeaveRequestsParams {
  employee_id?: number;
  status?: LeaveStatus;
  leave_type?: LeaveType;
  start_date?: string;
  end_date?: string;
  branch_id?: number;
  page?: number;
  limit?: number;
}

export interface LeaveBalance {
  employee_id: number;
  annual_leave: {
    total: number;
    used: number;
    remaining: number;
  };
  sick_leave: {
    total: number;
    used: number;
    remaining: number;
  };
  maternity_leave: {
    total: number;
    used: number;
    remaining: number;
  };
  paternity_leave: {
    total: number;
    used: number;
    remaining: number;
  };
  unpaid_leave: {
    taken: number;
  };
  compassionate_leave: {
    taken: number;
  };
}

export interface LeaveSummary {
  total_requests: number;
  pending_requests: number;
  approved_requests: number;
  rejected_requests: number;
  cancelled_requests: number;
  status_breakdown: {
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
  };
  type_breakdown: {
    annual: number;
    sick: number;
    maternity: number;
    paternity: number;
    unpaid: number;
    compassionate: number;
    study: number;
  };
  total_days_taken: number;
  employees_on_leave: number;
  year: number;
  monthly_breakdown: Array<{
    month: string;
    year: number;
    total_requests: number;
    approved_requests: number;
    rejected_requests: number;
  }>;
}

// HRM - Leave Approval Types
export interface LeaveApproval {
  id: number;
  leave_request_id: number;
  approver_id: number;
  action: "approve" | "reject";
  approver_notes?: string;
  rejection_reason?: string;
  created_at: string;
  approver?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface ApproveLeaveRequestPayload {
  approverNotes?: string;
}

export interface RejectLeaveRequestPayload {
  rejectionReason: string;
}

export interface LeaveApprovalHistory {
  leave_request_id: number;
  approvals: LeaveApproval[];
  current_step: number;
  total_steps: number;
  status: LeaveStatus;
}

export interface PendingLeaveApprovals {
  pending_requests: Array<{
    id: number;
    employee: {
      id: number;
      first_name: string;
      last_name: string;
      employee_code: string;
    };
    leave_type: LeaveType;
    start_date: string;
    end_date: string;
    days_count: number;
    reason: string;
    requested_at: string;
    workflow_current_step: number;
    workflow_total_steps: number;
  }>;
  total_count: number;
}

export interface LeaveApprovalDashboardStats {
  pending_approvals: number;
  approvals_today: number;
  rejections_today: number;
  average_response_time: number; // in hours
  pending_urgent: number; // requests starting within 24 hours
  monthly_approvals: Array<{
    month: string;
    year: number;
    approved: number;
    rejected: number;
    total: number;
  }>;
}

// Cash Register Types
export type CashRegisterStatus =
  | "active"
  | "inactive"
  | "closed"
  | "open"
  | "maintenance";

// FIXED
export interface CashRegister {
  id: number;
  register_code?: string;
  name: string;
  description?: string;
  status: CashRegisterStatus;
  branch_id?: number;
  branch?: Branch;

  opening_balance: string;
  current_balance: string;
  expected_amount?: string | null;
  actual_amount?: string | null;
  variance?: string | null;

  opened_by?: User | null;
  closed_by?: User | null;

  opened_at?: string | null;
  closed_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CashRegisterTransaction {
  id: number;
  cash_register: CashRegister;
  transaction_type:
    | "sale"
    | "cash_in"
    | "cash_out"
    | "opening_balance"
    | "closing_balance"
    | "adjustment";
  amount: string;
  payment_method: "cash" | "card" | "mobile" | "other";
  sale?: {
    id: number;
    invoice_no: string;
  } | null;
  user: User;
  description?: string;
  running_balance: string;
  reference_no?: string | null;
  created_at: string;
}

export interface CreateCashRegisterPayload {
  code: string;
  name: string;
  description?: string;
  branch_id: number;
  status?: "active" | "inactive";
}

export interface OpenCashRegisterPayload {
  cash_register_id: number;
  opening_balance: number;
  notes?: string;
}

export interface CloseCashRegisterPayload {
  cash_register_id: number;
  actual_amount: number;
  notes?: string;
}

export interface CashInPayload {
  amount: number;
  description?: string;
  payment_method?: "cash" | "card" | "mobile" | "other";
  notes?: string;
}

export interface CashOutPayload {
  amount: number;
  description?: string;
  payment_method?: "cash" | "card" | "mobile" | "other";
  notes?: string;
}

export interface AdjustBalancePayload {
  amount: number;
  description: string;
  adjustment_type: "increase" | "decrease";
  notes?: string;
}

export interface VarianceReport {
  cash_register_id: number;
  cash_register: CashRegister;
  opening_balance: number;
  total_sales: number;
  total_cash_in: number;
  total_cash_out: number;
  expected_balance: number;
  counted_balance: number;
  variance: number | null;
  variance_percentage: number;
  cash_in: {
    sales: number;
    cash_in: number;
    adjustments: number;
  };
  cash_out: {
    refunds: number;
    cash_out: number;
    adjustments: number;
  };
  transactions_summary: {
    sales_count: number;
    cash_in_count: number;
    cash_out_count: number;
    total_transactions: number;
  };
  payment_breakdown: {
    cash: number;
    card: number;
    mobile: number;
    other: number;
  };
  opened_at: string;
  closed_at: string;
  duration_minutes: number;
  notes?: string;
}

export interface GetCashRegistersParams {
  branch_id?: number;
  status?: CashRegisterStatus;
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetTransactionsParams {
  cash_register_id?: number;
  transaction_type?:
    | "sale"
    | "cash_in"
    | "cash_out"
    | "opening_balance"
    | "closing_balance"
    | "adjustment";
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}
