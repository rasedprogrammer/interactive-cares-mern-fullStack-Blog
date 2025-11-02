// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   authRequest,
//   authSuccess,
//   authFailure,
// } from "@/redux/slices/authSlice";
// import { login } from "@/utils/authApi";
// import Link from "next/link";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { loading, error, userInfo } = useSelector((state) => state.auth);

//   // Redirect if already logged in
//   useEffect(() => {
//     if (userInfo && userInfo.isVerified) {
//       router.push("/"); // redirect to home
//     }
//   }, [userInfo, router]);

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       dispatch(authFailure("Please fill in all fields."));
//       return;
//     }

//     dispatch(authRequest());

//     try {
//       const userData = await login(email, password);

//       if (userData?.isVerified === false) {
//         // Redirect to verification page if not verified
//         router.push(
//           `/verify-email?email=${encodeURIComponent(userData.email)}`
//         );
//         dispatch(authSuccess(null)); // Do not auto-login
//       } else {
//         dispatch(authSuccess(userData)); // Save token & user
//       }
//     } catch (err) {
//       const message = err.response?.data?.message || err.message;
//       dispatch(authFailure(message));
//     }
//   };

//   // If the user is unverified, show a notice instead of blank page
//   if (userInfo?.isVerified === false) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="bg-white p-8 rounded-lg shadow-md text-center">
//           <h2 className="text-2xl font-bold mb-4 text-gray-800">
//             Email Not Verified
//           </h2>
//           <p className="text-gray-600">
//             Please verify your email first. Redirecting to verification page...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md space-y-6">
//         <h2 className="text-2xl font-bold text-center">Sign In</h2>

//         {error && (
//           <div className="p-3 text-sm text-red-700 bg-red-100 rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={submitHandler} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-3 py-2 border rounded-md"
//               placeholder="you@example.com"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-3 py-2 border rounded-md"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 px-4 text-white rounded-md ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {loading ? "Signing In..." : "Sign In"}
//           </button>
//         </form>

//         <div className="text-center text-sm">
//           Forgot Password?{" "}
//           <Link
//             href="/forgot-password"
//             className="text-blue-600 hover:text-blue-500"
//           >
//             Reset Here
//           </Link>
//         </div>

//         <div className="text-center text-sm">
//           New User?{" "}
//           <Link href="/register" className="text-blue-600 hover:text-blue-500">
//             Register Here
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  authRequest,
  authSuccess,
  authFailure,
} from "@/redux/slices/authSlice";
import { login } from "@/utils/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password)
      return dispatch(authFailure("Please fill in all fields"));

    dispatch(authRequest());
    try {
      const userData = await login(email, password);

      if (!userData.isVerified) {
        dispatch(authFailure("Please verify your email first"));
        router.push(
          `/verify-email?email=${encodeURIComponent(userData.email)}`
        );
        return;
      }

      // ✅ Save only after verified
      localStorage.setItem("userInfo", JSON.stringify(userData));
      dispatch(authSuccess(userData));
      router.push("/");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      dispatch(authFailure(msg));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center">
          New User?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-500">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
