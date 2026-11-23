/**
 * Single source of truth for points (XP). Every award goes through award(), which bumps user.xp
 * and queues a history row; rows are written by the User post-save hook (see authModel.js).
 */
export const POINT_RULES = {
  content_complete: { points: 10, note: "First real completion of a video, movie, book or grammar lesson (watched/read to ≥90%)" },
  podcast_quiz: { points: 30, variable: true, note: "Podcast completed: quiz passed with ≥60% (first time only) → score × 0.3 (max 30)" },
  grammar_quiz_pass: { points: 25, note: "Grammar quiz passed with ≥70% (first time only)" },
  listening_pass: { points: 20, variable: true, note: "Listening completed: quiz passed with ≥60% (first time only) → score × 0.2 (max 20)" },
  speaking_best: { points: 10, variable: true, note: "Speaking item completed with ≥80% (first time only) → score ÷ 10 (max 10)" },
  word_known: { points: 10, note: "Word marked as known (once per word, ever)" },
  flashcards_session: { points: 5, note: "Flashcards session of ≥10 cards finished to the end (max 3 per day)" },
  daily_active: { points: 5, note: "First completed activity of the day (just opening a page gives nothing)" },
  streak_week: { points: 20, note: "Bonus every 7-day streak (7, 14, 21 …), once per milestone" },
  placement: { points: 30, note: "Placement test completed (once)" },
};

/** Sources that may only ever be awarded once per (user, ref). */
export const ONE_TIME = new Set(["content_complete", "podcast_quiz", "grammar_quiz_pass", "listening_pass", "speaking_best", "word_known", "placement", "streak_week", "daily_active"]);

export const POINTS_PER_LEVEL = 250;

/** Podcasts and listening items complete only when their quiz is passed. */
export const QUIZ_PASS = 60;
export const QUIZ_GATED = new Set(["podcast", "listening"]);

export function award(user, source, ref = "", points) {
  if (!user || !POINT_RULES[source]) return 0;
  const value = Math.max(0, Math.round(points ?? POINT_RULES[source].points));
  if (!value) return 0;
  user.xp = (user.xp || 0) + value;
  if (!user.$locals) return value;
  (user.$locals.points ||= []).push({ user: user._id, source, points: value, ref: String(ref || "").slice(0, 120) });
  return value;
}

export function pointsLevel(xp = 0) {
  const level = Math.floor(xp / POINTS_PER_LEVEL) + 1;
  const into = xp % POINTS_PER_LEVEL;
  return { level, into, next: POINTS_PER_LEVEL, percent: Math.round((into / POINTS_PER_LEVEL) * 100) };
}

/**
 * Award a one-time source at most once per (user, source, ref). The key is remembered on the progress doc
 * (`awarded`) and, for older accounts, checked against the points history, so retries / re-toggles /
 * double requests never pay twice. Returns the points given (0 when already awarded).
 */
export async function awardOnce(user, progress, source, ref, points) {
  if (!user || !progress || !POINT_RULES[source]) return 0;
  const key = `${source}:${String(ref || "").slice(0, 120)}`;
  progress.awarded ||= [];
  if (progress.awarded.includes(key)) return 0;
  const { default: PointEvent } = await import("../models/pointEventModel.js");
  const seen = await PointEvent.exists({ user: user._id, source, ref: String(ref || "").slice(0, 120) });
  progress.awarded.push(key);
  if (seen) return 0;
  const value = award(user, source, ref, points);
  if (value && source !== "daily_active" && source !== "streak_week") await completionBonus(user, progress);
  return value;
}

/** Daily + weekly-streak bonus, paid only together with a real completion (never for just visiting). */
export async function completionBonus(user, progress) {
  const { dayKeyIn } = await import("./activity.js");
  const today = dayKeyIn(new Date(), user.timezone);
  let total = 0;
  total += await awardOnce(user, progress, "daily_active", today);
  const streak = user.streak || 0;
  if (streak > 0 && streak % 7 === 0) total += await awardOnce(user, progress, "streak_week", `${streak} days · ${today}`);
  return total;
}
