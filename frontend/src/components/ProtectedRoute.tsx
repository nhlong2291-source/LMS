import React, { PropsWithChildren } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  allowedRoles?: string[];
};

export default function ProtectedRoute({ allowedRoles, children }: PropsWithChildren<Props>) {
  const { user } = useAuth();

  // Not signed in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If children provided, render them (used when wrapping a layout)
  if (children) return <>{children}</>;

  // Otherwise render nested route outlet (used as <Route element={<ProtectedRoute/>}>)
  return <Outlet />;
}
