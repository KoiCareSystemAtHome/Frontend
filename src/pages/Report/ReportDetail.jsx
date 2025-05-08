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
import { getOrderDetail } from "../../redux/slices/orderSlice";
import {
  getListReport,
  updateReportStatus,
} from "../../redux/slices/reportSlice";
import { getProductById } from "../../redux/slices/productManagementSlice";
import { LeftOutlined } from "@ant-design/icons";
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
  const [productDetails, setProductDetails] = useState([]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);

  const rowIndex = location.state?.rowIndex || "N/A";

  // Fetch report list if not already loaded
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

  const report = useMemo(
    () => reportList.find((item) => item.reportId === reportId) || {},
    [reportList, reportId]
  );

  if (!rowIndex) {
    const reportIndex = reportList.findIndex(
      (item) => item.reportId === reportId
    );
    rowIndex = reportIndex !== -1 ? reportIndex + 1 : "N/A";
  }

  // Reset productDetails when reportId changes
  useEffect(() => {
    setProductDetails([]);
  }, [reportId]);

  // Fetch order details for the current report
  useEffect(() => {
    if (report.orderId) {
      dispatch(getOrderDetail(report.orderId));
    }
  }, [dispatch, report.orderId, reportList]);

  // Set initial report status
  useEffect(() => {
    if (report.status) {
      setReportStatus(report.status);
    }
  }, [report]);

  // Fetch product details using getProductById when orderDetail changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (orderDetail?.details?.length > 0) {
        setIsFetchingProducts(true);
        const productPromises = orderDetail.details.map(async (item) => {
          try {
            const result = await dispatch(
              getProductById(item.productId)
            ).unwrap();
            const productData = result.product || {};
            return {
              ...item,
              productName: productData.productName || "Unknown Product",
              price: productData.price || 0,
              quantity: item.quantity || 1,
              image: productData.image || "",
              total: (productData.price || 0) * (item.quantity || 1),
            };
          } catch (error) {
            console.error(`Error fetching product ${item.productId}:`, error);
            return {
              ...item,
              productName: "Unknown Product",
              price: 0,
              quantity: item.quantity || 1,
              image: "",
              total: 0,
            };
          }
        });

        const fetchedProducts = await Promise.all(productPromises);
        setProductDetails(fetchedProducts);
        setIsFetchingProducts(false);
      } else {
        setProductDetails([]);
        setIsFetchingProducts(false);
      }
    };

    fetchProductDetails();
  }, [dispatch, orderDetail]); // Removed productsById from dependencies

  if (!report.reportId) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Báo cáo không tìm thấy</h2>
        <Button type="primary" onClick={() => navigate("/admin/report")}>
          Quay lại danh sách báo cáo
        </Button>
      </div>
    );
  }

  const getStatusDisplayText = (status) => {
    switch (status) {
      case "Approve":
        return "Chấp Nhận";
      case "Reject":
        return "Từ Chối";
      case "Pending":
        return "Đang Chờ";
      default:
        return "N/A";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "gold";
      case "reject":
        return "red";
      case "approve":
        return "green";
      case "complete":
        return "green";
      default:
        return "gold";
    }
  };

  const getOrderStatusDisplayText = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "complete":
        return "Hoàn Thành";
      case "completed":
        return "Hoàn Thành";
      case "confirmed":
        return "Đã Xác Nhận";
      case "fail":
        return "Thất Bại";
      case "in progress":
        return "Đang Xử Lý";
      default:
        return status || "N/A";
    }
  };

  const getOrderStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "complete":
        return "green";
      case "completed":
        return "green";
      case "confirmed":
        return "blue";
      case "fail":
        return "red";
      default:
        return "gold";
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await dispatch(
        updateReportStatus({ reportId, statuz: newStatus })
      ).unwrap();
      setReportStatus(newStatus);
      const statusMessage =
        newStatus.toLowerCase() === "approve"
          ? "chấp nhận"
          : newStatus.toLowerCase() === "reject"
          ? "từ chối"
          : newStatus.toLowerCase();
      message.success(`Báo cáo đã được ${statusMessage} thành công!`);
      await dispatch(getListReport());
    } catch (error) {
      message.error(
        `Failed to update report status: ${error.message || "Unknown error"}`
      );
      setReportStatus(report.statuz);
    }
  };

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
      //title: "ID Sản Phẩm",
      dataIndex: "productId",
      key: "productId",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image
            width={50}
            height={50}
            src={record.image}
            alt={record.productName}
            style={{ objectFit: "cover", borderRadius: 5 }}
            preview={{
              mask: "Click to view",
            }}
          />
          <span>{record.productName}</span>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} đ`,
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => `${total.toLocaleString()} đ`,
    },
  ];

  const data = productDetails.map((item, index) => ({
    key: index + 1,
    productId: item.productId,
    productName: item.productName,
    price: item.price,
    quantity: item.quantity,
    total: item.total,
    image: item.image,
  }));

  return (
    <div style={{ padding: "20px", maxWidth: "1920px", margin: "0 auto" }}>
      <Button
        type="text"
        icon={<LeftOutlined />}
        onClick={() => {
          console.log("Navigating to /admin/report");
          navigate("/admin/report");
        }}
        style={{ marginBottom: "20px" }}
      >
        Trang Chủ
      </Button>

      <Row gutter={16}>
        <Col span={12}>
          <Card title={`Đơn Hàng #${rowIndex}`}>
            <Spin spinning={orderLoading}>
              <Descriptions
                bordered={false}
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
                {/* <Descriptions.Item label="Số Điện Thoại">
                  {displayOrderDetails.customerPhoneNumber}
                </Descriptions.Item> */}
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
                <Descriptions.Item label="Ghi Chú">
                  {displayOrderDetails.note}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng Thái">
                  <Tag
                    color={getOrderStatusColor(displayOrderDetails.status)}
                    style={{
                      width: "90px",
                      textAlign: "center",
                      fontSize: "14px",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    {getOrderStatusDisplayText(displayOrderDetails.status)}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Spin>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Chi Tiết Báo Cáo">
            <Spin spinning={reportLoading}>
              <Descriptions
                bordered={false}
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
                      width: "90px",
                      textAlign: "center",
                      fontSize: "14px",
                      padding: "5px",
                      borderRadius: "5px",
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
                  style={{ borderRadius: "5px" }}
                >
                  Chấp Nhận
                </Button>
                <Button
                  danger
                  onClick={() => handleStatusUpdate("Reject")}
                  disabled={reportStatus === "Reject"}
                  loading={reportLoading}
                  style={{ borderRadius: "5px" }}
                >
                  Từ Chối
                </Button>
              </div>
            </Spin>
          </Card>
        </Col>
      </Row>

      <div className="w-full bg-white rounded-lg p-6 border border-gray-200 mt-5">
        <h2 className="text-lg font-semibold mb-4">Chi Tiết Đơn Hàng</h2>
        <Spin spinning={isFetchingProducts}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            className="mb-4"
          />
          {data.length > 0 && (
            <div className="flex flex-col items-end space-y-2 mt-4">
              <div className="flex justify-end">
                <span className="text-gray-600 w-32">Giá:</span>
                <span className="w-32 text-right">
                  {data
                    .reduce((sum, item) => sum + item.total, 0)
                    .toLocaleString()}{" "}
                  đ
                </span>
              </div>
              <div className="flex justify-end">
                <span className="font-bold w-32">Tổng:</span>
                <span className="w-32 text-right text-red-500 font-bold">
                  {data
                    .reduce((sum, item) => sum + item.total, 0)
                    .toLocaleString()}{" "}
                  đ
                </span>
              </div>
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
}

export default ReportDetail;
