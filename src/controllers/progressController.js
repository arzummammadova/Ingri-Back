import mongoose from "mongoose";
import Progress from "../models/progressModel.js";
import "../models/podcastModel.js";
import "../models/grammarModel.js";
import "../models/listeningModel.js";
import "../models/speakingModel.js";
import "../models/videoModel.js";
import "../models/movieModel.js";
import "../models/bookModel.js";
import User from "../models/authModel.js";
import { DEFAULT_TASKS, aggregateTime, syncMinutesFromLog, touchActivity } from "../utils/activity.js";
import { publicUser } from "../utils/publicUser.js";
import { award, awardOnce, completionBonus, POINT_RULES, pointsLevel, QUIZ_GATED, QUIZ_PASS } from "../utils/points.js";
import { accessFor, buildPath, isSequential } from "../utils/sequence.js";
import PointEvent from "../models/pointEventModel.js";

export const ITEM_KINDS = ["video", "movie", "podcast", "book", "chapter", "grammar", "listening", "speaking"];
const CONTENT_MODELS = {
  video: "Video", movie: "Movie", podcast: "Podcast", book: "Book", grammar: "Grammar", listening: "Listening", speaking: "Speaking",
};
/** Kinds whose first completion pays content_complete (quiz-gated kinds and speaking pay through their own rule). */
const CONTENT_POINTS = new Set(["video", "movie", "book", "grammar"]);
const GRAMMAR_PASS = 70;
const SPEAKING_PASS = 80;

class HttpError extends Error {
  constructor(status, code, extra = {}) {
    super(code);
    this.status = status;
    this.code = code;
    this.extra = extra;
  }
}

/**
 * Wraps a progress handler `(req, progress) => payload`. Progress uses optimistic concurrency, so if two requests
 * race, the loser is retried on fresh documents instead of paying points twice or losing an update.
 */
function handler(fn) {
  return async (req, res, next) => {
    for (let attempt = 0; ; attempt += 1) {
      try {
        const progress = await loadProgress(req.user._id);
        const payload = await fn(req, progress);
        return res.json(payload);
      } catch (error) {
        if (error instanceof HttpError) return res.status(error.status).json({ code: error.code, ...error.extra });
        if (error?.name === "VersionError" && attempt < 3) {
          const fresh = await User.findById(req.user._id);
          if (fresh) req.user = fresh;
          continue;
        }
        return next(error);
      }
    }
  };
}

/** Locked items (later in the path / higher level) can't be completed or scored. */
async function assertOpen(kind, slug, req, progress) {
  if (!isSequential(kind)) return;
  const access = await accessFor(kind, slug, req.user, progress);
  if (access.locked) throw new HttpError(403, "LOCKED", { lock: { reason: access.reason, prev: access.prev || null, level: access.level, gate: access.gate || null } });
}

async function contentDoc(kind, slug, fields) {
  const Model = mongoose.models[CONTENT_MODELS[kind]];
  if (!Model) return null;
  return Model.findOne({ slug }, fields).lean();
}

/** Score a multiple-choice quiz on the server from the submitted answer indexes (0–100). */
function scoreAnswers(questions, answers) {
  if (!Array.isArray(questions) || !questions.length) return null;
  if (!Array.isArray(answers) || answers.length !== questions.length) throw new HttpError(400, "ANSWERS_REQUIRED", { expected: questions.length });
  const hits = questions.reduce((sum, q, i) => sum + (Number(answers[i]) === Number(q.answer) ? 1 : 0), 0);
  return Math.round((hits / questions.length) * 100);
}

/** Idempotent: percent only grows, completion is sticky. Returns true on first completion. */
export function markItem(progress, user, { kind, slug, level, percent = 0, completed = false }, { fromQuiz = false } = {}) {
  if (!progress.items) progress.items = new Map();
  const key = `${kind}:${slug}`;
  const prev = progress.items.get(key);
  const pct = Math.max(Number(prev?.percent || 0), Math.min(100, Math.round(percent)));
  // Podcasts / listening: only a passed quiz completes them (listening to the end is not enough).
  const gated = QUIZ_GATED.has(kind) && !fromQuiz;
  const done = Boolean(prev?.completed) || (gated ? false : completed || pct >= 90);
  const justCompleted = done && !prev?.completed;
  progress.items.set(key, {
    kind,
    slug,
    level: level || prev?.level || user?.activeLevel || "",
    percent: done ? 100 : gated ? Math.min(pct, 95) : pct,
    completed: done,
    completedAt: prev?.completedAt || (done ? new Date() : undefined),
    updatedAt: new Date(),
  });
  if (justCompleted) {
    const legacy = `${kind}:${slug}`;
    if (!progress.completed.includes(legacy)) progress.completed.push(legacy);
    if (kind === "video" && !progress.watchedVideos.includes(slug)) progress.watchedVideos.push(slug);
    if (kind === "movie" && !progress.watchedMovies.includes(slug)) progress.watchedMovies.push(slug);
  }
  return justCompleted;
}

