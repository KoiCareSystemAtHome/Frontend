import React, { useState, useEffect } from "react";
import {
  Typography,
  Alert,
  Button,
  Upload,
  Space,
  Card,
  Modal,
  message,
} from "antd";
import {
  CloudUploadOutlined,
  InboxOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createParameter } from "../../../redux/slices/parameterSlice";

const { Text, Paragraph } = Typography;
const { Dragger } = Upload;

const AddPondParameter = ({ type = "Pond" }) => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(
    (state) => state.parameter || {}
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [file, setFile] = useState(null);

  const showAddModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (!file) {
      message.error("Please upload a file before saving.");
      return;
    }
    dispatch(createParameter({ type, file }));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFile(null);
  };

  // Close the modal on success
  useEffect(() => {
    if (success) {
      setIsModalVisible(false);
      setFile(null);
      message.success("Parameter created successfully!");
    }
  }, [success]);

  // Show error message if the action fails
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const buttonStyle = {
    height: "40px",
    width: "160px",
    borderRadius: "10px",
    margin: "0px 5px",
    padding: "7px 0px 10px 0px",
  };

  const uploadProps = {
    accept: ".xlsx,.xls",
    beforeUpload: (file) => {
      setFile(file);
      message.success(`${file.name} selected successfully.`);
      return false; // Prevent auto-upload
    },
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
        Add {type} Parameter
      </Button>

      <Modal
        title={`${type} Parameter Setting`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={loading}
          >
            Save
          </Button>,
        ]}
      >
        <Alert
          message="Please use the provided templates to update information faster."
          type="info"
          showIcon
          style={{ marginBottom: "24px" }}
        />

        <Space
          direction="vertical"
          size="middle"
          style={{ display: "flex", width: "100%" }}
        >
          {/* First Section */}
          <Card bordered style={{ borderRadius: "4px" }}>
            <Paragraph
              strong
              style={{ fontSize: "16px", marginBottom: "16px" }}
            >
              1. Download and fill in the template
            </Paragraph>

            <Button
              type="primary"
              icon={<CloudUploadOutlined style={{ marginRight: "8px" }} />}
              href={`/sample_${type.toLowerCase()}_parameters.xlsx`}
              download
            >
              Download {type} Template
            </Button>
          </Card>

          {/* Second Section */}
          <Card bordered style={{ borderRadius: "4px" }}>
            <Paragraph
              strong
              style={{ fontSize: "16px", marginBottom: "16px" }}
            >
              2. Upload the completed template
            </Paragraph>

            <Dragger
              {...uploadProps}
              accept=".xlsx,.xls"
              showUploadList={false}
              style={{ background: "white", padding: "32px 0" }}
            >
              <p style={{ textAlign: "center" }}>
                <InboxOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
              </p>
              <Paragraph style={{ textAlign: "center", marginBottom: "8px" }}>
                Please drag and drop or click here to upload the Excel file
                containing the {type.toLowerCase()} information.
              </Paragraph>
              <Text
                type="secondary"
                style={{ textAlign: "center", display: "block" }}
              >
                Only Excel files (.xlsx, .xls) following the downloaded template
                are accepted.
              </Text>
            </Dragger>
          </Card>
        </Space>
      </Modal>
    </div>
  );
};

export default AddPondParameter;
