import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Check if user data exists and is valid
  if (!userStr) {
    // Clear invalid token and redirect
    localStorage.removeItem('token');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  try {
    const user = JSON.parse(userStr);
    
    // Check if user has admin role
    if (!user || user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    
    // User is authenticated and has admin role
    return <>{children}</>;
    
  } catch (error) {
    // Clear corrupted data and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
};

export default AdminRoute;