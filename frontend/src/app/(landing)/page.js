"use client";

// import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import Subscribe from "@/components/Subscribe";
// import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Banner />
      <Subscribe />
    </div>
  );
}
