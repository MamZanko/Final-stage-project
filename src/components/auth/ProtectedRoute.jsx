import { memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * ProtectedRoute — prevents unauthenticated users from accessing
 * protected pages, and optionally restricts by role.
 *
 * Usage:
 *   <ProtectedRoute>               → any authenticated user
 *   <ProtectedRoute roles={['admin']}>  → admin only
 *   <ProtectedRoute roles={['business','admin']}>  → business or admin
 */
const ProtectedRoute = memo(({ children, roles }) => {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(role)) {
    // User is authenticated but lacks the required role
    return <Navigate to="/" replace />;
  }

  return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
