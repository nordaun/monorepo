import { createTransport } from "nodemailer";
import type { MailOptions } from "nodemailer/lib/sendmail-transport/index.js";

export type MailPayload = Pick<MailOptions, "from" | "to" | "subject" | "html">;

/**
 * ## Email Transport
 * @description The transporter used for sending emails to users.
 */
export const mailTransport = createTransport({
  service: "gmail",
  auth: {
    user: process.env.PRIVATE_EMAIL_USER,
    pass: process.env.EMAIL_PASSKEY,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * ## Send Email
 * @description Straightforwardly sends an email to a user
 * @param mailOptions Arguments that contain email data like (from, to, subject, etc.)
 */
export async function sendEmail({
  mailOptions,
}: {
  mailOptions: MailPayload;
}): Promise<void> {
  try {
    await mailTransport.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
