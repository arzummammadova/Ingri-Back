import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true, maxlength: 12000 },
  },
  { timestamps: true },
);

chatMessageSchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.ChatMessage || mongoose.model("ChatMessage", chatMessageSchema);
