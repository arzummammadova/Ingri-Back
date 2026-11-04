import Movie from "../models/movieModel.js";
import { createContentHandlers } from "../utils/contentHandlers.js";

const handlers = createContentHandlers(Movie, {
  search: ["title", "why", "whyAz"],
  filters: ["level"],
  sorts: { order: { order: 1 }, title: { title: 1 }, level: { level: 1, order: 1 }, year: { year: 1 } },
  projection: "slug title year level why whyAz trailerId order",
});
export const listMovies = handlers.list;
export const getMovie = handlers.getOne;
