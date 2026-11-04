import ChatMessage from "../models/chatModel.js";
import Podcast from "../models/podcastModel.js";
import Grammar from "../models/grammarModel.js";
import Video from "../models/videoModel.js";
import Book from "../models/bookModel.js";
import { activeProvider, streamChat } from "../utils/llm.js";

const HISTORY_LIMIT = 20;

async function catalogFor(level) {
  const pick = (Model) => Model.find({ level }).select("slug title -_id").limit(6).lean().catch(() => []);
  const [podcasts, grammar, videos, books] = await Promise.all([pick(Podcast), pick(Grammar), pick(Video), pick(Book)]);
  const fmt = (rows, path) => rows.map((r) => `- ${r.title} → /${path}/${r.slug}`).join("\n");
  return [
    podcasts.length && `Podcasts:\n${fmt(podcasts, "podcasts")}`,
    grammar.length && `Grammar:\n${fmt(grammar, "grammar")}`,
    videos.length && `Videos:\n${fmt(videos, "videos")}`,
    books.length && `Books:\n${fmt(books, "books")}`,
  ].filter(Boolean).join("\n\n");
}

function systemPrompt(user, locale, catalog) {
  const lang = locale === "en" ? "English" : locale === "ru" ? "Russian (русский язык)" : "Azerbaijani (Azərbaycan dili, Latin script)";
  return `You are Ingri, a warm, encouraging English tutor inside the Ingri learning app for Azerbaijani speakers.
Learner: ${user.name || "learner"}, current CEFR level ${user.activeLevel || "A1"} (studying: ${(user.levels || []).join(", ") || user.activeLevel}).
Reply in ${lang}. Keep English examples in English. Adapt vocabulary and grammar difficulty to level ${user.activeLevel || "A1"}.
You can: explain grammar with short examples, translate between English and Azerbaijani, correct the learner's sentences (show the corrected sentence in **bold** and briefly explain each fix), give vocabulary with pronunciation hints, and quiz the learner.
When relevant, suggest content from the app using relative links in Markdown like [title](/az/grammar/slug) — prefix the path with /${locale}.
Use concise Markdown (short paragraphs, bullet lists, **bold**). Stay on language learning; politely decline unrelated or unsafe requests.
App content at this level:
${catalog || "(no catalog available)"}`;
}

export async function listHistory(req, res, next) {
  try {
    const rows = await ChatMessage.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ items: rows.reverse(), provider: activeProvider() });
  } catch (error) {
    next(error);
  }
}

export async function clearHistory(req, res, next) {
  try {
    await ChatMessage.deleteMany({ user: req.user._id });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

export async function chat(req, res, next) {
  const { message, locale } = req.body;
  res.status(200);
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();
  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);
  const controller = new AbortController();
  res.on("close", () => controller.abort());

  try {
    const az = locale !== "en";
    if (!activeProvider()) {
      const text = az
        ? "Salam! 👋 Mən Ingri-yəm. Hələ süni intellekt açarı qoşulmayıb. `back/.env` faylında **GEMINI_API_KEY** dəyərini doldur (Google AI Studio-dan pulsuz alınır) və serveri yenidən başlat — sonra sənə kömək edə biləcəm."
        : "Hi! 👋 I'm Ingri. No AI key is configured yet. Fill **GEMINI_API_KEY** in `back/.env` (free from Google AI Studio) and restart the server — then I can help you.";
      send({ delta: text, notConfigured: true });
      send({ done: true });
      return res.end();
    }
    await ChatMessage.create({ user: req.user._id, role: "user", content: message });
    const recent = await ChatMessage.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(HISTORY_LIMIT).lean();
    const history = recent.reverse().map((m) => ({ role: m.role, content: m.content }));
    const system = systemPrompt(req.user, az ? "az" : "en", await catalogFor(req.user.activeLevel || "A1"));
    let full = "";
    for await (const delta of streamChat(system, history, controller.signal)) {
      full += delta;
      send({ delta });
    }
    if (full.trim()) await ChatMessage.create({ user: req.user._id, role: "assistant", content: full.slice(0, 12000) });
    send({ done: true });
    res.end();
  } catch (error) {
    if (controller.signal.aborted) return res.end();
    console.error("[chat]", error.message);
    const code = error.status === 429 ? "RATE_LIMITED" : error.status === 400 || error.status === 401 || error.status === 403 ? "BAD_KEY" : "PROVIDER_ERROR";
    send({ error: code });
    res.end();
    if (!res.headersSent) next(error);
  }
}
