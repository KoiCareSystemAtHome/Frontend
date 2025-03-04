import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../services/httpMethods";

const initialState = {
  token: "",
  listShop: [],
  shopProfile: null, // Store only the shop of the logged-in user
};

// GET
export const getListShop = createAsyncThunk("Shop", async () => {
  try {
    const res = await getRequest("Shop");
    console.log("res", res);
    return res.data;
  } catch (error) {
    console.log("Error", error);
  }
});

// GET BY USER ID
export const getShopByUserId = createAsyncThunk(
  "Shop/getByUser",
  async (userId, { rejectWithValue }) => {
    try {
      console.log("API Call: Fetching shop for userId:", userId);
      const res = await getRequest(`Shop/user/${userId}`);
      console.log("API Response:", res.data);
      return res.data;
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to fetch shop details"
      );
    }
  }
);

// CREATE
export const createShop = createAsyncThunk(
  "Shop/create",
  async (newShop, { rejectWithValue }) => {
    try {
      const res = await postRequest("Shop/create", newShop);
      console.log("res", res);
      if (res.data.status === 400) {
        return rejectWithValue(res.data.detail);
      }
      return res.data;
    } catch (error) {
      console.log(error.detail);
    }
  }
);

// UPDATE
export const updateShop = createAsyncThunk(
  "Shop/update",
  async ({ shopId, updatedShop }, { rejectWithValue }) => {
    try {
      const res = await putRequest(`Shop/${shopId}`, updatedShop);

      // Ensure response and data exist
      if (!res || !res.data) {
        throw new Error("Invalid API response");
      }

      return res.data;
    } catch (error) {
      console.error("Update failed:", error);

      // Handle different error types
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

// DELETE
export const deleteShop = createAsyncThunk("Shop/delete", async (id) => {
  try {
    const res = await deleteRequest(`Shop/${id}`);
    console.log("response:", res);
    return id;
  } catch (error) {
    console.log({ error });
  }
});

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListShop.fulfilled, (state, action) => {
        state.listShop = action.payload;
      })
      .addCase(getShopByUserId.fulfilled, (state, action) => {
        state.shopProfile = action.payload.shop;
      })
      .addCase(createShop.fulfilled, (state, action) => {
        state.listShop.push(action.payload);
      })
      .addCase(updateShop.fulfilled, (state, action) => {
        const updateShop = action.payload;
        const index = state.listShop.findIndex(
          (shop) => shop.id === updateShop.id
        );
        if (index !== -1) {
          state.listShop[index] = updateShop;
        }
      })
      .addCase(deleteShop.fulfilled, (state, action) => {
        const idToDelete = action.payload;
        state.listShop = state.listShop.filter(
          (shop) => shop.id !== idToDelete
        );
      });
  },
});

export default shopSlice;
