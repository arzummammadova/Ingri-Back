/**
 * Sequential learning path (podcasts, grammar, listening, speaking).
 *
 * Rules
 *  - Items of a level are ordered by `order` (then _id). Completed items are always open.
 *  - Inside an open level only the first not-completed item ("current") is open; later ones are locked
 *    until it is finished. Inserting new content never re-locks something already completed.
 *  - Levels up to the user's highest chosen level are open. The next level opens once the previous level
 *    (for that kind) is open and at least LEVEL_UNLOCK_RATIO of its items are completed — "level by level".
 *    Inside the previous level the remaining items keep their sequential order.
 *  - Admins are never locked.
 */
import mongoose from "mongoose";
import { LEVELS } from "./listQuery.js";

export const SEQ_KINDS = {
  podcast: { model: "Podcast", fields: "slug title titleAz level order accent minutes summary summaryAz durationSec publishedAt createdAt audioUrl" },
  grammar: { model: "Grammar", fields: "slug title titleAz level order accent minutes createdAt" },
  listening: { model: "Listening", fields: "slug title titleAz level order accent minutes createdAt" },
  speaking: { model: "Speaking", fields: "slug en az category categoryAz level order createdAt" },
};
/** Share of a level's items that must be completed before the next level opens (ceil, so 5 items -> 4). */
export const LEVEL_UNLOCK_RATIO = 0.8;
/** Number of completed items of a level (with `total` items) needed to open the next level. */
export const requiredToUnlock = (total) => Math.ceil(Math.max(0, total) * LEVEL_UNLOCK_RATIO - 1e-9);

export const isSequential = (kind) => Object.prototype.hasOwnProperty.call(SEQ_KINDS, kind);

const CACHE_MS = 5 * 60 * 1000;
const cache = new Map();

/** All items of a kind in path order (cached for a few minutes; content changes only on deploy/seed). */
export async function pathItems(kind) {
  const hit = cache.get(kind);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.items;
  const Model = mongoose.models[SEQ_KINDS[kind].model];
  const rows = await Model.find({}, SEQ_KINDS[kind].fields).sort({ order: 1, _id: 1 }).lean();
  const items = rows
    .filter((row) => LEVELS.includes(row.level))
    .sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level) || (a.order ?? 0) - (b.order ?? 0) || String(a._id).localeCompare(String(b._id)));
  cache.set(kind, { at: Date.now(), items });
  return items;
}
export function clearPathCache() {
  cache.clear();
}

/** Slugs of `kind` the user has completed (items map + legacy "kind:slug" keys for non quiz-gated kinds). */
export function completedSet(progress, kind) {
  const set = new Set();
  const items = progress?.items instanceof Map ? Object.fromEntries(progress.items) : progress?.items || {};
  for (const item of Object.values(items)) if (item?.kind === kind && item.completed) set.add(item.slug);
  if (kind !== "podcast" && kind !== "listening") {
    for (const key of progress?.completed || []) if (key.startsWith(`${kind}:`)) set.add(key.slice(kind.length + 1));
  }
  return set;
}

function baseLevelIndex(user) {
  const chosen = [...(user?.levels || []), user?.activeLevel, user?.level].filter((l) => LEVELS.includes(l));
  return chosen.length ? Math.max(...chosen.map((l) => LEVELS.indexOf(l))) : 0;
}

/**
 * Full path state for a user. Returns
 *  { levels: [{ level, total, done, unlocked, complete, required, passed, gate }]
 *  (required = items needed to open the next level, passed = done >= required,
 *   gate = { level, done, required } of the previous level when this level is locked), bySlug: Map(slug -> { locked, current, completed, index, level, prev }) , items }
 */
export async function buildPath(kind, user, progress) {
  const items = await pathItems(kind);
  const done = completedSet(progress, kind);
  const admin = user?.role === "admin";
  const base = baseLevelIndex(user);
  const levels = [];
  const bySlug = new Map();
  let prevPassed = true;
  let prevLevel = null;
  LEVELS.forEach((level, levelIndex) => {
    const list = items.filter((item) => item.level === level);
    const doneCount = list.filter((item) => done.has(item.slug)).length;
    const unlocked = admin || levelIndex <= base || prevPassed;
    const complete = doneCount === list.length;
    const required = requiredToUnlock(list.length);
    const passed = doneCount >= required;
    const gate = unlocked || !prevLevel ? null : { level: prevLevel.level, done: prevLevel.done, required: prevLevel.required };
    levels.push({ level, total: list.length, done: doneCount, unlocked, complete, required, passed, gate });
    let frontierSeen = false;
    let prev = null;
    list.forEach((item, index) => {
      const completed = done.has(item.slug);
      let locked = false;
      let current = false;
      if (!completed) {
        if (!unlocked) locked = true;
        else if (!frontierSeen) { current = true; frontierSeen = true; }
        else locked = !admin;
      }
      bySlug.set(item.slug, { locked, current, completed, index, level, prev: locked ? prev : null });
      if (!completed && !prev) prev = { slug: item.slug, title: item.title || item.en || item.slug, titleAz: item.titleAz || item.az || "" };
    });
    // "level by level": the next level (above the user's own) opens when this one is open and ≥80% done
    prevPassed = unlocked && passed;
    prevLevel = levels[levels.length - 1];
  });
  return { levels, bySlug, items, done };
}

/** Access for one item: { locked, reason: "previous" | "level", prev } (prev = the item to finish first). */
export async function accessFor(kind, slug, user, progress) {
  if (!isSequential(kind) || !user) return { locked: false };
  const path = await buildPath(kind, user, progress);
  const state = path.bySlug.get(slug);
  if (!state || !state.locked) return { locked: false };
  const level = path.levels.find((l) => l.level === state.level);
  const levelLocked = Boolean(level && !level.unlocked);
  return { locked: true, reason: levelLocked ? "level" : "previous", prev: state.prev, level: state.level, gate: levelLocked ? level.gate : null };
}

/** Strip the learnable body of a locked item so it cannot be used before it opens. */
export function lockedView(item, access) {
  const { sentences, quiz, questions, lines, audioUrl, glossary, explanation, explanationAz, rules, rulesAz, examples, tip, tipAz, ...rest } = item;
  return { ...rest, locked: true, lock: { reason: access.reason, prev: access.prev || null, level: access.level, gate: access.gate || null, ratio: LEVEL_UNLOCK_RATIO } };
}
