import {
  Button,
  Image,
  Input,
  Pagination,
  Select,
  Spin,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useBlogList from "../../hooks/useBlogList";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

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

function ReviewBlogTable({ dataSource }) {
  console.log("Datasource: ", dataSource);
  // const blogList = useSelector(getListBlogSelector);
  // console.log("blog list", blogList);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Search filter states
  const [searchTitle, setSearchTitle] = useState("");
  const [searchDate, setSearchDate] = useState(null);
  const [searchStatus, setSearchStatus] = useState(null);

  // Ensure dataSource is an array, default to empty array if undefined
  const safeDataSource = Array.isArray(dataSource) ? dataSource : [];

  // Filter data based on search criteria
  const filteredData = safeDataSource.filter((item) => {
    // Safeguard for title: default to empty string if undefined
    const title = item.title || "";
    const titleMatch = title.toLowerCase().includes(searchTitle.toLowerCase());

    const dateMatch = searchDate
      ? dayjs(item.reportedDate).isSame(searchDate, "day")
      : true;

    const statusMatch =
      searchStatus !== null
        ? (item.isApproved === true || item.isApproved === "true") ===
          (searchStatus === "approved")
        : true;

    return titleMatch && dateMatch && statusMatch;
  });

  // Compute paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewDetail = (blogId) => {
    navigate(`/admin/review-blog-detail/${blogId}`);
    console.log("Navigating to detail page with ID:", blogId);
  };

  // const handleStatusChange = (blogId, isApproved) => {
  //   const newStatus = !isApproved;

  //   Modal.confirm({
  //     title: "Xác nhận Thay đổi Trạng thái",
  //     content: `Bạn có chắc chắn muốn thay đổi trạng thái thành ${
  //       newStatus ? "Chấp Nhận" : "Từ Chối"
  //     }?`,
  //     okText: "Có",
  //     cancelText: "Không",
  //     centered: true,
  //     onOk: async () => {
  //       try {
  //         await dispatch(approveBlog({ blogId, newStatus })).unwrap();
  //         dispatch(getListBlog()); // Refresh list after update

  //         notification.success({
  //           message: "Trạng thái đã được cập nhật",
  //           // description: `Bạn có chắc chắn muốn thay đổi trạng thái thành ${
  //           //   newStatus ? "Chấp Nhận" : "Từ Chối"
  //           // }`,
  //           placement: "top",
  //         });
  //       } catch (error) {
  //         notification.error({
  //           message: "Update Failed",
  //           description: "Failed to update blog status. Please try again!",
  //           placement: "top",
  //         });
  //       }
  //     },
  //   });
  // };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTitle("");
    setSearchDate(null);
    setSearchStatus(null);
    setCurrentPage(1); // Reset to the first page
    setPageSize(10); // Reset page size to default
  };

  const columns = [
    {
      title: "STT",
      //dataIndex: "blogId",
      key: "blogId",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Tựa Đề",
      key: "title",
      render: (record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image
            width={50}
            height={50}
            src={record.images}
            alt={record.title}
            style={{ objectFit: "cover", borderRadius: 5 }}
            preview={{ mask: <EyeOutlined /> }}
          />
          <span>{record.title}</span>
        </div>
      ),
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
    },
    // {
    //   title: "Report By",
    //   dataIndex: "reportedBy",
    //   key: "reportedBy",
    // },
    // {
    //   title: "Reported Date",
    //   dataIndex: "reportedDate",
    //   key: "reportedDate",
    // },
    // {
    //   title: "Shop",
    //   dataIndex: ["shop", "name"],
    //   key: "name",
    // },
    // {
    //   title: "Số Lượng View",
    //   dataIndex: "view",
    //   key: "view",
    // },
    {
      title: "Trạng Thái",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (isApproved, record) => {
        let statusText, statusColor, statusIcon;

        if (isApproved === null) {
          statusText = "Đang Chờ Duyệt";
          statusColor = "gold";
          statusIcon = <SyncOutlined />;
        } else {
          const approved = isApproved === true || isApproved === "true";
          statusText = approved ? "Chấp Nhận" : "Từ Chối";
          statusColor = approved ? "green" : "red";
          statusIcon = approved ? (
            <CheckCircleOutlined />
          ) : (
            <CloseCircleOutlined />
          );
        }

        return (
          <Tag
            style={{
              width: "150px",
              textAlign: "center",
              cursor: "pointer",
              fontSize: "16px",
              padding: "5px",
            }}
            icon={statusIcon}
            color={statusColor}
          >
            {statusText}
          </Tag>
        );
      },
    },
    {
      title: "",
      key: "action",
      render: (record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <EyeOutlined
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={() => handleViewDetail(record.blogId)}
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
  }, [
    dataSource,
    currentPage,
    pageSize,
    searchTitle,
    searchDate,
    searchStatus,
  ]);

  // Get List
  const GetListTable = () => {
    setLoading(true);
    dispatch(useBlogList())
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
      {/* Search Filters */}
      <div className="filter-container">
        <Input
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          placeholder="Tựa Đề"
          value={searchTitle}
          onChange={(e) => {
            setSearchTitle(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          style={{ width: 200, height: 36 }}
        />
        <Select
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          placeholder="Trạng Thái"
          value={searchStatus}
          onChange={(value) => {
            setSearchStatus(value);
            setCurrentPage(1);
          }}
          style={{ width: 200, height: 36 }}
          allowClear
        >
          <Select.Option value="approved">Chấp Nhận</Select.Option>
          <Select.Option value="rejected">Từ Chối</Select.Option>
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
      </div>

      <Spin spinning={loading} tip="Đang Tải...">
        <Table
          scroll={{ x: "1500px" }}
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
          onChange={GetListTable}
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
            `${range[0]}-${range[1]} / ${total} bài viết`
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

export default ReviewBlogTable;
