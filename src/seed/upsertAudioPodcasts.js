/** Upserts the real-audio podcasts by slug (no wipe, user data untouched). Run: node src/seed/upsertAudioPodcasts.js */
import dotenv from "dotenv";
import mongoose from "mongoose";
import Podcast from "../models/podcastModel.js";
import { audioPodcasts } from "./audioPodcasts.js";

dotenv.config();
const { default: connectDB } = await import("../db/connectDB.js");
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = "seed-only";
try {
  await connectDB();
  const result = await Podcast.bulkWrite(
    audioPodcasts.map((doc) => ({ updateOne: { filter: { slug: doc.slug }, update: { $set: doc }, upsert: true } })),
  );
  console.log(`audio podcasts upserted: ${result.upsertedCount} new, ${result.modifiedCount} updated`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
