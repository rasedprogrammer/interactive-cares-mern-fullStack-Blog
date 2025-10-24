"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function VerifyEmail() {
  const [message, setMessage] = useState("Verifying...");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  console.log(token);

  useEffect(() => {
    const verify = async () => {
      if (!token) return setMessage("No token found!");
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/verify?token=${token}`
        );
        setMessage(res.data.message);
        setTimeout(() => router.push("/signin"), 3000);
      } catch (err) {
        setMessage(err.response?.data?.message || "Verification failed!");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-xl font-semibold">{message}</h2>
    </div>
  );
}
