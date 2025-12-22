import { ApiResponse } from "../../types/index.ts";
import {
  GetInventoryJournalParams,
  GetStockMovementsParams,
  Inventory,
  InventoryItem,
  InventoryJournalEntry,
  StockMovement,
} from "../../types/inventory.ts";
import { apiSlice } from "../apiSlice";

export interface AdjustInventoryPayload {
  id: number | string;
  body: {
    quantity: number;
    note?: string;
  };
}

export interface TransferPayload {
  product_id: number;
  from_warehouse_id: number;
  to_warehouse_id: number;
  quantity: number;
  note?: string;
}
interface WarehouseReportParams {
  warehouse_id?: number;
  search?: string;
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
    getWarehouseWiseReport: builder.query<
      ApiResponse<any>,
      WarehouseReportParams
    >({
      query: ({ warehouse_id, search }) => ({
        url: "/inventory/report/warehouse-wise",
        method: "GET",
        params: {
          warehouse_id,
          search,
        },
      }),
      providesTags: ["Inventory"],
    }),

    // 🔹 GET STOCK MOVEMENTS
    getStockMovements: builder.query<
      ApiResponse<StockMovement[]>,
      GetStockMovementsParams | void
    >({
      query: (params) => ({
        url: "/inventory/movements",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Inventory"],
    }),

    // 🔹 GET INVENTORY JOURNAL
    getInventoryJournal: builder.query<
      ApiResponse<InventoryJournalEntry[]>,
      GetInventoryJournalParams | void
    >({
      query: (params) => ({
        url: "/inventory/journal",
        method: "GET",
        params: params || {},
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
  useGetStockMovementsQuery,
  useGetInventoryJournalQuery,
} = inventoryApi;
