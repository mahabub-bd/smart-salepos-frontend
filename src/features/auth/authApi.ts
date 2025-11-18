import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
} from "../../types/auth.ts/auth";
import { apiSlice } from "../apiSlice";
import { setCredentials } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const loginData = data.data;

          dispatch(
            setCredentials({
              token: loginData.token,
              user: loginData.user,
              permissions: [],
            })
          );

          const roleName = loginData.user?.roles?.[0]?.name;
          if (roleName) {
            const permissionResult = await dispatch(
              authApi.endpoints.getRolePermissions.initiate(roleName)
            ).unwrap();

            dispatch(
              setCredentials({
                token: loginData.token,
                user: loginData.user,
                permissions: permissionResult.data.map((p) => p.key),
              })
            );
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    getRolePermissions: builder.query<
      ApiResponse<{ id: number; key: string; description: string }[]>,
      string
    >({
      query: (roleName) => ({
        url: `/rbac/role/${roleName}/permissions`,
        method: "GET",
      }),
    }),
  }),
});

// Export hooks
export const { useLoginMutation, useGetRolePermissionsQuery } = authApi;
