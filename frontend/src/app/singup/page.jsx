"use client";

import { Input } from "@/components/ui/input";
import { Bricolage_Grotesque } from "next/font/google";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

// import { register } from "@/lib/actions/user-actions";
import { EyeIcon, EyeOffIcon, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { register } from "@/actions/userActions/userActions";

const formSchema = z
  .object({
    firstName: z
      .string({ required_error: "First name is required" })
      .trim()
      .min(1, { message: "First name is required" })
      .max(100, { message: "First must be less than 100 characters" }),
    lastName: z
      .string({ required_error: "Last name is required" })
      .trim()
      .min(1, { message: "Last name is required" })
      .max(100, { message: "Last must be less than 100 characters" }),
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .min(1, { message: "Email name is required" })
      .email({ message: "Invalid email" })
      .max(100, { message: "Email must be less than 100 characters" }),
    password: z
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
    confirmPassword: z.string({
      required_error: "Confirm password is required",
    }),
    agree: z.coerce
      .boolean({
        required_error:
          "You must agree the terms of service and privacy policy",
      })
      .refine((val) => val === true, {
        message: "You must agree the terms of service and privacy policy",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm passwords don't match",
    path: ["confirmPassword"],
  });

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
});

export default function SingUp() {
  const [message, setMessage] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
  });

  async function onSubmit(values) {
    console.log(values);

    try {
      const res = await fetch("http://localhost:8000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      setMessage(data.message || "Signup successful!");

      form.reset();
    } catch (err) {
      console.error(err);
      setMessage("Signup failed!");
    }
  }
  const isSubmitting = form.formState.isSubmitting;
  return (
    <div className="flex justify-center bg-white min-h-screen  py-12">
      <div className="max-w-screen-2xl w-full min-h-full flex justify-center items-center">
        <div className="mx-[25px] md:mx-0 md:max-w-[668px] ">
          <div
            className={` flex flex-col gap-[12px] md:gap-[20px] justify-center items-center`}
          >
            <h2
              className={`${bricolageGrotesque.className} text-[20px] font-[700] leading-[30px] text-[#282828] md:text-[30px] md:leading-[40px] xl:text-[34px] xl:leading-[44px] `}
            >
              <span className="text-[#1DBF73]">Create</span> your account
            </h2>
            <p className="text-center text-[12px] font-[400] leading-[16px] text-[#555555] md:text-[18px] md:leading-[28px]">
              Join us and start your journey towards smarter business solutions.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col gap-[24px] mt-[40px] md:gap-[24px] ">
                <div className="flex flex-col gap-[12px] w-full md:flex-row md:gap-[24px]">
                  <div className="w-full flex flex-col gap-[4px] text-[#282828]">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#282828] h-[22px] items-center flex text-[12px] font-[500] leading-[22px] md:text-[14px] md:leading-[24px] xl:text-[16px] xl:leading-[26px]">
                            Enter your First Name
                            <span className="text-[#FF0000]">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className=" px-[24px] py-[10px] rounded-[6px] bg-[#F5F5F5]  ">
                              <Input
                                type="text"
                                placeholder="Enter First Name"
                                className="text-[#555555] text-[12px] font-[400] leading-[22px] md:text-[14px] md:leading-[24px] xl:text-[16px] xl:leading-[26px] border-none p-0 focus-visible:ring-0 shadow-none"
                                {...field}
                              />
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
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#282828] h-[22px] items-center flex text-[12px] font-[500] leading-[22px] md:text-[14px] md:leading-[24px] xl:text-[16px] xl:leading-[26px]">
                            Enter your Last Name
                            <span className="text-[#FF0000]">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className=" px-[24px] py-[10px] rounded-[6px] bg-[#F5F5F5]  ">
                              <Input
                                type="text"
                                placeholder="Enter Last Name"
                                className="text-[#555555] text-[12px] font-[400] leading-[22px] md:text-[14px] md:leading-[24px] xl:text-[16px] xl:leading-[26px] border-none p-0 focus-visible:ring-0 shadow-none"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div>
                  <div className="w-full flex flex-col gap-[4px] text-[#282828]">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#282828] h-[22px] items-center flex text-[12px] font-[500] leading-[22px] md:text-[14px] md:leading-[24px] xl:text-[16px] xl:leading-[26px]">
                            Enter your Email
                            <span className="text-[#FF0000]">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className=" px-[24px] py-[10px] rounded-[6px] bg-[#F5F5F5]  ">
                              <Input
                                type="Email"
                                placeholder="Enter Email"
                                className="text-[#555555] text-[12px] font-[400] leading-[22px] md:text-[14px] md:leading-[24px] xl:text-[16px] xl:leading-[26px] border-none p-0 focus-visible:ring-0 shadow-none"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[12px] w-full md:flex-row md:gap-[24px]">
                  <div className="w-full flex flex-col gap-[4px] text-[#282828]">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#282828] h-[22px] items-center flex text-[12px] font-[500] leading-[22px] md:text-[14px] md:leading-[24px] xl:text-[16px] xl:leading-[26px]">
                            Enter your Password
                            <span className="text-[#FF0000]">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className=" px-[24px] py-[10px] rounded-[6px] bg-[#F5F5F5] relative ">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                className="text-[#555555] text-[12px] font-[400] leading-[22px] md:text-[14px] md:leading-[24px] xl:text-[16px] xl:leading-[26px] border-none p-0 focus-visible:ring-0 shadow-none pr-[24px]"
                                autoComplete="new-password"
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
                                  <EyeIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <EyeOffIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                )}
                                <span className="sr-only">
                                  {showPassword
                                    ? "Hide password"
                                    : "Show password"}
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
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#282828] h-[22px] items-center flex text-[12px] font-[500] leading-[22px] md:text-[14px] md:leading-[24px] xl:text-[16px] xl:leading-[26px]">
                            Confirm Password
                            <span className="text-[#FF0000]">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className=" px-[24px] py-[10px] rounded-[6px] bg-[#F5F5F5] relative ">
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
                                  <EyeIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <EyeOffIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                )}
                                <span className="sr-only">
                                  {showPassword
                                    ? "Hide password"
                                    : "Show password"}
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
              </div>

              <FormField
                control={form.control}
                name="agree"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-[12px] mt-[16px] md:mt-[24px]">
                      <FormControl>
                        <Checkbox
                          id="terms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-[20px] w-[20px]  data-[state=checked]:bg-[#FF6600] data-[state=checked]:border-[#FF6600]"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="terms"
                        className="  peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[12px] font-[400] leading-[22px] text-[#555555] h-[22px] items-center flex md:text-[14px] md:leading-[24px] xl:text-[16px] xl:leading-[26px]"
                      >
                        I agree to the Terms of Service and Privacy Policy
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {message && <FormMessage>{message}</FormMessage>}
              <div className="mt-[40px] md:mt-[60px]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${bricolageGrotesque.className} px-[20px] py-[6px] bg-[#1DBF73] rounded-[6px] flex justify-center items-center w-full`}
                >
                  <span className=" flex items-center gap-[20px] text-[14px] font-[700] leading-[24px] text-[#FFFFFF] text-center md:text-[18px] md:leading-[30px]">
                    Sign up{" "}
                    {isSubmitting && <RotateCw className="animate-spin" />}
                  </span>
                </button>
              </div>
              <div className="h-[22px] items-center flex justify-center w-full mt-[16px]">
                <p className="text-[12px] font-[400] leading-[22px] text-[#555555] text-center md:text-[14px] md:leading-[24px] xl:text-[18px] xl:leading-[28px] ">
                  Already have an account?{" "}
                  <span className="text-[#FF6600] underline underline-offset-1">
                    <Link href={"/singin"}>Sign in</Link>
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
