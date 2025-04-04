import { EditOutlined, InboxOutlined } from "@ant-design/icons";
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
  Upload,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useDispatch } from "react-redux";
import { getListBlog, updateBlog } from "../../redux/slices/blogSlice";
import { uploadImage } from "../../redux/slices/authSlice";
import { getListProductManagement } from "../../redux/slices/productManagementSlice";

const UpdateBlog = (props) => {
  const { record } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [content, setContent] = useState("");
  const [products, setProducts] = useState([]);
  const [fileList, setFileList] = useState([]); // Thêm state để quản lý file upload

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await dispatch(getListProductManagement()).unwrap();
        console.log("Fetched Products:", result);
        setProducts(result || []); // Store the fetched products, default to empty array if result is undefined
      } catch (error) {
        console.error("Error fetching products:", error);
        openNotification("warning", "Failed to fetch products.");
        setProducts([]); // Set to empty array on error
      }
    };

    fetchProducts();
  }, [dispatch]); // Add dispatch to the dependency array

  const showEditModal = () => {
    form.setFieldsValue({
      ...record,
      productIds: record.products
        ? record.products.map((p) => p.productId)
        : [],
      reportedDate: record.reportedDate ? dayjs(record.reportedDate) : null,
      isApproved: record.isApproved,
    });
    setContent(record.content || "");
    // Initialize fileList based on record.images
    if (record.images) {
      const initialFileList = [
        {
          uid: "-1",
          name: "Hình ảnh đã tải lên",
          status: "done",
          url: record.images,
        },
      ];
      setFileList(initialFileList);
      form.setFieldsValue({ images: record.images });
    } else {
      setFileList([]);
      form.setFieldsValue({ images: null });
    }
    setIsEditOpen(true);
  };

  // const handleEditCancel = () => {
  //   form.resetFields();
  //   setIsEditOpen(false);
  // };

  const handleCancel = () => {
    setContent("");
    setFileList([]); // Reset fileList khi cancel
    setIsEditOpen(false);
  };

  const openNotification = (type, message) => {
    api[type]({
      message: message,
      placement: "top",
      duration: 5,
    });
  };

  // Xử lý thay đổi file upload
  const handleUploadChange = async ({ fileList }) => {
    if (fileList.length === 0) {
      setFileList([]);
      form.setFieldsValue({ images: null });
      return;
    }

    setFileList(fileList);

    const file = fileList[0]?.originFileObj;
    if (!file) return;

    // Step 1: Upload the image using the uploadImage thunk
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResult = await dispatch(uploadImage(formData)).unwrap();
      console.log("Uploaded Image URL:", uploadResult.imageUrl);

      const imageUrl = uploadResult.imageUrl; // Extract the image URL from the response

      if (!imageUrl) {
        throw new Error("Image URL not returned from the server");
      }

      const newFile = {
        uid: "-1",
        name: file.name,
        status: "done",
        url: imageUrl,
      };

      setFileList([newFile]);
      form.setFieldsValue({ images: newFile.url });
    } catch (error) {
      console.error("Upload Error:", error);
      openNotification(
        "warning",
        `Failed to upload image: ${error.message || error}`
      );
      setFileList([]); // Clear the file list on error
      form.setFieldsValue({ images: null });
    }
  };

  const handleEditSubmit = (values) => {
    const latestImage = fileList.length > 0 ? fileList[0].url : record.images;

    const formattedValues = {
      blogId: values.blogId,
      title: values.title,
      content: values.content,
      images: latestImage, // Sử dụng ảnh mới nhất từ fileList
      tag: values.tag,
      isApproved: values.isApproved,
      reportedBy: values.reportedBy,
      reportedDate: values.reportedDate
        ? dayjs(values.reportedDate).toISOString()
        : record.reportedDate && dayjs(record.reportedDate).isValid()
        ? dayjs(record.reportedDate).toISOString()
        : null,
      type: values.type,
      shopId: values.shopId,
      productIds:
        values.productIds ||
        (record.products ? record.products.map((p) => p.productId) : []),
    };

    console.log("Submitting:", formattedValues);
    dispatch(updateBlog(formattedValues))
      .unwrap()
      .then(() => {
        openNotification("success", "Cập Nhật Bài Viết Thành Công!");
        dispatch(getListBlog());
        handleCancel();
        form.resetFields();
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
        title="Edit Blog"
        centered
        open={isEditOpen}
        onCancel={handleCancel}
        footer={null}
        width={870}
      >
        <Form form={form} onFinish={handleEditSubmit}>
          <Row style={{ justifyContent: "space-between" }}>
            <Col>
              <p className="modalContent">Tựa Đề</p>
              <Form.Item
                name="title"
                initialValue={record.title}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tựa đề!",
                  },
                ]}
              >
                <Input placeholder="Tựa Đề"></Input>
              </Form.Item>
            </Col>
            <Col>
              <p className="modalContent">Tag</p>
              <Form.Item
                name="tag"
                initialValue={record.tag}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tag!",
                  },
                ]}
              >
                <Input disabled placeholder="Tag"></Input>
              </Form.Item>
            </Col>
            <Col>
              <p className="modalContent">Trạng Thái</p>
              <Form.Item
                name="isApproved"
                initialValue={record.isApproved}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trạng thái!",
                  },
                ]}
              >
                <Select placeholder="Status">
                  <Select.Option value={true}>Chấp Nhận</Select.Option>
                  <Select.Option value={false}>Từ Chối</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Các phần còn lại giữ nguyên */}
          <Row>
            <Col>
              <p className="modalContent">Loại</p>
              <Form.Item
                name="type"
                initialValue={record.type}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập loại!",
                  },
                ]}
              >
                <Input placeholder="Loại"></Input>
              </Form.Item>
            </Col>
            <Col style={{ marginLeft: "6px" }}>
              <p className="modalContent">Tên Sản Phẩm</p>
              <Form.Item
                name="productIds"
                initialValue={
                  record.products ? record.products.map((p) => p.productId) : []
                }
              >
                <Select allowClear mode="multiple" placeholder="Chọn Sản Phẩm">
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
          </Row>

          <Row style={{ justifyContent: "space-between" }}>
            <Col>
              {/* <p className="modalContent">Shop ID</p> */}
              <Form.Item
                name="shopId"
                initialValue={record.shopId}
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
            <Col>
              {/* <p className="modalContent">Blog ID</p> */}
              <Form.Item
                name="blogId"
                initialValue={record.blogId}
                rules={[
                  {
                    required: true,
                    message: "Please enter package title!",
                  },
                ]}
              >
                <Input hidden disabled placeholder="Blog ID"></Input>
              </Form.Item>
            </Col>
          </Row>

          <Col>
            <p className="modalContent">Hình Ảnh</p>
            <Form.Item
              name="images"
              rules={[
                {
                  required: true,
                  message: "Vui lòng tải lên hình ảnh!",
                },
              ]}
            >
              <Upload.Dragger
                fileList={fileList}
                beforeUpload={() => false} // Ngăn upload tự động
                onChange={handleUploadChange}
                multiple={false}
                accept="image/*"
                listType="picture"
              >
                {fileList.length === 0 ? (
                  <>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Nhấp hoặc kéo tệp để tải lên
                    </p>
                  </>
                ) : null}
              </Upload.Dragger>
            </Form.Item>
          </Col>

          <Row>
            <Col>
              <p className="modalContent">Nội Dung</p>
              <Form.Item
                name="content"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập nội dung!",
                  },
                ]}
              >
                <ReactQuill
                  style={{ width: "820px", height: "100px" }}
                  value={content}
                  onChange={(value) => {
                    setContent(value);
                    form.setFieldsValue({ content: value });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-2 mt-10">
            <Button
              style={{
                width: "100px",
                height: "40px",
                padding: "8px",
                borderRadius: "10px",
              }}
              onClick={handleCancel}
            >
              Hủy Bỏ
            </Button>
            <Button
              style={{
                width: "100px",
                height: "40px",
                padding: "8px",
                borderRadius: "10px",
                backgroundColor: "orange",
              }}
              type="primary"
              htmlType="submit"
            >
              Chỉnh Sửa
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateBlog;
