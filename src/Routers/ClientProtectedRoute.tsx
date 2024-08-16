
import React from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import Store from '../store/store';

interface PrivateRouteProps extends RouteProps {
  element: React.ComponentType<any>;
  isAuthRoute?: boolean; 
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Element, isAuthRoute = false}) => {

  const user=Store((config)=>config.user)
  const isAuthenticated = () => {
    return user.email!==''
  };

  if (isAuthRoute) {

    return isAuthenticated() ? <Navigate to="/" /> : <Element />;
  }

  
  return isAuthenticated() ? <Element /> : <Navigate to="/login" />;
};

export default PrivateRoute;

