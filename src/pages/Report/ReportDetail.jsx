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
import { useNavigate, useParams } from "react-router-dom";
import { getListReportSelector } from "../../redux/selector";
import useReportList from "../../hooks/useReportList";
import { getOrderDetail } from "../../redux/slices/orderSlice";
import {
  getListReport,
  updateReportStatus,
} from "../../redux/slices/reportSlice";
import { EditOutlined } from "@ant-design/icons";

function ReportDetail() {
  const navigate = useNavigate();
  const { reportId } = useParams();
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

  //   // Call the useReportList hook at the top level
  //   const fetchReportList = useReportList();

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
      // Show success message
      message.success(
        `Report has been ${newStatus.toLowerCase()}d successfully!`
      );
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
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
      width: "5%",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      width: "30%",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "15%",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "10%",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "20%",
    },
    {
      title: "Actual Record",
      dataIndex: "actualRecord",
      key: "actualRecord",
      width: "20%",
      render: (_, record) => (
        <div>
          <div>Fee: {record.fee}</div>
          <div>Time: {record.time}</div>
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
            Edit
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
        onClick={() => navigate("/admin/report")}
        style={{ marginBottom: "20px" }}
      >
        Back
      </Button>

      <Row gutter={16}>
        {/* Left Section: Order Details */}
        <Col span={12}>
          <Card title={`Order #${displayOrderDetails.orderId}`}>
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
                <Descriptions.Item label="Member">
                  {displayOrderDetails.customerName}
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number">
                  {displayOrderDetails.customerPhoneNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {displayOrderDetails.customerAddress?.provinceName},{" "}
                  {displayOrderDetails.customerAddress?.districtName},{" "}
                  {displayOrderDetails.customerAddress?.wardName}
                </Descriptions.Item>
                <Descriptions.Item label="Order Code">
                  {displayOrderDetails.oder_code}
                </Descriptions.Item>
                <Descriptions.Item label="Ship Type">
                  {displayOrderDetails.shipType}
                </Descriptions.Item>
                <Descriptions.Item label="Ship Fee">
                  <span>{displayOrderDetails.shipFee}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Notes">
                  {displayOrderDetails.note}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
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
          <Card title="Report Details">
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
                <Descriptions.Item label="Report ID">
                  {report.reportId}
                </Descriptions.Item>
                <Descriptions.Item label="Order ID">
                  {report.orderId || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Created Date">
                  {report.createdDate || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Reason">
                  {report.reason || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
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
                    {reportStatus || "N/A"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Image">
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
                  Approve
                </Button>
                <Button
                  danger
                  onClick={() => handleStatusUpdate("Reject")}
                  disabled={reportStatus === "Reject"}
                  loading={reportLoading}
                  style={{ borderRadius: "20px" }}
                >
                  Reject
                </Button>
              </div>
            </Spin>
          </Card>
        </Col>
      </Row>

      {/* Full Width Order Detail Card */}
      <div className="w-full bg-white rounded-lg p-6 border border-gray-200 mt-5">
        <h2 className="text-lg font-semibold mb-4">Order Details</h2>
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
