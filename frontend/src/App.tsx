"use client";

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Sidebar from "./components/layout/Navbar";

// Screens
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import DiscoverScreen from "./screens/DiscoverScreen";
import PoolDetailScreen from "./screens/PoolDetailScreen";
import ChatScreen from "./screens/ChatScreen";
import CreatePoolScreen from "./screens/CreatePoolScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MyPoolsScreen from "./screens/MyPoolsScreen";
import FeedScreen from "./screens/FeedScreen";
import QRScannerScreen from "./screens/QRScannerScreen";

// Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const hideSidebarRoutes = ["/", "/login", "/register"];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  const contentMargin = shouldHideSidebar
    ? "ml-0"
    : sidebarCollapsed
    ? "ml-16"
    : "ml-64";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!shouldHideSidebar && <Sidebar onToggle={setSidebarCollapsed} />}
      <div className={`flex-1 transition-all duration-300 ${contentMargin} p-4`}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/discover" element={<ProtectedRoute><DiscoverScreen /></ProtectedRoute>} />
          <Route path="/pool/:id" element={<ProtectedRoute><PoolDetailScreen /></ProtectedRoute>} />
          <Route path="/pool/:poolId/chat" element={<ProtectedRoute><ChatScreen /></ProtectedRoute>} />
          <Route path="/create-pool" element={<ProtectedRoute><CreatePoolScreen /></ProtectedRoute>} />
          <Route path="/my-pools" element={<ProtectedRoute><MyPoolsScreen /></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><FeedScreen /></ProtectedRoute>} />
          <Route path="/profile/:username" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
          <Route path="/qr-scanner" element={<ProtectedRoute><QRScannerScreen /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
