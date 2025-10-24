"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Admin Dashboard 🛠️
        </h1>
        <p className="text-gray-700">Only admin users can view this page.</p>
      </div>
    </ProtectedRoute>
  );
}
