import React from "react";
import ProductManagementButton from "./ProductManagementButton";
import ProductManagementTable from "./ProductManagementTable";
import useProductManagementList from "../../hooks/useProductManagementList";
import Filter from "../../components/Filter/Filter";

const ProductManagement = () => {
  const productManagementList = useProductManagementList();
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
        <div>Product Management</div>

        <div
          style={{
            display: "flex",
          }}
        >
          <ProductManagementButton />
        </div>
      </div>

      <div className="searchContainer">
        <Filter />
      </div>

      <div className="tableContainer" style={{ marginTop: "10px" }}>
        <ProductManagementTable dataSource={productManagementList} />
      </div>
    </div>
  );
};

export default ProductManagement;
