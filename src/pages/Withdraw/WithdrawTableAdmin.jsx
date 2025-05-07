// import { Pagination, Spin, Table, Tag } from "antd";
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getWalletWithdraw } from "../../redux/slices/transactionSlice";
// import {
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   SyncOutlined,
// } from "@ant-design/icons";

// // CSS styles for enhanced visuals
// const tableStyles = `
//   .product-management-table .ant-table {
//     border-radius: 8px;
//     overflow: hidden;
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//     background: #fff;
//   }

//   .product-management-table .ant-table-thead > tr > th {
//     background: linear-gradient(135deg,rgb(65, 65, 65),rgb(65, 65, 65));
//     color: #fff;
//     font-weight: 600;
//     padding: 12px 16px;
//     border-bottom: none;
//     transition: background 0.3s;
//   }

//   .product-management-table .ant-table-tbody > tr:hover > td {
//     background: #e6f7ff;
//     transition: background 0.2s;
//   }

//   .product-management-table .ant-table-tbody > tr > td {
//     padding: 12px 16px;
//     border-bottom: 1px solid #f0f0f0;
//     transition: all 0.3s;
//   }

//   .product-management-table .ant-table-tbody > tr:nth-child(even) {
//     background: #fafafa;
//   }

//   .pagination-container {
//     margin-top: 16px;
//     display: flex;
//     justify-content: flex-end;
//   }

//   .pagination-container .ant-pagination-item-active {
//     background: rgb(65, 65, 65);
//     border-color: rgb(65, 65, 65);
//   }

//   .pagination-container .ant-pagination-item-active a {
//     color: #fff;
//   }

//   @keyframes fadeIn {
//     from { opacity: 0; transform: translateY(10px); }
//     to { opacity: 1; transform: translateY(0); }
//   }

//   .fade-in {
//     animation: fadeIn 0.5s ease-out;
//   }

//   /* Custom styles for larger tags */
//   .custom-tag {
//     width: 120px; /* Adjust width as needed */
//     text-align: center; /* Center the text inside the tag */
//     font-size: 14px; /* Adjust font size as needed */
//     padding: 5px;
//     cursor: pointer; /* Change cursor to pointer for better UX */
//   }
// `;

// // Inject styles into the document
// const styleSheet = document.createElement("style");
// styleSheet.innerText = tableStyles;
// document.head.appendChild(styleSheet);

// function WithdrawTableAdmin() {
//   const dispatch = useDispatch();
//   const { walletWithdrawalData, loading: withdrawalLoading } = useSelector(
//     (state) => state.transactionSlice
//   );

//   // Pagination for withdrawals
//   const [withdrawalPage, setWithdrawalPage] = useState(1);
//   const [withdrawalPageSize, setWithdrawalPageSize] = useState(10);

//   // Handle withdrawal data
//   const safeWithdrawalData = Array.isArray(walletWithdrawalData)
//     ? walletWithdrawalData
//     : walletWithdrawalData
//     ? [walletWithdrawalData]
//     : [];
//   const paginatedWithdrawalData = safeWithdrawalData.slice(
//     (withdrawalPage - 1) * withdrawalPageSize,
//     withdrawalPage * withdrawalPageSize
//   );

//   React.useEffect(() => {
//     dispatch(getWalletWithdraw());
//   }, [dispatch]);

//   const withdrawalColumns = [
//     {
//       title: "STT",
//       dataIndex: "id",
//       key: "id",
//       width: 100,
//       render: (_, __, index) =>
//         index + 1 + (withdrawalPage - 1) * withdrawalPageSize,
//     },
//     {
//       title: "Số Tiền Rút",
//       dataIndex: "money",
//       key: "money",
//       render: (text) => (text ? parseInt(text).toLocaleString() + " đ" : "N/A"),
//     },
//     {
//       title: "Trạng Thái Rút Tiền",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => {
//         const statusLower = status ? status.toLowerCase() : "";
//         if (statusLower === "approve") {
//           return (
//             <Tag
//               color="green"
//               className="custom-tag"
//               icon={<CheckCircleOutlined />}
//             >
//               Đã Duyệt
//             </Tag>
//           );
//         } else if (statusLower === "pending") {
//           return (
//             <Tag color="yellow" className="custom-tag" icon={<SyncOutlined />}>
//               Đang Chờ
//             </Tag>
//           );
//         } else if (statusLower === "reject") {
//           return (
//             <Tag
//               color="red"
//               className="custom-tag"
//               icon={<CloseCircleOutlined />}
//             >
//               Từ Chối
//             </Tag>
//           );
//         }
//         return <Tag color="gray">{status || "N/A"}</Tag>; // Fallback for unknown status
//       },
//     },
//     {
//       title: "Thời Gian Tạo",
//       dataIndex: "createDate",
//       key: "createDate",
//       render: (text) => (text ? new Date(text).toLocaleString("vi-VN") : "N/A"),
//     },
//   ];

//   return (
//     <div className="product-management-table" style={{ padding: "16px" }}>
//       <Spin spinning={withdrawalLoading} tip="Đang Tải...">
//         <Table
//           dataSource={paginatedWithdrawalData}
//           columns={withdrawalColumns}
//           pagination={false}
//           scroll={{ x: 1700 }}
//         />
//       </Spin>
//       <div className="pagination-container">
//         <Pagination
//           total={safeWithdrawalData.length}
//           pageSize={withdrawalPageSize}
//           current={withdrawalPage}
//           showSizeChanger
//           align="end"
//           showTotal={(total, range) =>
//             `${range[0]}-${range[1]} / ${total} giao dịch rút tiền`
//           }
//           onChange={(page, size) => {
//             setWithdrawalPage(page);
//             setWithdrawalPageSize(size);
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// export default WithdrawTableAdmin;

import { Pagination, Spin, Table, Button, Modal, Tag } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getWalletWithdraw,
  updateWalletWithdraw,
} from "../../redux/slices/transactionSlice";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

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

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .pagination-container .ant-pagination-item-active {
    background: rgb(65, 65, 65);
    border-color: rgb(65, 65, 65);
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

  /* Custom styles for larger tags */
  .custom-tag {
    width: 120px; /* Adjust width as needed */
    text-align: center; /* Center the text inside the tag */
    font-size: 14px; /* Adjust font size as needed */
    padding: 5px;
    cursor: pointer; /* Change cursor to pointer for better UX */
  }
    
  /* Custom styles for action buttons */
  .action-buttons .ant-btn {
    margin-right: 8px;
  }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.innerText = tableStyles;
document.head.appendChild(styleSheet);

function WithdrawTableAdmin() {
  const dispatch = useDispatch();
  const { walletWithdrawalData, loading: withdrawalLoading } = useSelector(
    (state) => state.transactionSlice
  );

  // Pagination for withdrawals
  const [withdrawalPage, setWithdrawalPage] = useState(1);
  const [withdrawalPageSize, setWithdrawalPageSize] = useState(10);

  // Handle withdrawal data
  const safeWithdrawalData = Array.isArray(walletWithdrawalData)
    ? walletWithdrawalData
    : walletWithdrawalData
    ? [walletWithdrawalData]
    : [];
  const filteredWithdrawalData = safeWithdrawalData.filter(
    (item) => !["approve", "reject"].includes(item.status.toLowerCase())
  );
  const paginatedWithdrawalData = filteredWithdrawalData.slice(
    (withdrawalPage - 1) * withdrawalPageSize,
    withdrawalPage * withdrawalPageSize
  );

  React.useEffect(() => {
    dispatch(getWalletWithdraw());
  }, [dispatch]);

  const handleStatusChange = (record, newStatus) => {
    const actionText = newStatus === "approve" ? "chấp nhận" : "từ chối";

    Modal.confirm({
      centered: true,
      closable: true,
      title: `Bạn có muốn ${actionText} rút tiền giao dịch này không?`,
      onOk: () => {
        dispatch(
          updateWalletWithdraw({ withdrawId: record.id, status: newStatus })
        ).then(() => {
          // Refresh the withdrawal data after update
          dispatch(getWalletWithdraw());
        });
      },
      onCancel: () => {},
      okText: "Xác nhận",
      cancelText: "Hủy",
    });
  };

  const withdrawalColumns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (_, __, index) =>
        index + 1 + (withdrawalPage - 1) * withdrawalPageSize,
    },
    {
      title: "Số Tiền Rút",
      dataIndex: "money",
      key: "money",
      render: (text) => (text ? parseInt(text).toLocaleString() + " đ" : "N/A"),
    },
    {
      title: "Trạng Thái Rút Tiền",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusLower = status ? status.toLowerCase() : "";
        if (statusLower === "pending") {
          return (
            <Tag color="yellow" className="custom-tag" icon={<SyncOutlined />}>
              Đang Chờ
            </Tag>
          );
        }
        return <span>{status || "N/A"}</span>;
      },
    },
    {
      title: "Thời Gian Tạo",
      dataIndex: "createDate",
      key: "createDate",
      render: (text) => (text ? new Date(text).toLocaleString("vi-VN") : "N/A"),
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="primary"
            size="small"
            onClick={() => handleStatusChange(record, "approve")}
            disabled={record.status.toLowerCase() === "approve"}
          >
            Xác Nhận
          </Button>
          <Button
            type="default"
            size="small"
            danger
            onClick={() => handleStatusChange(record, "reject")}
            disabled={record.status.toLowerCase() === "reject"}
          >
            Từ Chối
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="product-management-table" style={{ padding: "16px" }}>
      <Spin spinning={withdrawalLoading} tip="Đang Tải...">
        <Table
          dataSource={paginatedWithdrawalData}
          columns={withdrawalColumns}
          pagination={false}
          scroll={{ x: 1700 }}
        />
      </Spin>
      <div className="pagination-container">
        <Pagination
          total={filteredWithdrawalData.length}
          pageSize={withdrawalPageSize}
          current={withdrawalPage}
          showSizeChanger
          align="end"
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} / ${total} giao dịch rút tiền`
          }
          onChange={(page, size) => {
            setWithdrawalPage(page);
            setWithdrawalPageSize(size);
          }}
        />
      </div>
    </div>
  );
}

export default WithdrawTableAdmin;
