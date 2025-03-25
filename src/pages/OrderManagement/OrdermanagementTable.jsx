import { EyeOutlined } from "@ant-design/icons";
import { Button, Pagination, Select, Spin, Table, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getListOrder } from "../../redux/slices/orderSlice";
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
    ready_to_pick: "ready_to_pick",
    picking: "picked",
    money_collect_picking: "picked",
    picked: "picked",
    storing: "storing",
    transporting: "transporting",
    sorting: "sorting",
    delivering: "delivering",
    money_collect_delivering: "delivering",
    delivered: "delivered",
    delivery_fail: "delivery_fail",
    waiting_to_return: "waiting_to_return",
    return: "returning",
    return_transporting: "returning",
    return_sorting: "returning",
    returning: "returning",
    return_fail: "return_fail",
    returned: "returned",
    cancel: "cancel",
  };

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
      !["Pending", "Confirmed", "In Progress", "Completed", "Fail"].includes(
        order.status
      )
    ) {
      computedStatus = "Pending"; // Fallback for invalid status
    }

    if (trackingInfo) {
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

  const handleViewDetails = (orderId) => {
    navigate(`/shop/order-detail/${orderId}`);
  };

  const createOrderFromShopData = (orderByShopId) => {
    const customerAddress = orderByShopId.customerAddress;
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
      await dispatch(
        updateOrderShipType({ orderId, shipType: "ready_to_pick" })
      );

      // Update order status to "Confirmed"
      await dispatch(updateOrderStatus({ orderId, status: "Confirmed" }));

      message.success("Order confirmed and updated successfully");

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

  const columns = [
    {
      title: "",
      key: "orderId",
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Province Name",
      dataIndex: ["customerAddress", "provinceName"],
      key: "provinceName",
    },
    {
      title: "District Name",
      dataIndex: ["customerAddress", "districtName"],
      key: "districtName",
    },
    {
      title: "Ward Name",
      dataIndex: ["customerAddress", "wardName"],
      key: "wardName",
    },
    {
      title: "Ship Type",
      dataIndex: "shipType",
      key: "shipType",
    },
    {
      title: "Order Code",
      dataIndex: "oder_code",
      key: "oder_code",
    },
    {
      title: "Status",
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
              : "yellow"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Ship Fee",
      dataIndex: "shipFee",
      key: "shipFee",
      render: (shipFee) => (
        <span>{shipFee ? `${shipFee.toLocaleString()} VND` : "-"}</span>
      ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "",
      key: "action",
      width: 150,
      render: (record) => (
        <div className="flex space-x-2">
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
              ? "Confirmed"
              : "Confirm"}
          </Button>
          {["In Progress", "Confirmed", "Completed", "Fail"].includes(
            record.computedStatus
          ) && (
            <Button
              type="text"
              icon={<EyeOutlined className="w-4 h-4" />}
              className="flex items-center justify-center"
              onClick={() => handleViewDetails(record.orderId)}
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
  ]);

  return (
    <div className="w-full">
      {/* Search Dropdowns */}
      <div className="flex space-x-3 mb-4">
        <Select
          placeholder="Select Province"
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
          placeholder="Select District"
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
          placeholder="Select Ward"
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
          placeholder="Select Status"
          allowClear
          style={{ width: 200 }}
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value)}
          options={[
            { value: "Confirmed", label: "Confirmed" },
            { value: "In Progress", label: "In Progress" },
            { value: "Completed", label: "Completed" },
            { value: "Fail", label: "Fail" },
          ]}
        />
        <Button
          onClick={resetFilters}
          type="default"
          style={{ marginLeft: 10 }}
        >
          Reset Filters
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
          `${range[0]}-${range[1]} of ${total} items`
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

// import { EyeOutlined } from "@ant-design/icons";
// import { Button, Pagination, Select, Spin, Table, Tag, message } from "antd";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router";
// import { getListOrder } from "../../redux/slices/orderSlice";
// import {
//   createOrderGHN,
//   fetchDistricts,
//   fetchOrderTracking,
//   fetchProvinces,
//   fetchWards,
//   updateOrderCodeShipFee,
//   updateOrderShipType,
//   updateOrderStatus,
// } from "../../redux/slices/ghnSlice";
// import { getListOrderSelector } from "../../redux/selector";
// //import { useOrderList } from "../../hooks/useOrderList";

// function OrdermanagementTable({ dataSource, shopId, ghNid }) {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const loggedInUser = useSelector((state) => state.authSlice.user);
//   const currentShopId = shopId || loggedInUser?.shopId;
//   const currentGhnId = ghNid || loggedInUser?.ghNid;
//   const listOrder = useSelector(getListOrderSelector);
//   console.log("order list:", listOrder);

//   console.log("ghnId:", currentGhnId);

//   const ghnId = currentGhnId;

//   // Redux state for location data
//   const provinces = useSelector((state) => state.ghnSlice.provinces);
//   const districts = useSelector((state) => state.ghnSlice.districts);
//   const wards = useSelector((state) => state.ghnSlice.wards);

//   // Loading states
//   const loadingProvinces = useSelector((state) => state.ghnSlice.loading);
//   const loadingDistricts = useSelector((state) => state.ghnSlice.loading);
//   const loadingWards = useSelector((state) => state.ghnSlice.loading);

//   // pagination
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [processingOrders, setProcessingOrders] = useState({});
//   const [orders, setOrders] = useState([]);

//   // Selected filters
//   const [selectedProvince, setSelectedProvince] = useState(null);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedWard, setSelectedWard] = useState(null);
//   const [selectedStatus, setSelectedStatus] = useState(null);

//   useEffect(() => {
//     dispatch(fetchProvinces());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Provinces:", provinces); // ✅ Debug API response
//   }, [provinces]);

//   useEffect(() => {
//     dispatch(fetchProvinces()); // Load provinces initially
//     dispatch(getListOrder(currentShopId)) // Load orders
//       .then((response) => {
//         if (response.payload) setOrders(response.payload);
//       });
//   }, [dispatch, currentShopId]);

//   // Fetch districts when a province is selected
//   useEffect(() => {
//     if (selectedProvince) {
//       dispatch(fetchDistricts(selectedProvince));
//       setSelectedDistrict(null);
//       setSelectedWard(null);
//     } else {
//       setSelectedDistrict(null);
//       setSelectedWard(null);
//     }
//   }, [selectedProvince, dispatch]);

//   // Fetch wards when a district is selected
//   useEffect(() => {
//     if (selectedDistrict) {
//       dispatch(fetchWards(selectedDistrict));
//       setSelectedWard(null);
//     } else {
//       setSelectedWard(null);
//     }
//   }, [selectedDistrict, dispatch]);

//   const [trackingData, setTrackingData] = useState({});

//   // Fetch tracking info for all orders
//   useEffect(() => {
//     const fetchTrackingData = async () => {
//       const trackingResults = {};

//       await Promise.all(
//         listOrder.map(async (order) => {
//           if (order.oder_code) {
//             try {
//               const trackingInfo = await dispatch(
//                 fetchOrderTracking(order.oder_code)
//               ).unwrap();
//               trackingResults[order.oder_code] = trackingInfo;
//             } catch (error) {
//               console.error(
//                 "Error fetching tracking for order:",
//                 order.oder_code,
//                 error
//               );
//             }
//           }
//         })
//       );

//       setTrackingData(trackingResults);
//     };

//     if (listOrder.length > 0) {
//       fetchTrackingData();
//     }
//   }, [listOrder, dispatch]);

//   // Compute the updated orders with tracking status
//   const updatedOrders = listOrder.map((order) => {
//     const trackingInfo = trackingData[order.oder_code];

//     let computedStatus = order.status; // Default to existing status

//     if (trackingInfo) {
//       if (trackingInfo.status === "delivered") {
//         computedStatus = "Completed";
//       } else if (trackingInfo.status === "delivery_fail") {
//         computedStatus = "Fail";
//       } else if (trackingInfo.status !== "ready_to_pick") {
//         computedStatus = "In Progress";
//       }
//     }

//     return { ...order, computedStatus };
//   });

//   // Filter orders based on selections
//   const filteredOrders = updatedOrders.filter((order) => {
//     const provinceMatch = selectedProvince
//       ? order.customerAddress?.provinceId === String(selectedProvince)
//       : true;
//     const districtMatch = selectedDistrict
//       ? order.customerAddress?.districtId === String(selectedDistrict)
//       : true;
//     const wardMatch = selectedWard
//       ? order.customerAddress?.wardId === String(selectedWard)
//       : true;
//     const statusMatch = selectedStatus
//       ? order.computedStatus === selectedStatus
//       : true;

//     return provinceMatch && districtMatch && wardMatch && statusMatch;
//   });

//   const resetFilters = () => {
//     setSelectedProvince(null);
//     setSelectedDistrict(null);
//     setSelectedWard(null);
//     setSelectedStatus(null);
//     setCurrentPage(1);
//     setPageSize(10);
//   };

//   useEffect(() => {
//     // Fetch orders when the component mounts
//     const fetchOrders = async () => {
//       try {
//         const response = await dispatch(getListOrder(currentShopId)); // Example API call
//         if (response.payload) {
//           setOrders(response.payload); // Ensure orders are populated
//         }
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };

//     fetchOrders();
//   }, [currentShopId, dispatch]); // Runs once when the component mounts

//   // Compute paginated data
//   const paginatedData = filteredOrders.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const handleViewDetails = (orderId) => {
//     navigate(`/shop/order-detail/${orderId}`);
//   };

//   const createOrderFromShopData = (orderByShopId) => {
//     const customerAddress = orderByShopId.customerAddress;
//     console.log(customerAddress);
//     return {
//       to_name: "dieu",
//       from_name: "tam",
//       from_phone: "0936584293",
//       from_address: "123 asd",
//       from_ward_name: orderByShopId.customerAddress.wardName,
//       from_district_name: orderByShopId.customerAddress.districtName,
//       from_province_name: orderByShopId.customerAddress.provinceName,

//       to_phone: "0936842673",
//       to_address: "123 asd",
//       to_ward_code: String(20308),
//       to_district_id: Number(1444),

//       weight: Number(200),
//       length: Number(1),
//       width: Number(19),
//       height: Number(10),

//       service_type_id: Number(5),
//       payment_type_id: Number(2),
//       required_note: "KHONGCHOXEMHANG",

//       items: orderByShopId.details.map((item) => ({
//         name: item.productName || "tam",
//         quantity: Number(1),
//         weight: Number(1200),
//       })),
//     };
//   };

//   const handleConfirmOrder = async (orderId) => {
//     try {
//       // Set the current order as processing
//       setProcessingOrders((prev) => ({ ...prev, [orderId]: true }));

//       // Find the order by orderId
//       const orderByShopId = dataSource.find(
//         (order) => order.orderId === orderId
//       );

//       if (!orderByShopId) {
//         message.error("Order not found for the given orderId");
//         setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
//         return;
//       }

//       // Create the order data
//       const orderData = createOrderFromShopData(orderByShopId);

//       // Send just the order data directly instead of wrapping it - we'll let the API handle the structure
//       console.log("Order data to be sent to GHN:", orderData);

//       // Send order details to GHN - using hardcoded ghnId
//       // Try a different approach - send the direct orderData without wrapping it
//       const response = await dispatch(
//         createOrderGHN({
//           ghnRequest: orderData, // Wrap orderData inside ghnRequest
//           ghnId: ghnId,
//         })
//       );

//       if (response.error) {
//         console.error("GHN API Error:", response.error);
//         message.error(
//           `Error creating order in GHN: ${
//             response.error.message || "API request failed"
//           }`
//         );
//         setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
//         return;
//       }

//       const { data } = response.payload;

//       // Check if the expected data structure is available
//       if (!data || !data.order_code) {
//         console.error("Unexpected GHN response structure:", response.payload);
//         message.error("Received unexpected response format from GHN");
//         setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
//         return;
//       }

//       const { order_code } = data;
//       const shipFee = String(data.fee.cod_fee);

//       // Update order code and ship fee
//       await dispatch(updateOrderCodeShipFee({ orderId, order_code, shipFee }));

//       // Update ship type
//       await dispatch(updateOrderShipType({ orderId, shipType: "Picking" }));

//       // Update order status
//       await dispatch(updateOrderStatus({ orderId, status: "Confirmed" }));

//       message.success("Order confirmed and updated successfully");

//       // Refresh the order list
//       dispatch(getListOrder(currentShopId));

//       // Set the order as no longer processing
//       setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
//     } catch (error) {
//       console.error("Error confirming order:", error);
//       message.error(
//         `Error confirming order: ${error.message || "Unknown error"}`
//       );
//       setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
//     }
//   };

//   const columns = [
//     {
//       title: "",
//       //dataIndex: "orderId",
//       key: "orderId",
//       render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
//     },
//     // {
//     //   title: "Shop Name",
//     //   dataIndex: "shopName",
//     //   key: "shopName",
//     // },
//     {
//       title: "Customer Name",
//       dataIndex: "customerName",
//       key: "customerName",
//     },
//     {
//       title: "Province Name",
//       dataIndex: ["customerAddress", "provinceName"],
//       key: "provinceName",
//     },
//     {
//       title: "District Name",
//       dataIndex: ["customerAddress", "districtName"],
//       key: "districtName",
//     },
//     {
//       title: "Ward Name",
//       dataIndex: ["customerAddress", "wardName"],
//       key: "wardName",
//     },
//     {
//       title: "Ship Type",
//       dataIndex: "shipType",
//       key: "shipType",
//     },
//     {
//       title: "Order Code",
//       dataIndex: "oder_code",
//       key: "oder_code",
//     },
//     {
//       title: "Status",
//       dataIndex: "computedStatus", // Use computed status
//       key: "computedStatus",
//       render: (status) => (
//         <Tag
//           color={
//             status === "Completed"
//               ? "green"
//               : status === "Fail"
//               ? "red"
//               : status === "Confirmed"
//               ? "blue"
//               : "yellow"
//           }
//         >
//           {status}
//         </Tag>
//       ),
//     },
//     {
//       title: "Ship Fee",
//       dataIndex: "shipFee",
//       key: "shipFee",
//       render: (shipFee) => (
//         <span>{shipFee ? `${shipFee.toLocaleString()} VND` : "-"}</span>
//       ),
//     },
//     {
//       title: "Note",
//       dataIndex: "note",
//       key: "note",
//     },
//     {
//       title: "",
//       key: "action",
//       width: 150,
//       render: (record) => (
//         <div className="flex space-x-2">
//           <Button
//             type="primary"
//             onClick={() => handleConfirmOrder(record.orderId)}
//             loading={processingOrders[record.orderId]}
//             disabled={
//               record.status === "Confirmed" || processingOrders[record.orderId]
//             }
//           >
//             {record.status === "Confirmed" ? "Confirmed" : "Confirm"}
//           </Button>
//           {record.status === "Confirmed" && (
//             <Button
//               type="text"
//               icon={<EyeOutlined className="w-4 h-4" />}
//               className="flex items-center justify-center"
//               onClick={() => handleViewDetails(record.orderId)}
//             />
//           )}
//         </div>
//       ),
//     },
//   ];

//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//     }, 1000);
//   }, [
//     dataSource,
//     currentPage,
//     pageSize,
//     selectedProvince,
//     selectedDistrict,
//     selectedWard,
//   ]);

//   return (
//     <div className="w-full">
//       {/* Search Dropdowns */}
//       <div className="flex space-x-3 mb-4">
//         <Select
//           placeholder="Select Province"
//           value={selectedProvince}
//           onChange={setSelectedProvince}
//           allowClear
//           style={{ width: "220px" }}
//           loading={loadingProvinces}
//           options={provinces.map((prov) => ({
//             label: prov.ProvinceName,
//             value: prov.ProvinceID,
//           }))}
//         />
//         <Select
//           placeholder="Select District"
//           value={selectedDistrict}
//           onChange={setSelectedDistrict}
//           allowClear
//           style={{ width: "220px" }}
//           loading={loadingDistricts}
//           disabled={!selectedProvince}
//           options={districts.map((dist) => ({
//             label: dist.DistrictName,
//             value: dist.DistrictID,
//           }))}
//         />
//         <Select
//           placeholder="Select Ward"
//           value={selectedWard}
//           onChange={setSelectedWard}
//           allowClear
//           style={{ width: "220px" }}
//           loading={loadingWards}
//           disabled={!selectedDistrict}
//           options={wards.map((ward) => ({
//             label: ward.WardName,
//             value: ward.WardCode,
//           }))}
//         />
//         <Select
//           placeholder="Select Status"
//           allowClear
//           style={{ width: 200 }}
//           value={selectedStatus}
//           onChange={(value) => setSelectedStatus(value)}
//           options={[
//             { value: "Confirmed", label: "Confirmed" },
//             { value: "In Progress", label: "In Progress" },
//             { value: "Completed", label: "Completed" },
//             { value: "Fail", label: "Fail" },
//           ]}
//         />
//         <Button
//           onClick={resetFilters}
//           type="default"
//           style={{ marginLeft: 10 }}
//         >
//           Reset Filters
//         </Button>
//       </div>

//       <Spin spinning={loading} tip="Loading...">
//         <Table
//           scroll={{ x: "1500px" }}
//           dataSource={paginatedData}
//           columns={columns}
//           pagination={false}
//           rowKey="orderId"
//           className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
//           style={{ marginBottom: "1rem" }}
//         />
//       </Spin>
//       <Pagination
//         total={filteredOrders.length}
//         pageSize={pageSize}
//         current={currentPage}
//         showSizeChanger
//         align="end"
//         showTotal={(total, range) =>
//           `${range[0]}-${range[1]} of ${total} items`
//         }
//         onChange={(page, pageSize) => {
//           setCurrentPage(page);
//           setPageSize(pageSize);
//         }}
//       />
//     </div>
//   );
// }

// export default OrdermanagementTable;
