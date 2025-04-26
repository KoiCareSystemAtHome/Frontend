import { Button, DatePicker, Input, Pagination, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import useMemberList from "../../hooks/useMemberList";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { ReloadOutlined } from "@ant-design/icons";
//import UpdateMember from "./UpdateMember";

//const renderUpdateMember = (record) => <UpdateMember record={record} />;

// CSS styles for enhanced visuals
const tableStyles = `
  .product-management-table .ant-table {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: #fff;
  }

  .product-management-table .ant-table-thead > tr > th {
    background: linear-gradient(135deg,rgb(65, 65, 65),rgb(65, 65, 65));
    color: #fff;
    font-weight: 600;
    padding: 12px 16px;
    border-bottom: none;
    transition: background 0.3s;
  }

  .product-management-table .ant-table-tbody > tr:hover > td {
    background: #e6f7ff;
    transition: background 0.2s;
  }

  .product-management-table .ant-table-tbody > tr > td {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.3s;
  }

  .product-management-table .ant-table-tbody > tr:nth-child(even) {
    background: #fafafa;
  }

  .filter-container {
    background: #f9f9f9;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .filter-container .ant-input, 
  .filter-container .ant-select {
    border-radius: 6px;
    transition: all 0.3s;
  }

  .filter-container .ant-input:hover,
  .filter-container .ant-input:focus,
  .filter-container .ant-select:hover .ant-select-selector,
  .filter-container .ant-select-focused .ant-select-selector {
    border-color: #40a9ff !important;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
  }

  .filter-container .ant-btn {
    border-radius: 6px;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .filter-container .ant-btn:hover {
    background: #40a9ff;
    color: #fff;
    border-color: #40a9ff;
    transform: translateY(-1px);
  }

  .custom-spin .ant-spin-dot-item {
    background-color: #1890ff;
  }

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .pagination-container .ant-pagination-item-active {
    background:rgb(65, 65, 65);
    border-color:rgb(65, 65, 65);
  }

  .pagination-container .ant-pagination-item-active a {
    color: #fff;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-out;
  }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.innerText = tableStyles;
document.head.appendChild(styleSheet);

// Helper function to format date to DD-MM-YYYY
const formatDate = (dateString) => {
  if (!dateString) return "N/A"; // Handle null or undefined dates
  const date = new Date(dateString);
  if (isNaN(date)) return "Invalid Date"; // Handle invalid date strings
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

function MemberTable({ dataSource }) {
  console.log("Datasource: ", dataSource);
  //const packageList = useSelector(getListMembershipPackageSelector);
  //console.log("package list", packageList);
  const dispatch = useDispatch();

  // pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [createdDate, setCreatedDate] = useState(null); // Single date for createdDate
  const [validUntil, setValidUntil] = useState(null); // Single date for validUntil

  // Filter data based on search criteria
  const filteredData = dataSource.filter((item) => {
    const matchesUsername = item.userName
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    const createdDateObj = new Date(item.createdDate);
    const validUntilObj = new Date(item.validUntil);

    // Match exact date for createdDate (ignoring time)
    const matchesCreatedDate = createdDate
      ? dayjs(createdDate).isSame(dayjs(createdDateObj), "day")
      : true;

    // Match exact date for validUntil (ignoring time)
    const matchesValidUntil = validUntil
      ? dayjs(validUntil).isSame(dayjs(validUntilObj), "day")
      : true;

    return matchesUsername && matchesCreatedDate && matchesValidUntil;
  });

  // Compute paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "STT",
      // dataIndex: ["member", "memberId"],
      key: "memberId",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Tên Thành Viên",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Địa Chỉ",
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
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => formatDate(date), // Format the date here
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate), // Sort by createdDate
      sortDirections: ["ascend", "descend"], // Enable ascending and descending sort
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "validUntil",
      key: "validUntil",
      render: (date) => formatDate(date), // Format the date here
      sorter: (a, b) => new Date(a.validUntil) - new Date(b.validUntil), // Sort by validUntil
      sortDirections: ["ascend", "descend"], // Enable ascending and descending sort
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [dataSource, currentPage, pageSize, searchText, createdDate, validUntil]);

  // Get List
  // const GetListTable = () => {
  //   setLoading(true);
  //   dispatch(useMemberList())
  //     .then(() => {
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     });
  // };

  return (
    <div className="product-management-table" style={{ padding: "16px" }}>
      {/* Search Controls */}
      <div className="filter-container">
        <Input
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          placeholder="Tên thành viên"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200, height: 36 }}
        />

        <div>
          {/* <span style={{ marginRight: "0.5rem" }}>Ngày tạo:</span> */}
          <DatePicker
            prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
            placeholder="Ngày Tạo"
            format="DD-MM-YYYY"
            onChange={(date) => setCreatedDate(date)}
            value={createdDate}
            style={{ height: 36 }}
          />
        </div>

        <div>
          {/* <span style={{ marginRight: "0.5rem" }}>Ngày kết thúc:</span> */}
          <DatePicker
            prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
            placeholder="Ngày Kết Thúc"
            format="DD-MM-YYYY"
            onChange={(date) => setValidUntil(date)}
            value={validUntil}
            style={{ height: 36 }}
          />
        </div>

        <Button
          icon={<ReloadOutlined />}
          onClick={() => {
            setSearchText("");
            setCreatedDate(null);
            setValidUntil(null);
          }}
          style={{ height: 36 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-md flex items-center justify-center"
        >
          Cài lại bộ lọc
        </Button>
      </div>

      <Spin spinning={loading} tip="Đang Tải...">
        <Table
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
          //onChange={GetListTable}
        />
      </Spin>
      <div className="pagination-container">
        <Pagination
          total={filteredData.length}
          pageSize={pageSize}
          current={currentPage}
          showSizeChanger
          align="end"
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} / ${total} thành viên`
          }
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          }}
        />
      </div>
    </div>
  );
}

export default MemberTable;
