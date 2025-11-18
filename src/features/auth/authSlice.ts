import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/auth.ts/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  permissions: string[];
}

const initialState: AuthState = {
  user: null,
  token: null,
  permissions: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User; permissions: string[] }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.permissions = action.payload.permissions;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.permissions = [];
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
