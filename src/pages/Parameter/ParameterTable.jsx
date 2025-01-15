import { Pagination, Table } from "antd";
import React from "react";
import UpdateParameter from "./UpdateParameter";

const renderUpdateParameter = (record) => <UpdateParameter record={record} />;

const ParameterTable = () => {
  const dataSource = [
    {
      key: 1,
      parameterId: 1,
      parameterName: "Nitrite",
      parameterCode: "NO2",
      medium: "0123456789",
      warningDangerRange: "0.02 - 0.04",
      type: "water-control",
      updatedDate: "01/01/2024",
      status: "Active",
    },
    {
      key: 2,
      parameterId: 2,
      parameterName: "Nitrite",
      parameterCode: "NO2",
      medium: "0123456789",
      warningDangerRange: "0.02 - 0.04",
      type: "water-control",
      updatedDate: "01/01/2024",
      status: "Inactive",
    },
    {
      key: 3,
      parameterId: 3,
      parameterName: "Nitrite",
      parameterCode: "NO2",
      medium: "0123456789",
      warningDangerRange: "0.02 - 0.04",
      type: "water-control",
      updatedDate: "01/01/2024",
      status: "Active",
    },
    {
      key: 4,
      parameterId: 4,
      parameterName: "Nitrite",
      parameterCode: "NO2",
      medium: "0123456789",
      warningDangerRange: "0.02 - 0.04",
      type: "water-control",
      updatedDate: "01/01/2024",
      status: "Inactive",
    },
    {
      key: 5,
      parameterId: 5,
      parameterName: "Nitrite",
      parameterCode: "NO2",
      medium: "0123456789",
      warningDangerRange: "0.02 - 0.04",
      type: "water-control",
      updatedDate: "01/01/2024",
      status: "Active",
    },
    {
      key: 6,
      parameterId: 6,
      parameterName: "Nitrite",
      parameterCode: "NO2",
      medium: "0123456789",
      warningDangerRange: "0.02 - 0.04",
      type: "water-control",
      updatedDate: "01/01/2024",
      status: "Inactive",
    },
    {
      key: 7,
      parameterId: 7,
      parameterName: "Nitrite",
      parameterCode: "NO2",
      medium: "0123456789",
      warningDangerRange: "0.02 - 0.04",
      type: "water-control",
      updatedDate: "01/01/2024",
      status: "Active",
    },
    {
      key: 8,
      parameterId: 8,
      parameterName: "Nitrite",
      parameterCode: "NO2",
      medium: "0123456789",
      warningDangerRange: "0.02 - 0.04",
      type: "water-control",
      updatedDate: "01/01/2024",
      status: "Inactive",
    },
    {
      key: 9,
      parameterId: 9,
      parameterName: "Nitrite",
      parameterCode: "NO2",
      medium: "0123456789",
      warningDangerRange: "0.02 - 0.04",
      type: "water-control",
      updatedDate: "01/01/2024",
      status: "Active",
    },
    {
      key: 10,
      parameterId: 10,
      parameterName: "Nitrite",
      parameterCode: "NO2",
      medium: "0123456789",
      warningDangerRange: "0.02 - 0.04",
      type: "water-control",
      updatedDate: "01/01/2024",
      status: "Inactive",
    },
  ];
  const columns = [
    {
      title: "Parameter ID",
      dataIndex: "parameterId",
      key: "parameterId",
    },
    {
      title: "Parameter Name",
      dataIndex: "parameterName",
      key: "parameterName",
    },
    {
      title: "Parameter Code",
      dataIndex: "parameterCode",
      key: "parameterCode",
    },
    {
      title: "Medium",
      dataIndex: "medium",
      key: "medium",
    },
    {
      title: "Warning - Danger Range (g/m2)",
      dataIndex: "warningDangerRange",
      key: "warningDangerRange",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Updated Date",
      dataIndex: "updatedDate",
      key: "updatedDate",
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
        return renderUpdateParameter(record);
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

export default ParameterTable;
