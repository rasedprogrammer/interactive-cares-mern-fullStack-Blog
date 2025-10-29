"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyEmail as verifyEmailApi } from "@/utils/authApi";

export default function VerifyEmailPage({ params }) {
  const router = useRouter();
  const { token } = params; // token from URL
  const [message, setMessage] = useState("Verifying...");
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const data = await verifyEmailApi(token); // call API helper
        setMessage(data.message);

        // Optional: redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Verification failed.");
      }
    };

    if (token) verifyEmail();
  }, [token, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Email Verification
        </h2>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
        <p className="mt-4 text-gray-500 text-sm">
          {message && "Redirecting to login..."}
        </p>
      </div>
    </div>
  );
}
