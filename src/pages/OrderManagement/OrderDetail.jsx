import React, { useEffect } from "react";
import { Table, Button, Tag } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetail } from "../../redux/slices/orderSlice";
import {
  fetchOrderTracking,
  updateOrderStatus,
} from "../../redux/slices/ghnSlice";

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

function OrderDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId } = useParams();

  // Lấy dữ liệu từ orderSlice
  const {
    orderDetail: order,
    status: orderStatus,
    error: orderError,
  } = useSelector((state) => state.orderSlice || {});

  // Lấy dữ liệu từ ghnSlice (dữ liệu tracking)
  const {
    orderTracking: trackingData, // Sửa tên để rõ ràng hơn
    loadingTracking: trackingLoading, // Sửa tên để rõ ràng hơn
    errorTracking: trackingError, // Sửa tên để rõ ràng hơn
  } = useSelector((state) => state.ghnSlice || {});

  // Gọi API để lấy chi tiết đơn hàng và lịch sử trạng thái
  useEffect(() => {
    // Lấy chi tiết đơn hàng
    console.log("Fetching order details for ID:", orderId);
    if (orderId) {
      dispatch(getOrderDetail(orderId)).then((res) => {
        console.log("Fetched order Detail:", res);
        // Sau khi lấy được chi tiết đơn hàng, lấy order_code để gọi tracking-order
        if (res.payload?.oder_code) {
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
      });
    }
  }, [dispatch, orderId]);

  // Xử lý trạng thái loading và error
  if (orderStatus === "loading") return <p>Loading order details...</p>;
  if (orderStatus === "failed") return <p>Error: {orderError}</p>;
  if (trackingLoading) return <p>Loading tracking data...</p>;
  if (trackingError) return <p>Error: {trackingError}</p>;

  // Debug trackingData
  console.log("trackingData:", trackingData);

  const handleRefund = () => {
    navigate("/shop/order-refund");
  };

  const columns = [
    {
      title: "Mã Sản Phẩm",
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
      title: "Tổng",
      dataIndex: "total",
      key: "total",
      width: "20%",
    },
  ];

  const data =
    order?.details?.map((item, index) => ({
      key: index + 1,
      productId: item.productId,
      productName: item.productName || "Unknown Product",
      price: item.price || "N/A",
      quantity: item.quantity,
      total: item.price ? `${item.quantity * item.price} VND` : "N/A",
    })) || [];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <Button
          type="link"
          className="flex items-center px-0"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/shop/orderManagement")}
        >
          Return
        </Button>
        <h1 className="text-2xl font-normal mt-4">
          Chi Tiết Đơn Hàng # {order?.orderId}
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
                  <span>{order?.customerName}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Số Điện Thoại</span>
                  <span>{order?.customerPhoneNumber || "0123456789"}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Địa Chỉ</span>
                  <span>{`${order?.customerAddress.wardName}, ${order?.customerAddress.districtName}, ${order?.customerAddress.provinceName}`}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Mã Đơn Hàng</span>
                  <span>{order?.oder_code}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Phí Ship</span>
                  <span>{order?.shipFee}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Ghi Chú</span>
                  <span>{order?.note}</span>
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
                    order?.status === "Completed" ||
                    order?.status === "Confirmed"
                      ? "green"
                      : order?.status === "Fail"
                      ? "red"
                      : "yellow"
                  }
                  className="ml-2 text-lg py-2 px-4"
                >
                  {order?.status}
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
                    Không có lịch sử trạng thái
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Order Detail Card */}
        <div className="w-full bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Thông Tin Đơn Hàng</h2>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            className="mb-4"
          />
          <div className="flex flex-col items-end space-y-2 mt-4">
            <div className="flex justify-end">
              <span className="text-gray-600 w-32">Giá:</span>
              <span className="w-32 text-right">8,800,000 VND</span>
            </div>
            <div className="flex justify-end">
              <span className="text-gray-600 w-32">Phí Ship:</span>
              <span className="w-32 text-right">200,000 VND</span>
            </div>
            <div className="flex justify-end">
              <span className="font-bold w-32">Tổng:</span>
              <span className="w-32 text-right text-red-500 font-bold">
                9,000,000 VND
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;

// import React, { useEffect } from "react";
// import { Table, Button, Tag } from "antd";
// import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
// import { useNavigate, useParams } from "react-router";
// import { useDispatch, useSelector } from "react-redux";
// import { getOrderDetail } from "../../redux/slices/orderSlice";
// import {
//   fetchOrderTracking,
//   updateOrderStatus,
// } from "../../redux/slices/ghnSlice";

// function OrderDetail() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { orderId } = useParams();
//   const {
//     orderDetail: order,
//     status,
//     error,
//   } = useSelector((state) => state.orderSlice || {});

//   useEffect(() => {
//     console.log("Fetching order details for ID:", orderId);
//     if (orderId) {
//       dispatch(getOrderDetail(orderId)).then((res) => {
//         console.log("Fetched order Detail:", res);
//       });
//     }
//   }, [dispatch, orderId]);

//   if (status === "loading") return <p>Loading order details...</p>;
//   if (status === "failed") return <p>Error: {error}</p>;

//   const handleRefund = () => {
//     navigate("/shop/order-refund");
//   };

