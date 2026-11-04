import mongoose from "mongoose";

const wordSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    en: String,
    az: String,
    ipa: String,
    example: String,
    exampleAz: String,
    category: String,
    categoryAz: String,
    level: { type: String, enum: ["A1", "A2", "B1", "B2", "C1", "C2"], default: "A1" },
    pos: { type: String, default: "" },
    unit: { type: Number, default: 1 },
    rank: { type: Number, default: 0 },
    order: Number,
  },
  { timestamps: true },
);

/* ingri-indexes */
wordSchema.index({ level: 1, rank: 1, order: 1 });
wordSchema.index({ category: 1 });
wordSchema.index({ rank: 1, order: 1, en: 1 });
wordSchema.index({ en: 1 });

export default mongoose.models.Word || mongoose.model("Word", wordSchema);
