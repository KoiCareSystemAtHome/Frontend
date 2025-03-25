import { Pagination, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import useMemberList from "../../hooks/useMemberList";
import { useDispatch } from "react-redux";
//import UpdateMember from "./UpdateMember";

//const renderUpdateMember = (record) => <UpdateMember record={record} />;

function MemberTable({ dataSource }) {
  console.log("Datasource: ", dataSource);
  //const packageList = useSelector(getListMembershipPackageSelector);
  //console.log("package list", packageList);
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
      title: "",
      // dataIndex: ["member", "memberId"],
      key: "memberId",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Member Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
    },
    // {
    //   title: "Phone Number",
    //   dataIndex: "phone",
    //   key: "phone",
    // },
    {
      title: "Address",
      dataIndex: ["member", "address"],
      key: "address",
      render: (address) => {
        if (!address) return "N/A"; // Handle missing or null address

        try {
          // Parse the stringified JSON
          const parsedAddress = JSON.parse(address);

          // Extract values
          const { WardName, DistrictName, ProvinceName } = parsedAddress || {};

          // Return formatted address, ignoring empty values
          return [WardName, DistrictName, ProvinceName]
            .filter(Boolean)
            .join(", ");
        } catch (error) {
          return "Invalid Address";
        }
      },
    },
    // {
    //   title: "Membership Type",
    //   dataIndex: "membershipType",
    //   key: "membershipType",
    // },
    {
      title: "Start Date",
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: "End Date",
      dataIndex: "validUntil",
      key: "validUntil",
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
    // {
    //   title: "Edit",
    //   key: "edit",
    //   render: (record) => {
    //     return renderUpdateMember(record);
    //   },
    // },
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
    dispatch(useMemberList())
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
          dataSource={!loading ? paginatedData : []}
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

export default MemberTable;
