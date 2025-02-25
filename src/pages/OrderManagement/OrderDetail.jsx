import React from "react";
import { Table, Button, Tag } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

const OrderDetail = () => {
  const navigate = useNavigate();

  const handleRefund = () => {
    navigate("/shop/order-refund");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "5%",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      width: "30%",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "15%",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "10%",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "20%",
    },
    {
      title: "Actual Record",
      dataIndex: "actualRecord",
      key: "actualRecord",
      width: "20%",
      render: (_, record) => (
        <div>
          <div>Fee: {record.fee}</div>
          <div>Time: {record.time}</div>
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div>
          <Button type="link" className="p-0" icon={<EditOutlined />}>
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      id: 1,
      productName: "Yamato Nishiki Koi Food",
      price: "2,200,000 VND",
      quantity: 4,
      total: "11,000,000 VND",
      fee: "No Record",
      time: "No Record",
    },
  ];

  return (
    <div className="w-full`">
      {/* Header */}
      <div className="mb-6">
        <Button
          type="link"
          className="flex items-center px-0"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/shop/orderManagement")}
        >
          Return
        </Button>
        <h1 className="text-2xl font-normal mt-4">Order Detail #1</h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top Row with General Info and Status */}
        <div className="flex gap-6">
          {/* General Information Card */}
          <div className="flex-grow">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">
                General Information
              </h2>
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-32 text-gray-600">Member</span>
                  <span>John</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Phone Number</span>
                  <span>0123456789</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Address</span>
                  <span>44 Wagon Ave. Oviedo, FL 32765</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Order Date</span>
                  <span>00:00 20th July, 2024</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Payment Method</span>
                  <img
                    src="https://thuonghieumanh.vneconomy.vn/upload/vnpay.png"
                    alt="VNPay"
                    className="h-6"
                  />
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Payment Status</span>
                  <span>Not yet paid</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="w-96">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="mb-4">
                <span className="font-semibold">Status: </span>
                <Tag color="warning" className="ml-2">
                  Pending
                </Tag>
              </div>
              <div className="space-y-2">
                <Button danger block>
                  Cancel Order
                </Button>
                <Button type="primary" block onClick={handleRefund}>
                  Confirm Order
                </Button>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Status History</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span>17:30 12/05/2024</span>
                  <span className="text-gray-500">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Order Detail Card */}
        <div className="w-full bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Order Detail</h2>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            className="mb-4"
          />
          <div className="flex flex-col items-end space-y-2 mt-4">
            <div className="flex justify-end">
              <span className="text-gray-600 w-32">Temporary Price:</span>
              <span className="w-32 text-right">8,800,000 VND</span>
            </div>
            <div className="flex justify-end">
              <span className="text-gray-600 w-32">Delivery Fee:</span>
              <span className="w-32 text-right">200,000 VND</span>
            </div>
            <div className="flex justify-end">
              <span className="font-bold w-32">Total:</span>
              <span className="w-32 text-right text-red-500 font-bold">
                9,000,000 VND
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
