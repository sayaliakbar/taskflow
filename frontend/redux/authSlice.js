import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

// Async Thunk for Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/login", credentials);
      console.log(response);
      const { token, data: user } = response.data;
      if (typeof window !== "undefined" && response.status === 200) {
        localStorage.setItem("user", response.data.data);
        localStorage.setItem("auth_token", token); // Save token in localStorage on client side
      }

      return { token, user };
    } catch (error) {
      console.log(error);
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
    user: null,
    token: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token"); // Remove token from localStorage on client side
      }
    },
    initializeAuth(state) {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        const user = localStorage.getItem("user");
        if (token && user) {
          state.token = token;
          state.user = user;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
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

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