async function loadProgress(userId) {
  let progress = await Progress.findOne({ user: userId });
  if (!progress) progress = await Progress.create({ user: userId, tasks: DEFAULT_TASKS });
  return progress;
}

async function persist(progress, user) {
  await progress.save();
  await user.save();
}

function serialize(progress, user) {
  const map = (value) => (value instanceof Map ? Object.fromEntries(value) : value || {});
  return {
    completed: progress.completed || [],
    quizScores: map(progress.quizScores),
    wordStatus: map(progress.wordStatus),
    podcastSeconds: map(progress.podcastSeconds),
    listeningScores: map(progress.listeningScores),
    speakingBest: map(progress.speakingBest),
    tasks: progress.tasks || [],
    podcastQuiz: map(progress.podcastQuiz),
    favoriteWords: progress.favoriteWords || [],
    watchedVideos: progress.watchedVideos || [],
    watchedMovies: progress.watchedMovies || [],
    time: aggregateTime(progress.timeLog),
    items: map(progress.items),
    user: publicUser(user),
  };
}

export const getProgress = handler(async (req, progress) => serialize(progress, req.user));

/** Learning path for one kind and level: ordered items with completed / current / locked + per-level state. */
export const getPath = handler(async (req, progress) => {
  const kind = String(req.params.kind || "");
  if (!isSequential(kind)) throw new HttpError(404, "NOT_FOUND");
  const path = await buildPath(kind, req.user, progress);
  const want = String(req.query.level || "").toUpperCase();
  const level = path.levels.find((l) => l.level === want)?.level || req.user.activeLevel || "A1";
  const items = path.items
    .filter((item) => item.level === level)
    .map(({ _id, ...item }) => {
      const state = path.bySlug.get(item.slug);
      return { ...item, completed: state.completed, current: state.current, locked: state.locked, percent: Number(progress.items?.get(`${kind}:${item.slug}`)?.percent || 0) };
    });
  return { kind, level, levels: path.levels, items };
});

/** Listening time only. Reaching the end records the listen; completion + points need the quiz (savePodcastQuiz). */
export const savePodcast = handler(async (req, progress) => {
  await assertOpen("podcast", req.body.slug, req, progress);
  const previous = Number(progress.podcastSeconds.get(req.body.slug) || 0);
  progress.podcastSeconds.set(req.body.slug, Math.max(previous, req.body.seconds));
  if (req.body.completed) markItem(progress, null, { kind: "podcast", slug: req.body.slug, percent: 95 });
  touchActivity(req.user, req.body.completed ? 2 : 1);
  await persist(progress, req.user);
  return serialize(progress, req.user);
});

export const saveQuiz = handler(async (req, progress) => {
  const { slug } = req.body;
  await assertOpen("grammar", slug, req, progress);
  const doc = await contentDoc("grammar", slug, "slug level quiz");
  if (!doc) throw new HttpError(404, "NOT_FOUND");
  const score = scoreAnswers(doc.quiz, req.body.answers) ?? req.body.score ?? 0;
  const prev = Number(progress.quizScores.get(slug) || 0);
  progress.quizScores.set(slug, Math.max(prev, score));
  let awarded = 0;
  const passed = score >= GRAMMAR_PASS;
  if (passed) {
    markItem(progress, null, { kind: "grammar", slug, level: doc.level, completed: true });
    awarded = await awardOnce(req.user, progress, "grammar_quiz_pass", slug);
    const task = progress.tasks.find((item) => item.key === "grammar");
    if (task) task.done = true;
  }
  touchActivity(req.user, 3);
  await persist(progress, req.user);
  return { ...serialize(progress, req.user), score, passed, awarded, passMark: GRAMMAR_PASS };
});

export const saveListening = handler(async (req, progress) => {
  const { slug } = req.body;
  await assertOpen("listening", slug, req, progress);
  const doc = await contentDoc("listening", slug, "slug level questions");
  if (!doc) throw new HttpError(404, "NOT_FOUND");
  const score = scoreAnswers(doc.questions, req.body.answers) ?? req.body.score ?? 0;
  const prev = Number(progress.listeningScores.get(slug) || 0);
  progress.listeningScores.set(slug, Math.max(prev, score));
  let awarded = 0;
  const passed = score >= QUIZ_PASS;
  if (passed) {
    markItem(progress, null, { kind: "listening", slug, level: doc.level, completed: true }, { fromQuiz: true });
    awarded = await awardOnce(req.user, progress, "listening_pass", slug, Math.min(20, Math.round(score * 0.2)));
  }
  touchActivity(req.user, 2);
  await persist(progress, req.user);
  return { ...serialize(progress, req.user), score, passed, awarded, passMark: QUIZ_PASS };
});

