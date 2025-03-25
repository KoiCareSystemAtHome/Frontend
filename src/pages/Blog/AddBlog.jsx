import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Upload,
} from "antd";
import { PlusOutlined, InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createBlog, getListBlog } from "../../redux/slices/blogSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddBlog = ({ onClose }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Store the selected file
  const [previewUrl, setPreviewUrl] = useState(null); // Store the preview URL
  const [fileList, setFileList] = useState([]); // Control the Upload.Dragger file list
  const [content, setContent] = useState(""); // State for blog content
  const [products, setProducts] = useState([]); // State to store fetched products
  const loggedInUser = useSelector((state) => state.authSlice.user);
  const currentShopId = loggedInUser?.shopId;

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://14.225.206.203:8080/api/Product", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if required
            // "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data); // Store the fetched products
      } catch (error) {
        console.error("Error fetching products:", error);
        notification.error({
          message: "Failed to fetch products",
          description: error.message,
        });
      }
    };

    fetchProducts();
  }, []);

  const showAddModal = () => {
    form.setFieldsValue({
      shopId: currentShopId,
      isApproved: "false",
      tag: "Pending",
    });
    console.log("shopId:", currentShopId);
    setIsAddOpen(true);
  };

  const handleCancel = () => {
    setIsAddOpen(false);
    setSelectedImage(null); // Clear selected image on cancel
    setPreviewUrl(null); // Clear preview on cancel
    setFileList([]); // Clear file list on cancel
    setContent(""); // Clear content
    form.resetFields();
  };

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

  // Set initial shopId and status
  useEffect(() => {
    if (currentShopId) {
      form.setFieldsValue({
        shopId: currentShopId,
        isApproved: "false",
        tag: "Pending",
      });
    }
  }, [currentShopId, form]);

  // Handle image upload and preview
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

    // Log the selected image to verify
    console.log("Selected Image:", selectedImage);

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
        const errorText = await uploadResponse.text();
        console.error(
          "Upload Response Error:",
          uploadResponse.status,
          errorText
        );
        throw new Error(
          `Failed to upload image: ${uploadResponse.status} ${errorText}`
        );
      }

      const uploadResult = await uploadResponse.json();
      console.log("Upload Response:", uploadResult);

      imageUrl = uploadResult.imageUrl; // Note: The response field is "imageURL" as per the second image

      if (!imageUrl) {
        throw new Error("Image URL not returned from the server");
      }

      console.log("Image URL:", imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error.message);
      openNotification(
        "error",
        `Failed to upload image: ${error.message}. Please try again.`
      );
      return;
    }

    // Step 2: Construct the payload for create-blog with the image URL
    const payload = {
      title: values.title,
      content: content, // Use the content from ReactQuill
      images: imageUrl, // Use the image URL
      tag: values.tag,
      isApproved: values.isApproved === "true", // Convert string to boolean
      type: values.type,
      shopId: values.shopId,
      // productIds: values.productIds
      //   ? values.productIds.split(",").map((id) => id.trim()) // Convert comma-separated string to array
      //   : [],
      productIds: values.productIds || [], // Use the array directly, no need to split
    };

    console.log("Create Blog Payload:", JSON.stringify(payload, null, 2));

    // Step 3: Dispatch the createBlog action
    dispatch(createBlog(payload))
      .unwrap()
      .then(() => {
        openNotification("success", "Blog Created Successfully!");
        dispatch(getListBlog());
        handleCancel();
        onClose();
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
      {contextHolder}
      <Button
        size="small"
        className="addBtn"
        type="primary"
        icon={<PlusOutlined />}
        style={buttonStyle}
        onClick={showAddModal}
      >
        Create New Blog
      </Button>

      <Modal
        className="custom-modal"
        centered
        title="Create New Blog"
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
              <p className="modalContent">Blog Title</p>
              <Form.Item
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please enter blog title!",
                  },
                ]}
              >
                <Input placeholder="Blog Title" />
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Tag</p>
              <Form.Item
                name="tag"
                rules={[
                  {
                    required: true,
                    message: "Please input tag!",
                  },
                ]}
              >
                <Input placeholder="Tag" />
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Status</p>
              <Form.Item
                name="isApproved"
                rules={[
                  {
                    required: true,
                    message: "Please select status!",
                  },
                ]}
              >
                <Select placeholder="Status" style={{ width: "270px" }}>
                  <Select.Option value="true">Approved</Select.Option>
                  <Select.Option value="false">Rejected</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* 2nd Row */}
          <Row>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Type</p>
              <Form.Item
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please input type!",
                  },
                ]}
              >
                <Input placeholder="Type" />
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col style={{ marginLeft: "6px" }}>
              <p className="modalContent">Product</p>
              <Form.Item
                name="productIds"
                rules={[
                  {
                    required: true,
                    message: "Please select product!",
                  },
                ]}
              >
                <Select
                  mode="multiple" // Allow multiple selections
                  placeholder="Select products"
                  style={{ width: "270px" }}
                  optionFilterProp="children" // Enable search by product name
                  showSearch
                >
                  {products.map((product) => (
                    <Select.Option
                      key={product.productId}
                      value={product.productId}
                    >
                      {product.productName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              {/* <p className="modalContent">Shop ID</p> */}
              <Form.Item
                name="shopId"
                rules={[
                  {
                    required: true,
                    message: "Please input shop ID!",
                  },
                ]}
              >
                <Input hidden placeholder="Shop ID" />
              </Form.Item>
            </Col>
          </Row>

          {/* 3rd Row */}
          <Row>
            <Col>
              <p className="modalContent">Blog Content</p>
              <Form.Item
                name="content"
                rules={[
                  {
                    required: true,
                    message: "Please enter blog content!",
                    validator: () => {
                      if (!content) {
                        return Promise.reject("Please enter blog content!");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <ReactQuill
                  style={{
                    width: "820px",
                    height: "100px",
                    marginBottom: "40px",
                  }}
                  value={content}
                  onChange={setContent}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 4th Row */}
          <Col>
            <p className="modalContent">Image (Optional)</p>
            <Form.Item name="Image">
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

          {/* Submit Button */}
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
                Create Blog
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddBlog;
