// import React, { useEffect, useState } from "react";
// import { Card, Row, Col, Typography, Space, Select, Image } from "antd";
// import {
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   UserOutlined,
//   ShoppingCartOutlined,
//   DollarOutlined,
//   ClockCircleOutlined,
//   ArrowUpOutlined,
//   ArrowDownOutlined,
// } from "@ant-design/icons";
// import { Option } from "antd/es/mentions";
// import "./Dashboard.css";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   revenueByShop,
//   totalRevenue,
// } from "../../redux/slices/transactionSlice";

// const { Title, Text } = Typography;

// // Sample data for charts
// const allSalesData = {
//   2023: [
//     { month: "Jan", sales: 3500, orders: 4000 },
//     { month: "Feb", sales: 4200, orders: 3800 },
//     { month: "Mar", sales: 3800, orders: 4200 },
//     { month: "Apr", sales: 4500, orders: 3900 },
//     { month: "May", sales: 4100, orders: 3600 },
//     { month: "Jun", sales: 3900, orders: 4100 },
//     { month: "Jul", sales: 4300, orders: 4400 },
//     { month: "Aug", sales: 4800, orders: 4300 },
//     { month: "Sep", sales: 4400, orders: 4500 },
//     { month: "Oct", sales: 4600, orders: 4200 },
//     { month: "Nov", sales: 4900, orders: 4600 },
//     { month: "Dec", sales: 5000, orders: 4800 },
//   ],
//   2024: [
//     { month: "Jan", sales: 4000, orders: 4200 },
//     { month: "Feb", sales: 4500, orders: 4000 },
//     { month: "Mar", sales: 4200, orders: 4400 },
//     { month: "Apr", sales: 4800, orders: 4100 },
//     { month: "May", sales: 4300, orders: 3800 },
//     { month: "Jun", sales: 4100, orders: 4300 },
//     { month: "Jul", sales: 4600, orders: 4600 },
//     { month: "Aug", sales: 5000, orders: 4500 },
//     { month: "Sep", sales: 4700, orders: 4700 },
//     { month: "Oct", sales: 4900, orders: 4400 },
//     { month: "Nov", sales: 5200, orders: 4800 },
//     { month: "Dec", sales: 5500, orders: 5000 },
//   ],
//   2025: [
//     { month: "Jan", sales: 4500, orders: 4400 },
//     { month: "Feb", sales: 4800, orders: 4200 },
//     { month: "Mar", sales: 4600, orders: 4600 },
//     { month: "Apr", sales: 5100, orders: 4300 },
//     { month: "May", sales: 4500, orders: 4000 },
//     { month: "Jun", sales: 4300, orders: 4500 },
//     { month: "Jul", sales: 4900, orders: 4800 },
//     { month: "Aug", sales: 5300, orders: 4700 },
//     { month: "Sep", sales: 5000, orders: 4900 },
//     { month: "Oct", sales: 5200, orders: 4600 },
//     { month: "Nov", sales: 5500, orders: 5000 },
//     { month: "Dec", sales: 5800, orders: 5200 },
//   ],
// };

// const pieData = [
//   { name: "A", value: 35 },
//   { name: "B", value: 45 },
//   { name: "C", value: 20 },
// ];

// const COLORS = ["#4ade80", "#ef4444", "#3b82f6"];

// const bestSellers = [
//   { name: "Yamato Nishiki Koi Food", sold: 10 },
//   { name: "Yamato Nishiki Koi Food", sold: 10 },
//   { name: "Yamato Nishiki Koi Food", sold: 10 },
//   { name: "Yamato Nishiki Koi Food", sold: 10 },
//   { name: "Yamato Nishiki Koi Food", sold: 10 },
// ];

// const StatCard = ({ title, value, trend, trendValue, icon, color }) => (
//   <Card bodyStyle={{ padding: "20px" }} style={{ background: "#fff" }}>
//     <Space
//       direction="horizontal"
//       style={{ width: "100%", justifyContent: "space-between" }}
//     >
//       <div>
//         <Text type="secondary">{title}</Text>
//         <Title level={3} style={{ margin: "8px 0" }}>
//           {value}
//         </Title>
//         {/*
//         <Space>
//           {trend === "up" ? (
//             <ArrowUpOutlined style={{ color: "#52c41a" }} />
//           ) : (
//             <ArrowDownOutlined style={{ color: "#ff4d4f" }} />
//           )}
//           <Text style={{ color: trend === "up" ? "#52c41a" : "#ff4d4f" }}>
//             {trendValue}
//           </Text>
//         </Space>
//         */}
//       </div>
//       <div
//         style={{
//           backgroundColor: color,
//           borderRadius: "50%",
//           width: 48,
//           height: 48,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           opacity: 0.2,
//         }}
//       >
//         {React.cloneElement(icon, {
//           style: { ...icon.props.style, color: color.replace("0.2", "1") },
//         })}
//       </div>
//     </Space>
//   </Card>
// );

