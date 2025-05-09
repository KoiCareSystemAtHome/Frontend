import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequest,
  putRequest,
} from "../../services/httpMethods";

const initialState = {
  token: "",
  transactions: [], // For transactionByShop
  shopBalance: 0, // Store shop balance from the same API response
  productSalesSummary: null, // New state for product sales summary
  revenueData: null, // For revenueByShop
  totalRevenueData: null, // For totalRevenue
  orderStatusSummary: {}, // for shop users
  adminOrderStatusSummary: {}, // For admin users
  walletWithdrawalData: null, // New state for wallet withdrawal data
  loading: false, // To track loading state
  error: null, // To track errors
};

// GET
// Assuming getRequest is a utility function for making API calls
export const transactionByShop = createAsyncThunk(
  "Transaction/transaction-by-shop",
  async (shopid, { rejectWithValue }) => {
    try {
      const res = await getRequest(
        `Transaction/transaction-by-shop?shopid=${shopid}`
      );
      console.log("API response:", res);
      console.log("API response data:", res.data);
      // Normalize the response to ensure it's an array
      return {
        transactions: res.data.transactions || [], // Ensure transactions is an array
        shopBalance: res.data.shopBalance || 0, // Assuming shopBalance is part of the response
      };
    } catch (error) {
      console.log("Error", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch transactions"
      );
    }
  }
);

export const productSalesSummaryByShop = createAsyncThunk(
  "Transaction/product-sales-summary-by-shop",
  async ({ shopId, startDate, endDate }, { rejectWithValue }) => {
    try {
      // Base URL with shopId
      let url = `Transaction/product-sales-summary-by-shop?shopid=${shopId}`;

      // Add startDate and endDate to the query string only if they are provided
      const queryParams = [];
      if (startDate) queryParams.push(`startDate=${startDate}`);
      if (endDate) queryParams.push(`endDate=${endDate}`);

      // Append query parameters if any exist
      if (queryParams.length > 0) {
        url += `&${queryParams.join("&")}`;
      }

      const res = await getRequest(url);
      console.log("res", res);
      return res.data; // Return the data to be stored in the Redux state
    } catch (error) {
      console.log("Error", error);
      // Use rejectWithValue to pass the error to the rejected state
      return rejectWithValue(
        error.response?.data || "Failed to fetch sales summary"
      );
    }
  }
);

export const fetchProductSalesSummary = createAsyncThunk(
  "Transaction/product-sales-summary",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      // Base URL
      let url = `Transaction/product-sales-summary`;

      // Add startDate and endDate to the query string only if they are provided
      const queryParams = [];
      if (startDate) queryParams.push(`startDate=${startDate}`);
      if (endDate) queryParams.push(`endDate=${endDate}`);

      // Append query parameters if any exist
      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }

      const res = await getRequest(url);
      console.log("res", res);
      return res.data; // Return the data to be stored in the Redux state
    } catch (error) {
      console.log("Error", error);
      // Use rejectWithValue to pass the error to the rejected state
      return rejectWithValue(
        error.response?.data || "Failed to fetch sales summary"
      );
    }
  }
);

export const revenueByShop = createAsyncThunk(
  "Transaction/revenue-by-shop",
  async ({ shopId, startDate, endDate }, { rejectWithValue }) => {
    try {
      // Validate parameters
      if (!shopId) {
        throw new Error("shopId is required");
      }
      const queryParams = new URLSearchParams();
      queryParams.append("shopid", shopId);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      console.log(
        "Making revenueByShop API call with URL:",
        `transaction/revenue-by-shop?${queryParams.toString()}`
      );
      const res = await getRequest(
        `Transaction/revenue-by-shop?${queryParams.toString()}`
      );
      console.log("revenueByShop response:", res);
      return res.data;
    } catch (error) {
      console.log("revenueByShop error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch revenue by shop"
      );
    }
  }
);

// Async thunk for fetching total revenue (for admins) with startDate and endDate
export const totalRevenue = createAsyncThunk(
  "Transaction/totalRevenue",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      console.log(
        "Making totalRevenue API call with URL:",
        `transaction/total-revenue?${queryParams.toString()}`
      );
      const res = await getRequest(
        `Transaction/total-revenue?${queryParams.toString()}`
      );
      console.log("totalRevenue response:", res);
      return res.data;
    } catch (error) {
      console.log("totalRevenue error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch total revenue"
      );
    }
  }
);

// Async thunk to fetch order status summary by shop
export const fetchOrderStatusSummaryByShop = createAsyncThunk(
  "transaction/fetchOrderStatusSummaryByShop",
  async ({ shopId, startDate, endDate }, { rejectWithValue }) => {
    try {
      // Base URL with shopId
      let url = `Transaction/order-status-summary-by-shop?shopid=${shopId}`;

      // Add startDate and endDate to the query string only if they are provided
      const queryParams = [];
      if (startDate) queryParams.push(`startDate=${startDate}`);
      if (endDate) queryParams.push(`endDate=${endDate}`);

      // Append query parameters if any exist
      if (queryParams.length > 0) {
        url += `&${queryParams.join("&")}`;
      }

      // Construct params object, excluding undefined/null values
      const params = { shopid: shopId };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await getRequest(url, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching order status summary"
      );
    }
  }
);

