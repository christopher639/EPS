import React from "react";
import { Navigate } from "react-router-dom";

const AuthWrapper = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthWrapper;