// import { EyeOutlined } from "@ant-design/icons";
// import { Button, Pagination, Spin, Table, Tag } from "antd";
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router";
// import { fetchOrderTracking } from "../../redux/slices/ghnSlice";

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

//   .filter-container {
//     background: #f9f9f9;
//     padding: 16px;
//     border-radius: 8px;
//     margin-bottom: 24px;
//     display: flex;
//     gap: 12px;
//     flex-wrap: wrap;
//     align-items: center;
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
//   }

//   .filter-container .ant-input,
//   .filter-container .ant-select {
//     border-radius: 6px;
//     transition: all 0.3s;
//   }

//   .filter-container .ant-input:hover,
//   .filter-container .ant-input:focus,
//   .filter-container .ant-select:hover .ant-select-selector,
//   .filter-container .ant-select-focused .ant-select-selector {
//     border-color: #40a9ff !important;
//     box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
//   }

//   .filter-container .ant-btn {
//     border-radius: 6px;
//     transition: all 0.3s;
//     display: flex;
//     align-items: center;
//     gap: 6px;
//   }

//   .filter-container .ant-btn:hover {
//     background: #40a9ff;
//     color: #fff;
//     border-color: #40a9ff;
//     transform: translateY(-1px);
//   }

//   .custom-spin .ant-spin-dot-item {
//     background-color: #1890ff;
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
// `;

// // Inject styles into the document
// const styleSheet = document.createElement("style");
// styleSheet.innerText = tableStyles;
// document.head.appendChild(styleSheet);

// function OrderManagementTableAdmin({ dataSource }) {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [trackingData, setTrackingData] = useState({});

//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const paginatedData = dataSource.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const statusTranslations = {
//     Pending: "Đang Chờ",
//     Confirmed: "Đã Xác Nhận",
//     "In Progress": "Đang Giao Hàng",
//     Complete: "Hoàn Thành",
//     Delivered: "Đã Giao Hàng", // New status for database "delivered" but GHN "delivering"
//     Fail: "Thất Bại",
//     Cancel: "Đã Hủy",
//   };

//   // Fetch tracking data for all orders with valid order codes
//   useEffect(() => {
//     const fetchAllTrackingData = async () => {
//       const trackingResults = {};
//       const validOrders = dataSource.filter(
//         (order) => order.oder_code && /^[A-Z0-9]{6}$/.test(order.oder_code)
//       );

//       await Promise.all(
//         validOrders
//           .filter((order) =>
//             [
//               "Confirmed",
//               "In Progress",
//               "Complete",
//               "Fail",
//               "Delivered",
//             ].includes(order.status)
//           )
//           .map(async (order) => {
//             try {
//               const trackingInfo = await dispatch(
//                 fetchOrderTracking(order.oder_code)
//               ).unwrap();
//               trackingResults[order.oder_code] = trackingInfo;
//             } catch (error) {
//               console.error(
//                 `Error fetching tracking for order_code ${order.oder_code}:`,
//                 error
//               );
//               trackingResults[order.oder_code] = {
//                 status: "Error",
//                 error: error.message || "Tracking failed",
//               };
//             }
//           })
//       );
//       setTrackingData(trackingResults);
//     };

//     if (dataSource.length > 0) {
//       fetchAllTrackingData();
//     }
//   }, [dispatch, dataSource]);

//   const handleViewOrder = (orderId, index) => {
//     const rowIndex = index + 1 + (currentPage - 1) * pageSize; // Calculate the rowIndex
//     navigate(`/admin/order-detail/${orderId}`, { state: { rowIndex } });
//   };

//   const columns = [
//     {
//       title: "STT",
//       key: "orderId",
//       render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
//     },
//     {
//       title: "Tên Cửa Hàng",
//       dataIndex: "shopName",
//       key: "shopName",
//     },
//     {
//       title: "Tên Thành Viên",
//       dataIndex: "customerName",
//       key: "customerName",
//     },
//     {
//       title: "Địa Chỉ Thành Viên",
//       dataIndex: "customerAddress",
//       key: "customerAddress",
//     },
//     {
//       title: "Tình Trạng Giao Hàng",
//       dataIndex: "shipType",
//       key: "shipType",
//       render: (shipType, record) => {
//         // Prioritize status for "Đã hủy"
//         if (record.status === "Cancel" || record.status === "Đã hủy") {
//           return "Đơn đã hủy";
//         }

