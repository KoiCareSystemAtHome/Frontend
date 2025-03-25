import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequest,
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

// SEARCH
export const searchProductManagement = createAsyncThunk(
  "Product/search",
  async (queryParams, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const res = await getRequest(`Product/search?${queryString}`);
      console.log("🔍 Search Response:", res);
      return res.data;
    } catch (error) {
      console.log("❌ Search API Error:", error);
      return rejectWithValue(error.response?.data || "Search failed");
    }
  }
);

// POST
export const createProductManagement = createAsyncThunk(
  "Product/create-product",
  async (newProduct, { rejectWithValue }) => {
    try {
      // 🔍 Check if ParameterImpacts is a string, then parse it
      if (typeof newProduct.ParameterImpacts === "string") {
        newProduct.ParameterImpacts = JSON.parse(newProduct.ParameterImpacts);
      }

      console.log("✅ Final Payload:", JSON.stringify(newProduct, null, 2));

      const res = await postRequest("Product/create-product", newProduct);
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
export const updateProductManagement = createAsyncThunk(
  "Product/update",
  async ({ updatedProduct }, { rejectWithValue }) => {
    try {
      console.log("📢 Updating Product with ID:", updatedProduct.productId);

      if (!updatedProduct || !updatedProduct.productId) {
        console.error("❌ Missing Product ID in request body!", updatedProduct);
        return rejectWithValue("Product ID is required.");
      }

      // Extract image separately
      const { image, ...queryParams } = updatedProduct;

      // Convert query parameters to a URL-encoded string
      const queryString = new URLSearchParams(queryParams).toString();

      let formData = new FormData();

      if (image) {
        if (image instanceof File) {
          formData.append("image", image); // ✅ Append new image file
        } else if (typeof image === "string" && image.startsWith("http")) {
          formData.append("imageUrl", image); // ✅ Send old image URL if no new file is selected
        }
      } else {
        console.warn(
          "⚠️ No new image provided, backend should retain the old image."
        );
      }

      console.log("🚀 Final FormData Payload:", [...formData.entries()]);
      console.log("🔗 Query String:", queryString);

      const res = await putRequest(
        `Product/update-product?${queryString}`, // Send non-image fields as query parameters
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

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
      .addCase(searchProductManagement.fulfilled, (state, action) => {
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

// CREATE
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

// export const updateProductManagement = createAsyncThunk(
//   "Product/update",
//   async ({ updatedProduct }, { rejectWithValue }) => {
//     try {
//       if (!updatedProduct || !updatedProduct.productId) {
//         console.error("❌ Missing Product ID in request body!", updatedProduct);
//         return rejectWithValue("Product ID is required.");
//       }

//       console.log("📢 Updating Product with ID:", updatedProduct.productId);

//       // Ensure parameterImpacts is an object
//       let formattedProduct = {
//         ...updatedProduct,
//         parameterImpacts:
//           typeof updatedProduct.parameterImpacts === "string"
//             ? JSON.parse(updatedProduct.parameterImpacts)
//             : updatedProduct.parameterImpacts, // Keep it as is if it's already an object
//       };

//       console.log(
//         "Updated Parameter Impacts:",
//         updatedProduct.parameterImpacts
//       );

//       console.log("🚀 Final API Payload:", formattedProduct);

//       const res = await putRequest("Product/update-product", formattedProduct);

//       if (!res || !res.data) {
//         throw new Error("Invalid API response");
//       }

//       return res.data;
//     } catch (error) {
//       console.error("❌ Update failed:", error);

//       if (error.response) {
//         console.error("⚠️ Error response:", error.response.data);
//         return rejectWithValue(error.response.data);
//       } else if (error.request) {
//         console.error("⚠️ No response received:", error.request);
//         return rejectWithValue(error.request);
//       } else {
//         console.error("⚠️ Error setting up request:", error.message);
//         return rejectWithValue(error.message);
//       }
//     }
//   }
// );

// export const updateProductManagement = createAsyncThunk(
//   "Product/update",
//   async ({ updatedProduct }, { rejectWithValue }) => {
//     try {
//       if (!updatedProduct || !updatedProduct.productId) {
//         console.error("❌ Missing Product ID in request body!", updatedProduct);
//         return rejectWithValue("Product ID is required.");
//       }

//       console.log("📢 Updating Product with ID:", updatedProduct.productId);

//       // Ensure parameterImpacts is an object
//       let formattedProduct = {
//         ...updatedProduct,
//         parameterImpacts:
//           typeof updatedProduct.parameterImpacts === "string"
//             ? JSON.parse(updatedProduct.parameterImpacts)
//             : updatedProduct.parameterImpacts, // Keep as-is if already an object
//       };

//       console.log(
//         "Updated Parameter Impacts:",
//         formattedProduct.parameterImpacts
//       );

//       // Convert object to query parameters
//       const queryString = new URLSearchParams({
//         productId: updatedProduct.productId,
//         productName: updatedProduct.productName,
//         description: updatedProduct.description,
//         price: updatedProduct.price,
//         stockQuantity: updatedProduct.stockQuantity,
//         categoryId: updatedProduct.categoryId,
//         brand: updatedProduct.brand,
//         manufactureDate: updatedProduct.manufactureDate,
//         expiryDate: updatedProduct.expiryDate,
//       }).toString();

//       console.log("🚀 Final Query String:", queryString);

//       let formData = new FormData();

//       // Convert JSON data to formData except image
//       Object.keys(queryString).forEach((key) => {
//         formData.append(key, queryString[key]);
//       });

//       // Only append the image if it's a file
//       if (updatedProduct.image instanceof File) {
//         formData.append("image", updatedProduct.image);
//       }

//       console.log("🚀 Final FormData Payload (With Image):", formData);

//       // Send PUT request using query parameters
//       //const res = await putRequest(`Product/update-product?${queryString}`);
//       const res = await putRequest(
//         `Product/update-product?${queryString}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       if (!res || !res.data) {
//         throw new Error("Invalid API response");
//       }

//       return res.data;
//     } catch (error) {
//       console.error("❌ Update failed:", error);

//       if (error.response) {
//         console.error("⚠️ Error response:", error.response.data);
//         return rejectWithValue(error.response.data);
//       } else if (error.request) {
//         console.error("⚠️ No response received:", error.request);
//         return rejectWithValue(error.request);
//       } else {
//         console.error("⚠️ Error setting up request:", error.message);
//         return rejectWithValue(error.message);
//       }
//     }
//   }
// );
