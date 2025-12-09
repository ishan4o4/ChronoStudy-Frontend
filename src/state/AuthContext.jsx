import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("chronostudy_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("chronostudy_token"));

  const persistUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("chronostudy_user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("chronostudy_user");
    }
  };

  const login = (userData, jwt) => {
    persistUser(userData);
    setToken(jwt);
    if (jwt) {
      localStorage.setItem("chronostudy_token", jwt);
    } else {
      localStorage.removeItem("chronostudy_token");
    }
  };

  const logout = () => {
    persistUser(null);
    setToken(null);
    localStorage.removeItem("chronostudy_token");
  };

  const updateUser = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem("chronostudy_user", JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    api.setToken(token); // ensures /auth/update-theme & /auth/change-password are authed
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);