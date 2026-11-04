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

export const ITEM_KINDS = ["video", "movie", "podcast", "book", "chapter", "grammar", "listening", "speaking"];
const CONTENT_MODELS = {
  video: "Video", movie: "Movie", podcast: "Podcast", book: "Book", grammar: "Grammar", listening: "Listening", speaking: "Speaking",
};

/** Idempotent: percent only grows, completion is sticky. Returns true on first completion. */
export function markItem(progress, user, { kind, slug, level, percent = 0, completed = false }) {
  if (!progress.items) progress.items = new Map();
  const key = `${kind}:${slug}`;
  const prev = progress.items.get(key);
  const pct = Math.max(Number(prev?.percent || 0), Math.min(100, Math.round(percent)));
  const done = Boolean(prev?.completed) || completed || pct >= 90;
  const justCompleted = done && !prev?.completed;
  progress.items.set(key, {
    kind,
    slug,
    level: level || prev?.level || user?.activeLevel || "",
    percent: done ? 100 : pct,
    completed: done,
    completedAt: prev?.completedAt || (done ? new Date() : undefined),
    updatedAt: new Date(),
  });
  if (justCompleted) {
    const legacy = `${kind}:${slug}`;
    if (!progress.completed.includes(legacy)) progress.completed.push(legacy);
    if (kind === "video" && !progress.watchedVideos.includes(slug)) progress.watchedVideos.push(slug);
    if (kind === "movie" && !progress.watchedMovies.includes(slug)) progress.watchedMovies.push(slug);
    if (user && kind !== "chapter") user.xp = (user.xp || 0) + 10;
  }
  return justCompleted;
}

