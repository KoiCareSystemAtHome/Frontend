import React from "react";
import { Form, Input, Button } from "antd";
import LoginBackground from "../../assets/login-background.png";
import Logo from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/slices/authSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.authSlice?.loading);
  const onFinish = (values) => {
    console.log("Form submitted:", values);
    dispatch(register(values));
  };

  return (
    <div className="min-h-screen bg-cyan-50 flex items-center justify-center p-4 font-title">
      {/* Decorative Background */}
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
          <h1 className="text-2xl font-bold text-gray-900">ĐĂNG KÍ</h1>
        </div>

        <Form onFinish={onFinish} layout="vertical" className="space-y-4">
          {/* Email field */}
          <Form.Item
            label="Enter your email address"
            name="email"
            className="mb-4"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Invalid email address!" },
            ]}
          >
            <Input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="Email address"
            />
          </Form.Item>

          {/* User Name field */}
          <Form.Item
            label="Enter your User Name"
            name="username"
            className="mb-4"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="User Name"
            ></Input>
          </Form.Item>

          {/* Phone Number field */}
          <Form.Item
            label="Enter your Phone Number"
            name="phone"
            className="mb-4"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="Phone Number"
            ></Input>
          </Form.Item>

          {/* Password field */}
          <Form.Item
            label="Enter your Password"
            name="password"
            className="mb-4"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must include at least 8 characters, one uppercase, one lowercase, one number, and one special character.",
              },
            ]}
          >
            <Input.Password
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="Password"
            />
          </Form.Item>

          {/* Confirm your password */}
          <Form.Item
            label="Confirm your Password"
            name="confirm"
            className="mb-4"
            dependencies={["password"]} // Ensures it re-validates when password changes
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Password does not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="Confirm Password"
            />
          </Form.Item>

          {/* Sign In Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              size="large"
              style={{ backgroundColor: "orange" }}
              loading={loading}
            >
              Đăng Kí
            </Button>
          </Form.Item>

          {/* Sign up link */}
          <div className="text-center mt-6 font-title">
            <span className="text-gray-600">Đã có tài khoản? </span>
            <a href="/" className="text-orange-500 hover:text-orange-600">
              Đăng nhập
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
