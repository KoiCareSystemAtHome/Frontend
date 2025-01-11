import React from "react";
import { Table, Button, Popover, Pagination } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "./Membership.css";

const Membership = () => {
  const dataSource = [
    {
      key: 1,
      packageId: 1,
      packageName: "Koi Standard Pack",
      description:
        "Allow user to have access to the app but with limited features",
      period: "1 month",
      packageTier: "Standard",
      price: "299.000 đ",
      status: "Active",
    },
    {
      key: 2,
      packageId: 2,
      packageName: "Koi Premium Pack",
      description: "Allow user to have full access to the app",
      period: "1 year",
      packageTier: "Premium",
      price: "1.099.000 đ",
      status: "Active",
    },
    {
      key: 3,
      packageId: 3,
      packageName: "Koi Standard Pack",
      description:
        "Allow user to have access to the app but with limited features",
      period: "1 month",
      packageTier: "Standard",
      price: "299.000 đ",
      status: "Active",
    },
    {
      key: 4,
      packageId: 4,
      packageName: "Koi Premium Pack",
      description: "Allow user to have full access to the app",
      period: "1 year",
      packageTier: "Premium",
      price: "1.099.000 đ",
      status: "Active",
    },
    {
      key: 5,
      packageId: 5,
      packageName: "Koi Standard Pack",
      description:
        "Allow user to have access to the app but with limited features",
      period: "1 month",
      packageTier: "Standard",
      price: "299.000 đ",
      status: "Active",
    },
    {
      key: 6,
      packageId: 6,
      packageName: "Koi Premium Pack",
      description: "Allow user to have full access to the app",
      period: "1 year",
      packageTier: "Premium",
      price: "1.099.000 đ",
      status: "Active",
    },
    {
      key: 7,
      packageId: 7,
      packageName: "Koi Standard Pack",
      description:
        "Allow user to have access to the app but with limited features",
      period: "1 month",
      packageTier: "Standard",
      price: "299.000 đ",
      status: "Active",
    },
    {
      key: 8,
      packageId: 8,
      packageName: "Koi Premium Pack",
      description: "Allow user to have full access to the app",
      period: "1 year",
      packageTier: "Premium",
      price: "1.099.000 đ",
      status: "Active",
    },
    {
      key: 9,
      packageId: 9,
      packageName: "Koi Standard Pack",
      description:
        "Allow user to have access to the app but with limited features",
      period: "1 month",
      packageTier: "Standard",
      price: "299.000 đ",
      status: "Active",
    },
    {
      key: 10,
      packageId: 10,
      packageName: "Koi Premium Pack",
      description: "Allow user to have full access to the app",
      period: "1 year",
      packageTier: "Premium",
      price: "1.099.000 đ",
      status: "Active",
    },
  ];

  const columns = [
    {
      title: "Package ID",
      dataIndex: "packageId",
      key: "packageId",
    },
    {
      title: "Package Name",
      dataIndex: "packageName",
      key: "packageName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Period",
      dataIndex: "period",
      key: "period",
    },
    {
      title: "Package Tier",
      dataIndex: "packageTier",
      key: "packageTier",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className="px-3 py-1 rounded-full bg-[#5BD9C5] text-white text-xs">
          {status}
        </span>
      ),
    },
    {
      title: "Edit",
      key: "edit",
      render: () => (
        <Popover content="Edit" trigger="hover">
          <Button
            type="primary"
            icon={<EditOutlined />}
            className="bg-[#FFC043] hover:bg-[#FFB520] border-none shadow-none flex items-center justify-center"
            style={{
              width: "32px",
              height: "32px",
              padding: 0,
            }}
          />
        </Popover>
      ),
    },
  ];

  return (
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
  );
};

export default Membership;
