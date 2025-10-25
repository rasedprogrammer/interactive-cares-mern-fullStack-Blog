"use client";

import { Input } from "@/components/ui/input";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RotateCw } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

const formSchema = z
  .object({
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
});

export default function ResetPasswordPage() {
  const [error, setError] = useState();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token"); // get token from query

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    setError(undefined);

    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/reset-password`,
        {
          token,
          newPassword: values.password,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Password reset successful!");
      router.push("/signin"); // redirect to login
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Password reset failed!";
      setError(message);
      toast.error(message);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex justify-center bg-white min-h-screen py-12">
      <div className="max-w-screen-2xl w-full min-h-full flex justify-center items-center">
        <div className="mx-[25px] w-full md:mx-0 md:max-w-[668px]">
          <div className="flex flex-col gap-[12px] md:gap-[20px] justify-center items-center">
            <h2 className={`${bricolageGrotesque.className} text-[20px] font-[700] leading-[30px] text-[#282828] md:text-[30px] md:leading-[40px] xl:text-[34px] xl:leading-[44px]`}>
              Reset <span className="text-[#1DBF73]">Password</span>
            </h2>
            <p className="text-center text-[12px] font-[400] leading-[16px] text-[#555555] md:text-[18px] md:leading-[28px]">
              Enter your new password below to update your account password.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col gap-[12px] w-full mt-[40px] md:gap-[24px]">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#282828] text-[12px] md:text-[14px] xl:text-[16px]">
                        New Password <span className="text-[#FF0000]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                          className="mt-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#282828] text-[12px] md:text-[14px] xl:text-[16px]">
                        Confirm Password <span className="text-[#FF0000]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          className="mt-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {error && <FormMessage>{error}</FormMessage>}

              <div className="mt-[40px] md:mt-[60px]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${bricolageGrotesque.className} px-[20px] py-[6px] bg-[#1DBF73] rounded-[6px] flex justify-center items-center w-full`}
                >
                  <span className="text-[14px] flex items-center gap-[20px] font-[700] leading-[24px] text-[#FFFFFF] text-center md:text-[18px] md:leading-[30px]">
                    Reset Password
                    {isSubmitting && <RotateCw className="animate-spin" />}
                  </span>
                </button>
              </div>

              <div className="h-[22px] items-center flex justify-center w-full mt-[16px]">
                <p className="text-[12px] font-[400] leading-[22px] text-[#555555] text-center md:text-[14px] md:leading-[24px] xl:text-[18px] xl:leading-[28px]">
                  Remembered your password?{" "}
                  <span className="text-[#1DBF73] underline underline-offset-1">
                    <Link href={"/signin"}>Sign in</Link>
                  </span>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
