import React from "react";
import BlogButton from "./BlogButton";
import SearchTable from "../../components/SearchTable/searchTable";
import BlogTable from "./BlogTable";
import useBlogList from "../../hooks/useBlogList";

const Blog = () => {
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
        <div>Blog</div>

        <div
          style={{
            display: "flex",
          }}
        >
          <BlogButton />
        </div>
      </div>

      <div className="searchContainer">{/* <SearchTable /> */}</div>

      <div className="tableContainer" style={{ marginTop: "10px" }}>
        <BlogTable dataSource={blogList} />
      </div>
    </div>
  );
};

export default Blog;
