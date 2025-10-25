"use client";

// import ProtectedRoute from "@/components/ProtectedRoute";

// export default function DashboardPage() {
//   return (
//     <ProtectedRoute>
//       <div className="p-8">
//         <h1 className="text-3xl font-bold mb-2">
//           Welcome to your Dashboard 🎉
//         </h1>
//         <p className="text-gray-600">
//           This page is accessible to all logged-in users.
//         </p>
//       </div>
//     </ProtectedRoute>
//   );
// }

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
