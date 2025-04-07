import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequest,
  postRequestFormData,
  postRequestParams,
} from "../../services/httpMethods";
import { message, notification } from "antd";
import { handleDangNhap } from "../../axios/axiosInterceptor";

// Define the async thunk for login
export const login = createAsyncThunk(
  "Account/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await postRequestParams("Account/login", {
        username,
        password,
      });

      console.log("Payload being sent:", { username, password });

      // Extract the token from the response
      const token = res.data.token;
      localStorage.setItem("token", token); // Store token for future requests

      // Decode the token manually
      const base64Url = token.split(".")[1]; // Get the payload part
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Convert to valid Base64
      const decodedPayload = JSON.parse(atob(base64)); // Decode Base64 and parse JSON

      const role = decodedPayload.role; // Extract role from payload

      localStorage.setItem("role", role); // Store role for access control

      return { ...res.data, role }; // Return user data along with role
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Invalid credentials"
        );
      }
      return rejectWithValue("Invalid credentials");
    }
  }
);

export const register = createAsyncThunk(
  "Account/register",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await postRequestFormData("Account/register", payload);
      if (response && response.status === 200) {
        message.success("You have successfully registered.");
      }
      return response.data;
    } catch (error) {
      message.error(
        error.response.data.message || "An error occurred during registration."
      );
      return rejectWithValue(error.response || error.response.data.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "Account/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await postRequestParams("Account/ForgotPassword", {
        email,
      });

      if (response && response.status === 200) {
        message.success(
          "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn."
        );
      }
      return response.data; // The response data (likely a string based on the schema)
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Đã xảy ra lỗi trong quá trình xử lý yêu cầu của bạn."
      );
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to process forgot password request"
      );
    }
  }
);

export const confirmResetPassCode = createAsyncThunk(
  "Account/confirmResetPassCode",
  async ({ email, code, newPass }, { rejectWithValue }) => {
    try {
      const response = await postRequestParams("Account/ConfirmResetPassCode", {
        email,
        code,
        newPass,
      });

      if (response && response.status === 200) {
        message.success("Cài đặt lại mật khẩu đã được xác nhận thành công.");
      }
      return response.data; // The response data (likely a string or object)
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Mã xác nhận không hợp lệ hoặc đã hết hạn."
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to confirm reset password code"
      );
    }
  }
);

// Add the changePassword thunk
export const changePassword = createAsyncThunk(
  "Account/changePassword",
  async ({ email, oldPass, newPass }, { rejectWithValue }) => {
    try {
      const response = await postRequestParams("Account/ChangePassword", {
        email,
        oldPass,
        newPass,
      });

      if (response && response.status === 200) {
        message.success("Đổi mật khẩu thành công!");
      }
      return response.data; // Return the response data (likely a success message or object)
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Đã xảy ra lỗi trong quá trình đổi mật khẩu."
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "Account/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await postRequest("Account/UpdateProfile", profileData);

      //message.success("Cập nhật hồ sơ thành công!");
      return response.data; // Return the updated user data or success message
    } catch (error) {
      message.error(
        error.message || "Đã xảy ra lỗi trong quá trình cập nhật hồ sơ."
      );
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

export const uploadImage = createAsyncThunk(
  "Account/test",
  async (payload, { rejectWithValue }) => {
    try {
      // Validate payload
      if (!(payload instanceof FormData)) {
        throw new Error("Payload must be a FormData object");
      }
      const response = await postRequestFormData("Account/test", payload);
      if (response && response.status === 200) {
        message.success("Hình ảnh đã được tải lên thành công.");
      }
      return response.data;
    } catch (error) {
      message.error(
        error.response.data.message ||
          "Đã xảy ra lỗi trong quá trình tải lên hình ảnh."
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Load user from storage
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    // logout(state) {
    //   state.token = null;
    //   notification.success({
    //     message: "Logged out successfully",
    //   });
    // },
    logout(state) {
      state.token = null;
      state.user = null;
      state.role = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      notification.success({
        message: "Đăng Xuất Thành Công!",
        placement: "top",
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fulfilled state
      // .addCase(login.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.token = action.payload;
      //   handleDangNhap(action.payload);
      // })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user || null; // Ensure user is set
        state.role = action.payload.role || null; // Ensure role is stored
        handleDangNhap(action.payload.token);

        // Store user details in localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("role", action.payload.role);
      })
      // Rejected state
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      // Fulfilled state
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      // Rejected state
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      // Add Forgot Password cases
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, you can store the response message if needed
        // For example, if the API returns a confirmation message
        state.error = null; // Clear any previous errors
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Forgot password request failed";
      })
      // Add Confirm Reset Password Code cases
      .addCase(confirmResetPassCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmResetPassCode.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Optionally, you can store the response data if needed
        // For example, if the API returns a token or additional data for the next step
      })
      .addCase(confirmResetPassCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to confirm reset password code";
      })
      // Add Change Password cases
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Optionally, you can update state if the API returns user data
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to change password";
      })
      // Add Update Profile cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update the user in the state with the new profile data
        state.user = { ...state.user, ...action.payload };
        // Update localStorage with the new user data
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update profile";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice;
