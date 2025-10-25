"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user } = useAuth();
  console.log("pro", user);

  const router = useRouter();

  useEffect(() => {
    // If user is not logged in, redirect to signin
    if (!user) {
      router.push("/signin");
      return;
    }

    // If this route requires admin role
    if (user.role !== "admin") {
      router.push("/dashboard"); // Redirect normal users to their dashboard
    }
    // If this route requires admin role
    if (requireAdmin && user.role === "admin") {
      router.push("/admin"); // Redirect normal users to their dashboard
    }
  }, [user, router]);

  // Show loading text while checking auth
  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Checking authentication...
      </div>
    );
  }

  return children;
}
