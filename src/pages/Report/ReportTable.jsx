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
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

// const renderUpdateReport = (record) => <UpdateReport record={record} />;

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
              width: "120px",
              textAlign: "center",
              cursor: "pointer",
              fontSize: "16px",
              padding: "5px", // More padding for a larger tag
            }}
            icon={status ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            color={color}
          >
            {displayText}
          </Tag>
        );
      },
    },
    {
      title: "Thông Tin Chi Tiết",
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
    <div className="product-management-table" style={{ padding: "16px" }}>
      <Space className="filter-container">
        <DatePicker
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          format="DD-MM-YYYY"
          style={{ width: 200, height: 36 }}
          value={searchDate}
          onChange={(date) => {
            setSearchDate(date);
            setCurrentPage(1); // Reset to first page when searching
          }}
          placeholder="Ngày Tạo"
        />
        <Select
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          value={searchStatus}
          style={{ width: 150, height: 36 }}
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
          style={{ height: 36 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-md flex items-center justify-center"
        >
          Cài lại bộ lọc
        </Button>
      </Space>

      <Spin spinning={loading} tip="Đang Tải...">
        <Table
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
          total={filteredData.length}
          pageSize={pageSize}
          current={currentPage}
          showSizeChanger
          align="end"
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} / ${total} báo cáo`
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

export default ReportTable;
