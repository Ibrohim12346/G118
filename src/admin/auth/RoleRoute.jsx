import { Navigate } from "react-router-dom";

import { useAuthContext } from "./AuthContext";

export default function RoleRoute({ roles, children }) {
  const { user } = useAuthContext();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/admin/403" replace />;
  }

  return children;
}