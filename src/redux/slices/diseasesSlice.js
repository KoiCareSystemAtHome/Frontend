import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequest,
  putRequest,
} from "../../services/httpMethods";

const initialState = {
  token: "",
  diseases: [],
  listDisease: [],
  diseaseDetail: null,
  sickSymptoms: [], // Added for sick symptoms
  sideEffects: [], // Added for side effects
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

// GET Symptoms
export const getSymptoms = createAsyncThunk("Symptomp/type", async () => {
  try {
    const res = await getRequest("Symptomp/type");
    console.log("res", res);
    return res.data;
  } catch (error) {
    console.log("Error", error);
  }
});

// GET Sick Symptoms (New)
export const getSickSymptoms = createAsyncThunk(
  "Diseases/sickSymptomps",
  async () => {
    try {
      const res = await getRequest("Diseases/sickSymtomps");
      console.log("res", res);
      return res.data;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }
);

// GET Side Effects (New)
export const getSideEffects = createAsyncThunk(
  "Diseases/sideEffects",
  async () => {
    try {
      const res = await getRequest("Diseases/sideEffects");
      console.log("res", res);
      return res.data;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }
);

// GET all med
export const getMedicine = createAsyncThunk("Diseases", async () => {
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
export const updateDisease = createAsyncThunk(
  "Diseases/update",
  async (diseaseData, { rejectWithValue }) => {
    try {
      const res = await putRequest("Diseases/update", diseaseData);
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

const diseasesSlice = createSlice({
  name: "diseases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListDisease.fulfilled, (state, action) => {
        state.listDisease = action.payload;
      })
      .addCase(getSymptoms.fulfilled, (state, action) => {
        state.listDisease = action.payload;
      })
      // Add handlers for sick symptoms
      .addCase(getSickSymptoms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSickSymptoms.fulfilled, (state, action) => {
        state.loading = false;
        state.sickSymptoms = action.payload;
      })
      .addCase(getSickSymptoms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch sick symptoms.";
      })
      // Add handlers for side effects
      .addCase(getSideEffects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSideEffects.fulfilled, (state, action) => {
        state.loading = false;
        state.sideEffects = action.payload;
      })
      .addCase(getSideEffects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch side effects.";
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
    // .addCase(updateDisease.fulfilled, (state, action) => {
    //   state.diseaseDetail = action.payload; // ✅ Update Redux state immediately
    // })
    // .addCase(updateDisease.rejected, (state, action) => {
    //   state.error = action.payload;
    // });
  },
});

export default diseasesSlice;
