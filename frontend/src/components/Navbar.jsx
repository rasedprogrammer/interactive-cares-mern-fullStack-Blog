"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  // Get user's first letter (for avatar fallback)
  const firstLetter =
    user?.name?.charAt(0).toUpperCase() ||
    user?.firstName?.charAt(0)?.toUpperCase();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          MyWebsite
        </Link>

        {/* Nav links */}
        <div className="space-x-6 font-medium hidden md:flex items-center">
          <Link href="/" className="hover:text-blue-500 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-500 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-500 transition">
            Contact
          </Link>

          {/* If not logged in */}
          {!user && (
            <Link
              href="/signin"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Login
            </Link>
          )}

          {/* If logged in */}
          {user && (
            <>
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-full font-bold text-blue-600 hover:bg-gray-200"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <span>{firstLetter || "U"}</span>
                  )}
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-3 w-44 bg-white border rounded-md shadow-lg"
                    onMouseLeave={closeDropdown}
                  >
                    <Link
                      href="/create-blog"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Write Blog
                    </Link>

                    {/* Admin Link (only visible if role === 'admin') */}
                    {user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile/update"
                      onClick={closeDropdown}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile Update
                    </Link>

                    {user?.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={closeDropdown}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logoutUser();
                        closeDropdown();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
