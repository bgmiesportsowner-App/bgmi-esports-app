// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, redirectPath = "/login" }) => {
  // Same key jo login/register + navbar use kar rahe hain
  const user = localStorage.getItem("bgmi_user");

  if (!user) {
    // replace = true se history me /login push nahi hota, current entry replace hoti hai
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
