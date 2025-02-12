import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import testSlice from "./slices/testSlice";
import membershipPackageSlice from "./slices/membershipPackageSlice";
import shopSlice from "./slices/shopSlice";
import productManagementSlice from "./slices/productManagementSlice";

const store = configureStore({
  reducer: {
    testSlice: testSlice.reducer,
    authSlice: authSlice.reducer,
    membershipPackageSlice: membershipPackageSlice.reducer,
    shopSlice: shopSlice.reducer,
    productManagementSlice: productManagementSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
