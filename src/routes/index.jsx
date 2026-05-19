import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '@/pages/auth/login';
import RegisterPage from '@/pages/auth/register';
import ForgotPasswordPage from '@/pages/auth/forgot-password';
import UserLayout from '@/components/layout/UserLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import userRoutes from '@/routes/userRoutes';
import adminRoutes from '@/routes/adminRoutes';
import { USER_ROLES } from '@/utils/constants';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
          {userRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.protected ? <ProtectedRoute>{route.element}</ProtectedRoute> : route.element}
            />
          ))}
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role={USER_ROLES.ADMIN}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {adminRoutes.map((route) => (
            <Route
              key={route.path || 'index'}
              index={route.index}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;


