import mongoose from "mongoose";

const refreshSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revoked: { type: Boolean, default: false },
    replacedBy: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.RefreshToken || mongoose.model("RefreshToken", refreshSchema);
