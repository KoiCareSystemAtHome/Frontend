import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Upload,
} from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  createProductManagement,
  getListProductManagement,
} from "../../redux/slices/productManagementSlice";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";

const AddProductManagement = ({ onClose }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const showAddModal = () => {
    setIsAddOpen(true);
  };

  const handleCancel = () => {
    setIsAddOpen(false);
  };

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const buttonStyle = {
    height: "40px",
    width: "160px",
    borderRadius: "10px",
    margin: "0px 5px",
    padding: "7px 0px 10px 0px",
  };

  // Notification
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message) => {
    api[type]({
      message: message,
      placement: "top",
      duration: 5,
    });
  };

  const onFinish = async (values) => {
    if (typeof values.ParameterImpacts === "string") {
      try {
        values.ParameterImpacts = {
          ParameterImpacts: {
            H2O: "Increased",
            CO2: "Increased",
          },
        };
      } catch {
        openNotification("error", "Invalid JSON format in ParameterImpacts.");
        return;
      }
    }

    // Convert form data to query parameters
    const queryParams = {
      ProductName: values.ProductName,
      Description: values.Description,
      Price: values.Price,
      StockQuantity: values.StockQuantity,
      CategoryId: values.CategoryId,
      Brand: values.Brand,
      ManufactureDate: values.ManufactureDate,
      ExpiryDate: values.ExpiryDate,
    };

    dispatch(createProductManagement(queryParams))
      .unwrap()
      .then(() => {
        onClose();
        openNotification("success", "Product Created Successfully!");
        dispatch(getListProductManagement());
        handleCancel();
        form.resetFields();
      })
      .catch((error) => {
        openNotification("warning", error);
      });
  };

  return (
    <div>
      {contextHolder}
      <Button
        size="small"
        className="addBtn"
        type="primary"
        icon={<PlusOutlined />}
        style={buttonStyle}
        onClick={showAddModal}
      >
        Add Product
      </Button>

      <Modal
        className="custom-modal"
        centered
        title="Create Membership"
        open={isAddOpen}
        onCancel={handleCancel}
        width={870}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          {/* 1st Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Product Name</p>
              <Form.Item
                name="ProductName"
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
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Description</p>
              <Form.Item
                name="Description"
                rules={[
                  {
                    required: true,
                    message: "Please enter description!",
                  },
                ]}
              >
                <Input placeholder="Description"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Price</p>
              <Form.Item
                name="Price"
                rules={[
                  {
                    required: true,
                    message: "Please select price!",
                  },
                ]}
              >
                <Input placeholder="Price"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Stock Quantity</p>
              <Form.Item
                name="StockQuantity"
                rules={[
                  {
                    required: true,
                    message: "Please select stock quantity!",
                  },
                ]}
              >
                <Input placeholder="Stock Quantity"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Shop ID</p>
              <Form.Item
                name="ShopId"
                rules={[
                  {
                    required: true,
                    message: "Please input shop ID!",
                  },
                ]}
              >
                <Input placeholder="Shop ID"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Category ID</p>
              <Form.Item
                name="CategoryId"
                rules={[
                  {
                    required: true,
                    message: "Please input category ID!",
                  },
                ]}
              >
                <Input placeholder="Category ID"></Input>
              </Form.Item>
            </Col>
            {/* 4th column */}
          </Row>
          {/* 3rd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            <Col>
              <p className="modalContent">Brand</p>
              <Form.Item
                name="Brand"
                rules={[
                  {
                    required: true,
                    message: "Please input brand!",
                  },
                ]}
              >
                <Input placeholder="Brand"></Input>
              </Form.Item>
            </Col>
            <Col>
              <p className="modalContent">Manufacture Date</p>
              <Form.Item
                name="ManufactureDate"
                rules={[
                  {
                    required: true,
                    message: "Please select manufacture date!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Manufacture Date"
                ></DatePicker>
              </Form.Item>
            </Col>
            <Col>
              <p className="modalContent">Expiry Date</p>
              <Form.Item
                name="ExpiryDate"
                rules={[
                  {
                    required: true,
                    message: "Please select expiry date!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Expiry Date"
                ></DatePicker>
              </Form.Item>
            </Col>
          </Row>
          {/* 4th Row */}
          <Row>
            {/* 1st column */}
            <Col style={{ marginRight: "6px" }}>
              <p className="modalContent">Parameter Impacts</p>
              <Form.Item
                name="ParameterImpacts"
                rules={[
                  {
                    required: true,
                    message: "Please input parameter impacts!",
                  },
                  // {
                  //   validator: (_, value) => {
                  //     try {
                  //       if (value) {
                  //         JSON.parse(value); // Validate JSON format
                  //       }
                  //       return Promise.resolve();
                  //     } catch {
                  //       return Promise.reject(
                  //         new Error("Invalid JSON format!")
                  //       );
                  //     }
                  //   },
                  // },
                ]}
              >
                <Input placeholder="Parameter impacts" />
              </Form.Item>
            </Col>
          </Row>
          <Col>
            <p className="modalContent">Image</p>
            <Form.Item
              name="image"
              rules={[
                {
                  required: true,
                  message: "Please upload an image!",
                },
              ]}
            >
              <Upload.Dragger
                name="file"
                beforeUpload={(file) => {
                  form.setFieldsValue({ Image: file }); // Store file in form state
                  return false; // Prevent auto-upload
                }}
                multiple={false}
                accept="image/*"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Supports a single image file. Click or drag to upload.
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Col>
          <Row className="membershipButton">
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                style={{
                  width: "180px",
                  height: "40px",
                  padding: "8px",
                  borderRadius: "10px",
                }}
              >
                <PlusOutlined />
                Create Membership
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddProductManagement;
