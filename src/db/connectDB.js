import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

function isPlaceholder(uri) {
  if (!uri) return true;
  return /USER:PASSWORD|CLUSTER\.mongodb\.net|<|>|YOUR_|replace-with|example/i.test(uri);
}

async function useMemory(reason) {
  console.warn(reason);
  console.warn("Starting an in-memory MongoDB and seeding demo data. Set MONGO_URI to a reachable MongoDB Atlas connection string for persistent data.");
  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri();
  process.env.USING_MEMORY_DB = "1";
  await mongoose.connect(uri);
  console.log("MongoDB connected (memory)");
}

export default async function connectDB() {
  const uri = process.env.MONGO_URI?.trim();
  const development = process.env.NODE_ENV !== "production";
  mongoose.set("strictQuery", true);

  if (!uri || isPlaceholder(uri)) {
    if (!development) {
      throw new Error("MONGO_URI is missing or still a placeholder.");
    }
    await useMemory(
      !uri
        ? "MONGO_URI is empty."
        : "MONGO_URI is still a placeholder. Replace USER, PASSWORD, and CLUSTER in back/.env.",
    );
    return;
  }

  try {
    await Promise.race([
      mongoose.connect(uri, { serverSelectionTimeoutMS: 4000, connectTimeoutMS: 4000, family: 4 }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("MongoDB connection timed out")), 5000);
      }),
    ]);
    console.log("MongoDB connected");
  } catch (error) {
    await mongoose.disconnect().catch(() => {});
    if (!development) {
      console.error("Could not reach MongoDB and this is not a development process.");
      throw error;
    }
    await useMemory(`Could not reach MongoDB (${error.message}).`);
  }
}
