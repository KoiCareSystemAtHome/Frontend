import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequest,
  putRequest,
} from "../../services/httpMethods";

const initialState = {
  token: "",
  listBlog: [],
  blogDetail: null,
  loading: false,
  error: null,
};

// GET
export const getListBlog = createAsyncThunk("Blog", async () => {
  try {
    const res = await getRequest("Blog/all-blogs");
    console.log("res", res);
    return res.data;
  } catch (error) {
    console.log("Error", error);
  }
});

// GET BY ID
export const getBlogDetail = createAsyncThunk(
  "Blog/getBlogDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getRequest(`Blog/${id}`);
      console.log("API Response:", response.data); // Check actual API response
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// CREATE
export const createBlog = createAsyncThunk(
  "Blog/create-blog",
  async (newBlog, { rejectWithValue }) => {
    try {
      const res = await postRequest("Blog/create-blog", newBlog);
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

// APPROVE BLOG
export const approveBlog = createAsyncThunk(
  "Blog/approveBlog",
  async ({ blogId, newStatus }, { rejectWithValue }) => {
    try {
      const res = await putRequest(`Blog/${blogId}/approve`, newStatus); // Sending approval as true
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to approve blog.");
    }
  }
);

// UPDATE BLOG
export const updateBlog = createAsyncThunk(
  "Shop/update",
  async (updatedBlog, { rejectWithValue }) => {
    try {
      const res = await putRequest(`Blog/update-blog`, updatedBlog);

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

export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET BLOG LIST
      .addCase(getListBlog.fulfilled, (state, action) => {
        state.listBlog = action.payload;
      })
      // GET BLOG DETAIL
      .addCase(getBlogDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogDetail.fulfilled, (state, action) => {
        //console.log("Redux action payload:", action.payload); // Check API response
        state.loading = false;
        state.blogDetail = action.payload; // Ensure Redux updates correctly
        //console.log("Updated Redux state:", state.blogDetail); // Confirm update
      })
      .addCase(getBlogDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch blog details.";
      })
      // APPROVE BLOG
      .addCase(approveBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveBlog.fulfilled, (state, action) => {
        state.loading = false;
        const { blogId, newStatus } = action.meta.arg; // Get the correct values

        // Update blogDetail if the same blog is being approved
        if (state.blogDetail && state.blogDetail.id === blogId) {
          state.blogDetail = { ...state.blogDetail, approved: newStatus };
        }

        // Update listBlog correctly
        state.listBlog = state.listBlog.map((blog) =>
          blog.id === blogId ? { ...blog, approved: newStatus } : blog
        );
      })
      .addCase(approveBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const updateBlog = action.payload;
        const index = state.listBlog.findIndex(
          (blog) => blog.id === updateBlog.id
        );
        if (index !== -1) {
          state.listBlog[index] = updateBlog;
        }
      });
  },
});

export default blogSlice;
