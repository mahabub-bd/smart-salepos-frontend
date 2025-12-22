import { ApiResponse } from "../../types";
import { Last30DaysAnalytics, MonthWiseAnalytics } from "../../types/analytics";
import { apiSlice } from "../apiSlice";

export const salesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 GET ALL SALES
    getSales: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/sales/list`,
        params: { page, limit },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }: any) => ({
                type: "Sales" as const,
                id,
              })),
              { type: "Sales", id: "LIST" },
            ]
          : [{ type: "Sales", id: "LIST" }],
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
