import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteRequest,
  getRequest,
  postRequest,
} from "../../services/httpMethods";

const initialState = {
  token: "",
  listShop: [],
};

// GET
export const getListShop = createAsyncThunk("Shop/all-shop", async () => {
  try {
    const res = await getRequest("Shop/all-shop");
    console.log("res", res);
    return res.data;
  } catch (error) {
    console.log("Error", error);
  }
});

// POST
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
      .addCase(deleteShop.fulfilled, (state, action) => {
        const idToDelete = action.payload;
        state.listShop = state.listShop.filter(
          (shop) => shop.id !== idToDelete
        );
      });
  },
});

export default shopSlice;
