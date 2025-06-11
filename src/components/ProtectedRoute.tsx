
import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from '../pages/admin/AdminLogin';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('admin' | 'chef')[];
}

const ProtectedRoute = ({ children, allowedRoles = ['admin', 'chef'] }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user || !userRole || !allowedRoles.includes(userRole.role)) {
    return <AdminLogin />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
