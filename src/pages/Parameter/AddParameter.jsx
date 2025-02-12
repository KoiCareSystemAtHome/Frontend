import React, { useState } from "react";
import { Button, Modal, Upload, Alert, message } from "antd";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const AddParameter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: ".xlsx,.xls",
    action: "https://your-upload-endpoint.com", // Replace with your upload endpoint
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={showModal}
        size="large"
        icon={<PlusOutlined />}
      >
        Add Parameter
      </Button>

      <Modal
        title="Upload Files"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
      >
        <div className="space-y-6">
          <Alert
            message="Templates are provided to help you quickly fill in number information."
            type="info"
            showIcon
          />

          <div className="space-y-2">
            <h2 className="text-base font-medium">
              1. Download and fill in the template
            </h2>
            <Button type="primary" size="large">
              Download template
            </Button>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-medium">
              2. Upload completed template
            </h2>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="text-4xl text-blue-500" />
              </p>
              <p className="ant-upload-text">
                Click or drag file here to upload Excel file
              </p>
              <p className="ant-upload-hint">
                Only Excel files (.xlsx, .xls) according to template format
              </p>
            </Dragger>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddParameter;
