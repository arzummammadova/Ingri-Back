import mongoose from "mongoose";

/** One row per points award (history for the Points page). */
const pointEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    source: { type: String, required: true },
    points: { type: Number, required: true },
    ref: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
pointEventSchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.PointEvent || mongoose.model("PointEvent", pointEventSchema);
