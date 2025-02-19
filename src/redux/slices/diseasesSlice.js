import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest, postRequest } from "../../services/httpMethods";

const initialState = {
  token: "",
  listDisease: [],
  diseaseDetail: null,
  loading: false,
  error: null,
};

// GET
export const getListDisease = createAsyncThunk("Diseases", async () => {
  try {
    const res = await getRequest("Diseases/all-disease");
    console.log("res", res);
    return res.data;
  } catch (error) {
    console.log("Error", error);
  }
});

// GET BY ID
export const getDiseaseDetail = createAsyncThunk(
  "Diseases/getDiseaseDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getRequest(`Diseases/${id}`);
      console.log("API Response:", response.data); // Check actual API response
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// POST
export const createDisease = createAsyncThunk(
  "Diseases/create",
  async (newDisease, { rejectWithValue }) => {
    try {
      const res = await postRequest("Diseases/create", newDisease);
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

const diseasesSlice = createSlice({
  name: "diseases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListDisease.fulfilled, (state, action) => {
        state.listDisease = action.payload;
      })
      .addCase(createDisease.fulfilled, (state, action) => {
        state.listDisease.push(action.payload);
      })
      .addCase(getDiseaseDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDiseaseDetail.fulfilled, (state, action) => {
        //console.log("Redux action payload:", action.payload); // Check API response
        state.loading = false;
        state.diseaseDetail = action.payload; // Ensure Redux updates correctly
        //console.log("Updated Redux state:", state.diseaseDetail); // Confirm update
      })
      .addCase(getDiseaseDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch disease details.";
      });
  },
});

export default diseasesSlice;
