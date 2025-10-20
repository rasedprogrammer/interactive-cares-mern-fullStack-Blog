"use client";

import { useState } from "react";
import { VerifyResetPasswordOTPForm } from "./verify-reset-password-otp-form";
import { SetPasswordForm } from "./set-password-form";
// import { SetPasswordForm } from "./set-password-form";
// import { VerifyResetPasswordOTPForm } from "./verify-reset-password-otp-form";

export function ResetPasswordForm({ email, resendTime }) {
  const [isCodeView, setIsCodeView] = useState(true);
  const [otp, setOtp] = useState("");
  return (
    <>
      {isCodeView && (
        <VerifyResetPasswordOTPForm
          email={email}
          resendTime={resendTime}
          onValidOTP={(otp) => {
            setIsCodeView(false);
            setOtp(otp);
          }}
        />
      )}
      {!isCodeView && <SetPasswordForm email={email} otp={otp} />}
    </>
  );
}
