import React, { useState, useEffect } from "react";
import {
  DollarCircleOutlined,
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
import Blog from "../../pages/Blog/Blog";
import blogIcon from "../../assets/blog.png";
import profileIcon from "../../assets/profile-user.png";
import productIcon from "../../assets/product.png";
import orderIcon from "../../assets/order.png";
import dashboardIcon from "../../assets/dashboard.png";
import BlogDetail from "../../pages/Blog/BlogDetail";

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
      { key: "/shop/blog", label: "Blog" },
      { key: "/shop/blog-detail", label: "Blog Detail" },
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
    const storedKey = localStorage.getItem("selectedShopMenuKey");
    const isFirstLogin = sessionStorage.getItem("isFirstLogin");

    if (!isFirstLogin) {
      // First login detected: reset to dashboard
      sessionStorage.setItem("isFirstLogin", "true");

      setSelectedKey("/shop/dashboard");
      setHeaderTitle("Dashboard");

      localStorage.setItem("selectedShopMenuKey", "/shop/dashboard");
      localStorage.setItem("shopHeaderTitle", "Dashboard");

      navigate("/shop/dashboard", { replace: true });
    } else if (storedKey) {
      // Returning user: restore last selected menu item
      setSelectedKey(storedKey);
      setHeaderTitle(localStorage.getItem("shopHeaderTitle") || "Dashboard");

      navigate(storedKey, { replace: true });
    }
  }, []);

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
    setHeaderTitle(getMenuItemLabel(key));

    localStorage.setItem("selectedShopMenuKey", key);
    localStorage.setItem("headerTitle", getMenuItemLabel(key));

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
            <h2 className="mt-2 text-white text-lg absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">
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
              label: "Dashboard",
              style: { color: "white" },
              className: "group", // Add group class to the Blog menu item
              icon: (
                <span>
                  <img
                    src={dashboardIcon}
                    alt="Dashboard Icon"
                    className={`w-5 transition-all duration-200 
                                    invert group-hover:invert-0 ${
                                      selectedKey === "/shop/dashboard"
                                        ? "invert-0"
                                        : ""
                                    }`}
                  />
                </span>
              ),
            },
            {
              key: "/shop/orderManagement",
              label: "Order",
              style: { color: "white" },
              className: "group", // Add group class to the Blog menu item
              icon: (
                <span>
                  <img
                    src={orderIcon}
                    alt="Order Icon"
                    className={`w-5 transition-all duration-200 
                                    invert group-hover:invert-0 ${
                                      selectedKey === "/shop/orderManagement"
                                        ? "invert-0"
                                        : ""
                                    }`}
                  />
                </span>
              ),
            },
            {
              key: "/shop/productManagement",
              label: "Product",
              style: { color: "white" },
              className: "group", // Add group class to the Blog menu item
              icon: (
                <span>
                  <img
                    src={productIcon}
                    alt="Product Icon"
                    className={`w-5 transition-all duration-200 
                                    invert group-hover:invert-0 ${
                                      selectedKey === "/shop/productManagement"
                                        ? "invert-0"
                                        : ""
                                    }`}
                  />
                </span>
              ),
            },
            {
              key: "/shop/promotionManagement",
              icon: <DollarCircleOutlined style={{ color: "white" }} />,
              label: "Promotion",
              style: { color: "white" },
            },
            {
              key: "/shop/blog",
              label: "Blog",
              style: { color: "white" },
              className: "group", // Add group class to the Blog menu item
              icon: (
                <span>
                  <img
                    src={blogIcon}
                    alt="Blog Icon"
                    className={`w-5 transition-all duration-200 
                                    invert group-hover:invert-0 ${
                                      selectedKey === "/shop/blog"
                                        ? "invert-0"
                                        : ""
                                    }`}
                  />
                </span>
              ),
            },
            {
              key: "/shop/shopProfile",
              label: "Shop Profile",
              style: { color: "white" },
              className: "group", // Add group class to the Blog menu item
              icon: (
                <span>
                  <img
                    src={profileIcon}
                    alt="Profile Icon"
                    className={`w-5 transition-all duration-200 
                                    invert group-hover:invert-0 ${
                                      selectedKey === "/shop/shopProfile"
                                        ? "invert-0"
                                        : ""
                                    }`}
                  />
                </span>
              ),
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
            <Route path="order-detail/:orderId" element={<OrderDetail />} />
            <Route path="order-refund" element={<OrderRefund />} />
            <Route path="productManagement" element={<ProductManagement />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog-detail/:blogId" element={<BlogDetail />} />
            <Route path="shopProfile" element={<Profile />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ShopLayout;
