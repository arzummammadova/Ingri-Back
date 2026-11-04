import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/authModel.js";
import Progress from "../models/progressModel.js";
import Podcast from "../models/podcastModel.js";
import Grammar from "../models/grammarModel.js";
import Listening from "../models/listeningModel.js";
import Speaking from "../models/speakingModel.js";
import Word from "../models/wordModel.js";
import RefreshToken from "../models/refreshTokenModel.js";
import fs from "fs";
import { grammar, listening, people, podcasts, speaking, words } from "./content.js";
import { higherGrammar, higherListening, higherPodcasts, higherSpeaking, higherWords } from "./levels.js";
import { catalogGrammar, catalogPodcasts } from "./catalog.js";
import { loadDictionary } from "./import-words.js";
import { movies, videos } from "./media.js";
import { audioPodcasts } from "./audioPodcasts.js";
import Video from "../models/videoModel.js";
import Movie from "../models/movieModel.js";
import Book from "../models/bookModel.js";
import { DEFAULT_TASKS } from "../utils/activity.js";

dotenv.config();

function dayKey(offset) {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  return date.toISOString().slice(0, 10);
}

export async function seed() {
  const password = await bcrypt.hash("Learn!English1", 12);
  const adminPassword = await bcrypt.hash("Admin!English1", 12);
  const peerPassword = await bcrypt.hash("Peer!English1", 12);

  const books = JSON.parse(fs.readFileSync(new URL("./book-excerpts.json", import.meta.url), "utf8"));
  const dictionary = loadDictionary();
  const wordMap = new Map();
  for (const word of [...words, ...higherWords, ...dictionary]) wordMap.set(word.slug, word);
  await Promise.all([
    Podcast.deleteMany({}),
    Grammar.deleteMany({}),
    Listening.deleteMany({}),
    Speaking.deleteMany({}),
    Word.deleteMany({}),
    Video.deleteMany({}),
    Movie.deleteMany({}),
    Book.deleteMany({}),
  ]);
  await Podcast.insertMany([...podcasts, ...higherPodcasts, ...catalogPodcasts, ...audioPodcasts]);
  await Grammar.insertMany([...grammar, ...higherGrammar, ...catalogGrammar]);
  await Listening.insertMany([...listening, ...higherListening]);
  await Speaking.insertMany([...speaking, ...higherSpeaking]);
  await Word.insertMany([...wordMap.values()]);
  await Video.insertMany(videos);
  await Movie.insertMany(movies);
  await Book.insertMany(books);

  const demoEmails = [
    "aysel@learnenglish.app",
    "admin@learnenglish.app",
    ...people.map((person) => person.email),
  ];
  const existing = await User.find({ email: { $in: demoEmails } });
  const ids = existing.map((user) => user._id);
  await RefreshToken.deleteMany({ user: { $in: ids } });
  await Progress.deleteMany({ user: { $in: ids } });
  await User.deleteMany({ email: { $in: demoEmails } });

  const aysel = await User.create({
    name: "Aysel Əliyeva",
    email: "aysel@learnenglish.app",
    password,
    bio: "Hər axşam iyirmi dəqiqə ingilis dili.",
    level: "A2",
    levels: ["A1", "A2"],
    activeLevel: "A2",
    placementCompleted: true,
    plans: [{ level: "A2", dailyMinutes: 20, targetLevel: "B1", targetDate: "2027-05-01" }],
    learningGoals: ["travel", "daily"],
    avatarType: "preset",
    avatarPreset: "aysel",
    role: "user",
    isVerified: true,
    xp: 1240,
    streak: 7,
    lastActiveDate: dayKey(0),
    totalMinutes: 260,
    city: "Gəncə",
    locale: "az",
    dailyMinutes: [6, 5, 4, 3, 2, 1, 0].map((offset, index) => ({
      date: dayKey(offset),
      minutes: [18, 24, 12, 30, 16, 22, 20][index],
    })),
  });

  await Progress.create({
    user: aysel._id,
    completed: ["grammar:present-simple", "podcast:at-the-cafe", "listening:at-the-station"],
    quizScores: { "present-simple": 75 },
    wordStatus: {
      hello: "known",
      please: "known",
      "thank-you": "known",
      tea: "learning",
      water: "learning",
      ticket: "new",
    },
    podcastSeconds: { "at-the-cafe": 48, "directions-in-baku": 12 },
    listeningScores: { "at-the-station": 100 },
    speakingBest: { greeting: 80 },
    tasks: [
      { key: "words", done: false },
      { key: "grammar", done: true },
      { key: "podcast", done: true },
      { key: "speaking", done: false },
    ],
  });

  await User.create({
    name: "Admin",
    email: "admin@learnenglish.app",
    password: adminPassword,
    bio: "Content editor",
    level: "C1",
    levels: ["C1", "C2"],
    activeLevel: "C1",
    placementCompleted: true,
    learningGoals: ["work"],
    avatarType: "preset",
    avatarPreset: "kamran",
    role: "admin",
    isVerified: true,
    xp: 300,
    streak: 2,
    city: "Bakı",
    locale: "az",
    lastActiveDate: dayKey(1),
    totalMinutes: 40,
  });

  for (const person of people) {
    const user = await User.create({
      name: person.name,
      email: person.email,
      password: peerPassword,
      level: person.level,
      levels: [person.level],
      activeLevel: person.level,
      placementCompleted: true,
      learningGoals: ["daily"],
      avatarType: "preset",
      avatarPreset: person.preset,
      role: "user",
      isVerified: true,
      xp: person.xp,
      streak: person.streak,
      city: person.city,
      locale: "az",
      totalMinutes: person.minutes,
      lastActiveDate: dayKey(0),
      bio: "",
    });
    await Progress.create({ user: user._id, tasks: DEFAULT_TASKS });
  }

  console.log("Seed complete.");
  console.log("Learner  aysel@learnenglish.app  /  Learn!English1");
  console.log("Admin    admin@learnenglish.app  /  Admin!English1");
}

const isDirect = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirect) {
  const { default: connectDB } = await import("../db/connectDB.js");
  if (!process.env.JWT_SECRET) process.env.JWT_SECRET = "seed-only";
  try {
    await connectDB();
    await seed();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
