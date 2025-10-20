"use client";

import Link from "next/link";
import Image from "next/image";
import EmailFast from "@/static/icon/email-fast.svg";
import MdPassword from "@/static/icon/mdi-password.svg";
// import EyeHide from "@/static/icon/fluent-eye-hide.svg";
import GoogleIcon from "@/static/icon/google-icon.svg";
import EmailIcon from "@/static/icon/email-solid-badged.svg";
import MobileIcon from "@/static/icon/undraw-mobile_login.svg";
// import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Outfit } from "next/font/google";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { PasswordInput } from "@/components/password-input";
// import { login } from "@/actions/userActions/userActions";

const outfit = Outfit({ weight: "500", subsets: ["latin"] });

const formSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Please enter password" })
    .min(1, { message: "Please enter password" }),
});

export default function SingIn() {
  const [error, setError] = useState();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    // setError(undefined);
    console.log("Log From Sign In Form", values);

    // const error = await login(values.email, values.password);
    // setError(error);
  }

  const isSubmitting = form.formState.isSubmitting;
  return (
    <div className="flex justify-center">
      <div className={`${outfit.className} max-w-screen-2xl w-full `}>
        <div className="mx-[24px] md:mx-[70px] xl:mx-[124px] mb-[30px] xl:mb-[40px]">
          <div className="bg-[#FFFFFF]   ">
            <div className="rounded-[16px] p-[30px] shadow-pIcon xl:flex xl:gap-[80px] ">
              <div className="w-full xl:flex xl:justify-center xl:items-center hidden">
                <Image src={MobileIcon} alt="" className=" " />
              </div>
              <div className="w-full ">
                <div>
                  <h6 className=" text-[24px] font-[800] leading-[34px] text-[#1C1C1C] md:text-[40px] md:leading-[50px]">
                    Sign in your account.
                  </h6>
                </div>

                <div className="mt-[30px] md:mt-[60px]">
                  <div className=" flex flex-col gap-[16px] ">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-4"
                      >
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-col gap-[8px] text-[18px] font-[500] leading-[22px] text-[#1C1C1C] md:text-[18px] md:leading-[26px]">
                                <FormLabel className="text-[#1C1C1C] text-[14px] font-[500] leading-[22px] md:text-[18px] md:leading-[26px]">
                                  Enter your Email{" "}
                                  <span className="text-[#FF0000]">*</span>
                                </FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-[16px] px-[24px] py-[12px] border-[2px] border-[#1DBF731A] rounded-[8px]   ">
                                    <Image
                                      src={EmailFast}
                                      alt=""
                                      width={20}
                                      height={20}
                                      className="w-[16px] h-[16px] md:w-[20px] md:h-[20px]"
                                    />
                                    <Input
                                      placeholder="user@example.com"
                                      className="text-[#555555] border-none p-0 focus-visible:ring-0 shadow-none text-[14px] font-[500] leading-[22px] md:text-[18px] md:leading-[26px]"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="flex flex-col gap-[8px] text-[18px] font-[500] leading-[22px] text-[#1C1C1C] md:text-[18px] md:leading-[26px]">
                              <FormLabel className="text-[#1C1C1C] text-[14px] font-[500] leading-[22px] md:text-[18px] md:leading-[26px]">
                                Password{" "}
                                <span className="text-[#FF0000]">*</span>{" "}
                              </FormLabel>
                              <FormControl>
                                <div className=" w-full flex items-center gap-[16px] px-[24px] py-[12px] border-[2px] border-[#1DBF731A] rounded-[8px]   ">
                                  <Image
                                    src={MdPassword}
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="w-[16px] h-[16px] md:w-[20px] md:h-[20px] "
                                  />
                                  <PasswordInput
                                    className="text-[#555555] border-none p-0 focus-visible:ring-0 shadow-none text-[14px] font-[500] leading-[22px] md:text-[18px] md:leading-[26px]"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {error && <FormMessage>{error}</FormMessage>}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={` px-[20px] py-[6px] bg-[#1DBF73] rounded-[6px] flex justify-center items-center w-full`}
                        >
                          <span className=" flex items-center gap-[20px] text-[14px] font-[700] leading-[24px] text-[#FFFFFF] text-center md:text-[18px] md:leading-[30px]">
                            Login{" "}
                            {isSubmitting && (
                              <RotateCw className="animate-spin" />
                            )}
                          </span>
                        </button>
                      </form>
                    </Form>
                  </div>
                </div>

                <div className="h-[22px] items-center flex flex-col gap-2 justify-center w-full mt-[40px]">
                  <p className="text-[12px] font-[400] leading-[22px] text-[#555555] text-center md:text-[14px] md:leading-[24px] xl:text-[18px] xl:leading-[28px] ">
                    Forgot your password?{" "}
                    <span className="text-[#1DBF73] underline underline-offset-1">
                      <Link href={"/forgot-password"}>Reset Password</Link>
                    </span>
                  </p>
                  <p className="text-[12px] font-[400] leading-[22px] text-[#555555] text-center md:text-[14px] md:leading-[24px] xl:text-[18px] xl:leading-[28px] ">
                    Don&apos;t have an account?{" "}
                    <span className="text-[#1DBF73] underline underline-offset-1">
                      <Link href={"/signup"}>Sign up</Link>
                    </span>
                  </p>
                </div>
                {/* <div className="mt-[30px] md:mt-[60px] flex flex-col gap-[8px] md:gap-[16px] w-full md:flex-row ">
                  <Link href={"#"} className="w-full">
                    <div className="bg-[#F9F9F9] w-full rounded-[8px] py-[12px] px-[24px] flex items-center gap-[16px]">
                      <Image
                        src={GoogleIcon}
                        alt=""
                        width={20}
                        height={20}
                        className="w-[20px] h-[20px] md:w-[26px] md:h-[26px] "
                      />
                      <p className="text-[14px] font-[500] leading-[22px] text-[#555555] w-full text-center md:text-[18px] md:leading-[26px] ">
                        Continue with Google
                      </p>
                    </div>
                  </Link>
                  <Link href={"#"} className="w-full">
                    <div className="bg-[#F9F9F9] w-full rounded-[8px] py-[12px] px-[24px] flex items-center gap-[16px]">
                      <Image
                        src={EmailIcon}
                        alt=""
                        width={20}
                        height={20}
                        className="w-[20px] h-[20px] md:w-[26px] md:h-[26px] "
                      />
                      <p className="text-[14px] font-[500] leading-[22px] text-[#555555] w-full text-center md:text-[18px] md:leading-[26px]">
                        Continue with Email
                      </p>
                    </div>
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
