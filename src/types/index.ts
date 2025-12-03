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
export interface Customer {
  id: number;
  name: string;
  customer_code: string;
  email: string;
  phone: string;
  address: string;
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