//   const columns = [
//     {
//       title: "Mã Sản Phẩm",
//       dataIndex: "productId",
//       key: "productId",
//       width: "5%",
//     },
//     {
//       title: "Tên Sản Phẩm",
//       dataIndex: "productName",
//       key: "productName",
//       width: "30%",
//     },
//     {
//       title: "Giá",
//       dataIndex: "price",
//       key: "price",
//       width: "15%",
//     },
//     {
//       title: "Số Lượng",
//       dataIndex: "quantity",
//       key: "quantity",
//       width: "10%",
//     },
//     {
//       title: "Tổng",
//       dataIndex: "total",
//       key: "total",
//       width: "20%",
//     },
//     // {
//     //   title: "Actual Record",
//     //   dataIndex: "actualRecord",
//     //   key: "actualRecord",
//     //   width: "20%",
//     //   render: (_, record) => (
//     //     <div>
//     //       <div>Fee: {record.fee}</div>
//     //       <div>Time: {record.time}</div>
//     //     </div>
//     //   ),
//     // },
//     // {
//     //   title: "",
//     //   dataIndex: "action",
//     //   key: "action",
//     //   render: (_, record) => (
//     //     <div>
//     //       <Button type="link" className="p-0" icon={<EditOutlined />}>
//     //         Edit
//     //       </Button>
//     //     </div>
//     //   ),
//     // },
//   ];

//   const data =
//     order?.details?.map((item, index) => ({
//       key: index + 1,
//       productId: item.productId,
//       productName: item.productName || "Unknown Product",
//       price: item.price || "N/A",
//       quantity: item.quantity,
//       total: item.price ? `${item.quantity * item.price} VND` : "N/A",
//       // fee: item.fee || "No Record",
//       // time: item.time || "No Record",
//     })) || [];

//   return (
//     <div className="w-full`">
//       {/* Header */}
//       <div className="mb-6">
//         <Button
//           type="link"
//           className="flex items-center px-0"
//           icon={<ArrowLeftOutlined />}
//           onClick={() => navigate("/shop/orderManagement")}
//         >
//           Return
//         </Button>
//         <h1 className="text-2xl font-normal mt-4">
//           Chi Tiết Đơn Hàng # {order?.orderId}
//         </h1>
//       </div>

//       <div className="flex flex-col gap-6">
//         {/* Top Row with General Info and Status */}
//         <div className="flex gap-6">
//           {/* General Information Card */}
//           <div className="flex-grow">
//             <div className="bg-white rounded-lg p-6 border border-gray-200">
//               <h2 className="text-lg font-semibold mb-4">Thông tin chung</h2>
//               <div className="space-y-3">
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Thành Viên</span>
//                   <span>{order?.customerName}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Số Điện Thoại</span>
//                   <span>{order?.customerPhoneNumber || "0123456789"}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Địa Chỉ</span>
//                   <span>{`${order?.customerAddress.wardName}, ${order?.customerAddress.districtName}, ${order?.customerAddress.provinceName}`}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Mã Đơn Hàng</span>
//                   <span>{order?.oder_code}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Phí Ship</span>
//                   <span>{order?.shipFee}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Ghi Chú</span>
//                   <span>{order?.note}</span>
//                 </div>
//                 {/* <div className="flex">
//                   <span className="w-32 text-gray-600">Order Date</span>
//                   <span>00:00 20th July, 2024</span>
//                 </div>
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Payment Method</span>
//                   <img
//                     src="https://thuonghieumanh.vneconomy.vn/upload/vnpay.png"
//                     alt="VNPay"
//                     className="h-6"
//                   />
//                 </div>
//                 <div className="flex">
//                   <span className="w-32 text-gray-600">Payment Status</span>
//                   <span>Not yet paid</span>
//                 </div> */}
//               </div>
//             </div>
//           </div>

//           {/* Status Card */}
//           <div className="w-96">
//             <div className="bg-white rounded-lg p-6 border border-gray-200">
//               <div className="mb-4 text-lg">
//                 <span className="font-semibold text-xl">Trạng Thái: </span>
//                 <Tag
//                   color={
//                     order?.status === "Completed" ||
//                     order?.status === "Confirmed"
//                       ? "green"
//                       : order?.status === "Fail"
//                       ? "red"
//                       : "yellow"
//                   }
//                   className="ml-2 text-lg py-2 px-4"
//                 >
//                   {order?.status}
//                 </Tag>
//               </div>
//               {/* <div className="space-y-2">
//                 <Button danger block>
//                   Cancel Order
//                 </Button>
//                 <Button type="primary" block onClick={handleRefund}>
//                   Confirm Order
//                 </Button>
//               </div> */}
//               <div className="mt-6">
//                 <h3 className="font-semibold mb-2">Lịch Sử Trạng Thái</h3>
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 rounded-full bg-gray-400"></div>
//                   <span>17:30 12/05/2024</span>
//                   <span className="text-gray-500">Pending</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Full Width Order Detail Card */}
//         <div className="w-full bg-white rounded-lg p-6 border border-gray-200">
//           <h2 className="text-lg font-semibold mb-4">Thông Tin Đơn Hàng</h2>
//           <Table
//             columns={columns}
//             dataSource={data}
//             pagination={false}
//             className="mb-4"
//           />
//           <div className="flex flex-col items-end space-y-2 mt-4">
//             <div className="flex justify-end">
//               <span className="text-gray-600 w-32">Giá:</span>
//               <span className="w-32 text-right">8,800,000 VND</span>
//             </div>
//             <div className="flex justify-end">
//               <span className="text-gray-600 w-32">Phí Ship:</span>
//               <span className="w-32 text-right">200,000 VND</span>
//             </div>
//             <div className="flex justify-end">
//               <span className="font-bold w-32">Tổng:</span>
//               <span className="w-32 text-right text-red-500 font-bold">
//                 9,000,000 VND
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OrderDetail;
