import React from "react";
import Filter from "../../components/Filter/Filter";
import OrderManagementButton from "./OrderManagementButton";
import OrdermanagementTable from "./OrdermanagementTable";

const OrderManagement = () => {
  return (
    <div>
      <div>
        <div
          className="font-semibold mb-4 ml-4 text-2xl"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>Order Management</div>

          <div
            style={{
              display: "flex",
            }}
          >
            <OrderManagementButton />
          </div>
        </div>

        <div className="searchContainer">
          <Filter />
        </div>

        <div className="tableContainer" style={{ marginTop: "10px" }}>
          <OrdermanagementTable />
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
