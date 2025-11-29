import { apiSlice } from "../apiSlice";

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
  }),
});

export const {
  useGetSalesQuery,
  useGetSaleByIdQuery,
  useCreateSaleMutation,
} = salesApi;
