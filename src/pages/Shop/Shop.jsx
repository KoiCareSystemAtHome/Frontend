import React from "react";
import SearchTable from "../../components/SearchTable/searchTable";
import ShopButton from "./ShopButton";
import ShopTable from "./ShopTable";

const Shop = () => {
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
        <div>Shop</div>

        <div
          style={{
            display: "flex",
          }}
        >
          <ShopButton />
        </div>
      </div>

      <div className="searchContainer">
        <SearchTable />
      </div>

      <div className="tableContainer" style={{ marginTop: "10px" }}>
        <ShopTable />
      </div>
    </div>
  );
};

export default Shop;
