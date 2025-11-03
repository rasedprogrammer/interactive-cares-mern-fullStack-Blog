// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// const sendEmail = async (options) => {
//   // 1. Create a transporter object
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_SERVICE_HOST,
//     port: process.env.EMAIL_SERVICE_PORT,
//     secure: false, // Use TLS (false for port 587)
//     auth: {
//       user: process.env.EMAIL_SERVICE_USER,
//       pass: process.env.EMAIL_SERVICE_PASS,
//     },
//     tls: {
//       // Needed if your host has issues with self-signed certs (e.g., local testing)
//       ciphers: "SSLv3",
//     },
//   });

//   // 2. Define the email options
//   const mailOptions = {
//     from: `Blog Application <${process.env.EMAIL_SERVICE_USER}>`,
//     to: options.email,
//     subject: options.subject,
//     html: options.message,
//   };

//   // 3. Send the email
//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: %s", info.messageId);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     // In production, you might want to throw an error or log it securely
//   }
// };

// export default sendEmail;


import nodemailer from "nodemailer";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  const { email, subject, message } = options;

  // 1️⃣ Create the SMTP transporter (for local or Gmail)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_SERVICE_PORT || 587,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `Blog Application <${process.env.EMAIL_SERVICE_USER}>`,
    to: email,
    subject,
    html: message,
  };

  try {
    // 2️⃣ Try sending with Nodemailer (Gmail or custom SMTP)
    const info = await transporter.sendMail(mailOptions);
    console.log("📨 Email sent successfully via SMTP:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ SMTP failed, trying Resend...", error.message);

    // 3️⃣ Fallback to Resend for production reliability
    try {
      const resendResponse = await resend.emails.send({
        from:
          process.env.EMAIL_FROM || "Blog App <onboarding@resend.dev>",
        to: email,
        subject,
        html: message,
      });
      console.log("✅ Email sent via Resend:", resendResponse.id);
      return resendResponse;
    } catch (resendError) {
      console.error("🚨 Resend also failed:", resendError.message);
    }
  }
};

export default sendEmail;
