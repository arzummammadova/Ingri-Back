import mongoose from "mongoose";

const sentenceSchema = new mongoose.Schema(
  { en: String, az: String, speaker: String, start: Number, end: Number },
  { _id: false },
);

const glossarySchema = new mongoose.Schema(
  { en: String, az: String, ipa: String, example: String },
  { _id: false },
);

const podcastSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: String,
    titleAz: String,
    level: String,
    minutes: Number,
    accent: String,
    summary: String,
    summaryAz: String,
    order: Number,
    publishedAt: Date,
    durationSec: Number,
    audioUrl: String,
    transcriptAvailable: { type: Boolean, default: true },
    alsoFor: [String],
    sentences: [sentenceSchema],
    glossary: [glossarySchema],
    quiz: [
      {
        prompt: String,
        promptAz: String,
        options: [String],
        answer: Number,
        explain: String,
        explainAz: String,
      },
    ],
  },
  { timestamps: true },
);

/* ingri-indexes */
podcastSchema.index({ level: 1, order: 1 });
podcastSchema.index({ order: 1 });
podcastSchema.index({ accent: 1 });

export default mongoose.models.Podcast || mongoose.model("Podcast", podcastSchema);
