import {
  BellOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import logoutIcon from "../../assets/logout.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../../redux/slices/authSlice";

const Icon = ({ children, color = "text-blue-400" }) => (
  <div className={`w-5 h-5 ${color} flex items-center justify-center`}>
    {children}
  </div>
);

const HeaderLayout = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.authSlice?.user);
  const role = useSelector((state) => state.authSlice?.role);

  console.log("User from Redux:", user);
  console.log("Role from Redux:", role);

  // const handleLogout = () => {
  //   dispatch(logout());
  //   navigate("/"); // Redirect to login page after logout
  // };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("selectedAdminMenuKey"); // Clear menu selection
    localStorage.removeItem("selectedShopMenuKey"); // Clear menu selection
    localStorage.removeItem("navbarCollapsed"); // Clear navbar collapsed state
    localStorage.removeItem("shopHeaderTitle");
    localStorage.removeItem("adminHeaderTitle");
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* <h1 className="text-lg font-medium">{title}</h1> */}
        {/* Display the header title */}
      </div>

      {/* Middle section - Search */}
      {/* <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchOutlined className="absolute left-3 top-1.5 h-5 w-5 text-gray-400" />
        </div>
      </div> */}

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <BellOutlined className="h-5 w-5 text-gray-500" />
          </button>
          <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            2
          </span>
        </div>
        <div className="relative">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <img
              src={logoutIcon}
              alt=""
              className="h-5 w-5 text-gray-500"
              onClick={handleLogout}
            />
          </button>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRp5R2sG1ItQOjF1dQE9ezo7s1GAQnZ674Da7Sf2N47DtlP4zJNdFN_rngXs0xVl6jcbNdC0gqVxRcmlYs"
              className="w-10 h-10 rounded-full object-cover"
              alt="profile"
            />
            <div className="text-left">
              <div className="text-gray-900 font-medium">{user?.name}</div>
              <div className="text-gray-500 text-sm">{role}</div>
            </div>
            <svg
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-1 z-50">
              <button className="w-full px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                <Icon>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Icon>
                Manage Account
              </button>

              <button className="w-full px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                <Icon color="text-pink-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </Icon>
                Change Password
              </button>

              <button className="w-full px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                <Icon color="text-purple-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </Icon>
                Activity Log
              </button>

              <div className="border-t my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-3"
              >
                <Icon color="text-red-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </Icon>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderLayout;
