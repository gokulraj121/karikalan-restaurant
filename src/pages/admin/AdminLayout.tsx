
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "@/components/admin/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-darkBg text-white">
      <AdminNavbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
