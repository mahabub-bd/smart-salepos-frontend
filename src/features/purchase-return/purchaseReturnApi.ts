import { ApiResponse } from "../../types";
import { apiSlice } from "../apiSlice";

export interface PurchaseReturnItem {
  id?: number; // Optional for create payload
  purchase_return_id?: number; // Optional for create payload
  purchase_item_id: number;
  purchase_item?: any;
  product_id: number;
  product?: {
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
  };
  returned_quantity: number;
  price: number; // Backend expects a number
  line_total?: string; // Optional for create payload
}

export interface CreatePurchaseReturnPayload {
  purchase_id: number;
  supplier_id: number;
  warehouse_id: number;
  reason: string;
  items: PurchaseReturnItem[];
}

export interface UpdatePurchaseReturnPayload {
  return_date?: string;
  items?: PurchaseReturnItem[];
  reason?: string;
  note?: string;
}

export interface ApprovePurchaseReturnPayload {
  approval_notes?: string;
}

export interface ProcessPurchaseReturnPayload {
  processing_notes?: string;
}

export interface PurchaseReturn {
  id: number;
  return_no: string;
  purchase_id: number;
  purchase?: {
    id: number;
    po_no: string;
    supplier_id: number;
    warehouse_id: number;
    items: Array<{
      id: number;
      purchase_id: number;
      product_id: number;
      quantity: number;
      price: string;
    }>;
    total: string;
    status: string;
    paid_amount: string;
    due_amount: string;
    created_at: string;
    updated_at: string;
  };
  supplier_id: number;
  supplier?: {
    id: number;
    name: string;
    supplier_code: string;
    contact_person: string;
    phone: string;
    email: string;
    address: string;
    payment_terms: string;
    status: boolean;
  };
  warehouse_id: number;
  warehouse?: {
    id: number;
    name: string;
    location: string;
    address: string;
    status: boolean;
  };
  items: PurchaseReturnItem[];
  total: string;
  reason: string;
  status: 'draft' | 'approved' | 'processed' | 'cancelled';
  approved_at?: string;
  approved_by?: number;
  processed_at?: string;
  processed_by?: number;
  approval_notes?: string;
  processing_notes?: string;
  created_at: string;
  updated_at: string;
}

export const purchaseReturnApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 CREATE PURCHASE RETURN
    createPurchaseReturn: builder.mutation<
      ApiResponse<PurchaseReturn>,
      CreatePurchaseReturnPayload
    >({
      query: (body) => ({
        url: "/purchase-returns",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PurchaseReturns", "Purchases"],
    }),

    // 🔹 GET ALL PURCHASE RETURNS
    getPurchaseReturns: builder.query<ApiResponse<PurchaseReturn[]>, void>({
      query: () => ({
        url: "/purchase-returns",
        method: "GET",
      }),
      providesTags: ["PurchaseReturns"],
    }),

    // 🔹 GET PURCHASE RETURN BY ID
    getPurchaseReturnById: builder.query<ApiResponse<PurchaseReturn>, string | number>({
      query: (id) => ({
        url: `/purchase-returns/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "PurchaseReturns", id }],
    }),

    // 🔹 UPDATE PURCHASE RETURN
    updatePurchaseReturn: builder.mutation<
      ApiResponse<PurchaseReturn>,
      { id: string | number; body: UpdatePurchaseReturnPayload }
    >({
      query: ({ id, body }) => ({
        url: `/purchase-returns/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "PurchaseReturns",
        { type: "PurchaseReturns", id },
      ],
    }),

    // 🔹 APPROVE PURCHASE RETURN
    approvePurchaseReturn: builder.mutation<
      ApiResponse<PurchaseReturn>,
      { id: string | number; body?: ApprovePurchaseReturnPayload }
    >({
      query: ({ id, body }) => ({
        url: `/purchase-returns/${id}/approve`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "PurchaseReturns",
        { type: "PurchaseReturns", id },
      ],
    }),

    // 🔹 PROCESS PURCHASE RETURN
    processPurchaseReturn: builder.mutation<
      ApiResponse<{
        message: string;
        return_id: number;
        total_amount: number;
        supplier_account: string;
        inventory_account: string;
      }>,
      { id: string | number; body?: ProcessPurchaseReturnPayload }
    >({
      query: ({ id, body }) => ({
        url: `/purchase-returns/${id}/process`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PurchaseReturns", "Inventory", "Accounts"],
    }),

    // 🔹 CANCEL PURCHASE RETURN
    cancelPurchaseReturn: builder.mutation<
      ApiResponse<PurchaseReturn>,
      string | number
    >({
      query: (id) => ({
        url: `/purchase-returns/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        "PurchaseReturns",
        { type: "PurchaseReturns", id },
      ],
    }),
  }),
});

export const {
  useCreatePurchaseReturnMutation,
  useGetPurchaseReturnsQuery,
  useGetPurchaseReturnByIdQuery,
  useUpdatePurchaseReturnMutation,
  useApprovePurchaseReturnMutation,
  useProcessPurchaseReturnMutation,
  useCancelPurchaseReturnMutation,
} = purchaseReturnApi;