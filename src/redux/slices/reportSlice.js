import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequest,
  putRequest,
} from "../../services/httpMethods";

const initialState = {
  token: "",
  listReport: [],
};

// GET
export const getListReport = createAsyncThunk("Report", async () => {
  try {
    const res = await getRequest("Report");
    console.log("res", res);
    return res.data;
  } catch (error) {
    console.log("Error", error);
  }
});

// CREATE
export const createReport = createAsyncThunk(
  "Report/create-report",
  async (newReport, { rejectWithValue }) => {
    try {
      const res = await postRequest("Report/create-report", newReport);
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

//UPDATE
export const updateReportStatus = createAsyncThunk(
  "Report/update-report",
  async ({ reportId, statuz }, { rejectWithValue }) => {
    try {
      const res = await putRequest("Report/update-report", {
        reportId,
        statuz,
      });
      console.log("Response:", res);

      if (res.status === 400) {
        return rejectWithValue(res.data.detail);
      }
      return res.data;
    } catch (error) {
      console.error(
        "Error updating report:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.detail || "An unknown error occurred"
      );
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListReport.fulfilled, (state, action) => {
        state.listReport = action.payload;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.listReport.push(action.payload);
      })
      .addCase(updateReportStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Find the report by ID and update its status
        const index = state.listReport.findIndex(
          (r) => r.reportId === action.payload.reportId
        );
        if (index !== -1) {
          state.listReport[index] = action.payload;
        }
      })
      .addCase(updateReportStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reportSlice;
