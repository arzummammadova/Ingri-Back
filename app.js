import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import swaggerUi from "swagger-ui-express";
import path from "path";
import connectDB from "./src/db/connectDB.js";
import { swaggerSpec } from "./src/config/swagger.js";
import { csrfProtection, ensureCsrf } from "./src/middleware/csrf.js";
import { errorHandler, notFound } from "./src/middleware/errorMiddleware.js";
import { authLimiter } from "./src/middleware/rateLimit.js";
import authRouter from "./src/routers/authRouter.js";
import podcastRouter from "./src/routers/podcastRouter.js";
import grammarRouter from "./src/routers/grammarRouter.js";
import listeningRouter from "./src/routers/listeningRouter.js";
import speakingRouter from "./src/routers/speakingRouter.js";
import wordRouter from "./src/routers/wordRouter.js";
import videoRouter from "./src/routers/videoRouter.js";
import movieRouter from "./src/routers/movieRouter.js";
import bookRouter from "./src/routers/bookRouter.js";
import placementRouter from "./src/routers/placementRouter.js";
import progressRouter from "./src/routers/progressRouter.js";
import leaderboardRouter from "./src/routers/leaderboardRouter.js";
import profileRouter from "./src/routers/profileRouter.js";
import adminRouter from "./src/routers/adminRouter.js";
import noteRouter from "./src/routers/noteRouter.js";
import chatRouter from "./src/routers/chatRouter.js";

const app = express();
const port = Number(process.env.PORT || 4871);
const origins = (process.env.FRONTEND_ORIGIN || "http://127.0.0.1:43123")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use((req, _res, next) => {
  for (const key of ["body", "params", "query"]) {
    const value = req[key];
    if (value && typeof value === "object") {
      try {
        mongoSanitize.sanitize(value);
      } catch {
        /* Express 5 may expose a read-only query object. */
      }
    }
  }
  next();
});
app.use(ensureCsrf);
app.use(csrfProtection);

app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/docs", ...swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/docs.json", (_req, res) => res.json(swaggerSpec));

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/podcasts", podcastRouter);
app.use("/api/grammar", grammarRouter);
app.use("/api/listening", listeningRouter);
app.use("/api/speaking", speakingRouter);
app.use("/api/words", wordRouter);
app.use("/api/videos", videoRouter);
app.use("/api/movies", movieRouter);
app.use("/api/books", bookRouter);
app.use("/api/placement", placementRouter);
app.use("/api/progress", progressRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/profile", profileRouter);
app.use("/api/admin", adminRouter);
app.use("/api/notes", noteRouter);
app.use("/api/chat", chatRouter);

app.use(notFound);
app.use(errorHandler);

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is required.");
  process.exit(1);
}

connectDB()
  .then(async () => {
    if (process.env.USING_MEMORY_DB === "1") {
      const { seed } = await import("./src/seed/seed.js");
      await seed();
    }
    try {
      const [{ default: User }, { backfillUsernames }] = await Promise.all([import("./src/models/authModel.js"), import("./src/utils/username.js")]);
      await backfillUsernames(User);
    } catch (error) {
      console.warn("[username] backfill skipped:", error.message);
    }
    app.listen(port, () => {
      console.log(`Ingri API on http://127.0.0.1:${port}`);
      console.log(`Swagger UI on http://127.0.0.1:${port}/api/docs`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export default app;
