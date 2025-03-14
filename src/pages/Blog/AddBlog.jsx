import React, { useCallback, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Modal,
  Row,
  Col,
  DatePicker,
  Select,
  notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createBlog, getListBlog } from "../../redux/slices/blogSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddBlog = ({ onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [content, setContent] = useState(""); // State for blog content

  const showAddModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const buttonStyle = {
    height: "40px",
    width: "160px",
    borderRadius: "10px",
    margin: "0px 5px",
    padding: "7px 0px 10px 0px",
  };

  const handleUploadChange = (info) => {
    if (info.file.status === "done") {
      // Assuming the response contains the uploaded image URL
      setImageUrl(info.file.response.url);
    }
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

  const onFinish = (values) => {
    const { blogId, isApproved, productIds, ...requestedData } = values;

    const formattedData = {
      ...requestedData,
      isApproved: isApproved === "true", // Convert string to boolean
    };

    // Ensure productIds is an array of GUIDs (not a single string or comma-separated values)
    requestedData.productIds = productIds
      ? productIds.split(",").map((id) => id.trim()) // Ensure it's an array of trimmed GUIDs
      : [];

    console.log(formattedData);

    dispatch(createBlog(formattedData))
      .unwrap()
      .then(() => {
        openNotification("success", "Blog Created Successfully!");
        dispatch(getListBlog());
        handleCancel();
        form.resetFields();
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
        title="Create new Blog"
        centered
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={870}
      >
        <Form form={form} onFinish={onFinish}>
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Blog Title</p>
              <Form.Item
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please enter package title!",
                  },
                ]}
              >
                <Input placeholder="Blog Title"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Image</p>
              <Form.Item
                name="images"
                rules={[
                  {
                    required: true,
                    message: "Please select image!",
                  },
                ]}
              >
                <Input placeholder="Image"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
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
                <Input placeholder="Tag"></Input>
              </Form.Item>
            </Col>
          </Row>

          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
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
                <Select placeholder="Status">
                  <Select.Option value="true">Approved</Select.Option>
                  <Select.Option value="false">Rejected</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Type</p>
              <Form.Item
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please select type!",
                  },
                ]}
              >
                <Input placeholder="Type"></Input>
              </Form.Item>
            </Col>
            {/* 1st Column */}
            <Col>
              <p className="modalContent">Reported By</p>
              <Form.Item
                name="reportedBy"
                rules={[
                  {
                    required: true,
                    message: "Please input reporter!",
                  },
                ]}
              >
                <Input placeholder="Reporter"></Input>
              </Form.Item>
            </Col>
          </Row>

          {/* 3rd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st Column */}
            <Col>
              <p className="modalContent">Shop ID</p>
              <Form.Item
                name="shopId"
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
            {/* 2nd Column */}
            <Col>
              <p className="modalContent">Product ID</p>
              <Form.Item
                name="productIds"
                rules={[
                  {
                    required: true,
                    message: "Please input product ID!",
                  },
                ]}
              >
                <Input placeholder="Product ID"></Input>
              </Form.Item>
            </Col>
            {/* 3rd Column */}
            <Col>
              <p className="modalContent">Reported Date</p>
              <Form.Item
                name="reportedDate"
                rules={[
                  {
                    required: true,
                    message: "Please select reported date!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Reported Date"
                ></DatePicker>
              </Form.Item>
            </Col>
          </Row>

          {/* 4th Row */}
          <Row>
            <Col>
              <p className="modalContent">Blog Content</p>
              <Form.Item
                name="content"
                rules={[
                  {
                    required: true,
                    message: "Please enter blog content!",
                  },
                ]}
              >
                {/* <Input placeholder="Blog Content"></Input> */}
                <ReactQuill
                  style={{ width: "820px", height: "100px" }}
                  value={content}
                  onChange={setContent}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Buttons */}
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
              Cancel
            </Button>
            <Button
              style={{
                width: "100px",
                height: "40px",
                padding: "8px",
                borderRadius: "10px",
              }}
              type="primary"
              htmlType="submit"
            >
              Create Blog
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AddBlog;
