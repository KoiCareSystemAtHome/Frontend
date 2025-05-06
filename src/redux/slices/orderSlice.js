import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest, putRequest } from "../../services/httpMethods";
import { updateOrderStatus } from "./ghnSlice";

// Initial State
const initialState = {
  listOrder: [],
  loading: false,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// GET ALL LIST
export const getAllListOrder = createAsyncThunk(
  "Order/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRequest(`Order/getAll`);
      console.log("API Response Data:", res?.data); // Ensure data is coming from API
      return res.data;
    } catch (error) {
      console.log("Error", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

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

// REJECT ORDER
export const rejectOrder = createAsyncThunk(
  "Order/rejectOrder",
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const res = await putRequest("Order/RejectOrder", {
        orderId,
        reason,
      });
      console.log("Reject Order Response:", res?.data);
      return { orderId, reason };
    } catch (error) {
      console.log("Error rejecting order:", error);
      return rejectWithValue(error.response?.data || "Failed to reject order");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All List Order
      .addCase(getAllListOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllListOrder.fulfilled, (state, action) => {
        console.log("All Orders Loaded:", action.payload);
        state.status = "succeeded";
        state.listOrder = action.payload;
      })
      .addCase(getAllListOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
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
      // Reject Order
      .addCase(rejectOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(rejectOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { orderId } = action.payload;
        // Update the order in listOrder if it exists
        const orderIndex = state.listOrder.findIndex(
          (order) => order.id === orderId
        );
        if (orderIndex !== -1) {
          state.listOrder[orderIndex].status = "rejected"; // Update status in the list
        }
        // Update orderDetail if it matches the rejected order
        if (state.orderDetail && state.orderDetail.id === orderId) {
          state.orderDetail.status = "rejected";
        }
      })
      .addCase(rejectOrder.rejected, (state, action) => {
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