// New action for admin users
export const fetchOrderStatusSummary = createAsyncThunk(
  "transaction/fetchOrderStatusSummary",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      // Base URL
      let url = `Transaction/order-status-summary`;

      // Add startDate and endDate to the query string only if they are provided
      const queryParams = [];
      if (startDate) queryParams.push(`startDate=${startDate}`);
      if (endDate) queryParams.push(`endDate=${endDate}`);

      // Append query parameters if any exist
      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }

      // Construct params object, excluding undefined/null values
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await getRequest(url, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching order status summary"
      );
    }
  }
);

// New async thunk for wallet withdrawal
export const getWalletWithdraw = createAsyncThunk(
  "Transaction/get-wallet-withdraw",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRequest("WalletWithdraw");
      console.log("walletWithdraw response:", res);
      return res.data; // Return the data to be stored in the Redux state
    } catch (error) {
      console.log("walletWithdraw error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to process wallet withdrawal"
      );
    }
  }
);

export const walletWithdrawByUser = createAsyncThunk(
  "Transaction/wallet-withdraw-by-user",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error("userId is required");
      }
      const res = await getRequest(`WalletWithdraw/user/${userId}`);
      console.log("walletWithdrawByUser response:", res);
      return res.data; // Return the data to be stored in the Redux state
    } catch (error) {
      console.log("walletWithdrawByUser error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch wallet withdrawal data"
      );
    }
  }
);

export const walletWithdraw = createAsyncThunk(
  "Transaction/wallet-withdraw",
  async ({ userId, amount }, { rejectWithValue }) => {
    try {
      if (!userId || !amount) {
        throw new Error("userId and amount are required");
      }
      const payload = { userId, amount };
      const res = await postRequest("walletWithdraw", payload);
      console.log("walletWithdraw response:", res);
      return res.data; // Assuming the API returns withdrawal data
    } catch (error) {
      console.log("walletWithdraw error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to process wallet withdrawal"
      );
    }
  }
);

// New async thunk for updating wallet withdrawal status
export const updateWalletWithdraw = createAsyncThunk(
  "Transaction/update-wallet-withdraw",
  async ({ withdrawId, status }, { rejectWithValue }) => {
    try {
      if (!withdrawId || !status) {
        throw new Error("withdrawId and status are required");
      }
      const payload = { status };
      const res = await putRequest(`WalletWithdraw/${withdrawId}`, payload);
      console.log("updateWalletWithdraw response:", res);
      return res.data;
    } catch (error) {
      console.log("updateWalletWithdraw error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to update wallet withdrawal status"
      );
    }
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(transactionByShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transactionByShop.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions || []; // Correctly set the transactions array
        state.shopBalance = action.payload.shopBalance || 0;
      })
      .addCase(transactionByShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.transactions = [];
        state.shopBalance = 0;
      })
      // revenueByShop
      .addCase(revenueByShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(revenueByShop.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueData = action.payload;
      })
      .addCase(revenueByShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // totalRevenue
      .addCase(totalRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(totalRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.totalRevenueData = action.payload;
      })
      .addCase(totalRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchOrderStatusSummaryByShop
      .addCase(fetchOrderStatusSummaryByShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStatusSummaryByShop.fulfilled, (state, action) => {
        state.loading = false;
        state.orderStatusSummary = action.payload;
      })
      .addCase(fetchOrderStatusSummaryByShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // New cases for fetchOrderStatusSummary (admin)
      .addCase(fetchOrderStatusSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStatusSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrderStatusSummary = action.payload;
      })
      .addCase(fetchOrderStatusSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // New cases for product-sales-summary
      .addCase(fetchProductSalesSummary.pending, (state) => {
        state.loading = true;
        state.salesSummaryError = null;
      })
      .addCase(fetchProductSalesSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.adminProductSalesSummary = action.payload;
      })
      .addCase(fetchProductSalesSummary.rejected, (state, action) => {
        state.loading = false;
        state.salesSummaryError = action.payload;
      })
      // New cases for product-sales-summary-by-shop
      .addCase(productSalesSummaryByShop.pending, (state) => {
        state.loading = true;
      })
      .addCase(productSalesSummaryByShop.fulfilled, (state, action) => {
        state.loading = false;
        state.productSalesSummary = action.payload;
      })
      .addCase(productSalesSummaryByShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Cases for walletWithdraw
      .addCase(getWalletWithdraw.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWalletWithdraw.fulfilled, (state, action) => {
        state.loading = false;
        state.walletWithdrawalData = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getWalletWithdraw.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.walletWithdrawalData = null;
      })
      // New cases for walletWithdrawByUser
      .addCase(walletWithdrawByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(walletWithdrawByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.walletWithdrawalData = action.payload;
      })
      .addCase(walletWithdrawByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.walletWithdrawalData = null;
      })
      // Cases for walletWithdraw
      .addCase(walletWithdraw.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(walletWithdraw.fulfilled, (state, action) => {
        state.loading = false;
        state.walletWithdrawalData = action.payload; // Update with withdrawal response data
      })
      .addCase(walletWithdraw.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.walletWithdrawalData = null;
      })
      // Cases for updateWalletWithdraw
      .addCase(updateWalletWithdraw.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWalletWithdraw.fulfilled, (state, action) => {
        state.loading = false;
        state.walletWithdrawalData = action.payload;
      })
      .addCase(updateWalletWithdraw.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.walletWithdrawalData = null;
      });
  },
});

export default transactionSlice;
