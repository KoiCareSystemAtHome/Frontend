import React, { useEffect, useState } from "react";
import { Table, Pagination, Spin, Button, DatePicker } from "antd";
import UpdateMembership from "./UpdateMembership";
import { useDispatch, useSelector } from "react-redux";
import useMembershipPackageList from "../../hooks/useMembershipPackageList";
import { getListMembershipPackageSelector } from "../../redux/selector";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Input from "antd/es/input/Input";
import { AlignCenterOutlined, ReloadOutlined } from "@ant-design/icons";
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

  // pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
      // (searchPrice
      //   ? pkg.packagePrice.toString().includes(searchPrice)
      //   : true) &&
      (searchType
        ? pkg.type.toLowerCase().includes(searchType.toLowerCase())
        : true) &&
      (searchStartDate
        ? dayjs(pkg.startDate).isSameOrAfter(searchStartDate, "day")
        : true) &&
      (searchEndDate
        ? dayjs(pkg.endDate)
            .tz("Asia/Ho_Chi_Minh")
            .isSameOrBefore(
              dayjs(searchEndDate).tz("Asia/Ho_Chi_Minh").endOf("day"),
              "day"
            )
        : true)
    );
  });

  // Compute paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "",
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
      {/* Search Inputs */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <Input
          allowClear
          placeholder="Tên Gói"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          style={{ width: 220, borderRadius: 6, padding: "6px 10px" }}
        />
        <Input
          allowClear
          placeholder="Mô Tả"
          value={searchDescription}
          onChange={(e) => setSearchDescription(e.target.value)}
          style={{ width: 250, borderRadius: 6, padding: "6px 10px" }}
        />
        {/* <Input
          allowClear
          placeholder="Search by Price"
          value={searchPrice}
          onChange={(e) => setSearchPrice(e.target.value)}
          style={{ width: 220, borderRadius: 6, padding: "6px 10px" }}
        /> */}
        <Input
          allowClear
          placeholder="Loại"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={{ width: 220, borderRadius: 6, padding: "6px 10px" }}
        />
        <DatePicker
          placeholder="Ngày Bắt Đầu"
          value={searchStartDate}
          onChange={(date) => setSearchStartDate(date)}
        />
        <DatePicker
          placeholder="Ngày Kết Thúc"
          value={searchEndDate}
          onChange={(date) => setSearchEndDate(date)}
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
          scroll={{ x: 1700 }}
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

export default Membership;
