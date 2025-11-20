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
  id: number | string;
  name: string;
  slug: string;
  description?: string | null;

  parent_category_id: number | string | null;
  parent: Category | null;

  children: Category[];

  logo_attachment?: Attachment | null;
  logo_attachment_id?: string | number | null;

  status: boolean;

  created_at: string;
  updated_at: string;
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
  unit?: Unit;
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
  unit_id?: number;
  tag_ids?: number[];
  image_ids?: number[];
}