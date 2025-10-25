// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Eye, EyeOff } from "lucide-react";
// import { toast } from "react-toastify";
// import { api } from "@/lib/api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useAuth } from "@/hooks/useAuth";

// const formSchema = z.object({
//   email: z.string().email("Invalid email"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// export default function SignIn() {
//   const router = useRouter();
//   const { setUser } = useAuth(); // <-- get setUser
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(formSchema) });

//   const onSubmit = async (values) => {
//     try {
//       const res = await api.post("/api/user/login", values);
//       console.log(res);

//       if (!res.data.user.isVerified) {
//         toast.warning("Please verify your email before logging in!");
//         return;
//       }

//       // Update global user state immediately
//       setUser({
//         id: res.data.user._id,
//         email: res.data.user.email,
//         role: res.data.user.role,
//         firstName: res.data.user.firstName,
//         lastName: res.data.user.lastName,
//         photoUrl: res.data.user.photoUrl,
//       });

//       toast.success(`Welcome back ${res.data.user.firstName}!`);
//       router.push("/"); // redirect
//     } catch (err) {
//       const message = err.response?.data?.message || "Login failed!";
//       setError(message);
//       toast.error(message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
//         <h2 className="text-2xl font-semibold text-center mb-2">
//           Welcome Back 👋
//         </h2>
//         <p className="text-sm text-center text-gray-500 mb-6">
//           Log in to continue your journey
//         </p>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <Input {...register("email")} type="email" placeholder="you@example.com" className="mt-1" />
//             {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <div className="relative">
//               <Input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className="mt-1" />
//               <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2.5 text-gray-500">
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
//           </div>

//           {error && <p className="text-sm text-red-500 text-center">{error}</p>}

//           <Button type="submit" className="w-full">Sign In</Button>
//         </form>

//         <p className="text-sm text-center text-gray-500 mt-4">
//           Don’t have an account?{" "}
//           <Link href="/signup" className="text-blue-500 hover:underline font-medium">Sign Up</Link>
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams(); // for query params
  const { setUser } = useAuth(); 
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formSchema) });

  // Show notification if coming from reset password page
  useEffect(() => {
    if (searchParams.get("reset") === "success") {
      toast.success("Reset code sent! Check your email.");
    }
  }, [searchParams]);

  const onSubmit = async (values) => {
    try {
      const res = await api.post("/api/user/login", values);

      if (!res.data.user.isVerified) {
        toast.warning("Please verify your email before logging in!");
        return;
      }

      // Update global user state immediately
      setUser({
        id: res.data.user._id,
        email: res.data.user.email,
        role: res.data.user.role,
        firstName: res.data.user.firstName,
        lastName: res.data.user.lastName,
        photoUrl: res.data.user.photoUrl,
      });

      toast.success(`Welcome back ${res.data.user.firstName}!`);
      router.push("/"); 
    } catch (err) {
      const message = err.response?.data?.message || "Login failed!";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Log in to continue your journey
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input {...register("email")} type="email" placeholder="you@example.com" className="mt-1" />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className="mt-1" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2.5 text-gray-500">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-blue-500 text-sm hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Button type="submit" className="w-full">Sign In</Button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline font-medium">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
