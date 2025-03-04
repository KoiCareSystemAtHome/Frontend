import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequest } from "../../services/httpMethods";

const initialState = {
  token: "",
  listMember: [],
};

// GET
export const getListMember = createAsyncThunk("Account/member", async () => {
  try {
    const res = await postRequest("Account/member");
    console.log("res", res);
    return res.data;
  } catch (error) {
    console.log("Error", error);
  }
});

// POST
// export const createPackage = createAsyncThunk(
//   "Package/create-package",
//   async (newPackage, { rejectWithValue }) => {
//     try {
//       const res = await postRequest("Package/create-package", newPackage);
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

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListMember.fulfilled, (state, action) => {
      state.listMember = Array.isArray(action.payload) ? action.payload : [];
    });
    //   .addCase(createPackage.fulfilled, (state, action) => {
    //     state.listMembership.push(action.payload);
    //   });
  },
});

export default memberSlice;
