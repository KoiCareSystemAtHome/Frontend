import { Pagination, Spin, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { transactionByShop } from "../../redux/slices/transactionSlice";
import { useDispatch, useSelector } from "react-redux";
import WithdrawTable from "./WithdrawTable";
import { CheckCircleOutlined } from "@ant-design/icons";

// CSS styles for enhanced visuals
const tableStyles = `
  .product-management-table .ant-table {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: #fff;
  }

  .product-management-table .ant-table-thead > tr > th {
    background: linear-gradient(135deg,rgb(65, 65, 65),rgb(65, 65, 65));
    color: #fff;
    font-weight: 600;
    padding: 12px 16px;
    border-bottom: none;
    transition: background 0.3s;
  }

  .product-management-table .ant-table-tbody > tr:hover > td {
    background: #e6f7ff;
    transition: background 0.2s;
  }

  .product-management-table .ant-table-tbody > tr > td {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.3s;
  }

  .product-management-table .ant-table-tbody > tr:nth-child(even) {
    background: #fafafa;
  }

  .filter-container {
    background: #f9f9f9;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .filter-container .ant-input, 
  .filter-container .ant-select {
    border-radius: 6px;
    transition: all 0.3s;
  }

  .filter-container .ant-input:hover,
  .filter-container .ant-input:focus,
  .filter-container .ant-select:hover .ant-select-selector,
  .filter-container .ant-select-focused .ant-select-selector {
    border-color: #40a9ff !important;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
  }

  .filter-container .ant-btn {
    border-radius: 6px;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .filter-container .ant-btn:hover {
    background: #40a9ff;
    color: #fff;
    border-color: #40a9ff;
    transform: translateY(-1px);
  }

  .custom-spin .ant-spin-dot-item {
    background-color: #1890ff;
  }

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .pagination-container .ant-pagination-item-active {
    background:rgb(65, 65, 65);
    border-color:rgb(65, 65, 65);
  }

  .pagination-container .ant-pagination-item-active a {
    color: #fff;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-out;
  }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.innerText = tableStyles;
document.head.appendChild(styleSheet);

function TransactionTable({ shopId }) {
  const dispatch = useDispatch();
  const { transactions, shopBalance, loading, error } = useSelector(
    (state) => state.transactionSlice
  );
  const loggedInUser = useSelector((state) => state.authSlice.user);
  const currentShopId = shopId || loggedInUser?.shopId;

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter transactions to only include those with status "Success"
  const safeTransactions = Array.isArray(transactions)
    ? transactions.filter(
        (transaction) => transaction.transactionType === "Success"
      )
    : [];
  const paginatedData = safeTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    if (currentShopId) {
      dispatch(transactionByShop(currentShopId));
    }
  }, [currentShopId, dispatch]);

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Trạng Thái Giao Dịch",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (text) =>
        text === "Success" ? (
          <Tag
            icon={<CheckCircleOutlined />}
            color="green"
            style={{
              width: "120px",
              fontSize: "14px",
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Thành Công
          </Tag>
        ) : (
          text || "N/A"
        ),
    },
    {
      title: "Số Tiền Giao Dịch",
      dataIndex: "amount",
      key: "amount",
      render: (text) => (text ? parseInt(text).toLocaleString() + " đ" : "N/A"),
    },
    {
      title: "Thời Gian Giao Dịch",
      dataIndex: ["payment", "date"],
      key: "date",
      render: (text) => (text ? new Date(text).toLocaleString("vi-VN") : "N/A"),
    },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: ["payment", "paymentMethod"],
      key: "paymentMethod",
    },
    {
      title: "Thông Tin Giao Dịch",
      dataIndex: ["payment", "description"],
      key: "description",
    },
  ];

  return (
    <div className="product-management-table" style={{ padding: "16px" }}>
      <div style={{ marginBottom: "16px" }}>
        <h1 style={{ fontSize: "24px", color: "#555" }}>
          Số tiền dư cửa hàng: {shopBalance.toLocaleString()} đ
        </h1>
      </div>
      <Spin spinning={loading} tip="Đang Tải...">
        <Table
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          scroll={{ x: 1700 }}
        />
      </Spin>
      <div className="pagination-container">
        <Pagination
          total={safeTransactions.length}
          pageSize={pageSize}
          current={currentPage}
          showSizeChanger
          align="end"
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} / ${total} giao dịch`
          }
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
        />
      </div>
    </div>
  );
}

export default TransactionTable;
