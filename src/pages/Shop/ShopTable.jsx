import { Pagination, Table } from "antd";
import React from "react";
import UpdateShop from "./UpdateShop";

const renderUpdateShop = (record) => <UpdateShop record={record} />;
const ShopTable = () => {
  const dataSource = [
    {
      key: 1,
      shopId: 1,
      shopName: "Koi Guardian",
      ownerName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      shopAddress: "Apt. 340 62580 Dong Ferry, Laneton, UT 24917-6849",
      status: "Active",
    },
    {
      key: 2,
      shopId: 2,
      shopName: "Koi Guardian",
      ownerName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      shopAddress: "Apt. 340 62580 Dong Ferry, Laneton, UT 24917-6849",
      status: "Inactive",
    },
    {
      key: 3,
      shopId: 3,
      shopName: "Koi Guardian",
      ownerName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      shopAddress: "Apt. 340 62580 Dong Ferry, Laneton, UT 24917-6849",
      status: "Active",
    },
    {
      key: 4,
      shopId: 4,
      shopName: "Koi Guardian",
      ownerName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      shopAddress: "Apt. 340 62580 Dong Ferry, Laneton, UT 24917-6849",
      status: "Inactive",
    },
    {
      key: 5,
      shopId: 5,
      shopName: "Koi Guardian",
      ownerName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      shopAddress: "Apt. 340 62580 Dong Ferry, Laneton, UT 24917-6849",
      status: "Active",
    },
    {
      key: 6,
      shopId: 6,
      shopName: "Koi Guardian",
      ownerName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      shopAddress: "Apt. 340 62580 Dong Ferry, Laneton, UT 24917-6849",
      status: "Inactive",
    },
    {
      key: 7,
      shopId: 7,
      shopName: "Koi Guardian",
      ownerName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      shopAddress: "Apt. 340 62580 Dong Ferry, Laneton, UT 24917-6849",
      status: "Active",
    },
    {
      key: 8,
      shopId: 8,
      shopName: "Koi Guardian",
      ownerName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      shopAddress: "Apt. 340 62580 Dong Ferry, Laneton, UT 24917-6849",
      status: "Inactive",
    },
    {
      key: 9,
      shopId: 9,
      shopName: "Koi Guardian",
      ownerName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      shopAddress: "Apt. 340 62580 Dong Ferry, Laneton, UT 24917-6849",
      status: "Active",
    },
    {
      key: 10,
      shopId: 10,
      shopName: "Koi Guardian",
      ownerName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      shopAddress: "Apt. 340 62580 Dong Ferry, Laneton, UT 24917-6849",
      status: "Inactive",
    },
  ];

  const columns = [
    {
      title: "Shop ID",
      dataIndex: "shopId",
      key: "shopId",
    },
    {
      title: "Shop Name",
      dataIndex: "shopName",
      key: "shopName",
    },
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Shop Address",
      dataIndex: "shopAddress",
      key: "shopAddress",
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
        return renderUpdateShop(record);
      },
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
};

export default ShopTable;
