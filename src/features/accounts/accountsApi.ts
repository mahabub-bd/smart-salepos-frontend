import { Account, ApiResponse, JournalEntry } from "../../types";
import { apiSlice } from "../apiSlice";

export const accountsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Get all account balances
    getAccountBalances: builder.query<ApiResponse<Account[]>, string | void>({
      query: (date) => `/accounts/balances${date ? `?date=${date}` : ""}`,
      providesTags: ["Accounts"],
    }),

    // 🔹 Get single account by ID
    getAccountById: builder.query<ApiResponse<Account>, number>({
      query: (id) => `/accounts/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Accounts", id }],
    }),

    // 🔹 Get balance for account code
    getAccountBalanceByCode: builder.query<
      ApiResponse<Account>,
      { code: string; date?: string }
    >({
      query: ({ code, date }) =>
        `/accounts/balance/${code}${date ? `?date=${date}` : ""}`,
      providesTags: ["Accounts"],
    }),

    // 🔹 Get account journal
    getAccountJournal: builder.query<ApiResponse<JournalEntry[]>, void>({
      query: () => `/accounts/journal`,
      providesTags: ["Accounts"],
    }),
  }),
});

export const {
  useGetAccountBalancesQuery,
  useGetAccountByIdQuery,
  useGetAccountBalanceByCodeQuery,
  useGetAccountJournalQuery,
} = accountsApi;
