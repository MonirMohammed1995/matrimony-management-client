import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import AdminSidebar from "../pages/Dashboard/Admin/AdminSidebar";
import UserSidebar from "../pages/Dashboard/User/UserSidebar";

const DashboardLayout = () => {
  const { role, loading } = useContext(AuthContext);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      {role === "admin" ? <AdminSidebar /> : <UserSidebar />}

      {/* Main content */}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
