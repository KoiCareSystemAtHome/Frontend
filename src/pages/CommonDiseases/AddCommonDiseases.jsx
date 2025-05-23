// import { DeleteOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
// import {
//   Button,
//   Col,
//   Form,
//   Input,
//   Modal,
//   notification,
//   Row,
//   Select,
//   Upload,
// } from "antd";
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import {
//   createDisease,
//   getListDisease,
// } from "../../redux/slices/diseasesSlice";
// import axios from "axios";
// import { uploadImage } from "../../redux/slices/authSlice";

// const AddCommonDiseases = ({ onClose }) => {
//   const [isAddOpen, setIsAddOpen] = useState(false);
//   const [fileList, setFileList] = useState([]); // To store the uploaded file
//   const [selectedImage, setSelectedImage] = useState(null); // Store the selected file
//   const [previewUrl, setPreviewUrl] = useState(null); // Store the preview URL
//   const [medicines, setMedicines] = useState([]); // State to store medicines

//   const showAddModal = () => {
//     setIsAddOpen(true);
//   };

//   const handleCancel = () => {
//     setIsAddOpen(false);
//     setFileList([]); // Clear file list on cancel
//     setSelectedImage(null); // Clear selected image on cancel
//     setPreviewUrl(null); // Clear preview on cancel
//   };

//   const dispatch = useDispatch();
//   const [form] = Form.useForm();

//   const buttonStyle = {
//     height: "40px",
//     width: "160px",
//     borderRadius: "10px",
//     margin: "0px 5px",
//     padding: "7px 0px 10px 0px",
//   };

//   // Notification
//   const [api, contextHolder] = notification.useNotification();

//   const openNotification = (type, message) => {
//     api[type]({
//       message: message,
//       placement: "top",
//       duration: 5,
//     });
//   };

//   // Fetch medicines when the modal opens
//   useEffect(() => {
//     if (isAddOpen) {
//       const fetchMedicines = async () => {
//         try {
//           const response = await axios.get("https://loco.com.co/all-medicine");
//           setMedicines(response.data);
//         } catch (error) {
//           console.error("Failed to fetch medicines:", error);
//           openNotification("error", "Failed to load medicines");
//         }
//       };
//       fetchMedicines();
//     }
//   }, [isAddOpen]);

//   // Handle file selection and preview (before upload)
//   const beforeUpload = (file) => {
//     // Validate file type (optional)
//     const isImage = file.type.startsWith("image/");
//     if (!isImage) {
//       openNotification("error", "Bạn chỉ có thể tải lên file hình ảnh!");
//       return false;
//     }

//     setSelectedImage(file); // Save file for later upload
//     //setFileList([file]); // Update file list for Upload.Dragger

//     // Generate a preview URL
//     const reader = new FileReader();
//     reader.onload = () => {
//       setPreviewUrl(reader.result); // Set the preview URL
//     };
//     reader.onerror = () => {
//       openNotification("error", "Failed to preview the image.");
//     };
//     reader.readAsDataURL(file);

//     return false; // Prevent automatic upload
//   };

//   // Function to remove the selected image and clear the preview
//   const handleRemoveImage = () => {
//     setSelectedImage(null);
//     setPreviewUrl(null);
//     setFileList([]); // Clear the file list
//     form.setFieldsValue({ image: undefined }); // Clear the form field
//   };

//   // Handle removal directly from Upload.Dragger
//   const handleUploadRemove = () => {
//     handleRemoveImage(); // Call the same remove function to keep everything in sync
//     return true; // Allow the removal
//   };

//   // Updated onFinish to use uploadImage thunk
//   const onFinish = async (values) => {
//     if (!selectedImage) {
//       openNotification("error", "Please upload an image!");
//       return;
//     }

//     // Step 1: Upload the image using the uploadImage thunk
//     let imageUrl;
//     try {
//       const formData = new FormData();
//       formData.append("file", selectedImage);

//       // Dispatch the uploadImage thunk
//       const uploadResult = await dispatch(uploadImage(formData)).unwrap();
//       imageUrl = uploadResult.imageUrl; // Assuming the response contains imageUrl

//       if (!imageUrl) {
//         throw new Error("Image URL not returned from the server");
//       }

//       console.log("Image URL:", imageUrl);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       openNotification("error", "Failed to upload image. Please try again.");
//       return;
//     }

//     // Step 2: Construct the payload with the image URL
//     const payload = {
//       ...values,
//       image: imageUrl, // Use the uploaded image URL
//     };

//     console.log("Payload sent to createDisease:", payload);

//     // Step 3: Dispatch the createDisease action
//     dispatch(createDisease(payload))
//       .unwrap()
//       .then(() => {
//         onClose();
//         openNotification("success", "Bệnh Thêm Thành Công!");
//         dispatch(getListDisease());
//         handleCancel();
//         form.resetFields();
//       })
//       .catch((error) => {
//         openNotification(
//           "warning",
//           error.message || "Failed to create disease"
//         );
//       });
//   };

//   return (
//     <div>
//       {contextHolder}
//       <Button
//         size="small"
//         className="addBtn"
//         type="primary"
//         icon={<PlusOutlined />}
//         style={buttonStyle}
//         onClick={showAddModal}
//       >
//         Thêm Bệnh
//       </Button>

//       <Modal
//         className="custom-modal"
//         centered
//         title="Thêm Bệnh Mới"
//         open={isAddOpen}
//         onCancel={handleCancel}
//         width={870}
//         footer={null}
//       >
//         <Form form={form} onFinish={onFinish}>
//           {/* 1st Row */}
//           <Row style={{ justifyContent: "space-between" }}>
//             {/* 1st column */}
//             <Col>
//               <p className="modalContent">Tên Bệnh</p>
//               <Form.Item
//                 name="name"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng nhập tên bệnh!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Tên Bệnh" />
//               </Form.Item>
//             </Col>
//             {/* 2nd column */}
//             <Col>
//               <p className="modalContent">Mô Tả</p>
//               <Form.Item
//                 name="description"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng nhập mô tả!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Mô Tả" />
//               </Form.Item>
//             </Col>
//             {/* 3rd column */}
//             <Col>
//               <p className="modalContent">Loại Bệnh</p>
//               <Form.Item
//                 name="type"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng chọn loại bệnh!",
//                   },
//                 ]}
//               >
//                 <Select placeholder="Loại Bệnh">
//                   <Select.Option value={0}>Phổ Biến</Select.Option>
//                   <Select.Option value={1}>Môi Trường</Select.Option>
//                   <Select.Option value={2}>Thức Ăn</Select.Option>
//                   <Select.Option value={3}>Vi Rút</Select.Option>
//                   <Select.Option value={4}>Vi Khuẩn</Select.Option>
//                   <Select.Option value={5}>Giống Loài Nhất Định</Select.Option>
//                 </Select>
//               </Form.Item>
//             </Col>
//           </Row>
//           {/* 2nd Row */}
//           <Row style={{ justifyContent: "space-between" }}>
//             {/* 1st column */}
//             <Col>
//               <p className="modalContent">Phần Trăm Thức Ăn</p>
//               <Form.Item
//                 name="foodModifyPercent"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng nhập phần trăm thức ăn!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Phần Trăm Thức Ăn" />
//               </Form.Item>
//             </Col>
//             {/* 2nd column */}
//             <Col>
//               <p className="modalContent">Phần Trăm Muối</p>
//               <Form.Item
//                 name="saltModifyPercent"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng nhập phần trăm muối!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Phần Trăm Muối" />
//               </Form.Item>
//             </Col>
//             {/* 3rd column */}
//             <Col>
//               <p className="modalContent">Thuốc</p>
//               <Form.Item
//                 name="medicineIds"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng chọn thuốc!",
//                   },
//                 ]}
//               >
//                 <Select
//                   mode="multiple"
//                   placeholder="Thuốc"
//                   allowClear
//                   style={{ width: "100%" }}
//                 >
//                   {medicines.map((medicine) => (
//                     <Select.Option
//                       key={medicine.medicineId}
//                       value={medicine.medicineId}
//                     >
//                       {medicine.medicineName}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//           </Row>
//           <Col>
//             <p className="modalContent">Hình Ảnh</p>
//             <Form.Item
//               name="image"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please upload an image!",
//                 },
//               ]}
//             >
//               <Upload.Dragger
//                 name="file"
//                 beforeUpload={beforeUpload}
//                 multiple={false}
//                 accept="image/*"
//                 fileList={fileList}
//                 onRemove={handleUploadRemove}
//               >
//                 <p className="ant-upload-drag-icon">
//                   <InboxOutlined />
//                 </p>
//                 <p className="ant-upload-text">
//                   Nhấp hoặc kéo tệp vào khu vực này để tải lên
//                 </p>
//                 <p className="ant-upload-hint">
//                   Hỗ trợ một tệp hình ảnh duy nhất. Nhấp hoặc kéo để tải lên.
//                 </p>
//               </Upload.Dragger>
//             </Form.Item>
//             {/* Image Preview Section */}
//             {previewUrl && (
//               <div style={{ marginTop: 16, textAlign: "center" }}>
//                 <img
//                   src={previewUrl}
//                   alt="Preview"
//                   style={{
//                     maxWidth: "100%",
//                     maxHeight: "200px",
//                     objectFit: "contain",
//                     marginBottom: 8,
//                   }}
//                 />
//                 <div>
//                   <Button
//                     type="link"
//                     danger
//                     icon={<DeleteOutlined />}
//                     onClick={handleRemoveImage}
//                   >
//                     Bỏ Ảnh
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </Col>
//           <Row className="membershipButton">
//             <Form.Item>
//               <Button
//                 style={{
//                   width: "100px",
//                   height: "40px",
//                   padding: "8px",
//                   borderRadius: "10px",
//                   marginRight: "10px",
//                 }}
//                 onClick={handleCancel}
//               >
//                 Hủy Bỏ
//               </Button>
//               <Button
//                 htmlType="submit"
//                 type="primary"
//                 style={{
//                   width: "150px",
//                   height: "40px",
//                   padding: "8px",
//                   borderRadius: "10px",
//                 }}
//               >
//                 <PlusOutlined />
//                 Thêm Bệnh
//               </Button>
//             </Form.Item>
//           </Row>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default AddCommonDiseases;

import { DeleteOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createDisease,
  getListDisease,
  getSickSymptoms,
  getSideEffects,
} from "../../redux/slices/diseasesSlice";
import { uploadImage } from "../../redux/slices/authSlice";
import TextArea from "antd/es/input/TextArea";

const AddCommonDiseases = ({ onClose }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [medicines, setMedicines] = useState([]);

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // Fetch sick symptoms and side effects from Redux state with default empty arrays
  const { sickSymptoms = [], sideEffects = [] } = useSelector(
    (state) => state.diseasesSlice
  );

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

  const showAddModal = () => {
    setIsAddOpen(true);
  };

  const handleCancel = () => {
    setIsAddOpen(false);
    setFileList([]);
    setSelectedImage(null);
    setPreviewUrl(null);
    form.resetFields();
  };

  // Fetch medicines, sick symptoms, and side effects when the modal opens
  useEffect(() => {
    if (isAddOpen) {
      // Fetch medicines
      const fetchMedicines = async () => {
        try {
          const response = await fetch("https://loco.com.co/all-medicine");
          const data = await response.json();
          setMedicines(data);
        } catch (error) {
          console.error("Failed to fetch medicines:", error);
          openNotification("error", "Failed to load medicines");
        }
      };

      // Dispatch thunks to fetch sick symptoms and side effects
      dispatch(getSickSymptoms());
      dispatch(getSideEffects());

      fetchMedicines();
    }
  }, [isAddOpen, dispatch]);

  // Handle file selection and preview (before upload)
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      openNotification("error", "Bạn chỉ có thể tải lên file hình ảnh!");
      return false;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.onerror = () => {
      openNotification("error", "Failed to preview the image.");
    };
    reader.readAsDataURL(file);

    return false;
  };

  // Function to remove the selected image and clear the preview
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setFileList([]);
    form.setFieldsValue({ image: undefined });
  };

  // Handle removal directly from Upload.Dragger
  const handleUploadRemove = () => {
    handleRemoveImage();
    return true;
  };

  // Handle form submission
  const onFinish = async (values) => {
    if (!selectedImage) {
      openNotification("error", "Please upload an image!");
      return;
    }

    let imageUrl;
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const uploadResult = await dispatch(uploadImage(formData)).unwrap();
      imageUrl = uploadResult.imageUrl;

      if (!imageUrl) {
        throw new Error("Image URL not returned from the server");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      openNotification("error", "Failed to upload image. Please try again.");
      return;
    }

    const payload = {
      ...values,
      type: Number(values.type), // Convert type to number
      foodModifyPercent: Number(values.foodModifyPercent), // Convert to number
      saltModifyPercent: Number(values.saltModifyPercent), // Convert to number
      image: imageUrl,
    };

    dispatch(createDisease(payload))
      .unwrap()
      .then(() => {
        onClose();
        openNotification("success", "Bệnh Thêm Thành Công!");
        dispatch(getListDisease());
        handleCancel();
        form.resetFields();
      })
      .catch((error) => {
        openNotification(
          "warning",
          error.message || "Failed to create disease"
        );
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
        Thêm Bệnh
      </Button>

      <Modal
        className="custom-modal"
        centered
        title="Thêm Bệnh Mới"
        open={isAddOpen}
        onCancel={handleCancel}
        width={870}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          {/* 1st Row */}
          <Row style={{ justifyContent: "space-between" }}>
            <Col>
              <p className="modalContent">Tên Bệnh</p>
              <Form.Item
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên bệnh!" }]}
              >
                <Input placeholder="Tên Bệnh" />
              </Form.Item>
            </Col>
            <Col>
              <p className="modalContent">Loại Bệnh</p>
              <Form.Item
                name="type"
                rules={[
                  { required: true, message: "Vui lòng chọn loại bệnh!" },
                ]}
              >
                <Select placeholder="Loại Bệnh">
                  <Select.Option value={0}>Phổ Biến</Select.Option>
                  <Select.Option value={1}>Môi Trường</Select.Option>
                  <Select.Option value={2}>Thức Ăn</Select.Option>
                  <Select.Option value={3}>Vi Rút</Select.Option>
                  <Select.Option value={4}>Vi Khuẩn</Select.Option>
                  <Select.Option value={5}>Giống Loài Nhất Định</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <p className="modalContent">Phần Trăm Thức Ăn</p>
              <Form.Item
                name="foodModifyPercent"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập phần trăm thức ăn!",
                  },
                ]}
              >
                <Input placeholder="Phần Trăm Thức Ăn" type="number" />
              </Form.Item>
            </Col>
          </Row>
          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            <Col>
              <p className="modalContent">Phần Trăm Muối</p>
              <Form.Item
                name="saltModifyPercent"
                rules={[
                  { required: true, message: "Vui lòng nhập phần trăm muối!" },
                ]}
              >
                <Input placeholder="Phần Trăm Muối" type="number" />
              </Form.Item>
            </Col>
            <Col>
              <p className="modalContent">Thuốc</p>
              <Form.Item
                name="medicineIds"
                rules={[{ required: true, message: "Vui lòng chọn thuốc!" }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Thuốc"
                  allowClear
                  style={{ width: "265px" }}
                >
                  {medicines.map((medicine) => (
                    <Select.Option
                      key={medicine.medicineId}
                      value={medicine.medicineId}
                    >
                      {medicine.medicineName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <p className="modalContent">Triệu Chứng</p>
              <Form.Item
                name="sickSymtomps" // Match API typo
                rules={[
                  { required: true, message: "Vui lòng chọn triệu chứng!" },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Triệu Chứng"
                  allowClear
                  style={{ width: "265px" }}
                >
                  {(sickSymptoms || []).map((symptom) => (
                    <Select.Option key={symptom.id} value={symptom.id}>
                      {symptom.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {/* 3rd Row: Sick Symptoms and Side Effects */}
          <Row style={{ justifyContent: "space-between" }}>
            <Col>
              <p className="modalContent">Tác Dụng Phụ</p>
              <Form.Item
                name="sideEffect" // Match API field name
                rules={[
                  { required: true, message: "Vui lòng chọn tác dụng phụ!" },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Tác Dụng Phụ"
                  allowClear
                  style={{ width: "265px" }}
                >
                  {(sideEffects || []).map((effect) => (
                    <Select.Option key={effect.id} value={effect.id}>
                      {effect.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Col>
            <p className="modalContent">Mô Tả</p>
            <Form.Item
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <TextArea placeholder="Mô Tả" />
            </Form.Item>
          </Col>

          <Col>
            <p className="modalContent">Hình Ảnh</p>
            <Form.Item
              name="image"
              rules={[{ required: true, message: "Please upload an image!" }]}
            >
              <Upload.Dragger
                name="file"
                beforeUpload={beforeUpload}
                multiple={false}
                accept="image/*"
                fileList={fileList}
                onRemove={handleUploadRemove}
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
                style={{
                  width: "100px",
                  height: "40px",
                  padding: "8px",
                  borderRadius: "10px",
                  marginRight: "10px",
                }}
                onClick={handleCancel}
              >
                Hủy Bỏ
              </Button>
              <Button
                htmlType="submit"
                type="primary"
                style={{
                  width: "150px",
                  height: "40px",
                  padding: "8px",
                  borderRadius: "10px",
                }}
              >
                <PlusOutlined />
                Thêm Bệnh
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddCommonDiseases;
