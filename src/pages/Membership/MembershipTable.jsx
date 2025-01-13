import React from "react";
import { Table, Pagination } from "antd";
import UpdateMembership from "./UpdateMembership";

const renderUpdateMembership = (record) => <UpdateMembership record={record} />;

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
      status: "Inactive",
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
      status: "Expired",
    },
    {
      key: 4,
      packageId: 4,
      packageName: "Koi Premium Pack",
      description: "Allow user to have full access to the app",
      period: "1 year",
      packageTier: "Premium",
      price: "1.099.000 đ",
      status: "Inactive",
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
      status: "Inactive",
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
      status: "Expired",
    },
    {
      key: 8,
      packageId: 8,
      packageName: "Koi Premium Pack",
      description: "Allow user to have full access to the app",
      period: "1 year",
      packageTier: "Premium",
      price: "1.099.000 đ",
      status: "Inactive",
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
      status: "Inactive",
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
      render: (status) => {
        let backgroundColor;
        if (status === "Active")
          backgroundColor = "#22c55e"; // Green for Active
        else if (status === "Inactive")
          backgroundColor = "#ef4444"; // Red for Inactive
        else if (status === "Expired") backgroundColor = "#facc15"; // Yellow for Expired
        return (
          <span
            className={`px-3 py-1 rounded-full text-white text-xs flex items-center justify-center`}
            style={{
              backgroundColor,
              width: "100px", // Fixed width
              height: "30px", // Fixed height
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "Edit",
      key: "edit",
      render: (record) => {
        return renderUpdateMembership(record);
      },
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
