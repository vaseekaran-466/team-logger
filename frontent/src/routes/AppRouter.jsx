import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { useAppSelector } from '../hooks';

function RoleHomeRedirect() {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.role === 'manager' ? '/manager' : '/user'} replace />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<RoleHomeRedirect />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
        <Route path="/manager" element={<DashboardPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
        <Route path="/user" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
