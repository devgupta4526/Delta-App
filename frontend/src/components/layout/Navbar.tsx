"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaCompass,
  FaSwimmer,
  FaNewspaper,
  FaPlusCircle,
  FaUserCircle,
  FaQrcode,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";

interface SidebarProps {
  onToggle: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleToggle = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onToggle(newState);
  };

  const menuItems = isAuthenticated
    ? [
        { icon: <FaCompass />, label: "Discover", link: "/discover" },
        { icon: <FaSwimmer />, label: "My Pools", link: "/my-pools" },
        { icon: <FaNewspaper />, label: "Feed", link: "/feed" },
        { icon: <FaPlusCircle />, label: "Create Pool", link: "/create-pool" },
        { icon: <FaUserCircle />, label: "Profile", link: `/profile/${user?.username}` },
        { icon: <FaQrcode />, label: "QR Scanner", link: "/qr-scanner" },
        { icon: <FaSignOutAlt />, label: "Logout", action: handleLogout },
      ]
    : [
        { icon: <FaSignInAlt />, label: "Login", link: "/login" },
        { icon: <FaUserPlus />, label: "Sign Up", link: "/register" },
      ];

  return (
    <div
      className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 bg-gradient-to-b from-indigo-700 to-purple-800 shadow-lg
      ${collapsed ? "w-16" : "w-64"} flex flex-col`}
    >
      {/* Toggle Button */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer text-white"
        onClick={handleToggle}
      >
        <span className="text-xl">{collapsed ? <FaBars /> : <FaTimes />}</span>
        {!collapsed && <span className="ml-2 font-bold">Menu</span>}
      </div>

      {/* Menu Items */}
      <nav className="mt-4 flex flex-col space-y-1">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center p-4 text-white hover:bg-purple-700 cursor-pointer transition-colors duration-200"
            onClick={() => {
              if (item.link) navigate(item.link);
              else if (item.action) item.action();
            }}
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span className="ml-4">{item.label}</span>}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
