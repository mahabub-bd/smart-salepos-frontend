import { apiSlice } from "../apiSlice";
import { ApiResponse } from "../../types";

// Analytics Interfaces
export interface DailySale {
  date: string;
  total: number;
  orders: number;
}

export interface Last30DaysAnalytics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  dailySales: DailySale[];
}

export interface MonthlySale {
  month: number; // 1, 2, 3, etc.
  monthName: string; // "January", "February", etc.
  total: number;
  orders: number;
}

export interface MonthWiseAnalytics {
  year: number;
  monthlySales: MonthlySale[];
  totalYearlySales: number;
  totalYearlyOrders: number;
}

export const salesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 GET ALL SALES
    getSales: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `/sales/list?page=${page}&limit=${limit}`,
      providesTags: ["Sales"], // Added here
    }),

    // 🔹 GET SALE BY ID
    getSaleById: builder.query({
      query: (id) => `/sales/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Sales", id }], // Added here
    }),

    // 🔹 CREATE SALE
    createSale: builder.mutation({
      query: (data) => ({
        url: "/sales",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Sales"], // Added here
    }),

    // 🔹 GET LAST 30 DAYS ANALYTICS
    getLast30DaysAnalytics: builder.query<
      ApiResponse<Last30DaysAnalytics>,
      void
    >({
      query: () => "/sales/analytics/last-30-days",
      providesTags: ["Sales"],
    }),

    // 🔹 GET MONTH-WISE ANALYTICS
    getMonthWiseAnalytics: builder.query<
      ApiResponse<MonthWiseAnalytics>,
      { year: number }
    >({
      query: ({ year }) => `/sales/analytics/month-wise?year=${year}`,
      providesTags: ["Sales"],
    }),
  }),
});

export const {
  useGetSalesQuery,
  useGetSaleByIdQuery,
  useCreateSaleMutation,
  useGetLast30DaysAnalyticsQuery,
  useGetMonthWiseAnalyticsQuery,
} = salesApi;
