// src/layouts/DashboardLayout.jsx
import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import AdminSidebar from "../components/shared/AdminSidebar";
import UserSidebar from "../components/shared/UserSidebar";

const DashboardLayout = () => {
  const { role, user, loading } = useContext(AuthContext);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex">
      {role === "admin" ? <AdminSidebar /> : <UserSidebar />}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;