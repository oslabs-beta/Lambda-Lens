// filepath: /Users/dylankinsella/LambdaLens/client/src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Optional: Show a loading spinner or skeleton screen while checking auth state
    return <div>Loading...</div>;
  }

  // If not loading and no user, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the child route component
  return <Outlet />; // Renders the nested route element
};

export default ProtectedRoute;