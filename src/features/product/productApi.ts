import { ApiResponse } from "../../types";
import { Product, ProductRequest } from "../../types/product";
import { apiSlice } from "../apiSlice";

export interface UpdateProductPayload {
  id: string | number;
  body: ProductRequest;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  brandId?: number;
  supplierId?: number;
  categoryId?: number;
  subcategoryId?: number;
  origin?: string;
  isVariable?: boolean;
  hasExpiry?: boolean;
  status?: boolean;
  product_type?: string;
}

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 GET ALL PRODUCTS
    getProducts: builder.query<ApiResponse<Product[]>, ProductFilters>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.search) searchParams.append("search", params.search);
        if (params.brandId)
          searchParams.append("brandId", params.brandId.toString());
        if (params.supplierId)
          searchParams.append("supplierId", params.supplierId.toString());
        if (params.categoryId)
          searchParams.append("categoryId", params.categoryId.toString());
        if (params.subcategoryId)
          searchParams.append("subcategoryId", params.subcategoryId.toString());
        if (params.origin) searchParams.append("origin", params.origin);
        if (params.isVariable !== undefined)
          searchParams.append("isVariable", params.isVariable.toString());
        if (params.hasExpiry !== undefined)
          searchParams.append("hasExpiry", params.hasExpiry.toString());
        if (params.status !== undefined)
          searchParams.append("status", params.status.toString());
        if (params.product_type)
          searchParams.append("product_type", params.product_type);

        return {
          url: `/product?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Products"],
    }),

    // 🔹 GET PRODUCT BY ID
    getProductById: builder.query<ApiResponse<Product>, string | number>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),

    // 🔹 CREATE PRODUCT
    createProduct: builder.mutation<ApiResponse<Product>, ProductRequest>({
      query: (body) => ({
        url: "/product",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products", "Suppliers"],
    }),

    // 🔹 UPDATE PRODUCT
    updateProduct: builder.mutation<ApiResponse<Product>, UpdateProductPayload>(
      {
        query: ({ id, body }) => ({
          url: `/product/${id}`,
          method: "PATCH",
          body,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          "Products",
          "Suppliers",
          { type: "Products", id },
        ],
      }
    ),

    // 🔹 DELETE PRODUCT
    deleteProduct: builder.mutation<
      ApiResponse<{ message: string }>,
      string | number
    >({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "Suppliers"],
    }),
  }),
});

// 🔥 Export hooks
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