//         const trackingInfo = trackingData[record.oder_code || record.orderId];
//         if (!trackingInfo) {
//           return "Chưa Xác Nhận Đơn"; // Fallback while tracking data is loading
//         }
//         if (trackingInfo.status === "Unconfirmed") {
//           return "Chưa xác nhận"; // Display for unconfirmed orders
//         }
//         if (trackingInfo.status === "N/A") {
//           return "Không khả dụng"; // For invalid format
//         }
//         if (trackingInfo.status === "Error") {
//           return `Lỗi: ${trackingInfo.error || "Không thể theo dõi"}`; // Display error for confirmed orders with tracking issues
//         }
//         return shipType || "Chưa có thông tin";
//       },
//     },
//     {
//       title: "Mã Vận Đơn",
//       dataIndex: "oder_code",
//       key: "oder_code",
//     },
//     {
//       title: "Trạng Thái",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => (
//         <Tag
//           color={
//             status === "Complete"
//               ? "green"
//               : status === "Delivered" // Add color for new "Delivered" status
//               ? "cyan"
//               : status === "Fail"
//               ? "red"
//               : status === "Confirmed"
//               ? "blue"
//               : status === "Cancel"
//               ? "grey"
//               : "yellow"
//           }
//         >
//           {statusTranslations[status] || status} {/* Use translated status */}
//         </Tag>
//       ),
//     },
//     {
//       title: "Phí Vận Chuyển",
//       dataIndex: "shipFee",
//       key: "shipFee",
//       render: (shipFee) => {
//         // Check if shipFee is a valid string or number
//         if (shipFee === null || shipFee === undefined || shipFee === "") {
//           return "N/A"; // Return fallback if shipFee is null, undefined, or empty
//         }

//         // Convert shipFee to a number if it's a string
//         const fee = typeof shipFee === "string" ? parseFloat(shipFee) : shipFee;

//         // Check if the converted fee is a valid number
//         return !isNaN(fee)
//           ? `${fee.toLocaleString("vi-VN")} đ` // Format as a number and append "đ"
//           : "N/A"; // Fallback if conversion fails
//       },
//     },
//     {
//       title: "Ghi Chú",
//       dataIndex: "note",
//       key: "note",
//     },
//     {
//       title: "Thao Tác",
//       dataIndex: "action",
//       key: "action",
//       render: (_, record, index) => (
//         <span>
//           <Button
//             onClick={() => handleViewOrder(record.orderId, index)}
//             type="text"
//             icon={<EyeOutlined className="w-4 h-4" />}
//             className="flex items-center justify-center"
//           />
//         </span>
//       ),
//     },
//   ];

//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//     }, 2000);
//   }, [dataSource, currentPage, pageSize]);

//   return (
//     <div className="product-management-table" style={{ padding: "16px" }}>
//       <Spin spinning={loading} tip="Đang Tải...">
//         <Table
//           scroll={{ x: "1500px" }}
//           dataSource={paginatedData}
//           columns={columns}
//           pagination={false}
//           className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
//           style={{ marginBottom: "1rem" }}
//         />
//       </Spin>
//       <div className="pagination-container">
//         <Pagination
//           total={dataSource.length}
//           pageSize={pageSize}
//           current={currentPage}
//           showSizeChanger
//           align="end"
//           showTotal={(total, range) =>
//             `${range[0]}-${range[1]} / ${total} thành viên`
//           }
//           onChange={(page, pageSize) => {
//             setCurrentPage(page);
//             setPageSize(pageSize);
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// export default OrderManagementTableAdmin;

import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Input, Pagination, Select, Spin, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchOrderTracking } from "../../redux/slices/ghnSlice";
import { processPendingTransactionsById } from "../../redux/slices/authSlice";
import { getAllListOrder } from "../../redux/slices/orderSlice";

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
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.innerText = tableStyles;
document.head.appendChild(styleSheet);

