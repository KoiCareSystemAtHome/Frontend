import React, { useState } from "react";
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
import { CloudUploadOutlined, InboxOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createParameter } from "../../../redux/slices/parameterSlice";

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

const AddFishParameter = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(
    (state) => state.parameterSlice
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [file, setFile] = useState(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (!file) {
      message.error("Please upload a file before saving.");
      return;
    }
    dispatch(createParameter({ type: "Fish", file }));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
      <Button type="primary" onClick={showModal}>
        Open Parameter Settings
      </Button>

      <Modal
        title="Parameter setting"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
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

            {/* <Button
              type="primary"
              icon={<CloudUploadOutlined style={{ marginRight: "8px" }} />}
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/mnt/data/sample_parameters.xlsx"; // Ensure the correct file path
                link.download = "sample_parameters.xlsx"; // Name of the file when downloaded
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download template
            </Button> */}
            <Button
              type="primary"
              icon={<CloudUploadOutlined style={{ marginRight: "8px" }} />}
              href="/sample_parameters.xlsx"
              download
            >
              Download template
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
                containing the information.
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

export default AddFishParameter;
