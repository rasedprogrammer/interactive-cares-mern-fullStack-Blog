"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = useParams();
  const [error, setError] = useState();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (values) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/reset-password/${token}`, values,
          { withCredentials: true } );
          console.log(res.data);
          
      if (res.status !== 200) {
        throw new Error("Failed to reset password");
      }

      const data = res.data;
      if (!data.success) {
        setError(data.message);
        return;
      }
      alert("Password reset successful!");
      router.push("/signin");
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="password"
            placeholder="New password"
            {...register("password")}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
