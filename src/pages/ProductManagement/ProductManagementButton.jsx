import React, { useState } from "react";
import AddProductManagement from "./AddProductManagement";
import AddProductFood from "./AddProductFood";
import AddProductMedicine from "./AddProductMedicine";

const ProductManagementButton = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleOk = () => {
    setIsAddOpen(false);
  };

  return (
    <div style={{ display: "flex" }}>
      <AddProductManagement onClose={handleOk} />
      <AddProductFood onClose={handleOk} />
      <AddProductMedicine onClose={handleOk} />
    </div>
  );
};

export default ProductManagementButton;
