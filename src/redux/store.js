import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import testSlice from "./slices/testSlice";
import membershipPackageSlice from "./slices/membershipPackageSlice";

const store = configureStore({
  reducer: {
    testSlice: testSlice.reducer,
    authSlice: authSlice.reducer,
    membershipPackageSlice: membershipPackageSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
