"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  authRequest,
  authSuccess,
  authFailure,
} from "@/redux/slices/authSlice";
import { login, resendVerificationEmail } from "@/utils/authApi";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [unverifiedMsg, setUnverifiedMsg] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo?.isVerified) {
      router.push("/"); // Redirect verified users
    }
  }, [userInfo, router]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      dispatch(authFailure("Please fill in all fields."));
      return;
    }

    dispatch(authRequest());

    try {
      const userData = await login(email, password);

      if (userData?.isVerified === false) {
        setUnverifiedMsg(
          "Your email is not verified. Please verify or resend email."
        );
        dispatch(authSuccess(null));
      } else {
        dispatch(authSuccess(userData));
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      dispatch(authFailure(errorMessage));
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendVerificationEmail(email);
      setUnverifiedMsg("Verification email resent! Check your inbox.");
    } catch (err) {
      setUnverifiedMsg(
        err.response?.data?.message || "Failed to resend verification email."
      );
    }
    setResendLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}
        {unverifiedMsg && (
          <div className="p-3 text-sm text-yellow-800 bg-yellow-100 rounded flex flex-col gap-2">
            {unverifiedMsg}
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className={`mt-2 py-1 px-3 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 ${
                resendLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {resendLoading ? "Resending..." : "Resend Verification Email"}
            </button>
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-sm text-center">
          New User?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
