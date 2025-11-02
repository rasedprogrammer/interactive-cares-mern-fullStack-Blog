"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  authRequest,
  authSuccess,
  authFailure,
} from "@/redux/slices/authSlice";
import { login } from "@/utils/authApi";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, userInfo } = useSelector((state) => state.auth);

  if(userInfo.isVerified === false){
    return false;
  }

  useEffect(() => {
    if (userInfo) {
      router.push("/"); // Redirect after login
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
      console.log("Befor Verify");

      if (userData?.isVerified === false) {
        console.log("After Verify");
        // Redirect to verification page if not verified
        router.push(
          `/verify-email?email=${encodeURIComponent(userData.email)}`
        );
        dispatch(authSuccess(null)); // Do not auto-login
      } else {
        dispatch(authSuccess(userData)); // Save token & user
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      dispatch(authFailure(message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="you@example.com"
              required
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
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white rounded-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm">
          Forgot Password?{" "}
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-500"
          >
            Reset Here
          </Link>
        </div>

        <div className="text-center text-sm">
          New User?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-500">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
