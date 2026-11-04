import mongoose from "mongoose";

/** A user's own flashcard ("Mənim kartlarım" deck). */
const flashcardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    word: { type: String, trim: true, maxlength: 120, required: true },
    translation: { type: String, trim: true, maxlength: 200, required: true },
    example: { type: String, trim: true, maxlength: 400, default: "" },
    category: { type: String, trim: true, maxlength: 60, default: "" },
    status: { type: String, enum: ["new", "learning", "known"], default: "new" },
  },
  { timestamps: true },
);

flashcardSchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.Flashcard || mongoose.model("Flashcard", flashcardSchema);
