import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { baseUrl } from "../utlis";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: [
    "Users",
    "Roles",
    "Permissions",
    "RolePermissions",
    "Attachments",
    "Brands",
    "Unit",
    "Categories",
    "Tags",
    "Products",
    "Customers",
    "Suppliers",
    "Purchases",
    "Sales",
    "POS",
    "Reports",
    "Warehouses",
    "Inventory",
    "Accounts",
    "Payments",
    "Branches",
    "ExpenseCategories",
    "Expenses",
    "CustomerGroups",
  ],
  endpoints: () => ({}),
});
