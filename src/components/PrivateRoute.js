import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';  // Import Firebase Auth

const PrivateRoute = ({ element }) => {
  return auth.currentUser ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
