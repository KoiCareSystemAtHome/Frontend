import React, { useEffect, useState } from "react";
import { Table, Pagination, Spin } from "antd";
import UpdateMembership from "./UpdateMembership";
import { useDispatch, useSelector } from "react-redux";
import useMembershipPackageList from "../../hooks/useMembershipPackageList";
import { getListMembershipPackageSelector } from "../../redux/selector";

const renderUpdateMembership = (record) => <UpdateMembership record={record} />;

function Membership({ dataSource }) {
  console.log("Datasource: ", dataSource);
  const packageList = useSelector(getListMembershipPackageSelector);
  console.log("package list", packageList);
  const dispatch = useDispatch();

  // pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Compute paginated data
  const paginatedData = dataSource.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "Package ID",
      dataIndex: "packageId",
      key: "packageId",
    },
    {
      title: "Package Title",
      dataIndex: "packageTitle",
      key: "packageTitle",
    },
    {
      title: "Description",
      dataIndex: "packageDescription",
      key: "packageDescription",
    },
    {
      title: "Package Price",
      dataIndex: "packagePrice",
      key: "packagePrice",
    },
    {
      title: "Package Type",
      dataIndex: "type",
      key: "type",
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
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => {
    //     let backgroundColor;
    //     if (status === "Active")
    //       backgroundColor = "#22c55e"; // Green for Active
    //     else if (status === "Inactive")
    //       backgroundColor = "#ef4444"; // Red for Inactive
    //     else if (status === "Expired") backgroundColor = "#facc15"; // Yellow for Expired
    //     return (
    //       <span
    //         className={`px-3 py-1 rounded-full text-white text-xs flex items-center justify-center`}
    //         style={{
    //           backgroundColor,
    //           width: "100px", // Fixed width
    //           height: "30px", // Fixed height
    //         }}
    //       >
    //         {status}
    //       </span>
    //     );
    //   },
    // },
    {
      title: "Edit",
      key: "edit",
      render: (record) => {
        return renderUpdateMembership(record);
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [dataSource, currentPage, pageSize]);

  // Get List
  const GetListTable = () => {
    setLoading(true);
    dispatch(useMembershipPackageList())
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  return (
    <div className="w-full">
      <Spin spinning={loading} tip="Loading...">
        <Table
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
          onChange={GetListTable}
        />
      </Spin>
      <Pagination
        total={dataSource.length}
        pageSize={pageSize}
        current={currentPage}
        showSizeChanger
        align="end"
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        onChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
      />
    </div>
  );
}

export default Membership;
