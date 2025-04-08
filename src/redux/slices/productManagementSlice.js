import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getRequest,
  getRequestParams,
  postRequest,
  putRequest,
} from "../../services/httpMethods";

const initialState = {
  token: "",
  listProduct: [],
  listFood: [], // Add state for food
  listMedicine: [], // Add state for medicine
  productsById: {}, // Store products as a map: { [productId]: product }
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

// GET PRODUCT BY ID
export const getProductById = createAsyncThunk(
  "Product/getById",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await getRequestParams(`Product/${productId}`);
      console.log("🔍 Product by ID Response:", res);
      return { productId, product: res.data }; // Return both productId and product data
    } catch (error) {
      console.log("❌ Get Product by ID Error:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch product");
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
export const createProduct = createAsyncThunk(
  "Product/create-product",
  async (newProduct, { rejectWithValue }) => {
    try {
      // 🔍 Check if ParameterImpacts is a string, then parse it
      if (typeof newProduct.parameterImpacts === "string") {
        newProduct.parameterImpacts = JSON.parse(newProduct.parameterImpacts);
      }

      console.log("✅ Final Payload:", JSON.stringify(newProduct, null, 2));

      const res = await postRequest("Product/create-product", newProduct);
      console.log("🔄 API Response:", res);

      if (res.status === 400 || (res.data && res.data.status === 400)) {
        return rejectWithValue(res.data.detail);
      }

      return res.data;
    } catch (error) {
      console.log("❌ API Error:", error);
      return rejectWithValue(error.message || "Failed to create product");
    }
  }
);

// POST FOOD
export const createFood = createAsyncThunk(
  "Product/create-food",
  async (newFood, { rejectWithValue }) => {
    try {
      // 🔍 Check if ParameterImpacts is a string, then parse it
      if (typeof newFood.parameterImpacts === "string") {
        newFood.parameterImpacts = JSON.parse(newFood.parameterImpacts);
      }

      console.log("✅ Final Payload:", JSON.stringify(newFood, null, 2));

      const res = await postRequest("Product/create-productfood", newFood);
      console.log("🔄 API Response:", res);

      if (res.status === 400 || (res.data && res.data.status === 400)) {
        return rejectWithValue(res.data.detail);
      }
      return res.data;
    } catch (error) {
      console.log("❌ API Error:", error);
      return rejectWithValue(error.message || "Failed to create food");
    }
  }
);

// POST MEDICINE
export const createMedicine = createAsyncThunk(
  "Product/create-medicine",
  async (newMedicine, { rejectWithValue }) => {
    try {
      // 🔍 Check if ParameterImpacts is a string, then parse it
      if (typeof newMedicine.parameterImpacts === "string") {
        newMedicine.parameterImpacts = JSON.parse(newMedicine.parameterImpacts);
      }

      console.log("✅ Final Payload:", JSON.stringify(newMedicine, null, 2));

      const res = await postRequest("Product/create-medicine", newMedicine);
      console.log("🔄 API Response:", res);

      if (res.status === 400 || (res.data && res.data.status === 400)) {
        return rejectWithValue(res.data.detail);
      }
      return res.data;
    } catch (error) {
      console.log("❌ API Error:", error);
      return rejectWithValue(error.message || "Failed to create medicine");
    }
  }
);

// UPDATE
export const updateProductManagement = createAsyncThunk(
  "Product/update",
  async ({ updatedProduct }, { rejectWithValue }) => {
    try {
      if (!updatedProduct || !updatedProduct.productId) {
        return rejectWithValue("Product ID is required.");
      }

      const res = await putRequest("Product/update-product", updatedProduct);

      if (!res || !res.data) {
        throw new Error("Invalid API response");
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// UPDATE FOOD
export const updateFoodManagement = createAsyncThunk(
  "Food/update",
  async ({ updatedFood }, { rejectWithValue }) => {
    try {
      if (!updatedFood || !updatedFood.productId) {
        return rejectWithValue("Product ID is required.");
      }

      const res = await putRequest("Product/update-food", updatedFood);

      if (!res || !res.data) {
        throw new Error("Invalid API response");
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// UPDATE MEDICINE
export const updateMedicineManagement = createAsyncThunk(
  "Medicine/update",
  async ({ updatedMedicine }, { rejectWithValue }) => {
    try {
      if (!updatedMedicine || !updatedMedicine.productId) {
        return rejectWithValue("Product ID is required.");
      }

      const res = await putRequest("Product/update-medicine", updatedMedicine);

      if (!res || !res.data) {
        throw new Error("Invalid API response");
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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
      // Add the new case for getProductById
      .addCase(getProductById.fulfilled, (state, action) => {
        const { productId, product } = action.payload;
        state.productsById[productId] = product; // Store product in map
      })
      // Search
      .addCase(searchProductManagement.fulfilled, (state, action) => {
        state.listProduct = action.payload;
      })
      // Create
      .addCase(createProduct.fulfilled, (state, action) => {
        state.listProduct.push(action.payload);
      })
      .addCase(createFood.fulfilled, (state, action) => {
        state.listFood.push(action.payload);
      })
      .addCase(createMedicine.fulfilled, (state, action) => {
        state.listMedicine.push(action.payload);
      })
      // Update
      .addCase(updateProductManagement.fulfilled, (state, action) => {
        const updateProduct = action.payload;
        const index = state.listProduct.findIndex(
          (product) => product.id === updateProduct.id
        );
        if (index !== -1) {
          state.listProduct[index] = updateProduct;
        }
      })
      .addCase(updateFoodManagement.fulfilled, (state, action) => {
        const updatedFood = action.payload;
        const index = state.listFood.findIndex(
          (food) => food.id === updatedFood.id
        );
        if (index !== -1) {
          state.listFood[index] = updatedFood;
        }
      })
      .addCase(updateMedicineManagement.fulfilled, (state, action) => {
        const updatedMedicine = action.payload;
        const index = state.listMedicine.findIndex(
          (medicine) => medicine.id === updatedMedicine.id
        );
        if (index !== -1) {
          state.listMedicine[index] = updatedMedicine;
        }
      });
  },
});

export default productManagementSlice;
