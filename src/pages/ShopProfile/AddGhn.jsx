import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, message } from "antd";
import { createShopGHN } from "../../redux/slices/ghnSlice";
import LocationSelector from "../ShopProfile/LocationSelector";

const AddGhn = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.shopSlice);

  // Local state for form inputs
  const [shopData, setShopData] = useState({
    provinceId: "",
    districtId: "",
    wardCode: "",
    name: "",
    phone: "",
    address: "",
  });

  // Handle input change
  const handleChange = (field, value) => {
    setShopData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle location change from LocationSelector
  const handleLocationChange = (type, value) => {
    if (type === "province") {
      setShopData((prev) => ({
        ...prev,
        provinceId: value,
        districtId: "",
        wardCode: "",
      }));
    } else if (type === "district") {
      setShopData((prev) => ({ ...prev, districtId: value, wardCode: "" }));
    } else if (type === "ward") {
      setShopData((prev) => ({ ...prev, wardCode: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page refresh

    if (
      !shopData.districtId ||
      !shopData.wardCode ||
      !shopData.name ||
      !shopData.phone ||
      !shopData.address
    ) {
      message.error("Vui Lòng Nhập Thông Tin!");
      return;
    }

    try {
      const resultAction = await dispatch(createShopGHN(shopData));
      if (createShopGHN.fulfilled.match(resultAction)) {
        message.success("Shop created successfully!");
      } else {
        message.error(resultAction.payload || "Failed to create shop");
      }
    } catch (error) {
      message.error("An error occurred");
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Tên Cửa Hàng">
        <Input
          value={shopData.name}
          placeholder="Tên cửa hàng"
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Số Điện Thoại">
        <Input
          value={shopData.phone}
          placeholder="Số điện thoại"
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Địa Chỉ">
        <Input
          value={shopData.address}
          placeholder="Địa chỉ"
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </Form.Item>

      {/* Location Selector */}
      <Form.Item label="Thành Phố / Quận / Phường">
        <LocationSelector
          selectedProvince={shopData.provinceId}
          selectedDistrict={shopData.districtId}
          selectedWard={shopData.wardCode}
          onLocationChange={handleLocationChange}
        />
      </Form.Item>

      <Button type="primary" onClick={handleSubmit} loading={loading}>
        Đăng Kí
      </Button>
    </Form>
  );
};

export default AddGhn;
