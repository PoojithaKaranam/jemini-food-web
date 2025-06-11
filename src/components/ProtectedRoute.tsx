
import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from '../pages/admin/AdminLogin';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('admin' | 'chef')[];
}

const ProtectedRoute = ({ children, allowedRoles = ['admin', 'chef'] }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();

  console.log('ProtectedRoute - User:', user ? user.email : 'No user');
  console.log('ProtectedRoute - UserRole:', userRole);
  console.log('ProtectedRoute - Loading:', loading);
  console.log('ProtectedRoute - AllowedRoles:', allowedRoles);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user - showing login');
    return <AdminLogin />;
  }

  if (!userRole) {
    console.log('No user role - showing login');
    return <AdminLogin />;
  }

  if (!allowedRoles.includes(userRole.role)) {
    console.log('User role not allowed - showing login');
    return <AdminLogin />;
  }

  console.log('Access granted - showing children');
  return <>{children}</>;
};

export default ProtectedRoute;
