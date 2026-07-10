import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const AdminRoute = () => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-state">Verifying admin authorization...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;