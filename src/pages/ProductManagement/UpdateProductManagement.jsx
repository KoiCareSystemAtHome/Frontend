import { EditOutlined, InboxOutlined } from "@ant-design/icons";
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
  Upload,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getListProductManagement,
  updateProductManagement,
} from "../../redux/slices/productManagementSlice";
import axios from "axios";

const UpdateProductManagement = (props) => {
  const { record } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const showEditModal = () => {
    form.setFieldsValue({
      productName: record.productName,
      description: record.description,
      price: record.price,
      stockQuantity: record.stockQuantity,
      shopId: record.shopId,
      categoryId: record.categoryId,
      brand: record.brand,
      manufactureDate: record.manufactureDate
        ? dayjs
            .utc(record.manufactureDate)
            .tz("Asia/Ho_Chi_Minh")
            .startOf("day")
        : null,
      expiryDate: record.expiryDate
        ? dayjs.utc(record.expiryDate).tz("Asia/Ho_Chi_Minh").startOf("day")
        : null,
      parameterImpacts: record.parameterImpacts,
      image: record.image,
    });
    setIsEditOpen(true);
  };

  const handleEditCancel = () => {
    form.resetFields();
    setIsEditOpen(false);
  };

  const handleCancel = () => {
    setIsEditOpen(false);
  };

  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (record.image) {
      setFileList([
        {
          uid: "-1",
          name: "Uploaded Image",
          status: "done",
          url: record.image, // Ensure URL is valid
        },
      ]);
      form.setFieldsValue({ image: record.image }); // Update form with the existing image
    } else {
      setFileList([]);
      form.setFieldsValue({ image: null }); // Clear form value if no image
    }
  }, [record.image, form]);

  const handleUploadChange = async ({ fileList }) => {
    if (fileList.length === 0) {
      setFileList([]);
      form.setFieldsValue({ image: null }); // Update form value on deletion
      return;
    }

    setFileList(fileList);

    const file = fileList[0]?.originFileObj;
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://14.225.206.203:5444/api/Account/test",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const imageUrl = response.data.imageUrl; // Ensure this is the correct key
      console.log("Uploaded Image URL:", imageUrl);

      const newFile = {
        uid: "-1",
        name: file.name,
        status: "done",
        url: imageUrl,
      };

      setFileList([newFile]);
      form.setFieldsValue({ image: newFile.url }); // ✅ Update the form with the new image URL
    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  const openNotification = (type, message) => {
    api[type]({
      message: message,
      placement: "top",
      duration: 5,
    });
  };

  const handleEditSubmit = () => {
    form.validateFields().then((values) => {
      const latestImage = fileList.length > 0 ? fileList[0].url : record.image; // ✅ Always take the latest uploaded image
      const formattedValues = {
        ...values,
        manufactureDate: values.manufactureDate
          ? dayjs(values.manufactureDate)
              .tz("Asia/Ho_Chi_Minh", true)
              .utc()
              .format()
          : null,
        expiryDate: values.expiryDate
          ? dayjs(values.expiryDate).tz("Asia/Ho_Chi_Minh", true).utc().format()
          : null,
        image: latestImage,
      };

      console.log("Formatted Values (Including Image):", formattedValues);

      //console.log("Formatted Values:", formattedValues); // Debugging

      // Convert object to query parameters
      const queryString = new URLSearchParams({
        productId: record.productId,
        productName: formattedValues.productName,
        description: formattedValues.description,
        price: formattedValues.price,
        stockQuantity: formattedValues.stockQuantity,
        categoryId: formattedValues.categoryId,
        brand: formattedValues.brand,
        manufactureDate: formattedValues.manufactureDate,
        expiryDate: formattedValues.expiryDate,
      }).toString();

      // Create a FormData object for file upload
      const formData = new FormData();
      console.log(values);

      console.log("Record Image:", record.image);
      if (values.image && values.image.file) {
        formData.append("image", values.image.file); // ✅ Append binary image file
      } else if (record.image) {
        formData.append("image", record.image); // Use existing image if not changed
      } else {
        console.error("Image is required!"); // Ensure image is always present
        return;
      }

      dispatch(
        updateProductManagement({
          updatedProduct: {
            productId: record.productId, // ✅ Ensure productId is included
            ...formattedValues,
          },
        })
      )
        .unwrap()
        .then(() => {
          form.resetFields();
          setIsEditOpen(false);
          openNotification(
            "success",
            `Updated product "${record.productName}" successfully!`
          );
          dispatch(getListProductManagement());
        })
        .catch((error) => {
          console.error("Update error:", error); // Debugging
          openNotification("warning", error.message || "Update failed!");
        });
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
        className="custom-modal"
        centered
        title="Edit Product"
        open={isEditOpen}
        onCancel={handleEditCancel}
        width={870}
        footer={null}
      >
        <Form form={form} onFinish={handleEditSubmit}>
          {/* 1st Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Product ID</p>
              <Form.Item
                name="productId"
                initialValue={record.productId}
                rules={[
                  {
                    required: true,
                    message: "Please enter product ID!",
                  },
                ]}
              >
                <Input placeholder="Product ID"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Product Name</p>
              <Form.Item
                name="productName"
                initialValue={record.productName}
                rules={[
                  {
                    required: true,
                    message: "Please enter product name!",
                  },
                ]}
              >
                <Input placeholder="Product Name"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Description</p>
              <Form.Item
                name="description"
                initialValue={record.description}
                rules={[
                  {
                    required: true,
                    message: "Please enter description!",
                  },
                ]}
              >
                <Input placeholder="Description"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Price</p>
              <Form.Item
                name="price"
                initialValue={record.price}
                rules={[
                  {
                    required: true,
                    message: "Please select price!",
                  },
                ]}
              >
                <Input placeholder="Price"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Stock Quantity</p>
              <Form.Item
                name="stockQuantity"
                initialValue={record.stockQuantity}
                rules={[
                  {
                    required: true,
                    message: "Please select stock quantity!",
                  },
                ]}
              >
                <Input placeholder="Stock Quantity"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
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
          </Row>
          {/* 3rd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Category ID</p>
              <Form.Item
                name="categoryId"
                initialValue={record.categoryId}
                rules={[
                  {
                    required: true,
                    message: "Please input category ID!",
                  },
                ]}
              >
                <Input placeholder="Category ID"></Input>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col>
              <p className="modalContent">Brand</p>
              <Form.Item
                name="brand"
                initialValue={record.brand}
                rules={[
                  {
                    required: true,
                    message: "Please input brand!",
                  },
                ]}
              >
                <Input placeholder="Brand"></Input>
              </Form.Item>
            </Col>
            {/* 3rd column */}
            <Col>
              <p className="modalContent">Manufacture Date</p>
              <Form.Item
                name="manufactureDate"
                initialValue={
                  record.manufactureDate
                    ? dayjs
                        .utc(record.manufactureDate)
                        .tz("Asia/Ho_Chi_Minh")
                        .startOf("day")
                    : null
                }
                rules={[
                  {
                    required: true,
                    message: "Please select manufacture date!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Manufacture Date"
                ></DatePicker>
              </Form.Item>
            </Col>
          </Row>
          {/* 4th Row */}
          <Row>
            {/* 1st column */}
            <Col>
              <p className="modalContent">Expiry Date</p>
              <Form.Item
                name="expiryDate"
                initialValue={
                  record.expiryDate
                    ? dayjs
                        .utc(record.expiryDate)
                        .tz("Asia/Ho_Chi_Minh")
                        .startOf("day")
                    : null
                }
                rules={[
                  {
                    required: true,
                    message: "Please select expiry date!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Expiry Date"
                ></DatePicker>
              </Form.Item>
            </Col>
            {/* 2nd column */}
            <Col style={{ marginLeft: "6px" }}>
              <p className="modalContent">Parameter Impacts</p>
              <Form.Item
                name="parameterImpacts"
                initialValue={
                  record.parameterImpacts
                    ? JSON.stringify(record.parameterImpacts, null, 2)
                    : "{}"
                }
                rules={[
                  {
                    required: true,
                    message: "Please input parameter impacts!",
                  },
                  // {
                  //   validator: (_, value) => {
                  //     try {
                  //       JSON.parse(value); // Validate JSON format
                  //       return Promise.resolve();
                  //     } catch {
                  //       return Promise.reject(
                  //         new Error("Invalid JSON format!")
                  //       );
                  //     }
                  //   },
                  // },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter parameter impacts in JSON format"
                  onChange={(e) => {
                    try {
                      JSON.parse(e.target.value); // Check JSON validity
                    } catch {
                      console.error("Invalid JSON format");
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Col>
            <p className="modalContent">Image</p>
            <Form.Item
              name="image"
              initialValue={record.image}
              rules={[
                {
                  required: true,
                  message: "Please upload an image!",
                },
              ]}
            >
              <Upload.Dragger
                fileList={fileList}
                beforeUpload={() => false} // Prevent auto-upload
                onChange={handleUploadChange}
                multiple={false}
                accept="image/*"
                listType="picture" // Display as an image
              >
                {fileList.length === 0 ? (
                  <>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to upload
                    </p>
                  </>
                ) : null}
              </Upload.Dragger>
            </Form.Item>
          </Col>
          <Row className="membershipButton">
            <Form.Item>
              <Button
                onClick={handleCancel}
                htmlType="submit"
                type="primary"
                style={{
                  width: "160px",
                  height: "40px",
                  padding: "8px",
                  borderRadius: "10px",
                  backgroundColor: "orange",
                }}
              >
                <EditOutlined />
                Edit Product
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateProductManagement;

// const handleEditSubmit = () => {
//   form.validateFields().then((values) => {
//     const formattedValues = {
//       ...values,
//       manufactureDate: values.manufactureDate
//         ? dayjs(values.manufactureDate)
//             .tz("Asia/Ho_Chi_Minh", true)
//             .utc()
//             .format()
//         : null,
//       expiryDate: values.expiryDate
//         ? dayjs(values.expiryDate).tz("Asia/Ho_Chi_Minh", true).utc().format()
//         : null,
//     };

//     console.log("Formatted Values:", formattedValues); // Debugging

//     dispatch(
//       updateProductManagement({
//         productId: record.productId,
//         updatedProduct: values,
//       })
//     )
//       .unwrap()
//       .then(() => {
//         form.resetFields();
//         setIsEditOpen(false);
//         openNotification(
//           "success",
//           `Updated product "${record.productName}" successfully!`
//         );
//         dispatch(getListProductManagement());
//       })
//       .catch((error) => {
//         console.error("Update error:", error); // Debugging
//         openNotification("warning", error.message || "Update failed!");
//       });
//   });
// };
