import { Product, ProductBasic } from "./product";
import { Role } from "./role";
import { Sale } from "./sales";

// ============================================================================
// BASE TYPES & UTILITIES
// ============================================================================

export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface BaseEntityOptionalUpdate {
  id: number;
  created_at: string;
  updated_at?: string;
}

export interface BaseEntityWithStatus extends BaseEntity {
  status: boolean;
}

export interface BaseEntityWithCode {
  code: string;
  name: string;
}

export interface TimestampFields {
  created_at: string;
  updated_at: string;
}

export interface SoftDeletable {
  deleted_at?: string | null;
}

// ============================================================================
// COMMON TYPES
// ============================================================================

export type PaymentMethod = "cash" | "bank" | "mobile" | "other";
export type RefundPaymentMethod = "cash" | "bank_transfer" | "check";
export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "half_day"
  | "leave";
export type AccountTypeEnum =
  | "asset"
  | "liability"
  | "equity"
  | "income"
  | "expense";

export type PurchaseStatus = "draft" | "ordered" | "received" | "cancelled";
export type PurchaseReturnStatus =
  | "draft"
  | "approved"
  | "processed"
  | "cancelled";

export enum PurchaseOrderStatus {
  DRAFT = "draft",
  SENT = "sent",
  APPROVED = "approved",
  REJECTED = "rejected",
  PARTIAL_RECEIVED = "partial_received",
  FULLY_RECEIVED = "fully_received",
  CANCELLED = "cancelled",
  CLOSED = "closed",
}

export const PurchaseOrderStatusDescription = {
  [PurchaseOrderStatus.DRAFT]: {
    description: "Draft - Purchase Order is being prepared",
    color: "#gray",
    allowedTransitions: [
      PurchaseOrderStatus.SENT,
      PurchaseOrderStatus.CANCELLED,
    ],
  },
  [PurchaseOrderStatus.SENT]: {
    description: "Sent - Purchase Order sent to supplier",
    color: "#blue",
    allowedTransitions: [
      PurchaseOrderStatus.APPROVED,
      PurchaseOrderStatus.REJECTED,
      PurchaseOrderStatus.CANCELLED,
    ],
  },
  [PurchaseOrderStatus.APPROVED]: {
    description: "Approved - Purchase Order approved by supplier",
    color: "#green",
    allowedTransitions: [
      PurchaseOrderStatus.PARTIAL_RECEIVED,
      PurchaseOrderStatus.FULLY_RECEIVED,
      PurchaseOrderStatus.CANCELLED,
    ],
  },
  [PurchaseOrderStatus.REJECTED]: {
    description: "Rejected - Purchase Order rejected by supplier",
    color: "#red",
    allowedTransitions: [
      PurchaseOrderStatus.DRAFT,
      PurchaseOrderStatus.CANCELLED,
    ],
  },
  [PurchaseOrderStatus.PARTIAL_RECEIVED]: {
    description: "Partial Received - Some items have been received",
    color: "#orange",
    allowedTransitions: [
      PurchaseOrderStatus.FULLY_RECEIVED,
      PurchaseOrderStatus.CLOSED,
    ],
  },
  [PurchaseOrderStatus.FULLY_RECEIVED]: {
    description: "Fully Received - All items have been received",
    color: "#green",
    allowedTransitions: [PurchaseOrderStatus.CLOSED],
  },
  [PurchaseOrderStatus.CANCELLED]: {
    description: "Cancelled - Purchase Order has been cancelled",
    color: "#red",
    allowedTransitions: [], // Final state
  },
  [PurchaseOrderStatus.CLOSED]: {
    description: "Closed - Purchase Order completed and closed",
    color: "#purple",
    allowedTransitions: [], // Final state
  },
};

