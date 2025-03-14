import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Tag, Typography, Spin, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getBlogDetail } from "../../redux/slices/blogSlice";
import parse from "html-react-parser"; // Import parser to render HTML

const { Title, Paragraph, Text } = Typography;

function BlogDetail() {
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
      dispatch(getBlogDetail(blogId)).then((res) => {
        console.log("Fetched Blog Detail:", res);
      });
    }
  }, [dispatch, blogId]);

  return (
    <Card>
      {/* Header with back button */}
      <div>
        <div className="align-content-start">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate("/shop/blog")}
            className="flex items-center"
          >
            Back
          </Button>
        </div>
      </div>

      {/* Handle loading and error states */}
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
              {/* Image Section */}
              <div className="md:w-1/2">
                <img
                  src={blog?.images || "https://via.placeholder.com/300"}
                  alt={blog?.name || "Blog Image"}
                  className="w-full rounded-lg shadow-md"
                />
              </div>

              {/* Content Section */}
              <div className="md:w-1/2">
                <div className="mb-6">
                  <Paragraph className="pl-4 mt-2">
                    {blog?.content
                      ? parse(blog.content)
                      : "No content available."}
                  </Paragraph>
                </div>
                <Tag
                  className="ml-4"
                  color={
                    blog?.tag === "Pending"
                      ? "yellow"
                      : blog?.tag === "Approved"
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
                  {blog?.tag}
                </Tag>
                <div className="ml-4 mt-6">
                  This blog was created by {blog?.reportedBy} on{" "}
                  {blog?.reportedDate?.split("T")[0]}
                </div>
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
            {blog?.type}
          </Tag>
        </div>
      )}
    </Card>
  );
}

export default BlogDetail;
