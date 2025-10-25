"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 text-center mt-auto">
      <p>&copy; {new Date().getFullYear()} MyWebsite. All rights reserved.</p>
      <div className="flex justify-center mt-2 gap-4">
        <Link href="#" className="hover:text-blue-400 transition">
          Facebook
        </Link>
        <Link href="#" className="hover:text-blue-400 transition">
          Twitter
        </Link>
        <Link href="#" className="hover:text-blue-400 transition">
          LinkedIn
        </Link>
      </div>
    </footer>
  );
}
