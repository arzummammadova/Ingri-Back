import Video from "../models/videoModel.js";
import { createContentHandlers } from "../utils/contentHandlers.js";

const handlers = createContentHandlers(Video, {
  search: ["title", "channel", "topic"],
  filters: ["level", "skill", "topic"],
  sorts: { order: { order: 1 }, title: { title: 1 }, level: { level: 1, order: 1 }, minutes: { minutes: 1 }, channel: { channel: 1 } },
  projection: "slug title channel level skill topic minutes youtubeId order",
});
export const listVideos = handlers.list;
export const getVideo = handlers.getOne;
