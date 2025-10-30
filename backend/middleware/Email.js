// const { transporter } = require("./email.config.js");
import { transporter } from "./email.config.js";
import { Verification_Email_Template } from "./EmailTemplate.js";

export const sendVerificationEmail = async (email, verificationCode) => {
    try {
        const response = await transporter.sendMail({
            from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
            to: email,
            subject: "Email Verification Code",
            text: `Your verification code is: ${verificationCode}`,
            html: Verification_Email_Template.replace("{verificationCode}", verificationCode)
        });

        console.log("Email Send Successfully", response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}