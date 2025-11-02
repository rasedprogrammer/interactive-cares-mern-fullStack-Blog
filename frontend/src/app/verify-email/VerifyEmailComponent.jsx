"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const VerifyEmailPageComponent = () => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  // Get email from query (from register)
  useEffect(() => {
    const emailParam = params.get("email");
    if (emailParam) setEmail(emailParam);
  }, [params]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || !email) {
      setMessage("Please provide verification code and email.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/verifyEmail`,
        { email, code }
      );

      // ------------------------
      // Save JWT to localStorage
      // ------------------------
      if (res.data?.user?.token) {
        localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      }

      setMessage(res.data.message || "Email verified successfully!");

      // Redirect to homepage (auto-login)
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Verify Your Email
        </h2>
        {message && (
          <p className="p-2 text-center text-sm text-blue-700 bg-blue-100 rounded">
            {message}
          </p>
        )}
        <form onSubmit={handleVerify} className="space-y-4 mt-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter verification code"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPageComponent;
