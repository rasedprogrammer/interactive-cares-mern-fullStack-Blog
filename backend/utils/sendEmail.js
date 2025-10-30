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