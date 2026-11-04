import Listening from "../models/listeningModel.js";
import { createContentHandlers } from "../utils/contentHandlers.js";

const handlers = createContentHandlers(Listening, {
  search: ["title", "titleAz"],
  filters: ["level", "accent"],
  sorts: { order: { order: 1 }, title: { title: 1 }, level: { level: 1, order: 1 }, minutes: { minutes: 1 } },
  projection: "slug title titleAz level minutes accent order",
});
export const listListening = handlers.list;
export const getListening = handlers.getOne;
