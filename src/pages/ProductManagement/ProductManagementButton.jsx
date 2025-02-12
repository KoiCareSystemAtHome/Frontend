import React, { useState } from "react";
import AddProductManagement from "./AddProductManagement";

const ProductManagementButton = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleOk = () => {
    setIsAddOpen(false);
  };

  return (
    <div>
      <AddProductManagement onClose={handleOk} />
    </div>
  );
};

export default ProductManagementButton;
