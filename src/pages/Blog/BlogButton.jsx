import React, { useState } from "react";
import AddBlog from "./AddBlog";

const BlogButton = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleOk = () => {
    setIsAddOpen(false);
  };

  return (
    <div>
      <AddBlog onClose={handleOk} />
    </div>
  );
};

export default BlogButton;
