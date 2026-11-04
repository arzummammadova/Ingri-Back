import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: String,
    channel: String,
    level: String,
    skill: String,
    topic: String,
    minutes: Number,
    youtubeId: String,
    order: Number,
  },
  { timestamps: true },
);

/* ingri-indexes */
videoSchema.index({ level: 1, order: 1 });
videoSchema.index({ skill: 1 });
videoSchema.index({ topic: 1 });
videoSchema.index({ order: 1 });

export default mongoose.models.Video || mongoose.model("Video", videoSchema);
