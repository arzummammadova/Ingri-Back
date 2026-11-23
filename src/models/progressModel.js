import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  { key: String, done: { type: Boolean, default: false } },
  { _id: false },
);

const itemSchema = new mongoose.Schema(
  {
    kind: String,
    slug: String,
    level: String,
    percent: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    completedAt: Date,
    updatedAt: Date,
  },
  { _id: false },
);

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    completed: { type: [String], default: [] },
    quizScores: { type: Map, of: Number, default: {} },
    wordStatus: { type: Map, of: String, default: {} },
    podcastSeconds: { type: Map, of: Number, default: {} },
    listeningScores: { type: Map, of: Number, default: {} },
    speakingBest: { type: Map, of: Number, default: {} },
    tasks: { type: [taskSchema], default: [] },
    timeLog: {
      type: [{ date: String, level: String, skill: String, seconds: Number }],
      default: [],
    },
    favoriteWords: { type: [String], default: [] },
    watchedVideos: { type: [String], default: [] },
    watchedMovies: { type: [String], default: [] },
    podcastQuiz: { type: Map, of: Number, default: {} },
    items: { type: Map, of: itemSchema, default: {} },
    /** One-time point keys already paid ("source:ref") — see utils/points.js awardOnce(). */
    awarded: { type: [String], default: [] },
  },
  // optimisticConcurrency: two parallel requests can't both read "not awarded yet" and pay twice.
  { timestamps: true, optimisticConcurrency: true },
);

export default mongoose.models.Progress || mongoose.model("Progress", progressSchema);
