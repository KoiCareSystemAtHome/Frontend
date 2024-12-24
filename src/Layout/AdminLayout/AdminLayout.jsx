import React, { useState } from "react";
import {
  BookOutlined,
  DashboardOutlined,
  FacebookOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageTwoTone,
  MoneyCollectOutlined,
  SettingOutlined,
  UserOutlined,
  HomeOutlined,
  LogoutOutlined,
  EnvironmentOutlined,
  ReconciliationOutlined,
  TeamOutlined,
  DollarCircleOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Avatar } from "antd";
import "./AdminLayout.css";
import { useNavigate } from "react-router";
const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  
  const handleMenuClick = ({ key }) => {
    navigate(key);
  };



  return (
    <Layout className="min-h-[100vh]">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={0}
        width={250}
        style={{ backgroundColor: "#4d4d4d" }}
      >
        <div
          // className="demo-logo-vertical"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottom: "1px solid #4d4d4d",
            width:"250"
          }}
        >
          {/* <img className="w-[50%]" src={Logo} alt="" /> */}
        </div>
        <div className="flex flex-col">
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{ backgroundColor: "#4d4d4d", colo:"white" }}
            onClick={handleMenuClick}
            items={[
              {
                key: "admin/dashboard",
                icon: <DashboardOutlined style={{color:"white"}} />,
                label: "Dashboard",
              },
              {
                key: "admin/user",
                icon: <TeamOutlined style={{color:"white"}}/>,
                label: "Người Dùng",
              },
              {
                key: "admin/payment",
                icon: <DollarCircleOutlined style={{color:"white"}}/>,
                label: "Thanh Toán",
              },
              {
                key: "admin/review-management",
                icon: <MessageOutlined style={{color:"white"}}/>,
                label: "Reviews",
              },
              {
                key: "admin/message",
                icon: <MessageOutlined style={{color:"white"}}/>,
                label: "Nhắn Tin",
              },
              {
                key: "admin/help",
                icon: <QuestionCircleOutlined style={{color:"white"}}/>,
                label: "Hỗ Trợ",
              },
              {
                key: "admin/setting",
                icon: <SettingOutlined style={{color:"white"}}/>,
                label: "Cài Đặt",
              },
            ]}
          />

        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#F5F5F5",
            color: "gray",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              color: "gray",
            }}
          />
         
        </Header>
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            // height: "100vh",
            padding: "0px 24px",
            background: "#F5F5F5",
          }}
        >
          <div style={{ width: "1270px" }}>{children && children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
