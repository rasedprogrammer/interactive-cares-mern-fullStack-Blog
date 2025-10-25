"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashboardPage() {
  const { user, logoutUser } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.charAt(0)?.toUpperCase() || "";
    const last = user.lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "U";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Blogs", href: "/my-blogs" },
    { name: "Write A Blog", href: "/create-blog" },
    { name: "My Comments", href: "/my-comments" },
    { name: "My Likes & Dislikes", href: "/my-likes" },
    { name: "Home Likes", href: "/home-likes" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`bg-white w-64 p-6 shadow-md transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-64"
          } md:translate-x-0`}
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-8">Dashboard</h2>
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 py-1 rounded ${
                  pathname === link.href ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <header className="flex justify-between items-center bg-white p-4 shadow-md">
            <button
              className="md:hidden text-gray-700"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

            {/* Right top profile */}
            <div className="relative ml-auto" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full font-bold text-blue-600 hover:bg-gray-300 overflow-hidden"
              >
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials()}</span>
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="font-semibold">{user?.firstName || "User"}</p>
                    <p className="text-gray-500 text-xs capitalize">{user?.role || "user"}</p>
                  </div>
                  <Link
                    href="/profile/update"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Update Profile
                  </Link>
                  <button
                    onClick={() => {
                      logoutUser();
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome to your Dashboard 🎉
            </h1>
            <p className="text-gray-600">
              This page is accessible to all logged-in users.
            </p>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
