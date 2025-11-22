import { ApiResponse, Inventory, InventoryItem } from "../../types";
import { apiSlice } from "../apiSlice";

export interface AdjustInventoryPayload {
  id: number | string;
  body: {
    quantity: number;
    note?: string;
  };
}

export interface TransferPayload {
  from_warehouse_id: number;
  to_warehouse_id: number;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export const inventoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Get All Inventory
    getInventory: builder.query<ApiResponse<Inventory[]>, void>({
      query: () => ({
        url: "/inventory",
        method: "GET",
      }),
      providesTags: ["Inventory"],
    }),

    // 🔹 Get Inventory by Product ID
    getInventoryByProductId: builder.query<
      ApiResponse<InventoryItem>,
      number | string
    >({
      query: (productId) => ({
        url: `/inventory/product/${productId}`,
        method: "GET",
      }),
      providesTags: (_res, _err, productId) => [
        { type: "Inventory", id: productId },
      ],
    }),

    // 🔹 Create New Inventory Record
    createInventory: builder.mutation<ApiResponse<Inventory>, any>({
      query: (body) => ({
        url: "/inventory",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Inventory"],
    }),

    // 🔹 Adjust Inventory
    adjustInventory: builder.mutation<
      ApiResponse<Inventory>,
      AdjustInventoryPayload
    >({
      query: ({ id, body }) => ({
        url: `/inventory/${id}/adjust`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        "Inventory",
        { type: "Inventory", id },
      ],
    }),

    // 🔹 Transfer Inventory between warehouses
    transferInventory: builder.mutation<ApiResponse<any>, TransferPayload>({
      query: (body) => ({
        url: "/inventory/transfer",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Inventory"],
    }),

    // 🔹 PRODUCT-WISE REPORT
    getProductWiseReport: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: "/inventory/report/product-wise",
        method: "GET",
      }),
      providesTags: ["Inventory"],
    }),

    // 🔹 WAREHOUSE-WISE REPORT
    getWarehouseWiseReport: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: "/inventory/report/warehouse-wise",
        method: "GET",
      }),
      providesTags: ["Inventory"],
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useGetInventoryByProductIdQuery,
  useCreateInventoryMutation,
  useAdjustInventoryMutation,
  useTransferInventoryMutation,
  useGetProductWiseReportQuery,
  useGetWarehouseWiseReportQuery,
} = inventoryApi;
