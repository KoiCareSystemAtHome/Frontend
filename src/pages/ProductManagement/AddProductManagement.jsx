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
import { DeleteOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { getListCategorySelector } from "../../redux/selector";
import { getListCategory } from "../../redux/slices/categorySlice";
import { Option } from "antd/es/mentions";

const AddProductManagement = ({ onClose, shopId }) => {
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
    console.log("cate: ", CategoryList);
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
    // Validate file type (optional)
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      openNotification("error", "You can only upload image files!");
      return false;
    }

    setSelectedImage(file); // Save file for later upload

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

  // Function to remove the selected image and clear the preview
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
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

    // Step 3: Construct the payload for create-product with the image URL
    const payload = {
      productName: values.ProductName,
      description: values.Description,
      price: Number(values.Price), // Ensure price is a number
      stockQuantity: Number(values.StockQuantity), // Ensure stockQuantity is a number
      shopId: values.ShopId,
      categoryId: values.CategoryId,
      brand: values.Brand,
      manufactureDate: values.ManufactureDate,
      expiryDate: values.ExpiryDate,
      ParameterImpacts: parameterImpactsObj, // Send as a flat object
      //type: typeValue, // Send the type as an integer (0, 1, or 2)
      image: imageUrl, // Use the image URL instead of base64
    };

    console.log("Create Product Payload:", JSON.stringify(payload, null, 2));

    // Step 4: Send the create-product request
    try {
      const response = await fetch(
        "http://14.225.206.203:8080/api/Product/create-product",
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
        openNotification("success", "Thêm Dụng Cụ Thành Công!");
        dispatch(getListProductManagement());
        handleCancel();
        form.resetFields();
      } else {
        // Try to parse the error as JSON, if possible
        let errorMessage = result;
        try {
          const errorJson = JSON.parse(result);
          errorMessage = errorJson.message || "Failed to create product.";
        } catch (e) {
          // If parsing fails, use the raw text as the error message
          errorMessage = result || "Failed to create product.";
        }
        openNotification("error", errorMessage);
      }
    } catch (error) {
      console.error("Error creating product:", error);
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
        Thêm Dụng Cụ
      </Button>

      <Modal
        className="custom-modal"
        centered
        title="Create New Accessory"
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
              <p className="modalContent">Tên Sản Phẩm</p>
              <Form.Item
                name="ProductName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên sản phẩm!",
                  },
                ]}
              >
                <Input placeholder="Tên Sản Phẩm"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Mô Tả</p>
              <Form.Item
                name="Description"
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
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Giá</p>
              <Form.Item
                name="Price"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá!",
                  },
                ]}
              >
                <Input allowClear placeholder="Giá" type="number"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Số Lượng</p>
              <Form.Item
                name="StockQuantity"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng!",
                  },
                ]}
              >
                <Input allowClear placeholder="Số Lượng" type="number"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Loại</p>
              <Form.Item
                name="CategoryId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại!",
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Loại"
                  style={{ width: "270px" }}
                  loading={isLoadingCategories}
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
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Nhãn Hiệu</p>
              <Form.Item
                name="Brand"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập nhãn hiệu!",
                  },
                ]}
              >
                <Input allowClear placeholder="Nhãn Hiệu"></Input>
              </Form.Item>
            </Col>
            {/* 4th column */}
          </Row>
          {/* 3rd Row */}
          <Row>
            {/* 1st Column */}
            <Col>
              <p className="modalContent">Ngày Sản Xuất</p>
              <Form.Item
                name="ManufactureDate"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày sản xuất!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Ngày Sản Xuất"
                ></DatePicker>
              </Form.Item>
            </Col>
            {/* 2nd Column */}
            <Col style={{ marginLeft: "6px" }}>
              <p className="modalContent">Ngày Hết Hạn</p>
              <Form.Item
                name="ExpiryDate"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày hết hạn!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Ngày Hết Hạn"
                ></DatePicker>
              </Form.Item>
            </Col>
            {/* 3rd Column */}
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
          </Row>
          {/* 4th Row */}
          <Col style={{ marginRight: "6px" }}>
            <p className="modalContent">Tham Số Ảnh Hưởng</p>
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
                              message: "Vui lòng chọn tham số!",
                            },
                          ]}
                        >
                          <Select
                            allowClear
                            style={{ width: "150px" }}
                            placeholder="Tham Số"
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
                      <Col span={5.5}>
                        <Form.Item
                          {...field}
                          name={[field.name, "effect"]}
                          fieldKey={[field.fieldKey, "effect"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn ảnh hưởng!",
                            },
                          ]}
                        >
                          <Select
                            allowClear
                            style={{ width: "160px" }}
                            placeholder="Tăng hoặc giảm"
                          >
                            <Option value="increased">Tăng</Option>
                            <Option value="decreased">Giảm</Option>
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
                      style={{ width: "320px" }}
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm Tham Số Ảnh Hưởng
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
          {/* 5th Row */}
          <Row>
            {/* 1st column */}
            <Col>
              {/* <p className="modalContent">Shop ID</p> */}
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
            <p className="modalContent">Hình Ảnh</p>
            <Form.Item
              name="Image"
              rules={[
                {
                  required: true,
                  message: "Vui lòng upload ảnh!",
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
                  Nhấp hoặc kéo tệp vào khu vực này để tải lên
                </p>
                <p className="ant-upload-hint">
                  Hỗ trợ một tệp hình ảnh duy nhất. Nhấp hoặc kéo để tải lên.
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
                    Bỏ Ảnh
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
                Thêm Dụng Cụ
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddProductManagement;
