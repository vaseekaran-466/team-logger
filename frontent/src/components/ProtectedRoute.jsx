import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks';

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'manager' ? '/manager' : '/user'} replace />;
  }

  return <Outlet />;
}
