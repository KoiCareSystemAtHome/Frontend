import React, { useState, useEffect } from "react";
import {
  DashboardOutlined,
  TeamOutlined,
  DollarCircleOutlined,
  MessageOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./ShopLayout.css";
import HeaderLayout from "../../components/HeaderLayout/HeaderLayout";
import Dashboard from "../../pages/Dashboard/Dashboard";
import OrderManagement from "../../pages/OrderManagement/OrderManagement";
import OrderDetail from "../../pages/OrderManagement/OrderDetail";
import OrderRefund from "../../pages/OrderManagement/OrderRefund";
import ProductManagement from "../../pages/ProductManagement/ProductManagement";
import Profile from "../../pages/ShopProfile/Profile";

const { Sider, Content } = Layout;

const ShopLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem("shopNavbarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });

  const [selectedKey, setSelectedKey] = useState(() => {
    return localStorage.getItem("selectedShopMenuKey") || "/shop/dashboard";
  });

  const [headerTitle, setHeaderTitle] = useState(
    localStorage.getItem("shopHeaderTitle") || "Dashboard"
  );

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("shopNavbarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const getMenuItemLabel = (key) => {
    const menuItems = [
      { key: "/shop/dashboard", label: "Dashboard" },
      { key: "/shop/orderManagement", label: "Order Management" },
      { key: "/shop/order-detail", label: "Order Detail" },
      { key: "/shop/order-refund", label: "Order Refund" },
      { key: "/shop/productManagement", label: "Product Management" },
      { key: "/shop/promotionManagement", label: "Promotion Management" },
      { key: "/shop/feedback", label: "Feedback" },
      { key: "/shop/shopProfile", label: "Shop Profile" },
    ];

    const menuItem = menuItems.find((item) => item.key === key);
    return menuItem ? menuItem.label : "Dashboard";
  };

  // useEffect(() => {
  //   navigate(selectedKey);
  // }, [selectedKey, navigate]);

  // useEffect(() => {
  //   if (!localStorage.getItem("selectedMenuKey")) {
  //     navigate(selectedKey);
  //   }
  // }, [selectedKey, navigate]); // Run only once when component mounts

  useEffect(() => {
    const storedKey = localStorage.getItem("selectedMenuKey");

    if (!storedKey) {
      setSelectedKey("/admin/dashboard");
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
    localStorage.setItem("selectedShopMenuKey", key);

    const newTitle = getMenuItemLabel(key);
    setHeaderTitle(newTitle);
    localStorage.setItem("shopHeaderTitle", newTitle);

    navigate(key);
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        className="bg-gray-800"
      >
        <div className="flex items-center h-16 px-4 border-b border-gray-700">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-white bg-transparent border-none text-lg ml-2"
          />
          {!collapsed && (
            <h2 className="text-white text-lg absolute left-1/2 transform -translate-x-1/2">
              KOI GUARDIAN
            </h2>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          className="bg-gray-800 text-white"
          onClick={handleMenuClick}
          items={[
            {
              key: "/shop/dashboard",
              icon: <DashboardOutlined style={{ color: "white" }} />,
              label: "Dashboard",
            },
            {
              key: "/shop/orderManagement",
              icon: <TeamOutlined style={{ color: "white" }} />,
              label: "Order Management",
            },
            {
              key: "/shop/productManagement",
              icon: <SettingOutlined style={{ color: "white" }} />,
              label: "Product Management",
            },
            {
              key: "/shop/promotionManagement",
              icon: <DollarCircleOutlined style={{ color: "white" }} />,
              label: "Promotion Management",
            },
            // {
            //   key: "/shop/feedback",
            //   icon: <QuestionCircleOutlined style={{ color: "white" }} />,
            //   label: "Feedback",
            // },
            {
              key: "/shop/shopProfile",
              icon: <MessageOutlined style={{ color: "white" }} />,
              label: "Shop Profile",
            },
          ]}
        />
      </Sider>
      <Layout>
        <HeaderLayout title={headerTitle} />
        <Content
          key={selectedKey}
          className="custom-scrollbar h-[calc(100vh-64px)] overflow-y-auto bg-gray-100 p-4"
        >
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="ordermanagement" element={<OrderManagement />} />
            <Route path="order-detail" element={<OrderDetail />} />
            <Route path="order-refund" element={<OrderRefund />} />
            <Route path="productManagement" element={<ProductManagement />} />
            <Route path="shopProfile" element={<Profile />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ShopLayout;
