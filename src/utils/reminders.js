/**
 * Daily study reminder emails (opt-in, sent through sendMail → Brevo / Resend over HTTPS; Render blocks SMTP).
 *
 * Triggered two ways, both idempotent (one email per user per local day, tracked in reminders.lastSentDate):
 *  1. An external cron (e.g. cron-job.org, every hour) calls GET/POST /api/cron/reminders with the
 *     `x-cron-secret: $CRON_SECRET` header (or ?key=). This also wakes a sleeping Render free instance.
 *  2. While the server is awake, an in-process timer runs the same job every 15 minutes
 *     (disable with REMINDER_SCHEDULER=0).
 * A user gets the email when: reminders.email is on, the email is verified, their local hour ≥ reminders.hour,
 * and they have not studied yet today.
 */
import crypto from "crypto";
import User from "../models/authModel.js";
import { dayKeyIn } from "./activity.js";
import { frontendUrl, reminderEmail } from "./emailTemplates.js";
import { sendMail } from "./sendMail.js";

const BATCH = 200;

function apiBase() {
  return (process.env.PUBLIC_API_URL || process.env.RENDER_EXTERNAL_URL || frontendUrl()).replace(/\/$/, "");
}

export function unsubscribeToken(userId) {
  return crypto.createHmac("sha256", `${process.env.JWT_SECRET}:reminders`).update(String(userId)).digest("hex").slice(0, 32);
}

export function unsubscribeUrl(userId) {
  const base = apiBase();
  const path = `/api/reminders/unsubscribe?u=${userId}&t=${unsubscribeToken(userId)}`;
  return base ? `${base}${path}` : "";
}

function localHour(tz, now) {
  try {
    return Number(new Intl.DateTimeFormat("en-GB", { timeZone: tz || "Asia/Baku", hour: "2-digit", hour12: false }).format(now)) % 24;
  } catch {
    return Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Baku", hour: "2-digit", hour12: false }).format(now)) % 24;
  }
}

let running = false;

/** Sends due reminders. Returns { checked, sent, skipped, failed }. */
export async function runDailyReminders({ now = new Date(), force = false, log = console.log } = {}) {
  if (running) return { busy: true };
  running = true;
  const report = { checked: 0, sent: 0, skipped: 0, failed: 0 };
  try {
    const users = await User.find({ "reminders.email": true, isVerified: true })
      .select("name username email locale timezone streak lastActiveDate reminders")
      .limit(5000);
    for (const user of users) {
      if (report.sent >= BATCH) break;
      report.checked += 1;
      const today = dayKeyIn(now, user.timezone);
      const due = force || localHour(user.timezone, now) >= (user.reminders?.hour ?? 19);
      if (!due || user.reminders?.lastSentDate === today || user.lastActiveDate === today) {
        report.skipped += 1;
        continue;
      }
      // Claim the day first so parallel triggers (cron + timer) never send twice.
      const claimed = await User.updateOne(
        { _id: user._id, "reminders.lastSentDate": { $ne: today } },
        { $set: { "reminders.lastSentDate": today } },
      );
      if (!claimed.modifiedCount) {
        report.skipped += 1;
        continue;
      }
      try {
        const unsubscribe = unsubscribeUrl(user._id);
        const mail = reminderEmail({ name: user.name || user.username, locale: user.locale, streak: user.streak || 0, unsubscribe });
        await sendMail({ to: user.email, ...mail, headers: unsubscribe ? { "List-Unsubscribe": `<${unsubscribe}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } : undefined });
        report.sent += 1;
      } catch (error) {
        report.failed += 1;
        await User.updateOne({ _id: user._id }, { $set: { "reminders.lastSentDate": "" } });
        log(`[reminders] send failed for ${user._id}: ${error.message}`);
      }
    }
    if (report.sent || report.failed) log(`[reminders] sent ${report.sent}, failed ${report.failed}, checked ${report.checked}`);
    return report;
  } finally {
    running = false;
  }
}

/** In-process timer (works while the instance is awake). */
export function startReminderScheduler() {
  if (process.env.REMINDER_SCHEDULER === "0") return null;
  const tick = () => runDailyReminders().catch((error) => console.warn("[reminders]", error.message));
  const first = setTimeout(tick, 60 * 1000);
  const timer = setInterval(tick, 15 * 60 * 1000);
  first.unref?.();
  timer.unref?.();
  return timer;
}
