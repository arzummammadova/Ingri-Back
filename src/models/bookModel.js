import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: String,
    author: String,
    year: Number,
    level: String,
    description: String,
    descriptionAz: String,
    sourceUrl: String,
    downloadUrl: String,
    chapters: [{ title: String, text: String }],
    order: Number,
  },
  { timestamps: true },
);

/* ingri-indexes */
bookSchema.index({ level: 1, order: 1 });
bookSchema.index({ order: 1 });

export default mongoose.models.Book || mongoose.model("Book", bookSchema);
