"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/subscribe", { email });
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch {
      toast.error("Subscription failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      id="subscribe"
      className="py-20 bg-gray-50 text-center px-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-3xl font-semibold mb-4">
        Subscribe to our Newsletter
      </h2>
      <p className="mb-6 text-gray-600">
        Get updates about our latest projects and offers.
      </p>
      <form
        onSubmit={handleSubscribe}
        className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-lg mx-auto"
      >
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </motion.section>
  );
}
