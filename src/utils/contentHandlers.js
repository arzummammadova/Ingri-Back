import Progress from "../models/progressModel.js";
import { userFromRequest } from "../middleware/authMiddleware.js";
import { runPagedList, wantsPage } from "./listQuery.js";
import { accessFor, buildPath, completedSet, isSequential, lockedView } from "./sequence.js";

async function viewer(req) {
  const user = await userFromRequest(req);
  if (!user) return { user: null, progress: null };
  const progress = await Progress.findOne({ user: user._id }, { items: 1, completed: 1 }).lean();
  return { user, progress };
}

/**
 * List + detail handlers for a content collection.
 * GET /?page=1&limit=12&sort=title&order=asc&q=..&level=A1,A2&skill=..  -> paginated
 * GET / (no page param)                                                 -> legacy full list
 * Sequential kinds (podcast, grammar, listening, speaking) get `locked` / `current` per item for signed-in users,
 * and a locked detail returns only its header (no transcript, audio or quiz).
 */
export function createContentHandlers(Model, options = {}) {
  const kind = options.kind ?? Model.modelName.toLowerCase();
  return {
    async list(req, res, next) {
      try {
        if (wantsPage(req.query)) {
          const { user, progress } = await viewer(req);
          const done = user ? completedSet(progress, kind) : null;
          const page = await runPagedList(Model, req.query, options, done);
          if (user && isSequential(kind)) {
            const path = await buildPath(kind, user, progress);
            page.items = page.items.map((item) => {
              const state = path.bySlug.get(item.slug);
              return { ...item, locked: Boolean(state?.locked), current: Boolean(state?.current) };
            });
            page.levelsState = path.levels;
          }
          return res.json(page);
        }
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
        if (isSequential(kind)) {
          const { user, progress } = await viewer(req);
          const access = await accessFor(kind, item.slug, user, progress);
          if (access.locked) return res.json({ item: lockedView(item, access) });
        }
        res.json({ item });
      } catch (error) {
        next(error);
      }
    },
  };
}
