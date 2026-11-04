import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import Word from "../models/wordModel.js";
import Progress from "../models/progressModel.js";
import { runPagedList, wantsPage } from "../utils/listQuery.js";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function listWords(req, res, next) {
  try {
    if (wantsPage(req.query)) {
      return res.json(await runPagedList(Word, req.query, {
        search: ["en", "az"],
        filters: ["level", "category", "pos"],
        sorts: { rank: { rank: 1, order: 1, en: 1 }, en: { en: 1 }, level: { level: 1, rank: 1 }, category: { category: 1, en: 1 } },
        defaultSort: "rank",
        projection: "slug en az ipa category categoryAz level pos unit rank createdAt",
      }));
    }
    const filter = {};
    if (req.query.level) filter.level = String(req.query.level);
    if (req.query.unit) filter.unit = Number(req.query.unit);
    if (req.query.q) {
      const pattern = new RegExp(escapeRegExp(String(req.query.q).slice(0, 40)), "i");
      filter.$or = [{ en: pattern }, { az: pattern }];
    }
    const limit = Math.min(4000, Math.max(1, Number(req.query.limit) || 4000));
    const page = Math.max(1, Number(req.query.page) || 1);
    const [items, total] = await Promise.all([
      Word.find(filter).sort({ rank: 1, order: 1, en: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      Word.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  } catch (error) {
    next(error);
  }
}

export async function lookupWord(req, res, next) {
  try {
    const q = String(req.query.q || "").trim().toLowerCase();
    if (!q) return res.json({ item: null });
    const item = await Word.findOne({ en: new RegExp(`^${escapeRegExp(q)}$`, "i") }).lean();
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

export async function getWord(req, res, next) {
  try {
    const item = await Word.findOne({ slug: req.params.slug }).lean();
    if (!item) return res.status(404).json({ code: "NOT_FOUND" });
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

export async function exportWords(req, res, next) {
  try {
    const filter = {};
    if (req.query.level) filter.level = String(req.query.level);
    if (req.query.unit) filter.unit = Number(req.query.unit);
    let items = await Word.find(filter).sort({ level: 1, unit: 1, rank: 1, en: 1 }).limit(4000).lean();
    if (req.query.favorites === "1") {
      const progress = await Progress.findOne({ user: req.user._id });
      const fav = new Set(progress?.favoriteWords || []);
      items = items.filter((item) => fav.has(item.slug) || fav.has(item.en));
    }
    const font = path.join(process.cwd(), "assets", "fonts", "NotoSans-Regular.ttf");
    const doc = new PDFDocument({ margin: 48, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=learn-english-words.pdf");
    doc.pipe(res);
    if (fs.existsSync(font)) doc.font(font);
    doc.fontSize(18).text("Ingri — söz siyahısı", { align: "left" });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#444").text("Headwords follow the New General Service List (CC BY-SA). Definitions, examples, and Azerbaijani translations are original to this app.");
    doc.fillColor("#000").moveDown();
    for (const word of items) {
      doc.fontSize(12).text(`${word.en}  ·  ${word.level || ""}  ·  ${word.pos || ""}`);
      doc.fontSize(10).text(`${word.ipa || ""}    ${word.az || ""}`);
      if (word.example) doc.fontSize(10).text(word.example);
      if (word.exampleAz) doc.fontSize(10).fillColor("#333").text(word.exampleAz).fillColor("#000");
      doc.moveDown(0.4);
      if (doc.y > 760) doc.addPage();
    }
    if (!items.length) doc.fontSize(12).text("Siyahı boşdur. / This list is empty.");
    doc.end();
  } catch (error) {
    next(error);
  }
}
