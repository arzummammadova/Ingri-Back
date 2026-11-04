import mongoose from "mongoose";

const speakingSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    category: String,
    categoryAz: String,
    en: String,
    az: String,
    tip: String,
    tipAz: String,
    level: String,
    order: Number,
  },
  { timestamps: true },
);

/* ingri-indexes */
speakingSchema.index({ level: 1, order: 1 });
speakingSchema.index({ category: 1, order: 1 });
speakingSchema.index({ order: 1 });

export default mongoose.models.Speaking || mongoose.model("Speaking", speakingSchema);
