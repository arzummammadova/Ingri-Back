import { runPagedList, wantsPage } from "./listQuery.js";

/**
 * List + detail handlers for a content collection.
 * GET /?page=1&limit=12&sort=title&order=asc&q=..&level=A1,A2&skill=..  -> paginated
 * GET / (no page param)                                                 -> legacy full list
 */
export function createContentHandlers(Model, options = {}) {
  return {
    async list(req, res, next) {
      try {
        if (wantsPage(req.query)) return res.json(await runPagedList(Model, req.query, options));
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