export const isPurchaseOrderStatusTransitionValid = (
  fromStatus: PurchaseOrderStatus,
  toStatus: PurchaseOrderStatus
): boolean => {
  if (fromStatus === toStatus) return false;

  const transitionRules: Record<PurchaseOrderStatus, PurchaseOrderStatus[]> = {
    [PurchaseOrderStatus.DRAFT]: [
      PurchaseOrderStatus.SENT,
      PurchaseOrderStatus.CANCELLED,
    ],
    [PurchaseOrderStatus.SENT]: [
      PurchaseOrderStatus.APPROVED,
      PurchaseOrderStatus.REJECTED,
      PurchaseOrderStatus.CANCELLED,
    ],
    [PurchaseOrderStatus.APPROVED]: [
      PurchaseOrderStatus.PARTIAL_RECEIVED,
      PurchaseOrderStatus.FULLY_RECEIVED,
      PurchaseOrderStatus.CANCELLED,
    ],
    [PurchaseOrderStatus.REJECTED]: [
      PurchaseOrderStatus.DRAFT,
      PurchaseOrderStatus.CANCELLED,
    ],
    [PurchaseOrderStatus.PARTIAL_RECEIVED]: [
      PurchaseOrderStatus.FULLY_RECEIVED,
      PurchaseOrderStatus.CLOSED,
    ],
    [PurchaseOrderStatus.FULLY_RECEIVED]: [PurchaseOrderStatus.CLOSED],
    [PurchaseOrderStatus.CANCELLED]: [],
    [PurchaseOrderStatus.CLOSED]: [],
  };

  return transitionRules[fromStatus].includes(toStatus);
};

export enum PaymentTerm {
  IMMEDIATE = "immediate",
  NET_7 = "net_7",
  NET_15 = "net_15",
  NET_30 = "net_30",
  NET_45 = "net_45",
  NET_60 = "net_60",
  NET_90 = "net_90",
  CUSTOM = "custom",
}

export const PaymentTermDescription = {
  [PaymentTerm.IMMEDIATE]: "Payment Due Immediately",
  [PaymentTerm.NET_7]: "Payment Due in 7 Days",
  [PaymentTerm.NET_15]: "Payment Due in 15 Days",
  [PaymentTerm.NET_30]: "Payment Due in 30 Days",
  [PaymentTerm.NET_45]: "Payment Due in 45 Days",
  [PaymentTerm.NET_60]: "Payment Due in 60 Days",
  [PaymentTerm.NET_90]: "Payment Due in 90 Days",
  [PaymentTerm.CUSTOM]: "Custom Payment Terms",
};
export type PayrollStatus = "pending" | "paid" | "failed";

export type TransactionType =
  | "sale"
  | "cash_in"
  | "cash_out"
  | "opening_balance"
  | "closing_balance"
  | "adjustment";

