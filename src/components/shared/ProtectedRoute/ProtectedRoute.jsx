import { Navigate } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";

/**
 * @param {{
 *  children: import('react').ReactNode,
 *  role?: string,
 *  roles?: string[]
 * }} props
 */
function ProtectedRoute({ children, role, roles = [] }) {
  const { initialized, isAuthenticated, user } = useAuth();

  if (!initialized) {
    return (
      <div className="page-container py-10 text-sm text-stone">Loading...</div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles =
    Array.isArray(roles) && roles.length > 0 ? roles : role ? [role] : [];

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log("ProtectedRoute redirecting to /. allowedRoles:", allowedRoles, "user.role:", user?.role);
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
