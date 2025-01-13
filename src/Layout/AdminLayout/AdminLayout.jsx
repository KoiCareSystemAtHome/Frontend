import React, { useState, useEffect } from "react";
import {
  DashboardOutlined,
  TeamOutlined,
  DollarCircleOutlined,
  MessageOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./AdminLayout.css";
import HeaderLayout from "../../components/HeaderLayout/HeaderLayout";
import Dashboard from "../../pages/Dashboard/Dashboard";
import Membership from "../../pages/Membership/Membership";
import Member from "../../pages/Member/Member";
import Shop from "../../pages/Shop/Shop";

const { Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  // Initialize collapsed state from localStorage or default to false
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem("navbarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });
  const [selectedKey, setSelectedKey] = useState(
    localStorage.getItem("selectedMenuKey") || "admin/dashboard"
  );
  const [headerTitle, setHeaderTitle] = useState(
    localStorage.getItem("headerTitle") || "Dashboard"
  ); // Get the header title from localStorage, or default to "Dashboard"
  const navigate = useNavigate();

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("navbarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const getMenuItemLabel = (key) => {
    const menuItems = [
      { key: "/admin/dashboard", label: "Dashboard" },
      { key: "/admin/membership", label: "Membership" },
      { key: "/admin/account/member", label: "Member" },
      { key: "/admin/account/shop", label: "Shop" },
      { key: "/admin/parameter", label: "Parameter" },
      { key: "/admin/feedback", label: "Feedback" },
      { key: "/admin/diseases", label: "Common Diseases" },
    ];

    const menuItem = menuItems.find((item) => item.key === key);
    return menuItem ? menuItem.label : "Dashboard";
  };

  useEffect(() => {
    // Navigate to the selected menu item on load
    navigate(selectedKey);
  }, [selectedKey, navigate]);

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
    localStorage.setItem("selectedMenuKey", key);

    const newTitle = getMenuItemLabel(key);
    setHeaderTitle(newTitle);
    localStorage.setItem("headerTitle", newTitle);

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
          {!collapsed && <h2 className="text-white text-lg ml-12">Admin</h2>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]} // Highlight the selected menu item
          className="bg-gray-800 text-white"
          onClick={handleMenuClick}
          items={[
            {
              key: "/admin/dashboard",
              icon: <DashboardOutlined style={{ color: "white" }} />,
              label: "Dashboard",
            },
            {
              key: "/admin/membership",
              icon: <TeamOutlined style={{ color: "white" }} />,
              label: "Membership",
            },
            {
              key: "/admin/account",
              icon: <SettingOutlined style={{ color: "white" }} />,
              label: "Account",
              children: [
                {
                  key: "/admin/account/member",
                  icon: <TeamOutlined style={{ color: "white" }} />,
                  label: "Member",
                },
                {
                  key: "/admin/account/shop",
                  icon: <ShopOutlined style={{ color: "white" }} />,
                  label: "Shop",
                },
              ],
            },
            {
              key: "/admin/parameter",
              icon: <DollarCircleOutlined style={{ color: "white" }} />,
              label: "Parameter",
            },
            {
              key: "/admin/feedback",
              icon: <MessageOutlined style={{ color: "white" }} />,
              label: "Feedback",
            },
            {
              key: "/admin/diseases",
              icon: <QuestionCircleOutlined style={{ color: "white" }} />,
              label: "Common Diseases",
            },
          ]}
        />
      </Sider>
      <Layout>
        {/* Pass headerTitle and setter to Header */}
        <HeaderLayout title={headerTitle} />
        <Content
          key={selectedKey}
          className="custom-scrollbar h-[calc(100vh-64px)] overflow-y-auto bg-gray-100 p-4"
        >
          <Routes>
            {/* Add other admin routes here */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="membership" element={<Membership />} />
            <Route path="account/member" element={<Member />} />
            <Route path="account/shop" element={<Shop />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
