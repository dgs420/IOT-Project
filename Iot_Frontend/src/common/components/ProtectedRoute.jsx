import React from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

export default function ProtectedRoute({ children }) {
  const token = useUserStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
