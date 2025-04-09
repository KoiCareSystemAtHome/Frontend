import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Tag, Typography, Spin, Button, List, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getBlogDetail, approveBlog } from "../../redux/slices/blogSlice";
import parse from "html-react-parser";

const { Paragraph } = Typography;

function ReviewBlogDetail() {
  const navigate = useNavigate();
  const { blogId } = useParams();
  const dispatch = useDispatch();

  const {
    blogDetail: blog,
    loading,
    error,
  } = useSelector((state) => state.blogSlice || {});

  useEffect(() => {
    console.log("Fetching blog details for ID:", blogId);
    if (blogId) {
      dispatch(getBlogDetail(blogId));
    }
  }, [dispatch, blogId]);

  const blogData = {
    content: blog?.content || "",
    title: blog?.title || "",
    images: blog?.images || "",
    tag: blog?.tag || (blog?.isApproved ? "Approved" : "Rejected"),
    type: blog?.type || "",
    products: blog?.products || [],
  };

  // Function to translate the tag into Vietnamese
  const translateTag = (tag) => {
    const tagMap = {
      Pending: "Đang Chờ Xét Duyệt",
      Approved: "Chấp Nhận",
      Rejected: "Từ Chối",
    };
    return tagMap[tag] || tag; // Return the translated tag, or the original if not found
  };

  // Handle blog status update (Approve or Reject)
  const handleStatusUpdate = async (newStatus) => {
    try {
      await dispatch(approveBlog({ blogId, newStatus })).unwrap();
      const statusMessage = newStatus ? "chấp nhận" : "từ chối";
      message.success(`Bài viết đã được ${statusMessage} thành công!`);
      dispatch(getBlogDetail(blogId)); // Refresh blog details after status update
    } catch (error) {
      message.error(
        "Failed to update blog status: " + (error || "Unknown error")
      );
    }
  };

  return (
    <Card>
      <div>
        <div className="flex justify-between align-content-start">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate("/admin/review-blog")}
            className="flex items-center"
          >
            Trang Chủ
          </Button>
          {/* Approve and Reject Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              type="primary"
              onClick={() => handleStatusUpdate(true)}
              disabled={blogData.tag === "Approved"}
              loading={loading}
              style={{ borderRadius: "5px" }}
            >
              Chấp Nhận
            </Button>
            <Button
              danger
              onClick={() => handleStatusUpdate(false)}
              disabled={blogData.tag === "Rejected"}
              loading={loading}
              style={{ borderRadius: "5px" }}
            >
              Từ Chối
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mt-10">
          {error || "Failed to load data"}
        </div>
      ) : (
        <div>
          <div className="max-w-8xl mx-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <img
                  src={blogData.images}
                  alt={blog?.name || "Blog Image"}
                  className="w-full rounded-lg shadow-md"
                />
              </div>

              <div className="md:w-1/2">
                <div className="mb-6">
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {blogData.title || "No title available."}
                  </div>
                  <Paragraph className="pl-4 mt-2">
                    {blogData.content
                      ? parse(blogData.content)
                      : "No content available."}
                  </Paragraph>
                </div>
                <Tag
                  className="ml-4"
                  color={
                    blogData.tag === "Pending"
                      ? "yellow"
                      : blogData.tag === "Approved"
                      ? "green"
                      : "red"
                  }
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    borderRadius: "8px",
                  }}
                >
                  {translateTag(blogData.tag)} {/* Use translated tag */}
                </Tag>
              </div>
            </div>
          </div>

          <Tag
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "8px",
              margin: "-10px 0 0 24px",
            }}
          >
            {blogData.type}
          </Tag>

          {/* Products Section */}
          <div className="mt-6">
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginLeft: "25px",
              }}
            >
              Sản Phẩm
            </h3>
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={blogData.products}
              renderItem={(product) => (
                <List.Item>
                  <Card
                    cover={<img alt={product.name} src={product.image} />}
                    style={{ width: 350 }}
                  >
                    <Card.Meta
                      title={product.name}
                      description={`Giá: ${product.price} đ`}
                    />
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

export default ReviewBlogDetail;
