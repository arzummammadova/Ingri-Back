import mongoose from "mongoose";

export const NOTE_COLORS = ["paper", "lilac", "mint", "peach", "aqua", "rose"];

const contextSchema = new mongoose.Schema(
  {
    type: { type: String, trim: true, maxlength: 40 },
    slug: { type: String, trim: true, maxlength: 160 },
    title: { type: String, trim: true, maxlength: 200 },
    url: { type: String, trim: true, maxlength: 400 },
  },
  { _id: false },
);

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, trim: true, maxlength: 120, default: "" },
    content: { type: String, trim: true, maxlength: 5000, required: true },
    color: { type: String, enum: NOTE_COLORS, default: "paper" },
    pinned: { type: Boolean, default: false },
    context: { type: contextSchema, default: undefined },
  },
  { timestamps: true },
);

noteSchema.index({ user: 1, pinned: -1, updatedAt: -1 });

export default mongoose.models.Note || mongoose.model("Note", noteSchema);
