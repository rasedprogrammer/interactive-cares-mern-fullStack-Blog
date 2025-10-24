"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  console.log(user);

  useEffect(() => {
    const getTokenFromCookie = () => {
      const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      return match ? match.split("=")[1] : null;
    };

    const token = getTokenFromCookie();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        console.log(setUser);
      } catch (err) {
        console.error("Invalid token", err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // ✅ Logout function: remove token + reset user
  const logoutUser = () => {
    // Remove cookie by setting expiry to past
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Lax;";
    setUser(null);
    // Optional: redirect user to signin
    window.location.href = "/signin";
  };

  return { user, logoutUser };
};
