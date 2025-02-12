import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest, postRequest } from "../../services/httpMethods";

const initialState = {
  token: "",
  listProduct: [],
};

// GET
export const getListProductManagement = createAsyncThunk(
  "Product",
  async () => {
    try {
      const res = await getRequest("Product");
      console.log("res", res);
      return res.data;
    } catch (error) {
      console.log("Error", error);
    }
  }
);

// POST
export const createProductManagement = createAsyncThunk(
  "Product/create-product",
  async (newProduct, { rejectWithValue }) => {
    try {
      const res = await postRequest("Product/create-product", newProduct);
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

const productManagementSlice = createSlice({
  name: "productManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListProductManagement.fulfilled, (state, action) => {
        state.listProduct = action.payload;
      })
      .addCase(createProductManagement.fulfilled, (state, action) => {
        state.listProduct.push(action.payload);
      });
  },
});

export default productManagementSlice;
