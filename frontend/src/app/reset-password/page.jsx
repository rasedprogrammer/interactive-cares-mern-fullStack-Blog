// import { ResetPasswordForm } from "@/components/user/auth/reset-password";
// import { resendEmailTimeout } from "@/lib/constants";
// import { User } from "@/lib/models/user";
// import { redirect } from "next/navigation";

import { resendEmailTimeout } from "@/lib/constants";
// import { User } from "@/lib/models/user";
import { ResetPasswordForm } from "@/components/user/reset-password";
// import { redirect } from "next/navigation";

export default async function Page({ searchParams }) {
  const email = (await searchParams).email;
  // if (!email) {
  //   redirect("/forgot-password");
  // }

  // const user = await User.findOne({ email: email });
  // if (!user) {
  //   redirect("/forgot-password");
  // }

  // const resetPasswordOtpSendAt = user.resetPasswordOtpSendAt;

  // if (!resetPasswordOtpSendAt) {
  //   redirect("/reset-password");
  // }

  return (
    <div className="flex justify-center bg-white min-h-screen  py-12">
      <div className="max-w-screen-2xl w-full min-h-full flex justify-center items-center">
        <div className="mx-[25px] w-full md:mx-0 md:max-w-[668px] ">
          <ResetPasswordForm email={email} resendTime={60_000} />
        </div>
      </div>
    </div>
  );
}
