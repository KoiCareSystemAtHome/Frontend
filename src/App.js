import "./App.css";
import AdminLayout from "./Layout/AdminLayout/AdminLayout";
import { Route, Routes } from "react-router";
import LoginPage from "./pages/login/Login";
import RegisterPage from "./pages/register/register";
import ShopLayout from "./Layout/ShopLayout/ShopLayout";
import "antd/dist/reset.css"; // For Ant Design v5
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ConfirmResetPassword from "./pages/ForgotPassword/ConfirmResetPassword";
import OTP from "./pages/register/OTP";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/otp" element={<OTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/confirm-reset-password"
        element={<ConfirmResetPassword />}
      />
      <Route path="/admin/*" element={<AdminLayout />} />
      {/* <Route path="/admin/change-password" element={<ChangePassword />} /> */}
      <Route path="/shop/*" element={<ShopLayout />} />
      {/* <Route path="/shop/change-password" element={<ChangePassword />} /> */}
    </Routes>
  );
}

export default App;
