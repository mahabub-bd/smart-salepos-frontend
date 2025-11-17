export interface Permission {
  id: number;
  key: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: Permission[];
}
