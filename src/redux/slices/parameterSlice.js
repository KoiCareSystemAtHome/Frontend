import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequest,
  postRequestFormData,
} from "../../services/httpMethods";

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

// Get Parameter
export const getParameters = createAsyncThunk(
  "Pond/pond-required-param",
  async () => {
    try {
      const res = await getRequest(`Pond/pond-required-param`);
      console.log(`Fetched parameters:`, res);
      return res.data;
    } catch (error) {
      console.error(`Error fetching parameters`, error);
    }
  }
);

// POST
export const createParameter = createAsyncThunk(
  "parameter/createParameter",
  async ({ type, file }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("file", file);

      const response = await postRequestFormData(
        "Parameter/upsert-from-excel",
        formData
      );

      const data = await response.data; // Note: axios response uses .data property
      // After successful upsert, fetch the updated list of parameters
      await dispatch(getListParameter({ type })).unwrap();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// POST - Edit Pond Parameter
export const editPondParameter = createAsyncThunk(
  "parameter/editPondParameter",
  async (parameterData, { rejectWithValue, dispatch }) => {
    try {
      const response = await postRequest(
        "Parameter/edit-pond-param",
        parameterData
      );
      const data = await response.data;

      // Optionally refresh the parameter list after editing
      if (parameterData.type) {
        await dispatch(getListParameter({ type: parameterData.type })).unwrap();
      }

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

    // Handle getParameters
    builder
      .addCase(getParameters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getParameters.fulfilled, (state, action) => {
        state.loading = false;
        state.listParameter = action.payload || []; // Ensure it's an array
      })
      .addCase(getParameters.rejected, (state, action) => {
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
    // Handle editPondParameter
    builder
      .addCase(editPondParameter.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(editPondParameter.fulfilled, (state, action) => {
        state.loading = false;
        // List is updated via getListParameter dispatch in the thunk
      })
      .addCase(editPondParameter.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to edit parameter";
      });
  },
});

export const { resetStatus, clearListParameter } = parameterSlice.actions;
export default parameterSlice;
