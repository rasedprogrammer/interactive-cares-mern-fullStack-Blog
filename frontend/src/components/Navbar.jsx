"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  // Close dropdown on outside click
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

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          MyWebsite
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 font-medium items-center">
          <Link href="/" className="hover:text-blue-500 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-500 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-500 transition">
            Contact
          </Link>

          {!user ? (
            <Link
              href="/signin"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Login
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Button */}
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-full font-bold text-blue-600 hover:bg-gray-200 overflow-hidden"
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

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border rounded-md shadow-lg animate-fadeIn">
                  <div className="px-4 py-3 border-b">
                    <p className="font-semibold">{user?.firstName || "User"}</p>
                    <p className="text-gray-500 text-xs capitalize">
                      {user?.role || "user"}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdown}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/create-blog"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdown}
                  >
                    Write Blog
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={closeDropdown}
                    >
                      Admin Panel
                    </Link>
                  )}

                  <Link
                    href="/profile/update"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdown}
                  >
                    Profile Update
                  </Link>

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
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none text-gray-700"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col space-y-3 px-6 py-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>

            {!user ? (
              <Link
                href="/signin"
                onClick={() => setIsMenuOpen(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-center hover:bg-blue-600 transition"
              >
                Login
              </Link>
            ) : (
              <>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/create-blog" onClick={() => setIsMenuOpen(false)}>
                  Write Blog
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <Link href="/profile/update" onClick={() => setIsMenuOpen(false)}>
                  Profile Update
                </Link>
                <button
                  onClick={() => {
                    logoutUser();
                    setIsMenuOpen(false);
                  }}
                  className="text-red-500 text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
