import { EyeOutlined } from "@ant-design/icons";
import { Button, Pagination, Table, Tag } from "antd";
import React from "react";

function OrdermanagementTable() {
  const dataSource = [
    {
      id: 1,
      orderDate: "12:09 02/02/2024",
      member: "John",
      total: "2,200,000 VND",
      paymentMethod: "VNPAY",
      status: "Delivered",
    },
    {
      id: 2,
      orderDate: "12:09 02/02/2024",
      member: "John",
      total: "2,200,000 VND",
      paymentMethod: "COD",
      status: "Pending",
    },
    {
      id: 3,
      orderDate: "12:09 02/02/2024",
      member: "John",
      total: "2,200,000 VND",
      paymentMethod: "VNPAY",
      status: "Cancelled",
    },
    {
      id: 4,
      orderDate: "12:09 02/02/2024",
      member: "John",
      total: "2,200,000 VND",
      paymentMethod: "COD",
      status: "Delivered",
    },
    {
      id: 5,
      orderDate: "12:09 02/02/2024",
      member: "John",
      total: "2,200,000 VND",
      paymentMethod: "VNPAY",
      status: "Pending",
    },
    {
      id: 6,
      orderDate: "12:09 02/02/2024",
      member: "John",
      total: "2,200,000 VND",
      paymentMethod: "COD",
      status: "Cancelled",
    },
    {
      id: 7,
      orderDate: "12:09 02/02/2024",
      member: "John",
      total: "2,200,000 VND",
      paymentMethod: "VNPAY",
      status: "Delivered",
    },
    {
      id: 8,
      orderDate: "12:09 02/02/2024",
      member: "John",
      total: "2,200,000 VND",
      paymentMethod: "COD",
      status: "Pending",
    },
    {
      id: 9,
      orderDate: "12:09 02/02/2024",
      member: "John",
      total: "2,200,000 VND",
      paymentMethod: "VNPAY",
      status: "Cancelled",
    },
    {
      id: 10,
      orderDate: "12:09 02/02/2024",
      member: "John",
      total: "2,200,000 VND",
      paymentMethod: "VNPAY",
      status: "Delivered",
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Member",
      dataIndex: "member",
      key: "member",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (text) => (
        <div className="flex items-center gap-2">
          {text === "VNPAY" ? (
            <img
              src="https://thuonghieumanh.vneconomy.vn/upload/vnpay.png"
              alt="VNPAY"
              className="h-12"
            />
          ) : (
            <div className="flex items-center">
              <img
                src="https://www.shutterstock.com/image-vector/cash-on-delivery-logo-cod-260nw-2192932617.jpg"
                alt="COD"
                className="h-12"
              />
              <span>COD</span>
            </div>
          )}
        </div>
      ),
    },
    // {
    //   title: "Payment Status",
    //   dataIndex: "paymentStatus",
    //   key: "paymentStatus",
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "gray";
        if (status === "Delivered") color = "green";
        if (
          status === "Cancelled" ||
          status === "Declined" ||
          status === "Delivered Unsuccessful"
        )
          color = "red";
        if (status === "Pending") color = "orange";

        return (
          <Tag
            color={color}
            className="px-2 py-1 rounded"
            style={{ width: 75, display: "block", textAlign: "center" }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "",
      key: "action",
      width: 70,
      render: () => (
        <Button
          type="text"
          icon={<EyeOutlined className="w-4 h-4" />}
          className="flex items-center justify-center"
        />
      ),
    },
  ];

  return (
    <div>
      <div className="w-full">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
        />
        <Pagination
          total={50}
          align="end"
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          defaultPageSize={10}
          defaultCurrent={1}
        />
      </div>
    </div>
  );
}

export default OrdermanagementTable;
