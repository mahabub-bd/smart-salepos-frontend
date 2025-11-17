import { ApiResponse, User } from "../../types/auth.ts/auth";
import { apiSlice } from "../apiSlice";
export interface CreateUserPayload {
  username: string;
  email: string;
  full_name: string;
  phone: string;
  password: string;
  roles: string[];
}
export interface UpdateUserDto {
  username?: string;
  email?: string;
  full_name?: string;
  phone?: string;
  password?: string;
  roles?: string[];
}
export interface UpdateUserPayload {
  id: number | string;
  body: UpdateUserDto;
}

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<ApiResponse<User>, CreateUserPayload>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
    }),

    getUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
    }),

    // GET USER BY ID
    getUserById: builder.query<ApiResponse<User>, string | number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
    }),

    // UPDATE USER
    updateUser: builder.mutation<ApiResponse<User>, UpdateUserPayload>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
    }),

    // DELETE USER
    deleteUser: builder.mutation<ApiResponse<{ id: number }>, number | string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
