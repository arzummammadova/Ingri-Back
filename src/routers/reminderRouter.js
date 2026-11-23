import crypto from "crypto";
import { Router } from "express";
import User from "../models/authModel.js";
import { frontendUrl } from "../utils/emailTemplates.js";
import { runDailyReminders, unsubscribeToken } from "../utils/reminders.js";

/** Mounted before CSRF: these are called by a cron service / an email link, not by the web app. */
export const cronRouter = Router();
export const reminderRouter = Router();

function secretOk(req) {
  const secret = process.env.CRON_SECRET || "";
  const given = String(req.get("x-cron-secret") || req.query.key || "");
  if (!secret || secret.length < 16 || given.length !== secret.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(secret));
}

async function cronReminders(req, res, next) {
  try {
    if (!process.env.CRON_SECRET) return res.status(503).json({ code: "CRON_DISABLED" });
    if (!secretOk(req)) return res.status(401).json({ code: "UNAUTHORIZED" });
    res.json({ ok: true, ...(await runDailyReminders({ force: req.query.force === "1" })) });
  } catch (error) {
    next(error);
  }
}
cronRouter.get("/reminders", cronReminders);
cronRouter.post("/reminders", cronReminders);

const PAGE = {
  az: ["Xatırlatmalar söndürüldü", "Artıq gündəlik e-poçt xatırlatması almayacaqsan. İstəsən Tənzimləmələrdən yenidən aça bilərsən.", "Ingri-yə qayıt"],
  en: ["Reminders turned off", "You won't get daily reminder emails any more. You can turn them back on in Settings.", "Back to Ingri"],
  ru: ["Напоминания отключены", "Вы больше не будете получать ежедневные письма. Включить их снова можно в настройках.", "Вернуться в Ingri"],
};

async function unsubscribe(req, res, next) {
  try {
    const id = String(req.query.u || "");
    const token = String(req.query.t || "");
    const valid = /^[a-f0-9]{24}$/.test(id) && token.length === 32 && crypto.timingSafeEqual(Buffer.from(token), Buffer.from(unsubscribeToken(id)));
    if (!valid) return res.status(400).send("Invalid link");
    const user = await User.findByIdAndUpdate(id, { $set: { "reminders.email": false, "reminders.asked": true, "reminders.updatedAt": new Date() } }, { new: true }).select("locale");
    if (req.method === "POST") return res.json({ ok: true });
    const lang = ["az", "en", "ru"].includes(user?.locale) ? user.locale : "az";
    const [title, text, cta] = PAGE[lang];
    res.set("Content-Type", "text/html; charset=utf-8").send(`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#ddf4f7;font-family:Poppins,Segoe UI,Arial,sans-serif;color:#0d0d0d">
<div style="max-width:420px;margin:24px;background:#fff;border-radius:28px;padding:36px;text-align:center;box-shadow:0 16px 40px rgba(13,13,13,.08)">
<div style="font-size:40px">🔕</div><h1 style="font-size:24px;margin:12px 0">${title}</h1><p style="line-height:1.6;color:#3b4148">${text}</p>
<a href="${frontendUrl()}/${lang}/settings" style="display:inline-block;margin-top:12px;padding:12px 24px;border-radius:999px;background:#0d0d0d;color:#fff;text-decoration:none;font-weight:600">${cta}</a></div></body></html>`);
  } catch (error) {
    next(error);
  }
}
reminderRouter.get("/unsubscribe", unsubscribe);
reminderRouter.post("/unsubscribe", unsubscribe);
