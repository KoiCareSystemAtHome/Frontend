import React from "react";
import {
  Card,
  Button,
  Table,
  Row,
  Col,
  Typography,
  Divider,
  Timeline,
  Input,
} from "antd";
import {
  ArrowLeftOutlined,
  CarOutlined,
  FileTextOutlined,
  FlagOutlined,
  LaptopOutlined,
  LoadingOutlined,
  RollbackOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";

const { Title, Text } = Typography;

const OrderRefund = () => {
  const navigate = useNavigate();

  // Order status steps
  const orderStatus = [
    {
      status: "Đơn Hàng Đã Đặt",
      date: "21:05 22-12-2024",
      icon: <FileTextOutlined style={{ fontSize: "16px" }} />,
      color: "#10B981",
    },
    {
      status: "Đã Xác Nhận Thông Tin Thanh Toán",
      date: "01:05 23-12-2024",
      icon: <LaptopOutlined style={{ fontSize: "16px" }} />,
      color: "#10B981",
    },
    {
      status: "Đã Giao Cho ĐVVC",
      date: "19:21 23-12-2024",
      icon: <CarOutlined style={{ fontSize: "16px" }} />,
      color: "#10B981",
    },
    {
      status: "Yêu Cầu Trả Hàng/ Hoàn Tiền",
      date: "",
      icon: <RollbackOutlined style={{ fontSize: "16px" }} />,
      color: "#10B981",
    },
    {
      status: "Đánh Giá",
      date: "",
      icon: <StarOutlined style={{ fontSize: "16px" }} />,
      color: "#D1D5DB",
    },
  ];

  // Table columns configuration
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: () => <div className="w-12 h-12 bg-gray-200"></div>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (text) => `${text.toLocaleString()} VND`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "right",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "right",
      render: (text) => `${text.toLocaleString()} VND`,
    },
  ];

  // Table data
  const data = [
    {
      key: "1",
      id: 1,
      name: "Yamato Nishiki Koi Food",
      price: 2200000,
      quantity: 2,
      total: 4400000,
    },
    {
      key: "2",
      id: 2,
      name: "Yamato Nishiki Koi Food",
      price: 2200000,
      quantity: 2,
      total: 4400000,
    },
  ];

  return (
    <div>
      {/* Header */}
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        className="mb-4"
        onClick={() => navigate("/shop/order-detail")}
      >
        Return
      </Button>

      <Title level={4}>Order Detail #1</Title>

      <Row gutter={[16, 16]}>
        {/* Return/Refund Card */}
        <Col xs={24} md={12}>
          <Card className="w-full shadow-sm rounded-lg">
            <div className="space-y-4">
              {/* Title */}
              <h2 className="text-xl font-normal mb-6">
                Return Product / Refund
              </h2>

              {/* Status */}
              <div className="mb-4">
                <div className="text-sm font-normal mb-1">Status</div>
                <div className="flex items-center gap-2">
                  <LoadingOutlined className="text-gray-400" />
                  <span className="text-gray-600">Pending</span>
                </div>
              </div>

              {/* Title Section */}
              <div className="mb-4">
                <div className="text-sm font-normal mb-1">Title</div>
                <div className="text-sm">I want to return the product</div>
              </div>

              {/* Detail Section */}
              <div className="mb-4">
                <div className="text-sm font-normal mb-1">Detail</div>
                <div className="text-sm">
                  I want to change this product with a different one
                </div>
              </div>

              {/* Image Section */}
              <div className="mb-4">
                <div className="text-sm font-normal mb-1">Image</div>
                <div className="w-16 h-24">
                  <img
                    src="/api/placeholder/64/96"
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Notes Input */}
              <div className="mb-6">
                <div className="flex items-center mb-1">
                  <span className="text-sm font-normal">Notes</span>
                  <span className="text-red-500 ml-1">*</span>
                </div>
                <Input className="w-full" />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  danger
                  type="primary"
                  className="w-full h-10 font-normal"
                >
                  Decline
                </Button>
                <Button
                  type="primary"
                  className="w-full h-10 font-normal bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
                >
                  Accept
                </Button>
              </div>
            </div>
          </Card>

          {/* General Information */}
          <Card className="mt-4" title="General Information">
            <Row gutter={[16, 8]}>
              <Col span={24}>
                <Text strong>GHTK Delivery Code: </Text>
                <Text>XZY615CGGP2KMVBVEVPDV1SSMLRGH</Text>
              </Col>
              <Col span={24}>
                <Text strong>Member: </Text>
                <Text>John</Text>
              </Col>
              <Col span={24}>
                <Text strong>Phone Number: </Text>
                <Text>0123456789</Text>
              </Col>
              <Col span={24}>
                <Text strong>Address: </Text>
                <Text>44 Wagon Ave, Oviedo, FL 32765</Text>
              </Col>
              <Col span={24}>
                <Text strong>Order Date: </Text>
                <Text>00:00 20th July, 2024</Text>
              </Col>
              <Col span={24}>
                <Text strong>Payment Method: </Text>
                <Text className="text-blue-600">Money</Text>
              </Col>
              <Col span={24}>
                <Text strong>Payment Status: </Text>
                <Text>Not yet paid</Text>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Status Card */}
        <Col xs={24} md={12}>
          <Card className="w-full max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-semibold">Status:</div>
              <div className="flex items-center gap-2">
                <FlagOutlined className="text-yellow-400" />
                <span>Report</span>
              </div>
            </div>

            <div className="mt-2">
              <div className="font-medium mb-4">Status History</div>
              <Timeline
                items={orderStatus.map((item) => ({
                  dot: (
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-full border-2"
                      style={{
                        borderColor: item.color,
                        backgroundColor: "white",
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        style: { color: item.color },
                      })}
                    </div>
                  ),
                  children: (
                    <div className="ml-2 mb-8">
                      <div className="font-medium">{item.status}</div>
                      {item.date && (
                        <div className="text-sm text-gray-500">{item.date}</div>
                      )}
                    </div>
                  ),
                }))}
              />
            </div>
          </Card>
        </Col>

        {/* Order Details */}
        <Col span={24}>
          <Card title="Order Detail">
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              className="mb-4"
            />

            <div className="space-y-2 mt-4">
              <Row justify="space-between">
                <Col>Temporary Price:</Col>
                <Col>8,800,000 VND</Col>
              </Row>
              <Row justify="space-between">
                <Col>Delivery Fee:</Col>
                <Col>200,000 VND</Col>
              </Row>
              <Row justify="space-between">
                <Col>Delivery Discount:</Col>
                <Col>-0 VND</Col>
              </Row>
              <Row justify="space-between">
                <Col>Product Discount:</Col>
                <Col>-0 VND</Col>
              </Row>
              <Row justify="space-between">
                <Col>Promotion Discount:</Col>
                <Col>-120,000 VND</Col>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Col>
                  <Text strong>Total:</Text>
                </Col>
                <Col>
                  <Text strong className="text-red-600">
                    8,880,000 VND
                  </Text>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderRefund;
