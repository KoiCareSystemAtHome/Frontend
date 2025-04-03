import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest } from "../../services/httpMethods";

const initialState = {
  token: "",
  transactionData: [], // For transactionByShop
  productSalesSummary: null, // New state for product sales summary
  revenueData: null, // For revenueByShop
  totalRevenueData: null, // For totalRevenue
  orderStatusSummary: {}, // for shop users
  adminOrderStatusSummary: {}, // For admin users
  loading: false, // To track loading state
  error: null, // To track errors
};

// GET
// Assuming getRequest is a utility function for making API calls
export const transactionByShop = createAsyncThunk(
  "Transaction/transaction-by-shop",
  async (shopid, { rejectWithValue }) => {
    try {
      // Construct the URL with the shopid query parameter
      const res = await getRequest(
        `Transaction/transaction-by-shop?shopid=${shopid}`
      );
      console.log("res", res);
      return res.data; // Return the data to be stored in the Redux state
    } catch (error) {
      console.log("Error", error);
      // Use rejectWithValue to pass the error to the rejected state
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
      // Construct the URL with the shopid query parameter
      const res = await getRequest(
        `Transaction/product-sales-summary-by-shop?shopid=${shopId}&startDate=${startDate}&endDate=${endDate}`
      );
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
      // Construct the URL with the shopid query parameter
      const res = await getRequest(
        `Transaction/product-sales-summary?startDate=${startDate}&endDate=${endDate}`
      );
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
      const response = await getRequest(
        `Transaction/order-status-summary-by-shop?shopid=${shopId}&startDate=${startDate}&endDate=${endDate}`,
        {
          params: {
            shopid: shopId,
            startDate,
            endDate,
          },
        }
      );
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
      const response = await getRequest(
        `Transaction/order-status-summary?startDate=${startDate}&endDate=${endDate}`,
        {
          params: {
            startDate,
            endDate,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching order status summary"
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
        state.transactionData = action.payload;
      })
      .addCase(transactionByShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
      });
  },
});

export default transactionSlice;

// export const revenueByShop = createAsyncThunk(
//   "Transaction/revenue-by-shop",
//   async (shopid, startDate, endDate, { rejectWithValue }) => {
//     try {
//       // Construct the URL with the shopid query parameter
//       const res = await getRequest(
//         `Transaction/revenue-by-shop?shopid=${shopid}&startDate=${startDate}&endDate=${endDate}`
//       );
//       console.log("res", res);
//       return res.data; // Return the data to be stored in the Redux state
//     } catch (error) {
//       console.log("Error", error);
//       // Use rejectWithValue to pass the error to the rejected state
//       return rejectWithValue(
//         error.response?.data || "Failed to fetch transactions"
//       );
//     }
//   }
// );

// export const revenueByShop = createAsyncThunk(
//   "Transaction/revenue-by-shop",
//   async ({ shopid, startDate, endDate }, { rejectWithValue }) => {
//     try {
//       // Construct the URL with the shopid and optional date parameters
//       let url = `Transaction/revenue-by-shop?shopid=${shopid}`;
//       if (startDate) url += `&startDate=${startDate}`;
//       if (endDate) url += `&endDate=${endDate}`;
//       const res = await getRequest(url);
//       console.log("res", res);
//       return res.data;
//     } catch (error) {
//       console.log("Error", error);
//       return rejectWithValue(error.response?.data || "Failed to fetch revenue");
//     }
//   }
// );

// export const totalRevenue = createAsyncThunk(
//   "Transaction/total-revenue",
//   async () => {
//     try {
//       const res = await getRequest("Transaction/total-revenue");
//       console.log("res", res);
//       return res.data;
//     } catch (error) {
//       console.log("Error", error);
//     }
//   }
// );
