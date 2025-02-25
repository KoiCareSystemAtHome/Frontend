import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestFormData,
  postRequestParams,
} from "../../services/httpMethods";
import { message, notification } from "antd";
import { handleDangNhap } from "../../axios/axiosInterceptor";

// Define the async thunk for login
export const login = createAsyncThunk(
  "Account/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Ensure you're sending the correct headers and payload
      const res = await postRequestParams("Account/login", {
        username,
        password,
      });
      console.log("Payload being sent:", { username, password });
      return res.data; // Assuming the response contains user data
    } catch (error) {
      // Check if the error response is available
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Invalid credentials"
        );
      }
      return rejectWithValue("Invalid credentials");
    }
  }
);

export const register = createAsyncThunk(
  "Account/register",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await postRequestFormData("Account/register", payload);
      if (response && response.status === 200) {
        message.success("You have successfully registered.");
      }
      return response.data;
    } catch (error) {
      message.error(
        error.response.data.message || "An error occurred during registration."
      );
      return rejectWithValue(error.response || error.response.data.message);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      notification.success({
        message: "Logged out successfully",
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fulfilled state
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        handleDangNhap(action.payload);
      })
      // Rejected state
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      // Fulfilled state
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      // Rejected state
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice;
