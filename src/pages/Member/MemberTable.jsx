import { Pagination, Table } from "antd";
import React from "react";
import UpdateMember from "./UpdateMember";

const renderUpdateMember = (record) => <UpdateMember record={record} />;

const MemberTable = () => {
  const dataSource = [
    {
      key: 1,
      memberId: 1,
      memberName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      membershipType: "Standard",
      startDate: "01/01/2023",
      endDate: "01/01/2024",
      status: "Active",
    },
    {
      key: 2,
      memberId: 2,
      memberName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      membershipType: "Standard",
      startDate: "01/01/2023",
      endDate: "01/01/2024",
      status: "Inactive",
    },
    {
      key: 3,
      memberId: 3,
      memberName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      membershipType: "Standard",
      startDate: "01/01/2023",
      endDate: "01/01/2024",
      status: "Expired",
    },
    {
      key: 4,
      memberId: 4,
      memberName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      membershipType: "Standard",
      startDate: "01/01/2023",
      endDate: "01/01/2024",
      status: "Active",
    },
    {
      key: 5,
      memberId: 5,
      memberName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      membershipType: "Standard",
      startDate: "01/01/2023",
      endDate: "01/01/2024",
      status: "Inactive",
    },
    {
      key: 6,
      memberId: 6,
      memberName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      membershipType: "Standard",
      startDate: "01/01/2023",
      endDate: "01/01/2024",
      status: "Expired",
    },
    {
      key: 7,
      memberId: 7,
      memberName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      membershipType: "Standard",
      startDate: "01/01/2023",
      endDate: "01/01/2024",
      status: "Active",
    },
    {
      key: 8,
      memberId: 8,
      memberName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      membershipType: "Standard",
      startDate: "01/01/2023",
      endDate: "01/01/2024",
      status: "Active",
    },
    {
      key: 9,
      memberId: 9,
      memberName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      membershipType: "Standard",
      startDate: "01/01/2023",
      endDate: "01/01/2024",
      status: "Active",
    },
    {
      key: 10,
      memberId: 10,
      memberName: "John",
      email: "john123@gmail.com",
      phone: "0123456789",
      membershipType: "Standard",
      startDate: "01/01/2023",
      endDate: "01/01/2024",
      status: "Active",
    },
  ];

  const columns = [
    {
      title: "Member ID",
      dataIndex: "memberId",
      key: "memberId",
    },
    {
      title: "Member Name",
      dataIndex: "memberName",
      key: "memberName",
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
      title: "Membership Type",
      dataIndex: "membershipType",
      key: "membershipType",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
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
        return renderUpdateMember(record);
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

export default MemberTable;
