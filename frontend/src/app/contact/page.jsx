"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="mb-2 text-gray-600">Email: contact@mywebsite.com</p>
        <p className="mb-2 text-gray-600">Phone: +880 123 456 789</p>
        <p className="mb-2 text-gray-600">Address: Dhaka, Bangladesh</p>
      </main>
      <Footer />
    </div>
  );
}