// const Dashboard = () => {
//   const [selectedYear, setSelectedYear] = useState("2024");
//   const dispatch = useDispatch();
//   const { revenueData, totalRevenueData, loading, error } = useSelector(
//     (state) => state.transactionSlice
//   );

//   const loggedInUser = useSelector((state) => state.authSlice.user);
//   const role = useSelector((state) => state.authSlice?.role);
//   const currentShopId = loggedInUser?.shopId;
//   const userRole = role; // Assuming the user object has a "role" field (e.g., "admin" or "shop")
//   console.log("userRole", userRole);
//   const shopid = currentShopId;
//   console.log("shopid", shopid);

//   // Fetch revenue data when the component mounts
//   useEffect(() => {
//     if (userRole === "Admin") {
//       console.log("User is admin, dispatching totalRevenue");
//       dispatch(totalRevenue());
//     } else if (shopid) {
//       console.log(
//         "User is not admin, dispatching revenueByShop with shopid:",
//         shopid
//       );
//       dispatch(revenueByShop(shopid));
//     } else {
//       console.log("No shopid or admin role, skipping dispatch");
//     }
//   }, [dispatch, shopid, userRole]);

//   const handleYearChange = (value) => {
//     setSelectedYear(value);
//   };

//   // Format the totalRevenue for display (e.g., add commas and VND suffix)
//   const formatCurrency = (value) => {
//     if (!value) return "0 VND";
//     return `${value.toLocaleString()} VND`;
//   };

//   // Determine which data to use based on user role
//   const dataToUse = userRole === "Admin" ? totalRevenueData : revenueData;

//   return (
//     <div>
//       <div className="font-semibold ml-4 text-2xl">Dashboard</div>
//       <div style={{ padding: 24, minHeight: "100vh", background: "#f0f2f5" }}>
//         <Row gutter={[16, 16]}>
//           {/* Stats Cards */}
//           <Col xs={24} sm={12} md={8} lg={4}>
//             <StatCard
//               title="Total Member"
//               value={
//                 !loggedInUser
//                   ? "Please log in"
//                   : loading
//                   ? "Loading..."
//                   : error
//                   ? "Error"
//                   : dataToUse?.packageTransactionCount || 0 // Use orderTransactionCount from API
//               }
//               // trend="up"
//               // trendValue="8.5% Up from yesterday"
//               icon={<UserOutlined style={{ fontSize: 24 }} />}
//               color="#722ed1"
//             />
//           </Col>
//           <Col xs={24} sm={12} md={8} lg={4}>
//             <StatCard
//               title="Membership Revenue"
//               value={
//                 !loggedInUser
//                   ? "Please log in"
//                   : loading
//                   ? "Loading..."
//                   : error
//                   ? "Error"
//                   : formatCurrency(dataToUse?.packageRevenue) || 0 // Use orderTransactionCount from API
//               }
//               // trend="up"
//               // trendValue="8.5% Up from yesterday"
//               icon={<UserOutlined style={{ fontSize: 24 }} />}
//               color="#722ed1"
//             />
//           </Col>
//           <Col xs={24} sm={12} md={8} lg={4}>
//             <StatCard
//               title="Total Order"
//               value={
//                 !loggedInUser
//                   ? "Please log in"
//                   : loading
//                   ? "Loading..."
//                   : error
//                   ? "Error"
//                   : dataToUse?.orderTransactionCount || 0 // Use orderTransactionCount from API
//               }
//               // trend="up"
//               // trendValue="3.1% Up from past week"
//               icon={<ShoppingCartOutlined style={{ fontSize: 24 }} />}
//               color="#faad14"
//             />
//           </Col>
//           <Col xs={24} sm={12} md={8} lg={4}>
//             <StatCard
//               title="Order Revenue"
//               value={
//                 !loggedInUser
//                   ? "Please log in"
//                   : loading
//                   ? "Loading..."
//                   : error
//                   ? "Error"
//                   : formatCurrency(dataToUse?.orderRevenue) || 0 // Use orderTransactionCount from API
//               }
//               // trend="up"
//               // trendValue="3.1% Up from past week"
//               icon={<ShoppingCartOutlined style={{ fontSize: 24 }} />}
//               color="#faad14"
//             />
//           </Col>
//           <Col xs={24} sm={12} md={8} lg={4}>
//             <StatCard
//               title="Total Revenue"
//               value={
//                 !loggedInUser
//                   ? "Please log in"
//                   : loading
//                   ? "Loading..."
//                   : error
//                   ? "Error fetching data"
//                   : formatCurrency(dataToUse?.totalRevenue) // Use totalRevenue from API
//               }
//               // trend="down"
//               // trendValue="4.5% Down from yesterday"
//               icon={<DollarOutlined style={{ fontSize: 24 }} />}
//               color="#52c41a"
//             />
//           </Col>
//           {/* <Col xs={24} sm={12} lg={6}>
//             <StatCard
//               title="Total Pending"
//               value="100"
//               // trend="up"
//               // trendValue="2.8% Up from yesterday"
//               icon={<ClockCircleOutlined style={{ fontSize: 24 }} />}
//               color="#fa541c"
//             />
//           </Col> */}

