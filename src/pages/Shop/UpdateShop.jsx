import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Popover,
  Row,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import { getListShop, updateShop } from "../../redux/slices/shopSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDistricts,
  fetchProvinces,
  fetchWards,
} from "../../redux/slices/ghnSlice";

const UpdateShop = (props) => {
  const { record } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  // Redux state for location data
  const { provinces, districts, wards } = useSelector(
    (state) => state.ghnSlice
  );

  // Local state for selected location
  const [selectedProvince, setSelectedProvince] = useState(
    record.shopAddress?.provinceId || ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    record.shopAddress?.districtId || ""
  );
  const [selectedWard, setSelectedWard] = useState(
    record.shopAddress?.wardId || ""
  );

  useEffect(() => {
    dispatch(fetchProvinces()); // Load provinces on mount
  }, [dispatch]);

  useEffect(() => {
    if (selectedProvince) dispatch(fetchDistricts(selectedProvince));
  }, [dispatch, selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) dispatch(fetchWards(selectedDistrict));
  }, [dispatch, selectedDistrict]);

  const showEditModal = () => {
    form.setFieldsValue({
      shopName: record.shopName,
      shopRate: record.shopRate,
      shopDescription: record.shopDescription,
      shopAddress: record.shopAddress,
      bizLicences: record.bizLicences,
      ghnId: record.ghnId,
      isActivate: record.isActivate,
    });
    setSelectedProvince(record.shopAddress?.provinceId || "");
    setSelectedDistrict(record.shopAddress?.districtId || "");
    setSelectedWard(record.shopAddress?.wardId || "");
    setIsEditOpen(true);
  };

  const handleEditCancel = () => {
    form.resetFields();
    setIsEditOpen(false);
  };

  const handleCancel = () => {
    setIsEditOpen(false);
  };

  const openNotification = (type, message) => {
    api[type]({
      message: message,
      placement: "top",
      duration: 5,
    });
  };

  const handleEditSubmit = (values) => {
    form.validateFields().then(() => {
      const updatedShop = {
        ...values,
        shopAddress: {
          provinceId: String(selectedProvince),
          provinceName:
            provinces.find((p) => p.ProvinceID === selectedProvince)
              ?.ProvinceName || "",
          districtId: String(selectedDistrict),
          districtName:
            districts.find((d) => d.DistrictID === selectedDistrict)
              ?.DistrictName || "",
          wardId: selectedWard,
          wardName:
            wards.find((w) => w.WardCode === selectedWard)?.WardName || "",
        },
      };

      dispatch(updateShop({ shopId: record.shopId, updatedShop }))
        .unwrap()
        .then(() => {
          handleEditCancel();
          openNotification("success", `Cập Nhật Cửa Hàng Thành Công!`);
          dispatch(getListShop());
        })
        .catch((error) => {
          console.error("Update error:", error);
          openNotification("warning", error.message || "Cập Nhật Thất Bại!");
        });
    });
  };

  return (
    <div>
      {contextHolder}
      <Popover content="Edit" trigger="hover">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={showEditModal}
          className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border-none shadow-none flex items-center justify-center"
          style={{
            width: "32px",
            height: "32px",
            padding: 0,
          }}
        />
      </Popover>

      <Modal
        className="custom-modal"
        centered
        title="Chỉnh Sửa Thông Tin Cửa Hàng"
        open={isEditOpen}
        onCancel={handleEditCancel}
        width={870}
        footer={null}
      >
        <Form form={form} onFinish={handleEditSubmit}>
          {/* 1st Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Tên Cửa Hàng</p>
              <Form.Item
                name="shopName"
                initialValue={record.shopName}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên cửa hàng!",
                  },
                ]}
              >
                <Input placeholder="Tên Cửa Hàng"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Đánh Giá</p>
              <Form.Item
                name="shopRate"
                initialValue={record.shopRate}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đánh giá!",
                  },
                ]}
              >
                <Input placeholder="Đánh Giá"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Mô Tả</p>
              <Form.Item
                name="shopDescription"
                initialValue={record.shopDescription}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả!",
                  },
                ]}
              >
                <Input placeholder="Mô Tả"></Input>
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ justifyContent: "space-between" }}>
            <Col>
              <p className="modalContent">Thành Phố/Tỉnh</p>
              <Form.Item
                name="province"
                initialValue={record?.shopAddress?.provinceId}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập thành phố/tỉnh!",
                  },
                ]}
              >
                <Select
                  allowClear
                  style={{ width: "270px" }}
                  value={selectedProvince}
                  onChange={(value) => {
                    setSelectedProvince(value);
                    setSelectedDistrict(""); // Reset district when province changes
                    setSelectedWard(""); // Reset ward when province changes
                    form.setFieldsValue({
                      province: value,
                      district: "",
                      ward: "",
                    });
                  }}
                  placeholder="Vui lòng nhập thành phố/tình"
                >
                  {provinces.map((p) => (
                    <Select.Option key={p.ProvinceID} value={p.ProvinceID}>
                      {p.ProvinceName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col>
              <p className="modalContent">Quận/Huyện</p>
              <Form.Item
                name="district"
                initialValue={record?.shopAddress?.districtId}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập quận/huyện!",
                  },
                ]}
              >
                <Select
                  allowClear
                  style={{ width: "270px" }}
                  value={selectedDistrict}
                  onChange={(value) => {
                    setSelectedDistrict(value);
                    setSelectedWard(""); // Reset ward when district changes
                    form.setFieldsValue({ district: value, ward: "" });
                  }}
                  placeholder="Quận/Huyện"
                >
                  {districts.map((d) => (
                    <Select.Option key={d.DistrictID} value={d.DistrictID}>
                      {d.DistrictName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col>
              <p className="modalContent">Phường/Xã</p>
              <Form.Item
                name="ward"
                initialValue={record?.shopAddress?.wardId}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập phường/xã!",
                  },
                ]}
              >
                <Select
                  allowClear
                  style={{ width: "270px" }}
                  value={selectedWard}
                  onChange={(value) => {
                    setSelectedWard(value);
                    form.setFieldsValue({ ward: value });
                  }}
                  placeholder="Phường/Xã"
                >
                  {wards.map((w) => (
                    <Select.Option key={w.WardCode} value={w.WardCode}>
                      {w.WardName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Giấy Phép Kinh Doanh</p>
              <Form.Item
                name="bizLicences"
                initialValue={record.bizLicences}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giấy phép kinh doanh!",
                  },
                ]}
              >
                <Input placeholder="Giấy Phép Kinh Doanh"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Mã GHN</p>
              <Form.Item
                name="ghnId"
                initialValue={record.ghnId}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã GHN!",
                  },
                ]}
              >
                <Input placeholder="Mã GHN"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Trạng Thái</p>
              <Form.Item
                name="isActivate"
                initialValue={record.isActivate} // Ensure initial value is a boolean
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trạng thái!",
                  },
                ]}
              >
                <Select placeholder="Trạng Thái">
                  <Select.Option value={true}>Kích Hoạt</Select.Option>
                  <Select.Option value={false}>Vô Hiệu</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Địa Chỉ</p>
              <Form.Item
                name="shopAddress"
                initialValue={record.shopAddress}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa chỉ!",
                  },
                ]}
              >
                <Input
                  style={{ width: "820px" }}
                  placeholder="Địa Chỉ"
                  value={`${selectedWard ? selectedWard.WardName + ", " : ""}${
                    selectedDistrict ? selectedDistrict.DistrictName + ", " : ""
                  }${selectedProvince ? selectedProvince.ProvinceName : ""}`}
                  readOnly
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="membershipButton">
            <Form.Item>
              <Button
                onClick={handleCancel}
                htmlType="submit"
                type="primary"
                style={{
                  width: "120px",
                  height: "40px",
                  padding: "8px",
                  borderRadius: "10px",
                  backgroundColor: "orange",
                }}
              >
                <EditOutlined />
                Chỉnh Sửa
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateShop;

// const handleEditSubmit = (values) => {
//   form.validateFields().then(() => {
//     dispatch(updateShop({ shopId: record.shopId, updatedShop: values }))
//       .unwrap()
//       .then(() => {
//         handleEditCancel();
//         openNotification(
//           "success",
//           `Updated shop "${record.shopName}" successfully!`
//         );
//         dispatch(getListShop());
//       })
//       .catch((error) => {
//         console.error("Update error:", error); // Debugging
//         openNotification("warning", error.message || "Update failed!");
//       });
//   });
// };
