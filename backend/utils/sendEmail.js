// import nodemailer from "nodemailer";
// import { Resend } from "resend";
// import dotenv from "dotenv";

// dotenv.config();

// const resend = new Resend(process.env.RESEND_API_KEY);

// const sendEmail = async (options) => {
//   const { email, subject, message } = options;
//   // ✅ SMTP transporter (for development / Gmail / custom SMTP)
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_SERVICE_HOST || "smtp.gmail.com",
//     port: process.env.EMAIL_SERVICE_PORT || 587,
//     secure: false, // true for 465, false for 587
//     auth: {
//       user: process.env.EMAIL_SERVICE_USER,
//       pass: process.env.EMAIL_SERVICE_PASS,
//     },
//     tls: { rejectUnauthorized: false }, // prevents self-signed cert errors
//   });

//   const mailOptions = {
//     from:`Blog App <${process.env.EMAIL_SERVICE_USER}>`,
//     to: email,
//     subject,
//     html: message,
//   };

//   try {
//     // 1️⃣ Attempt to send via SMTP first
//     const info = await transporter.sendMail(mailOptions);
//     console.log("📨 Email sent successfully via SMTP:", info.messageId);
//     return info;
//   } catch (smtpError) {
//     console.error("❌ SMTP failed, trying Resend...", smtpError.message);

//     try {
//       // 2️⃣ Fallback to Resend (production-ready)
//       const resendResponse = await resend.emails.send({
//         from: "Blog App <onboarding@resend.dev>",
//         to: email,
//         subject,
//         html: message,
//       });
//       console.log("✅ Email sent via Resend:", resendResponse.id || resendResponse);
//       return resendResponse;
//     } catch (resendError) {
//       console.error("🚨 Resend also failed:", resendError.message);
//       throw new Error("Email sending failed on all services.");
//     }
//   }
// };

// export default sendEmail;

import nodemailer from "nodemailer";
import { Resend } from "resend";
import emailjs from "@emailjs/browser";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * sendEmail - Sends an email via SMTP, EmailJS, and Resend fallback
 * @param {Object} options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - HTML message content
 */
const sendEmail = async (options) => {
  const { email, subject, message } = options;

  // -----------------------------
  // 1️⃣ Try Gmail SMTP first
  // -----------------------------
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_SERVICE_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASS, // Gmail App Password
    },
  });

  const mailOptions = {
    from: `Blog App <${process.env.EMAIL_SERVICE_USER}>`,
    to: email,
    subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📨 Email sent via SMTP:", info.messageId);
    return { success: true, provider: "SMTP", id: info.messageId };
  } catch (smtpError) {
    console.error("❌ SMTP failed:", smtpError.message);

    // -----------------------------
    // 2️⃣ Fallback to EmailJS
    // -----------------------------
    try {
      const emailjsTo =
        process.env.NODE_ENV === "production"
          ? email
          : process.env.EMAIL_SERVICE_USER;

      const emailjsResponse = await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        {
          to_email: emailjsTo,
          subject,
          message,
        },
        process.env.EMAILJS_PUBLIC_KEY
      );

      console.log("📨 Email sent via EmailJS:", emailjsResponse);
      return { success: true, provider: "EmailJS", response: emailjsResponse };
    } catch (emailjsError) {
      console.error("❌ EmailJS failed:", emailjsError.message);

      // -----------------------------
      // 3️⃣ Final fallback: Resend
      // -----------------------------
      try {
        const resendTo =
          process.env.NODE_ENV === "production"
            ? email
            : process.env.EMAIL_SERVICE_USER;

        const resendResponse = await resend.emails.send({
          from: "Blog App <onboarding@resend.dev>",
          to: resendTo,
          subject,
          html: message,
        });

        console.log(
          "✅ Email sent via Resend:",
          resendResponse.id || resendResponse
        );
        return { success: true, provider: "Resend", response: resendResponse };
      } catch (resendError) {
        console.error("🚨 Resend also failed:", resendError.message);
        return { success: false, error: resendError.message };
      }
    }
  }
};

export default sendEmail;
