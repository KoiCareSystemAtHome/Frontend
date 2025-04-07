import React from "react";
import { Form, Input, Button } from "antd";
import { MailOutlined, KeyOutlined, SafetyOutlined } from "@ant-design/icons";
import LoginBackground from "../../assets/login-background.png"; // Adjust the path as necessary
import Logo from "../../assets/logo.png"; // Adjust the path as necessary
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { confirmResetPassCode } from "../../redux/slices/authSlice";

const ConfirmResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Handle form submission
  const onFinish = async (values) => {
    try {
      const { email, code, newPass } = values;
      // Dispatch the confirmResetPassCode thunk with email and code
      await dispatch(confirmResetPassCode({ email, code, newPass })).unwrap();

      // Assuming the API handles password reset in a subsequent step,
      // you might need to call another API here to set the new password.
      // For now, we'll assume success redirects to login.
      navigate("/"); // Redirect to login page after success
    } catch (err) {
      console.log("Confirm reset password error:", err);
      // Error message is already handled in the thunk via message.error
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
          <h2 className="text-2xl font-bold mb-8">XÁC NHẬN ĐẶT LẠI MẬT KHẨU</h2>
        </div>

        <Form
          name="confirm_reset_password_form"
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

          {/* Verification Code Field */}
          <Form.Item
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã xác nhận!" }]}
          >
            <div>
              <label className="block text-sm mb-1">
                <span className="text-red-500">*</span> Mã xác nhận
              </label>
              <Input
                prefix={<SafetyOutlined className="text-gray-400" />}
                placeholder="Mã xác nhận"
                className="h-10 w-full"
              />
            </div>
          </Form.Item>

          {/* New Password Field */}
          <Form.Item
            name="newPass"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <div>
              <label className="block text-sm mb-1">
                <span className="text-red-500">*</span> Mật khẩu mới
              </label>
              <Input.Password
                prefix={<KeyOutlined className="text-gray-400" />}
                placeholder="Mật khẩu mới"
                className="h-10 w-full"
              />
            </div>
          </Form.Item>

          {/* Confirm Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="h-10 w-full bg-orange-500 hover:bg-orange-600 border-orange-500 font-medium"
            >
              Xác nhận
            </Button>
          </Form.Item>

          {/* Additional Links */}
          <div className="flex justify-between text-sm mt-4">
            <a href="#" className="text-gray-600 hover:text-gray-800">
              Quay lại đăng nhập
            </a>
            <a href="#" className="text-orange-500 hover:text-orange-600">
              Gửi lại mã
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ConfirmResetPassword;
