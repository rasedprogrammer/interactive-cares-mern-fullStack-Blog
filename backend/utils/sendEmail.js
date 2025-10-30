<<<<<<< HEAD
// // blog-application/backend/utils/sendEmail.js

// const nodemailer = require("nodemailer");
// require("dotenv").config();

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

// module.exports = sendEmail;

// sendEmail.js
// const SibApiV3Sdk = require("sib-api-v3-sdk");
// require("dotenv").config();

// const sendEmail = async ({ email, subject, message }) => {
//   try {
//     const client = SibApiV3Sdk.ApiClient.instance;
//     const apiKey = client.authentications["api-key"];
//     apiKey.apiKey = process.env.BREVO_API_KEY;

//     const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

//     const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
//     sendSmtpEmail.to = [{ email }];
//     sendSmtpEmail.sender = {
//       name: "Blog Application",
//       email: process.env.BREVO_FROM_EMAIL,
//     };
//     sendSmtpEmail.subject = subject;
//     sendSmtpEmail.htmlContent = message;

//     const response = await tranEmailApi.sendTransacEmail(sendSmtpEmail);
//     console.log("Email sent successfully:", response.messageId);
//     return response;
//   } catch (error) {
//     console.error("Error sending email via Brevo:", error);
//     throw new Error("Email could not be sent. Please try again later.");
//   }
// };

// module.exports = sendEmail;

// backend/utils/sendEmail.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "thewesterntoursandtravels@gmail.com",
      pass: "temunxvtsoohrqxj",
    },
  });

  const mailOptions = {
    from: `Blog Application <thewesterntoursandtravels@gmail.com>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
=======
// blog-application/backend/utils/sendEmail.js

// const nodemailer = require('nodemailer');
// const dotenv = require('dotenv');
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (options) => {
    // 1. Create a transporter object
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVICE_HOST,
        port: process.env.EMAIL_SERVICE_PORT,
        secure: false, // Use TLS (false for port 587)
        auth: {
            user: process.env.EMAIL_SERVICE_USER,
            pass: process.env.EMAIL_SERVICE_PASS,
        },
        tls: {
            // Needed if your host has issues with self-signed certs (e.g., local testing)
            ciphers: 'SSLv3' 
        }
    });

    // 2. Define the email options
    const mailOptions = {
        from: `Blog Application <${process.env.EMAIL_SERVICE_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    // 3. Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        // In production, you might want to throw an error or log it securely
    }
};

export default sendEmail;
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86
