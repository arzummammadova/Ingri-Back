/**
 * Single source of truth for points (XP). Every award goes through award(), which bumps user.xp
 * and queues a history row; rows are written by the User post-save hook (see authModel.js).
 */
export const POINT_RULES = {
  content_complete: { points: 10, note: "First completion of a video, movie, book, grammar lesson or speaking item (progress tracker, ≥90%)" },
  podcast_quiz: { points: 30, variable: true, note: "Podcast completed: quiz passed with ≥60% (first time) → score × 0.3 (max 30)" },
  grammar_quiz_pass: { points: 25, note: "Grammar quiz passed with ≥70% (first time)" },
  grammar_quiz_improve: { points: 5, note: "Grammar quiz: new best score below the pass mark" },
  listening_pass: { points: 20, variable: true, note: "Listening completed: quiz passed with ≥60% (first time) → score × 0.2 (max 20)" },
  speaking_best: { points: 10, variable: true, note: "Speaking: new best score → score ÷ 10 (max 10)" },
  word_known: { points: 10, note: "Word marked as known (first time)" },
  flashcards_session: { points: 5, note: "Flashcards session of ≥10 cards (max 3 per day)" },
  daily_active: { points: 5, note: "First learning activity of the day" },
  streak_week: { points: 20, note: "Bonus every 7-day streak (7, 14, 21 …)" },
  placement: { points: 30, note: "Placement test completed (once)" },
};

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
