import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest, postRequest } from "../../services/httpMethods";

const initialState = {
  token: "",
  listParameter: [],
};

// GET
// export const getListParameter = createAsyncThunk(
//   "Parameter/type",
//   async (type) => {
//     try {
//       const res = await getRequest(`Parameter/type?type=${type}`);
//       console.log("res", res);
//       return res.data;
//     } catch (error) {
//       console.log("Error", error);
//     }
//   }
// );

export const getListParameter = createAsyncThunk(
  "Parameter/type",
  async ({ type }) => {
    try {
      const res = await getRequest(`Parameter/type?type=${type}`);
      console.log(`Fetched ${type} parameters:`, res);
      return res.data;
    } catch (error) {
      console.error(`Error fetching ${type} parameters`, error);
    }
  }
);

// POST
// export const createParameter = createAsyncThunk(
//   "Parameter/create",
//   async (newParameter) => {
//     try {
//       const res = await getRequest("Parameter/upsert-from-excel", newParameter);
//       return res.data;
//     } catch (error) {
//       console.log("Error", error);
//     }
//   }
// );

export const createParameter = createAsyncThunk(
  "Parameter/create",
  async ({ type, file }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type); // Fish or Pond

      const res = await postRequest("Parameter/upsert-from-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(`Created ${type} parameters`, res);
      return res.data;
    } catch (error) {
      console.error(`Error uploading ${type} parameters`, error);
    }
  }
);

const parameterSlice = createSlice({
  name: "parameter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListParameter.fulfilled, (state, action) => {
      state.listParameter = action.payload;
    });
  },
});

export default parameterSlice;
