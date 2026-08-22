import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./page/HomePage";
import ShopPage from "./page/ShopPage";
import MahsulodlariPage from "./page/MahsulodlariPage";
import SavatPage from "./page/SavatPage";
import AboutPage from "./page/AboutPage";
import DashboardPage from "./page/DashboardPage";
import SellerDashboard from "./page/SellerDashboard";
import RegisterPage from "./page/RegisterPage";
import UserLoginPage from "./page/LoginPage";

import { AuthProvider } from "./admin/auth/AuthContext";
import ProtectedRoute from "./admin/auth/ProtectedRoute";
import RoleRoute from "./admin/auth/RoleRoute";
import { ToastProvider } from "./admin/components/common/Toast";
import { ThemeProvider } from "./admin/components/common/ThemeContext";
import AdminLayout from "./admin/layouts/AdminLayout";
import LoginPage from "./admin/pages/Login/LoginPage";
import ForgotPasswordPage from "./admin/pages/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./admin/pages/ResetPassword/ResetPasswordPage";
import DashboardPageAdmin from "./admin/pages/Dashboard/DashboardPage";
import ProductsPage from "./admin/pages/Products/ProductsPage";
import OrdersPage from "./admin/pages/Orders/OrdersPage";
import CustomersPage from "./admin/pages/Customers/CustomersPage";
import CategoriesPage from "./admin/pages/Categories/CategoriesPage";
import AdminsPage from "./admin/pages/Admins/AdminsPage";
import SettingsPage from "./admin/pages/Settings/SettingsPage";
import ProfilePage from "./admin/pages/Profile/ProfilePage";
import ForbiddenPage from "./admin/pages/Forbidden/ForbiddenPage";

function AdminRoutes() {
  return (
    <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<RoleRoute roles={["superadmin", "admin", "manager"]}><DashboardPageAdmin /></RoleRoute>} />
      <Route path="products" element={<RoleRoute roles={["superadmin", "admin", "manager", "seller"]}><ProductsPage /></RoleRoute>} />
      <Route path="orders" element={<RoleRoute roles={["superadmin", "admin", "manager", "seller"]}><OrdersPage /></RoleRoute>} />
      <Route path="customers" element={<RoleRoute roles={["superadmin", "admin", "manager"]}><CustomersPage /></RoleRoute>} />
      <Route path="categories" element={<RoleRoute roles={["superadmin", "admin"]}><CategoriesPage /></RoleRoute>} />
      <Route path="admins" element={<RoleRoute roles={["superadmin"]}><AdminsPage /></RoleRoute>} />
      <Route path="settings" element={<RoleRoute roles={["superadmin", "admin"]}><SettingsPage /></RoleRoute>} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="403" element={<ForbiddenPage />} />
    </Route>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/mahsulodlari/:id?" element={<MahsulodlariPage />} />
              <Route path="/savat" element={<SavatPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<UserLoginPage />} />

              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/admin/reset-password/:token" element={<ResetPasswordPage />} />
              {AdminRoutes()}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
