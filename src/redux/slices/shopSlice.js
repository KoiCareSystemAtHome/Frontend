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

// UODATE
// export const updateShop = createAsyncThunk(
//   "Shop/update",
//   async ({ shopId, updatedShop }) => {
//     try {
//       const res = await putRequest(`Shop/${shopId}`, updatedShop);
//       return res.data;
//     } catch (error) {
//       console.log({ error });
//     }
//   }
// );

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
