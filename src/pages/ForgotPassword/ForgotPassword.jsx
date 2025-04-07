import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { MailOutlined } from "@ant-design/icons";
import LoginBackground from "../../assets/login-background.png"; // Adjust the path as necessary
import Logo from "../../assets/logo.png"; // Adjust the path as necessary
import { forgotPassword } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const ForgotPassword = () => {
  const dispatch = useDispatch(); // Use useDispatch to dispatch actions
  const navigate = useNavigate(); // Use useNavigate to programmatically navigate

  // Handle form submission
  const onFinish = async (values) => {
    try {
      await dispatch(forgotPassword(values.email)).unwrap(); // Dispatch the forgotPassword action
      // The success message is already handled in the thunk via message.success
      // On success, redirect to ConfirmResetPassword
      navigate("/confirm-reset-password"); // Adjust the path as per your routing setup
    } catch (err) {
      // Error is already handled in the thunk via message.error, but you can add additional UI logic if needed
      console.log("Forgot password error:", err);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-teal-50">
      {/* Background with koi fish and flowers */}
      <div className="absolute inset-0 bg-teal-50 z-0">
        {/* This would be where your background image would go */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={LoginBackground}
            alt=""
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>

      {/* Logo in top left corner */}
      <div className="absolute top-0 left-0 z-10">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Koi Guardian Logo" className="h-30 w-40" />
        </div>
      </div>

      {/* Content box */}
      <div className="relative z-10 m-auto w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-4">
          <h3 className="text-orange-500 font-normal">KOI GUARDIAN</h3>
          <h2 className="text-2xl font-bold mb-8">QUÊN MẬT KHẨU</h2>
        </div>

        <Form
          name="forgot_password_form"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          {/* Email Field */}
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <div>
              <label className="block text-sm mb-1">
                <span className="text-red-500">*</span> Email
              </label>
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Email"
                className="h-10 w-full"
              />
            </div>
          </Form.Item>

          {/* Security Question Field - optional */}
          {/* <Form.Item name="security_question">
            <div>
              <label className="block text-sm mb-1">
                Câu hỏi bảo mật (tùy chọn)
              </label>
              <Input placeholder="Câu hỏi bảo mật" className="h-10 w-full" />
            </div>
          </Form.Item> */}

          {/* Reset Password Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-title"
              size="large"
              style={{ backgroundColor: "orange" }}
            >
              Đặt lại mật khẩu
            </Button>
          </Form.Item>

          {/* Additional Links */}
          <div className="flex justify-between text-sm mt-4">
            <a href="/" className="text-gray-600 hover:text-gray-800">
              Quay lại đăng nhập
            </a>
            <a
              href="/register"
              className="text-orange-500 hover:text-orange-600"
            >
              Đăng ký
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
