import React from "react";
import WithdrawTableAdmin from "./WithdrawTableAdmin";
import useWithdrawList from "../../hooks/useWithdrawList";

const WithdrawAdmin = () => {
  const withdrawList = useWithdrawList();

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
        <div>Rút Tiền</div>

        <div
          style={{
            display: "flex",
          }}
        >
          {/* <WithdrawButton /> */}
        </div>
      </div>
      <div className="tableContainer" style={{ marginTop: "10px" }}>
        <WithdrawTableAdmin dataSource={withdrawList} />
      </div>
    </div>
  );
};

export default WithdrawAdmin;
