import { Branch, BranchBasic } from "./branch";
import { User, UserBasic } from "./user";

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

export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "half_day"
  | "leave";

export type PaymentMethod = "cash" | "bank";

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