async function loadProgress(userId) {
  let progress = await Progress.findOne({ user: userId });
  if (!progress) progress = await Progress.create({ user: userId, tasks: DEFAULT_TASKS });
  return progress;
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

export async function getProgress(req, res, next) {
  try {
    const progress = await loadProgress(req.user._id);
    res.json(serialize(progress, req.user));
  } catch (error) {
    next(error);
  }
}

export async function savePodcast(req, res, next) {
  try {
    const progress = await loadProgress(req.user._id);
    const previous = Number(progress.podcastSeconds.get(req.body.slug) || 0);
    progress.podcastSeconds.set(req.body.slug, Math.max(previous, req.body.seconds));
    const key = `podcast:${req.body.slug}`;
    let xp = 0;
    if (req.body.completed && !progress.completed.includes(key)) {
      progress.completed.push(key);
      xp += 15;
      const task = progress.tasks.find((item) => item.key === "podcast");
      if (task) task.done = true;
    }
    if (req.body.completed) markItem(progress, null, { kind: "podcast", slug: req.body.slug, completed: true });
    req.user.xp += xp;
    touchActivity(req.user, req.body.completed ? 2 : 1);
    await progress.save();
    await req.user.save();
    res.json(serialize(progress, req.user));
  } catch (error) {
    next(error);
  }
}

export async function saveQuiz(req, res, next) {
  try {
    const progress = await loadProgress(req.user._id);
    const prev = Number(progress.quizScores.get(req.body.slug) || 0);
    progress.quizScores.set(req.body.slug, Math.max(prev, req.body.score));
    const key = `grammar:${req.body.slug}`;
    if (req.body.score >= 70 && !progress.completed.includes(key)) {
      progress.completed.push(key);
      req.user.xp += 25;
      const task = progress.tasks.find((item) => item.key === "grammar");
      if (task) task.done = true;
    } else if (req.body.score > prev) {
      req.user.xp += 5;
    }
    if (req.body.score >= 70) markItem(progress, null, { kind: "grammar", slug: req.body.slug, completed: true });
    touchActivity(req.user, 3);
    await progress.save();
    await req.user.save();
    res.json(serialize(progress, req.user));
  } catch (error) {
    next(error);
  }
}

export async function saveListening(req, res, next) {
  try {
    const progress = await loadProgress(req.user._id);
    const prev = Number(progress.listeningScores.get(req.body.slug) || 0);
    progress.listeningScores.set(req.body.slug, Math.max(prev, req.body.score));
    const key = `listening:${req.body.slug}`;
    if (req.body.score >= 70 && !progress.completed.includes(key)) {
      progress.completed.push(key);
      req.user.xp += 20;
    }
    if (req.body.score >= 70) markItem(progress, null, { kind: "listening", slug: req.body.slug, completed: true });
    touchActivity(req.user, 2);
    await progress.save();
    await req.user.save();
    res.json(serialize(progress, req.user));
  } catch (error) {
    next(error);
  }
}

export async function saveSpeaking(req, res, next) {
  try {
    const progress = await loadProgress(req.user._id);
    const prev = Number(progress.speakingBest.get(req.body.slug) || 0);
    if (req.body.score > prev) {
      progress.speakingBest.set(req.body.slug, req.body.score);
      req.user.xp += Math.round(req.body.score / 10);
    }
    const key = `speaking:${req.body.slug}`;
    if (req.body.score >= 80 && !progress.completed.includes(key)) progress.completed.push(key);
    if (req.body.score >= 80) markItem(progress, null, { kind: "speaking", slug: req.body.slug, completed: true });
    const task = progress.tasks.find((item) => item.key === "speaking");
    if (task && req.body.score >= 60) task.done = true;
    touchActivity(req.user, 1);
    await progress.save();
    await req.user.save();
    res.json(serialize(progress, req.user));
  } catch (error) {
    next(error);
  }
}

export async function saveWord(req, res, next) {
  try {
    const progress = await loadProgress(req.user._id);
    const prev = progress.wordStatus.get(req.body.slug);
    progress.wordStatus.set(req.body.slug, req.body.status);
    if (req.body.status === "known" && prev !== "known") req.user.xp += 10;
    const known = [...progress.wordStatus.values()].filter((status) => status === "known").length;
    const task = progress.tasks.find((item) => item.key === "words");
    if (task && known >= 5) task.done = true;
    touchActivity(req.user, 1);
    await progress.save();
    await req.user.save();
    res.json(serialize(progress, req.user));
  } catch (error) {
    next(error);
  }
}

export async function savePodcastQuiz(req, res, next) {
  try {
    const progress = await loadProgress(req.user._id);
    const prev = Number(progress.podcastQuiz.get(req.body.slug) || 0);
    progress.podcastQuiz.set(req.body.slug, Math.max(prev, req.body.score));
    const key = `podcast:${req.body.slug}`;
    if (req.body.score >= 70 && !progress.completed.includes(key)) {
      progress.completed.push(key);
      req.user.xp += 15;
    }
    touchActivity(req.user, 0);
    await progress.save();
    await req.user.save();
    res.json(serialize(progress, req.user));
  } catch (error) {
    next(error);
  }
}

export async function saveTime(req, res, next) {
  try {
    const progress = await loadProgress(req.user._id);
    const level = req.user.levels?.includes(req.body.level) ? req.body.level : req.user.activeLevel;
    const today = new Date().toISOString().slice(0, 10);
    const seconds = Math.min(180, Math.max(1, req.body.seconds));
    const row = progress.timeLog.find((item) => item.date === today && item.level === level && item.skill === req.body.skill);
    if (row) row.seconds += seconds;
    else progress.timeLog.push({ date: today, level, skill: req.body.skill, seconds });
    progress.timeLog = progress.timeLog.slice(-400);
    syncMinutesFromLog(req.user, progress.timeLog);
    touchActivity(req.user, 0);
    await progress.save();
    await req.user.save();
    res.json(serialize(progress, req.user));
  } catch (error) {
    next(error);
  }
}

export async function saveWatch(req, res, next) {
  try {
    const progress = await loadProgress(req.user._id);
    const list = req.body.kind === "movie" ? progress.watchedMovies : progress.watchedVideos;
    if (!list.includes(req.body.id)) list.push(req.body.id);
    markItem(progress, null, { kind: req.body.kind, slug: req.body.id, completed: true });
    touchActivity(req.user, 0);
    await progress.save();
    await req.user.save();
    res.json(serialize(progress, req.user));
  } catch (error) {
    next(error);
  }
}

export async function toggleFavorite(req, res, next) {
  try {
    const progress = await loadProgress(req.user._id);
    const slug = req.body.slug;
    if (progress.favoriteWords.includes(slug)) {
      progress.favoriteWords = progress.favoriteWords.filter((item) => item !== slug);
    } else progress.favoriteWords.push(slug);
    await progress.save();
    res.json(serialize(progress, req.user));
  } catch (error) {
    next(error);
  }
}

export async function saveTask(req, res, next) {
  try {
    const progress = await loadProgress(req.user._id);
    const task = progress.tasks.find((item) => item.key === req.body.key);
    if (task) task.done = req.body.done;
    else progress.tasks.push({ key: req.body.key, done: req.body.done });
    await progress.save();
    res.json(serialize(progress, req.user));
  } catch (error) {
    next(error);
  }
}

export async function saveItem(req, res, next) {
  try {
    const progress = await loadProgress(req.user._id);
    const justCompleted = markItem(progress, req.user, req.body);
    touchActivity(req.user, 0);
    await progress.save();
    await req.user.save();
    res.json({ ...serialize(progress, req.user), justCompleted });
  } catch (error) {
    next(error);
  }
}

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
