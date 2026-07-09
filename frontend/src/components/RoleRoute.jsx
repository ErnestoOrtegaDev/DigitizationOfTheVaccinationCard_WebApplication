import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const RoleRoute = ({ allowedRoles = [] }) => {
  const user = useAuthStore((state) => state.user);
  const role = (user?.role || "citizen").toLowerCase();
  const normalizedRoles = allowedRoles.map((item) => item.toLowerCase());

  if (!normalizedRoles.length) {
    return <Outlet />;
  }

  if (normalizedRoles.includes(role)) {
    return <Outlet />;
  }

  return <Navigate to="/dashboard" replace />;
};
