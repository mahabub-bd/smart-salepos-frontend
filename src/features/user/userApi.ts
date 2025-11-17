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
    // CREATE USER
    createUser: builder.mutation<ApiResponse<User>, CreateUserPayload>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // GET ALL USERS
    getUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    // GET USER BY ID
    getUserById: builder.query<ApiResponse<User>, string | number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    // UPDATE USER
    updateUser: builder.mutation<ApiResponse<User>, UpdateUserPayload>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Users",
        { type: "Users", id },
      ],
    }),

    // DELETE USER
    deleteUser: builder.mutation<ApiResponse<{ id: number }>, number | string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
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