/** Speaking: the best score is kept; points are paid once, when the item is completed (≥80%). */
export const saveSpeaking = handler(async (req, progress) => {
  const { slug, score } = req.body;
  await assertOpen("speaking", slug, req, progress);
  const prev = Number(progress.speakingBest.get(slug) || 0);
  if (score > prev) progress.speakingBest.set(slug, score);
  let awarded = 0;
  if (score >= SPEAKING_PASS) {
    markItem(progress, null, { kind: "speaking", slug, completed: true });
    awarded = await awardOnce(req.user, progress, "speaking_best", slug, Math.min(10, Math.round(score / 10)));
  }
  const task = progress.tasks.find((item) => item.key === "speaking");
  if (task && score >= 60) task.done = true;
  touchActivity(req.user, 1);
  await persist(progress, req.user);
  return { ...serialize(progress, req.user), passed: score >= SPEAKING_PASS, awarded, passMark: SPEAKING_PASS };
});

export const saveWord = handler(async (req, progress) => {
  progress.wordStatus.set(req.body.slug, req.body.status);
  let awarded = 0;
  if (req.body.status === "known") awarded = await awardOnce(req.user, progress, "word_known", req.body.slug);
  const known = [...progress.wordStatus.values()].filter((status) => status === "known").length;
  const task = progress.tasks.find((item) => item.key === "words");
  if (task && known >= 5) task.done = true;
  touchActivity(req.user, 1);
  await persist(progress, req.user);
  return { ...serialize(progress, req.user), awarded };
});

/**
 * Podcast completion. With a quiz the server scores the submitted `answers`; a podcast without a quiz completes
 * only after the audio was played to the end (savePodcast completed:true). Points once, on the first pass.
 */
export const savePodcastQuiz = handler(async (req, progress) => {
  const { slug } = req.body;
  await assertOpen("podcast", slug, req, progress);
  const doc = await contentDoc("podcast", slug, "slug level quiz");
  if (!doc) throw new HttpError(404, "NOT_FOUND");
  let score;
  if (doc.quiz?.length) score = scoreAnswers(doc.quiz, req.body.answers);
  else {
    const listened = Number(progress.items?.get(`podcast:${slug}`)?.percent || 0) >= 95;
    if (!listened) throw new HttpError(409, "LISTEN_FIRST");
    score = 100;
  }
  const prev = Number(progress.podcastQuiz.get(slug) || 0);
  progress.podcastQuiz.set(slug, Math.max(prev, score));
  let awarded = 0;
  const passed = score >= QUIZ_PASS;
  if (passed) {
    markItem(progress, null, { kind: "podcast", slug, level: doc.level, completed: true }, { fromQuiz: true });
    awarded = await awardOnce(req.user, progress, "podcast_quiz", slug, Math.min(30, Math.round(score * 0.3)));
    const task = progress.tasks.find((item) => item.key === "podcast");
    if (task) task.done = true;
  }
  touchActivity(req.user, 2);
  await persist(progress, req.user);
  return { ...serialize(progress, req.user), score, passed, awarded, passMark: QUIZ_PASS };
});

export const saveTime = handler(async (req, progress) => {
  const level = req.user.levels?.includes(req.body.level) ? req.body.level : req.user.activeLevel;
  const today = new Date().toISOString().slice(0, 10);
  const seconds = Math.min(180, Math.max(1, req.body.seconds));
  const row = progress.timeLog.find((item) => item.date === today && item.level === level && item.skill === req.body.skill);
  if (row) row.seconds += seconds;
  else progress.timeLog.push({ date: today, level, skill: req.body.skill, seconds });
  progress.timeLog = progress.timeLog.slice(-400);
  syncMinutesFromLog(req.user, progress.timeLog);
  touchActivity(req.user, 0);
  await persist(progress, req.user);
  return serialize(progress, req.user);
});

export const saveWatch = handler(async (req, progress) => {
  const list = req.body.kind === "movie" ? progress.watchedMovies : progress.watchedVideos;
  if (!list.includes(req.body.id)) list.push(req.body.id);
  // Marks it as watched; points only come from real playback progress (saveItem ≥90%).
  markItem(progress, null, { kind: req.body.kind, slug: req.body.id, completed: true });
  touchActivity(req.user, 0);
  await persist(progress, req.user);
  return serialize(progress, req.user);
});

