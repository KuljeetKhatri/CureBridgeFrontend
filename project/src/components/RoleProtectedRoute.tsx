// src/components/RoleProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RoleProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { currentUser } = useAuth();

  // Check if the user is authenticated and has the required role
  const userRole = currentUser?.role; // Adjust based on your AuthContext structure
  const isAuthorized = currentUser && userRole && allowedRoles.includes(userRole);

  if (!isAuthorized) {
    // Redirect to login or unauthorized page
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;