// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useContext, type ReactElement } from "react";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
