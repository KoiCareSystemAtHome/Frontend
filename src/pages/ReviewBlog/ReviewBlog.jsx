import React from "react";
import ReviewBlogTable from "./ReviewBlogTable";
import useBlogList from "../../hooks/useBlogList";

const ReviewBlog = () => {
  const blogList = useBlogList();

  return (
    <div>
      <div
        className="font-semibold mb-4 ml-4 text-2xl"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>Duyệt Bài Viết</div>

        <div
          style={{
            display: "flex",
          }}
        >
          {/* <ReportButton /> */}
        </div>
      </div>

      <div className="searchContainer">{/* <SearchTable /> */}</div>

      <div className="tableContainer" style={{ marginTop: "10px" }}>
        <ReviewBlogTable dataSource={blogList} />
      </div>
    </div>
  );
};

export default ReviewBlog;
