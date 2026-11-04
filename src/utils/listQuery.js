/**
 * Shared server-side list pattern: page / limit (max 50) / sort / order / q / filters,
 * counted on the server with lean() + projection. Used by every content list endpoint.
 */
export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const MAX_LIMIT = 50;

export const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** True when the client asked for a paginated response (legacy callers get the full list). */
export function wantsPage(query) {
  return query.page !== undefined || query.paged === "1";
}

export function buildListQuery(query, { search = [], filters = [], sorts = {}, defaultSort = "order" } = {}) {
  const filter = {};
  const level = String(query.level || "").trim();
  if (level && level !== "all") {
    const levels = level.split(",").map((item) => item.trim().toUpperCase()).filter((item) => LEVELS.includes(item));
    if (levels.length === 1) filter.level = levels[0];
    else if (levels.length > 1) filter.level = { $in: levels };
  }
  for (const field of filters) {
    if (field === "level") continue;
    const raw = query[field];
    if (raw === undefined || raw === "" || raw === "all") continue;
    const values = String(raw).split(",").map((item) => item.trim().slice(0, 60)).filter(Boolean).slice(0, 10);
    if (values.length === 1) filter[field] = values[0];
    else if (values.length) filter[field] = { $in: values };
  }
  const q = String(query.q || "").trim().slice(0, 60);
  if (q && search.length) {
    const rx = new RegExp(escapeRegex(q), "i");
    filter.$or = search.map((field) => ({ [field]: rx }));
  }
  const sortKey = sorts[query.sort] ? String(query.sort) : defaultSort;
  const dir = query.order === "desc" ? -1 : 1;
  const sort = { ...(sorts[sortKey] ? Object.fromEntries(Object.entries(sorts[sortKey]).map(([k, v]) => [k, v * dir])) : { order: dir }), _id: dir };
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number.parseInt(query.limit, 10) || 12));
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  return { filter, sort, limit, page, sortKey, order: dir === 1 ? "asc" : "desc" };
}

/** Distinct values for filter selects (small, indexed fields only). */
export async function facetsFor(Model, filters, base = {}) {
  const fields = filters.filter((field) => field !== "level");
  const entries = await Promise.all(
    fields.map(async (field) => [field, (await Model.distinct(field, base)).filter((v) => v !== null && v !== "").sort()]),
  );
  const levels = (await Model.distinct("level", base)).filter((v) => LEVELS.includes(v)).sort();
  return { level: levels, ...Object.fromEntries(entries) };
}

export async function runPagedList(Model, query, options) {
  const { filter, sort, limit, page, sortKey, order } = buildListQuery(query, options);
  const [items, total, facets] = await Promise.all([
    Model.find(filter, options.projection).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Model.countDocuments(filter),
    query.facets === "0" ? null : facetsFor(Model, options.filters || []),
  ]);
  return { items, total, page, limit, pages: Math.max(1, Math.ceil(total / limit)), sort: sortKey, order, facets };
}
