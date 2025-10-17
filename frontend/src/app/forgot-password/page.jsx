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
// import { sendResetPasswordOTP } from "@/actions/userActions/userActions";

const formSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, { message: "Email name is required" })
    .email({ message: "Invalid email" })
    .max(100, { message: "Email must be less than 100 characters" }),
});

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
});

export default function ForgetPage() {
  const [error, setError] = useState();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values) {
    setError(undefined);
    console.log(values);

    // const error = await sendResetPasswordOTP(values.email);
    // setError(error);
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex justify-center bg-white min-h-screen  py-12">
      <div className="max-w-screen-2xl w-full min-h-full flex justify-center items-center">
        <div className="mx-[25px] w-full md:mx-0 md:max-w-[668px] ">
          <div
            className={` flex flex-col gap-[12px] md:gap-[20px] justify-center items-center`}
          >
            <h2
              className={`${bricolageGrotesque.className} text-[20px] font-[700] leading-[30px] text-[#282828] md:text-[30px] md:leading-[40px] xl:text-[34px] xl:leading-[44px] `}
            >
              Email <span className="text-[#1DBF73]">Verification </span>
            </h2>
            <p className="text-center text-[12px] font-[400] leading-[16px] text-[#555555] md:text-[18px] md:leading-[28px]">
              To reset your password, you need an email that can be
              authenticated.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col gap-[12px] w-full mt-[40px] md:gap-[24px]">
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
              {error && <FormMessage>{error}</FormMessage>}
              <div className="mt-[40px] md:mt-[60px]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${bricolageGrotesque.className} px-[20px] py-[6px] bg-[#1DBF73] rounded-[6px] flex justify-center items-center w-full`}
                >
                  <span className=" text-[14px] flex items-center gap-[20px] font-[700] leading-[24px] text-[#FFFFFF] text-center md:text-[18px] md:leading-[30px]">
                    Send Reset Code
                    {isSubmitting && <RotateCw className="animate-spin" />}
                  </span>
                </button>
              </div>
              <div className="h-[22px] items-center flex justify-center w-full mt-[16px]">
                <p className="text-[12px] font-[400] leading-[22px] text-[#555555] text-center md:text-[14px] md:leading-[24px] xl:text-[18px] xl:leading-[28px] ">
                  Remembered your password?{" "}
                  <span className="text-[#1DBF73] underline underline-offset-1">
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
