// src/features/report/reportApi.ts

import { ApiResponse, DateRangeParams } from "../../types";
import { apiSlice } from "../apiSlice";

// ============================================================================
// REPORT TYPES & ENUMS
// ============================================================================

export type ReportType =
  | "sales"
  | "purchase"
  | "inventory"
  | "profit_loss"
  | "expense"
  | "attendance";

export type ReportStatus = "pending" | "processing" | "completed" | "failed";

export type ReportPeriod = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export interface Report {
  id: number;
  type: ReportType;
  title: string;
  description?: string;
  status: ReportStatus;
  file_path?: string;
  file_url?: string;
  generated_by: number;
  generated_at?: string;
  branch_id?: number;
  parameters?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface GenerateSalesReportPayload extends DateRangeParams {
  period?: ReportPeriod;
  branch_id?: number;
  customer_id?: number;
  payment_method?: string;
}

export interface GeneratePurchaseReportPayload extends DateRangeParams {
  branch_id?: number;
  supplier_id?: number;
  warehouse_id?: number;
}

export interface GenerateInventoryReportPayload {
  warehouse_id?: number;
  branch_id?: number;
  product_id?: number;
  low_stock_only?: boolean;
}

export interface GenerateProfitLossPayload extends DateRangeParams {
  branch_id?: number;
}

export interface GenerateExpenseReportPayload extends DateRangeParams {
  branch_id?: number;
  category_id?: number;
  payment_method?: string;
}

export interface GenerateAttendanceReportPayload extends DateRangeParams {
  branch_id?: number;
  employee_id?: number;
  department_id?: number;
}

export interface ReportFilterParams {
  type?: ReportType;
  status?: ReportStatus;
  branch_id?: number;
  page?: number;
  limit?: number;
}

export interface CreateReportPayload {
  type: ReportType;
  title: string;
  description?: string;
  parameters?: Record<string, any>;
  branch_id?: number;
}

export interface UpdateReportPayload {
  id: string | number;
  body: {
    title?: string;
    description?: string;
    status?: ReportStatus;
  };
}

export interface ReportDashboardSummary {
  total_reports: number;
  pending_reports: number;
  completed_reports: number;
  failed_reports: number;
  recent_reports: Report[];
  reports_by_type: {
    sales: number;
    purchase: number;
    inventory: number;
    profit_loss: number;
    expense: number;
    attendance: number;
  };
}

export interface ReportTypeInfo {
  type: ReportType;
  name: string;
  description: string;
  available: boolean;
}

export const reportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 GET ALL REPORTS (with filters)
    getReports: builder.query<ApiResponse<Report[]>, ReportFilterParams | void>(
      {
        query: (params) => {
          const searchParams = new URLSearchParams();

          if (params) {
            if (params.type) searchParams.append("type", params.type);
            if (params.status) searchParams.append("status", params.status);
            if (params.branch_id)
              searchParams.append("branch_id", params.branch_id.toString());
            if (params.page)
              searchParams.append("page", params.page.toString());
            if (params.limit)
              searchParams.append("limit", params.limit.toString());
          }

          const queryString = searchParams.toString();
          return {
            url: `/reports${queryString ? `?${queryString}` : ""}`,
            method: "GET",
          };
        },
        providesTags: (result) =>
          result?.data
            ? [
                ...result.data.map(({ id }) => ({
                  type: "Reports" as const,
                  id,
                })),
                { type: "Reports", id: "LIST" },
              ]
            : [{ type: "Reports", id: "LIST" }],
      }
    ),

    // 🔹 GET REPORT BY ID
    getReportById: builder.query<ApiResponse<Report>, string | number>({
      query: (id) => ({
        url: `/reports/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Reports", id }],
    }),

    // 🔹 CREATE REPORT
    createReport: builder.mutation<ApiResponse<Report>, CreateReportPayload>({
      query: (body) => ({
        url: "/reports",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Reports", id: "LIST" }],
    }),

    // 🔹 UPDATE REPORT
    updateReport: builder.mutation<ApiResponse<Report>, UpdateReportPayload>({
      query: ({ id, body }) => ({
        url: `/reports/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Reports", id: "LIST" },
        { type: "Reports", id },
      ],
    }),

    // 🔹 DELETE REPORT
    deleteReport: builder.mutation<
      ApiResponse<{ message: string }>,
      string | number
    >({
      query: (id) => ({
        url: `/reports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Reports", id: "LIST" }],
    }),

    // 🔹 DOWNLOAD REPORT
    downloadReport: builder.query<Blob, string | number>({
      query: (id) => ({
        url: `/reports/${id}/download`,
        method: "GET",
        responseHandler: async (response) => response.blob(),
      }),
      providesTags: (_result, _error, id) => [{ type: "Reports", id }],
    }),

    // 🔹 GENERATE SALES REPORT
    generateSalesReport: builder.mutation<
      ApiResponse<Report>,
      GenerateSalesReportPayload
    >({
      query: (body) => ({
        url: "/reports/sales",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Reports", id: "LIST" }],
    }),

    // 🔹 GENERATE PURCHASE REPORT
    generatePurchaseReport: builder.mutation<
      ApiResponse<Report>,
      GeneratePurchaseReportPayload
    >({
      query: (body) => ({
        url: "/reports/purchase",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Reports", id: "LIST" }],
    }),

    // 🔹 GENERATE INVENTORY REPORT
    generateInventoryReport: builder.mutation<
      ApiResponse<Report>,
      GenerateInventoryReportPayload
    >({
      query: (body) => ({
        url: "/reports/inventory",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Reports", id: "LIST" }],
    }),

    // 🔹 GENERATE PROFIT & LOSS REPORT
    generateProfitLossReport: builder.mutation<
      ApiResponse<Report>,
      GenerateProfitLossPayload
    >({
      query: (body) => ({
        url: "/reports/profit-loss",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Reports", id: "LIST" }],
    }),

    // 🔹 GENERATE EXPENSE REPORT
    generateExpenseReport: builder.mutation<
      ApiResponse<Report>,
      GenerateExpenseReportPayload
    >({
      query: (body) => ({
        url: "/reports/expense",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Reports", id: "LIST" }],
    }),

    // 🔹 GENERATE ATTENDANCE REPORT
    generateAttendanceReport: builder.mutation<
      ApiResponse<Report>,
      GenerateAttendanceReportPayload
    >({
      query: (body) => ({
        url: "/reports/attendance",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Reports", id: "LIST" }],
    }),

    // 🔹 GET DASHBOARD SUMMARY
    getReportDashboardSummary: builder.query<
      ApiResponse<ReportDashboardSummary>,
      void
    >({
      query: () => ({
        url: "/reports/summary/dashboard",
        method: "GET",
      }),
      providesTags: [{ type: "Reports", id: "DASHBOARD" }],
    }),

    // 🔹 GET AVAILABLE REPORT TYPES
    getReportTypes: builder.query<ApiResponse<ReportTypeInfo[]>, void>({
      query: () => ({
        url: "/reports/types/list",
        method: "GET",
      }),
      providesTags: [{ type: "Reports", id: "TYPES" }],
    }),
  }),
});

export const {
  // Query hooks
  useGetReportsQuery,
  useGetReportByIdQuery,
  useLazyDownloadReportQuery,
  useGetReportDashboardSummaryQuery,
  useGetReportTypesQuery,

  // Mutation hooks
  useCreateReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation,
  useGenerateSalesReportMutation,
  useGeneratePurchaseReportMutation,
  useGenerateInventoryReportMutation,
  useGenerateProfitLossReportMutation,
  useGenerateExpenseReportMutation,
  useGenerateAttendanceReportMutation,
} = reportApi;
