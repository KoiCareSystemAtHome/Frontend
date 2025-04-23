import React from "react";
import { Form, Input, Button, Select } from "antd";
import LoginBackground from "../../assets/login-background.png";
import Logo from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/slices/authSlice";
import { Option } from "antd/es/mentions";
import { useNavigate } from "react-router";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.authSlice?.loading);
  const navigate = useNavigate(); // Initialize useNavigate
  const onFinish = async (values) => {
    console.log("Form submitted:", values);
    try {
      // Dispatch the register action and wait for the result
      await dispatch(register(values)).unwrap();
      // If registration is successful, redirect to OTP page with email in state
      navigate("/otp", { state: { email: values.Email } });
    } catch (error) {
      // Error is already handled in the authSlice (via message.error)
      console.error("Registration failed:", error);
    }
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
            label="Email"
            name="Email"
            className="mb-4"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không khả dụng!" },
            ]}
          >
            <Input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="Email"
            />
          </Form.Item>

          {/* User Name field */}
          <Form.Item
            label="Tên Người Dùng"
            name="UserName"
            className="mb-4"
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng!" },
            ]}
          >
            <Input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="Tên Người Dùng"
            ></Input>
          </Form.Item>

          {/* Phone Number field */}
          <Form.Item
            label="Họ Tên"
            name="Name"
            className="mb-4"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="Họ Tên"
            ></Input>
          </Form.Item>

          {/* Password field */}
          <Form.Item
            label="Mật Khẩu"
            name="Password"
            className="mb-4"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Mật khẩu phải bao gồm ít nhất 8 ký tự, một chữ hoa, một chữ thường, một số và một ký tự đặc biệt!",
              },
            ]}
          >
            <Input.Password
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="Mật Khẩu"
            />
          </Form.Item>

          {/* Confirm your password */}
          <Form.Item
            label="Xác Nhận Mật Khẩu"
            name="ConfirmPassword"
            className="mb-4"
            dependencies={["password"]} // Ensures it re-validates when password changes
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("Password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="Xác Nhận Mật Khẩu"
            />
          </Form.Item>

          {/* Role and Gender in one row */}
          <div className="flex space-x-4">
            <Form.Item
              label="Vai Trò"
              name="Role"
              className="mb-4 flex-1"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            >
              <Select placeholder="Vai Trò" allowClear>
                <Option value="Admin">Quản Trị Viên</Option>
                <Option value="Shop">Cửa Hàng</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Giới Tính"
              name="Gender"
              className="mb-4 flex-1"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select placeholder="Giới Tính" allowClear>
                <Option value="Male">Nam</Option>
                <Option value="Female">Nữ</Option>
              </Select>
            </Form.Item>
          </div>

          {/* Address field */}
          <Form.Item
            label="Địa Chỉ"
            name="Address"
            className="mb-4"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="Địa Chỉ"
            ></Input>
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
