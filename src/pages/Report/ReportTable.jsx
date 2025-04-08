import {
  Button,
  DatePicker,
  Image,
  Pagination,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListReportSelector } from "../../redux/selector";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";

// const renderUpdateReport = (record) => <UpdateReport record={record} />;

function ReportTable({ dataSource }) {
  console.log("Datasource: ", dataSource);
  const reportList = useSelector(getListReportSelector);
  console.log("report list", reportList);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchDate, setSearchDate] = useState(null);
  const [searchStatus, setSearchStatus] = useState(null);

  const handleViewDetail = (reportId, rowIndex) => {
    navigate(`/admin/report-detail/${reportId}`, {
      state: { rowIndex },
    });
  };

  // Filter data based on search criteria
  const filteredData = dataSource.filter((item) => {
    const dateMatch = searchDate
      ? dayjs(item.createdDate).isSame(searchDate, "day")
      : true;
    const statusMatch = searchStatus
      ? item.status.toLowerCase() === searchStatus.toLowerCase()
      : true;
    return dateMatch && statusMatch;
  });

  // Compute paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleResetFilters = () => {
    setSearchDate(null);
    setSearchStatus(null);
    setCurrentPage(1); // Reset to the first page
    setPageSize(10); // Reset page size to default
  };

  const columns = [
    // {
    //   title: "Report ID",
    //   dataIndex: "reportId",
    //   key: "reportId",
    // },
    {
      title: "Đơn Hàng",
      //dataIndex: "orderId",
      key: "orderId",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (value) =>
        value ? dayjs(value).format("DD-MM-YYYY / HH:mm:ss") : "-",
      sorter: (a, b) => {
        const dateA = dayjs(a.createdDate);
        const dateB = dayjs(b.createdDate);
        return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
      },
      sortDirections: ["ascend", "descend"],
      //defaultSortOrder: "descend",
    },
    {
      title: "Lý Do",
      dataIndex: "reason",
      key: "reason",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image
            width={50}
            src={record.image}
            alt="Report"
            style={{ objectFit: "cover", borderRadius: 5 }}
            preview={{ mask: "Xem" }}
          />
          <span>{record.reason}</span>
        </div>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "green";
        let displayText = "Chấp nhận"; // Mặc định là "Chấp nhận"

        if (status.toLowerCase() === "pending") {
          color = "gold";
          displayText = "Đang chờ";
        } else if (status.toLowerCase() === "reject") {
          color = "red";
          displayText = "Từ chối";
        }

        return (
          <Tag
            style={{
              width: "90px",
              textAlign: "center",
              cursor: "pointer",
              fontSize: "16px",
              padding: "5px", // More padding for a larger tag
            }}
            color={color}
          >
            {displayText}
          </Tag>
        );
      },
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      // render: (_, record) => renderUpdateReport(record),
      render: (_, record, index) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <EyeOutlined
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={() =>
              handleViewDetail(
                record.reportId,
                index + 1 + (currentPage - 1) * pageSize
              )
            }
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [dataSource, currentPage, pageSize, searchDate, searchStatus]);

  // Get List
  // const GetListTable = () => {
  //   setLoading(true);
  //   dispatch(useReportList())
  //     .then(() => {
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     });
  // };

  const handleTableChange = (pagination, filters, sorter) => {
    setCurrentPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <DatePicker
          format="DD-MM-YYYY"
          style={{ width: 200 }}
          value={searchDate}
          onChange={(date) => {
            setSearchDate(date);
            setCurrentPage(1); // Reset to first page when searching
          }}
          placeholder="Ngày Tạo"
        />
        <Select
          value={searchStatus}
          style={{ width: 150 }}
          onChange={(value) => {
            setSearchStatus(value);
            setCurrentPage(1); // Reset to first page when searching
          }}
          allowClear
          placeholder="Trạng Thái"
        >
          <Select.Option value="approve">Chấp Nhận</Select.Option>
          <Select.Option value="reject">Từ Chối</Select.Option>
        </Select>
        <Button
          icon={<ReloadOutlined />}
          type="default"
          onClick={handleResetFilters}
          //disabled={!searchTitle && !searchDate && !searchStatus} // Disable when no filters applied
        >
          Cài lại bộ lọc
        </Button>
      </Space>

      <Spin spinning={loading} tip="Loading...">
        <Table
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
          onChange={handleTableChange}
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

export default ReportTable;
