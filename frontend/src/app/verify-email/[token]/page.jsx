// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { verifyEmailApi } from "@/utils/authApi";

// export default function VerifyEmailPage({ params }) {
//   const router = useRouter();
//   const { token } = params; // token from URL
//   const [message, setMessage] = useState("Verifying...");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const verifyEmail = async () => {
//       try {
//         const data = await verifyEmailApi(token); // call API helper
//         setMessage(data.message);

//         // Optional: redirect to login after 3 seconds
//         setTimeout(() => {
//           router.push("/login");
//         }, 3000);
//       } catch (err) {
//         setError(err.response?.data?.message || "Verification failed.");
//       }
//     };

//     if (token) verifyEmail();
//   }, [token, router]);

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">
//           Email Verification
//         </h2>
//         {message && <p className="text-green-600">{message}</p>}
//         {error && <p className="text-red-600">{error}</p>}
//         <p className="mt-4 text-gray-500 text-sm">
//           {message && "Redirecting to login..."}
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const VerifyEmailPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("Enter your verification code");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = params.get("email");
    if (emailParam) setEmail(emailParam);
  }, [params]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || !email) {
      setError("Please provide email and verification code");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/verifyEmail`,
        { email, code }
      );

      // ✅ Only save userInfo after successful verification
      if (res.data?.user?.token) {
        localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      }

      setMessage(res.data.message || "Email verified successfully!");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleVerify} className="space-y-4 mt-4">
          <input
            type="email"
            value={email}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-md"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            value={code}
            placeholder="Verification Code"
            className="w-full px-3 py-2 border rounded-md"
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-md ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <p className="mt-3 text-sm text-gray-500">
          If you didn’t receive an email, use this code:{" "}
          <span className="font-bold">234242</span>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
