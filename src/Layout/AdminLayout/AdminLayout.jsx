// import React, { useState, useEffect } from "react";
// import {
//   DashboardOutlined,
//   TeamOutlined,
//   DollarCircleOutlined,
//   MessageOutlined,
//   SettingOutlined,
//   QuestionCircleOutlined,
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   ShopOutlined,
// } from "@ant-design/icons";
// import { Layout, Menu, Button } from "antd";
// import { useNavigate } from "react-router-dom";
// import "./AdminLayout.css";

// const { Sider, Content } = Layout;

// const AdminLayout = ({ children }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [selectedKey, setSelectedKey] = useState(
//     localStorage.getItem("selectedMenuKey") || "admin/dashboard"
//   );
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Navigate to the selected menu item on load
//     navigate(selectedKey);
//   }, [selectedKey, navigate]);

//   const handleMenuClick = ({ key }) => {
//     setSelectedKey(key);
//     localStorage.setItem("selectedMenuKey", key); // Persist the selected menu key
//     navigate(key);
//   };

//   return (
//     <Layout className="min-h-[100vh]">
//       <Sider
//         trigger={null}
//         collapsible
//         collapsed={collapsed}
//         width={250}
//         style={{ backgroundColor: "#4d4d4d" }}
//       >
//         <div
//           style={{
//             height: 60,
//             display: "flex",
//             alignItems: "center",
//             padding: "0 16px",
//             borderBottom: "1px solid #333",
//           }}
//         >
//           <Button
//             type="text"
//             icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//             onClick={() => setCollapsed(!collapsed)}
//             style={{
//               color: "white",
//               background: "none",
//               border: "none",
//               fontSize: "18px",
//               margin: "0 0 0 10px", // Add margin to space the button from the edge
//             }}
//           />
//           {!collapsed && (
//             <h2
//               style={{
//                 color: "white",
//                 fontSize: "18px",
//                 margin: "0 0 0 50px", // Add margin to space the text from the button
//               }}
//             >
//               Admin
//             </h2>
//           )}
//         </div>
//         <Menu
//           mode="inline"
//           selectedKeys={[selectedKey]} // Highlight the selected menu item
//           style={{ backgroundColor: "#4d4d4d", color: "white" }}
//           onClick={handleMenuClick}
//           items={[
//             {
//               key: "admin/dashboard",
//               icon: <DashboardOutlined style={{ color: "white" }} />,
//               label: "Dashboard",
//               style: { color: "Black" },
//             },
//             {
//               key: "admin/membership",
//               icon: <TeamOutlined style={{ color: "white" }} />,
//               label: "Membership",
//             },
//             {
//               key: "admin/account",
//               icon: <SettingOutlined style={{ color: "white" }} />,
//               label: "Account",
//               children: [
//                 {
//                   key: "admin/account/member",
//                   icon: <TeamOutlined style={{ color: "white" }} />,
//                   label: "Member",
//                 },
//                 {
//                   key: "admin/account/shop",
//                   icon: <ShopOutlined style={{ color: "white" }} />,
//                   label: "Shop",
//                 },
//               ],
//             },
//             {
//               key: "admin/parameter",
//               icon: <DollarCircleOutlined style={{ color: "white" }} />,
//               label: "Parameter",
//             },
//             {
//               key: "admin/feedback",
//               icon: <MessageOutlined style={{ color: "white" }} />,
//               label: "Feedback",
//             },
//             {
//               key: "admin/diseases",
//               icon: <QuestionCircleOutlined style={{ color: "white" }} />,
//               label: "Common Diseases",
//             },
//           ]}
//         />
//       </Sider>
//       <Layout>
//         <Content
//           style={{
//             padding: "24px",
//             background: "#F5F5F5",
//           }}
//         >
//           <div>{children && children}</div>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default AdminLayout;

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
  SearchOutlined,
  BellOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, Image } from "antd";
import { useNavigate } from "react-router-dom";
import "./AdminLayout.css";
import logoutIcon from "../../assets/logout.png";
import HeaderLayout from "../../components/HeaderLayout";

const { Sider, Content } = Layout;

const Icon = ({ children, color = "text-blue-400" }) => (
  <div className={`w-5 h-5 ${color} flex items-center justify-center`}>
    {children}
  </div>
);

const AdminLayout = ({ children }) => {
  // Initialize collapsed state from localStorage or default to false
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem("navbarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });
  const [isOpen, setIsOpen] = useState(false);
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
      { key: "admin/dashboard", label: "Dashboard" },
      { key: "admin/membership", label: "Membership" },
      { key: "admin/account/member", label: "Member" },
      { key: "admin/account/shop", label: "Shop" },
      { key: "admin/parameter", label: "Parameter" },
      { key: "admin/feedback", label: "Feedback" },
      { key: "admin/diseases", label: "Common Diseases" },
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

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
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
              key: "admin/dashboard",
              icon: <DashboardOutlined style={{ color: "white" }} />,
              label: "Dashboard",
            },
            {
              key: "admin/membership",
              icon: <TeamOutlined style={{ color: "white" }} />,
              label: "Membership",
            },
            {
              key: "admin/account",
              icon: <SettingOutlined style={{ color: "white" }} />,
              label: "Account",
              children: [
                {
                  key: "admin/account/member",
                  icon: <TeamOutlined style={{ color: "white" }} />,
                  label: "Member",
                },
                {
                  key: "admin/account/shop",
                  icon: <ShopOutlined style={{ color: "white" }} />,
                  label: "Shop",
                },
              ],
            },
            {
              key: "admin/parameter",
              icon: <DollarCircleOutlined style={{ color: "white" }} />,
              label: "Parameter",
            },
            {
              key: "admin/feedback",
              icon: <MessageOutlined style={{ color: "white" }} />,
              label: "Feedback",
            },
            {
              key: "admin/diseases",
              icon: <QuestionCircleOutlined style={{ color: "white" }} />,
              label: "Common Diseases",
            },
          ]}
        />
      </Sider>
      <Layout>
        {/* Pass headerTitle and setter to Header */}
        <HeaderLayout title={headerTitle} />
        <Content className="bg-gray-100 p-4">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
