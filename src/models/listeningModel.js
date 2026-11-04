import mongoose from "mongoose";

const lineSchema = new mongoose.Schema(
  { speaker: String, en: String, az: String },
  { _id: false },
);
const questionSchema = new mongoose.Schema(
  {
    prompt: String,
    promptAz: String,
    options: [String],
    answer: Number,
  },
  { _id: false },
);

const listeningSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: String,
    titleAz: String,
    level: String,
    minutes: Number,
    accent: String,
    order: Number,
    lines: [lineSchema],
    questions: [questionSchema],
  },
  { timestamps: true },
);

/* ingri-indexes */
listeningSchema.index({ level: 1, order: 1 });
listeningSchema.index({ order: 1 });

export default mongoose.models.Listening || mongoose.model("Listening", listeningSchema);
