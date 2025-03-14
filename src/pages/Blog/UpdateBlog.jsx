import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Popover,
  Row,
  Select,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { useDispatch } from "react-redux";
import { updateBlog } from "../../redux/slices/blogSlice";

const UpdateBlog = (props) => {
  const { record } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [content, setContent] = useState(""); // State for blog content
  const [quillKey, setQuillKey] = useState(0);

  const openModal = () => {
    setQuillKey((prev) => prev + 1); // 🔥 Generate a new key each time
    setIsEditOpen(true);
  };

  const showEditModal = () => {
    form.setFieldsValue({
      ...record,
      productIds: record.productIds,
      reportedDate: record.reportedDate ? dayjs(record.reportedDate) : null, // Convert date if needed
      isApproved: record.isApproved ? "true" : "false", // Ensure it's a string for Select
    });
    setContent(record.content || ""); // Ensure content is set before opening modal
    setIsEditOpen(true);
  };

  const handleEditCancel = () => {
    form.resetFields();
    setIsEditOpen(false);
  };

  const handleCancel = () => {
    setContent(""); // Reset content
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
    const formattedValues = {
      ...values,
      blogId: values.blogId, // ✅ Ensure the ID is included
      productIds: Array.isArray(values.productIds)
        ? values.productIds
        : values.productIds.split(",").map((id) => id.trim()),
      isApproved: values.isApproved === "true" || values.isApproved === true, // ✅ Convert to boolean
    };

    console.log("Submitting:", formattedValues);
    dispatch(updateBlog(formattedValues)); // Adjust according to your Redux action
  };

  return (
    <div>
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
            {/* 1st column */}
            <Col>
              <p className="modalContent">Blog ID</p>
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
                <Input disabled placeholder="Blog ID"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Blog Title</p>
              <Form.Item
                name="title"
                initialValue={record.title}
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
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Image</p>
              <Form.Item
                name="images"
                initialValue={record.images}
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
          </Row>

          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Tag</p>
              <Form.Item
                name="tag"
                initialValue={record.tag}
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
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Status</p>
              <Form.Item
                name="isApproved"
                initialValue={record.isApproved}
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
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Type</p>
              <Form.Item
                name="type"
                initialValue={record.type}
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
          </Row>

          {/* 3rd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st Column */}
            <Col>
              <p className="modalContent">Reported By</p>
              <Form.Item
                name="reportedBy"
                initialValue={record.reportedBy}
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
            {/* 2nd Column */}
            <Col>
              <p className="modalContent">Shop ID</p>
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
                <Input placeholder="Shop ID"></Input>
              </Form.Item>
            </Col>
            {/* 3rd Column */}
            <Col>
              <p className="modalContent">Product ID</p>
              <Form.Item
                name="productIds"
                initialValue={record.productIds}
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
          </Row>

          {/* 4th Row */}
          <Row>
            <Col>
              <p className="modalContent">Reported Date</p>
              <Form.Item
                name="reportedDate"
                initialValue={record.reportedDate}
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

          {/* 5th Row */}
          <Row>
            <Col>
              <p className="modalContent">Blog Content</p>
              <Form.Item
                name="content"
                //initialValue={record.content}
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
                  onChange={(value) => {
                    setContent(value);
                    form.setFieldsValue({ content: value });
                  }}
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
              onClick={handleCancel}
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
              Edit Blog
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateBlog;
