import { Button, DatePicker, Input, Pagination, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import useMemberList from "../../hooks/useMemberList";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
//import UpdateMember from "./UpdateMember";

//const renderUpdateMember = (record) => <UpdateMember record={record} />;

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
      title: "",
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
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "validUntil",
      key: "validUntil",
      render: (date) => formatDate(date), // Format the date here
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [dataSource, currentPage, pageSize, searchText, createdDate, validUntil]);

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
      {/* Search Controls */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tên thành viên"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />

        <div>
          {/* <span style={{ marginRight: "0.5rem" }}>Ngày tạo:</span> */}
          <DatePicker
            prefix={<SearchOutlined />}
            placeholder="Ngày Tạo"
            format="DD-MM-YYYY"
            onChange={(date) => setCreatedDate(date)}
            value={createdDate}
          />
        </div>

        <div>
          {/* <span style={{ marginRight: "0.5rem" }}>Ngày kết thúc:</span> */}
          <DatePicker
            prefix={<SearchOutlined />}
            placeholder="Ngày Kết Thúc"
            format="DD-MM-YYYY"
            onChange={(date) => setValidUntil(date)}
            value={validUntil}
          />
        </div>

        <Button
          icon={<ReloadOutlined />}
          onClick={() => {
            setSearchText("");
            setCreatedDate(null);
            setValidUntil(null);
          }}
          style={{
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          Cài lại bộ lọc
        </Button>
      </div>

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
        total={filteredData.length}
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
