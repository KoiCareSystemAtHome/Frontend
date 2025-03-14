import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../services/httpMethods";
import { updateOrderStatus } from "./ghnSlice";

// Initial State
const initialState = {
  listOrder: [],
  loading: false,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// GET BY SHOP ID
export const getListOrder = createAsyncThunk(
  "Order/getByShopId",
  async (shopId, { rejectWithValue }) => {
    try {
      const res = await getRequest(`Order/getByShopId?orderId=${shopId}`);
      console.log("API Response Data:", res?.data); // Ensure data is coming from API
      return res.data;
    } catch (error) {
      console.log("Error", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// ORDER DETAIL
export const getOrderDetail = createAsyncThunk(
  "Order/getByOrderId",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await getRequest(`Order/detail?orderId=${orderId}`);
      console.log("API Response Data:", res?.data); // Ensure data is coming from API
      return res.data;
    } catch (error) {
      console.log("Error", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get List Order
      .addCase(getListOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getListOrder.fulfilled, (state, action) => {
        console.log("Order List Loaded:", action.payload);
        state.status = "succeeded";
        state.listOrder = action.payload;
      })
      .addCase(getListOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Order Detail
      .addCase(getOrderDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOrderDetail.fulfilled, (state, action) => {
        console.log("Order Detail Loaded:", action.payload);
        state.status = "succeeded";
        state.orderDetail = action.payload; // Save order detail data
      })
      .addCase(getOrderDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle update status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        if (state.orderDetail && state.orderDetail.id === orderId) {
          state.orderDetail.status = status;
        }
      });
  },
});

export default orderSlice;
