import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Tag,
  Typography,
  Spin,
  Button,
  Input,
  Select,
  Upload,
  message,
  List,
  Space,
} from "antd";
import {
  EditOutlined,
  LeftOutlined,
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getBlogDetail,
  getListBlog,
  updateBlog,
} from "../../redux/slices/blogSlice";
import parse from "html-react-parser";
import axios from "axios";
import { uploadImage } from "../../redux/slices/authSlice";

const { Paragraph } = Typography;
const { Option } = Select;

function BlogDetail() {
  const navigate = useNavigate();
  const { blogId } = useParams();
  const dispatch = useDispatch();

  const {
    blogDetail: blog,
    loading,
    error,
  } = useSelector((state) => state.blogSlice || {});

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    title: "",
    images: "",
    tag: "",
    isApproved: "",
    type: "",
    shopId: "",
    products: [],
  });
  const [originalData, setOriginalData] = useState({});
  const [uploading, setUploading] = useState(false); // For blog image upload
  const [productUploading, setProductUploading] = useState({}); // Track upload status for each product

  useEffect(() => {
    console.log("Fetching blog details for ID:", blogId);
    if (blogId) {
      dispatch(getBlogDetail(blogId)).then((res) => {
        console.log("Fetched Blog Detail:", res);
        if (res.payload) {
          const blogData = {
            content: res.payload.content || "",
            title: res.payload.title || "",
            images: res.payload.images || "",
            tag:
              res.payload.tag ||
              (res.payload.isApproved ? "Approved" : "Rejected"),
            isApproved: res.payload.isApproved ? "true" : "false",
            type: res.payload.type || "",
            shopId: res.payload.shopId || "",
            products: res.payload.products || [],
          };
          setFormData(blogData);
          setOriginalData(blogData);
        }
      });
    }
  }, [dispatch, blogId]);

  const handleInputChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleSelectChange = (value, field) => {
    if (field === "isApproved") {
      const newTag = value === "true" ? "Approved" : "Rejected";
      setFormData({
        ...formData,
        [field]: value,
        tag: newTag,
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  // Handle product field changes
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      products: updatedProducts,
    });
  };

  // Add a new product
  const handleAddProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        { productId: "", name: "", price: 0, image: "" },
      ],
    });
  };

  // Remove a product
  const handleRemoveProduct = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      products: updatedProducts,
    });
  };

  // Handle blog image upload using uploadImage thunk
  const handleImageUpload = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      setUploading(true);
      const result = await dispatch(uploadImage(formDataUpload)).unwrap();
      const imageURL = result.imageUrl; // Adjust based on actual response structure
      setFormData({
        ...formData,
        images: imageURL,
      });
    } catch (error) {
      console.error("Error uploading blog image:", error);
    } finally {
      setUploading(false);
    }
  };

  // Handle product image upload using uploadImage thunk
  const handleProductImageUpload = async (file, index) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      setProductUploading((prev) => ({ ...prev, [index]: true }));
      const result = await dispatch(uploadImage(formDataUpload)).unwrap();
      const imageURL = result.imageUrl; // Adjust based on actual response structure
      const updatedProducts = [...formData.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        image: imageURL,
      };
      setFormData({
        ...formData,
        products: updatedProducts,
      });
    } catch (error) {
      console.error(
        `Error uploading product image for product ${index + 1}:`,
        error
      );
    } finally {
      setProductUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(originalData);
  };

  // Handle blog update using updateBlog thunk
  const handleSave = async () => {
    try {
      const updatedBlog = {
        blogId: blogId,
        content: formData.content,
        title: formData.title,
        images: formData.images,
        tag: formData.tag,
        isApproved: formData.isApproved === "true",
        type: formData.type,
        shopId: formData.shopId,
        products: formData.products,
      };

      await dispatch(updateBlog(updatedBlog)).unwrap();
      message.success("Bài Viết đã được cập nhật thành công.!");
      await dispatch(getBlogDetail(blogId));
      await dispatch(getListBlog());
      setIsEditing(false);
      setOriginalData(formData);
    } catch (error) {
      console.error("Error updating blog:", error);
      message.error("Error updating blog: " + (error || "Unknown error"));
    }
  };

  return (
    <Card>
      <div>
        <div className="flex justify-between align-content-start">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate("/shop/blog")}
            className="flex items-center"
          >
            Trang Chủ
          </Button>
          {isEditing ? (
            <div>
              <Button
                type="primary"
                onClick={handleSave}
                style={{ marginRight: 8 }}
              >
                Lưu
              </Button>
              <Button onClick={handleCancel}>Hủy Bỏ</Button>
            </div>
          ) : (
            <Button
              icon={<EditOutlined />}
              style={{ backgroundColor: "orange", color: "white" }}
              onClick={handleEdit}
            >
              Chỉnh Sửa
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mt-10">
          {error || "Failed to load data"}
        </div>
      ) : (
        <div>
          <div className="max-w-8xl mx-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                {isEditing ? (
                  <div className="mb-4">
                    <Upload
                      beforeUpload={(file) => {
                        handleImageUpload(file);
                        return false;
                      }}
                      showUploadList={false}
                    >
                      <Button
                        icon={<UploadOutlined />}
                        loading={uploading}
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Upload Blog Image"}
                      </Button>
                    </Upload>
                  </div>
                ) : null}
                <img
                  src={formData.images}
                  alt={blog?.name || "Blog Image"}
                  className="w-full rounded-lg shadow-md"
                />
              </div>

              <div className="md:w-1/2">
                <div className="mb-6">
                  {isEditing ? (
                    <>
                      <Input
                        value={formData.title}
                        onChange={(e) => handleInputChange(e, "title")}
                        placeholder="Blog Title"
                        className="mb-4"
                      />
                      <Input.TextArea
                        rows={4}
                        value={formData.content}
                        onChange={(e) => handleInputChange(e, "content")}
                        placeholder="Blog Content"
                        className="pl-4 mt-2"
                      />
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                        {formData.title || "No title available."}
                      </div>
                      <Paragraph className="pl-4 mt-2">
                        {formData.content
                          ? parse(formData.content)
                          : "No content available."}
                      </Paragraph>
                    </>
                  )}
                </div>
                <Tag
                  className="ml-4"
                  color={
                    formData.tag === "Pending"
                      ? "yellow"
                      : formData.tag === "Approved"
                      ? "green"
                      : "red"
                  }
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    borderRadius: "8px",
                  }}
                >
                  {formData.tag}
                </Tag>
              </div>
            </div>
          </div>

          <Tag
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "8px",
              margin: "-10px 0 0 24px",
            }}
          >
            {formData.type}
          </Tag>

          {/* Products Section */}
          <div className="mt-6">
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginLeft: "25px",
              }}
            >
              Sản Phẩm
            </h3>
            {isEditing ? (
              <>
                <List
                  dataSource={formData.products}
                  renderItem={(product, index) => (
                    <List.Item
                      actions={[
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveProduct(index)}
                          danger
                        />,
                      ]}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Input
                          placeholder="Product ID"
                          value={product.productId}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "productId",
                              e.target.value
                            )
                          }
                          style={{ marginBottom: 8 }}
                        />
                        <Input
                          placeholder="Product Name"
                          value={product.name}
                          onChange={(e) =>
                            handleProductChange(index, "name", e.target.value)
                          }
                          style={{ marginBottom: 8 }}
                        />
                        <Input
                          placeholder="Price"
                          type="number"
                          value={product.price}
                          onChange={(e) =>
                            handleProductChange(index, "price", e.target.value)
                          }
                          style={{ marginBottom: 8 }}
                        />
                        <Upload
                          beforeUpload={(file) => {
                            handleProductImageUpload(file, index);
                            return false; // Prevent automatic upload by Upload component
                          }}
                          showUploadList={false}
                        >
                          <Button
                            icon={<UploadOutlined />}
                            loading={productUploading[index] || false}
                            disabled={productUploading[index] || false}
                          >
                            {productUploading[index]
                              ? "Uploading..."
                              : "Upload Product Image"}
                          </Button>
                        </Upload>
                        {product.image && (
                          <div style={{ marginTop: 8 }}>
                            <img
                              src={product.image}
                              alt={`Product ${index + 1}`}
                              style={{
                                width: 100,
                                height: 100,
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        )}
                      </Space>
                    </List.Item>
                  )}
                />
                <Button
                  type="dashed"
                  onClick={handleAddProduct}
                  icon={<PlusOutlined />}
                  style={{ width: "100%", marginTop: 16 }}
                >
                  Thêm Sản Phẩm
                </Button>
              </>
            ) : (
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={formData.products}
                renderItem={(product) => (
                  <List.Item>
                    <Card
                      cover={<img alt={product.name} src={product.image} />}
                      style={{ width: 300 }}
                    >
                      <Card.Meta
                        title={product.name}
                        description={`Price: ${product.price} đ`}
                      />
                    </Card>
                  </List.Item>
                )}
              />
            )}
          </div>

          {/* <div className="mt-2">
            {isEditing ? (
              <>
                <Input
                  value={formData.type}
                  onChange={(e) => handleInputChange(e, "type")}
                  placeholder="Blog Type"
                  style={{ width: 200, marginRight: 16 }}
                />
                <Input
                  hidden
                  value={formData.shopId}
                  onChange={(e) => handleInputChange(e, "shopId")}
                  placeholder="Shop ID"
                  style={{ width: 200, marginRight: 16 }}
                />
                <Select
                  value={formData.isApproved}
                  onChange={(value) => handleSelectChange(value, "isApproved")}
                  style={{ width: 200 }}
                >
                  <Option value="true">Chấp Nhận</Option>
                  <Option value="false">Từ Chối</Option>
                </Select>
              </>
            ) : (
              <Tag
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  margin: "-10px 0 0 24px",
                }}
              >
                {formData.type}
              </Tag>
            )}
          </div> */}
        </div>
      )}
    </Card>
  );
}

export default BlogDetail;
