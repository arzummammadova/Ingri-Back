import Grammar from "../models/grammarModel.js";
import { createContentHandlers } from "../utils/contentHandlers.js";

const handlers = createContentHandlers(Grammar, {
  search: ["title", "titleAz", "slug"],
  filters: ["level", "accent"],
  sorts: { order: { order: 1 }, title: { title: 1 }, level: { level: 1, order: 1 }, minutes: { minutes: 1 } },
  projection: "slug title titleAz level minutes accent order",
});
export const listGrammar = handlers.list;
export const getGrammar = handlers.getOne;
