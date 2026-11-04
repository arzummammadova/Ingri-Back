import { liveStreak } from "./activity.js";

export function publicUser(user) {
  return {
    id: String(user._id),
    name: user.username || user.name,
    username: user.username || "",
    displayName: user.name,
    email: user.email,
    authProvider: user.authProvider || "local",
    bio: user.bio || "",
    level: user.activeLevel || user.level,
    levels: user.levels?.length ? user.levels : [user.activeLevel || user.level || "A1"],
    activeLevel: user.activeLevel || user.level || "A1",
    placementCompleted: Boolean(user.placementCompleted),
    suggestedLevel: user.suggestedLevel || "",
    plans: user.plans || [],
    learningGoals: user.learningGoals || [],
    avatarType: user.avatarType,
    avatarPreset: user.avatarPreset || "",
    avatarUrl: user.avatarUrl || "",
    role: user.role,
    isVerified: user.isVerified,
    xp: user.xp || 0,
    streak: liveStreak(user),
    longestStreak: Math.max(user.longestStreak || 0, user.streak || 0),
    totalMinutes: user.totalMinutes || 0,
    dailyMinutes: user.dailyMinutes || [],
    city: user.city || "",
    locale: user.locale || "az",
    lastActiveDate: user.lastActiveDate || "",
    timezone: user.timezone || "Asia/Baku",
    preferences: {
      theme: user.preferences?.theme || "light",
      accent: user.preferences?.accent || "ink",
      fontSize: user.preferences?.fontSize || "normal",
      reducedMotion: Boolean(user.preferences?.reducedMotion),
      sound: user.preferences?.sound !== false,
      volume: typeof user.preferences?.volume === "number" ? user.preferences.volume : 0.6,
      updatedAt: user.preferences?.updatedAt || 0,
    },
  };
}

export function publicPeer(user) {
  return {
    id: String(user._id),
    name: user.username || user.name,
    username: user.username || "",
    displayName: user.name,
    level: user.activeLevel || user.level,
    activeLevel: user.activeLevel || user.level || "A1",
    avatarType: user.avatarType,
    avatarPreset: user.avatarPreset || "",
    avatarUrl: user.avatarUrl || "",
    xp: user.xp || 0,
    streak: liveStreak(user),
    totalMinutes: user.totalMinutes || 0,
    city: user.city || "",
  };
}
