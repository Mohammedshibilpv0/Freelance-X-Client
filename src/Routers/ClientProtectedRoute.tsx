import React from 'react';
import { Navigate } from 'react-router-dom';
import Store from '../store/store';

interface PrivateRouteProps  {
  element: React.ComponentType<any>;
  isAuthRoute?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Element, isAuthRoute = false }) => {
  const { user, isProfileComplete } = Store((state) => ({
    user: state.user,
    isProfileComplete: state.isProfileComplete,
  }));

  const isAuthenticated = () => {
    return user.email !== '';
  };

  const isProfileCompleteStatus = () => {
    return isProfileComplete()
  };

  if (isAuthenticated()) {
    if (!isProfileCompleteStatus() && window.location.pathname !== '/profile') {
      return <Navigate to="/profile?stats=completeprofile" />;
    }
    return <Element />;
  }

  if (isAuthRoute) {
    return isAuthenticated() ? <Navigate to="/" /> : <Element />;
  }

  return <Navigate to="/login" />;
};

export default PrivateRoute;
