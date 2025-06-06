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
import {
  createParameter,
  resetStatus,
} from "../../../redux/slices/parameterSlice";

const { Text, Paragraph } = Typography;
const { Dragger } = Upload;

const AddFishParameter = ({ type = "Fish" }) => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(
    (state) => state.parameterSlice || {}
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [file, setFile] = useState(null);

  const showAddModal = () => {
    setIsModalVisible(true);
    dispatch(resetStatus()); // Reset status when opening the modal
  };

  const handleOk = async () => {
    if (!file) {
      message.error("Vui lòng tải tệp lên trước khi lưu.");
      return;
    }
    try {
      await dispatch(createParameter({ type, file })).unwrap(); // Wait for the action to complete
      // Success handling is moved to useEffect
    } catch (err) {
      // Error handling is moved to useEffect
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFile(null);
    dispatch(resetStatus()); // Reset status when canceling
  };

  // Close the modal on success
  useEffect(() => {
    if (success) {
      setIsModalVisible(false);
      setFile(null);
      message.success("Thông số được tạo thành công!");
      dispatch(resetStatus()); // Reset success after handling
    }
  }, [success]);

  // Show error message if the action fails
  useEffect(() => {
    if (error) {
      message.error("Đã xảy ra lỗi trong quá trình tạo tham số.");
      dispatch(resetStatus()); // Reset error after displaying
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
      message.success(`${file.name} đã được chọn thành công.`);
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
        Thêm Thông Số Cá
      </Button>

      <Modal
        title={`Thêm Thông Số Cá`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy Bỏ
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={loading}
          >
            Lưu
          </Button>,
        ]}
      >
        <Alert
          message="Vui lòng sử dụng các mẫu được cung cấp để cập nhật thông tin nhanh hơn."
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
              1. Tải xuống và điền vào mẫu
            </Paragraph>

            <Button
              type="primary"
              icon={<CloudUploadOutlined style={{ marginRight: "8px" }} />}
              href={`/sample_${type.toLowerCase()}_parameters.xlsx`}
              download
            >
              Tải mẫu thông số {type}
            </Button>
          </Card>

          {/* Second Section */}
          <Card bordered style={{ borderRadius: "4px" }}>
            <Paragraph
              strong
              style={{ fontSize: "16px", marginBottom: "16px" }}
            >
              2. Tải lên mẫu đã hoàn thành
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
                Vui lòng kéo và thả hoặc nhấp vào đây để tải lên tệp Excel có
                chứa thông tin thông số {type.toLowerCase()}.
              </Paragraph>
              <Text
                type="secondary"
                style={{ textAlign: "center", display: "block" }}
              >
                Chỉ chấp nhận các tệp Excel (.xlsx, .xls) theo mẫu đã tải xuống.
              </Text>
            </Dragger>
          </Card>
        </Space>
      </Modal>
    </div>
  );
};

export default AddFishParameter;

// import React, { useState } from "react";
// import {
//   Typography,
//   Alert,
//   Button,
//   Upload,
//   Space,
//   Card,
//   Modal,
//   message,
// } from "antd";
// import {
//   CloudUploadOutlined,
//   InboxOutlined,
//   PlusOutlined,
// } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import { createParameter } from "../../../redux/slices/parameterSlice";

// const { Text, Paragraph } = Typography;
// const { Dragger } = Upload;

// const AddFishParameter = () => {
//   const dispatch = useDispatch();
//   const { loading, success, error } = useSelector(
//     (state) => state.parameterSlice
//   );

//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [file, setFile] = useState(null);

//   const showAddModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleOk = () => {
//     if (!file) {
//       message.error("Please upload a file before saving.");
//       return;
//     }
//     dispatch(createParameter({ type: "Fish", file }));
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   const buttonStyle = {
//     height: "40px",
//     width: "160px",
//     borderRadius: "10px",
//     margin: "0px 5px",
//     padding: "7px 0px 10px 0px",
//   };

//   const uploadProps = {
//     accept: ".xlsx,.xls",
//     beforeUpload: (file) => {
//       setFile(file);
//       message.success(`${file.name} selected successfully.`);
//       return false; // Prevent auto-upload
//     },
//   };

//   return (
//     <div>
//       <Button
//         size="small"
//         className="addBtn"
//         type="primary"
//         icon={<PlusOutlined />}
//         style={buttonStyle}
//         onClick={showAddModal}
//       >
//         Add Parameter
//       </Button>

//       <Modal
//         title="Parameter setting"
//         open={isModalVisible}
//         onOk={handleOk}
//         onCancel={handleCancel}
//         width={800}
//         footer={[
//           <Button key="back" onClick={handleCancel}>
//             Cancel
//           </Button>,
//           <Button key="submit" type="primary" onClick={handleOk}>
//             Save
//           </Button>,
//         ]}
//       >
//         <Alert
//           message="Please use the provided templates to update information faster."
//           type="info"
//           showIcon
//           style={{ marginBottom: "24px" }}
//         />

//         <Space
//           direction="vertical"
//           size="middle"
//           style={{ display: "flex", width: "100%" }}
//         >
//           {/* First Section */}
//           <Card bordered style={{ borderRadius: "4px" }}>
//             <Paragraph
//               strong
//               style={{ fontSize: "16px", marginBottom: "16px" }}
//             >
//               1. Download and fill in the template
//             </Paragraph>

//             {/* <Button
//               type="primary"
//               icon={<CloudUploadOutlined style={{ marginRight: "8px" }} />}
//               onClick={() => {
//                 const link = document.createElement("a");
//                 link.href = "/mnt/data/sample_parameters.xlsx"; // Ensure the correct file path
//                 link.download = "sample_parameters.xlsx"; // Name of the file when downloaded
//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);
//               }}
//             >
//               Download template
//             </Button> */}
//             <Button
//               type="primary"
//               icon={<CloudUploadOutlined style={{ marginRight: "8px" }} />}
//               href="/sample_parameters.xlsx"
//               download
//             >
//               Download template
//             </Button>
//           </Card>

//           {/* Second Section */}
//           <Card bordered style={{ borderRadius: "4px" }}>
//             <Paragraph
//               strong
//               style={{ fontSize: "16px", marginBottom: "16px" }}
//             >
//               2. Upload the completed template
//             </Paragraph>

//             <Dragger
//               {...uploadProps}
//               accept=".xlsx,.xls"
//               showUploadList={false}
//               style={{ background: "white", padding: "32px 0" }}
//             >
//               <p style={{ textAlign: "center" }}>
//                 <InboxOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
//               </p>
//               <Paragraph style={{ textAlign: "center", marginBottom: "8px" }}>
//                 Please drag and drop or click here to upload the Excel file
//                 containing the information.
//               </Paragraph>
//               <Text
//                 type="secondary"
//                 style={{ textAlign: "center", display: "block" }}
//               >
//                 Only Excel files (.xlsx, .xls) following the downloaded template
//                 are accepted.
//               </Text>
//             </Dragger>
//           </Card>
//         </Space>
//       </Modal>
//     </div>
//   );
// };

// export default AddFishParameter;