//           {/* Enhanced Sales Details Chart with Year Selector */}
//           <Col xs={24}>
//             <Card
//               title={
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                   }}
//                 >
//                   <span>Sales Details</span>
//                   <Select
//                     value={selectedYear}
//                     onChange={handleYearChange}
//                     style={{ width: 120 }}
//                   >
//                     <Option value="2023">2023</Option>
//                     <Option value="2024">2024</Option>
//                     <Option value="2025">2025</Option>
//                   </Select>
//                 </div>
//               }
//               bodyStyle={{ padding: "0 0 20px 0" }}
//             >
//               <div style={{ height: 400, width: "100%", padding: "20px" }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={allSalesData[selectedYear]}>
//                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                     <XAxis
//                       dataKey="month"
//                       axisLine={false}
//                       tickLine={false}
//                       style={{ fontSize: "12px" }}
//                     />
//                     <YAxis
//                       axisLine={false}
//                       tickLine={false}
//                       style={{ fontSize: "12px" }}
//                       width={60}
//                     />
//                     <Tooltip
//                       contentStyle={{
//                         background: "#fff",
//                         border: "none",
//                         borderRadius: "4px",
//                         boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//                       }}
//                     />
//                     <Legend verticalAlign="top" height={36} iconType="circle" />
//                     <Line
//                       name="Sales"
//                       type="monotone"
//                       dataKey="sales"
//                       stroke="#722ed1"
//                       strokeWidth={2}
//                       dot={false}
//                       activeDot={{ r: 6, fill: "#722ed1" }}
//                     />
//                     <Line
//                       name="Orders"
//                       type="monotone"
//                       dataKey="orders"
//                       stroke="#b37feb"
//                       strokeWidth={2}
//                       dot={false}
//                       activeDot={{ r: 6, fill: "#b37feb" }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </Card>
//           </Col>

