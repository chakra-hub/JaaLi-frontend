// src/context/AuthContext.tsx
import { createContext, useState, type ReactNode } from "react";

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null, isAdmin?: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  setToken: () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(
    localStorage.getItem("isAdmin") ? true : false
  );

  const setToken = (newToken: string | null, isAdminFlag?: boolean) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("isAdmin", JSON.stringify(isAdminFlag || false));
      setIsAdmin(isAdminFlag || false);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      setIsAdmin(false);
    }
    setTokenState(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, setToken, logout, isAuthenticated, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
