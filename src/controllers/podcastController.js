import Podcast from "../models/podcastModel.js";
import { createContentHandlers } from "../utils/contentHandlers.js";

const handlers = createContentHandlers(Podcast, {
  search: ["title", "titleAz", "summary", "summaryAz"],
  filters: ["level", "accent"],
  sorts: { order: { order: 1 }, title: { title: 1 }, level: { level: 1, order: 1 }, minutes: { minutes: 1 } },
  projection: "slug title titleAz level minutes accent summary summaryAz order audioUrl transcriptAvailable createdAt",
});
export const listPodcasts = handlers.list;
export const getPodcast = handlers.getOne;
