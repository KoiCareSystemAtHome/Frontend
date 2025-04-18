import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  Pagination,
  Select,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getListOrder, rejectOrder } from "../../redux/slices/orderSlice";
import {
  createOrderGHN,
  fetchDistricts,
  fetchOrderTracking,
  fetchProvinces,
  fetchWards,
  updateOrderCodeShipFee,
  updateOrderShipType,
  updateOrderStatus,
} from "../../redux/slices/ghnSlice";
import { getListOrderSelector } from "../../redux/selector";

function OrdermanagementTable({ dataSource, shopId, ghNid }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.authSlice.user);
  const currentShopId = shopId || loggedInUser?.shopId;
  const currentGhnId = ghNid || loggedInUser?.ghNid;
  const listOrder = useSelector(getListOrderSelector);

  const ghnId = currentGhnId;

  // Redux state for location data
  const provinces = useSelector((state) => state.ghnSlice.provinces);
  const districts = useSelector((state) => state.ghnSlice.districts);
  const wards = useSelector((state) => state.ghnSlice.wards);

  // Loading states
  const loadingProvinces = useSelector((state) => state.ghnSlice.loading);
  const loadingDistricts = useSelector((state) => state.ghnSlice.loading);
  const loadingWards = useSelector((state) => state.ghnSlice.loading);

  // Pagination and state
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [processingOrders, setProcessingOrders] = useState({});
  const [orders, setOrders] = useState([]);
  const [trackingData, setTrackingData] = useState({});

  // Selected filters
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Mapping of GHN statuses to shipType
  const ghnStatusToShipType = {
    ready_to_pick: "Mới tạo đơn",
    picking: "Đang lấy hàng",
    money_collect_picking: "Thu tiền người gửi",
    picked: "Đã lấy hàng",
    storing: "Nằm trong kho",
    transporting: "Đang luân chuyển hàng",
    sorting: "Đang phân loại hàng",
    delivering: "Đang giao hàng",
    money_collect_delivering: "Đang thu tiền",
    delivered: "Giao hàng thành công",
    delivery_fail: "Giao hàng thất bại",
    waiting_to_return: "Đang đợi trả hàng",
    return: "Trả hàng",
    return_transporting: "Đang luân chuyển hàng trả",
    return_sorting: "Đang phân loại hàng trả",
    returning: "Đang đi trả hàng",
    return_fail: "Trả hàng thất bại",
    returned: "Trả hàng thành công",
    cancel: "Hủy đơn hàng",
    exception: "Đơn hàng ngoại lệ",
    damage: "Hàng bị hư hỏng",
    lost: "Hàng bị mất",
  };

  const statusTranslations = {
    Pending: "Đang Chờ",
    Confirmed: "Đã Xác Nhận",
    "In Progress": "Đang Giao Hàng",
    Completed: "Hoàn Thành",
    Fail: "Thất Bại",
    Cancel: "Đã Hủy",
  };

  // const ghnStatusToShipType = {
  //   ready_to_pick: "ready_to_pick",
  //   picking: "picked",
  //   money_collect_picking: "picked",
  //   picked: "picked",
  //   storing: "storing",
  //   transporting: "transporting",
  //   sorting: "sorting",
  //   delivering: "delivering",
  //   money_collect_delivering: "delivering",
  //   delivered: "delivered",
  //   delivery_fail: "delivery_fail",
  //   waiting_to_return: "waiting_to_return",
  //   return: "returning",
  //   return_transporting: "returning",
  //   return_sorting: "returning",
  //   returning: "returning",
  //   return_fail: "return_fail",
  //   returned: "returned",
  //   cancel: "cancel",
  // };

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProvinces()); // Load provinces initially
    dispatch(getListOrder(currentShopId)) // Load orders
      .then((response) => {
        if (response.payload) setOrders(response.payload);
      });
  }, [dispatch, currentShopId]);

  // Fetch districts when a province is selected
  useEffect(() => {
    if (selectedProvince) {
      dispatch(fetchDistricts(selectedProvince));
      setSelectedDistrict(null);
      setSelectedWard(null);
    } else {
      setSelectedDistrict(null);
      setSelectedWard(null);
    }
  }, [selectedProvince, dispatch]);

  // Fetch wards when a district is selected
  useEffect(() => {
    if (selectedDistrict) {
      dispatch(fetchWards(selectedDistrict));
      setSelectedWard(null);
    } else {
      setSelectedWard(null);
    }
  }, [selectedDistrict, dispatch]);

  // Fetch tracking info for all orders and update status and shipType
  useEffect(() => {
    const fetchTrackingData = async () => {
      const trackingResults = {};

      await Promise.all(
        listOrder.map(async (order) => {
          if (order.oder_code) {
            // Skip fetching tracking if the order_code doesn't match the expected GHN format
            const isValidGhnOrderCode = /^[A-Z0-9]{6}$/.test(order.oder_code); // Example: Check for 6-character alphanumeric code
            if (!isValidGhnOrderCode) {
              console.log(
                `Skipping tracking for order_code: ${order.oder_code} (invalid format)`
              );
              return; // Skip this order
            }
            try {
              const trackingInfo = await dispatch(
                fetchOrderTracking(order.oder_code)
              ).unwrap();
              trackingResults[order.oder_code] = trackingInfo;

              // Update order status based on GHN tracking status
              let newStatus = order.status;
              if (trackingInfo.status === "delivered") {
                newStatus = "Completed";
              } else if (trackingInfo.status === "delivery_fail") {
                newStatus = "Fail";
              } else if (trackingInfo.status !== "ready_to_pick") {
                newStatus = "In Progress";
              }

              // If the computed status differs from the current status, update it
              if (newStatus !== order.status) {
                await dispatch(
                  updateOrderStatus({
                    orderId: order.orderId,
                    status: newStatus,
                  })
                );
              }

              // Update shipType based on GHN status
              const newShipType =
                ghnStatusToShipType[trackingInfo.status] || order.shipType;
              if (newShipType !== order.shipType) {
                await dispatch(
                  updateOrderShipType({
                    orderId: order.orderId,
                    shipType: newShipType,
                  })
                );
              }
            } catch (error) {
              console.error(
                "Error fetching tracking for order:",
                order.oder_code,
                error
              );
            }
          }
        })
      );

      setTrackingData(trackingResults);
    };

    if (listOrder.length > 0) {
      fetchTrackingData();
    }
  }, [listOrder, dispatch]);

  // Compute the updated orders with tracking status
  const updatedOrders = listOrder.map((order) => {
    const trackingInfo = trackingData[order.oder_code];

    let computedStatus = order.status; // Default to existing status
    if (
      ![
        "Pending",
        "Confirmed",
        "In Progress",
        "Completed",
        "Fail",
        "Cancel",
      ].includes(order.status)
    ) {
      computedStatus = "Pending"; // Fallback for invalid status
    }

    if (order.status === "Cancel") {
      computedStatus = "Cancel";
    } else if (trackingInfo) {
      if (trackingInfo.status === "delivered") {
        computedStatus = "Completed";
      } else if (trackingInfo.status === "delivery_fail") {
        computedStatus = "Fail";
      } else if (trackingInfo.status !== "ready_to_pick") {
        computedStatus = "In Progress";
      }
    }

    return { ...order, computedStatus };
  });

  // Filter orders based on selections
  const filteredOrders = updatedOrders.filter((order) => {
    const provinceMatch = selectedProvince
      ? order.customerAddress?.provinceId === String(selectedProvince)
      : true;
    const districtMatch = selectedDistrict
      ? order.customerAddress?.districtId === String(selectedDistrict)
      : true;
    const wardMatch = selectedWard
      ? order.customerAddress?.wardId === String(selectedWard)
      : true;
    const statusMatch = selectedStatus
      ? order.computedStatus === selectedStatus
      : true;

    return provinceMatch && districtMatch && wardMatch && statusMatch;
  });

  const resetFilters = () => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setSelectedStatus(null);
    setCurrentPage(1);
    setPageSize(10);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await dispatch(getListOrder(currentShopId));
        if (response.payload) {
          setOrders(response.payload);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [currentShopId, dispatch]);

  // Compute paginated data
  const paginatedData = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewDetails = (orderId, index) => {
    const rowIndex = index + 1 + (currentPage - 1) * pageSize; // Calculate the rowIndex
    navigate(`/shop/order-detail/${orderId}`, { state: { rowIndex } });
  };

  const createOrderFromShopData = (orderByShopId) => {
    //const customerAddress = orderByShopId.customerAddress;
    return {
      to_name: "dieu",
      from_name: "tam",
      from_phone: "0936584293",
      from_address: "123 asd",
      from_ward_name: orderByShopId.customerAddress.wardName,
      from_district_name: orderByShopId.customerAddress.districtName,
      from_province_name: orderByShopId.customerAddress.provinceName,

      to_phone: "0936842673",
      to_address: "123 asd",
      to_ward_code: String(20308),
      to_district_id: Number(1444),

      weight: Number(200),
      length: Number(1),
      width: Number(19),
      height: Number(10),

      service_type_id: Number(5),
      payment_type_id: Number(2),
      required_note: "KHONGCHOXEMHANG",

      items: orderByShopId.details.map((item) => ({
        name: item.productName || "tam",
        quantity: Number(1),
        weight: Number(1200),
      })),
    };
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      setProcessingOrders((prev) => ({ ...prev, [orderId]: true }));

      const orderByShopId = dataSource.find(
        (order) => order.orderId === orderId
      );

      if (!orderByShopId) {
        message.error("Order not found for the given orderId");
        setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
        return;
      }

      const orderData = createOrderFromShopData(orderByShopId);
      const response = await dispatch(
        createOrderGHN({
          ghnRequest: orderData,
          ghnId: ghnId,
        })
      );

      if (response.error) {
        message.error(
          `Error creating order in GHN: ${
            response.error.message || "API request failed"
          }`
        );
        setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
        return;
      }

      const { data } = response.payload;

      if (!data || !data.order_code) {
        message.error("Received unexpected response format from GHN");
        setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
        return;
      }

      const { order_code } = data;
      const shipFee = String(data.fee.cod_fee);

      // Update order code and ship fee
      await dispatch(updateOrderCodeShipFee({ orderId, order_code, shipFee }));

      // Update ship type
      await dispatch(updateOrderShipType({ orderId, shipType: "Mới tạo đơn" }));

      // Update order status to "Confirmed"
      await dispatch(updateOrderStatus({ orderId, status: "Confirmed" }));

      message.success("Đơn hàng đã được xác nhận và cập nhật thành công.");

      // Refresh the order list
      const updatedOrders = await dispatch(
        getListOrder(currentShopId)
      ).unwrap();

      // Fetch tracking info for the confirmed order and update status and shipType
      const trackingInfo = await dispatch(
        fetchOrderTracking(order_code)
      ).unwrap();
      let newStatus = "Confirmed";
      if (trackingInfo.status === "delivered") {
        newStatus = "Completed";
      } else if (trackingInfo.status === "delivery_fail") {
        newStatus = "Fail";
      } else if (trackingInfo.status !== "ready_to_pick") {
        newStatus = "In Progress";
      }

      // Update the order status based on GHN tracking
      if (newStatus !== "Confirmed") {
        await dispatch(updateOrderStatus({ orderId, status: newStatus }));
      }

      // Update shipType based on GHN status
      const newShipType = ghnStatusToShipType[trackingInfo.status] || "Picking";
      if (newShipType !== orderByShopId.shipType) {
        await dispatch(
          updateOrderShipType({
            orderId: orderId,
            shipType: newShipType,
          })
        );
      }

      // Update tracking data state
      setTrackingData((prev) => ({
        ...prev,
        [order_code]: trackingInfo,
      }));

      setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
    } catch (error) {
      message.error(
        `Error confirming order: ${error.message || "Unknown error"}`
      );
      setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  // Updated handler for canceling an order using rejectOrder
  const handleCancelOrder = async (orderId) => {
    Modal.confirm({
      centered: true,
      closable: true,
      title: "Xác nhận hủy đơn",
      content: (
        <div>
          <p>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
          <p>Vui lòng nhập lý do hủy đơn:</p>
          <textarea
            id="cancelReason"
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Nhập lý do hủy đơn..."
          />
        </div>
      ),
      onOk: async () => {
        try {
          setProcessingOrders((prev) => ({ ...prev, [orderId]: true }));

          const orderByShopId = dataSource.find(
            (order) => order.orderId === orderId
          );

          if (!orderByShopId) {
            message.error("Order not found for the given orderId");
            setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
            return;
          }

          // Get the reason from the textarea
          const reason =
            document.getElementById("cancelReason")?.value ||
            "No reason provided";
          if (!reason.trim()) {
            message.error("Vui lòng nhập lý do hủy đơn.");
            setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
            return;
          }

          // Call rejectOrder with orderId and reason
          await dispatch(rejectOrder({ orderId, reason })).unwrap();

          // Update the order status to "Cancel" after rejecting the order
          await dispatch(
            updateOrderStatus({ orderId, status: "Cancel" })
          ).unwrap();

          // Optionally, if the order has an order_code and is linked to GHN, cancel it in GHN
          if (orderByShopId.oder_code) {
            console.log(
              `Cancel GHN order with code: ${orderByShopId.oder_code}`
            );
            // Example: await dispatch(cancelOrderGHN({ orderCode: orderByShopId.oder_code, ghnId }));
          }

          // Show success message and refresh the order list
          message.success("Đơn hàng đã được hủy thành công.");
          await dispatch(getListOrder(currentShopId)).unwrap();

          setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
        } catch (error) {
          message.error(
            `Error cancelling order: ${error.message || "Unknown error"}`
          );
          setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
        }
      },
    });
  };

  const columns = [
    {
      title: "",
      key: "orderId",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Tên Thành Viên",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Thành Phố/Tỉnh",
      dataIndex: ["customerAddress", "provinceName"],
      key: "provinceName",
    },
    {
      title: "Quận/Huyện",
      dataIndex: ["customerAddress", "districtName"],
      key: "districtName",
    },
    {
      title: "Phường/Xã",
      dataIndex: ["customerAddress", "wardName"],
      key: "wardName",
    },
    {
      title: "Tình Trạng Giao Hàng",
      dataIndex: "shipType",
      key: "shipType",
      render: (shipType, record) => {
        const trackingInfo = trackingData[record.oder_code || record.orderId]; // Use orderId if oder_code is missing
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
      title: "Mã Đơn Hàng",
      dataIndex: "oder_code",
      key: "oder_code",
    },
    {
      title: "Trạng Thái",
      dataIndex: "computedStatus",
      key: "computedStatus",
      render: (status) => (
        <Tag
          color={
            status === "Completed"
              ? "green"
              : status === "Fail"
              ? "red"
              : status === "Confirmed"
              ? "blue"
              : status === "Cancel"
              ? "grey"
              : "yellow"
          }
        >
          {statusTranslations[status] || status} {/* Use translated status */}
        </Tag>
      ),
    },
    {
      title: "Phí Ship",
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
    },
    {
      title: "",
      key: "action",
      width: 150,
      render: (record, _, index) => (
        <div className="flex space-x-2">
          {/* Conditionally render the Confirm button */}
          {record.status !== "Cancel" && (
            <Button
              type="primary"
              onClick={() => handleConfirmOrder(record.orderId)}
              loading={processingOrders[record.orderId]}
              disabled={
                record.status === "Confirmed" ||
                record.status === "In Progress" ||
                record.status === "Completed" ||
                record.status === "Fail" ||
                processingOrders[record.orderId]
              }
            >
              {record.status === "Confirmed" ||
              record.status === "In Progress" ||
              record.status === "Completed" ||
              record.status === "Fail"
                ? "Đã Xác Nhận"
                : "Xác Nhận"}
            </Button>
          )}

          {/* Conditionally render the Cancel button */}
          {record.status !== "Confirmed" &&
            record.status !== "In Progress" &&
            record.status !== "Completed" &&
            record.status !== "Fail" && (
              <Button
                type="default"
                danger
                onClick={() => handleCancelOrder(record.orderId)}
                loading={processingOrders[record.orderId]}
                disabled={
                  record.status === "Cancel" || processingOrders[record.orderId]
                }
              >
                {record.status === "Cancel" ? "Đã Hủy" : "Hủy Đơn"}
              </Button>
            )}

          {/* View Details button */}
          {["In Progress", "Confirmed", "Completed", "Fail", "Cancel"].includes(
            record.computedStatus
          ) && (
            <Button
              type="text"
              icon={<EyeOutlined className="w-4 h-4" />}
              className="flex items-center justify-center"
              onClick={() => handleViewDetails(record.orderId, index)}
            />
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [
    dataSource,
    currentPage,
    pageSize,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    selectedStatus,
  ]);

  return (
    <div className="w-full">
      {/* Search Dropdowns */}
      <div className="flex space-x-3 mb-4">
        <Select
          placeholder="Thành Phố/Tỉnh"
          value={selectedProvince}
          onChange={setSelectedProvince}
          allowClear
          style={{ width: "220px" }}
          loading={loadingProvinces}
          options={provinces.map((prov) => ({
            label: prov.ProvinceName,
            value: prov.ProvinceID,
          }))}
        />
        <Select
          placeholder="Quận/Huyện"
          value={selectedDistrict}
          onChange={setSelectedDistrict}
          allowClear
          style={{ width: "220px" }}
          loading={loadingDistricts}
          disabled={!selectedProvince}
          options={districts.map((dist) => ({
            label: dist.DistrictName,
            value: dist.DistrictID,
          }))}
        />
        <Select
          placeholder="Phường/Xã"
          value={selectedWard}
          onChange={setSelectedWard}
          allowClear
          style={{ width: "220px" }}
          loading={loadingWards}
          disabled={!selectedDistrict}
          options={wards.map((ward) => ({
            label: ward.WardName,
            value: ward.WardCode,
          }))}
        />
        <Select
          placeholder="Trạng Thái"
          allowClear
          style={{ width: 200 }}
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value)}
          options={[
            { value: "Confirmed", label: "Đã Xác Nhận" },
            { value: "In Progress", label: "Đang Giao Hàng" },
            { value: "Completed", label: "Hoàn Thành" },
            { value: "Fail", label: "Thất Bại" },
            { value: "Cancel", label: "Đã Hủy" },
          ]}
        />
        <Button
          icon={<ReloadOutlined />}
          onClick={resetFilters}
          type="default"
          style={{ marginLeft: 10 }}
        >
          Đặt lại bộ lọc
        </Button>
      </div>

      <Spin spinning={loading} tip="Loading...">
        <Table
          scroll={{ x: "1500px" }}
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          rowKey="orderId"
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
        />
      </Spin>
      <Pagination
        total={filteredOrders.length}
        pageSize={pageSize}
        current={currentPage}
        showSizeChanger
        align="end"
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} / ${total} sản phẩm`
        }
        onChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
      />
    </div>
  );
}

export default OrdermanagementTable;
