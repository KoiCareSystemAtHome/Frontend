import React, { useState } from "react";
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
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import "./Dashboard.css";

const { Title, Text } = Typography;

// Sample data for charts
const allSalesData = {
  2023: [
    { month: "Jan", sales: 3500, orders: 4000 },
    { month: "Feb", sales: 4200, orders: 3800 },
    { month: "Mar", sales: 3800, orders: 4200 },
    { month: "Apr", sales: 4500, orders: 3900 },
    { month: "May", sales: 4100, orders: 3600 },
    { month: "Jun", sales: 3900, orders: 4100 },
    { month: "Jul", sales: 4300, orders: 4400 },
    { month: "Aug", sales: 4800, orders: 4300 },
    { month: "Sep", sales: 4400, orders: 4500 },
    { month: "Oct", sales: 4600, orders: 4200 },
    { month: "Nov", sales: 4900, orders: 4600 },
    { month: "Dec", sales: 5000, orders: 4800 },
  ],
  2024: [
    { month: "Jan", sales: 4000, orders: 4200 },
    { month: "Feb", sales: 4500, orders: 4000 },
    { month: "Mar", sales: 4200, orders: 4400 },
    { month: "Apr", sales: 4800, orders: 4100 },
    { month: "May", sales: 4300, orders: 3800 },
    { month: "Jun", sales: 4100, orders: 4300 },
    { month: "Jul", sales: 4600, orders: 4600 },
    { month: "Aug", sales: 5000, orders: 4500 },
    { month: "Sep", sales: 4700, orders: 4700 },
    { month: "Oct", sales: 4900, orders: 4400 },
    { month: "Nov", sales: 5200, orders: 4800 },
    { month: "Dec", sales: 5500, orders: 5000 },
  ],
  2025: [
    { month: "Jan", sales: 4500, orders: 4400 },
    { month: "Feb", sales: 4800, orders: 4200 },
    { month: "Mar", sales: 4600, orders: 4600 },
    { month: "Apr", sales: 5100, orders: 4300 },
    { month: "May", sales: 4500, orders: 4000 },
    { month: "Jun", sales: 4300, orders: 4500 },
    { month: "Jul", sales: 4900, orders: 4800 },
    { month: "Aug", sales: 5300, orders: 4700 },
    { month: "Sep", sales: 5000, orders: 4900 },
    { month: "Oct", sales: 5200, orders: 4600 },
    { month: "Nov", sales: 5500, orders: 5000 },
    { month: "Dec", sales: 5800, orders: 5200 },
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

const StatCard = ({ title, value, trend, trendValue, icon, color }) => (
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
        <Space>
          {trend === "up" ? (
            <ArrowUpOutlined style={{ color: "#52c41a" }} />
          ) : (
            <ArrowDownOutlined style={{ color: "#ff4d4f" }} />
          )}
          <Text style={{ color: trend === "up" ? "#52c41a" : "#ff4d4f" }}>
            {trendValue}
          </Text>
        </Space>
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
  const [selectedYear, setSelectedYear] = useState("2024");

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  return (
    <div>
      <div className="font-semibold ml-4 text-2xl">Dashboard</div>
      <div style={{ padding: 24, minHeight: "100vh", background: "#f0f2f5" }}>
        <Row gutter={[16, 16]}>
          {/* Stats Cards */}
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Total Member"
              value="102"
              trend="up"
              trendValue="8.5% Up from yesterday"
              icon={<UserOutlined style={{ fontSize: 24 }} />}
              color="#722ed1"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Total Order"
              value="200"
              trend="up"
              trendValue="3.1% Up from past week"
              icon={<ShoppingCartOutlined style={{ fontSize: 24 }} />}
              color="#faad14"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Total Sales"
              value="2,000,000 VND"
              trend="down"
              trendValue="4.5% Down from yesterday"
              icon={<DollarOutlined style={{ fontSize: 24 }} />}
              color="#52c41a"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Total Pending"
              value="100"
              trend="up"
              trendValue="2.8% Up from yesterday"
              icon={<ClockCircleOutlined style={{ fontSize: 24 }} />}
              color="#fa541c"
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
                  <LineChart data={allSalesData[selectedYear]}>
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
                      name="Sales"
                      type="monotone"
                      dataKey="sales"
                      stroke="#722ed1"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: "#722ed1" }}
                    />
                    <Line
                      name="Orders"
                      type="monotone"
                      dataKey="orders"
                      stroke="#b37feb"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: "#b37feb" }}
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
