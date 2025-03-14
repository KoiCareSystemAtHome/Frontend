import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
} from "antd";
import { Option } from "antd/es/mentions";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListShop } from "../../redux/slices/shopSlice";
import LocationSelector from "../ShopProfile/LocationSelector";
import {
  createOrderGHN,
  fetchDistricts,
  fetchProvinces,
  fetchWards,
  updateOrderCodeShipFee,
  updateOrderShipType,
  updateOrderStatus,
} from "../../redux/slices/ghnSlice";

const AddOrder = ({ onClose }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const shopList = useSelector((state) => state.shopSlice?.listShop || []);
  const provinceList = useSelector((state) => state.ghnSlice?.provinces || []);
  const districtList = useSelector((state) => state.ghnSlice?.districts || []);
  const wardList = useSelector((state) => state.ghnSlice?.wards || []);
  const { provinces, districts, wards } = useSelector(
    (state) => state.ghnSlice
  );

  // Location Selector
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const showAddModal = () => {
    setIsAddOpen(true);
  };

  const handleCancel = () => {
    setIsAddOpen(false);
  };

  // Shop Dropdown
  useEffect(() => {
    dispatch(getListShop());
  }, [dispatch]);

  // Province Dropdown
  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  // District Dropdown
  useEffect(() => {
    if (selectedProvince) {
      dispatch(fetchDistricts(selectedProvince));
    }
  }, [dispatch, selectedProvince]);

  // Wards Dropdown
  useEffect(() => {
    if (selectedDistrict) {
      dispatch(fetchWards(selectedDistrict));
    }
  }, [dispatch, selectedDistrict]);

  const getProvinceNameById = (id) => {
    const province = provinces.find((p) => p.ProvinceID === parseInt(id));
    return province ? province.ProvinceName : "";
  };

  const getDistrictNameById = (id) => {
    const district = districts.find((d) => d.DistrictID === parseInt(id));
    return district ? district.DistrictName : "";
  };

  const getWardNameById = (id) => {
    const ward = wards.find((w) => w.WardCode === id);
    return ward ? ward.WardName : "";
  };

  const buttonStyle = {
    height: "40px",
    width: "140px",
    borderRadius: "10px",
    margin: "0px 5px",
    padding: "7px 0px 10px 0px",
  };

  // Notification
  const [api, contextHolder] = notification.useNotification();

  const openNotification = useCallback(
    (type, message) => {
      api[type]({
        message: message,
        placement: "top",
        duration: 5,
      });
    },
    [api]
  );

  const onLocationChange = (type, value) => {
    if (type === "province") {
      setSelectedProvince(value);
      setSelectedDistrict(null);
      setSelectedWard(null);
      form.setFieldsValue({ from_district_name: null, from_ward_name: null }); // Reset district & ward
    } else if (type === "district") {
      setSelectedDistrict(value);
      setSelectedWard(null);
      form.setFieldsValue({ from_ward_name: null }); // Reset ward when district changes
    } else if (type === "ward") {
      setSelectedWard(value);
    }
    form.setFieldsValue({ [type]: value });
  };

  const onLocationChange1 = (type, value) => {
    if (type === "district") {
      setSelectedDistrict(value);
      setSelectedWard(null);
      form.setFieldsValue({ to_ward_code: null });

      // Find the province for the selected district
      const district = districtList.find((d) => d.DistrictID === value);
      if (district) {
        setSelectedProvince(district.ProvinceID);
        form.setFieldsValue({ to_province_name: district.ProvinceID });
      }
    } else if (type === "ward") {
      setSelectedWard(value);

      // Find the district for the selected ward
      const ward = wardList.find((w) => w.WardCode === value);
      if (ward) {
        setSelectedDistrict(ward.DistrictID);
        form.setFieldsValue({ to_district_id: ward.DistrictID });

        // Find the province from the district
        const district = districtList.find(
          (d) => d.DistrictID === ward.DistrictID
        );
        if (district) {
          setSelectedProvince(district.ProvinceID);
          form.setFieldsValue({ to_province_name: district.ProvinceID });
        }
      }
    } else if (type === "province") {
      setSelectedProvince(value);
      setSelectedDistrict(null);
      setSelectedWard(null);
      form.setFieldsValue({ to_district_id: null, to_ward_code: null });
    }

    form.setFieldsValue({ [type]: value });
  };

  const onFinish = (values) => {
    console.log("Form Submitted: ", values);

    const orderData = {
      ...values,
      shopId: values.shopId,
      from_province_name: getProvinceNameById(values.from_province_name),
      from_district_name: getDistrictNameById(values.from_district_name),
      from_ward_name: getWardNameById(values.from_ward_name),
    };

    // Dispatch an action or call API to save the order
    dispatch(createOrderGHN(orderData))
      .unwrap()
      .then((response) => {
        console.log("GHN Response:", response);
        if (response.code === 200) {
          const { order_code, trans_type, fee } = response.data;
          const shipFee = fee?.cod_fee?.toString() ?? "0"; // Convert to string           // Extract cod_fee and default to 0 if missing

          console.log("Updating order with ID:", values.orderId); // <-- Debugging log
          console.log("Payload:", { order_code, shipFee, trans_type });

          // Update orderCodeShipFee
          dispatch(
            updateOrderCodeShipFee({
              orderId: values.orderId,
              order_code,
              shipFee,
            })
          )
            .unwrap()
            .then(() => console.log("Updated order code successfully"))
            .catch((err) => console.error("Error updating order code:", err));

          // Update shipType
          dispatch(
            updateOrderShipType({
              orderId: values.orderId,
              shipType: trans_type,
            })
          )
            .unwrap()
            .then(() => console.log("Updated ship type successfully"))
            .catch((err) => console.error("Error updating ship type:", err));

          // Update order status to "SHIPPING"
          dispatch(
            updateOrderStatus({
              orderId: values.orderId,
              status: "Confirm",
            })
          )
            .unwrap()
            .then(() => console.log("Updated order status successfully"))
            .catch((err) => console.error("Error updating order status:", err));

          openNotification(
            "success",
            `Order Created Successfully! Code: ${order_code}`
          );
          handleCancel();
          form.resetFields();
          onClose();
        } else {
          openNotification(
            "warning",
            `Failed to create order: ${response.message}`
          );
        }
      })
      .catch((error) => {
        if (error.response) {
          openNotification("warning", `Error: ${error.response.data.message}`);
        } else if (error.request) {
          openNotification("warning", "Network error, please try again later.");
        } else {
          openNotification("warning", `Unexpected error: ${error.message}`);
        }
      });
  };

  return (
    <div>
      <Button
        size="small"
        className="addBtn"
        type="primary"
        icon={<PlusOutlined />}
        style={buttonStyle}
        onClick={showAddModal}
      >
        Add Order
      </Button>

      <Modal
        className="custom-modal"
        centered
        title="Create Order"
        open={isAddOpen}
        onCancel={handleCancel}
        width={870}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          <Row>
            <Col>
              <p className="modalContent">Shop ID</p>
              <Form.Item
                name="shopId"
                rules={[
                  {
                    required: true,
                    message: "Please input Shop ID!",
                  },
                ]}
              >
                <Input style={{ width: "270px" }} placeholder="Shop ID"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* 1st Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Member Name</p>
              <Form.Item
                name="to_name"
                rules={[
                  {
                    required: true,
                    message: "Please input Member Name!",
                  },
                ]}
              >
                <Input
                  style={{ width: "270px" }}
                  placeholder="Member Name"
                ></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Shop Name</p>
              <Form.Item
                name="from_name"
                rules={[
                  {
                    required: true,
                    message: "Please select Shop!",
                  },
                ]}
              >
                <Select
                  placeholder="Select Shop"
                  style={{ width: "270px" }}
                  allowClear
                >
                  {shopList.map((shop) => (
                    <Option key={shop.shopId} value={shop.shopId}>
                      {shop.shopName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Phone Number</p>
              <Form.Item
                name="from_phone"
                rules={[
                  {
                    required: true,
                    message: "Please enter phhone number!",
                  },
                ]}
              >
                <Input placeholder="Phone Number"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* 2nd Row */}
          <Row style={{}}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Shop Address</p>
              <Form.Item
                name="from_address"
                rules={[
                  {
                    required: true,
                    message: "Please enter shop address!",
                  },
                ]}
              >
                <Input placeholder="Shop Address"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col style={{ marginLeft: "6px" }}>
              <p className="modalContent"> Shop Province</p>
              <Form.Item
                name="from_province_name"
                rules={[
                  {
                    required: true,
                    message: "Please select province!",
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Select Province"
                  onChange={(value) => onLocationChange("province", value)}
                  style={{ width: "270px" }}
                >
                  {provinceList.length > 0 ? (
                    provinceList.map((province) => (
                      <Select.Option
                        key={province.ProvinceID}
                        value={province.ProvinceID}
                      >
                        {province.ProvinceName}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option disabled key="no-data">
                      No provinces available
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
            {/* 3rd Column */}
            <Col style={{ marginLeft: "6px" }}>
              <p className="modalContent">Shop District</p>
              <Form.Item
                name="from_district_name"
                rules={[
                  {
                    required: true,
                    message: "Please select district!",
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Select District"
                  onChange={(value) => onLocationChange("district", value)}
                  style={{ width: "270px" }}
                  disabled={!selectedProvince} // Disable if no province selected
                >
                  {districtList.length > 0 ? (
                    districtList.map((district) => (
                      <Select.Option
                        key={district.DistrictID}
                        value={district.DistrictID}
                      >
                        {district.DistrictName}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option disabled key="no-data">
                      No districts available
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {/* 3rd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st Column */}
            <Col>
              <p className="modalContent">Shop Ward</p>
              <Form.Item
                name="from_ward_name"
                rules={[
                  {
                    required: true,
                    message: "Please select ward!",
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Select Ward"
                  onChange={(value) => onLocationChange("ward", value)}
                  style={{ width: "270px" }}
                  disabled={!selectedDistrict} // Disable if no province selected
                >
                  {wardList.length > 0 ? (
                    wardList.map((ward) => (
                      <Select.Option key={ward.WardCode} value={ward.WardCode}>
                        {ward.WardName}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option disabled key="no-data">
                      No wards available
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
            {/* 2nd Coumn */}
            <Col>
              <p className="modalContent">Member Phone Number</p>
              <Form.Item
                name="to_phone"
                rules={[
                  {
                    required: true,
                    message: "Please enter member phone number!",
                  },
                ]}
              >
                <Input placeholder="Phone Number"></Input>
              </Form.Item>
            </Col>
            {/* 2nd Coumn */}
            <Col>
              <p className="modalContent">Member Address</p>
              <Form.Item
                name="to_address"
                rules={[
                  {
                    required: true,
                    message: "Please enter member address",
                  },
                ]}
              >
                <Input placeholder="Member Address"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* 4th Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st Column */}
            <Col>
              <p className="modalContent">Member Ward Code</p>
              <Form.Item
                name="to_ward_code"
                rules={[
                  {
                    required: true,
                    message: "Please select member ward code!",
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Select Ward Code"
                  onChange={(value) => onLocationChange1("ward", value)}
                  style={{ width: "270px" }}
                >
                  {wardList.length > 0 ? (
                    wardList.map((ward) => (
                      <Select.Option key={ward.WardCode} value={ward.WardCode}>
                        {ward.WardName}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option disabled key="no-data">
                      No ward code available
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
            {/* 2nd Column */}
            <Col style={{ marginLeft: "6px" }}>
              <p className="modalContent">Member District</p>
              <Form.Item
                name="to_district_id"
                rules={[
                  {
                    required: true,
                    message: "Please select member district!",
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Select district"
                  onChange={(value) => onLocationChange1("district", value)}
                  style={{ width: "270px" }}
                >
                  {districtList.length > 0 ? (
                    districtList.map((district) => (
                      <Select.Option
                        key={district.DistrictID}
                        value={district.DistrictID}
                      >
                        {district.DistrictName}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option disabled key="no-data">
                      No district available
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
            {/* 3rd Column */}
            <Col>
              <p className="modalContent">Product Weight</p>
              <Form.Item
                name="weight"
                rules={[
                  {
                    required: true,
                    message: "Please enter product weight!",
                  },
                ]}
              >
                <Input placeholder="Product Weight"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* 5nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st Column */}
            <Col>
              <p className="modalContent">Product Length</p>
              <Form.Item
                name="length"
                rules={[
                  {
                    required: true,
                    message: "Please enter product length!",
                  },
                ]}
              >
                <Input placeholder="Product Length"></Input>
              </Form.Item>
            </Col>
            {/* 2nd Column */}
            <Col>
              <p className="modalContent">Product Width</p>
              <Form.Item
                name="width"
                rules={[
                  {
                    required: true,
                    message: "Please enter product Width!",
                  },
                ]}
              >
                <Input placeholder="Product Width"></Input>
              </Form.Item>
            </Col>
            {/* 3rd Column */}
            <Col>
              <p className="modalContent">Product Height</p>
              <Form.Item
                name="height"
                rules={[
                  {
                    required: true,
                    message: "Please enter product Height!",
                  },
                ]}
              >
                <Input placeholder="Product Height"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* 6th Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st Column */}
            <Col>
              <p className="modalContent">Service Type</p>
              <Form.Item
                name="service_type_id"
                rules={[
                  {
                    required: true,
                    message: "Please enter service type!",
                  },
                ]}
              >
                <Input placeholder="Service Type"></Input>
              </Form.Item>
            </Col>
            {/* 2nd Column */}
            <Col>
              <p className="modalContent">Payment Type</p>
              <Form.Item
                name="payment_type_id"
                rules={[
                  {
                    required: true,
                    message: "Please enter payment type!",
                  },
                ]}
              >
                <Input placeholder="Payment Type"></Input>
              </Form.Item>
            </Col>
            {/* 3rd Column */}
            <Col>
              <p className="modalContent">Required Note</p>
              <Form.Item
                name="required_note"
                rules={[
                  {
                    required: true,
                    message: "Please enter required note!",
                  },
                ]}
              >
                <Input placeholder="Required Note"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* 7th Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st Column */}
            <Col>
              <p className="modalContent">Product Name</p>
              <Form.Item
                name={["items", 0, "name"]} // Access the first item's name in the array
                rules={[
                  {
                    required: true,
                    message: "Please enter product name!",
                  },
                ]}
              >
                <Input placeholder="Product Name"></Input>
              </Form.Item>
            </Col>
            {/* 2nd Column */}
            <Col>
              <p className="modalContent">Product Quantity</p>
              <Form.Item
                name={["items", 0, "quantity"]}
                rules={[
                  {
                    required: true,
                    message: "Please enter product quantity!",
                  },
                ]}
              >
                <Input placeholder="Product Quantity"></Input>
              </Form.Item>
            </Col>
            {/* 3rd Column */}
            <Col>
              <p className="modalContent">Product Weight</p>
              <Form.Item
                name={["items", 0, "weight"]}
                rules={[
                  {
                    required: true,
                    message: "Please enter product weight!",
                  },
                ]}
              >
                <Input placeholder="Product Weight"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* <Row>
            <Col span={24}>
              <p className="modalContent">Location</p>
            </Col>
            <Col span={24}>
              <LocationSelector
                selectedProvince={selectedProvince}
                selectedDistrict={selectedDistrict}
                selectedWard={selectedWard}
                onLocationChange={onLocationChange}
              />
            </Col>
          </Row> */}
          <Row className="membershipButton">
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                style={{
                  width: "150px",
                  height: "40px",
                  padding: "8px",
                  borderRadius: "10px",
                }}
              >
                <PlusOutlined />
                Create Order
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddOrder;
