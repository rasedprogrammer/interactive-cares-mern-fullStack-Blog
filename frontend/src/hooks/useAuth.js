"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // 🔹 Load user from cookie on first render
  useEffect(() => {
    try {
      const tokenFromCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      console.log(tokenFromCookie);

      if (tokenFromCookie) {
        const decoded = jwtDecode(tokenFromCookie);
        console.log(decoded);

        setUser({
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role || "user",
          firstName: decoded.firstName || "",
          lastName: decoded.lastName || "",
          photoUrl: decoded.photoUrl || "",
          isVerified: decoded.verifyEmail || false,
        });
        setToken(tokenFromCookie);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setUser(null);
      setToken(null);
    }
  }, []);

  // 🔹 Save user & token after login
  const loginUser = (userData, jwtToken) => {
    console.log("BEfore", userData);

    if (!userData?.isVerified) {
      toast.warning("Please verify your email before logging in!");
      return;
    }

    setUser(userData);
    setToken(jwtToken);

    // Store token for 1 day
    document.cookie = `token=${jwtToken}; path=/; max-age=86400; SameSite=Lax`;

    toast.success(`Welcome back, ${userData.firstName || "User"}!`);
  };

  // 🔹 Logout and clear everything
  const logoutUser = () => {
    document.cookie = "token=; path=/; max-age=0";
    setUser(null);
    setToken(null);
    toast.info("Logged out successfully!");
    window.location.href = "/signin";
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loginUser, setUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
