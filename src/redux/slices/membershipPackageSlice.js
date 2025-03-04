import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequest,
  putRequest,
} from "../../services/httpMethods";

const initialState = {
  token: "",
  listMembership: [],
};

// GET
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

// POST
export const createPackage = createAsyncThunk(
  "Package/create-package",
  async (newPackage, { rejectWithValue }) => {
    try {
      const res = await postRequest("Package/create-package", newPackage);
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
export const updatePackage = createAsyncThunk(
  "Shop/update",
  async ({ updatedMembership }, { rejectWithValue }) => {
    try {
      const res = await putRequest(`Package/update-package`, updatedMembership);

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

const membershipPackageSlice = createSlice({
  name: "membershipPackage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListMembershipPackage.fulfilled, (state, action) => {
        state.listMembership = action.payload;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.listMembership.push(action.payload);
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        const updatedMembership = action.payload;
        state.listMembership = state.listMembership.map((membership) =>
          membership.id === updatedMembership.id
            ? updatedMembership
            : membership
        );
      });
  },
});

export default membershipPackageSlice;
