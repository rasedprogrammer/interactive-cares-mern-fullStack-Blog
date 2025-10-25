"use client";

// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      <main className="flex-1 py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="max-w-2xl mx-auto text-gray-600">
          We are passionate about creating amazing web experiences. Our team
          focuses on innovation, usability, and quality to deliver solutions
          that truly matter.
        </p>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
