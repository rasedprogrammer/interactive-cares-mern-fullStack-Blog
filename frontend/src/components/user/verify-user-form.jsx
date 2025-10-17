"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RotateCw } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import clsx from "clsx";
// import {
//   resendVerificationOTP,
//   verify,
// } from "@/actions/userActions/userActions";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
});

export function VerifyUserForm({ resendTime }) {
  const [error, setError] = useState();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(data) {
    setError(undefined);
    console.log(data);

    // const error = await verify(data.otp);
    // setError(error);
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="w-full mt-[40px] ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="w-full flex flex-col justify-center items-center mt-[16px]">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className=" gap-[8px] items-center ">
                        <InputOTPSlot
                          index={0}
                          className="bg-[#F5F5F5] border-none rounded-[8px] w-[30px] h-[38px] md:w-[50px] md:h-[50px]"
                        />
                        <InputOTPSlot
                          index={1}
                          className="bg-[#F5F5F5] border-none rounded-[8px] w-[30px] h-[38px] md:w-[50px] md:h-[50px]"
                        />
                        <InputOTPSlot
                          index={2}
                          className="bg-[#F5F5F5] border-none rounded-[8px] w-[30px] h-[38px] md:w-[50px] md:h-[50px]"
                        />
                        <InputOTPSlot
                          index={3}
                          className="bg-[#F5F5F5] border-none rounded-[8px] w-[30px] h-[38px] md:w-[50px] md:h-[50px]"
                        />
                        <InputOTPSlot
                          index={4}
                          className="bg-[#F5F5F5] border-none rounded-[8px] w-[30px] h-[38px] md:w-[50px] md:h-[50px]"
                        />
                        <InputOTPSlot
                          index={5}
                          className="bg-[#F5F5F5] border-none rounded-[8px] w-[30px] h-[38px] md:w-[50px] md:h-[50px]"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    <span className="flex flex-col justify-center items-center mt-[16px]">
                      <ResendEmailButton time={resendTime} />
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-[40px] md:mt-[60px] flex flex-col items-center gap-3">
            {error && <FormMessage>{error}</FormMessage>}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${bricolageGrotesque.className} px-[20px] py-[6px] bg-[#FF6600] w-full rounded-[6px] flex justify-center items-center`}
            >
              <span className=" flex items-center gap-[20px] text-[14px] font-[700] leading-[24px] text-[#FFFFFF] text-center md:text-[18px] md:leading-[30px]">
                Submit
                {isSubmitting && <RotateCw className="animate-spin" />}
              </span>
            </button>
          </div>
          <div className="h-[22px] items-center flex justify-center w-full mt-[16px]">
            <p className="text-[12px] font-[400] leading-[22px] text-[#555555] text-center md:text-[14px] md:leading-[24px] xl:text-[18px] xl:leading-[28px] ">
              Already have an account?{" "}
              <span className="text-[#FF6600] underline underline-offset-1 ">
                <Link href={"/singin"}>Sign in</Link>
              </span>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

function ResendEmailButton({ time }) {
  const [remaining, setRemaining] = useState(time < 0 ? 0 : time);
  const [showResendButton, setShowResendButton] = useState(time < 0);

  const [pending, setPending] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (remaining > 1) {
        setRemaining((p) => {
          if (p > 1) {
            return p - 1;
          } else {
            return 0;
          }
        });
      }
    }, 1000);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      setShowResendButton(true);
    }, time * 1000);
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  async function onResendClick() {
    setPending(true);
    // await resendVerificationOTP();
    // location.reload();
  }

  return (
    <span className="text-[12px] font-[400] leading-[22px] text-[#555555] md:text-[14px] md:leading-[24px]">
      Didn&apos;t receive a code?{" "}
      {showResendButton ? (
        <span
          className={clsx("font-[700] underline underline-offset-1", {
            "text-[#FF6600]": !pending,
            "text-[#FF660077]": pending,
          })}
        >
          <button onClick={onResendClick} type="button" disabled={pending}>
            Resend Verification Code
          </button>
        </span>
      ) : (
        <span className="text-[#ff660077] font-[700]">
          Resend ({formatTime(remaining)}).
        </span>
      )}
    </span>
  );
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
