import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../services/httpMethods";

const initialState = {
  token: "",
  listMembership: [],
};

export const getListMembershipPackage = createAsyncThunk(
  "Package",
  async () => {
    try {
      const res = await getRequest("Package");
      console.log("res", res);
      return res.data;
    } catch (error) {
      console.log("Error", error);
    }
  }
);

const membershipPackageSlice = createSlice({
  name: "membershipPackage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListMembershipPackage.fulfilled, (state, action) => {
      state.listMembership = action.payload;
    });
  },
});

export default membershipPackageSlice;
