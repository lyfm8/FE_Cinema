import { Navigate } from 'react-router-dom';
import useAuth from '@/features/auth/hooks/useAuth';

/**
 * @param {{ children: import('react').ReactNode, role?: string }} props
 */
function ProtectedRoute({ children, role }) {
  const { initialized, isAuthenticated, user } = useAuth();

  if (!initialized) {
    return (
      <div className="page-container py-10 text-sm text-stone">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

