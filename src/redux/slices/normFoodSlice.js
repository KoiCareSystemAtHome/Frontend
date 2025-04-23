import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../services/httpMethods";

const initialState = {
  token: "",
  listNormFood: [],
};

// GET
export const getListNormFood = createAsyncThunk("Normfood", async () => {
  try {
    const res = await getRequest("Normfood");
    console.log("res", res);
    return res.data;
  } catch (error) {
    console.log("Error", error);
  }
});

const normFoodSlice = createSlice({
  name: "normFood",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListNormFood.fulfilled, (state, action) => {
      state.listNormFood = action.payload;
    });
  },
});

export default normFoodSlice;
