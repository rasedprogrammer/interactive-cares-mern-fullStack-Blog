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
// import { resetPassword } from "@/lib/actions/user-actions";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { resetPassword } from "@/actions/userActions/userActions";

const formSchema = z
  .object({
    newPassword: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required")
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(32, "Password must be less than 32 characters")
      .refine(
        (password) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password),
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }
      ),
    confirmNewPassword: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Confirm passwords don't match",
    path: ["confirmNewPassword"],
  });

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
});

export function SetPasswordForm({ otp, email }) {
  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(values) {
    setError(undefined);
    console.log(values);

    // const error = await resetPassword({
    //   email: email,
    //   otp: otp,
    //   password: values.newPassword,
    // });
    setError(error);
  }
  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <div
        className={` flex flex-col gap-[12px] md:gap-[20px] justify-center items-center`}
      >
        <h2
          className={`${bricolageGrotesque.className} text-[20px] font-[700] leading-[30px] text-[#282828] md:text-[30px] md:leading-[40px] xl:text-[34px] xl:leading-[44px] `}
        >
          <span className="text-[#FF6600]">Create </span> a new{" "}
          <span className="text-[#FF6600]">Password </span>
        </h2>
        <p className="text-center text-[12px] font-[400] leading-[16px] text-[#555555] md:text-[18px] md:leading-[28px]">
          Present you new password and confirm this same password, then submit a
          new password
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-[12px] w-full mt-[40px] md:gap-[24px]">
            <div className="w-full flex flex-col gap-[4px] text-[#282828]">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#282828] h-[22px] items-center flex text-[12px] font-[500] leading-[22px] md:text-[14px] md:leading-[24px] xl:text-[16px] xl:leading-[26px]">
                      Enter New Password
                      <span className="text-[#FF0000]">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className=" px-[24px] py-[10px] rounded-[6px] bg-[#F5F5F5] relative ">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter New Password"
                          className="text-[#555555] text-[12px] font-[400] leading-[22px] md:text-[14px] md:leading-[24px] xl:text-[16px] xl:leading-[26px] border-none p-0 focus-visible:ring-0 shadow-none pr-[24px]"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-[24px] py-2 hover:bg-transparent"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeIcon className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <EyeOffIcon
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full flex flex-col gap-[4px] text-[#282828]">
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#282828] h-[22px] items-center flex text-[12px] font-[500] leading-[22px] md:text-[14px] md:leading-[24px] xl:text-[16px] xl:leading-[26px]">
                      Enter Confirm Password
                      <span className="text-[#FF0000]">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className=" px-[24px] py-[10px] rounded-[6px] bg-[#F5F5F5]  relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter Confirm Password"
                          className="text-[#555555] text-[12px] font-[400] leading-[22px] md:text-[14px] md:leading-[24px] xl:text-[16px] xl:leading-[26px] border-none p-0 focus-visible:ring-0 shadow-none pr-[24px]"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-[24px] py-2 hover:bg-transparent"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeIcon className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <EyeOffIcon
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {error && <FormMessage>{error}</FormMessage>}
          <div className="mt-[40px] md:mt-[60px]">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${bricolageGrotesque.className} px-[20px] py-[6px] bg-[#FF6600] rounded-[6px] flex justify-center items-center w-full`}
            >
              <span className="flex items-center gap-[20px] text-[14px] font-[700] leading-[24px] text-[#FFFFFF] text-center md:text-[18px] md:leading-[30px]">
                Confirm & Submit{" "}
                {isSubmitting && <RotateCw className="animate-spin" />}
              </span>
            </button>
          </div>
          <div className="h-[22px] items-center flex justify-center w-full mt-[16px]">
            <p className="text-[12px] font-[400] leading-[22px] text-[#555555] text-center md:text-[14px] md:leading-[24px] xl:text-[18px] xl:leading-[28px] ">
              Remembered your password?{" "}
              <span className="text-[#FF6600] underline underline-offset-1">
                <Link href={"/singin"}>Sign in</Link>
              </span>
            </p>
          </div>
        </form>
      </Form>
    </>
  );
}
