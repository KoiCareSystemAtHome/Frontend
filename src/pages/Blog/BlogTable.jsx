import { Image, Modal, notification, Pagination, Spin, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useBlogList from "../../hooks/useBlogList";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { approveBlog, getListBlog } from "../../redux/slices/blogSlice";
import UpdateBlog from "./UpdateBlog";

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

  // Compute paginated data
  const paginatedData = dataSource.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewDetail = (blogId) => {
    navigate(`/shop/blog-detail/${blogId}`);
    console.log("Navigating to detail page with ID:", blogId);
  };

  const handleStatusChange = (blogId, isApproved) => {
    const newStatus = !isApproved;

    Modal.confirm({
      title: "Confirm Status Change",
      content: `Are you sure you want to change the status to ${
        newStatus ? "Approved" : "Rejected"
      }?`,
      okText: "Yes",
      cancelText: "No",
      centered: true,
      onOk: async () => {
        try {
          await dispatch(approveBlog({ blogId, newStatus })).unwrap();
          dispatch(getListBlog()); // Refresh list after update

          notification.success({
            message: "Status Updated",
            description: `Blog status changed to ${
              newStatus ? "Approved" : "Rejected"
            }`,
            placement: "top",
          });
        } catch (error) {
          notification.error({
            message: "Update Failed",
            description: "Failed to update blog status. Please try again!",
            placement: "top",
          });
        }
      },
    });
  };

  const columns = [
    {
      title: "Blog ID",
      dataIndex: "blogId",
      key: "blogId",
    },
    {
      title: "Title",
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
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Report By",
      dataIndex: "reportedBy",
      key: "reportedBy",
    },
    {
      title: "Reported Date",
      dataIndex: "reportedDate",
      key: "reportedDate",
    },
    {
      title: "Shop",
      dataIndex: ["shop", "name"],
      key: "name",
    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
    },
    {
      title: "Status",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (isApproved, record) => {
        const approved = isApproved === true || isApproved === "true"; // Ensure boolean
        return (
          <Tag
            style={{ width: "100px", textAlign: "center", cursor: "pointer" }}
            icon={approved ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            color={approved ? "green" : "red"}
            onClick={() => handleStatusChange(record.blogId, approved)}
          >
            {approved ? "Approved" : "Rejected"}
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
  }, [dataSource, currentPage, pageSize]);

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

export default BlogTable;
