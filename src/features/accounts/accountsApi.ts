import { Account, ApiResponse, JournalEntry } from "../../types";
import { apiSlice } from "../apiSlice";
interface GetAccountsQueryArg {
  type?: string;
  isCash?: boolean;
  isBank?: boolean;
}

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

    getAccounts: builder.query<any, GetAccountsQueryArg | void>({
      query: (params) => {
        let url = "/accounts";

        if (params) {
          const queryParams = new URLSearchParams();

          if (params.type) queryParams.append("type", params.type);
          if (params.isCash !== undefined)
            queryParams.append("isCash", String(params.isCash));
          if (params.isBank !== undefined)
            queryParams.append("isBank", String(params.isBank));

          const queryString = queryParams.toString();
          if (queryString) url += `?${queryString}`;
        }

        return { url, method: "GET" };
      },
      providesTags: ["Accounts"],
    }),

    // 🔹 Add cash to ASSET.CASH
    addCash: builder.mutation<
      ApiResponse<any>,
      { amount: number; narration: string }
    >({
      query: (payload) => ({
        url: `/accounts/add-cash`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Accounts"],
    }),
    addBankBalance: builder.mutation<
      ApiResponse<any>,
      { bankAccountCode: string; amount: number; narration: string }
    >({
      query: (payload) => ({
        url: `/accounts/add-bank-balance`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Accounts"],
    }),
    // 🔹 Fund transfer (bank ⇆ cash)
    fundTransfer: builder.mutation<
      ApiResponse<any>,
      {
        fromAccountCode: string;
        toAccountCode: string;
        amount: number;
        narration: string;
      }
    >({
      query: (payload) => ({
        url: `/accounts/fund-transfer`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Accounts"],
    }),
  }),
});

export const {
  useGetAccountBalancesQuery,
  useGetAccountByIdQuery,
  useGetAccountBalanceByCodeQuery,
  useGetAccountJournalQuery,
  useGetAccountsQuery,
  useAddBankBalanceMutation,
  useAddCashMutation,
  useFundTransferMutation,
} = accountsApi;