//           <Col xs={24} sm={12} lg={8}>
//             <Card title="Total Order">
//               <div
//                 style={{
//                   height: 300,
//                   display: "flex",
//                   justifyContent: "center",
//                 }}
//               >
//                 <PieChart width={250} height={250}>
//                   <Pie
//                     data={pieData}
//                     cx={125}
//                     cy={125}
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {pieData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </div>
//             </Card>
//           </Col>

//           <Col xs={24} sm={12} lg={8}>
//             <Card title="Total Pending">
//               <div
//                 style={{
//                   height: 300,
//                   display: "flex",
//                   justifyContent: "center",
//                 }}
//               >
//                 <PieChart width={250} height={250}>
//                   <Pie
//                     data={pieData}
//                     cx={125}
//                     cy={125}
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {pieData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </div>
//             </Card>
//           </Col>

//           <Col xs={24} sm={24} lg={8}>
//             <Card title="Best Sellers">
//               <Space
//                 direction="vertical"
//                 style={{ width: "100%" }}
//                 size="middle"
//               >
//                 {bestSellers.map((item, index) => (
//                   <div
//                     key={index}
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Space>
//                       <Image
//                         src="https://www.cotswoldkoi.co.uk/wp-content/uploads/2018/02/yamato-456x456.png"
//                         style={{
//                           width: 64,
//                           height: 64,
//                           background: "#f0f0f0",
//                           borderRadius: 4,
//                         }}
//                       ></Image>
//                       <Text>{item.name}</Text>
//                     </Space>
//                     <Text style={{ fontWeight: "bold" }} type="secondary">
//                       Sold: {item.sold}
//                     </Text>
//                   </div>
//                 ))}
//               </Space>
//             </Card>
//           </Col>
//         </Row>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Space, Select, Image } from "antd";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import "./Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import {
  revenueByShop,
  totalRevenue,
  transactionByShop, // Add this import
} from "../../redux/slices/transactionSlice";

const { Title, Text } = Typography;

// Static data for admins (updated to use 'amount')
const allSalesData = {
  2023: [
    { month: "Jan", amount: 3500 },
    { month: "Feb", amount: 4200 },
    { month: "Mar", amount: 3800 },
    { month: "Apr", amount: 4500 },
    { month: "May", amount: 4100 },
    { month: "Jun", amount: 3900 },
    { month: "Jul", amount: 4300 },
    { month: "Aug", amount: 4800 },
    { month: "Sep", amount: 4400 },
    { month: "Oct", amount: 4600 },
    { month: "Nov", amount: 4900 },
    { month: "Dec", amount: 5000 },
  ],
  2024: [
    { month: "Jan", amount: 4000 },
    { month: "Feb", amount: 4500 },
    { month: "Mar", amount: 4200 },
    { month: "Apr", amount: 4800 },
    { month: "May", amount: 4300 },
    { month: "Jun", amount: 4100 },
    { month: "Jul", amount: 4600 },
    { month: "Aug", amount: 5000 },
    { month: "Sep", amount: 4700 },
    { month: "Oct", amount: 4900 },
    { month: "Nov", amount: 5200 },
    { month: "Dec", amount: 5500 },
  ],
  2025: [
    { month: "Jan", amount: 4500 },
    { month: "Feb", amount: 4800 },
    { month: "Mar", amount: 4600 },
    { month: "Apr", amount: 5100 },
    { month: "May", amount: 4500 },
    { month: "Jun", amount: 4300 },
    { month: "Jul", amount: 4900 },
    { month: "Aug", amount: 5300 },
    { month: "Sep", amount: 5000 },
    { month: "Oct", amount: 5200 },
    { month: "Nov", amount: 5500 },
    { month: "Dec", amount: 5800 },
  ],
};

const pieData = [
  { name: "A", value: 35 },
  { name: "B", value: 45 },
  { name: "C", value: 20 },
];

const COLORS = ["#4ade80", "#ef4444", "#3b82f6"];

const bestSellers = [
  { name: "Yamato Nishiki Koi Food", sold: 10 },
  { name: "Yamato Nishiki Koi Food", sold: 10 },
  { name: "Yamato Nishiki Koi Food", sold: 10 },
  { name: "Yamato Nishiki Koi Food", sold: 10 },
  { name: "Yamato Nishiki Koi Food", sold: 10 },
];

const StatCard = ({ title, value, icon, color }) => (
  <Card bodyStyle={{ padding: "20px" }} style={{ background: "#fff" }}>
    <Space
      direction="horizontal"
      style={{ width: "100%", justifyContent: "space-between" }}
    >
      <div>
        <Text type="secondary">{title}</Text>
        <Title level={3} style={{ margin: "8px 0" }}>
          {value}
        </Title>
      </div>
      <div
        style={{
          backgroundColor: color,
          borderRadius: "50%",
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.2,
        }}
      >
        {React.cloneElement(icon, {
          style: { ...icon.props.style, color: color.replace("0.2", "1") },
        })}
      </div>
    </Space>
  </Card>
);

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const dispatch = useDispatch();

  // Retrieve transaction data, revenue data, total revenue data, loading, and error states
  const { transactionData, revenueData, totalRevenueData, loading, error } =
    useSelector((state) => state.transactionSlice || {});

  // Retrieve the logged-in user, shopid, and role
  const loggedInUser = useSelector((state) => state.authSlice?.user);
  const role = useSelector((state) => state.authSlice?.role);
  const currentShopId = loggedInUser?.shopId;
  const userRole = role; // "Admin" or "shop"
  const shopid = currentShopId;

  // Fetch data based on user role
  useEffect(() => {
    if (userRole === "Admin") {
      dispatch(totalRevenue());
    } else if (shopid) {
      dispatch(revenueByShop(shopid));
      dispatch(transactionByShop(shopid)); // Fetch transaction data for the Sales Details chart
    }
  }, [dispatch, shopid, userRole]);

  // Process transactionData to create chart data for non-admin users
  const processTransactionData = (transactions, year) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const chartData = months.map((month) => ({
      month,
      amount: 0,
    }));

    if (!transactions || transactions.length === 0) {
      return chartData;
    }

    transactions.forEach((transaction) => {
      const date = new Date(transaction.transactionDate);
      const transactionYear = date.getFullYear().toString();
      if (transactionYear !== year) return;

      const monthIndex = date.getMonth();
      const monthData = chartData[monthIndex];
      monthData.amount += transaction.amount || 0;
    });

    return chartData;
  };

  // Get the chart data based on user role
  const salesData =
    userRole === "Admin"
      ? allSalesData[selectedYear]
      : processTransactionData(transactionData, selectedYear);

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  // Format the totalRevenue for display (e.g., add commas and VND suffix)
  const formatCurrency = (value) => {
    if (!value) return "0 VND";
    return `${value.toLocaleString()} VND`;
  };

  // Determine which data to use based on user role for StatCards
  const dataToUse = userRole === "Admin" ? totalRevenueData : revenueData;

  return (
    <div>
      <div className="font-semibold ml-4 text-2xl">Dashboard</div>
      <div style={{ padding: 24, minHeight: "100vh", background: "#f0f2f5" }}>
        <Row gutter={[16, 16]}>
          {/* Stats Cards */}
          <Col xs={24} sm={12} md={8} lg={4}>
            <StatCard
              title="Total Member"
              value={
                !loggedInUser
                  ? "Please log in"
                  : loading
                  ? "Loading..."
                  : error
                  ? "Error"
                  : dataToUse?.packageTransactionCount || 0
              }
              icon={<UserOutlined style={{ fontSize: 24 }} />}
              color="#722ed1"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <StatCard
              title="Membership Revenue"
              value={
                !loggedInUser
                  ? "Please log in"
                  : loading
                  ? "Loading..."
                  : error
                  ? "Error"
                  : formatCurrency(dataToUse?.packageRevenue) || 0
              }
              icon={<UserOutlined style={{ fontSize: 24 }} />}
              color="#722ed1"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <StatCard
              title="Total Order"
              value={
                !loggedInUser
                  ? "Please log in"
                  : loading
                  ? "Loading..."
                  : error
                  ? "Error"
                  : dataToUse?.orderTransactionCount || 0
              }
              icon={<ShoppingCartOutlined style={{ fontSize: 24 }} />}
              color="#faad14"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <StatCard
              title="Order Revenue"
              value={
                !loggedInUser
                  ? "Please log in"
                  : loading
                  ? "Loading..."
                  : error
                  ? "Error"
                  : formatCurrency(dataToUse?.orderRevenue) || 0
              }
              icon={<ShoppingCartOutlined style={{ fontSize: 24 }} />}
              color="#faad14"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <StatCard
              title="Total Revenue"
              value={
                !loggedInUser
                  ? "Please log in"
                  : loading
                  ? "Loading..."
                  : error
                  ? "Error fetching data"
                  : formatCurrency(dataToUse?.totalRevenue)
              }
              icon={<DollarOutlined style={{ fontSize: 24 }} />}
              color="#52c41a"
            />
          </Col>

          {/* Enhanced Sales Details Chart with Year Selector */}
          <Col xs={24}>
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Sales Details</span>
                  <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                    style={{ width: 120 }}
                  >
                    <Option value="2023">2023</Option>
                    <Option value="2024">2024</Option>
                    <Option value="2025">2025</Option>
                  </Select>
                </div>
              }
              bodyStyle={{ padding: "0 0 20px 0" }}
            >
              <div style={{ height: 400, width: "100%", padding: "20px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      style={{ fontSize: "12px" }}
                      width={60}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Line
                      name="Amount"
                      type="monotone"
                      dataKey="amount"
                      stroke="#722ed1"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: "#722ed1" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card title="Total Order">
              <div
                style={{
                  height: 300,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PieChart width={250} height={250}>
                  <Pie
                    data={pieData}
                    cx={125}
                    cy={125}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card title="Total Pending">
              <div
                style={{
                  height: 300,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PieChart width={250} height={250}>
                  <Pie
                    data={pieData}
                    cx={125}
                    cy={125}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={24} lg={8}>
            <Card title="Best Sellers">
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                {bestSellers.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Space>
                      <Image
                        src="https://www.cotswoldkoi.co.uk/wp-content/uploads/2018/02/yamato-456x456.png"
                        style={{
                          width: 64,
                          height: 64,
                          background: "#f0f0f0",
                          borderRadius: 4,
                        }}
                      ></Image>
                      <Text>{item.name}</Text>
                    </Space>
                    <Text style={{ fontWeight: "bold" }} type="secondary">
                      Sold: {item.sold}
                    </Text>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
