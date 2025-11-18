import { jwtDecode } from "jwt-decode";
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
} from "../../types/auth.ts/auth";
import { apiSlice } from "../apiSlice";
import { setCredentials } from "./authSlice";

interface TokenPayload {
  exp: number;
  permissions: string[];
  roles: string[];
}

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
          const decoded = jwtDecode<TokenPayload>(loginData.token);

          dispatch(
            setCredentials({
              token: loginData.token,
              user: loginData.user,
              permissions: decoded.permissions || [],
              expiresAt: decoded.exp,
            })
          );
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
