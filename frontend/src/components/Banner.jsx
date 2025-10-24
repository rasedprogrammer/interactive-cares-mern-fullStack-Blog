"use client";
import { Button } from "./ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Banner() {
  return (
    <motion.section
      className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-32 text-center px-4"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Welcome to MyWebsite
      </h1>
      <p className="text-lg md:text-2xl mb-8">
        Join our newsletter and stay updated 🚀
      </p>
      <Link href="#subscribe">
        <Button className="bg-white text-blue-600 hover:bg-gray-100 transition">
          Subscribe Now
        </Button>
      </Link>
    </motion.section>
  );
}
