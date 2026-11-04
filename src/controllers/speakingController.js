import Speaking from "../models/speakingModel.js";
import { createContentHandlers } from "../utils/contentHandlers.js";

const handlers = createContentHandlers(Speaking, {
  search: ["en", "az", "category", "categoryAz"],
  filters: ["level", "category"],
  sorts: { order: { order: 1 }, en: { en: 1 }, level: { level: 1, order: 1 }, category: { category: 1, order: 1 } },
  projection: "slug en az category categoryAz level order",
});
export const listSpeaking = handlers.list;
export const getSpeaking = handlers.getOne;
