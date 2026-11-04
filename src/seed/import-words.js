import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(here, "word-data");

function levelForRank(rank) {
  if (rank <= 500) return "A1";
  if (rank <= 1000) return "A2";
  if (rank <= 1500) return "B1";
  if (rank <= 2000) return "B2";
  if (rank <= 2500) return "C1";
  return "C2";
}

function slugify(word) {
  return word.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function readJsonFiles() {
  if (!fs.existsSync(dataDir)) return [];
  const files = fs.readdirSync(dataDir).filter((name) => name.endsWith(".json"));
  return files.flatMap((name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8")));
}

export function loadDictionary() {
  const headwordFile = path.join(dataDir, "ngsl-headwords.txt");
  const ranks = new Map();
  if (fs.existsSync(headwordFile)) {
    fs.readFileSync(headwordFile, "utf8")
      .split(/\n/)
      .map((line) => line.trim().toLowerCase())
      .filter(Boolean)
      .forEach((word, index) => {
        if (!ranks.has(word)) ranks.set(word, index + 1);
      });
  }
  return readJsonFiles().map((entry, index) => {
    const en = String(entry.en).trim().toLowerCase();
    const rank = ranks.get(en) || entry.rank || 3000 + index;
    const level = entry.level || levelForRank(rank);
    return {
      slug: entry.slug || slugify(en),
      en,
      az: entry.az,
      ipa: entry.ipa || "",
      pos: entry.pos || "",
      example: entry.example,
      exampleAz: entry.exampleAz,
      category: entry.category || "general",
      categoryAz: entry.categoryAz || "Ümumi",
      level,
      unit: entry.unit || Math.floor((rank - 1) / 20) + 1,
      rank,
      order: rank,
    };
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const words = loadDictionary();
  const byLevel = {};
  for (const word of words) byLevel[word.level] = (byLevel[word.level] || 0) + 1;
  console.log(`Imported ${words.length} original glosses.`, byLevel);
  console.log("Add more objects to back/src/seed/word-data/*.json and run npm run seed. NGSL headwords supply rank and CEFR band.");
}
