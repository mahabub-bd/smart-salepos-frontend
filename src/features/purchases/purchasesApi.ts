import { ApiResponse, Purchase } from "../../types";
import { apiSlice } from "../apiSlice";

export interface ReceivePurchasePayload {
  id: string | number;
  body: any; // If you send quantities, items etc. I can refine it
}

export const purchasesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPurchase: builder.mutation({
      query: (body) => ({
        url: "/purchases",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Purchases"],
    }),
    // 🔹 UPDATE PURCHASE
    updatePurchase: builder.mutation<
      ApiResponse<Purchase>,
      { id: string | number; body: Partial<Purchase> }
    >({
      query: ({ id, body }) => ({
        url: `/purchases/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Purchases",
        { type: "Purchases", id },
      ],
    }),

    // 🔹 GET ALL PURCHASES
    getPurchases: builder.query<ApiResponse<Purchase[]>, void>({
      query: () => ({
        url: "/purchases",
        method: "GET",
      }),
      providesTags: ["Purchases"],
    }),

    // 🔹 GET PURCHASE BY ID
    getPurchaseById: builder.query<ApiResponse<Purchase>, string | number>({
      query: (id) => ({
        url: `/purchases/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Purchases", id }],
    }),

    // 🔹 RECEIVE PURCHASE ITEMS
    receivePurchase: builder.mutation<ApiResponse<any>, ReceivePurchasePayload>(
      {
        query: ({ id, body }) => ({
          url: `/purchases/${id}/receive`,
          method: "POST",
          body,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          "Purchases",
          { type: "Purchases", id },
        ],
      }
    ),
  }),
});

export const {
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useGetPurchasesQuery,
  useGetPurchaseByIdQuery,
  useReceivePurchaseMutation,
} = purchasesApi;
