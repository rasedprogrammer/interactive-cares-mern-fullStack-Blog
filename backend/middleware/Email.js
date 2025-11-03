// // const { transporter } = require("./email.config.js");
// import { transporter } from "./email.config.js";
// import { Verification_Email_Template } from "./EmailTemplate.js";

// export const sendVerificationEmail = async (email, verificationCode) => {
//     try {
//         const response = await transporter.sendMail({
//             from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
//             to: email,
//             subject: "Email Verification Code",
//             text: `Your verification code is: ${verificationCode}`,
//             html: Verification_Email_Template.replace("{verificationCode}", verificationCode)
//         });

//         console.log("Email Send Successfully", response);
//     } catch (error) {
//         console.error("Error sending email:", error);
//     }
// }

import nodemailer from "nodemailer";
import { Resend } from "resend";
import { Verification_Email_Template } from "./EmailTemplate.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE_HOST,
  port: process.env.EMAIL_SERVICE_PORT,
  auth: {
    user: process.env.EMAIL_SERVICE_USER,
    pass: process.env.EMAIL_SERVICE_PASS,
  },
});

export const sendVerificationEmail = async (email, code) => {
  try {
    if (process.env.NODE_ENV === "production") {
      await resend.emails.send({
        from: `Blog Application <${process.env.EMAIL_SERVICE_USER}>`,
        to: email,
        subject: "Email Verification Code",
        html: Verification_Email_Template.replace("{verificationCode}", code),
      });
    } else {
      await transporter.sendMail({
        from: `"Dev Tester" <${process.env.EMAIL_SERVICE_USER}>`,
        to: email,
        subject: "Email Verification Code",
        html: Verification_Email_Template.replace("{verificationCode}", code),
      });
    }
    console.log("✅ Email sent successfully to:", email);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
