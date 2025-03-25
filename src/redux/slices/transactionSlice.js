import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest } from "../../services/httpMethods";

const initialState = {
  token: "",
  transactionData: [], // For transactionByShop
  revenueData: null, // For revenueByShop
  totalRevenueData: null, // For totalRevenue
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

export const revenueByShop = createAsyncThunk(
  "Transaction/revenue-by-shop",
  async (shopid, { rejectWithValue }) => {
    try {
      // Construct the URL with the shopid query parameter
      const res = await getRequest(
        `Transaction/revenue-by-shop?shopid=${shopid}`
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

export const totalRevenue = createAsyncThunk(
  "Transaction/total-revenue",
  async () => {
    try {
      const res = await getRequest("Transaction/total-revenue");
      console.log("res", res);
      return res.data;
    } catch (error) {
      console.log("Error", error);
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
      });
  },
});

export default transactionSlice;

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
