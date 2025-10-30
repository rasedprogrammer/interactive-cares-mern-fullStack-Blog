import nodemailer from "nodemailer";
// const nodemailer = require("nodemailer");

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "thewesterntoursandtravels@gmail.com",
    pass: "temu nxvt sooh rqxj",
  },
});

// EMAIL_USER=thewesterntoursandtravels@gmail.com
// EMAIL_PASS=temunxvtsoohrqxj
