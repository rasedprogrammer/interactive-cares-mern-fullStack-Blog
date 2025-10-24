"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to your Dashboard 🎉
        </h1>
        <p className="text-gray-600">
          This page is accessible to all logged-in users.
        </p>
      </div>
    </ProtectedRoute>
  );
}
