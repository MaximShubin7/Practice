import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import { Loader } from "../UI/Loader";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <Loader fullPage />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
