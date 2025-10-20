import { Bricolage_Grotesque } from "next/font/google";
import React from "react";
import { redirect } from "next/navigation";
import { VerifyUserForm } from "@/components/user/verify-user-form";
import { resendEmailTimeout } from "@/lib/constants";
// import { getCurrentUser } from "@/lib/auth/user-auth";
// import { VerifyUserForm } from "@/components/user/auth/verify-user-form";
// import { resendEmailTimeout } from "@/lib/constants";

export default async function Page() {
  // const user = await getCurrentUser();
  // if (!user) {
  //   redirect("/singin");
  // }
  // const verificationOtpSendAt = user.verificationOtpSendAt;
  return (
    <div className="flex justify-center bg-white min-h-screen  py-12">
      <div className="max-w-screen-2xl w-full min-h-full flex justify-center items-center">
        <div className="mx-[25px] w-full md:mx-0 md:max-w-[668px] ">
          <div
            className={` flex flex-col gap-[12px] md:gap-[20px] justify-center items-center`}
          >
            <h2
              className={` text-[20px] font-[700] leading-[30px] text-[#282828] md:text-[30px] md:leading-[40px] xl:text-[34px] xl:leading-[44px] `}
            >
              Enter<span className="text-[#FF6600]"> Code </span>
            </h2>
            <p className="text-center text-[12px] font-[400] leading-[16px] text-[#555555] md:text-[18px] md:leading-[28px]">
              Collect the code from your email address{" "}
              <span className="font-bold">{"user.email"}</span>
            </p>
          </div>
          <VerifyUserForm resendTime={1000} />
        </div>
      </div>
    </div>
  );
}
