"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Read cookie once on mount
  useEffect(() => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (token) {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role || "user",
          firstName: decoded.firstName || "",
          lastName: decoded.lastName || "",
          photoUrl: decoded.photoUrl || "",
        });
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const logoutUser = () => {
    document.cookie = "token=; path=/; max-age=0";
    setUser(null);
    window.location.href = "/signin";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
