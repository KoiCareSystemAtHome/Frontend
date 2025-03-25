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
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListProductManagement } from "../../redux/slices/productManagementSlice";
import { InboxOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { getListCategory } from "../../redux/slices/categorySlice";
import { getListCategorySelector } from "../../redux/selector";

const AddProductFood = ({ onClose, shopId }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingParameters, setIsLoadingParameters] = useState(false); // New state for loading parameters
  const [parameters, setParameters] = useState([]); // New state to store pond-required-param data
  const loggedInUser = useSelector((state) => state.authSlice.user);
  const CategoryList = useSelector(getListCategorySelector);
  const currentShopId = shopId || loggedInUser?.shopId;

  const showAddModal = () => {
    form.setFieldsValue({ ShopId: currentShopId });
    console.log("shopId:", currentShopId);
    setIsAddOpen(true);
  };

  const handleCancel = () => {
    setIsAddOpen(false);
    setSelectedImage(null); // Clear selected image on cancel
    setPreviewUrl(null); // Clear preview on cancel
    setFileList([]); // Clear file list on cancel
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

  // Fetch categories and set initial ShopId and Parameters
  useEffect(() => {
    if (currentShopId) {
      form.setFieldsValue({ ShopId: currentShopId });
    }

    // Fetch categories if not already loaded
    if (!CategoryList || CategoryList.length === 0) {
      setIsLoadingCategories(true);
      dispatch(getListCategory())
        .unwrap()
        .then(() => {
          setIsLoadingCategories(false);
          console.log("Categories fetched successfully");
        })
        .catch((error) => {
          console.error("Failed to fetch categories:", error);
          setIsLoadingCategories(false);
          openNotification("error", "Failed to load categories");
        });
    }

    // Fetch pond-required-param data
    const fetchParameters = async () => {
      setIsLoadingParameters(true);
      try {
        const response = await fetch(
          "http://14.225.206.203:8080/api/Pond/pond-required-param"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch parameters");
        }
        const data = await response.json();
        setParameters(data); // Store the fetched parameters
        setIsLoadingParameters(false);
      } catch (error) {
        console.error("Failed to fetch parameters:", error);
        setIsLoadingParameters(false);
        openNotification("error", "Failed to load parameters");
      }
    };

    fetchParameters();
  }, [currentShopId, form, dispatch, CategoryList]);

  const [selectedImage, setSelectedImage] = useState(null); // Store the selected file
  const [previewUrl, setPreviewUrl] = useState(null); // Store the preview URL
  const [fileList, setFileList] = useState([]); // Control the Upload.Dragger file list

  const beforeUpload = (file) => {
    // Validate file type
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      openNotification("error", "You can only upload image files!");
      return false;
    }

    // Set the selected image
    setSelectedImage(file);

    // Update the file list for Upload.Dragger
    //setFileList([file]);

    // Generate a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result); // Set the preview URL
    };
    reader.onerror = () => {
      openNotification("error", "Failed to preview the image.");
    };
    reader.readAsDataURL(file);

    return false; // Prevent automatic upload
  };

  // Function to handle removal (used by both the "Remove Image" button and Upload.Dragger)
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setFileList([]); // Clear the file list in Upload.Dragger
    form.setFieldsValue({ Image: undefined }); // Clear the form field
  };

  // Handle removal directly from Upload.Dragger
  const handleUploadRemove = () => {
    handleRemoveImage(); // Call the same remove function to keep everything in sync
    return true; // Allow the removal
  };

  const onFinish = async (values) => {
    if (!selectedImage) {
      openNotification("error", "Please upload an image!");
      return;
    }

    // Step 1: Upload the image to /api/Account/test to get the image URL
    let imageUrl;
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const uploadResponse = await fetch(
        "http://14.225.206.203:8080/api/Account/test",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadResult = await uploadResponse.json();
      imageUrl = uploadResult.imageUrl;

      if (!imageUrl) {
        throw new Error("Image URL not returned from the server");
      }

      console.log("Image URL:", imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      openNotification("error", "Failed to upload image. Please try again.");
      return;
    }

    // Step 2: Transform ParameterImpacts into a nested object
    const parameterImpactsObj = (values.ParameterImpacts || []).reduce(
      (acc, item) => {
        if (item.impact && item.effect) {
          acc[item.impact] = item.effect;
        }
        return acc;
      },
      {}
    );

    // Step 3: Convert the Type value to an integer
    const typeValue = parseInt(values.Type, 10); // Convert "0", "1", or "2" to 0, 1, or 2

    // Step 3: Construct the payload for create-productfood
    const payload = {
      productName: values.ProductName,
      description: values.Description,
      price: Number(values.Price), // Ensure price is a number
      stockQuantity: Number(values.StockQuantity), // Ensure stockQuantity is a number
      shopId: values.ShopId,
      categoryId: values.CategoryId, // Added categoryId
      brand: values.Brand,
      manufactureDate: values.ManufactureDate,
      expiryDate: values.ExpiryDate,
      parameterImpacts: parameterImpactsObj, // Send as a flat object
      //type: typeValue,
      image: imageUrl, // Use the image URL
      name: values.Name,
      ageFrom: Number(values.AgeFrom) || 0, // Ensure ageFrom is a number, default to 0 if not provided
      ageTo: Number(values.AgeTo) || 0, // Ensure ageTo is a number, default to 0 if not provided
    };

    console.log(
      "Create ProductFood Payload:",
      JSON.stringify(payload, null, 2)
    );

    // Step 4: Send the create-productfood request
    try {
      const response = await fetch(
        "http://14.225.206.203:8080/api/Product/create-productfood",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      // The API returns text/plain ("Success") for a 200 response
      const result = await response.text();
      if (response.ok) {
        openNotification("success", "Product Food Created Successfully!");
        dispatch(getListProductManagement());
        handleCancel();
        form.resetFields();
      } else {
        // Try to parse the error as JSON, if possible
        let errorMessage = result;
        try {
          const errorJson = JSON.parse(result);
          errorMessage = errorJson.message || "Failed to create product food.";
        } catch (e) {
          // If parsing fails, use the raw text as the error message
          errorMessage = result || "Failed to create product food.";
        }
        openNotification("error", errorMessage);
      }
    } catch (error) {
      console.error("Error creating product food:", error);
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
        Create Food
      </Button>

      <Modal
        className="custom-modal"
        centered
        title="Create Food"
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
            {/* 3rd column - Age From */}
            <Col>
              <p className="modalContent">Age From</p>
              <Form.Item
                name="AgeFrom"
                rules={[
                  {
                    required: true,
                    message: "Please input age from!",
                  },
                ]}
              >
                <Input placeholder="Age From" type="number" />
              </Form.Item>
            </Col>
          </Row>
          {/* 3rd Column */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st Column */}
            <Col>
              <p className="modalContent">Age To</p>
              <Form.Item
                name="AgeTo"
                rules={[
                  {
                    required: true,
                    message: "Please input age to!",
                  },
                ]}
              >
                <Input placeholder="Age To" type="number" />
              </Form.Item>
            </Col>
            {/* 2nd Column */}
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
            {/* 3rd Column */}
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
            {/* 3rd Column - Category */}
            <Col>
              <p className="modalContent">Category</p>
              <Form.Item
                name="CategoryId"
                rules={[
                  {
                    required: true,
                    message: "Please select a category!",
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Select Category"
                  style={{ width: "270px" }}
                >
                  {CategoryList?.map((category) => (
                    <Select.Option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {/* 1st Column */}

            {/* 2nd Column */}
            {/* <Col>
              <p className="modalContent">Type</p>
              <Form.Item
                name="Type"
                rules={[
                  {
                    required: true,
                    message: "Please select a type!",
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Select Type"
                  style={{ width: "270px" }}
                >
                  <Select.Option value="0">Food</Select.Option>
                  <Select.Option value="1">Accessory</Select.Option>
                  <Select.Option value="2">Medicine</Select.Option>
                </Select>
              </Form.Item>
            </Col> */}
            {/* 3rd Column */}
            <Col style={{ marginLeft: "6px" }}>
              <p className="modalContent">Medicine Name</p>
              <Form.Item
                name="Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter medicine name!",
                  },
                ]}
              >
                <Input placeholder="Medicine Name"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* 5th Row */}
          <Row>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Parameter Impacts</p>
              <Form.List name="ParameterImpacts">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Row
                        key={field.key}
                        gutter={12}
                        align="middle"
                        style={{ marginBottom: 8 }}
                      >
                        <Col>
                          <Form.Item
                            {...field}
                            name={[field.name, "impact"]}
                            fieldKey={[field.fieldKey, "impact"]}
                            rules={[
                              {
                                required: true,
                                message: "Please input impact!",
                              },
                            ]}
                          >
                            <Select
                              allowClear
                              style={{ width: "150px" }}
                              placeholder="Select Parameter"
                              loading={isLoadingParameters}
                            >
                              {parameters.map((param) => (
                                <Select.Option
                                  key={param.parameterId}
                                  value={param.parameterName} // Use parameterName as the value
                                >
                                  {param.parameterName}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...field}
                            name={[field.name, "effect"]}
                            fieldKey={[field.fieldKey, "effect"]}
                            rules={[
                              {
                                required: true,
                                message: "Please select effect!",
                              },
                            ]}
                          >
                            <Select
                              allowClear
                              style={{ width: "120px" }}
                              placeholder="Increased or Decreased"
                            >
                              <Select.Option value="increased">
                                Increased
                              </Select.Option>
                              <Select.Option value="decreased">
                                Decreased
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          {fields.length > 1 ? (
                            <Button
                              type="link"
                              danger
                              onClick={() => remove(field.name)}
                            >
                              <span
                                style={{ marginTop: "-40px" }}
                                role="img"
                                aria-label="delete"
                              >
                                ✖
                              </span>
                            </Button>
                          ) : null}
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button
                        style={{ width: "232px" }}
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Parameter Impact
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
            {/* 2nd Column */}
            <Col>
              <Form.Item
                name="ShopId"
                rules={[
                  {
                    required: true,
                    message: "Please input shop ID!",
                  },
                ]}
              >
                <Input hidden placeholder="Shop ID"></Input>
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
                fileList={fileList} // Control the file list
                onRemove={handleUploadRemove} // Handle removal from Upload.Dragger
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
            {/* Image Preview Section */}
            {previewUrl && (
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                    marginBottom: 8,
                  }}
                />
                <div>
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleRemoveImage}
                  >
                    Remove Image
                  </Button>
                </div>
              </div>
            )}
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
                Create Food
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddProductFood;
