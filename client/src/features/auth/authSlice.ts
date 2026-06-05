import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  id: string;
  email: string;
  role: string;
}

const initialState: AuthState = {
  id: "",
  email: "",
  role: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authLogin(state, action: PayloadAction<AuthState>) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    authLogout() {
      return initialState;
    },
  },
});

export const { authLogin, authLogout } = authSlice.actions;
export const authReducer = authSlice.reducer;
