import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest } from "../../services/httpMethods";
import { notification } from "antd";
import { handleDangNhap } from "../../axios/axiosInterceptor";


export const login = createAsyncThunk(
  "authSlice/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await postRequest("authentication/login", credentials);
      return response.data; 
    } catch (error) {
    }
  }
);

export const register = createAsyncThunk(
    "authSlice/login",
    async (credentials, { rejectWithValue }) => {
      try {
        const response = await postRequest("authentication/register", credentials);
        return response.data; 
      } catch (error) {
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
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fulfilled state
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        handleDangNhap(action.payload)
      })
      // Rejected state
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice;
