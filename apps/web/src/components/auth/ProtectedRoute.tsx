import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'admin' | 'customer';
  allowGuest?: boolean;
}

export default function ProtectedRoute({
  children,
  role,
  allowGuest = false,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Allow guest access if specified
  if (allowGuest && !isAuthenticated) {
    return <>{children}</>;
  }

  if (!isAuthenticated || !user) {
    // Save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
