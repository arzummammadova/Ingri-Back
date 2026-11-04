/**
 * Idempotent content seed: upserts every content collection by slug.
 * Never deletes anything and never touches users, progress, notes or chat.
 *   npm run seed            -> upsert all content into MONGO_URI
 *   seedContentIfEmpty()    -> used on startup; seeds only collections that are empty
 */
import fs from "fs";
import Podcast from "../models/podcastModel.js";
import Grammar from "../models/grammarModel.js";
import Listening from "../models/listeningModel.js";
import Speaking from "../models/speakingModel.js";
import Word from "../models/wordModel.js";
import Video from "../models/videoModel.js";
import Movie from "../models/movieModel.js";
import Book from "../models/bookModel.js";
import { grammar, listening, podcasts, speaking, words } from "./content.js";
import { higherGrammar, higherListening, higherPodcasts, higherSpeaking, higherWords } from "./levels.js";
import { catalogGrammar, catalogPodcasts } from "./catalog.js";
import { loadDictionary } from "./import-words.js";
import { movies, videos } from "./media.js";
import { audioPodcasts } from "./audioPodcasts.js";

function unique(list) {
  const map = new Map();
  for (const doc of list) if (doc?.slug) map.set(doc.slug, doc);
  return [...map.values()];
}

export function contentSets() {
  const books = JSON.parse(fs.readFileSync(new URL("./book-excerpts.json", import.meta.url), "utf8"));
  return [
    ["podcasts", Podcast, unique([...podcasts, ...higherPodcasts, ...catalogPodcasts, ...audioPodcasts])],
    ["grammar", Grammar, unique([...grammar, ...higherGrammar, ...catalogGrammar])],
    ["listening", Listening, unique([...listening, ...higherListening])],
    ["speaking", Speaking, unique([...speaking, ...higherSpeaking])],
    ["words", Word, unique([...words, ...higherWords, ...loadDictionary()])],
    ["videos", Video, unique(videos)],
    ["movies", Movie, unique(movies)],
    ["books", Book, unique(books)],
  ];
}

async function upsertAll(Model, docs, chunk = 500) {
  let upserted = 0;
  let modified = 0;
  for (let i = 0; i < docs.length; i += chunk) {
    const ops = docs.slice(i, i + chunk).map((doc) => ({
      updateOne: { filter: { slug: doc.slug }, update: { $set: doc }, upsert: true },
    }));
    const result = await Model.bulkWrite(ops, { ordered: false });
    upserted += result.upsertedCount || 0;
    modified += result.modifiedCount || 0;
  }
  return { upserted, modified };
}

/** Upserts all content. With onlyEmpty, collections that already have documents are skipped. */
export async function seedContent({ onlyEmpty = false, log = console.log } = {}) {
  const report = {};
  for (const [name, Model, docs] of contentSets()) {
    if (onlyEmpty && (await Model.estimatedDocumentCount()) > 0) continue;
    const { upserted, modified } = await upsertAll(Model, docs);
    report[name] = { source: docs.length, upserted, modified, total: await Model.countDocuments() };
    log(`[seed] ${name}: ${upserted} new, ${modified} updated, ${report[name].total} total`);
  }
  return report;
}

export const seedContentIfEmpty = (opts = {}) => seedContent({ ...opts, onlyEmpty: true });
