import User from "../models/authModel.js";
import { publicPeer } from "../utils/publicUser.js";

export async function listLeaderboard(_req, res, next) {
  try {
    const users = await User.find({ isVerified: true }).sort({ xp: -1, name: 1 }).limit(50);
    res.json({
      items: users.map((user, index) => ({ ...publicPeer(user), rank: index + 1 })),
    });
  } catch (error) {
    next(error);
  }
}

export async function getLeader(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.isVerified) return res.status(404).json({ code: "NOT_FOUND" });
    const higher = await User.countDocuments({ isVerified: true, xp: { $gt: user.xp } });
    res.json({ item: { ...publicPeer(user), rank: higher + 1 } });
  } catch {
    res.status(404).json({ code: "NOT_FOUND" });
  }
}
