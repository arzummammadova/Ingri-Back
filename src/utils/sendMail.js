import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, html, text }) {
  const mailer = getTransporter();
  if (!mailer) {
    console.log("\n[mail] Gmail SMTP is not configured. Set EMAIL_USER and EMAIL_PASS.");
    console.log(`[mail] To: ${to}`);
    console.log(`[mail] Subject: ${subject}`);
    console.log(`[mail] ${text || html}\n`);
    return { preview: true };
  }
  await mailer.sendMail({
    from: process.env.EMAIL_FROM || `Ingri <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
  return { preview: false };
}
