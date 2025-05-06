import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import TransactionTable from "../Transaction/TransactionTable";
import WithdrawTable from "../Transaction/WithdrawTable";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

function ShopDetail() {
  const { shopId, userId } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "16px" }}>
      <Button
        type="text"
        icon={<LeftOutlined />}
        style={{ marginBottom: "16px" }}
        onClick={() => navigate("/admin/account/shop")}
        className="flex items-center text-gray-700 hover:text-blue-600"
      >
        Trang chủ
      </Button>
      <h2 style={{ fontSize: "24px" }}>Chi Tiết Giao Dịch</h2>
      <TransactionTable shopId={shopId} />
      <h2 style={{ fontSize: "24px" }}>Chi Tiết Rút Tiền</h2>
      {userId && <WithdrawTable userId={userId} />}
    </div>
  );
}

export default ShopDetail;
