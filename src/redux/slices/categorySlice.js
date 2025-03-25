import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../services/httpMethods";

const initialState = {
  token: "",
  listCategory: [],
};

// GET
export const getListCategory = createAsyncThunk(
  "Category/all-categories",
  async () => {
    try {
      const res = await getRequest("Category/all-categories");
      console.log("res", res);
      return res.data;
    } catch (error) {
      console.log("Error", error);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListCategory.fulfilled, (state, action) => {
      state.listCategory = action.payload;
    });
  },
});

export default categorySlice;
