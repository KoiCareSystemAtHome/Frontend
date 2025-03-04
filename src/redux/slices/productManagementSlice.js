import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequestParams,
  putRequest,
} from "../../services/httpMethods";

const initialState = {
  token: "",
  listProduct: [],
};

// GET
export const getListProductManagement = createAsyncThunk(
  "Product",
  async () => {
    try {
      const res = await getRequest("Product");
      console.log("res", res);
      return res.data;
    } catch (error) {
      console.log("Error", error);
    }
  }
);

// POST
// export const createProductManagement = createAsyncThunk(
//   "Product/create-product",
//   async (newProduct, { rejectWithValue }) => {
//     try {
//       const res = await postRequestParams("Product/create-product", newProduct);
//       console.log("res", res);
//       if (res.data.status === 400) {
//         return rejectWithValue(res.data.detail);
//       }
//       return res.data;
//     } catch (error) {
//       console.log(error.detail);
//     }
//   }
// );

export const createProductManagement = createAsyncThunk(
  "Product/create-product",
  async (newProduct, { rejectWithValue }) => {
    try {
      // 🔍 Check if ParameterImpacts is a string, then parse it
      if (typeof newProduct.ParameterImpacts === "string") {
        newProduct.ParameterImpacts = JSON.parse(newProduct.ParameterImpacts);
      }

      console.log("✅ Final Payload:", JSON.stringify(newProduct, null, 2));

      const res = await postRequestParams("Product/create-product", newProduct);
      console.log("🔄 API Response:", res);

      if (res.data.status === 400) {
        return rejectWithValue(res.data.detail);
      }

      return res.data;
    } catch (error) {
      console.log("❌ API Error:", error);
    }
  }
);

// UPDATE
// export const updateProductManagement = createAsyncThunk(
//   "Product/update",
//   async ({ updatedProduct }, { rejectWithValue }) => {
//     try {
//       const res = await putRequest(`Product/update-product`, updatedProduct);

//       // Ensure response and data exist
//       if (!res || !res.data) {
//         throw new Error("Invalid API response");
//       }

//       return res.data;
//     } catch (error) {
//       console.error("Update failed:", error);

//       // Handle different error types
//       if (error.response) {
//         console.error("Error response:", error.response.data);
//         return rejectWithValue(error.response.data);
//       } else if (error.request) {
//         console.error("No response received:", error.request);
//         return rejectWithValue(error.request);
//       } else {
//         console.error("Error setting up request:", error.message);
//         return rejectWithValue(error.message);
//       }
//     }
//   }
// );

export const updateProductManagement = createAsyncThunk(
  "Product/update",
  async ({ updatedProduct }, { rejectWithValue }) => {
    try {
      if (!updatedProduct || !updatedProduct.productId) {
        console.error("❌ Missing Product ID in request body!", updatedProduct);
        return rejectWithValue("Product ID is required.");
      }

      console.log("📢 Updating Product with ID:", updatedProduct.productId);

      // Ensure parameterImpacts is an object
      let formattedProduct = {
        ...updatedProduct,
        parameterImpacts:
          typeof updatedProduct.parameterImpacts === "string"
            ? JSON.parse(updatedProduct.parameterImpacts)
            : updatedProduct.parameterImpacts, // Keep it as is if it's already an object
      };

      console.log(
        "Updated Parameter Impacts:",
        updatedProduct.parameterImpacts
      );

      console.log("🚀 Final API Payload:", formattedProduct);

      const res = await putRequest("Product/update-product", formattedProduct);

      if (!res || !res.data) {
        throw new Error("Invalid API response");
      }

      return res.data;
    } catch (error) {
      console.error("❌ Update failed:", error);

      if (error.response) {
        console.error("⚠️ Error response:", error.response.data);
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        console.error("⚠️ No response received:", error.request);
        return rejectWithValue(error.request);
      } else {
        console.error("⚠️ Error setting up request:", error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

const productManagementSlice = createSlice({
  name: "productManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListProductManagement.fulfilled, (state, action) => {
        state.listProduct = action.payload;
      })
      .addCase(createProductManagement.fulfilled, (state, action) => {
        state.listProduct.push(action.payload);
      })
      .addCase(updateProductManagement.fulfilled, (state, action) => {
        const updateProductManagement = action.payload;
        const index = state.listProduct.findIndex(
          (product) => product.id === updateProductManagement.id
        );
        if (index !== -1) {
          state.listProduct[index] = updateProductManagement;
        }
      });
  },
});

export default productManagementSlice;
