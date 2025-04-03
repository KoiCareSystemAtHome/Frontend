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
  Select,
  Upload,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useDispatch } from "react-redux";
import { getListBlog, updateBlog } from "../../redux/slices/blogSlice";
import axios from "axios"; // Thêm axios để gọi API upload

const UpdateBlog = (props) => {
  const { record } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [content, setContent] = useState("");
  const [products, setProducts] = useState([]);
  const [fileList, setFileList] = useState([]); // Thêm state để quản lý file upload

  // Fetch products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://14.225.206.203:8080/api/Product");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        openNotification("warning", "Failed to fetch products.");
      }
    };

    fetchProducts();
  }, []);

  // Khởi tạo fileList dựa trên record.images
  useEffect(() => {
    if (record.images) {
      setFileList([
        {
          uid: "-1",
          name: "Hình ảnh đã tải lên",
          status: "done",
          url: record.images,
        },
      ]);
      form.setFieldsValue({ images: record.images });
    } else {
      setFileList([]);
      form.setFieldsValue({ images: null });
    }
  }, [record.images, form]);

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
    setIsEditOpen(true);
  };

  const handleEditCancel = () => {
    form.resetFields();
    setIsEditOpen(false);
  };

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

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://14.225.206.203:8080/api/Account/test", // Thay bằng API upload hình ảnh của bạn
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
      form.setFieldsValue({ images: newFile.url });
    } catch (error) {
      console.error("Upload Error:", error);
      openNotification("warning", "Failed to upload image.");
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

// import { EditOutlined } from "@ant-design/icons";
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
//   Select,
// } from "antd";
// import dayjs from "dayjs";
// import React, { useEffect, useState } from "react";
// import ReactQuill from "react-quill";
// import { useDispatch } from "react-redux";
// import { getListBlog, updateBlog } from "../../redux/slices/blogSlice";

// const UpdateBlog = (props) => {
//   const { record } = props;
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [api, contextHolder] = notification.useNotification();
//   const [content, setContent] = useState(""); // State for blog content
//   const [products, setProducts] = useState([]); // State to store fetched products

//   // Fetch products from the API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("http://14.225.206.203:8080/api/Product");
//         const data = await response.json();
//         setProducts(data); // Store the fetched products
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         openNotification("warning", "Failed to fetch products.");
//       }
//     };

//     fetchProducts();
//   }, []);

//   const showEditModal = () => {
//     form.setFieldsValue({
//       ...record,
//       productIds: record.products
//         ? record.products.map((p) => p.productId)
//         : [], // Ensure it's always an array
//       reportedDate: record.reportedDate ? dayjs(record.reportedDate) : null, // Convert date if needed
//       isApproved: record.isApproved, // Boolean value directly
//     });
//     setContent(record.content || ""); // Ensure content is set before opening modal
//     setIsEditOpen(true);
//   };

//   const handleEditCancel = () => {
//     form.resetFields();
//     setIsEditOpen(false);
//   };

//   const handleCancel = () => {
//     setContent(""); // Reset content
//     setIsEditOpen(false);
//   };

//   const openNotification = (type, message) => {
//     api[type]({
//       message: message,
//       placement: "top",
//       duration: 5,
//     });
//   };

//   const handleEditSubmit = (values) => {
//     const formattedValues = {
//       blogId: values.blogId,
//       title: values.title,
//       content: values.content,
//       images: values.images,
//       tag: values.tag,
//       isApproved: values.isApproved, // Already a boolean from Select
//       reportedBy: values.reportedBy,
//       reportedDate: values.reportedDate
//         ? dayjs(values.reportedDate).toISOString()
//         : record.reportedDate && dayjs(record.reportedDate).isValid()
//         ? dayjs(record.reportedDate).toISOString()
//         : null,
//       type: values.type,
//       shopId: values.shopId,
//       productIds:
//         values.productIds ||
//         (record.products ? record.products.map((p) => p.productId) : []),
//     };

//     console.log("Submitting:", formattedValues);
//     dispatch(updateBlog(formattedValues))
//       .unwrap()
//       .then(() => {
//         openNotification("success", "Cập Nhật Bài Viết Thành Công!");
//         dispatch(getListBlog());
//         handleCancel();
//         form.resetFields();
//       })
//       .catch((error) => {
//         if (error.response) {
//           openNotification("warning", `Error: ${error.response.data.message}`);
//         } else if (error.request) {
//           openNotification("warning", "Network error, please try again later.");
//         } else {
//           openNotification("warning", `Unexpected error: ${error.message}`);
//         }
//       });
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
//         title="Edit Blog"
//         centered
//         open={isEditOpen}
//         onCancel={handleCancel}
//         footer={null}
//         width={870}
//       >
//         <Form form={form} onFinish={handleEditSubmit}>
//           <Row style={{ justifyContent: "space-between" }}>
//             {/* 1st column */}
//             <Col>
//               <p className="modalContent">Blog ID</p>
//               <Form.Item
//                 name="blogId"
//                 initialValue={record.blogId}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter package title!",
//                   },
//                 ]}
//               >
//                 <Input disabled placeholder="Blog ID"></Input>
//               </Form.Item>
//             </Col>
//             {/* 2nd column */}
//             <Col>
//               <p className="modalContent">Tựa Đề</p>
//               <Form.Item
//                 name="title"
//                 initialValue={record.title}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng nhập tựa đề!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Tựa Đề"></Input>
//               </Form.Item>
//             </Col>
//             {/* 3rd column */}
//             <Col>
//               <p className="modalContent">Hình Ảnh</p>
//               <Form.Item
//                 name="images"
//                 initialValue={record.images}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng chọn hình ảnh!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Hình Ảnh"></Input>
//               </Form.Item>
//             </Col>
//           </Row>

//           {/* 2nd Row */}
//           <Row style={{ justifyContent: "space-between" }}>
//             {/* 1st column */}
//             <Col>
//               <p className="modalContent">Tag</p>
//               <Form.Item
//                 name="tag"
//                 initialValue={record.tag}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng nhập tag!",
//                   },
//                 ]}
//               >
//                 <Input disabled placeholder="Tag"></Input>
//               </Form.Item>
//             </Col>
//             {/* 2nd column */}
//             <Col>
//               <p className="modalContent">Trạng Thái</p>
//               <Form.Item
//                 name="isApproved"
//                 initialValue={record.isApproved}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng chọn trạng thái!",
//                   },
//                 ]}
//               >
//                 <Select placeholder="Status">
//                   <Select.Option value={true}>Chấp Nhận</Select.Option>
//                   <Select.Option value={false}>Từ Chối</Select.Option>
//                 </Select>
//               </Form.Item>
//             </Col>
//             {/* 3rd column */}
//             <Col>
//               <p className="modalContent">Loại</p>
//               <Form.Item
//                 name="type"
//                 initialValue={record.type}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng nhập loại!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Loại"></Input>
//               </Form.Item>
//             </Col>
//           </Row>

//           {/* 3rd Row */}
//           <Row style={{ justifyContent: "space-between" }}>
//             {/* 1st Column */}
//             {/* <Col>
//               <p className="modalContent">Reported By</p>
//               <Form.Item
//                 name="reportedBy"
//                 initialValue={record.reportedBy}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please input reporter!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Reporter"></Input>
//               </Form.Item>
//             </Col> */}
//             {/* 2nd Column */}
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
//             {/* 3rd Column */}
//             <Col>
//               <p className="modalContent">Tên Sản Phẩm</p>
//               <Form.Item
//                 name="productIds"
//                 initialValue={
//                   record.products ? record.products.map((p) => p.productId) : []
//                 }
//                 // rules={[
//                 //   {
//                 //     required: true,
//                 //     message: "Please select a product!",
//                 //   },
//                 // ]}
//               >
//                 <Select allowClear mode="multiple" placeholder="Chọn Sản Phẩm">
//                   {products.map((product) => (
//                     <Select.Option
//                       key={product.productId}
//                       value={product.productId}
//                     >
//                       {product.productName}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//           </Row>

//           {/* 4th Row */}
//           <Row>
//             {/* <Col>
//               <p className="modalContent">Reported Date</p>
//               <Form.Item
//                 name="reportedDate"
//                 initialValue={
//                   record.reportedDate
//                     ? dayjs
//                         .utc(record.reportedDate)
//                         .tz("Asia/Ho_Chi_Minh")
//                         .startOf("day")
//                     : null
//                 }
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please select reported date!",
//                   },
//                 ]}
//               >
//                 <DatePicker
//                   style={{ width: "270px" }}
//                   placeholder="Reported Date"
//                 ></DatePicker>
//               </Form.Item>
//             </Col> */}
//           </Row>

//           {/* 5th Row */}
//           <Row>
//             <Col>
//               <p className="modalContent">Nội Dung</p>
//               <Form.Item
//                 name="content"
//                 //initialValue={record.content}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng nhập nội dung!",
//                   },
//                 ]}
//               >
//                 {/* <Input placeholder="Blog Content"></Input> */}
//                 <ReactQuill
//                   style={{ width: "820px", height: "100px" }}
//                   value={content}
//                   onChange={(value) => {
//                     setContent(value);
//                     form.setFieldsValue({ content: value });
//                   }}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           {/* Submit Buttons */}
//           <div className="flex justify-end gap-2 mt-10">
//             <Button
//               style={{
//                 width: "100px",
//                 height: "40px",
//                 padding: "8px",
//                 borderRadius: "10px",
//               }}
//               onClick={handleCancel}
//             >
//               Hủy Bỏ
//             </Button>
//             <Button
//               onClick={handleCancel}
//               style={{
//                 width: "100px",
//                 height: "40px",
//                 padding: "8px",
//                 borderRadius: "10px",
//                 backgroundColor: "orange",
//               }}
//               type="primary"
//               htmlType="submit"
//             >
//               Chỉnh Sửa
//             </Button>
//           </div>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default UpdateBlog;
