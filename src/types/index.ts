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
  category_id?: number;
  logo_attachment: Attachment;
  logo_attachment_id?: number;
  created_at: string;
  updated_at: string;
}

export interface SubCategory extends Category {
  category_id: number;
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
  created_at: string;
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
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  payment_terms?: string;
  status: boolean;
  created_at: string;
  updated_at: string;
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
  id: number;
  po_no: string;
  supplier_id: number;
  supplier: Supplier;
  warehouse_id: number;
  warehouse: Warehouse;

  items: PurchaseItem[];

  total: string;
  paid_amount: string;
  due_amount: string;
  status: PurchaseStatus;
  created_at: string;
  updated_at: string;
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

export type Inventory = InventoryItem[];
export type PurchaseStatus = "draft" | "ordered" | "received" | "cancelled";
