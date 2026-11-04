import nodemailer from "nodemailer";

const TIMEOUT_MS = 8000;
let transporter;

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      connectionTimeout: TIMEOUT_MS,
      greetingTimeout: TIMEOUT_MS,
      socketTimeout: TIMEOUT_MS,
    });
  }
  return transporter;
}

/** Always shows "Ingri" as the sender name, whatever EMAIL_FROM contains. */
function mailFrom() {
  const raw = (process.env.EMAIL_FROM || "").trim();
  const address = raw.match(/<([^>]+)>/)?.[1] || (raw.includes("@") ? raw : process.env.EMAIL_USER);
  return { name: "Ingri", address };
}

async function postJson(url, headers, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`${url} responded ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/** Resend (https://resend.com) over HTTPS — works where SMTP ports are blocked (e.g. Render free). */
async function sendViaResend({ to, subject, html, text }) {
  const from = mailFrom();
  const address = process.env.RESEND_FROM || from.address || "onboarding@resend.dev";
  await postJson("https://api.resend.com/emails", { Authorization: `Bearer ${process.env.RESEND_API_KEY}` }, {
    from: `${from.name} <${address}>`,
    to: [to],
    subject,
    html,
    text,
  });
}

/** Brevo transactional email over HTTPS. */
async function sendViaBrevo({ to, subject, html, text }) {
  const from = mailFrom();
  await postJson("https://api.brevo.com/v3/smtp/email", { "api-key": process.env.BREVO_API_KEY }, {
    sender: { name: from.name, email: process.env.BREVO_FROM || from.address },
    to: [{ email: to }],
    subject,
    htmlContent: html,
    textContent: text,
  });
}

export async function sendMail({ to, subject, html, text }) {
  if (process.env.RESEND_API_KEY) {
    await sendViaResend({ to, subject, html, text });
    return { preview: false, provider: "resend" };
  }
  if (process.env.BREVO_API_KEY) {
    await sendViaBrevo({ to, subject, html, text });
    return { preview: false, provider: "brevo" };
  }
  const mailer = getTransporter();
  if (!mailer) {
    console.log("\n[mail] No email provider configured. Set RESEND_API_KEY, BREVO_API_KEY, or EMAIL_USER + EMAIL_PASS.");
    console.log(`[mail] To: ${to}`);
    console.log(`[mail] Subject: ${subject}`);
    console.log(`[mail] ${text || html}\n`);
    return { preview: true };
  }
  await mailer.sendMail({ from: mailFrom(), to, subject, text, html });
  return { preview: false, provider: "smtp" };
}
