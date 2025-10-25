import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const MAILER_SENDER = process.env.MAILER_SENDER || "onboarding@resend.dev";
const sendEmail = async (to, subject, html) => {
    try {
        await resend.emails.send({
            from: MAILER_SENDER,
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email could not be sent");
    }
};
export default sendEmail;