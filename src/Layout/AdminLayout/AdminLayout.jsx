import React, { useState, useEffect } from "react";
import {
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  DollarCircleFilled,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./AdminLayout.css";
import HeaderLayout from "../../components/HeaderLayout/HeaderLayout";
import Dashboard from "../../pages/Dashboard/Dashboard";
import Membership from "../../pages/Membership/Membership";
import Member from "../../pages/Member/Member";
import Shop from "../../pages/Shop/Shop";
import CommonDiseases from "../../pages/CommonDiseases/CommonDiseases";
import CommonDiseasesDetail from "../../pages/CommonDiseases/CommonDiseasesDetail";
import dashboardIcon from "../../assets/dashboard.png";
import membershipIcon from "../../assets/membership.png";
import accountIcon from "../../assets/account.png";
import pondIcon from "../../assets/pond.png";
import diseaseIcon from "../../assets/diseases.png";
import orderIcon from "../../assets/order.png";
import reportIcon from "../../assets/report.png";
import blogIcon from "../../assets/blog.png";
import foodIcon from "../../assets/carp-fish.png";
import PondParameter from "../../pages/Parameter/Pond/PondParameter";
import FishParameter from "../../pages/Parameter/Fish/FishParameter";
import Report from "../../pages/Report/Report";
import ReportDetail from "../../pages/Report/ReportDetail";
import ChangePassword from "../../pages/ChangePassword/ChangePassword";
import UpdateProfile from "../../pages/UpdateProfile/UpdateProfile";
import ReviewBlog from "../../pages/ReviewBlog/ReviewBlog";
import ReviewBlogDetail from "../../pages/ReviewBlog/ReviewBlogDetail";
import NormFood from "../../pages/NormFood/NormFood";
import OrderManagementAdmin from "../../pages/reviewOrderAdmin/OrderManagementAdmin";
import OrderDetailAdmin from "../../pages/reviewOrderAdmin/OrderDetailAdmin";
import WithdrawAdmin from "../../pages/Withdraw/WithdrawAdmin";
import ShopDetail from "../../pages/Shop/ShopDetail";

const { Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  // Initialize collapsed state from localStorage or default to false
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem("navbarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });
  const [selectedKey, setSelectedKey] = useState(() => {
    return localStorage.getItem("selectedAdminMenuKey") || "/admin/dashboard";
  });
  const [headerTitle, setHeaderTitle] = useState(
    localStorage.getItem("adminHeaderTitle") || "Dashboard"
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
      { key: "/admin/parameter/fish", label: "Fish Parameter" },
      { key: "/admin/parameter/pond", label: "Pond Parameter" },
      { key: "/admin/feedback", label: "Feedback" },
      { key: "/admin/diseases", label: "Common Diseases" },
      { key: "/admin/diseases-detail", label: "Common Diseases Detail" },
      { key: "/admin/report", label: "Report" },
      { key: "/admin/report-detail", label: "Report Detail" },
      { key: "/admin/review-blog-detail", label: "Blog Detail" },
      { key: "/admin/norm-food", label: "Norm Food" },
    ];

    const menuItem = menuItems.find((item) => item.key === key);
    return menuItem ? menuItem.label : "Dashboard";
  };

  // useEffect(() => {
  //   // Navigate to the selected menu item on load
  //   navigate(selectedKey);
  // }, [selectedKey, navigate]);

  // useEffect(() => {
  //   if (!localStorage.getItem("selectedMenuKey")) {
  //     navigate(selectedKey);
  //   }
  // }, [selectedKey, navigate]); // Run only once when component mounts

  useEffect(() => {
    const storedKey = localStorage.getItem("selectedAdminMenuKey");
    const isFirstLogin = sessionStorage.getItem("isFirstLogin");

    if (!isFirstLogin) {
      // First login detected: reset to dashboard
      sessionStorage.setItem("isFirstLogin", "true");

      setSelectedKey("/admin/dashboard");
      setHeaderTitle("Dashboard");

      localStorage.setItem("selectedAdminMenuKey", "/admin/dashboard");
      localStorage.setItem("adminHeaderTitle", "Dashboard");

      navigate("/admin/dashboard", { replace: true });
    } else if (storedKey) {
      // Returning user: restore last selected menu item
      setSelectedKey(storedKey);
      setHeaderTitle(localStorage.getItem("adminHeaderTitle") || "Dashboard");

      navigate(storedKey, { replace: true });
    }
  }, []);

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
    setHeaderTitle(getMenuItemLabel(key));

    localStorage.setItem("selectedAdminMenuKey", key);
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
            <h2
              style={{ marginTop: "10px" }}
              className="text-white text-lg ml-12"
            >
              Admin
            </h2>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]} // Highlight the selected menu item
          className="bg-gray-800 text-white"
          onClick={handleMenuClick}
          items={[
            {
              key: "/admin/dashboard",
              label: "Bảng Điều Khiển",
              style: { color: "white" },
              className: "group", // This makes the menu item act as a parent
              icon: (
                <span>
                  <img
                    src={dashboardIcon}
                    alt="Dashboard Icon"
                    className={`w-5 transition-all duration-200 
                                    invert group-hover:invert-0 ${
                                      selectedKey === "/admin/dashboard"
                                        ? "invert-0"
                                        : ""
                                    }`}
                  />
                </span>
              ),
            },
            {
              key: "/admin/orderManagement",
              label: "Đơn Đặt Hàng",
              style: { color: "white" },
              className: "group", // Add group class to the Blog menu item
              icon: (
                <span>
                  <img
                    src={orderIcon}
                    alt="Order Icon"
                    className={`w-5 transition-all duration-200 
                                    invert group-hover:invert-0 ${
                                      selectedKey === "/admin/orderManagement"
                                        ? "invert-0"
                                        : ""
                                    }`}
                  />
                </span>
              ),
            },
            {
              key: "/admin/withdraw",
              label: "Rút Tiền",
              style: { color: "white" },
              className: "group", // Add group class to the Blog menu item
              icon: <DollarCircleFilled />,
            },
            {
              key: "/admin/membership",
              label: "Gói Thành Viên",
              style: { color: "white" },
              className: "group", // This makes the menu item act as a parent
              icon: (
                <span>
                  <img
                    src={membershipIcon}
                    alt="Membership Icon"
                    className={`w-5 transition-all duration-200 
                                    invert group-hover:invert-0 ${
                                      selectedKey === "/admin/membership"
                                        ? "invert-0"
                                        : ""
                                    }`}
                  />
                </span>
              ),
            },
            {
              key: "/admin/account",
              label: "Tài Khoản",
              className: "text-white",
              icon: (
                <span>
                  <img
                    src={accountIcon}
                    alt="Membership Icon"
                    className={`w-5 transition-all duration-200 
                                    invert group-hover:invert-0 ${
                                      selectedKey === "/admin/account"
                                        ? "invert-0"
                                        : ""
                                    }`}
                  />
                </span>
              ),
              children: [
                {
                  key: "/admin/account/member",
                  style: { color: "white" },
                  icon: <TeamOutlined style={{ color: "white" }} />,
                  label: "Thành Viên",
                },
                {
                  key: "/admin/account/shop",
                  style: { color: "white" },
                  icon: <ShopOutlined style={{ color: "white" }} />,
                  label: "Cửa Hàng",
                },
              ],
            },
            {
              key: "/admin/parameter/pond",
              label: "Thông Số Hồ",
              style: { color: "white" },
              className: "group", // This makes the menu item act as a parent
              icon: (
                <span>
                  <img
                    src={pondIcon}
                    alt="Pond Icon"
                    className={`w-5 transition-all duration-200 
                                    invert group-hover:invert-0 ${
                                      selectedKey === "/admin/parameter/pond"
                                        ? "invert-0"
                                        : ""
                                    }`}
                  />
                </span>
              ),
              // children: [
              //   {
              //     key: "/admin/parameter/fish",
              //     label: "Cá",
              //     style: { color: "white" },
              //     className: "group", // This makes the menu item act as a parent
              //     icon: (
              //       <span>
              //         <img
              //           src={fishIcon}
              //           alt="Fish Icon"
              //           className={`w-5 transition-all duration-200
              //                       invert group-hover:invert-0 ${
              //                         selectedKey === "/admin/parameter/fish"
              //                           ? "invert-0"
              //                           : ""
              //                       }`}
              //         />
              //       </span>
              //     ),
              //   },
              //   {
              //     key: "/admin/parameter/pond",
              //     label: "Hồ",
              //     style: { color: "white" },
              //     className: "group", // This makes the menu item act as a parent
              //     icon: (
              //       <span>
              //         <img
              //           src={pondIcon}
              //           alt="Pond Icon"
              //           className={`w-5 transition-all duration-200
              //                       invert group-hover:invert-0 ${
              //                         selectedKey === "/admin/parameter/pond"
              //                           ? "invert-0"
              //                           : ""
              //                       }`}
              //         />
              //       </span>
              //     ),
              //   },
              // ],
            },
            {
              key: "/admin/diseases",
              className: "group",
              label: "Bệnh Thường Gặp",
              style: { color: "white" },
              icon: (
                <span>
                  <img
                    src={diseaseIcon}
                    alt="Pond Icon"
                    className={`w-5 transition-all duration-200 
                                    invert group-hover:invert-0 ${
                                      selectedKey === "/admin/diseases"
                                        ? "invert-0"
                                        : ""
                                    }`}
                  />
                </span>
              ),
            },
            {
              key: "/admin/report",
              label: "Báo Cáo",
              style: { color: "white" },
              className: "group",
              icon: (
                <span>
                  <img
                    src={reportIcon}
                    alt="Report Icon"
                    className={`w-5 transition-all duration-200 
                                    invert group-hover:invert-0 ${
                                      selectedKey === "/admin/report"
                                        ? "invert-0"
                                        : ""
                                    }`}
                  />
                </span>
              ),
            },
            {
              key: "/admin/review-blog",
              label: "Duyệt Bài Viết",
              style: { color: "white" },
              className: "group",
              icon: (
                <span>
                  <img
                    src={blogIcon}
                    alt="Report Icon"
                    className={`w-5 transition-all duration-200 
                                    invert group-hover:invert-0 ${
                                      selectedKey === "/admin/review-blog"
                                        ? "invert-0"
                                        : ""
                                    }`}
                  />
                </span>
              ),
            },
            {
              key: "/admin/normFood",
              label: "Thức Ăn Chuẩn",
              style: { color: "white" },
              className: "group",
              icon: (
                <span>
                  <img
                    src={foodIcon}
                    alt="Report Icon"
                    className={`w-5 transition-all duration-200 
                                    invert group-hover:invert-0 ${
                                      selectedKey === "/admin/normFood"
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
        {/* Pass headerTitle and setter to Header */}
        <HeaderLayout title={headerTitle} />
        <Content
          key={selectedKey}
          className="custom-scrollbar h-[calc(100vh-64px)] overflow-y-auto bg-gray-100 p-4"
        >
          <Routes>
            {/* Add other admin routes here */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orderManagement" element={<OrderManagementAdmin />} />
            <Route
              path="order-detail/:orderId"
              element={<OrderDetailAdmin />}
            />
            <Route path="withdraw" element={<WithdrawAdmin />} />
            <Route path="membership" element={<Membership />} />
            <Route path="account/member" element={<Member />} />
            <Route path="account/shop" element={<Shop />} />
            <Route
              path="/shop-details/:shopId/:userId"
              element={<ShopDetail />}
            />
            <Route path="parameter/fish" element={<FishParameter />} />
            <Route path="parameter/pond" element={<PondParameter />} />
            <Route path="diseases" element={<CommonDiseases />} />
            <Route
              path="diseases-detail/:diseaseId"
              element={<CommonDiseasesDetail />}
            />
            <Route path="report" element={<Report />} />
            <Route path="report-detail/:reportId" element={<ReportDetail />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="update-profile" element={<UpdateProfile />} />
            <Route path="review-blog" element={<ReviewBlog />} />
            <Route
              path="review-blog-detail/:blogId"
              element={<ReviewBlogDetail />}
            />
            <Route path="normFood" element={<NormFood />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
