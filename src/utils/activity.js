export const DEFAULT_TZ = "Asia/Baku";

/** YYYY-MM-DD for a date in the given IANA timezone (default Asia/Baku). */
export function dayKeyIn(date = new Date(), tz = DEFAULT_TZ) {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: tz || DEFAULT_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-CA", { timeZone: DEFAULT_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  }
}

export function todayKey(date = new Date()) {
  return dayKeyIn(date, DEFAULT_TZ);
}

function prevDay(key) {
  const d = new Date(key + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Streak as it stands right now: 0 if the user missed yesterday. */
export function liveStreak(user, now = new Date()) {
  const today = dayKeyIn(now, user.timezone);
  const last = user.lastActiveDate || "";
  if (last === today || last === prevDay(today)) return user.streak || 0;
  return 0;
}

/** Mark today as active; returns true when the streak changed. */
export function touchStreak(user, now = new Date()) {
  const today = dayKeyIn(now, user.timezone);
  if (user.lastActiveDate === today) return false;
  user.streak = user.lastActiveDate === prevDay(today) ? (user.streak || 0) + 1 : 1;
  user.lastActiveDate = today;
  user.longestStreak = Math.max(user.longestStreak || 0, user.streak);
  return true;
}

export function touchActivity(user, minutes = 0) {
  const today = todayKey();
  touchStreak(user);
  if (minutes > 0) {
    user.totalMinutes = (user.totalMinutes || 0) + minutes;
    const rows = user.dailyMinutes || [];
    const row = rows.find((item) => item.date === today);
    if (row) row.minutes += minutes;
    else rows.push({ date: today, minutes });
    user.dailyMinutes = rows.slice(-21);
  }
}

export const SKILLS = ["listening", "reading", "speaking", "grammar", "words"];

function blankSkills() {
  return Object.fromEntries(SKILLS.map((skill) => [skill, 0]));
}

export function aggregateTime(log, now = new Date()) {
  const today = todayKey(now);
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 6);
  const weekStart = todayKey(weekAgo);
  const total = blankSkills();
  const todayTotals = blankSkills();
  const weekTotals = blankSkills();
  const byLevel = {};
  for (const row of log || []) {
    if (!SKILLS.includes(row.skill)) continue;
    const seconds = Number(row.seconds) || 0;
    total[row.skill] += seconds;
    if (row.date === today) todayTotals[row.skill] += seconds;
    if (row.date >= weekStart) weekTotals[row.skill] += seconds;
    const level = row.level || "A1";
    if (!byLevel[level]) byLevel[level] = { total: blankSkills(), today: blankSkills(), week: blankSkills() };
    byLevel[level].total[row.skill] += seconds;
    if (row.date === today) byLevel[level].today[row.skill] += seconds;
    if (row.date >= weekStart) byLevel[level].week[row.skill] += seconds;
  }
  return { total, today: todayTotals, week: weekTotals, byLevel };
}

export function syncMinutesFromLog(user, log) {
  if (!log?.length) return;
  const byDate = new Map();
  let totalSeconds = 0;
  for (const row of log) {
    const seconds = Number(row.seconds) || 0;
    totalSeconds += seconds;
    byDate.set(row.date, (byDate.get(row.date) || 0) + seconds);
  }
  user.totalMinutes = Math.round(totalSeconds / 60);
  user.dailyMinutes = [...byDate.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-21)
    .map(([date, seconds]) => ({ date, minutes: Math.round(seconds / 60) }));
}

export const DEFAULT_TASKS = [
  { key: "words", done: false },
  { key: "grammar", done: false },
  { key: "podcast", done: false },
  { key: "speaking", done: false },
];
