import mongoose from "mongoose";
import "./pointEventModel.js";

const dailySchema = new mongoose.Schema(
  { date: String, minutes: Number },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    username: { type: String, unique: true, sparse: true, lowercase: true, trim: true, match: /^[a-z0-9._]{3,20}$/ },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {
      type: String,
      select: false,
      required() {
        return this.authProvider !== "google" && !this.googleId;
      },
    },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, index: true, sparse: true },
    bio: { type: String, default: "", maxlength: 280 },
    level: { type: String, enum: ["A1", "A2", "B1", "B2", "C1", "C2"], default: "A1" },
    levels: { type: [String], default: ["A1"] },
    activeLevel: { type: String, enum: ["A1", "A2", "B1", "B2", "C1", "C2"], default: "A1" },
    placementCompleted: { type: Boolean, default: false },
    suggestedLevel: { type: String, default: "" },
    plans: {
      type: [
        {
          level: String,
          dailyMinutes: Number,
          targetLevel: String,
          targetDate: String,
        },
      ],
      default: [],
    },
    learningGoals: { type: [String], default: [] },
    avatarType: { type: String, enum: ["preset", "upload", "none"], default: "preset" },
    avatarPreset: { type: String, default: "aysel" },
    avatarUrl: { type: String, default: "" },
    gender: { type: String, enum: ["female", "male", ""], default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    verifyTokenHash: { type: String, select: false },
    verifyTokenExpires: { type: Date, select: false },
    resetTokenHash: { type: String, select: false },
    resetTokenExpires: { type: Date, select: false },
    failedLogins: { type: Number, default: 0 },
    lockUntil: { type: Date },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: "" },
    longestStreak: { type: Number, default: 0 },
    timezone: { type: String, default: "Asia/Baku" },
    preferences: {
      theme: { type: String, enum: ["light", "dark", "system"], default: "light" },
      accent: { type: String, enum: ["ink", "lilac", "aqua", "peach", "mint", "rose", "blue"], default: "ink" },
      fontSize: { type: String, enum: ["small", "normal", "large"], default: "normal" },
      reducedMotion: { type: Boolean, default: false },
      sound: { type: Boolean, default: true },
      volume: { type: Number, min: 0, max: 1, default: 0.6 },
      updatedAt: { type: Number, default: 0 },
    },
    totalMinutes: { type: Number, default: 0 },
    dailyMinutes: { type: [dailySchema], default: [] },
    city: { type: String, default: "" },
    locale: { type: String, enum: ["az", "en", "ru"], default: "az" },
  },
  { timestamps: true },
);

userSchema.pre("validate", async function ensureUsername() {
  if (this.username) return;
  const { uniqueUsername } = await import("../utils/username.js");
  this.username = await uniqueUsername(this.constructor, this.email?.split("@")[0] || this.name, this._id);
});

userSchema.pre("save", function syncLevels() {
  const allowed = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const levels = (this.levels || []).filter((level) => allowed.includes(level));
  this.levels = levels.length ? [...new Set(levels)] : [allowed.includes(this.level) ? this.level : "A1"];
  if (!this.levels.includes(this.activeLevel)) this.activeLevel = this.levels[0];
  this.level = this.activeLevel;
});

// Persist queued points history rows (see utils/points.js award()).
userSchema.post("save", async function writePoints(doc) {
  const rows = doc.$locals?.points;
  if (!rows?.length) return;
  doc.$locals.points = [];
  try {
    await mongoose.model("PointEvent").insertMany(rows, { ordered: false });
  } catch (error) {
    console.warn("[points] history write failed:", error.message);
  }
});

export default mongoose.models.User || mongoose.model("User", userSchema);
