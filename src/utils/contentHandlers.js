import Progress from "../models/progressModel.js";
import { userFromRequest } from "../middleware/authMiddleware.js";
import { runPagedList, wantsPage } from "./listQuery.js";

/** Slugs of this kind the signed-in user has completed (null when signed out). */
async function completedSlugs(req, kind) {
  if (!kind) return null;
  const user = await userFromRequest(req);
  if (!user) return null;
  const progress = await Progress.findOne({ user: user._id }, { items: 1, completed: 1 }).lean();
  const set = new Set();
  for (const item of Object.values(progress?.items || {})) if (item?.kind === kind && item.completed) set.add(item.slug);
  // legacy "kind:slug" completions (not for quiz-gated kinds, which now need a passed quiz)
  if (kind !== "podcast" && kind !== "listening") for (const key of progress?.completed || []) if (key.startsWith(`${kind}:`)) set.add(key.slice(kind.length + 1));
  return set;
}

/**
 * List + detail handlers for a content collection.
 * GET /?page=1&limit=12&sort=title&order=asc&q=..&level=A1,A2&skill=..  -> paginated
 * GET / (no page param)                                                 -> legacy full list
 */
export function createContentHandlers(Model, options = {}) {
  return {
    async list(req, res, next) {
      try {
        if (wantsPage(req.query)) return res.json(await runPagedList(Model, req.query, options, await completedSlugs(req, options.kind ?? Model.modelName.toLowerCase())));
        const items = await Model.find({}, options.legacyProjection).sort({ order: 1 }).lean();
        res.json({ items });
      } catch (error) {
        next(error);
      }
    },
    async getOne(req, res, next) {
      try {
        const item = await Model.findOne({ slug: req.params.slug }).lean();
        if (!item) return res.status(404).json({ code: "NOT_FOUND" });
        res.json({ item });
      } catch (error) {
        next(error);
      }
    },
  };
}
