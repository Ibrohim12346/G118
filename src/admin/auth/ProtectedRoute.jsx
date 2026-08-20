import { Navigate, useLocation } from "react-router-dom";

import { useAuthContext } from "./AuthContext";
import LoadingScreen from "../components/common/LoadingScreen";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen label="Tekshirilmoqda..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}