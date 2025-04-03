import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Descriptions,
  Image,
  Tag,
  message,
  Row,
  Col,
  Card,
  Spin,
  Table,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getListReportSelector } from "../../redux/selector";
import useReportList from "../../hooks/useReportList";
import { getOrderDetail } from "../../redux/slices/orderSlice";
import {
  getListReport,
  updateReportStatus,
} from "../../redux/slices/reportSlice";
import { EditOutlined, LeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function ReportDetail() {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const reportList = useSelector(getListReportSelector);
  const {
    orderDetail = null,
    loading: orderLoading = false,
    error: orderError = null,
  } = useSelector((state) => state.orderSlice || {});
  const { loading: reportLoading = false, error: reportError = null } =
    useSelector((state) => state.reportSlice || {});
  const [reportStatus, setReportStatus] = useState(null);

  // Get the rowIndex from the navigation state
  const rowIndex = location.state?.rowIndex || "N/A"; // Fallback to "N/A" if not provided

  // Fetch the report list if it's not already loaded
  useEffect(() => {
    if (!reportList || reportList.length === 0) {
      dispatch(getListReport())
        .then(() => {
          console.log("Report list fetched successfully");
        })
        .catch((error) => {
          console.error("Error fetching report list:", error);
        });
    }
  }, [dispatch, reportList]);

  // Memoize report to avoid unnecessary useEffect re-runs
  const report = useMemo(
    () => reportList.find((item) => item.reportId === reportId) || {},
    [reportList, reportId]
  );

  // Calculate rowIndex as a fallback if not provided in navigation state
  if (!rowIndex) {
    const reportIndex = reportList.findIndex(
      (item) => item.reportId === reportId
    );
    rowIndex = reportIndex !== -1 ? reportIndex + 1 : "N/A"; // Add 1 to convert to 1-based index
  }

  // Fetch order details when report is found
  //   const report = reportList.find((item) => item.reportId === reportId) || {};
  useEffect(() => {
    if (report.orderId) {
      dispatch(getOrderDetail(report.orderId));
    }
  }, [dispatch, report.orderId, reportList]); // Added reportList to dependencies to prevent re-fetching on every render

  // Set initial report status
  useEffect(() => {
    if (report.status) {
      setReportStatus(report.status);
    }
  }, [report]);

  // Handle case when report is not found
  if (!report.reportId) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Report not found</h2>
        <Button type="primary" onClick={() => navigate("/admin/report")}>
          Go Back to Reports
        </Button>
      </div>
    );
  }

  // Helper function to map status to display text
  const getStatusDisplayText = (status) => {
    switch (status) {
      case "Approve":
        return "Chấp Nhận";
      case "Reject":
        return "Từ Chối";
      default:
        return "N/A"; // Fallback for unknown status
    }
  };

  // Helper function to determine tag color based on status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "gold";
      case "reject":
        return "red";
      case "approve":
        return "green";
      case "complete":
        return "green"; // Added for the "complete" status in the screenshot
      default:
        return "gold";
    }
  };

  // Function to determine the tag color for order status
  const getOrderStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    console.log("Order Status:", status, "Normalized:", normalizedStatus); // Debug log
    switch (normalizedStatus) {
      case "complete":
        return "green";
      case "confirmed":
        return "blue";
      case "fail":
        return "red";
      default:
        return "gold";
    }
  };

  // Handle Approve/Reject actions with API integration
  const handleStatusUpdate = async (newStatus) => {
    try {
      // Dispatch the updateReportStatus thunk with reportId and new status
      await dispatch(
        updateReportStatus({ reportId, statuz: newStatus })
      ).unwrap();
      // Update local state optimistically
      setReportStatus(newStatus);
      // Show success message based on newStatus
      const statusMessage =
        newStatus.toLowerCase() === "approve"
          ? "chấp nhận"
          : newStatus.toLowerCase() === "reject"
          ? "từ chối"
          : newStatus.toLowerCase();
      // Show success message
      message.success(`Báo cáo đã được ${statusMessage} thành công!`);
      // Refetch the report list to sync with backend
      await dispatch(getListReport());
    } catch (error) {
      // Handle any errors from the thunk (e.g., network errors or invalid status)
      message.error(
        `Failed to update report status: ${error.message || "Unknown error"}`
      );
      // Revert to previous status if update fails
      setReportStatus(report.statuz);
    }
  };

  // Fallback order details if API fails or data is not available
  const fallbackOrderDetails = {
    member: "N/A",
    phoneNumber: "N/A",
    address: "N/A",
    orderCode: "N/A",
    orderDate: "N/A",
    paymentMethod: "N/A",
    paymentStatus: "N/A",
    orderId: report.orderId || "N/A",
    status: "N/A",
    statusHistory: [],
  };

  const displayOrderDetails = orderError
    ? fallbackOrderDetails
    : orderDetail || fallbackOrderDetails;

  const columns = [
    {
      title: "ID Sản Phẩm",
      dataIndex: "productId",
      key: "productId",
      width: "5%",
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      width: "30%",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: "15%",
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "10%",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "total",
      key: "total",
      width: "20%",
    },
    {
      title: "Ghi Nhận Thực Tế",
      dataIndex: "actualRecord",
      key: "actualRecord",
      width: "20%",
      render: (_, record) => (
        <div>
          <div>Phí: {record.fee}</div>
          <div>Thời Gian: {record.time}</div>
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div>
          <Button type="link" className="p-0" icon={<EditOutlined />}>
            Chỉnh Sửa
          </Button>
        </div>
      ),
    },
  ];

  const data =
    orderDetail?.details?.map((item, index) => ({
      key: index + 1,
      productId: item.productId,
      productName: item.productName || "Unknown Product",
      price: item.price || "N/A",
      quantity: item.quantity,
      total: item.price ? `${item.quantity * item.price} VND` : "N/A",
      fee: item.fee || "No Record",
      time: item.time || "No Record",
    })) || [];

  return (
    <div style={{ padding: "20px", maxWidth: "1920px", margin: "0 auto" }}>
      <Button
        type="text"
        icon={<LeftOutlined />}
        onClick={() => navigate("/admin/report")}
        style={{ marginBottom: "20px" }}
      >
        Trang Chủ
      </Button>

      <Row gutter={16}>
        {/* Left Section: Order Details */}
        <Col span={12}>
          <Card title={`Đơn Hàng #${rowIndex}`}>
            <Spin spinning={orderLoading}>
              <Descriptions
                bordered={false} // Match screenshot style
                column={1}
                size="middle"
                labelStyle={{
                  fontWeight: "bold",
                  width: "150px",
                  color: "#000",
                }}
                contentStyle={{ minWidth: "200px", color: "#555" }}
              >
                <Descriptions.Item label="Tên Thành Viên">
                  {displayOrderDetails.customerName}
                </Descriptions.Item>
                <Descriptions.Item label="Số Điện Thoại">
                  {displayOrderDetails.customerPhoneNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Địa Chỉ">
                  {displayOrderDetails.customerAddress?.provinceName},{" "}
                  {displayOrderDetails.customerAddress?.districtName},{" "}
                  {displayOrderDetails.customerAddress?.wardName}
                </Descriptions.Item>
                <Descriptions.Item label="Mã Đơn Hàng">
                  {displayOrderDetails.oder_code}
                </Descriptions.Item>
                <Descriptions.Item label="Loại Ship">
                  {displayOrderDetails.shipType}
                </Descriptions.Item>
                <Descriptions.Item label="Phí Ship">
                  <span>{displayOrderDetails.shipFee}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Ghi Chú">
                  {displayOrderDetails.note}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng Thái">
                  <Tag
                    color={getOrderStatusColor(displayOrderDetails.status)}
                    style={{
                      width: "80px",
                      textAlign: "center",
                      fontSize: "14px",
                      padding: "5px",
                      borderRadius: "10px",
                    }}
                  >
                    {displayOrderDetails.status}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              {/* <div style={{ marginTop: "20px" }}>
                <h3>Status History</h3>
                {displayOrderDetails.statusHistory?.length > 0
                  ? displayOrderDetails.statusHistory.map((history, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ color: "#888" }}>•</span>
                        <span>{history.time}</span>
                        <Tag color="gold" style={{ borderRadius: "10px" }}>
                          {history.status}
                        </Tag>
                      </div>
                    ))
                  : "No history available"}
              </div> */}

              {/* <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <Button
                  danger
                  onClick={() =>
                    message.info(
                      "Cancel Order functionality would be implemented here"
                    )
                  }
                  style={{ borderRadius: "20px" }}
                >
                  Cancel Order
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    message.info(
                      "Confirm Order functionality would be implemented here"
                    )
                  }
                  style={{ borderRadius: "20px" }}
                >
                  Confirm Order
                </Button>
              </div> */}
            </Spin>
          </Card>
        </Col>

        {/* Right Section: Report Details */}
        <Col span={12}>
          <Card title="Chi Tiết Báo Cáo">
            <Spin spinning={reportLoading}>
              <Descriptions
                bordered={false} // Match screenshot style
                column={1}
                size="middle"
                labelStyle={{
                  fontWeight: "bold",
                  width: "150px",
                  color: "#000",
                }}
                contentStyle={{ minWidth: "200px", color: "#555" }}
              >
                <Descriptions.Item label="ID Báo Cáo">
                  {report.reportId}
                </Descriptions.Item>
                <Descriptions.Item label="ID Đơn Hàng">
                  {report.orderId || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày Tạo">
                  {report.createdDate
                    ? dayjs(report.createdDate).format("DD-MM-YYYY / HH:mm:ss")
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Lý Do">
                  {report.reason || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng Thái">
                  <Tag
                    color={getStatusColor(reportStatus)}
                    style={{
                      width: "80px",
                      textAlign: "center",
                      fontSize: "14px",
                      padding: "5px",
                      borderRadius: "10px", // Match screenshot tag style
                    }}
                  >
                    {getStatusDisplayText(reportStatus) || "N/A"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Hình Ảnh">
                  {report.image ? (
                    <Image
                      width={62}
                      height={62}
                      src={report.image}
                      alt="Report evidence"
                      style={{ objectFit: "cover", borderRadius: 5 }}
                      preview={{
                        mask: "Click to view",
                      }}
                    />
                  ) : (
                    "No image available"
                  )}
                </Descriptions.Item>
              </Descriptions>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="primary"
                  onClick={() => handleStatusUpdate("Approve")}
                  disabled={reportStatus === "Approve"}
                  loading={reportLoading}
                  style={{ borderRadius: "20px" }}
                >
                  Chấp Nhận
                </Button>
                <Button
                  danger
                  onClick={() => handleStatusUpdate("Reject")}
                  disabled={reportStatus === "Reject"}
                  loading={reportLoading}
                  style={{ borderRadius: "20px" }}
                >
                  Từ Chối
                </Button>
              </div>
            </Spin>
          </Card>
        </Col>
      </Row>

      {/* Full Width Order Detail Card */}
      <div className="w-full bg-white rounded-lg p-6 border border-gray-200 mt-5">
        <h2 className="text-lg font-semibold mb-4">Chi Tiết Đơn Hàng</h2>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          className="mb-4"
        />
        <div className="flex flex-col items-end space-y-2 mt-4">
          <div className="flex justify-end">
            <span className="text-gray-600 w-32">Temporary Price:</span>
            <span className="w-32 text-right">8,800,000 VND</span>
          </div>
          <div className="flex justify-end">
            <span className="text-gray-600 w-32">Delivery Fee:</span>
            <span className="w-32 text-right">200,000 VND</span>
          </div>
          <div className="flex justify-end">
            <span className="font-bold w-32">Total:</span>
            <span className="w-32 text-right text-red-500 font-bold">
              9,000,000 VND
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportDetail;
