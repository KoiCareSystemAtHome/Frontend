import React, { useState, useRef, useEffect } from "react";
import { Form, Input, Button } from "antd";
import LoginBackground from "../../assets/login-background.png";
import Logo from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { activateAccount, resendCode } from "../../redux/slices/authSlice";

const OTP = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.authSlice?.loading);
  const [form] = Form.useForm(); // Create a form instance

  // Custom OTP Input Component
  const OTPInput = ({ value, onChange }) => {
    const [otp, setOtp] = useState(new Array(6).fill("")); // State for 6 digits
    const inputRefs = useRef([]); // Refs for focusing inputs

    // Sync internal state with Form value
    useEffect(() => {
      if (value) {
        const digits = value.split("");
        setOtp(digits.concat(new Array(6 - digits.length).fill("")));
      }
    }, [value]);

    const handleChange = (e, index) => {
      const newValue = e.target.value;
      if (/^[0-9]?$/.test(newValue)) {
        // Only allow single digit
        const newOtp = [...otp];
        newOtp[index] = newValue;
        setOtp(newOtp);

        // Trigger onChange to update Form
        onChange(newOtp.join(""));

        // Focus the next input if a digit is entered
        if (newValue && index < 5) {
          inputRefs.current[index + 1].focus();
        }
      }
    };

    const handleKeyDown = (e, index) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        // Move to previous input on backspace if current input is empty
        inputRefs.current[index - 1].focus();
      }
    };

    const handlePaste = (e) => {
      const pastedData = e.clipboardData.getData("text").trim();
      if (/^\d{6}$/.test(pastedData)) {
        // Only accept 6 digits
        const newOtp = pastedData.split("");
        setOtp(newOtp);
        onChange(newOtp.join(""));
        inputRefs.current[5].focus(); // Focus the last input
      }
      e.preventDefault();
    };

    return (
      <div className="flex space-x-2 justify-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined} // Only allow paste in the first input
            maxLength={1}
            className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
          />
        ))}
      </div>
    );
  };

  const onFinish = (values) => {
    console.log("Form submitted:", values);
    dispatch(activateAccount({ email: values.Email, code: values.OtpCode }));
  };

  const handleResendCode = async () => {
    try {
      const values = await form.validateFields(["Email"]); // Validate and get email field
      dispatch(resendCode(values.Email)); // Dispatch resendCode with email
    } catch (error) {
      console.error("Validation failed:", error);
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

      {/* Right side - OTP verification form */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm relative z-10">
        {/* Welcome text */}
        <div className="mb-8">
          <p className="text-gray-600">
            <span className="text-orange-500">KOI GUARDIAN</span>
          </p>
          <h1 className="text-2xl font-bold text-gray-900">XÁC THỰC OTP</h1>
          <p className="text-gray-600 mt-2">
            Vui lòng nhập mã xác thực đã được gửi đến email của bạn
          </p>
        </div>

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
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

          {/* OTP Code field */}
          <Form.Item
            label="Mã Xác Thực"
            name="OtpCode"
            className="mb-4"
            rules={[
              { required: true, message: "Vui lòng nhập mã xác thực!" },
              {
                pattern: /^\d{6}$/,
                message: "Mã xác thực phải gồm 6 chữ số!",
              },
            ]}
          >
            <OTPInput />
          </Form.Item>

          {/* Verify Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              size="large"
              style={{ backgroundColor: "orange" }}
              loading={loading}
            >
              Xác Thực
            </Button>
          </Form.Item>

          {/* Resend code */}
          <div className="text-center mt-6 font-title">
            <span className="text-gray-600">Chưa nhận được mã? </span>
            <a
              onClick={handleResendCode}
              className="text-orange-500 hover:text-orange-600 cursor-pointer"
            >
              Gửi Lại Mã
            </a>
          </div>

          {/* Back to login */}
          <div className="text-center mt-2 font-title">
            <a href="/" className="text-orange-500 hover:text-orange-600">
              Quay Lại Đăng Nhập
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default OTP;
