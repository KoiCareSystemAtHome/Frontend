import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Spin,
  Input,
  Form,
  message,
  Card,
  List,
  Empty,
} from "antd";
import { EditOutlined, LeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Correct import for useSelector
import {
  getDiseaseDetail,
  updateDisease,
} from "../../redux/slices/diseasesSlice";

const { Title, Text, Paragraph } = Typography;

const CommonDiseasesDetail = () => {
  const navigate = useNavigate();
  const { diseaseId } = useParams();
  const dispatch = useDispatch();

  const {
    diseaseDetail: disease,
    loading,
    error,
  } = useSelector((state) => state.diseasesSlice || {});
  console.log("Disease Data in Component:", disease);

  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    diseaseId: "",
    name: "",
    description: "",
    foodModifyPercent: 0,
    saltModifyPercent: 0,
  });

  useEffect(() => {
    if (diseaseId) {
      dispatch(getDiseaseDetail(diseaseId)).then((res) => {
        console.log("Fetched Disease Data:", res.payload);
        if (res.payload) {
          setFormData({
            diseaseId: res.payload.diseaseId,
            name: res.payload.name,
            description: res.payload.description,
            foodModifyPercent: res.payload.foodModifyPercent,
            saltModifyPercent: res.payload.saltModifyPercent,
          });
          form.setFieldsValue(res.payload);
        }
      });
    }
  }, [dispatch, diseaseId, form]);

  const handleEditClick = () => setEditMode(true);
  const handleCancelEdit = () => {
    setEditMode(false);
    form.setFieldsValue(formData);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = { ...disease, ...values, diseaseId };

      console.log("Updating Disease with ID:", diseaseId);
      console.log("Updated Data:", updatedData);

      const response = await dispatch(updateDisease(updatedData));
      if (response.error) throw new Error(response.error.message);

      setFormData(updatedData);
      setEditMode(false);
      dispatch(getDiseaseDetail(diseaseId));
      message.success("Cập Nhật Bệnh Thành Công!");
    } catch (error) {
      message.error("Failed to update disease!");
    }
  };

  const cardStyle = {
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%", // Ensure the card takes the full width
    height: "675px", // Remove fixed height
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center p-6">
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={() => navigate("/admin/diseases")}
          className="flex items-center text-gray-700 hover:text-blue-600"
        >
          Trang chủ
        </Button>
        {!editMode && (
          <Button
            icon={<EditOutlined />}
            style={{
              height: "40px",
              width: "160px",
              borderRadius: "10px",
              backgroundColor: "orange",
              color: "white",
            }}
            className="ml-4"
            onClick={handleEditClick}
          >
            Chỉnh Sửa
          </Button>
        )}
      </div>

      {/* Loading and Error Handling */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mt-10">
          {error || "Failed to load data"}
        </div>
      ) : !disease ? (
        <div className="text-gray-500 text-center mt-10">
          No disease data available
        </div>
      ) : (
        <div className="px-4 sm:px-6 lg:px-8">
          <Title level={2} className="text-gray-800 mb-6">
            Chi Tiết Bệnh
          </Title>
          {/* Single Card with Two Columns */}
          <Card style={cardStyle} className="bg-white">
            <div className="flex flex-col md:flex-row gap-6 p-4">
              {/* Image Section (Left) */}
              <div className="md:w-1/2">
                <img
                  alt={disease?.name || "Disease Image"}
                  src={disease?.image || "https://via.placeholder.com/300"}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>

              {/* Details Section (Right) */}
              <div className="md:w-1/2 space-y-4">
                {/* Name */}
                <div>
                  <Text strong className="text-green-600">
                    Tên Bệnh
                  </Text>
                  {editMode ? (
                    <Form form={form} layout="vertical">
                      <Form.Item
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: "Please enter disease name",
                          },
                        ]}
                      >
                        <Input placeholder="Enter disease name" />
                      </Form.Item>
                    </Form>
                  ) : (
                    <Paragraph className="pl-2 mt-2 text-gray-700 text-4xl">
                      {disease?.name || "No name available."}
                    </Paragraph>
                  )}
                </div>

                {/* Description */}
                <div>
                  <Text strong className="text-green-600">
                    Mô Tả
                  </Text>
                  {editMode ? (
                    <Form form={form} layout="vertical">
                      <Form.Item name="description">
                        <Input.TextArea
                          rows={4}
                          placeholder="Enter disease description"
                        />
                      </Form.Item>
                    </Form>
                  ) : (
                    <Paragraph className="pl-2 mt-2 text-gray-700">
                      {disease?.description || "No description available."}
                    </Paragraph>
                  )}
                </div>

                {/* Food Percentage */}
                <div>
                  <Text strong className="text-green-600">
                    Phần Trăm Thức Ăn
                  </Text>
                  {editMode ? (
                    <Form form={form} layout="vertical">
                      <Form.Item name="foodModifyPercent">
                        <Input
                          type="number"
                          suffix="g"
                          placeholder="Enter food percentage"
                        />
                      </Form.Item>
                    </Form>
                  ) : (
                    <Text className="pl-2 text-gray-700">
                      {disease?.foodModifyPercent || 0} g
                    </Text>
                  )}
                </div>

                {/* Salt Percentage */}
                <div>
                  <Text strong className="text-green-600">
                    Phần Trăm Muối
                  </Text>
                  {editMode ? (
                    <Form form={form} layout="vertical">
                      <Form.Item name="saltModifyPercent">
                        <Input
                          type="number"
                          suffix="g"
                          placeholder="Enter salt percentage"
                        />
                      </Form.Item>
                    </Form>
                  ) : (
                    <Text className="pl-2 text-gray-700">
                      {disease?.saltModifyPercent || 0} g
                    </Text>
                  )}
                </div>

                {/* Medicines */}
                {/* <div>
                  <Text strong className="text-green-600">
                    Thuốc
                  </Text>
                  {disease?.medicines && disease.medicines.length > 0 ? (
                    <List
                      dataSource={disease.medicines}
                      renderItem={(medicine) => (
                        <List.Item className="pl-2">
                          <Text className="text-gray-700">
                            • {medicine.name || "Unnamed Medicine"}
                          </Text>
                        </List.Item>
                      )}
                      className="mt-2"
                    />
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <Text className="text-gray-500">
                          Không có thuốc nào có sẵn
                        </Text>
                      }
                      className="mt-2"
                    />
                  )}
                </div> */}

                {/* Save & Cancel Buttons */}
                {editMode && (
                  <div className="flex gap-4 mt-4">
                    <Button type="primary" onClick={handleSave}>
                      Lưu
                    </Button>
                    <Button onClick={handleCancelEdit}>Hủy Bỏ</Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CommonDiseasesDetail;
