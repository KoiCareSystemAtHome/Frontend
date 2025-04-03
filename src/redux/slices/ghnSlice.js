import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest, putRequest } from "../../services/httpMethods";

// Async thunk to fetch provinces (no parameters)
export const fetchProvinces = createAsyncThunk(
  "ghn/fetchProvinces",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequest("Ghn/get-province");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch districts based on province_id
export const fetchDistricts = createAsyncThunk(
  "ghn/fetchDistricts",
  async (province_id, { rejectWithValue }) => {
    try {
      const response = await postRequest("Ghn/get-district", {
        province_id,
      });
      console.log("Fetched Districts:", response.data.data); // ✅ Debug API response
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch wards based on district_id
export const fetchWards = createAsyncThunk(
  "ghn/fetchWards",
  async (district_id, { rejectWithValue }) => {
    try {
      const response = await postRequest("Ghn/get-ward", {
        district_id,
      });
      console.log("Fetched wards:", response.data.data); // ✅ Debug API response
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// CREATE SHOP GHN
export const createShopGHN = createAsyncThunk(
  "Ghn/createShopGHN",
  async (shopData, { rejectWithValue }) => {
    try {
      const response = await postRequest("Ghn/create-shop", shopData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating shop");
    }
  }
);

// CREATE ORDER GHN
export const createOrderGHN = createAsyncThunk(
  "Ghn/CreateOrderGHN",
  async (shopId, { rejectWithValue }) => {
    try {
      console.log("shopData", shopId?.orderData);
      const response = await postRequest(
        `Ghn/create-order/${shopId?.ghnId}`,
        shopId?.ghnRequest
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating order");
    }
  }
);

// Update Order Code Ship Fee
export const updateOrderCodeShipFee = createAsyncThunk(
  "Order/updateOrderCodeShipFee",
  async ({ orderId, order_code, shipFee }, { rejectWithValue }) => {
    try {
      await putRequest("Order/updateOrderCodeShipFee", {
        orderId,
        order_code,
        shipFee,
      });
      return { orderId, order_code, shipFee };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating ship fee");
    }
  }
);

// Update Order Ship Type
export const updateOrderShipType = createAsyncThunk(
  "Order/updateOrderShipType",
  async ({ orderId, shipType }, { rejectWithValue }) => {
    try {
      await putRequest("Order/updateOrderShipType", { orderId, shipType });
      return { orderId, shipType };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error updating ship type"
      );
    }
  }
);

// Update Order Status
export const updateOrderStatus = createAsyncThunk(
  "Order/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      await putRequest("Order/updateOrderStatus", { orderId, status });
      return { orderId, status };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating status");
    }
  }
);

// Async thunk to fetch order tracking information
export const fetchOrderTracking = createAsyncThunk(
  "ghn/fetchOrderTracking",
  async (order_code, { rejectWithValue }) => {
    try {
      const response = await postRequest("Ghn/tracking-order", { order_code }); // ✅ Sends JSON body
      console.log("API Response:", response.data); // 🔍 Debugging log
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching order tracking"
      );
    }
  }
);

// Create slice
const ghnSlice = createSlice({
  name: "ghn",
  initialState: {
    orders: [],
    shopGHN: null,
    provinces: [],
    districts: [],
    wards: [],
    orderTracking: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Provinces
      .addCase(fetchProvinces.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.loading = false;
        state.provinces = action.payload;
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Districts
      .addCase(fetchDistricts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.loading = false;
        state.districts = action.payload;
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Wards
      .addCase(fetchWards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWards.fulfilled, (state, action) => {
        state.loading = false;
        state.wards = action.payload;
      })
      .addCase(fetchWards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create shop GHN
      .addCase(createShopGHN.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShopGHN.fulfilled, (state, action) => {
        state.loading = false;
        //state.orders = action.payload;
        state.orders.push(action.payload); // Thêm đơn hàng mới vào danh sách orders
      })
      .addCase(createShopGHN.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle Order Code Ship Fee Update
      .addCase(updateOrderCodeShipFee.fulfilled, (state, action) => {
        const { orderId, order_code, shipFee } = action.payload;
        const order = state.orders.find((order) => order.id === orderId);
        if (order) {
          order.order_code = order_code;
          order.shipFee = shipFee;
        }
      })

      // Handle Order Ship Type Update
      .addCase(updateOrderShipType.fulfilled, (state, action) => {
        const { orderId, shipType } = action.payload;
        const order = state.orders.find((order) => order.id === orderId);
        if (order) order.shipType = shipType;
      })

      // Handle Order Status Update
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const order = state.orders.find((order) => order.id === orderId);
        if (order) order.status = status;
      })
      // Fetch Order Tracking
      .addCase(fetchOrderTracking.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderTracking.fulfilled, (state, action) => {
        state.loading = false;
        state.orderTracking = action.payload;
      })
      .addCase(fetchOrderTracking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ghnSlice;
