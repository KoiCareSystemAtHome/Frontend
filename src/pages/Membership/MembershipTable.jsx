import React, { useEffect, useState } from "react";
import { Table, Pagination, Spin, Button, DatePicker } from "antd";
import UpdateMembership from "./UpdateMembership";
import { useDispatch } from "react-redux";
import useMembershipPackageList from "../../hooks/useMembershipPackageList";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Input from "antd/es/input/Input";
import { ReloadOutlined } from "@ant-design/icons";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(utc);
dayjs.extend(timezone);
// Extend dayjs with plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const renderUpdateMembership = (record) => <UpdateMembership record={record} />;

function Membership({ dataSource }) {
  console.log("Datasource: ", dataSource);
  // const packageList = useSelector(getListMembershipPackageSelector);
  // console.log("package list", packageList);
  const dispatch = useDispatch();

  // Search State
  const [searchTitle, setSearchTitle] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  //const [searchPrice, setSearchPrice] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchStartDate, setSearchStartDate] = useState(null);
  const [searchEndDate, setSearchEndDate] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  // pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const getSortedData = (data) => {
    if (!sortField || !sortOrder) return data;

    return [...data].sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      if (sortField === "packagePrice") {
        valueA = Number(valueA) || 0;
        valueB = Number(valueB) || 0;
      } else if (sortField === "startDate" || sortField === "endDate") {
        valueA = valueA ? dayjs(valueA) : null;
        valueB = valueB ? dayjs(valueB) : null;
        if (!valueA) return sortOrder === "ascend" ? 1 : -1;
        if (!valueB) return sortOrder === "ascend" ? -1 : 1;
      }

      if (sortOrder === "ascend") {
        return valueA > valueB ? 1 : -1;
      }
      return valueA < valueB ? 1 : -1;
    });
  };

  // Filtered Data
  const filteredData = dataSource.filter((pkg) => {
    return (
      (searchTitle
        ? pkg.packageTitle.toLowerCase().includes(searchTitle.toLowerCase())
        : true) &&
      (searchDescription
        ? pkg.packageDescription
            .toLowerCase()
            .includes(searchDescription.toLowerCase())
        : true) &&
      (searchType
        ? pkg.type.toLowerCase().includes(searchType.toLowerCase())
        : true) &&
      (searchStartDate
        ? dayjs(pkg.startDate).isSameOrAfter(
            dayjs(searchStartDate).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY"),
            "day"
          )
        : true) &&
      (searchEndDate
        ? dayjs(pkg.endDate)
            .tz("Asia/Ho_Chi_Minh")
            .isSameOrBefore(
              dayjs(searchEndDate).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY"),
              "day"
            )
        : true)
    );
  });

  const sortedData = getSortedData(filteredData);
  // Compute paginated data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "STT",
      // dataIndex: "packageId",
      key: "packageId",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Tên Gói",
      dataIndex: "packageTitle",
      key: "packageTitle",
    },
    {
      title: "Mô Tả",
      dataIndex: "packageDescription",
      key: "packageDescription",
    },
    {
      title: "Giá Gói",
      dataIndex: "packagePrice",
      key: "packagePrice",
      width: 100,
      sorter: true,
      sortOrder: sortField === "packagePrice" && sortOrder,
      render: (price) => {
        // Check if price is a valid number, otherwise return a fallback
        return price && !isNaN(price)
          ? price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })
          : "N/A"; // Or any fallback value like 0 or an empty string
      },
    },
    {
      title: "Loại Gói",
      dataIndex: "type",
      key: "type",
      width: 150,
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
      sorter: true,
      sortOrder: sortField === "startDate" && sortOrder,
      render: (date) =>
        date
          ? dayjs.utc(date).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY")
          : "-",
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "endDate",
      key: "endDate",
      width: 150,
      sorter: true,
      sortOrder: sortField === "endDate" && sortOrder,
      render: (date) =>
        date
          ? dayjs.utc(date).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY")
          : "-",
    },
    {
      title: "Giai Đoạn",
      dataIndex: "peiod",
      key: "peiod",
      width: 100,
      render: (text) => `${text} Days`, // Optional: Appends "Days" to the data dynamically
    },
    {
      title: "Chỉnh Sửa",
      key: "edit",
      width: 100,
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
  }, [
    dataSource,
    currentPage,
    pageSize,
    searchTitle,
    searchDescription,
    searchType,
    searchStartDate,
    searchEndDate,
  ]);

  const handleTableChange = (pagination, filters, sorter) => {
    setSortField(sorter.field);
    setSortOrder(sorter.order);
    setCurrentPage(pagination.current || 1); // Add default value
    setPageSize(pagination.pageSize || 10); // Add default value
  };

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
    <div className="product-management-table" style={{ padding: "16px" }}>
      {/* Search Inputs */}
      <div className="filter-container">
        <Input
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          allowClear
          placeholder="Tên Gói"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          style={{ width: 220, borderRadius: 6, padding: "6px 10px" }}
        />
        <Input
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          allowClear
          placeholder="Mô Tả"
          value={searchDescription}
          onChange={(e) => setSearchDescription(e.target.value)}
          style={{ width: 250, borderRadius: 6, padding: "6px 10px" }}
        />
        <Input
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          allowClear
          placeholder="Loại"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={{ width: 150, borderRadius: 6, padding: "6px 10px" }}
        />
        <DatePicker
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          placeholder="Ngày Bắt Đầu"
          value={searchStartDate ? dayjs(searchStartDate, "DD-MM-YYYY") : null}
          onChange={(date) =>
            setSearchStartDate(date ? date.format("DD-MM-YYYY") : "")
          }
          format="DD-MM-YYYY"
          style={{ height: 36 }}
        />
        <DatePicker
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          placeholder="Ngày Kết Thúc"
          value={searchEndDate ? dayjs(searchEndDate, "DD-MM-YYYY") : null}
          onChange={(date) =>
            setSearchEndDate(date ? date.format("DD-MM-YYYY") : "")
          }
          format="DD-MM-YYYY"
          style={{ height: 36 }}
        />

        <Button
          icon={<ReloadOutlined />}
          onClick={() => {
            setSearchTitle("");
            setSearchDescription("");
            //setSearchPrice("");
            setSearchType("");
            setSearchStartDate(null);
            setSearchEndDate(null);
          }}
          style={{ height: 36 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-md flex items-center justify-center"
        >
          Cài lại bộ lọc
        </Button>
      </div>
      <Spin spinning={loading} tip="Đang Tải...">
        <Table
          scroll={{ x: 1700 }}
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
          onChange={handleTableChange}
        />
      </Spin>
      <div className="pagination-container">
        <Pagination
          total={filteredData.length || 0}
          pageSize={pageSize || 10}
          current={currentPage || 1}
          showSizeChanger
          align="end"
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} / ${total} gói thành viên`
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

export default Membership;
