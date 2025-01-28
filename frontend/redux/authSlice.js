import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

// Async Thunk for Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/login", credentials);
      const { token } = response.data;
      localStorage.setItem("auth_token", token);
      return token;
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

// Async Thunk for Registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed";
      return rejectWithValue(message);
    }
  }
);

// Async Thunk for Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/forgot-password", email);
      return response.data.message;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Forgot password failed";
      return rejectWithValue(message);
    }
  }
);

// Async Thunk for Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    console.log(token, password);
    try {
      const response = await axios.post(`/auth/reset-password?token=${token}`, {
        password: password,
      });
      console.log("response from auth", response);
      return response.data.message;
    } catch (error) {
      const message = error?.response?.data?.message || "Reset password failed";
      return rejectWithValue(message);
    }
  }
);

// Slice for Authentication
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null, // Initialize null and manage via effects if needed
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      localStorage.removeItem("auth_token");
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
