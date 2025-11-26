import { ApiResponse, ExpenseCategory } from "../../types";
import { apiSlice } from "../apiSlice";

// For Expense Category Update
export interface UpdateExpenseCategoryPayload {
    id: string | number;
    body: Partial<ExpenseCategory>;
}

export const expenseCategoriesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // 🔹 GET ALL EXPENSE CATEGORIES
        getExpenseCategories: builder.query<ApiResponse<ExpenseCategory[]>, void>({
            query: () => ({
                url: "/expense-categories",
                method: "GET",
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({
                            type: "ExpenseCategories" as const,
                            id,
                        })),
                        { type: "ExpenseCategories", id: "LIST" },
                    ]
                    : [{ type: "ExpenseCategories", id: "LIST" }],
        }),

        // 🔹 GET EXPENSE CATEGORY BY ID
        getExpenseCategoryById: builder.query<
            ApiResponse<ExpenseCategory>,
            string | number
        >({
            query: (id) => ({
                url: `/expense-categories/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [
                { type: "ExpenseCategories", id },
            ],
        }),

        // 🔹 CREATE EXPENSE CATEGORY
        createExpenseCategory: builder.mutation<
            ApiResponse<ExpenseCategory>,
            Partial<ExpenseCategory>
        >({
            query: (body) => ({
                url: "/expense-categories",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "ExpenseCategories", id: "LIST" }],
        }),

        // 🔹 UPDATE EXPENSE CATEGORY
        updateExpenseCategory: builder.mutation<
            ApiResponse<ExpenseCategory>,
            UpdateExpenseCategoryPayload
        >({
            query: ({ id, body }) => ({
                url: `/expense-categories/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "ExpenseCategories", id: "LIST" },
                { type: "ExpenseCategories", id },
            ],
        }),

        // 🔹 DELETE EXPENSE CATEGORY
        deleteExpenseCategory: builder.mutation<
            ApiResponse<{ message: string }>,
            string | number
        >({
            query: (id) => ({
                url: `/expense-categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "ExpenseCategories", id: "LIST" }],
        }),
    }),
});

export const {
    useGetExpenseCategoriesQuery,
    useGetExpenseCategoryByIdQuery,
    useCreateExpenseCategoryMutation,
    useUpdateExpenseCategoryMutation,
    useDeleteExpenseCategoryMutation,
} = expenseCategoriesApi;