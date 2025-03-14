import { EyeOutlined } from "@ant-design/icons";
import { Button, Pagination, Spin, Table, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getListOrder } from "../../redux/slices/orderSlice";
import {
  createOrderGHN,
  updateOrderCodeShipFee,
  updateOrderShipType,
  updateOrderStatus,
} from "../../redux/slices/ghnSlice";

function OrdermanagementTable({ dataSource, shopId, ghNid }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.authSlice.user);
  const currentShopId = shopId || loggedInUser?.shopId;
  const currentGhnId = ghNid || loggedInUser?.ghNid;
  console.log("ghnId:", currentGhnId);

  const ghnId = currentGhnId;

  // pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [processingOrders, setProcessingOrders] = useState({});
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders when the component mounts
    const fetchOrders = async () => {
      try {
        const response = await dispatch(getListOrder(currentShopId)); // Example API call
        if (response.payload) {
          setOrders(response.payload); // Ensure orders are populated
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []); // Runs once when the component mounts

  // Compute paginated data
  const paginatedData = orders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewDetails = (orderId) => {
    navigate(`/shop/order-detail/${orderId}`);
  };

  const createOrderFromShopData = (orderByShopId) => {
    const customerAddress = orderByShopId.customerAddress;
    console.log(customerAddress);
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
      // Set the current order as processing
      setProcessingOrders((prev) => ({ ...prev, [orderId]: true }));

      // Find the order by orderId
      const orderByShopId = dataSource.find(
        (order) => order.orderId === orderId
      );

      if (!orderByShopId) {
        message.error("Order not found for the given orderId");
        setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
        return;
      }

      // Create the order data
      const orderData = createOrderFromShopData(orderByShopId);

      // Send just the order data directly instead of wrapping it - we'll let the API handle the structure
      console.log("Order data to be sent to GHN:", orderData);

      // Send order details to GHN - using hardcoded ghnId
      // Try a different approach - send the direct orderData without wrapping it
      const response = await dispatch(
        createOrderGHN({
          ghnRequest: orderData, // Wrap orderData inside ghnRequest
          ghnId: ghnId,
        })
      );

      if (response.error) {
        console.error("GHN API Error:", response.error);
        message.error(
          `Error creating order in GHN: ${
            response.error.message || "API request failed"
          }`
        );
        setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
        return;
      }

      const { data } = response.payload;

      // Check if the expected data structure is available
      if (!data || !data.order_code) {
        console.error("Unexpected GHN response structure:", response.payload);
        message.error("Received unexpected response format from GHN");
        setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
        return;
      }

      const { order_code } = data;
      const shipFee = String(data.fee.cod_fee);

      // Update order code and ship fee
      await dispatch(updateOrderCodeShipFee({ orderId, order_code, shipFee }));

      // Update ship type
      await dispatch(updateOrderShipType({ orderId, shipType: "Picking" }));

      // Update order status
      await dispatch(updateOrderStatus({ orderId, status: "Confirmed" }));

      message.success("Order confirmed and updated successfully");

      // Refresh the order list
      dispatch(getListOrder(currentShopId));

      // Set the order as no longer processing
      setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
    } catch (error) {
      console.error("Error confirming order:", error);
      message.error(
        `Error confirming order: ${error.message || "Unknown error"}`
      );
      setProcessingOrders((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Shop Name",
      dataIndex: "shopName",
      key: "shopName",
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
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Confirmed" ? "green" : "blue"}>{status}</Tag>
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
              record.status === "Confirmed" || processingOrders[record.orderId]
            }
          >
            {record.status === "Confirmed" ? "Confirmed" : "Confirm"}
          </Button>
          {record.status === "Confirmed" && (
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
  }, [dataSource, currentPage, pageSize]);

  return (
    <div className="w-full">
      <Spin spinning={loading} tip="Loading...">
        <Table
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          rowKey="orderId"
          className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
          style={{ marginBottom: "1rem" }}
        />
      </Spin>
      <Pagination
        total={orders.length}
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

// const createOrderFromShopData = (orderByShopId) => {
//   const customerAddress = orderByShopId.customerAddress;
//   console.log(customerAddress);
//   return {
//     to_name: orderByShopId.customerName,
//     from_name: orderByShopId.shopName,
//     from_phone: "0936584293",
//     from_address: "123 asd",
//     from_ward_name: "Phường 14",
//     from_district_name: "Quận 10",
//     from_province_name: "HCM",

//     to_phone: "0936842673",
//     to_address: `${customerAddress.wardName}, ${customerAddress.districtName}, ${customerAddress.provinceName}`,
//     to_ward_code: String(customerAddress.wardId),
//     to_district_id: Number(customerAddress.districtId),

//     weight: Number(200),
//     length: Number(1),
//     width: Number(19),
//     height: Number(10),

//     service_type_id: Number(5),
//     payment_type_id: Number(2),
//     required_note: "KHONGCHOXEMHANG",

//     items: orderByShopId.details.map((item) => ({
//       name: item.productName || "tam",
//       quantity: Number(item.quantity),
//       weight: Number(1200),
//     })),
//   };
// };

// import { EyeOutlined } from "@ant-design/icons";
// import { Button, Pagination, Spin, Table, Tag } from "antd";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router";
// import useOrderList from "../../hooks/useOrderList";
// import { getListOrder } from "../../redux/slices/orderSlice";
// import {
//   createOrderGHN,
//   updateOrderCodeShipFee,
//   updateOrderShipType,
//   updateOrderStatus,
// } from "../../redux/slices/ghnSlice";

// function OrdermanagementTable({ dataSource, shopId }) {
//   //const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const loggedInUser = useSelector((state) => state.authSlice.user); // Example path
//   const currentShopId = shopId || loggedInUser?.shopId;
//   console.log("Datasource: ", dataSource);
//   // const packageList = useSelector(getListMembershipPackageSelector);
//   // console.log("package list", packageList);
//   const dispatch = useDispatch();

//   // pagination
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   // Compute paginated data
//   const paginatedData = dataSource.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const handleViewDetails = (orderId) => {
//     navigate(`/shop/order-detail/${orderId}`);
//     console.log("Navigating to detail page with ID:", orderId);
//   };

//   const createOrderFromShopData = (orderByShopId) => {
//     const customerAddress = orderByShopId.customerAddress;

//     return {
//       to_name: orderByShopId.customerName || "NULL", // Ensure no null values
//       from_name: orderByShopId.shopName || "NULL",
//       from_phone: orderByShopId.customerPhoneNumber || "0936584293",
//       from_address: customerAddress
//         ? `${customerAddress.wardName}, ${customerAddress.districtName}, ${customerAddress.provinceName}`
//         : "NULL",
//       from_ward_name: customerAddress?.wardName || "NULL",
//       from_district_name: customerAddress?.districtName || "NULL",
//       from_province_name: customerAddress?.provinceName || "NULL",

//       to_phone: orderByShopId.customerPhoneNumber || "0936842673",
//       to_address: customerAddress
//         ? `${customerAddress.wardName}, ${customerAddress.districtName}, ${customerAddress.provinceName}`
//         : "NULL",
//       to_ward_code: customerAddress?.wardId
//         ? Number(customerAddress.wardId)
//         : null, // ✅ Convert to number
//       to_district_id: customerAddress?.districtId
//         ? Number(customerAddress.districtId)
//         : null, // ✅ Convert to number

//       weight: "500", // Example weight, adjust accordingly
//       length: "200",
//       width: "200",
//       height: "200",

//       service_type_id: 5,
//       payment_type_id: 2,
//       required_note: "KHONGCHOXEMHANG",

//       items: orderByShopId.details.map((item) => ({
//         name: item.productName || "NULL",
//         quantity: String(item.quantity || 0),
//         weight: String(item.weight || 0),
//       })),
//     };
//   };

//   const handleConfirmOrder = async (orderId, shopId) => {
//     try {
//       // Step 1: Find the order by shopId (from Redux or data source)
//       const orderByShopId = dataSource.find(
//         (order) => order.orderId === orderId
//       ); // Assuming dataList contains the order data

//       if (!orderByShopId) {
//         console.error("Order not found for the given orderId:", orderId);
//         return;
//       }

//       // Step 2: Create the order data using the `createOrderFromShopData` function
//       const orderData = createOrderFromShopData(orderByShopId);
//       console.log("Order data to be sent to GHN:", orderData);

//       // Step 3: Send order details to GHN to create an order
//       const response = await dispatch(createOrderGHN(shopId, orderData)); // Pass the shopId and created orderData
//       if (response.error) {
//         console.error("Error creating order in GHN:", response.error.message);
//         return;
//       }

//       const { data } = response.payload; // Assuming the response has order details
//       const { order_code, shipFee, shipType } = data;

//       // Step 4: Update the order details in the system
//       // Update order code and ship fee
//       await dispatch(updateOrderCodeShipFee({ orderId, order_code, shipFee }));

//       // Update ship type (assuming 'shipType' is available from GHN response)
//       await dispatch(updateOrderShipType({ orderId, shipType }));

//       // Update order status (assuming 'Confirmed' is the status you want to set)
//       await dispatch(updateOrderStatus({ orderId, status: "Confirmed" }));

//       console.log("Order confirmed and updated successfully:", orderId);

//       // Step 5: Refresh the order list after confirmation
//       dispatch(getListOrder(shopId)); // Refresh the list of orders
//     } catch (error) {
//       console.error("Error confirming order:", error);
//     }
//   };

//   const columns = [
//     {
//       title: "Order ID",
//       dataIndex: "orderId",
//       key: "orderId",
//     },
//     {
//       title: "Shop Name",
//       dataIndex: "shopName",
//       key: "shopName",
//     },
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
//       dataIndex: "status",
//       key: "status",
//     },
//     {
//       title: "Ship Fee",
//       dataIndex: "shipFee",
//       key: "shipFee",
//     },
//     {
//       title: "Note",
//       dataIndex: "note",
//       key: "note",
//     },
//     {
//       title: "",
//       key: "action",
//       width: 70,
//       render: (record) => (
//         <div className="flex space-x-2">
//           <Button
//             type="text"
//             icon={<EyeOutlined className="w-4 h-4" />}
//             className="flex items-center justify-center"
//             onClick={() => handleViewDetails(record.orderId)} // Pass the correct orderId
//           />
//           <Button
//             type="primary"
//             onClick={() => handleConfirmOrder(record.orderId)}
//           >
//             Confirm
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   useEffect(() => {
//     if (currentShopId) {
//       dispatch(getListOrder(currentShopId)); // Fetch orders based on shopId
//     }
//   }, [dispatch, currentShopId]);

//   // useEffect(() => {
//   //   const fixedShopId = "ac019618-8ded-4f00-b7f0-dcf5734f0d81"; // Override shopId
//   //   dispatch(getListOrder(fixedShopId));
//   // }, [dispatch]);

//   // console.log("DataSource from Redux:", dataList);

//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//     }, 2000);
//   }, [dataSource, currentPage, pageSize]);

//   // useEffect(() => {
//   //   console.log("DataSource in component:", dataSource);
//   // }, [dataSource]);

//   // Get List
//   const GetListTable = () => {
//     setLoading(true);
//     dispatch(useOrderList(shopId))
//       .then(() => {
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       });
//   };

//   return (
//     <div className="w-full">
//       <Spin spinning={loading} tip="Loading...">
//         <Table
//           dataSource={paginatedData}
//           columns={columns}
//           pagination={false}
//           className="[&_.ant-table-thead_.ant-table-cell]:bg-[#fafafa] [&_.ant-table-thead_.ant-table-cell]:font-medium [&_.ant-table-cell]:py-4"
//           style={{ marginBottom: "1rem" }}
//           onChange={GetListTable}
//         />
//       </Spin>
//       <Pagination
//         total={dataSource.length}
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
