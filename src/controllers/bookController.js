import Book from "../models/bookModel.js";
import { createContentHandlers } from "../utils/contentHandlers.js";

const handlers = createContentHandlers(Book, {
  search: ["title", "author", "description"],
  filters: ["level"],
  sorts: { order: { order: 1 }, title: { title: 1 }, level: { level: 1, order: 1 }, year: { year: 1 }, author: { author: 1 } },
  projection: "slug title author year level description descriptionAz order createdAt",
  legacyProjection: "-chapters.text",
});
export const listBooks = handlers.list;
export const getBook = handlers.getOne;
