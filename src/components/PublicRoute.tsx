import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: ReactElement }) => {
  const token = localStorage.getItem("token");

  // If logged in, redirect to home
  return token ? <Navigate to="/" /> : children;
};

export default PublicRoute;
