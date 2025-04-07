import React from "react";
import { Form, Input, Button } from "antd";
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../redux/slices/authSlice";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.authSlice);

  const onFinish = async (values) => {
    const { email, oldPass, newPass } = values;

    // Dispatch the changePassword thunk with email, oldPass, and newPass
    const result = await dispatch(
      changePassword({
        email: email || user?.email, // Use form email if provided, otherwise fallback to Redux store
        oldPass: oldPass,
        newPass: newPass,
      })
    );

    // Check if the request was successful
    if (changePassword.fulfilled.match(result)) {
      // Navigate back to the dashboard after success
      navigate(
        window.location.pathname.includes("/admin")
          ? "/admin/dashboard"
          : "/shop/dashboard"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Đổi Mật Khẩu</h2>
          <p className="text-gray-500 mt-2">
            Cập nhật mật khẩu của bạn để bảo mật tài khoản
          </p>
        </div>

        {/* Form Section */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            email: user?.email || "", // Pre-fill email from Redux store if available
          }}
        >
          {/* Email Field */}
          <Form.Item
            label={<span className="font-medium text-gray-700">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Nhập email của bạn"
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
              readOnly={!!user?.email} // Make read-only if email is available in Redux
            />
          </Form.Item>

          {/* Current Password Field */}
          <Form.Item
            label={
              <span className="font-medium text-gray-700">
                Mật khẩu hiện tại
              </span>
            }
            name="oldPass"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu hiện tại"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
          </Form.Item>

          {/* New Password Field */}
          <Form.Item
            label={
              <span className="font-medium text-gray-700">Mật khẩu mới</span>
            }
            name="newPass"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu mới phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu mới"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
          </Form.Item>

          {/* Confirm New Password Field */}
          {/* <Form.Item
            label={
              <span className="font-medium text-gray-700">
                Xác nhận mật khẩu mới
              </span>
            }
            name="newPass"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Xác nhận mật khẩu mới"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
          </Form.Item> */}

          {/* Display error message if the API request fails */}
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Đổi Mật Khẩu
            </Button>
          </Form.Item>
        </Form>

        {/* Back to Dashboard Link */}
        <div className="text-center mt-6">
          <a
            href={
              window.location.pathname.includes("/admin")
                ? "/admin/dashboard"
                : "/shop/dashboard"
            }
            className="text-blue-600 hover:underline"
          >
            Quay lại Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
