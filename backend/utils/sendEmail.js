import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "Blog App <noreply@blog.thewebpal.com>";

const sendEmail = async (options) => {
  const { email, subject, message } = options;

  // Use the actual email in production, a test email in development
  const resendTo =
    process.env.NODE_ENV === "production" ? email : process.env.EMAIL_SERVICE_USER;

  try {
    const resendResponse = await resend.emails.send({
      from: FROM_ADDRESS,
      to: resendTo,
      subject,
      html: message,
    });

    console.log("✅ Email sent via Resend:", resendResponse.id);
    return { success: true, provider: "Resend", response: resendResponse };
  } catch (resendError) {
    console.error("🚨 Resend failed:", resendError.message);
    // Throw error for the controller to handle/log
    throw new Error(`Email sending failed: ${resendError.message}`);
  }
};

export default sendEmail;