// ============================================================================
// PAGINATION & API RESPONSE TYPES
// ============================================================================

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface DateRangeParams {
  start_date: string;
  end_date: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListResponse<T> {
  data: T[];
  meta?: PaginationMeta;
}

// ============================================================================
// UTILITY PAYLOAD TYPES
// ============================================================================

export type CreatePayload<T> = Omit<T, "id" | "created_at" | "updated_at">;
export type UpdatePayload<T> = Partial<CreatePayload<T>> & { id: number };

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Attachment extends TimestampFields {
  id: string | number;
  file_name: string;
  url: string;
  mime_type?: string;
  size?: string | number;
  storage_type?: string;
  uploaded_by?: string | number;
}

export interface Brand {
  id: string;
  name: string;
  description?: string | null;
  logo_attachment?: Attachment | null;
  created_at?: string;
  updated_at?: string;
}

export interface Address {
  contact_name?: string;
  phone?: string;
  street?: string;
  city?: string;
  country?: string;
}

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

export interface User extends BaseEntity {
  username: string;
  email: string;
  full_name: string;
  phone: string;
  roles: Role[];
  branches?: Branch[];
  status: string;
  last_login_at: string | null;
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

// Simplified user types used in nested objects
export interface UserBasic {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  status: string;
  last_login_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface UserWithRoles extends UserBasic {
  roles: Role[];
}

// ============================================================================
// BRANCH & WAREHOUSE
// ============================================================================

export interface Warehouse extends BaseEntity {
  name: string;
  location?: string;
  address?: string;
  status?: boolean;
}

export interface Branch extends BaseEntity {
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  default_warehouse_id: number | null;
  default_warehouse: Warehouse;
}

// Simplified branch type used in nested objects
export interface BranchBasic {
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

// ============================================================================
// ACCOUNTING
// ============================================================================

export interface Account {
  id?: number;
  account_number: string;
  code: string;
  name: string;
  type: AccountTypeEnum;
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
  type: AccountTypeEnum;
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

export interface TransactionEntry {
  id: number;
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  narration: string;
}

export interface JournalTransaction extends BaseEntity {
  reference_type: string;
  reference_id: number;
  entries: TransactionEntry[];
}

// ============================================================================
// SUPPLIER & CUSTOMER
// ============================================================================

export interface Supplier extends BaseEntity {
  name: string;
  supplier_code: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  payment_terms?: string;
  status: boolean;
  totalPurchased: number;
  account: Account;
  purchase_history: Purchase[];
  products: Product[];
}

export interface Customer extends BaseEntity {
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
}

export interface CustomerBasic {
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

export interface CustomerGroup {
  id: number;
  name: string;
  description?: string;
  discount_percentage?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type CustomerListResponse = ListResponse<Customer>;

// ============================================================================
// PURCHASE MANAGEMENT
// ============================================================================

export interface PurchaseItem {
  id: number;
  purchase_id: number;
  product_id: number;
  quantity: number;
  quantity_received?: number;
  unit_price: string;
  price: string;
  discount_per_unit?: string;
  tax_rate?: string;
  total_price?: string;
  product: ProductBasic | null;
}

export interface PaymentHistory extends BaseEntity {
  type: "supplier" | "customer";
  amount: number;
  method: PaymentMethod;
  note?: string;
  supplier_id?: number;
  purchase_id?: number;
}

export interface PurchaseMetadata {
  status_changed_at?: string;
  status_change_reason?: string;
}

export interface Purchase extends BaseEntity {
  po_no: string;
  supplier_id: number;
  supplier: Supplier;
  warehouse_id: number;
  warehouse: Warehouse;
  created_by?: UserBasic;
  created_by_id?: number;
  expected_delivery_date?: string | null;
  terms_and_conditions?: string | null;
  notes?: string | null;
  payment_term?: string;
  custom_payment_days?: number;
  status: PurchaseStatus | PurchaseOrderStatus;
  subtotal?: string;
  tax_amount?: string;
  discount_amount?: string;
  total_amount?: string;
  total: string;
  paid_amount: string;
  due_amount: string;
  sent_date?: string | null;
  approved_date?: string | null;
  received_date?: string | null;
  items: PurchaseItem[];
  payment_history: PaymentHistory[];
  metadata?: PurchaseMetadata;
  is_active?: boolean;
}

export interface PurchaseResponseData {
  purchases: Purchase[];
  total: number;
}

// Purchase API Payloads
export interface PurchaseItemPayload {
  product_id: number;
  quantity: number;
  unit_price: number;
  price?: number;
  discount_per_unit?: number;
  tax_rate?: number;
}

export interface CreatePurchasePayload {
  po_no?: string;
  supplier_id: number;
  warehouse_id: number;
  items: PurchaseItemPayload[];
  total?: number;
  status?: PurchaseStatus;
}

export interface UpdatePurchasePayload {
  id: string | number;
  body: {
    po_no?: string;
    supplier_id?: number;
    warehouse_id?: number;
    total?: number;
    status?: PurchaseStatus;
    items?: PurchaseItemPayload[];
  };
}

export interface UpdatePurchaseStatusPayload {
  id: string | number;
  body: {
    status: PurchaseOrderStatus;
    reason?: string;
  };
}

export interface ReceivePurchaseItemPayload {
  item_id: number;
  quantity: number;
  warehouse_id: number;
}

export interface ReceivePurchasePayload {
  id: string | number;
  body: {
    notes?: string;
    items: ReceivePurchaseItemPayload[];
  };
}

export interface PurchasePaymentPayload {
  id: string | number;
  body: {
    type: "supplier";
    supplier_id: number;
    purchase_id: number;
    payment_amount: number;
    method: PaymentMethod | string;
    note?: string;
  };
}

// ============================================================================
// PURCHASE RETURNS
// ============================================================================

export interface PurchaseReturnItemCreate {
  product_id: number;
  purchase_item_id: number;
  returned_quantity: number;
  price: number;
  line_total?: string;
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
  payment_method: RefundPaymentMethod;
  refund_reference?: string;
  debit_account_code: string;
  refund_notes?: string;
}

export interface RefundHistory extends BaseEntity {
  type: string;
  amount: string;
  method: string;
  note?: string;
  purchase_return_id: number;
  debit_account_code: string;
  credit_account_code: string;
}

export interface PurchaseReturn extends BaseEntity {
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
  status: PurchaseReturnStatus;
  approved_at?: string;
  approved_by?: number;
  approved_user?: User;
  processed_at?: string;
  processed_by?: number;
  processed_user?: User;
  approval_notes?: string;
  processing_notes?: string;
  refund_to_supplier: boolean;
  refund_reference: string;
  refund_payment_method: "cash" | "bank";
  refunded_at: string;
  debit_account_code: string;
  refund_amount: string;
  refund_history?: RefundHistory[];
}

// ============================================================================
// INVENTORY
// ============================================================================

export interface InventoryItem extends BaseEntity {
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
}

export interface WarehouseInventory {
  id: number;
  warehouse_id: number;
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

export interface ProductBatchWise extends BaseEntity {
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
  remaining_quantity: number;
  purchase_value: number;
  sale_value: number;
  potential_profit: number;
}

export type Inventory = InventoryItem[];

// ============================================================================
// INVENTORY MOVEMENTS & JOURNAL
// ============================================================================

export type StockMovementType = "IN" | "OUT" | "ADJUST" | "TRANSFER";

export interface StockMovement extends BaseEntity {
  product_id: number;
  product: Product;
  warehouse_id: number;
  warehouse: Warehouse;
  type: StockMovementType;
  quantity: number;
  note?: string;
  from_warehouse_id?: number;
  from_warehouse?: Warehouse;
  to_warehouse_id?: number;
  to_warehouse?: Warehouse;
  reference_type?: string;
  reference_id?: number;
  created_by?: UserBasic;
}

export interface ProductInventory extends BaseEntity {
  product_id: number;
  warehouse_id: number;
  warehouse?: Warehouse;
  batch_no: string;
  quantity: number;
  sold_quantity: number;
  expiry_date?: string | null;
  purchase_price: string;
  supplier?: string;
  purchase_item_id?: number;
}

export interface VariationTemplate {
  id: number;
  name: string;
  values: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_by_id?: number;
  created_at: string;
  updated_at: string;
}

export interface StockByWarehouse {
  warehouse: Warehouse;
  batch_no: string;
  quantity: number;
  sold_quantity: number;
  available_quantity: number;
  purchase_price: string;
  expiry_date?: string | null;
}

export interface GetStockMovementsParams {
  product_id?: number;
  warehouse_id?: number;
  type?: StockMovementType;
}

export interface InventoryJournalEntry {
  id: number;
  date: string;
  product: {
    id: number;
    name: string;
    sku: string;
    image?: string;
  };
  warehouse: {
    id: number;
    name: string;
  };
  type: StockMovementType;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
  created_by?: {
    id: number;
    name: string;
  };
}

export interface GetInventoryJournalParams {
  product_id?: number;
  warehouse_id?: number;
  start_date?: string;
  end_date?: string;
}

// ============================================================================
// SALES
// ============================================================================



// ============================================================================
// ANALYTICS
// ============================================================================

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
  month: number;
  monthName: string;
  total: number;
  orders: number;
}

export interface MonthWiseAnalytics {
  year: number;
  monthlySales: MonthlySale[];
  totalYearlySales: number;
  totalYearlyOrders: number;
}

// ============================================================================
// HRM - DEPARTMENT
// ============================================================================

export interface Department extends BaseEntity, SoftDeletable {
  name: string;
  description?: string;
  status: EmployeeStatus;
  code: string;
  manager_name?: string;
  manager_email?: string;
  notes?: string;
  employees?: Employee[];
}

export interface DepartmentBasic extends SoftDeletable {
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

// ============================================================================
// HRM - DESIGNATION
// ============================================================================

export type DesignationLevel =
  | "junior_officer"
  | "officer"
  | "senior_officer"
  | "manager"
  | "senior_manager"
  | "director"
  | string;

export interface Designation extends SoftDeletable {
  id: number;
  title: string;
  code: string;
  level: DesignationLevel;
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
}

export interface DesignationBasic extends SoftDeletable {
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

// ============================================================================
// HRM - EMPLOYEE
// ============================================================================

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

export interface Employee extends BaseEntity {
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
}

export interface EmployeeBasic {
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
  department?: DepartmentBasic;
  departmentId: number;
  base_salary: string;
  user?: UserBasic;
  userId: number;
  designation?: DesignationBasic;
  designationId: number;
  reportingManagerId?: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
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

export interface GetEmployeesParams extends PaginationParams {
  search?: string;
  status?: "active" | "inactive" | "terminated";
  department_id?: number;
  designation_id?: number;
  branch_id?: number;
}

// ============================================================================
// HRM - ATTENDANCE
// ============================================================================

export interface AttendanceRecord extends BaseEntityOptionalUpdate {
  employee_id?: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  break_start?: string | null;
  break_end?: string | null;
  regular_hours: string;
  overtime_hours: string;
  status: AttendanceStatus;
  notes?: string | null;
  employee?: Employee;
  branch?: Branch;
}

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
  status: AttendanceStatus;
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
  status?: AttendanceStatus;
  regular_hours?: string;
  overtime_hours?: string;
  notes?: string;
}

export interface GetAttendanceParams extends DateRangeParams {}

export interface GetAttendanceListParams extends PaginationParams {
  employee_id?: number;
  branch_id?: number;
  start_date?: string;
  end_date?: string;
  status?: AttendanceStatus;
}

export interface AttendanceSummaryParams extends DateRangeParams {
  branch_id?: number;
  department?: number;
}

export interface OvertimeReportParams extends DateRangeParams {
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

// ============================================================================
// HRM - PAYROLL
// ============================================================================

export interface PayrollHistory extends BaseEntity {
  employee_id: number;
  month: string;
  year: number;
  basic_salary: string;
  allowance: string;
  deduction: string;
  overtime: string;
  net_salary: string;
  pay_date: string | null;
  status: PayrollStatus;
  updated_at: string;
}

// ============================================================================
// HRM - LEAVE MANAGEMENT
// ============================================================================

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

export interface LeaveBalanceDetails {
  annual: string;
  sick: string;
  maternity: string;
  paternity: string;
  unpaid: string;
  compassionate: string;
  study: string;
}

export interface LeaveRequest extends BaseEntityOptionalUpdate {
  start_date: string;
  end_date: string;
  days_count: string;
  leave_type: LeaveType;
  status: LeaveStatus;
  reason: string;
  rejection_reason?: string | null;
  approved_date?: string | null;
  approver_notes?: string | null;
  employee?: EmployeeBasic;
  branch?: BranchBasic;
  currentApproverId?: number | null;
  currentApprovalLevel?: number | null;
  totalApprovalLevels?: number | null;
  completedApprovalLevels: number;
  isFullyApproved: boolean;
  requiresMultiLevelApproval: boolean;
  leave_balance?: {
    employee_id: number;
    year: number;
    entitlements: LeaveBalanceDetails;
    used: LeaveBalanceDetails;
    available: LeaveBalanceDetails;
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

export interface GetLeaveRequestsParams extends PaginationParams {
  employee_id?: number;
  status?: LeaveStatus;
  leave_type?: LeaveType;
  start_date?: string;
  end_date?: string;
  branch_id?: number;
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

// ============================================================================
// HRM - LEAVE APPROVAL
// ============================================================================

export interface LeaveApproval extends BaseEntity {
  leave_request_id: number;
  approver_id: number;
  action: "approve" | "reject";
  approver_notes?: string;
  rejection_reason?: string;
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
  average_response_time: number;
  pending_urgent: number;
  monthly_approvals: Array<{
    month: string;
    year: number;
    approved: number;
    rejected: number;
    total: number;
  }>;
}

// ============================================================================
// PAYMENT
// ============================================================================

export interface Payment extends BaseEntity {
  type: "supplier" | "customer";
  supplier?: {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  customer?: {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  purchase?: {
    id: number;
    po_no: string;
    total?: number;
  };
  sale?: {
    id: number;
    invoice_no: string;
    total?: number;
  };
  amount: number;
  method: "cash" | "bank" | "mobile";
  payment_account_code?: string;
  note?: string;
}

export interface GetPaymentsParams {
  page?: number;
  limit?: number;
  type?: "supplier" | "customer";
  method?: "cash" | "bank" | "mobile";
}

export interface GetPaymentsResponse {
  message: string;
  data: Payment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============================================================================
// CASH REGISTER
// ============================================================================
