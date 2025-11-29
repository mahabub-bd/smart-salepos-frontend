import { apiSlice } from "../apiSlice";


export const salesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSales: builder.query({
            query: ({ page = 1, limit = 10 }) =>
                `/sales/list?page=${page}&limit=${limit}`,
        }),

        getSaleById: builder.query({
            query: (id) => `/sales/${id}`,
        }),

        createSale: builder.mutation({
            query: (data) => ({
                url: "/sales",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetSalesQuery,
    useGetSaleByIdQuery,
    useCreateSaleMutation,
} = salesApi;