export const toggleFavorite = handler(async (req, progress) => {
  const slug = req.body.slug;
  if (progress.favoriteWords.includes(slug)) progress.favoriteWords = progress.favoriteWords.filter((item) => item !== slug);
  else progress.favoriteWords.push(slug);
  await progress.save();
  return serialize(progress, req.user);
});

export const saveTask = handler(async (req, progress) => {
  const task = progress.tasks.find((item) => item.key === req.body.key);
  if (task) task.done = req.body.done;
  else progress.tasks.push({ key: req.body.key, done: req.body.done });
  await progress.save();
  return serialize(progress, req.user);
});

/** Generic progress (video, movie, book, chapter, grammar lesson…). Quiz-gated kinds never complete here. */
export const saveItem = handler(async (req, progress) => {
  const { kind, slug } = req.body;
  if (isSequential(kind)) await assertOpen(kind, slug, req, progress);
  // Speaking completes only through a scored attempt (saveSpeaking).
  const body = kind === "speaking" ? { ...req.body, completed: false, percent: Math.min(req.body.percent || 0, 89) } : req.body;
  const justCompleted = markItem(progress, req.user, body);
  let awarded = 0;
  if (justCompleted && CONTENT_POINTS.has(kind)) awarded = await awardOnce(req.user, progress, "content_complete", `${kind}:${slug}`);
  touchActivity(req.user, 0);
  await persist(progress, req.user);
  return { ...serialize(progress, req.user), justCompleted, awarded };
});

export async function getSummary(req, res, next) {
  try {
    const progress = await loadProgress(req.user._id);
    const items = [...(progress.items?.values() || [])].filter((item) => item.kind !== "chapter");
    const byKind = {};
    const byLevel = {};
    for (const item of items) {
      if (!item.completed) continue;
      byKind[item.kind] = (byKind[item.kind] || 0) + 1;
      const lv = item.level || "—";
      byLevel[lv] ||= {};
      byLevel[lv][item.kind] = (byLevel[lv][item.kind] || 0) + 1;
    }
    const recent = items
      .filter((item) => item.completed)
      .sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0))
      .slice(0, 8);
    const totals = {};
    for (const [kind, name] of Object.entries(CONTENT_MODELS)) {
      const Model = mongoose.models[name];
      if (!Model) continue;
      const rows = await Model.aggregate([{ $group: { _id: "$level", n: { $sum: 1 } } }]);
      for (const row of rows) {
        totals[row._id || "—"] ||= {};
        totals[row._id || "—"][kind] = row.n;
      }
    }
    res.json({ byKind, byLevel, recent, totals, inProgress: items.filter((i) => !i.completed && i.percent > 0).length });
  } catch (error) {
    next(error);
  }
}

export { User };

/** Flashcards session fully finished (all chosen cards): +5 if ≥10 cards, at most 3 times a day. */
export const saveFlashcards = handler(async (req, progress) => {
  const cards = Math.max(0, Math.min(500, Number.parseInt(req.body?.cards, 10) || 0));
  let awarded = 0;
  if (cards >= 10) {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    const today = await PointEvent.countDocuments({ user: req.user._id, source: "flashcards_session", createdAt: { $gte: since } });
    if (today < 3) {
      awarded = award(req.user, "flashcards_session", `${cards} cards`);
      awarded += await completionBonus(req.user, progress);
    }
  }
  touchActivity(req.user, 1);
  await persist(progress, req.user);
  return { awarded, user: publicUser(req.user) };
});

/** Points page: total, level progress, rules, breakdown by source and recent history. */
export async function getPoints(req, res, next) {
  try {
    const [history, breakdown] = await Promise.all([
      PointEvent.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50).lean(),
      PointEvent.aggregate([{ $match: { user: req.user._id } }, { $group: { _id: "$source", points: { $sum: "$points" }, count: { $sum: 1 } } }, { $sort: { points: -1 } }]),
    ]);
    const total = req.user.xp || 0;
    const tracked = breakdown.reduce((sum, row) => sum + row.points, 0);
    res.json({
      total,
      level: pointsLevel(total),
      rules: Object.entries(POINT_RULES).map(([source, rule]) => ({ source, ...rule })),
      breakdown: [
        ...breakdown.map((row) => ({ source: row._id, points: row.points, count: row.count })),
        ...(total - tracked > 0 ? [{ source: "earlier", points: total - tracked, count: 0 }] : []),
      ],
      history: history.map((row) => ({ source: row.source, points: row.points, ref: row.ref, at: row.createdAt })),
    });
  } catch (error) {
    next(error);
  }
}
