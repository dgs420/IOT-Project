import React from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

export default function ProtectedRoute({ children }) {
  const token = useUserStore((state) => state.token);
  const role = useUserStore((state) => state.role);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
