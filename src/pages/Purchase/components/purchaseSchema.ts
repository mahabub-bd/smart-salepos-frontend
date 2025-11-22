import { z } from "zod";

export const purchaseItemSchema = z.object({
  product_id: z.coerce.number().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Minimum quantity is 1"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
});

export const purchaseSchema = z.object({
  po_no: z.string().min(1, "PO Number is required"),
  supplier_id: z.coerce.number().min(1, "Supplier is required"),
  warehouse_id: z.coerce.number().min(1, "Warehouse is required"),
  items: z.array(purchaseItemSchema).min(1, "At least 1 item is required"),
  status: z.enum(["ordered", "received"]).optional(),
});

export type PurchaseFormValues = z.infer<typeof purchaseSchema>;