function OrderManagementTableAdmin({ dataSource }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [trackingData, setTrackingData] = useState({});

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchShopName, setSearchShopName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Get loading state for transaction processing from authSlice
  const { loading: processingLoading } = useSelector(
    (state) => state.authSlice || {}
  );

  // Filter data based on search criteria
  const filteredData = dataSource.filter((order) => {
    const matchesShopName = order.shopName
      ?.toLowerCase()
      .includes(searchShopName.toLowerCase());
    const matchesStatus = selectedStatus
      ? order.status === selectedStatus
      : true;
    return matchesShopName && matchesStatus;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const statusTranslations = {
    Pending: "Đang Chờ",
    Confirmed: "Đã Xác Nhận",
    "In Progress": "Đang Giao Hàng",
    Complete: "Hoàn Thành",
    Delivered: "Đã Giao Hàng",
    Fail: "Thất Bại",
    Cancel: "Đã Hủy",
  };

  const resetFilters = () => {
    setSearchShopName("");
    setSelectedStatus(null);
    setCurrentPage(1);
    setPageSize(10);
  };

  // Fetch tracking data for all orders with valid order codes
  useEffect(() => {
    const fetchAllTrackingData = async () => {
      const trackingResults = {};
      const validOrders = dataSource.filter(
        (order) => order.oder_code && /^[A-Z0-9]{6}$/.test(order.oder_code)
      );

      await Promise.all(
        validOrders
          .filter((order) =>
            [
              "Confirmed",
              "In Progress",
              "Complete",
              "Fail",
              "Delivered",
            ].includes(order.status)
          )
          .map(async (order) => {
            try {
              const trackingInfo = await dispatch(
                fetchOrderTracking(order.oder_code)
              ).unwrap();
              trackingResults[order.oder_code] = trackingInfo;
            } catch (error) {
              console.error(
                `Error fetching tracking for order_code ${order.oder_code}:`,
                error
              );
              trackingResults[order.oder_code] = {
                status: "Error",
                error: error.message || "Tracking failed",
              };
            }
          })
      );
      setTrackingData(trackingResults);
    };

    if (dataSource.length > 0) {
      fetchAllTrackingData();
    }
  }, [dispatch, dataSource]);

  const handleViewOrder = (orderId, index) => {
    const rowIndex = index + 1 + (currentPage - 1) * pageSize; // Calculate the rowIndex
    navigate(`/admin/order-detail/${orderId}`, { state: { rowIndex } });
  };

  // Handler for processing transaction
  const handleProcessTransaction = (orderId) => {
    if (!orderId) {
      console.error("No orderId provided for processing");
      return;
    }

    dispatch(processPendingTransactionsById(orderId))
      .unwrap()
      .then(() => {
        dispatch(getAllListOrder());
        console.log("Transaction processed successfully for ID:", orderId);
      })
      .catch((error) => {
        console.error("Error processing transaction:", error);
      });
  };

  const columns = [
    {
      title: "STT",
      key: "orderId",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Tên Cửa Hàng",
      dataIndex: "shopName",
      key: "shopName",
    },
    {
      title: "Tên Thành Viên",
      dataIndex: "customerName",
      key: "customerName",
    },
    // {
    //   title: "Địa Chỉ Thành Viên",
    //   dataIndex: "customerAddress",
    //   key: "customerAddress",
    // },
    {
      title: "Tình Trạng Giao Hàng",
      dataIndex: "shipType",
      key: "shipType",
      render: (shipType, record) => {
        // Prioritize status for "Đã hủy"
        if (record.status === "Cancel" || record.status === "Đã hủy") {
          return "Đơn đã hủy";
        }

        const trackingInfo = trackingData[record.oder_code || record.orderId];
        if (!trackingInfo) {
          return "Chưa Xác Nhận Đơn"; // Fallback while tracking data is loading
        }
        if (trackingInfo.status === "Unconfirmed") {
          return "Chưa xác nhận"; // Display for unconfirmed orders
        }
        if (trackingInfo.status === "N/A") {
          return "Không khả dụng"; // For invalid format
        }
        if (trackingInfo.status === "Error") {
          return `Lỗi: ${trackingInfo.error || "Không thể theo dõi"}`; // Display error for confirmed orders with tracking issues
        }
        return shipType || "Chưa có thông tin";
      },
    },
    {
      title: "Mã Vận Đơn",
      dataIndex: "oder_code",
      key: "oder_code",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Complete"
              ? "green"
              : status === "Delivered"
              ? "cyan"
              : status === "Fail"
              ? "red"
              : status === "Confirmed"
              ? "blue"
              : status === "Cancel"
              ? "grey"
              : "yellow"
          }
        >
          {statusTranslations[status] || status}
        </Tag>
      ),
    },
    {
      title: "Phí Vận Chuyển",
      dataIndex: "shipFee",
      key: "shipFee",
      render: (shipFee) => {
        // Check if shipFee is a valid string or number
        if (shipFee === null || shipFee === undefined || shipFee === "") {
          return "N/A"; // Return fallback if shipFee is null, undefined, or empty
        }

        // Convert shipFee to a number if it's a string
        const fee = typeof shipFee === "string" ? parseFloat(shipFee) : shipFee;

        // Check if the converted fee is a valid number
        return !isNaN(fee)
          ? `${fee.toLocaleString("vi-VN")} đ` // Format as a number and append "đ"
          : "N/A"; // Fallback if conversion fails
      },
    },
    {
      title: "Ghi Chú",
      dataIndex: "note",
      key: "note",
      render: (note) => {
        // If note is "string", display "không có ghi chú"
        return note === "string"
          ? "không có ghi chú"
          : note || "không có ghi chú";
      },
    },
    {
      title: "Trạng Thái Báo Cáo",
      key: "reportStatus",
      render: (_, record) => {
        const reportStatus = record.reportDetail?.status;
        if (reportStatus === "Pending") {
          return <Tag color="yellow">Hàng đang chờ báo cáo</Tag>;
        } else if (reportStatus === "Approve") {
          return <Tag color="green">Hàng đã báo cáo</Tag>;
        }
        return null; // No tag if no relevant status
      },
    },
    {
      title: "Thao Tác",
      dataIndex: "action",
      key: "action",
      render: (_, record, index) => {
        // Check if the order meets the criteria for showing the "Process Transaction" button
        const showProcessButton =
          record.status?.toLowerCase() === "complete" &&
          record.transactionInfo?.transactionType?.toLowerCase() === "pending";

        console.log(
          `Order ${record.orderId} - Show Process Button: ${showProcessButton}, Status: ${record.status}, Transaction Info Status: ${record.transactionInfo?.transactionType}`
        );

        return (
          <span className="flex gap-2">
            <Button
              onClick={() => handleViewOrder(record.orderId, index)}
              type="text"
              icon={<EyeOutlined className="w-4 h-4" />}
              className="flex items-center justify-center"
            />
            {showProcessButton && (
              <Button
                type="primary"
                onClick={() => handleProcessTransaction(record.orderId)}
                loading={processingLoading}
                className="flex items-center justify-center"
              >
                Xử lý giao dịch
              </Button>
            )}
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [dataSource, currentPage, pageSize, searchShopName, selectedStatus]);

  return (
    <div className="product-management-table" style={{ padding: "16px" }}>
      <div className="filter-container">
        <Input
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          placeholder="Tên cửa hàng"
          value={searchShopName}
          style={{ width: "220px", height: 36 }}
          onChange={(e) => {
            setSearchShopName(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          allowClear
        />
        <Select
          prefix={<span style={{ color: "#bfbfbf" }}>🔍</span>}
          placeholder="Chọn trạng thái"
          value={selectedStatus}
          style={{ width: 200, height: 36 }}
          onChange={(value) => {
            setSelectedStatus(value);
            setCurrentPage(1); // Reset to first page on filter
          }}
          allowClear
          options={Object.keys(statusTranslations).map((status) => ({
            value: status,
            label: statusTranslations[status],
          }))}
        />
        <Button
          icon={<ReloadOutlined />}
          onClick={resetFilters}
          type="default"
          style={{ height: 36 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-md flex items-center justify-center"
        >
          Đặt lại bộ lọc
        </Button>
      </div>
      <Spin spinning={loading} tip="Đang Tải...">
        <Table
          scroll={{ x: "1500px" }}
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
        />
      </Spin>
      <div className="pagination-container">
        <Pagination
          total={filteredData.length}
          pageSize={pageSize}
          current={currentPage}
          showSizeChanger
          align="end"
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} / ${total} đơn hàng`
          }
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          }}
        />
      </div>
    </div>
  );
}

export default OrderManagementTableAdmin;
