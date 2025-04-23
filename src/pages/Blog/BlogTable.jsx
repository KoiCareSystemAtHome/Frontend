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
import UpdateBlog from "./UpdateBlog";
import dayjs from "dayjs";

function BlogTable({ dataSource }) {
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
    navigate(`/shop/blog-detail/${blogId}`);
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
      title: "",
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
          {/* <EyeOutlined
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={() => handleViewDetail(record.blogId)}
          /> */}
          <UpdateBlog record={record} />
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
    <div className="w-full">
      {/* Search Filters */}
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Input
          placeholder="Tựa Đề"
          value={searchTitle}
          onChange={(e) => {
            setSearchTitle(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Trạng Thái"
          value={searchStatus}
          onChange={(value) => {
            setSearchStatus(value);
            setCurrentPage(1);
          }}
          style={{ width: 200 }}
          allowClear
        >
          <Select.Option value="approved">Chấp Nhận</Select.Option>
          <Select.Option value="rejected">Từ Chối</Select.Option>
        </Select>
        <Button
          icon={<ReloadOutlined />}
          type="default"
          onClick={handleResetFilters}
          //disabled={!searchTitle && !searchDate && !searchStatus} // Disable when no filters applied
        >
          Cài lại bộ lọc
        </Button>
      </div>

      <Spin spinning={loading} tip="Loading...">
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

export default BlogTable;
