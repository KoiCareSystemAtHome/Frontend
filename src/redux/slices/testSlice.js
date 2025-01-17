import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../services/httpMethods";

const initialState = {
  test: null,
};

export const testSlice = createSlice({
  name: "testSlice",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTest.fulfilled, (state, action) => {
      state.test = action.payload;
    });
  },
});

export const getTest = createAsyncThunk(
  "testSlice/getTest",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRequest(`test`);
      return res.data;
    } catch (error) {
      return rejectWithValue("Error");
    }
  }
);

export const postTest = createAsyncThunk(
  "testSlice/postTest",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await postRequest(`test`, payload);
      return res.data;
    } catch (error) {
      return rejectWithValue("Error");
    }
  }
);

export const putTest = createAsyncThunk(
  "testSlice/putTest",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await putRequest(`test`, payload);
      return res.data;
    } catch (error) {
      return rejectWithValue("Error");
    }
  }
);

export const deleteTest = createAsyncThunk(
  "testSlice/deleteTest",
  async (payload, { rejectWithValue }) => {
    try {
      console.log(payload);
      const res = await deleteRequest(`test`, {
        data: payload,
      });
      return res.data;
    } catch (error) {
      // return rejectWithValue("Error");
    }
  }
);

export const { setUser } = testSlice.actions;
export default testSlice;
