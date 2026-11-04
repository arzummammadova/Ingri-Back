/** CLI: node src/seed/seedAll.js  (npm run seed) — upserts all content into MONGO_URI; users untouched. */
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = "seed-only";
const { default: connectDB } = await import("../db/connectDB.js");
const { seedContent } = await import("./seedContent.js");
try {
  await connectDB();
  if (process.env.USING_MEMORY_DB === "1") throw new Error("MONGO_URI not reachable (fell back to in-memory DB); nothing persisted.");
  console.log(`[seed] database: ${mongoose.connection.name}`);
  await seedContent();
} catch (error) {
  console.error("[seed] failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
