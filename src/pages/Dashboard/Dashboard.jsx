import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Select,
  Image,
  DatePicker,
  Button,
} from "antd";
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
  fetchOrderStatusSummary,
  fetchOrderStatusSummaryByShop,
  revenueByShop,
  totalRevenue,
  productSalesSummaryByShop,
  fetchProductSalesSummary,
} from "../../redux/slices/transactionSlice";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Static data for admins (updated to use 'amount')
const allSalesData = {
  2023: [
    { month: "Tháng 1", amount: 3500 },
    { month: "Tháng 2", amount: 4200 },
    { month: "Tháng 3", amount: 3800 },
    { month: "Tháng 4", amount: 4500 },
    { month: "Tháng 5", amount: 4100 },
    { month: "Tháng 6", amount: 3900 },
    { month: "Tháng 7", amount: 4300 },
    { month: "Tháng 8", amount: 4800 },
    { month: "Tháng 9", amount: 4400 },
    { month: "Tháng 10", amount: 4600 },
    { month: "Tháng 11", amount: 4900 },
    { month: "Tháng 12", amount: 5000 },
  ],
  2024: [
    { month: "Tháng 1", amount: 4000 },
    { month: "Tháng 2", amount: 4500 },
    { month: "Tháng 3", amount: 4200 },
    { month: "Tháng 4", amount: 4800 },
    { month: "Tháng 5", amount: 4300 },
    { month: "Tháng 6", amount: 4100 },
    { month: "Tháng 7", amount: 4600 },
    { month: "Tháng 8", amount: 5000 },
    { month: "Tháng 9", amount: 4700 },
    { month: "Tháng 10", amount: 4900 },
    { month: "Tháng 11", amount: 5200 },
    { month: "Tháng 12", amount: 5500 },
  ],
  2025: [
    { month: "Tháng 1", amount: 4500 },
    { month: "Tháng 2", amount: 4800 },
    { month: "Tháng 3", amount: 4600 },
    { month: "Tháng 4", amount: 5100 },
    { month: "Tháng 5", amount: 4500 },
    { month: "Tháng 6", amount: 4300 },
    { month: "Tháng 7", amount: 4900 },
    { month: "Tháng 8", amount: 5300 },
    { month: "Tháng 9", amount: 5000 },
    { month: "Tháng 10", amount: 5200 },
    { month: "Tháng 11", amount: 5500 },
    { month: "Tháng 12", amount: 5800 },
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
  <Card
    bodyStyle={{ padding: "20px", minHeight: "120px" }}
    style={{ background: "#fff", height: "100%" }}
  >
    <Space
      direction="horizontal"
      style={{ width: "100%", justifyContent: "space-between", height: "100%" }}
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

const CustomTooltip = ({ active, payload, label, userRole }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const { amount, foodCount, productCount, medicineCount } = data;

    return (
      <div
        style={{
          background: "#fff",
          border: "none",
          borderRadius: "4px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          padding: "8px",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>{`Tháng: ${label}`}</p>
        <p
          style={{ margin: 0, color: "#722ed1" }}
        >{`Tổng Sản Phẩm: ${amount}`}</p>
        <p style={{ margin: 0, color: "#52c41a" }}>{`Thức ăn: ${foodCount}`}</p>
        <p
          style={{ margin: 0, color: "#faad14" }}
        >{`Dụng Cụ: ${productCount}`}</p>
        <p
          style={{ margin: 0, color: "#ef4444" }}
        >{`Thuốc: ${medicineCount}`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "days"),
    dayjs(),
  ]);
  // State to manage visibility of each line
  const [lineVisibility, setLineVisibility] = useState({
    total: true, // Tổng Sản Phẩm
    food: true, // Thức ăn
    product: true, // Dụng Cụ
    medicine: true, // Thuốc
  });

  const dispatch = useDispatch();

  const {
    productSalesSummary,
    adminProductSalesSummary,
    revenueData,
    totalRevenueData,
    orderStatusSummary,
    adminOrderStatusSummary,
    loading,
    error,
    revenueError,
    salesSummaryError,
  } = useSelector((state) => state.transactionSlice || {});

  const loggedInUser = useSelector((state) => state.authSlice?.user);
  const role = useSelector((state) => state.authSlice?.role);
  const currentShopId = loggedInUser?.shopId;
  const userRole = role;
  const shopid = currentShopId;

  const fetchData = () => {
    const startDate =
      dateRange && dateRange[0] ? dateRange[0].format("MM-DD-YYYY") : undefined;
    const endDate =
      dateRange && dateRange[1] ? dateRange[1].format("MM-DD-YYYY") : undefined;

    if (userRole === "Admin") {
      dispatch(fetchOrderStatusSummary({ startDate, endDate }));
      dispatch(fetchProductSalesSummary({ startDate, endDate }));
    } else if (shopid) {
      dispatch(
        fetchOrderStatusSummaryByShop({ shopId: shopid, startDate, endDate })
      );
      dispatch(
        productSalesSummaryByShop({ shopId: shopid, startDate, endDate })
      );
    }

    if (userRole === "Admin") {
      dispatch(totalRevenue({ startDate, endDate }));
    } else if (userRole !== "Admin" && shopid) {
      dispatch(revenueByShop({ shopId: shopid, startDate, endDate }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, shopid, userRole, dateRange]);

  const handleFetchData = () => {
    fetchData();
  };

  const orderStatusPieData =
    userRole === "Admin"
      ? [
          {
            name: "Thành công",
            value: adminOrderStatusSummary?.successfulOrders || 0,
          },
          {
            name: "Thất bại",
            value: adminOrderStatusSummary?.failedOrders || 0,
          },
          {
            name: "Đang chờ",
            value: adminOrderStatusSummary?.pendingOrders || 0,
          },
        ]
      : [
          {
            name: "Thành công",
            value: orderStatusSummary?.successfulOrders || 0,
          },
          { name: "Thất bại", value: orderStatusSummary?.failedOrders || 0 },
          { name: "Đang chờ", value: orderStatusSummary?.pendingOrders || 0 },
        ];

  const processSalesSummaryData = (salesSummary, year) => {
    const months = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ];

    const chartData = months.map((month) => ({
      month,
      amount: 0,
      foodCount: 0,
      productCount: 0,
      medicineCount: 0,
    }));

    if (!salesSummary || !salesSummary.monthlySales) {
      return chartData;
    }

    salesSummary.monthlySales.forEach((sale) => {
      const saleYear = sale.year.toString();
      if (saleYear !== year) return;

      const monthIndex = sale.month - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        chartData[monthIndex] = {
          month: sale.month.toString(),
          amount: sale.totalCount || 0,
          foodCount: sale.foodCount || 0,
          productCount: sale.productCount || 0,
          medicineCount: sale.medicineCount || 0,
        };
      }
    });

    return chartData;
  };

  const salesData =
    userRole === "Admin"
      ? processSalesSummaryData(adminProductSalesSummary, selectedYear)
      : processSalesSummaryData(productSalesSummary, selectedYear);

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const formatCurrency = (value) => {
    if (!value) return "0 đ";
    return `${value.toLocaleString()} đ`;
  };

  const dataToUse = userRole === "Admin" ? totalRevenueData : revenueData;

  const colSize =
    userRole === "Admin"
      ? { xs: 24, sm: 12, md: 8, lg: 6 }
      : { xs: 24, sm: 12, md: 8, lg: 8 };

  // Function to toggle visibility of a specific line
  const toggleLineVisibility = (key) => {
    setLineVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div>
      <div className="font-semibold ml-4 text-2xl">Dashboard</div>
      <div style={{ padding: 24, minHeight: "100vh", background: "#f0f2f5" }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col>
            <Space>
              <Text>Thời Gian:</Text>
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                format="DD-MM-YYYY"
                allowClear
              />
              <Button
                type="primary"
                onClick={handleFetchData}
                disabled={loading}
              >
                {loading ? "Loading..." : "Tìm kiếm"}
              </Button>
            </Space>
          </Col>
        </Row>
        <Row
          gutter={[16, 16]}
          justify="space-between"
          style={{ marginBottom: 16 }}
        >
          {userRole === "Admin" && (
            <>
              <Col {...colSize}>
                <StatCard
                  title="Tổng Thành Viên"
                  value={
                    !loggedInUser
                      ? "Please log in"
                      : loading
                      ? "Loading..."
                      : error
                      ? `Error: ${error}`
                      : dataToUse?.packageTransactionCount || 0
                  }
                  icon={<UserOutlined style={{ fontSize: 24 }} />}
                  color="#722ed1"
                />
              </Col>
              <Col {...colSize}>
                <StatCard
                  title="Thu Nhập Gói Thành Viên"
                  value={
                    !loggedInUser
                      ? "Please log in"
                      : loading
                      ? "Loading..."
                      : error
                      ? `Error: ${error}`
                      : formatCurrency(dataToUse?.packageRevenue) || 0
                  }
                  icon={<UserOutlined style={{ fontSize: 24 }} />}
                  color="#722ed1"
                />
              </Col>
            </>
          )}
          <Col {...colSize}>
            <StatCard
              title="Tổng Đơn Hàng"
              value={
                !loggedInUser
                  ? "Please log in"
                  : loading
                  ? "Loading..."
                  : revenueError
                  ? `Error: ${revenueError}`
                  : dataToUse?.orderTransactionCount || 0
              }
              icon={<ShoppingCartOutlined style={{ fontSize: 24 }} />}
              color="#faad14"
            />
          </Col>
          <Col {...colSize}>
            <StatCard
              title="Thu Nhập Đơn Hàng"
              value={
                !loggedInUser
                  ? "Please log in"
                  : loading
                  ? "Loading..."
                  : revenueError
                  ? `Error: ${revenueError}`
                  : formatCurrency(dataToUse?.orderRevenue) || 0
              }
              icon={<ShoppingCartOutlined style={{ fontSize: 24 }} />}
              color="#faad14"
            />
          </Col>
          <Col {...colSize}>
            <StatCard
              title="Tổng Thu Nhập"
              value={
                !loggedInUser
                  ? "Please log in"
                  : loading
                  ? "Loading..."
                  : revenueError
                  ? `Error: ${revenueError}`
                  : formatCurrency(dataToUse?.totalRevenue) || 0
              }
              icon={<DollarOutlined style={{ fontSize: 24 }} />}
              color="#52c41a"
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
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
                  <span>Chi tiết bán hàng</span>
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
              {salesSummaryError ? (
                <div
                  style={{ textAlign: "center", padding: "20px", color: "red" }}
                >
                  Error fetching sales data: {salesSummaryError}
                </div>
              ) : (
                <div style={{ width: "100%", padding: "20px" }}>
                  {/* Buttons to toggle visibility */}
                  <Space style={{ marginBottom: 16 }}>
                    <Button
                      onClick={() => toggleLineVisibility("total")}
                      style={{
                        backgroundColor: lineVisibility.total
                          ? "#722ed1"
                          : "#f0f0f0",
                        color: lineVisibility.total ? "#fff" : "#000",
                        border: "none",
                      }}
                    >
                      Tổng Sản Phẩm
                    </Button>
                    <Button
                      onClick={() => toggleLineVisibility("food")}
                      style={{
                        backgroundColor: lineVisibility.food
                          ? "#52c41a"
                          : "#f0f0f0",
                        color: lineVisibility.food ? "#fff" : "#000",
                        border: "none",
                      }}
                    >
                      Thức ăn
                    </Button>
                    <Button
                      onClick={() => toggleLineVisibility("product")}
                      style={{
                        backgroundColor: lineVisibility.product
                          ? "#faad14"
                          : "#f0f0f0",
                        color: lineVisibility.product ? "#fff" : "#000",
                        border: "none",
                      }}
                    >
                      Dụng Cụ
                    </Button>
                    <Button
                      onClick={() => toggleLineVisibility("medicine")}
                      style={{
                        backgroundColor: lineVisibility.medicine
                          ? "#ef4444"
                          : "#f0f0f0",
                        color: lineVisibility.medicine ? "#fff" : "#000",
                        border: "none",
                      }}
                    >
                      Thuốc
                    </Button>
                  </Space>
                  <div style={{ height: 400, width: "100%" }}>
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
                          content={<CustomTooltip userRole={userRole} />}
                        />
                        {/* Conditionally render lines based on visibility */}
                        {lineVisibility.total && (
                          <Line
                            name="Tổng Sản Phẩm"
                            type="monotone"
                            dataKey="amount"
                            stroke="#722ed1"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: "#722ed1" }}
                          />
                        )}
                        {lineVisibility.food && (
                          <Line
                            name="Thức ăn"
                            type="monotone"
                            dataKey="foodCount"
                            stroke="#52c41a"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: "#52c41a" }}
                          />
                        )}
                        {lineVisibility.product && (
                          <Line
                            name="Dụng Cụ"
                            type="monotone"
                            dataKey="productCount"
                            stroke="#faad14"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: "#faad14" }}
                          />
                        )}
                        {lineVisibility.medicine && (
                          <Line
                            name="Thuốc"
                            type="monotone"
                            dataKey="medicineCount"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: "#ef4444" }}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card title="Tổng Đơn Hàng">
              <div
                style={{
                  height: 300,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PieChart width={275} height={275}>
                  <Pie
                    data={orderStatusPieData}
                    cx={125}
                    cy={125}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
