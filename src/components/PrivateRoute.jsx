import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

/**
 * PrivateRoute component that protects routes requiring authentication
 * If the user is not authenticated, they will be redirected to the login page
 * If the user is authenticated but doesn't have the required role, they will be redirected to an unauthorized page
 */
const PrivateRoute = ({ requiredRoles }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const location = useLocation();

  // If auth is still loading, show nothing (or a spinner)
  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page, but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If requiredRoles is provided, check if the user has the required role
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      // User doesn't have the required role, redirect to unauthorized page
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If authenticated and authorized, render the protected component
  return <Outlet />;
};

export default PrivateRoute;

