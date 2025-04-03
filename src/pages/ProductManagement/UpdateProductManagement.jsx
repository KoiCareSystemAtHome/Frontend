import { EditOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  notification,
  Popover,
  Row,
  Select,
  Upload,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getListProductManagement,
  updateProductManagement,
} from "../../redux/slices/productManagementSlice";
import axios from "axios";
import { getListCategory } from "../../redux/slices/categorySlice";
import { getListCategorySelector } from "../../redux/selector";

const UpdateProductManagement = (props) => {
  const { record } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [isLoadingParameters, setIsLoadingParameters] = useState(false);
  const [parameters, setParameters] = useState([]);
  const [parameterImpactsArray, setParameterImpactsArray] = useState([]); // Store the transformed parameter impacts
  const categories = useSelector(getListCategorySelector);

  // Fetch categories when the component mounts
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(getListCategory());
    }
  }, [dispatch, categories]);

  // Transform the parameterImpactment into the required format
  useEffect(() => {
    //console.log("Record:", record);
    //console.log("Record.parameterImpacts:", record.parameterImpacts); // Fix the typo here

    let transformedArray = [];

    if (record.parameterImpacts) {
      // Fix the typo here
      try {
        // Since parameterImpacts is already an object, no need to parse
        const parsedImpacts = record.parameterImpacts;

        if (
          parsedImpacts &&
          typeof parsedImpacts === "object" &&
          !Array.isArray(parsedImpacts)
        ) {
          // Transform the object into an array of { impact, effect } objects
          transformedArray = Object.entries(parsedImpacts).map(
            ([impact, effect]) => ({
              impact,
              effect: effect.toLowerCase(), // Ensure the effect matches the Select options ("increased" or "decreased")
            })
          );
        }
      } catch (error) {
        console.error("Failed to process parameterImpacts:", error);
      }
    }

    console.log("Transformed Array:", transformedArray);
    setParameterImpactsArray(transformedArray);
  }, [record.parameterImpacts]); // Fix the dependency here

  const showEditModal = () => {
    console.log(parameterImpactsArray);
    // Only open the modal if parameters are loaded
    if (isLoadingParameters) {
      openNotification("warning", "Please wait, loading parameters...");
      return;
    }

    form.setFieldsValue({
      productId: record.productId, // Include productId in the form
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
      ParameterImpacts: parameterImpactsArray,
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
          name: "Hình ảnh đã tải lên",
          status: "done",
          url: record.image,
        },
      ]);
      form.setFieldsValue({ image: record.image });
    } else {
      setFileList([]);
      form.setFieldsValue({ image: null });
    }
  }, [record.image, form]);

  useEffect(() => {
    const fetchParameters = async () => {
      setIsLoadingParameters(true);
      try {
        const response = await fetch(
          "http://14.225.206.203:8080/api/Pond/pond-required-param"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch parameters");
        }
        const data = await response.json();
        setParameters(data);
        setIsLoadingParameters(false);
      } catch (error) {
        console.error("Failed to fetch parameters:", error);
        setIsLoadingParameters(false);
        openNotification("error", "Failed to load parameters");
      }
    };

    fetchParameters();
  }, []);

  const handleUploadChange = async ({ fileList }) => {
    if (fileList.length === 0) {
      setFileList([]);
      form.setFieldsValue({ image: null });
      return;
    }

    setFileList(fileList);

    const file = fileList[0]?.originFileObj;
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://14.225.206.203:8080/api/Account/test",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const imageUrl = response.data.imageUrl;
      console.log("Uploaded Image URL:", imageUrl);

      const newFile = {
        uid: "-1",
        name: file.name,
        status: "done",
        url: imageUrl,
      };

      setFileList([newFile]);
      form.setFieldsValue({ image: newFile.url });
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
      const latestImage = fileList.length > 0 ? fileList[0].url : record.image;

      const parameterImpactsObj = (values.ParameterImpacts || []).reduce(
        (acc, item) => {
          if (item.impact && item.effect) {
            acc[item.impact] = item.effect;
          }
          return acc;
        },
        {}
      );

      const formattedValues = {
        productId: values.productId, // Use the productId from the form
        productName: values.productName,
        description: values.description,
        price: Number(values.price),
        stockQuantity: Number(values.stockQuantity),
        shopId: values.shopId,
        categoryId: values.categoryId,
        brand: values.brand,
        manufactureDate: values.manufactureDate
          ? dayjs(values.manufactureDate)
              .tz("Asia/Ho_Chi_Minh", true)
              .utc()
              .format()
          : null,
        expiryDate: values.expiryDate
          ? dayjs(values.expiryDate).tz("Asia/Ho_Chi_Minh", true).utc().format()
          : null,
        parameterImpacts: parameterImpactsObj,
        image: latestImage,
      };

      console.log("Formatted Values (Including Image):", formattedValues);

      dispatch(
        updateProductManagement({
          updatedProduct: formattedValues,
        })
      )
        .unwrap()
        .then(() => {
          form.resetFields();
          setIsEditOpen(false);
          message.success(`Cập Nhật Dụng Cụ Thành Công!`);
          //openNotification("success", `Cập Nhật Dụng Cụ Thành Công!`);
          dispatch(getListProductManagement());
        })
        .catch((error) => {
          console.error("Update error:", error);
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
        title="Chỉnh Sửa Thông Tin Dụng Cụ"
        open={isEditOpen}
        onCancel={handleEditCancel}
        width={870}
        footer={null}
      >
        <Form form={form} onFinish={handleEditSubmit}>
          {/* 1st Row */}
          <Row style={{ justifyContent: "space-between" }}>
            <Col>
              <p className="modalContent">Tên Dụng Cụ</p>
              <Form.Item
                name="productName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên dụng cụ!",
                  },
                ]}
              >
                <Input placeholder="Tên Dụng Cụ" />
              </Form.Item>
            </Col>
            <Col>
              <p className="modalContent">Mô Tả</p>
              <Form.Item
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả!",
                  },
                ]}
              >
                <Input placeholder="Mô Tả" />
              </Form.Item>
            </Col>
            <Col>
              <p className="modalContent">Giá</p>
              <Form.Item
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá!",
                  },
                ]}
              >
                <Input placeholder="Giá" type="number" />
              </Form.Item>
            </Col>
          </Row>
          {/* 2nd Row */}
          <Row style={{ justifyContent: "space-between" }}>
            <Col>
              <p className="modalContent">Số Lượng</p>
              <Form.Item
                name="stockQuantity"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng!",
                  },
                ]}
              >
                <Input placeholder="Số Lượng" type="number" />
              </Form.Item>
            </Col>
            <Col>
              <p className="modalContent">Loại Sản Phẩm</p>
              <Form.Item
                name="categoryId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập loại sản phẩm!",
                  },
                ]}
              >
                <Select
                  allowClear
                  style={{ width: "270px" }}
                  placeholder="Loại Sản Phẩm"
                >
                  {categories.map((category) => (
                    <Select.Option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <p className="modalContent">Nhãn Hiệu</p>
              <Form.Item
                name="brand"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập nhãn hiệu!",
                  },
                ]}
              >
                <Input placeholder="Nhãn Hiệu" />
              </Form.Item>
            </Col>
          </Row>
          {/* 3rd Row */}
          <Row>
            <Col>
              <p className="modalContent">Ngày Sản Xuất</p>
              <Form.Item
                name="manufactureDate"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày sản xuất!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Ngày Sản Xuất"
                />
              </Form.Item>
            </Col>
            <Col style={{ marginLeft: "6px" }}>
              <p className="modalContent">Ngày Hết Hạn</p>
              <Form.Item
                name="expiryDate"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày hết hạn!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Ngày Hết Hạn"
                />
              </Form.Item>
            </Col>
          </Row>
          {/* 4th Row */}
          <Col style={{ marginLeft: "6px" }}>
            <p className="modalContent">Thông Số Ảnh Hưởng</p>
            <Form.List name="ParameterImpacts">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Row
                      key={field.key}
                      gutter={12}
                      align="middle"
                      style={{ marginBottom: 8 }}
                    >
                      <Col>
                        <Form.Item
                          {...field}
                          name={[field.name, "impact"]}
                          fieldKey={[field.fieldKey, "impact"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn thông số!",
                            },
                          ]}
                        >
                          <Select
                            allowClear
                            style={{ width: "150px" }}
                            placeholder="Thông Số"
                            loading={isLoadingParameters}
                          >
                            {parameters.map((param) => (
                              <Select.Option
                                key={param.parameterId}
                                value={param.parameterName}
                              >
                                {param.parameterName}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={5.5}>
                        <Form.Item
                          {...field}
                          name={[field.name, "effect"]}
                          fieldKey={[field.fieldKey, "effect"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn ảnh hưởng!",
                            },
                          ]}
                        >
                          <Select
                            allowClear
                            style={{ width: "160px" }}
                            placeholder="Ảnh Hưởng"
                          >
                            <Select.Option value="increased">
                              Tăng
                            </Select.Option>
                            <Select.Option value="decreased">
                              Giảm
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        {fields.length > 1 ? (
                          <Button
                            type="link"
                            danger
                            onClick={() => remove(field.name)}
                          >
                            <span
                              style={{ marginTop: "-40px" }}
                              role="img"
                              aria-label="delete"
                            >
                              ✖
                            </span>
                          </Button>
                        ) : null}
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      style={{ width: "320px" }}
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm Thông Số Ảnh Hưởng
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
          {/* 5th Row */}
          <Row style={{ justifyContent: "space-between" }}>
            <Col>
              {/* <p className="modalContent">Shop ID</p> */}
              <Form.Item
                name="shopId"
                rules={[
                  {
                    required: true,
                    message: "Please input shop ID!",
                  },
                ]}
              >
                <Input hidden placeholder="Shop ID" />
              </Form.Item>
            </Col>
            <Col>
              {/* <p className="modalContent">Product ID</p> */}
              <Form.Item
                name="productId"
                rules={[
                  {
                    required: true,
                    message: "Please enter product ID!",
                  },
                ]}
              >
                <Input hidden placeholder="Product ID" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Col>
            <p className="modalContent">Hình Ảnh</p>
            <Form.Item
              name="image"
              rules={[
                {
                  required: true,
                  message: "Vui lòng tải lên hình ảnh!",
                },
              ]}
            >
              <Upload.Dragger
                fileList={fileList}
                beforeUpload={() => false}
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
          <Row className="membershipButton">
            <Form.Item>
              <Button
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
                Chỉnh Sửa
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateProductManagement;

// import { EditOutlined, InboxOutlined } from "@ant-design/icons";
// import {
//   Button,
//   Col,
//   DatePicker,
//   Form,
//   Input,
//   Modal,
//   notification,
//   Popover,
//   Row,
//   Upload,
// } from "antd";
// import dayjs from "dayjs";
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import {
//   getListProductManagement,
//   updateProductManagement,
// } from "../../redux/slices/productManagementSlice";
// import axios from "axios";

// const UpdateProductManagement = (props) => {
//   const { record } = props;
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [api, contextHolder] = notification.useNotification();

//   const showEditModal = () => {
//     form.setFieldsValue({
//       productName: record.productName,
//       description: record.description,
//       price: record.price,
//       stockQuantity: record.stockQuantity,
//       shopId: record.shopId,
//       categoryId: record.categoryId,
//       brand: record.brand,
//       manufactureDate: record.manufactureDate
//         ? dayjs
//             .utc(record.manufactureDate)
//             .tz("Asia/Ho_Chi_Minh")
//             .startOf("day")
//         : null,
//       expiryDate: record.expiryDate
//         ? dayjs.utc(record.expiryDate).tz("Asia/Ho_Chi_Minh").startOf("day")
//         : null,
//       parameterImpacts: record.parameterImpacts,
//       image: record.image,
//     });
//     setIsEditOpen(true);
//   };

//   const handleEditCancel = () => {
//     form.resetFields();
//     setIsEditOpen(false);
//   };

//   const handleCancel = () => {
//     setIsEditOpen(false);
//   };

//   const [fileList, setFileList] = useState([]);

//   useEffect(() => {
//     if (record.image) {
//       setFileList([
//         {
//           uid: "-1",
//           name: "Uploaded Image",
//           status: "done",
//           url: record.image, // Ensure URL is valid
//         },
//       ]);
//       form.setFieldsValue({ image: record.image }); // Update form with the existing image
//     } else {
//       setFileList([]);
//       form.setFieldsValue({ image: null }); // Clear form value if no image
//     }
//   }, [record.image, form]);

//   const handleUploadChange = async ({ fileList }) => {
//     if (fileList.length === 0) {
//       setFileList([]);
//       form.setFieldsValue({ image: null }); // Update form value on deletion
//       return;
//     }

//     setFileList(fileList);

//     const file = fileList[0]?.originFileObj;
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post(
//         "http://14.225.206.203:5444/api/Account/test",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       const imageUrl = response.data.imageUrl; // Ensure this is the correct key
//       console.log("Uploaded Image URL:", imageUrl);

//       const newFile = {
//         uid: "-1",
//         name: file.name,
//         status: "done",
//         url: imageUrl,
//       };

//       setFileList([newFile]);
//       form.setFieldsValue({ image: newFile.url }); // ✅ Update the form with the new image URL
//     } catch (error) {
//       console.error("Upload Error:", error);
//     }
//   };

//   const openNotification = (type, message) => {
//     api[type]({
//       message: message,
//       placement: "top",
//       duration: 5,
//     });
//   };

//   const handleEditSubmit = () => {
//     form.validateFields().then((values) => {
//       const latestImage = fileList.length > 0 ? fileList[0].url : record.image; // ✅ Always take the latest uploaded image
//       const formattedValues = {
//         ...values,
//         manufactureDate: values.manufactureDate
//           ? dayjs(values.manufactureDate)
//               .tz("Asia/Ho_Chi_Minh", true)
//               .utc()
//               .format()
//           : null,
//         expiryDate: values.expiryDate
//           ? dayjs(values.expiryDate).tz("Asia/Ho_Chi_Minh", true).utc().format()
//           : null,
//         image: latestImage,
//       };

//       console.log("Formatted Values (Including Image):", formattedValues);

//       //console.log("Formatted Values:", formattedValues); // Debugging

//       // Convert object to query parameters
//       const queryString = new URLSearchParams({
//         productId: record.productId,
//         productName: formattedValues.productName,
//         description: formattedValues.description,
//         price: formattedValues.price,
//         stockQuantity: formattedValues.stockQuantity,
//         categoryId: formattedValues.categoryId,
//         brand: formattedValues.brand,
//         manufactureDate: formattedValues.manufactureDate,
//         expiryDate: formattedValues.expiryDate,
//       }).toString();

//       // Create a FormData object for file upload
//       const formData = new FormData();
//       console.log(values);

//       console.log("Record Image:", record.image);
//       if (values.image && values.image.file) {
//         formData.append("image", values.image.file); // ✅ Append binary image file
//       } else if (record.image) {
//         formData.append("image", record.image); // Use existing image if not changed
//       } else {
//         console.error("Image is required!"); // Ensure image is always present
//         return;
//       }

//       dispatch(
//         updateProductManagement({
//           updatedProduct: {
//             productId: record.productId, // ✅ Ensure productId is included
//             ...formattedValues,
//           },
//         })
//       )
//         .unwrap()
//         .then(() => {
//           form.resetFields();
//           setIsEditOpen(false);
//           openNotification(
//             "success",
//             `Updated product "${record.productName}" successfully!`
//           );
//           dispatch(getListProductManagement());
//         })
//         .catch((error) => {
//           console.error("Update error:", error); // Debugging
//           openNotification("warning", error.message || "Update failed!");
//         });
//     });
//   };

//   return (
//     <div>
//       {contextHolder}
//       <Popover content="Edit" trigger="hover">
//         <Button
//           type="text"
//           icon={<EditOutlined />}
//           onClick={showEditModal}
//           className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border-none shadow-none flex items-center justify-center"
//           style={{
//             width: "32px",
//             height: "32px",
//             padding: 0,
//           }}
//         />
//       </Popover>

//       <Modal
//         className="custom-modal"
//         centered
//         title="Edit Product"
//         open={isEditOpen}
//         onCancel={handleEditCancel}
//         width={870}
//         footer={null}
//       >
//         <Form form={form} onFinish={handleEditSubmit}>
//           {/* 1st Row */}
//           <Row style={{ justifyContent: "space-between" }}>
//             {/* 1st column */}
//             <Col>
//               <p className="modalContent">Product ID</p>
//               <Form.Item
//                 name="productId"
//                 initialValue={record.productId}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter product ID!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Product ID"></Input>
//               </Form.Item>
//             </Col>
//             {/* 2nd column */}
//             <Col>
//               <p className="modalContent">Product Name</p>
//               <Form.Item
//                 name="productName"
//                 initialValue={record.productName}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter product name!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Product Name"></Input>
//               </Form.Item>
//             </Col>
//             {/* 3rd column */}
//             <Col>
//               <p className="modalContent">Description</p>
//               <Form.Item
//                 name="description"
//                 initialValue={record.description}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter description!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Description"></Input>
//               </Form.Item>
//             </Col>
//           </Row>
//           {/* 2nd Row */}
//           <Row style={{ justifyContent: "space-between" }}>
//             {/* 1st column */}
//             <Col>
//               <p className="modalContent">Price</p>
//               <Form.Item
//                 name="price"
//                 initialValue={record.price}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please select price!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Price"></Input>
//               </Form.Item>
//             </Col>
//             {/* 2nd column */}
//             <Col>
//               <p className="modalContent">Stock Quantity</p>
//               <Form.Item
//                 name="stockQuantity"
//                 initialValue={record.stockQuantity}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please select stock quantity!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Stock Quantity"></Input>
//               </Form.Item>
//             </Col>
//             {/* 3rd column */}
//             <Col>
//               <p className="modalContent">Shop ID</p>
//               <Form.Item
//                 name="shopId"
//                 initialValue={record.shopId}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please input shop ID!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Shop ID"></Input>
//               </Form.Item>
//             </Col>
//           </Row>
//           {/* 3rd Row */}
//           <Row style={{ justifyContent: "space-between" }}>
//             {/* 1st column */}
//             <Col>
//               <p className="modalContent">Category ID</p>
//               <Form.Item
//                 name="categoryId"
//                 initialValue={record.categoryId}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please input category ID!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Category ID"></Input>
//               </Form.Item>
//             </Col>
//             {/* 2nd column */}
//             <Col>
//               <p className="modalContent">Brand</p>
//               <Form.Item
//                 name="brand"
//                 initialValue={record.brand}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please input brand!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Brand"></Input>
//               </Form.Item>
//             </Col>
//             {/* 3rd column */}
//             <Col>
//               <p className="modalContent">Manufacture Date</p>
//               <Form.Item
//                 name="manufactureDate"
//                 initialValue={
//                   record.manufactureDate
//                     ? dayjs
//                         .utc(record.manufactureDate)
//                         .tz("Asia/Ho_Chi_Minh")
//                         .startOf("day")
//                     : null
//                 }
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please select manufacture date!",
//                   },
//                 ]}
//               >
//                 <DatePicker
//                   style={{ width: "270px" }}
//                   placeholder="Manufacture Date"
//                 ></DatePicker>
//               </Form.Item>
//             </Col>
//           </Row>
//           {/* 4th Row */}
//           <Row>
//             {/* 1st column */}
//             <Col>
//               <p className="modalContent">Expiry Date</p>
//               <Form.Item
//                 name="expiryDate"
//                 initialValue={
//                   record.expiryDate
//                     ? dayjs
//                         .utc(record.expiryDate)
//                         .tz("Asia/Ho_Chi_Minh")
//                         .startOf("day")
//                     : null
//                 }
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please select expiry date!",
//                   },
//                 ]}
//               >
//                 <DatePicker
//                   style={{ width: "270px" }}
//                   placeholder="Expiry Date"
//                 ></DatePicker>
//               </Form.Item>
//             </Col>
//             {/* 2nd column */}
//             <Col style={{ marginLeft: "6px" }}>
//               <p className="modalContent">Parameter Impacts</p>
//               <Form.Item
//                 name="parameterImpacts"
//                 initialValue={
//                   record.parameterImpacts
//                     ? JSON.stringify(record.parameterImpacts, null, 2)
//                     : "{}"
//                 }
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please input parameter impacts!",
//                   },
//                   // {
//                   //   validator: (_, value) => {
//                   //     try {
//                   //       JSON.parse(value); // Validate JSON format
//                   //       return Promise.resolve();
//                   //     } catch {
//                   //       return Promise.reject(
//                   //         new Error("Invalid JSON format!")
//                   //       );
//                   //     }
//                   //   },
//                   // },
//                 ]}
//               >
//                 <Input.TextArea
//                   rows={4}
//                   placeholder="Enter parameter impacts in JSON format"
//                   onChange={(e) => {
//                     try {
//                       JSON.parse(e.target.value); // Check JSON validity
//                     } catch {
//                       console.error("Invalid JSON format");
//                     }
//                   }}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Col>
//             <p className="modalContent">Image</p>
//             <Form.Item
//               name="image"
//               initialValue={record.image}
//               rules={[
//                 {
//                   required: true,
//                   message: "Please upload an image!",
//                 },
//               ]}
//             >
//               <Upload.Dragger
//                 fileList={fileList}
//                 beforeUpload={() => false} // Prevent auto-upload
//                 onChange={handleUploadChange}
//                 multiple={false}
//                 accept="image/*"
//                 listType="picture" // Display as an image
//               >
//                 {fileList.length === 0 ? (
//                   <>
//                     <p className="ant-upload-drag-icon">
//                       <InboxOutlined />
//                     </p>
//                     <p className="ant-upload-text">
//                       Click or drag file to upload
//                     </p>
//                   </>
//                 ) : null}
//               </Upload.Dragger>
//             </Form.Item>
//           </Col>
//           <Row className="membershipButton">
//             <Form.Item>
//               <Button
//                 onClick={handleCancel}
//                 htmlType="submit"
//                 type="primary"
//                 style={{
//                   width: "160px",
//                   height: "40px",
//                   padding: "8px",
//                   borderRadius: "10px",
//                   backgroundColor: "orange",
//                 }}
//               >
//                 <EditOutlined />
//                 Edit Product
//               </Button>
//             </Form.Item>
//           </Row>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default UpdateProductManagement;
