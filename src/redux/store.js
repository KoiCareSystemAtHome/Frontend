import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import testSlice from "./slices/testSlice";
import membershipPackageSlice from "./slices/membershipPackageSlice";
import shopSlice from "./slices/shopSlice";
import productManagementSlice from "./slices/productManagementSlice";
import diseasesSlice from "./slices/diseasesSlice";
import parameterSlice from "./slices/parameterSlice";
import memberSlice from "./slices/memberSlice";
import blogSlice from "./slices/blogSlice";
import ghnSlice from "./slices/ghnSlice";
import orderSlice from "./slices/orderSlice";
import reportSlice from "./slices/reportSlice";
import categorySlice from "./slices/categorySlice";
import transactionSlice from "./slices/transactionSlice";

const store = configureStore({
  reducer: {
    testSlice: testSlice.reducer,
    authSlice: authSlice.reducer,
    membershipPackageSlice: membershipPackageSlice.reducer,
    memberSlice: memberSlice.reducer,
    shopSlice: shopSlice.reducer,
    ghnSlice: ghnSlice.reducer,
    productManagementSlice: productManagementSlice.reducer,
    diseasesSlice: diseasesSlice.reducer,
    parameterSlice: parameterSlice.reducer,
    blogSlice: blogSlice.reducer,
    orderSlice: orderSlice.reducer,
    reportSlice: reportSlice.reducer,
    categorySlice: categorySlice.reducer,
    transactionSlice: transactionSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
