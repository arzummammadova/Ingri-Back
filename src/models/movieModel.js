import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: String,
    year: Number,
    level: String,
    why: String,
    whyAz: String,
    vocabulary: [{ en: String, az: String }],
    trailerId: String,
    imdb: String,
    justwatch: String,
    order: Number,
  },
  { timestamps: true },
);

/* ingri-indexes */
movieSchema.index({ level: 1, order: 1 });
movieSchema.index({ order: 1 });

export default mongoose.models.Movie || mongoose.model("Movie", movieSchema);
