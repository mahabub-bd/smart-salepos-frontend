import { ApiResponse, Category } from "../../types";
import { apiSlice } from "../apiSlice";

// For Category Update
export interface UpdateCategoryPayload {
  id: string | number;
  body: Partial<Category>;
}

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 GET ALL CATEGORIES
    getCategories: builder.query<ApiResponse<Category[]>, void>({
      query: () => ({
        url: "/category",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),
    getCategoryTree: builder.query<ApiResponse<Category[]>, void>({
      query: () => ({
        url: "/category/tree",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    // 🔹 GET CATEGORY BY ID
    getCategoryById: builder.query<ApiResponse<Category>, string | number>({
      query: (id) => ({
        url: `/category/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Categories", id }],
    }),

    // 🔹 CREATE CATEGORY
    createCategory: builder.mutation<ApiResponse<Category>, Partial<Category>>({
      query: (body) => ({
        url: "/category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    // 🔹 UPDATE CATEGORY
    updateCategory: builder.mutation<
      ApiResponse<Category>,
      UpdateCategoryPayload
    >({
      query: ({ id, body }) => ({
        url: `/category/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Categories",
        { type: "Categories", id },
      ],
    }),

    // 🔹 DELETE CATEGORY
    deleteCategory: builder.mutation<
      ApiResponse<{ message: string }>,
      string | number
    >({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useGetCategoryTreeQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
