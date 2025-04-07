import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Row,
  Col,
  Card,
  DatePicker,
  Upload,
  Image,
} from "antd";
import { updateProfile, uploadImage } from "../../redux/slices/authSlice";
import LocationSelector from "../ShopProfile/LocationSelector";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const user = useSelector((state) => state.authSlice.user);
  const loading = useSelector((state) => state.authSlice.loading);
  const { provinces, districts, wards } = useSelector(
    (state) => state.ghnSlice
  );

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [locationNames, setLocationNames] = useState({
    provinceName: "",
    districtName: "",
    wardName: "",
  });
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const [bizLicenseUrl, setBizLicenseUrl] = useState(user?.bizLicense || "");
  const [avatarFileList, setAvatarFileList] = useState([]);
  const [bizLicenseFileList, setBizLicenseFileList] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [bizLicensePreview, setBizLicensePreview] = useState("");

  // Initial setup for user data
  useEffect(() => {
    if (user) {
      setSelectedProvince(user.address?.provinceId || null);
      setSelectedDistrict(user.address?.districtId || null);
      setSelectedWard(user.address?.wardId || null);

      setLocationNames({
        provinceName: user.address?.provinceName || "",
        districtName: user.address?.districtName || "",
        wardName: user.address?.wardName || "",
      });

      setAvatarUrl(user.avatar || "");
      setAvatarPreview(user.avatar || "");
      setBizLicenseUrl(user.bizLicense || "");
      setBizLicensePreview(user.bizLicense || "");

      form.setFieldsValue({
        email: user.email || "",
        name: user.name || "",
        gender: user.gender || "",
        userReminder: user.userReminder ? dayjs(user.userReminder) : null,
        shopDescription: user.shopDescription || "",
      });
    }
  }, [user, form]);

  // Sync avatarPreview with user.avatar whenever user.avatar changes
  useEffect(() => {
    if (user?.avatar && user.avatar !== avatarPreview) {
      setAvatarPreview(user.avatar);
    }
  }, [user?.avatar]); // Dependency on user.avatar

  const handleLocationChange = (type, value) => {
    if (type === "province") {
      setSelectedProvince(value);
      setSelectedDistrict(null);
      setSelectedWard(null);
      const province = provinces.find((p) => p.ProvinceID === value);
      setLocationNames((prev) => ({
        ...prev,
        provinceName: province ? province.ProvinceName : "",
        districtName: "",
        wardName: "",
      }));
    } else if (type === "district") {
      setSelectedDistrict(value);
      setSelectedWard(null);
      const district = districts.find((d) => d.DistrictID === value);
      setLocationNames((prev) => ({
        ...prev,
        districtName: district ? district.DistrictName : "",
        wardName: "",
      }));
    } else if (type === "ward") {
      setSelectedWard(value);
      const ward = wards.find((w) => w.WardCode === value);
      setLocationNames((prev) => ({
        ...prev,
        wardName: ward ? ward.WardName : "",
      }));
    }
  };

  const handleAvatarUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await dispatch(uploadImage(formData)).unwrap();
      const imageUrl = response?.imageUrl;
      if (!imageUrl || typeof imageUrl !== "string") {
        throw new Error("Invalid image URL in response");
      }
      setAvatarUrl(imageUrl);
      setAvatarFileList([
        { uid: file.uid, name: file.name, status: "done", url: imageUrl },
      ]);
      setAvatarPreview(imageUrl);
      onSuccess("Ok");
    } catch (error) {
      console.error("Avatar upload failed:", error);
      setAvatarFileList([{ uid: file.uid, name: file.name, status: "error" }]);
      onError(error);
      message.error("Tải lên ảnh đại diện thất bại!");
    }
  };

  const handleBizLicenseUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await dispatch(uploadImage(formData)).unwrap();
      const imageUrl = response?.imageUrl;
      if (!imageUrl || typeof imageUrl !== "string") {
        throw new Error("Invalid image URL in response");
      }
      setBizLicenseUrl(imageUrl);
      setBizLicenseFileList([
        { uid: file.uid, name: file.name, status: "done", url: imageUrl },
      ]);
      setBizLicensePreview(imageUrl);
      onSuccess("Ok");
    } catch (error) {
      console.error("Business license upload failed:", error);
      setBizLicenseFileList([
        { uid: file.uid, name: file.name, status: "error" },
      ]);
      onError(error);
      message.error("Tải lên giấy phép kinh doanh thất bại!");
    }
  };

  const handleAvatarFileChange = (info) => {
    setAvatarFileList(info.fileList);

    if (info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(user?.avatar || "");
      setAvatarUrl(user?.avatar || "");
    }
  };

  const handleBizLicenseFileChange = (info) => {
    setBizLicenseFileList(info.fileList);

    if (info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => {
        setBizLicensePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setBizLicensePreview(user?.bizLicense || "");
      setBizLicenseUrl(user?.bizLicense || "");
    }
  };

  const onFinish = (values) => {
    const addressData = {
      provinceId: selectedProvince ? String(selectedProvince) : "",
      provinceName: locationNames.provinceName,
      districtId: selectedDistrict ? String(selectedDistrict) : "",
      districtName: locationNames.districtName,
      wardId: selectedWard ? String(selectedWard) : "",
      wardName: locationNames.wardName,
    };

    const userReminder = values.userReminder
      ? values.userReminder.toISOString()
      : null;

    const payload = {
      email: values.email,
      name: values.name,
      gender: values.gender,
      address: addressData,
      userReminder: userReminder,
      avatar: avatarUrl || "",
      shopDescription: values.shopDescription || "",
      bizLicense: bizLicenseUrl || "",
    };

    console.log("Payload being sent to updateProfile:", payload); // Debug the payload

    dispatch(updateProfile(payload))
      .unwrap()
      .then(() => {
        message.success("Cập nhật hồ sơ thành công!");
      })
      .catch((error) => {
        message.error(error?.message || "Cập Nhật Hồ Sơ Thất Bại!");
      });
  };

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Card
        title={
          <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            Cập Nhật Hồ Sơ
          </h2>
        }
        bordered={false}
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            email: "",
            name: "",
            gender: "",
            userReminder: null,
            shopDescription: "",
          }}
        >
          <Form.Item label="Hình Ảnh Đại Diện">
            {avatarPreview ? (
              <div style={{ marginBottom: "16px" }}>
                <Image
                  src={avatarPreview}
                  alt="Avatar Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: "16px" }}>Chưa có ảnh đại diện</div>
            )}
            <Upload
              customRequest={handleAvatarUpload}
              onChange={handleAvatarFileChange}
              fileList={avatarFileList}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Tải lên ảnh đại diện</Button>
            </Upload>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Vui lòng nhập email hợp lệ!" },
                ]}
              >
                <Input
                  placeholder="Enter your email"
                  style={{ borderRadius: "4px", padding: "8px" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input
                  placeholder="Enter your name"
                  style={{ borderRadius: "4px", padding: "8px" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select
              placeholder="Select your gender"
              style={{ borderRadius: "4px" }}
            >
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                validator: (_, value) => {
                  if (!selectedProvince || !selectedDistrict || !selectedWard) {
                    return Promise.reject(
                      new Error("Vui lòng chọn đầy đủ địa chỉ!")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <LocationSelector
              selectedProvince={selectedProvince}
              selectedDistrict={selectedDistrict}
              selectedWard={selectedWard}
              onLocationChange={handleLocationChange}
            />
          </Form.Item>

          <Form.Item
            label="Shop Description"
            name="shopDescription"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả cửa hàng!" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Enter shop description"
              style={{ borderRadius: "4px" }}
            />
          </Form.Item>

          <Form.Item label="Giấy Phép Kinh Doanh">
            {bizLicensePreview ? (
              <div style={{ marginBottom: "16px" }}>
                <Image
                  src={bizLicensePreview}
                  alt="Business License Preview"
                  style={{
                    width: "200px",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "4px",
                  }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: "16px" }}>
                Chưa có giấy phép kinh doanh
              </div>
            )}
            <Upload
              customRequest={handleBizLicenseUpload}
              onChange={handleBizLicenseFileChange}
              fileList={bizLicenseFileList}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>
                Tải lên giấy phép kinh doanh
              </Button>
            </Upload>
          </Form.Item>

          <h3
            style={{ fontSize: "16px", fontWeight: "bold", marginTop: "20px" }}
          >
            Thông Báo Người Dùng
          </h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày Giờ Nhắc Nhở"
                name="userReminder"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày và thời gian nhắc nhở!",
                  },
                ]}
              >
                <DatePicker
                  showTime
                  format="DD-MM-YYYY HH:mm"
                  placeholder="Ngày và giờ nhắc nhở"
                  style={{ width: "100%", borderRadius: "4px", padding: "8px" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                borderRadius: "4px",
                padding: "8px 24px",
                height: "auto",
                fontSize: "16px",
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
              }}
            >
              Cập Nhật
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateProfile;
