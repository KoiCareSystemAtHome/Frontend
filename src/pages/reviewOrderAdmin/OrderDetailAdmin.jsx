import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Spin, Image, Select, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetail } from "../../redux/slices/orderSlice";
import { fetchOrderTracking } from "../../redux/slices/ghnSlice";
import { getProductById } from "../../redux/slices/productManagementSlice";

// Hàm định dạng ngày giờ
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

// Ánh xạ trạng thái từ tiếng Anh sang tiếng Việt
const statusTranslations = {
  ready_to_pick: "Sẵn sàng lấy hàng",
  picking: "Đang lấy hàng",
  cancel: "Đã hủy",
  money_collect_picking: "Thu tiền khi lấy hàng",
  picked: "Đã lấy hàng",
  storing: "Đang lưu kho",
  transporting: "Đang vận chuyển",
  sorting: "Đang phân loại",
  delivering: "Đang giao hàng",
  money_collect_delivering: "Thu tiền khi giao hàng",
  delivered: "Đã giao hàng",
  delivery_fail: "Giao hàng thất bại",
  waiting_to_return: "Chờ trả hàng",
  return: "Trả hàng",
  return_transporting: "Đang vận chuyển trả hàng",
  return_sorting: "Đang phân loại trả hàng",
  returning: "Đang trả hàng",
  return_fail: "Trả hàng thất bại",
  returned: "Đã trả hàng",
  exception: "Ngoại lệ",
  damage: "Hư hỏng",
  lost: "Mất hàng",
};

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

