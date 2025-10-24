import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 465,
      service: "gmail",
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const test = await transporter.verify();
    console.log("Server is ready to send messages:", test);

    // Send mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      // to: process.env.EMAIL_USER,
      subject,
      html,
    });

    console.log("Email sent to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
