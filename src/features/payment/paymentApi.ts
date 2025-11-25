import { ApiResponse } from "../../types";
import { apiSlice } from "../apiSlice";

export interface CreatePaymentPayload {
  type: "supplier" | "customer";
  supplier_id?: number;
  customer_id?: number;
  purchase_id?: number;
  sale_id?: number;
  amount: number;
  payment_account_code: string;
  method: "cash" | "bank" | "bkash";
  note?: string;
}

export const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation<ApiResponse<any>, CreatePaymentPayload>({
      query: (body) => ({
        url: "/payments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Purchases", "Sales", "Suppliers"],
    }),
    getPayments: builder.query({
      query: () => "/payments",
      providesTags: ["Payments", "Purchases", "Sales", "Suppliers"],
    }),

    getPaymentById: builder.query({
      query: (id) => `/payments/${id}`,
      providesTags: ["Payments", "Purchases", "Sales", "Suppliers"],
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
} = paymentsApi;