function OrderDetailAdmin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const location = useLocation();

  // Get rowIndex from navigation state, default to "N/A" if not provided
  const rowIndex = location.state?.rowIndex || "N/A";

  // Lấy dữ liệu từ orderSlice
  const {
    orderDetail: order,
    status: orderStatus,
    error: orderError,
  } = useSelector((state) => state.orderSlice || {});

  // Lấy dữ liệu từ ghnSlice (dữ liệu tracking)
  const {
    orderTracking: trackingData,
    loadingTracking: trackingLoading,
    errorTracking: trackingError,
  } = useSelector((state) => state.ghnSlice || {});

  // State để lưu chi tiết sản phẩm
  const [productDetails, setProductDetails] = useState([]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);

  // Gọi API để lấy chi tiết đơn hàng và lịch sử trạng thái
  useEffect(() => {
    console.log("Fetching order details for ID:", orderId);
    if (orderId) {
      dispatch(getOrderDetail(orderId))
        .then((res) => {
          console.log("Fetched order Detail:", res);
          if (
            res.payload?.status === "Confirmed" ||
            res.payload?.status === "Delivered" ||
            (res.payload?.status === "Complete" && res.payload?.oder_code)
          ) {
            console.log(
              "Calling fetchOrderTracking with order_code:",
              res.payload.oder_code
            );
            dispatch(fetchOrderTracking(res.payload.oder_code)).then(
              (trackingRes) => {
                console.log("Fetched tracking data:", trackingRes);
              }
            );
          } else {
            console.log("order_code not found in getOrderDetail response");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch order details:", err);
          message.error("Không thể tải chi tiết đơn hàng. Vui lòng thử lại.");
        });
    }
  }, [dispatch, orderId]);

  // Fetch product details using getProductById when order changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (order?.details?.length > 0) {
        setIsFetchingProducts(true);
        const productPromises = order.details.map(async (item) => {
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
              image: productData.image,
              total: (productData.price || 0) * (item.quantity || 1),
            };
          } catch (error) {
            console.error(`Error fetching product ${item.productId}:`, error);
            return {
              ...item,
              productName: "Unknown Product",
              price: 0,
              quantity: item.quantity || 1,
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
  }, [dispatch, order]);

  // Xử lý trạng thái loading và error
  if (orderStatus === "loading") return <p>Đang tải chi tiết đơn hàng...</p>;
  if (orderStatus === "failed" || !order) {
    return (
      <p>
        Lỗi:{" "}
        {orderError || "Không thể tải chi tiết đơn hàng. Vui lòng thử lại."}
      </p>
    );
  }
  if (trackingLoading) return <p>Đang tải dữ liệu theo dõi...</p>;
  if (trackingError) return <p>Lỗi: {trackingError}</p>;

  // Debug trackingData
  console.log("trackingData:", trackingData);

  const columns = [
    {
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
      render: (price) => formatCurrency(price),
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tổng",
      dataIndex: "total",
      key: "total",
      render: (total) => formatCurrency(total),
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

  // Calculate totals with null checks
  const subtotal = productDetails.reduce(
    (sum, item) => sum + (item.total || 0),
    0
  );
  const shippingFee = Number(order?.shipFee) || 0;
  const total = subtotal + shippingFee;
  const commission = subtotal * 0.03; // Calculate 0.3% commission

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <Button
          type="link"
          className="flex items-center px-0"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/orderManagement")}
        >
          Return
        </Button>
        <h1 className="text-2xl font-normal mt-4">
          Chi Tiết Đơn Hàng # {rowIndex}
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top Row with General Info and Status */}
        <div className="flex gap-6">
          {/* General Information Card */}
          <div className="flex-grow">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Thông tin chung</h2>
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-32 text-gray-600">Thành Viên</span>
                  <span>{order?.customerName || "N/A"}</span>
                </div>
                {/* <div className="flex">
                  <span className="w-32 text-gray-600">Số Điện Thoại</span>
                  <span>{order?.customerPhoneNumber || "N/A"}</span>
                </div> */}
                <div className="flex">
                  <span className="w-32 text-gray-600">Địa Chỉ</span>
                  <span>
                    {order?.customerAddress
                      ? `${order.customerAddress.wardName || ""}, ${
                          order.customerAddress.districtName || ""
                        }, ${order.customerAddress.provinceName || ""}`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Mã Đơn Hàng</span>
                  <span>{order?.oder_code || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Phí Ship</span>
                  <span>
                    {order?.shipFee
                      ? formatCurrency(Number(order.shipFee))
                      : "N/A"}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Tiền Hoa Hồng</span>
                  <span>{formatCurrency(commission)}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Tên Người Nhận</span>
                  <span>{order?.recieverName || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Số Điện Thoại</span>
                  <span>{order?.recieverPhone || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Ghi Chú</span>
                  <span>{order?.note || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="w-96">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="mb-4 text-lg">
                <span className="font-semibold text-xl">Trạng Thái: </span>
                <Tag
                  color={
                    order?.status === "Complete"
                      ? "green"
                      : order?.status === "Confirmed"
                      ? "blue"
                      : order?.status === "Fail"
                      ? "red"
                      : order?.status === "Cancel"
                      ? "grey"
                      : order?.status === "Delivered"
                      ? "cyan"
                      : "yellow"
                  }
                  className="ml-2 text-lg py-2 px-4"
                >
                  {order?.status === "Complete"
                    ? "Hoàn Thành"
                    : order?.status === "Confirmed"
                    ? "Đã Xác Nhận"
                    : order?.status === "Fail"
                    ? "Thất Bại"
                    : order?.status === "Cancel"
                    ? "Đã Hủy"
                    : order?.status === "Delivered"
                    ? "Đã Giao Hàng"
                    : order?.status || "Không Xác Định"}
                </Tag>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Lịch Sử Trạng Thái</h3>
                {trackingData?.log?.length > 0 ? (
                  trackingData.log.map((logEntry, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span>{formatDateTime(logEntry.updated_date)}</span>
                      <span className="text-gray-500">
                        {statusTranslations[logEntry.status] || logEntry.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500">
                    Chưa có lịch sử trạng thái
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Order Detail Card */}
        <div className="w-full bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Thông Tin Đơn Hàng</h2>
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
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-end">
                  <span className="text-gray-600 w-32">Phí Ship:</span>
                  <span className="w-32 text-right">
                    {formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-end">
                  <span className="font-bold w-32">Tổng:</span>
                  <span className="w-32 text-right text-red-500 font-bold">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            )}
          </Spin>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailAdmin;
