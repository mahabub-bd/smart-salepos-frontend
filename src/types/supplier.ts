import {BaseEntity,  } from ".";
import { Account } from "./accounts";
import { Product } from "./product";
import { Purchase } from "./purchase";

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