import React from "react";
import OrderManagementTableAdmin from "./OrderManagementTableAdmin";
import useAllListOrder from "../../hooks/useAllListOrder";

const OrderManagementAdmin = () => {
  const allOrderList = useAllListOrder();

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
          <div>Quản Lý Đơn Đặt Hàng</div>

          <div
            style={{
              display: "flex",
            }}
          >
            {/* <OrderManagementButton /> */}
          </div>
        </div>

        <div className="searchContainer">{/* <Filter /> */}</div>

        <div className="tableContainer" style={{ marginTop: "10px" }}>
          <OrderManagementTableAdmin dataSource={allOrderList} />
        </div>
      </div>
    </div>
  );
};

export default OrderManagementAdmin;
