import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest, postRequest } from "../../services/httpMethods";

const initialState = {
  token: "",
  listParameter: [],
  loading: false,
  success: false,
  error: null,
};

// GET
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
//   async ({ type, file }) => {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("type", type); // Fish or Pond

//       const res = await postRequest("Parameter/upsert-from-excel", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log(`Created ${type} parameters`, res);
//       return res.data;
//     } catch (error) {
//       console.error(`Error uploading ${type} parameters`, error);
//     }
//   }
// );

export const createParameter = createAsyncThunk(
  "parameter/createParameter",
  async ({ type, file }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("file", file);
      const response = await fetch(
        "http://14.225.206.203:8080/api/Parameter/upsert-from-excel",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      // After successful upsert, fetch the updated list of parameters
      await dispatch(getListParameter({ type })).unwrap();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const parameterSlice = createSlice({
  name: "parameter",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    clearListParameter: (state) => {
      state.listParameter = [];
    },
  },
  extraReducers: (builder) => {
    // Handle getListParameter
    builder
      .addCase(getListParameter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getListParameter.fulfilled, (state, action) => {
        state.loading = false;
        state.listParameter = action.payload || []; // Ensure it's an array
      })
      .addCase(getListParameter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch parameters";
      });

    // Handle createParameter
    builder
      .addCase(createParameter.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createParameter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Do not update listParameter here; getListParameter handles it
      })
      .addCase(createParameter.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to create parameter";
      });
  },
});

export const { resetStatus, clearListParameter } = parameterSlice.actions;
export default parameterSlice;
