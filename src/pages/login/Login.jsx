import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import LoginBackground from "../../assets/login-background.png";
import Logo from "../../assets/logo.png";
import { login } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message) => {
    api[type]({
      message: message,
      placement: "top",
      duration: 5,
    });
  };

  const onFinish = async (values) => {
    try {
      console.log("Form submitted:", values);

      // Dispatch the login action
      const response = await dispatch(login(values)).unwrap();

      if (response && response.token) {
        const role = response.role; // Extracted role from token

        // Check if role is allowed
        if (role === "Member") {
          openNotification(
            "error",
            "Chỉ Có Shop hoặc Admin Mới Có Thể Đăng Nhập!"
          );
          return; // Stop execution to prevent further actions
        }

        // 🔹 Reset Menu Selection
        localStorage.setItem("selectedAdminMenuKey", "/admin/dashboard");
        localStorage.setItem("headerTitle", "Dashboard");

        // Store the token and role for later use
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", role);

        console.log("User role:", role);

        // Show success notification
        openNotification("success", "Đăng nhập thành công!");

        // Delay navigation slightly to show the notification
        setTimeout(() => {
          if (role === "Admin") {
            navigate("/admin/dashboard"); // Navigate to Admin Dashboard
          } else if (role === "Shop") {
            navigate("/shop/dashboard"); // Default route
          } else {
            navigate("/");
          }
        }, 1000); // 1-second delay for better UX
      }
    } catch (error) {
      console.error("Login failed:", error);

      // Show error notification
      openNotification("error", "Email Hoặc Mật Khẩu Không Chính Xác!");
    }
  };

  return (
    <div className="min-h-screen bg-cyan-50 flex items-center justify-center p-4 font-title">
      {/* Decorative Background */}
      {contextHolder}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={LoginBackground}
          alt=""
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Top Left Logo */}
      <div className="absolute top-0 left-0 z-10">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Koi Guardian Logo" className="h-30 w-40" />
        </div>
      </div>

      {/* Left side - decorative image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src=""
          alt="Decorative koi and flowers"
          className="w-full h-auto"
        />
      </div>

      {/* Right side - login form */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm relative z-10">
        {/* Welcome text */}
        <div className="mb-8">
          <p className="text-gray-600">
            <span className="text-orange-500">KOI GUARDIAN</span>
          </p>
          <h1 className="text-2xl font-bold text-gray-900">ĐĂNG NHẬP</h1>
        </div>

        <Form
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4 font-title"
        >
          {/* Email field */}
          <Form.Item
            label="Email"
            name="username"
            className="mb-4"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không khả dụng!" },
            ]}
          >
            <Input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="Email"
              value={username} // Bind to state
              onChange={(e) => setUsername(e.target.value)} // Update state on input change
            />
          </Form.Item>

          {/* Password field */}
          <Form.Item
            label="Mật khẩu"
            name="password"
            className="mb-4"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="Mật khẩu"
              value={password} // Bind to state
              onChange={(e) => setPassword(e.target.value)} // Update state on input change
            />
          </Form.Item>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <Form.Item
              name="remember"
              valuePropName="checked"
              initialValue={false}
              className="mb-0"
            ></Form.Item>
            <a
              href="/forgot-password"
              className="text-sm text-orange-500 hover:text-orange-600"
            >
              Quên mật khẩu?
            </a>
          </div>

          {/* Sign In Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              size="large"
              style={{ backgroundColor: "orange" }}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          {/* Sign up link */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Không có tài khoản? </span>
            <a
              href="/register"
              className="text-orange-500 hover:text-orange-600"
            >
              Đăng kí
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
