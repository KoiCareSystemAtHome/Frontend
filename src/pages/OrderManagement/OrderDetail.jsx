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

function OrderDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const {
    orderDetail: order,
    status,
    error,
  } = useSelector((state) => state.orderSlice || {});

  //const trackingData = useSelector((state) => state.ghnSlice.orderTracking);

  // useEffect(() => {
  //   if (order?.oder_code) {
  //     console.log("Fetching tracking info for:", order.oder_code);
  //     dispatch(fetchOrderTracking(order.oder_code));
  //   } else {
  //     console.log("No order_code found, useEffect will not run.");
  //   }
  // }, [dispatch, order]);

  useEffect(() => {
    console.log("Fetching order details for ID:", orderId);
    if (orderId) {
      dispatch(getOrderDetail(orderId)).then((res) => {
        console.log("Fetched order Detail:", res);
      });
    }
  }, [dispatch, orderId]);

  // useEffect(() => {
  //   if (order?.oder_code) {
  //     dispatch(fetchOrderTracking(order.oder_code));
  //   }
  // }, [dispatch, order]);

  // useEffect(() => {
  //   if (trackingData && trackingData.status) {
  //     let newStatus = null;

  //     if (trackingData.status !== "ready-to-pick") {
  //       newStatus = "In Progress";
  //     }
  //     if (trackingData.status === "delivered") {
  //       newStatus = "Completed";
  //     }
  //     if (trackingData.status === "delivered_fail") {
  //       newStatus = "Fail";
  //     }

  //     if (newStatus && newStatus !== order.status) {
  //       dispatch(updateOrderStatus({ orderId: order.id, status: newStatus }));
  //     }
  //   }
  // }, [trackingData, order, dispatch]);

  useEffect(() => {
    if (order?.oder_code) {
      dispatch(fetchOrderTracking(order.oder_code))
        .unwrap()
        .then((trackingInfo) => {
          console.log("Tracking Info for order", order.id, ":", trackingInfo);

          let newStatus = null;

          // More explicit status mapping based on tracking status
          if (trackingInfo.status === "delivered") {
            newStatus = "Completed";
            console.log(
              "Setting status to Completed because tracking status is delivered"
            );
          } else if (trackingInfo.status === "delivery_fail") {
            newStatus = "Fail";
            console.log(
              "Setting status to Fail because tracking status is delivered_fail"
            );
          } else if (trackingInfo.status === "ready_to_pick") {
            // Special case: don't change from Confirmed to InProgress
            if (order.status !== "Confirmed") {
              newStatus = "In Progress";
              console.log(
                "Setting status to InProgress because tracking status is ready_to_pick"
              );
            } else {
              console.log("Keeping status as Confirmed despite ready_to_pick");
            }
          } else if (trackingInfo.status !== "ready_to_pick") {
            // Any other status besides ready_to_pick
            newStatus = "In Progress";
            console.log(
              `Setting status to InProgress because tracking status is ${trackingInfo.status}`
            );
          }

          // Only update if we have a new status and it's different
          if (newStatus && newStatus !== order.status) {
            console.log(
              `Updating status from ${order.status} to ${newStatus} based on tracking status: ${trackingInfo.status}`
            );
            dispatch(
              updateOrderStatus({
                orderId: order.id,
                status: newStatus,
              })
            );
          } else {
            console.log(`Keeping status as ${order.status} - no change needed`);
          }
        })
        .catch((error) => {
          console.error(
            "Error fetching tracking info for order",
            order.id,
            ":",
            error
          );
        });
    }
  }, [order, dispatch]);

  if (status === "loading") return <p>Loading order details...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  const handleRefund = () => {
    navigate("/shop/order-refund");
  };

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
    order?.details?.map((item, index) => ({
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
    <div className="w-full`">
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
          Order Detail # {order?.orderId}
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top Row with General Info and Status */}
        <div className="flex gap-6">
          {/* General Information Card */}
          <div className="flex-grow">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">
                General Information
              </h2>
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-32 text-gray-600">Member</span>
                  <span>{order?.customerName}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Phone Number</span>
                  <span>{order?.customerPhoneNumber || "0123456789"}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Address</span>
                  <span>{`${order?.customerAddress.wardName}, ${order?.customerAddress.districtName}, ${order?.customerAddress.provinceName}`}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Order Code</span>
                  <span>{order?.oder_code}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Order Date</span>
                  <span>00:00 20th July, 2024</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Payment Method</span>
                  <img
                    src="https://thuonghieumanh.vneconomy.vn/upload/vnpay.png"
                    alt="VNPay"
                    className="h-6"
                  />
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Payment Status</span>
                  <span>Not yet paid</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="w-96">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="mb-4 text-lg">
                <span className="font-semibold text-xl">Status: </span>
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
              <div className="space-y-2">
                <Button danger block>
                  Cancel Order
                </Button>
                <Button type="primary" block onClick={handleRefund}>
                  Confirm Order
                </Button>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Status History</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span>17:30 12/05/2024</span>
                  <span className="text-gray-500">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Order Detail Card */}
        <div className="w-full bg-white rounded-lg p-6 border border-gray-200">
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
    </div>
  );
}

export default OrderDetail;
