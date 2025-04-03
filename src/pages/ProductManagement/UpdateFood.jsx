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
  updateFoodManagement,
} from "../../redux/slices/productManagementSlice";
import axios from "axios";
import { getListCategorySelector } from "../../redux/selector";
import { getListCategory } from "../../redux/slices/categorySlice";

const UpdateFood = (props) => {
  const { record } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [isLoadingParameters, setIsLoadingParameters] = useState(false);
  const [parameters, setParameters] = useState([]);
  const [parameterImpactsArray, setParameterImpactsArray] = useState([]);
  const categories = useSelector(getListCategorySelector);

  // Fetch categories when the component mounts
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(getListCategory());
    }
  }, [dispatch, categories]);

  // Transform the parameterImpactment into the required format
  useEffect(() => {
    console.log("Record:", record);
    console.log("Record.parameterImpacts:", record.parameterImpacts); // Fix the typo here

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
    if (isLoadingParameters) {
      openNotification("warning", "Please wait, loading parameters...");
      return;
    }

    form.setFieldsValue({
      productId: record.productId,
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
      name: record.name, // New field
      ageFrom: record.ageFrom, // New field
      ageTo: record.ageTo, // New field
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
        productId: values.productId,
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
        name: values.name, // New field
        ageFrom: Number(values.ageFrom), // New field
        ageTo: Number(values.ageTo), // New field
      };

      console.log("Formatted Values (Including Image):", formattedValues);

      dispatch(
        updateFoodManagement({
          updatedFood: formattedValues,
        })
      )
        .unwrap()
        .then(() => {
          form.resetFields();
          setIsEditOpen(false);
          message.success("Cập nhật Thức Ăn thành công!");
          openNotification("success", `Cập nhật Thức Ăn thành công!`);
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
        title="Chỉnh Sửa Thông Tin Thức Ăn"
        open={isEditOpen}
        onCancel={handleEditCancel}
        width={870}
        footer={null}
      >
        <Form form={form} onFinish={handleEditSubmit}>
          {/* 1st Row */}
          <Row style={{ justifyContent: "space-between" }}>
            <Col>
              <p className="modalContent">Tên Sản Phẩm</p>
              <Form.Item
                name="productName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên sản phẩm!",
                  },
                ]}
              >
                <Input placeholder="Tên Sản Phẩm" />
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
          <Row style={{ justifyContent: "space-between" }}>
            <Col>
              <p className="modalContent">Ngày Sản Xuất</p>
              <Form.Item
                name="manufactureDate"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày sản xuât!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Ngày Sản Xuất"
                />
              </Form.Item>
            </Col>
            <Col>
              <p className="modalContent">Ngày Hết Hạn</p>
              <Form.Item
                name="expiryDate"
                rules={[
                  {
                    required: true,
                    message: "Ngày Hết Hạn!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "270px" }}
                  placeholder="Ngày Hết Hạn"
                />
              </Form.Item>
            </Col>
            <Col>
              <p className="modalContent">Tên Thức Ăn</p>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên thức ăn!",
                  },
                ]}
              >
                <Input placeholder="Tên Thức Ăn" />
              </Form.Item>
            </Col>
          </Row>
          {/* 4th Row: New Fields (name, ageFrom, ageTo) */}
          <Row>
            <Col>
              <p className="modalContent">Độ Tuổi Từ</p>
              <Form.Item
                name="ageFrom"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập độ tuổi từ!",
                  },
                ]}
              >
                <Input placeholder="Độ Tuổi Từ" type="number" />
              </Form.Item>
            </Col>
            <Col style={{ marginLeft: "6px" }}>
              <p className="modalContent">Độ Tuổi Đến</p>
              <Form.Item
                name="ageTo"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập độ tuổi đến!",
                  },
                ]}
              >
                <Input placeholder="Độ Tuổi Đến" type="number" />
              </Form.Item>
            </Col>
          </Row>
          {/* 5th Row: Parameter Impacts */}
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
          {/* 6th Row: Shop ID (Hidden) */}
          <Row style={{ justifyContent: "space-between" }}>
            <Col>
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
          {/* 7th Row: Image */}
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
          {/* Submit Button */}
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

export default UpdateFood;
