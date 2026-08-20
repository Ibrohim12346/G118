import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../hooks/useAuth";
import useAsync from "../hooks/useAsync";
import { getProducts } from "../services/productService";
import { getOrders } from "../services/orderService";
import { getCustomers } from "../services/customerService";
import { LoadingState } from "../components/common/Spinner";

export default function AdminLayout() {
  const { user, loading: authLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const products = useAsync(getProducts);
  const orders = useAsync(getOrders);
  const customers = useAsync(getCustomers);

  if (authLoading) {
    return (
      <div className="loading-state" style={{ minHeight: "100vh" }}>
        <LoadingState />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin-panel/login" replace />;
  }

  const counts = {
    Mahsulotlar: products.data?.length,
    Buyurtmalar: orders.data?.length,
    Mijozlar: customers.data?.length,
  };

  return (
    <div className="admin-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        counts={counts}
        onLogout={logout}
      />
      <div className="admin-main">
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} user={user} onLogout={logout} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}