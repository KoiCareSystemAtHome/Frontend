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

  const [imageBase64, setImageBase64] = useState(""); // Store the image as Base64

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

  const [selectedImage, setSelectedImage] = useState(null); // Store the selected file

  // const beforeUpload = async (file) => {
  //   const formData = new FormData();
  //   formData.append("filene", file); // Ensure correct field name

  //   try {
  //     const response = await fetch(
  //       "http://14.225.206.203:5444/api/Account/test",
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     const imageUrl = await response.text(); // Read response as text (not JSON)
  //     console.log("Upload Response:", imageUrl); // Debugging

  //     if (imageUrl.startsWith("http")) {
  //       // Ensure valid URL
  //       setImageBase64(imageUrl); // Save URL
  //       form.setFieldsValue({ Image: imageUrl }); // Store in form
  //       openNotification("success", "Image uploaded successfully!");
  //     } else {
  //       openNotification("error", "Invalid image URL received.");
  //     }
  //   } catch (error) {
  //     console.error("Upload Error:", error);
  //     openNotification("error", "Image upload failed.");
  //   }
  // }

  const beforeUpload = (file) => {
    setSelectedImage(file); // Save file for later upload
    return false; // Prevent automatic upload
  };

  // Convert image to Base64
  // const convertToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result.split(",")[1]); // Extract Base64 string
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  const onFinish = async (values) => {
    if (!selectedImage) {
      openNotification("error", "Please upload an image!");
      return;
    }

    // Construct query parameters
    const queryParams = new URLSearchParams({
      ProductName: values.ProductName,
      Description: values.Description,
      Price: values.Price,
      StockQuantity: values.StockQuantity,
      ShopId: values.ShopId,
      CategoryId: values.CategoryId,
      Brand: values.Brand,
      ManufactureDate: values.ManufactureDate,
      ExpiryDate: values.ExpiryDate,
      ParameterImpacts: JSON.stringify(values.ParameterImpacts),
    });

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch(
        `http://14.225.206.203:5444/api/Product/create-product?${queryParams}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        openNotification("success", "Product Created Successfully!");
        dispatch(getListProductManagement());
        handleCancel();
        form.resetFields();
      } else {
        openNotification(
          "error",
          result.message || "Failed to create product."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      openNotification("error", "Network error, try again later.");
    }
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
        title="Create Product"
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
                {/* <Input placeholder="Parameter impacts" /> */}
                <Input.TextArea
                  rows={4}
                  placeholder="Enter parameter impacts in JSON format"
                  onChange={(e) => {
                    try {
                      JSON.parse(e.target.value); // Check JSON validity
                    } catch {
                      console.error("Invalid JSON format");
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Col>
            <p className="modalContent">Image</p>
            <Form.Item
              name="Image"
              rules={[
                {
                  required: true,
                  message: "Please upload an image!",
                },
              ]}
            >
              <Upload.Dragger
                name="file"
                beforeUpload={beforeUpload}
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
                Create Product
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddProductManagement;
