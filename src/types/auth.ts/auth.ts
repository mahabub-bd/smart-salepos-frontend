import { Role } from "../role";


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
