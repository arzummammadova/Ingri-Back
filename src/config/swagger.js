import swaggerJsdoc from "swagger-jsdoc";

const spec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Ingri API",
      version: "1.0.0",
      description:
        "REST API for Ingri. Auth uses httpOnly cookies (access + rotating refresh) and a double-submit CSRF header X-CSRF-Token.",
    },
    servers: [{ url: "/api" }],
    tags: [
      { name: "Auth" },
      { name: "Profile" },
      { name: "Content" },
      { name: "Progress" },
      { name: "Leaderboard" },
      { name: "Admin" },
      { name: "Notes" },
      { name: "Chat" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: { type: "apiKey", in: "cookie", name: "accessToken" },
        csrfHeader: { type: "apiKey", in: "header", name: "X-CSRF-Token" },
      },
      schemas: {
        NoteInput: {
          type: "object",
          properties: {
            title: { type: "string", maxLength: 120 },
            content: { type: "string", maxLength: 5000 },
            color: { type: "string", enum: ["paper", "lilac", "mint", "peach", "aqua", "rose"] },
            pinned: { type: "boolean" },
            context: { type: "object", properties: { type: { type: "string" }, slug: { type: "string" }, title: { type: "string" }, url: { type: "string" } } },
          },
        },
        Error: {
          type: "object",
          properties: { code: { type: "string" } },
        },
        Credentials: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
      },
    },
    paths: {
      "/health": { get: { tags: ["Admin"], summary: "Health check", responses: { 200: { description: "OK" } } } },
      "/auth/csrf": { get: { tags: ["Auth"], summary: "Issue a CSRF cookie and token", responses: { 200: { description: "CSRF token" } } } },
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register and email a verification link",
          requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name", "email", "password"], properties: { name: { type: "string" }, email: { type: "string" }, password: { type: "string" }, locale: { type: "string", enum: ["az", "en", "ru"] } } } } } },
          responses: { 201: { description: "Generic check-email response" }, 400: { description: "Validation error" } },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login. Sets access, refresh, and CSRF cookies",
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Credentials" } } } },
          responses: { 200: { description: "Logged in" }, 401: { description: "Invalid credentials or locked account" }, 403: { description: "Email not verified" } },
        },
      },
      "/auth/refresh": { post: { tags: ["Auth"], summary: "Rotate the refresh token and issue a new access token", responses: { 200: { description: "Rotated" }, 401: { description: "Missing or reused refresh token" } } } },
      "/auth/logout": { post: { tags: ["Auth"], summary: "Revoke the refresh token and clear cookies", responses: { 200: { description: "Logged out" } } } },
      "/auth/me": { get: { tags: ["Auth"], summary: "Current user", security: [{ cookieAuth: [] }], responses: { 200: { description: "Profile" }, 401: { description: "Unauthenticated" } } } },
      "/auth/verify-email": { post: { tags: ["Auth"], summary: "Verify email with the single-use token", responses: { 200: { description: "Verified" }, 400: { description: "Invalid or expired token" } } } },
      "/auth/resend-verification": { post: { tags: ["Auth"], summary: "Resend verification without revealing whether the email exists", responses: { 200: { description: "Generic response" } } } },
      "/auth/forgot-password": { post: { tags: ["Auth"], summary: "Email a hashed, expiring reset link", responses: { 200: { description: "Generic response" } } } },
      "/auth/reset-password": { post: { tags: ["Auth"], summary: "Set a new password with the reset token", responses: { 200: { description: "Updated" }, 400: { description: "Invalid token" } } } },
      "/auth/change-password": { post: { tags: ["Auth"], summary: "Change password. Requires the current password", security: [{ cookieAuth: [] }], responses: { 200: { description: "Updated" }, 400: { description: "Wrong current password" } } } },
      "/auth/account": { delete: { tags: ["Auth"], summary: "Delete the account after password confirmation", security: [{ cookieAuth: [] }], responses: { 200: { description: "Deleted" } } } },
      "/profile": { patch: { tags: ["Profile"], summary: "Update name, bio, level, goals, city, locale", security: [{ cookieAuth: [], csrfHeader: [] }], responses: { 200: { description: "Updated" }, 401: { description: "Unauthenticated" }, 403: { description: "Invalid CSRF" } } } },
      "/profile/levels": { patch: { tags: ["Profile"], summary: "Set the levels being studied and the active level", security: [{ cookieAuth: [], csrfHeader: [] }], responses: { 200: { description: "Saved" } } } },
      "/profile/active-level": { patch: { tags: ["Profile"], summary: "Switch the active CEFR level", security: [{ cookieAuth: [], csrfHeader: [] }], responses: { 200: { description: "Saved" } } } },
      "/profile/plan": { put: { tags: ["Profile"], summary: "Save a learning plan for one level", security: [{ cookieAuth: [], csrfHeader: [] }], responses: { 200: { description: "Saved" } } } },
      "/progress/time": { post: { tags: ["Progress"], summary: "Add active study seconds for a skill and level", security: [{ cookieAuth: [], csrfHeader: [] }], responses: { 200: { description: "Saved" } } } },
      "/profile/level": {
        patch: {
          tags: ["Profile"],
          summary: "Set the learner CEFR level",
          security: [{ cookieAuth: [], csrfHeader: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["level"],
                  properties: { level: { type: "string", enum: ["A1", "A2", "B1", "B2", "C1", "C2"], default: "A1" } },
                },
              },
            },
          },
          responses: { 200: { description: "Level saved" }, 400: { description: "Validation error" }, 401: { description: "Unauthenticated" }, 403: { description: "Invalid CSRF" } },
        },
      },
      "/profile/presets": { get: { tags: ["Profile"], summary: "List built-in 3D avatars", security: [{ cookieAuth: [] }], responses: { 200: { description: "Presets" } } } },
      "/profile/avatar": {
        post: { tags: ["Profile"], summary: "Upload a JPEG, PNG, or WebP avatar up to 2 MB", security: [{ cookieAuth: [] }], responses: { 200: { description: "Uploaded" }, 400: { description: "Invalid file" } } },
        delete: { tags: ["Profile"], summary: "Delete the current avatar", security: [{ cookieAuth: [] }], responses: { 200: { description: "Removed" } } },
      },
      "/profile/avatar/preset": { post: { tags: ["Profile"], summary: "Choose a generated preset avatar", security: [{ cookieAuth: [] }], responses: { 200: { description: "Saved" } } } },
      "/podcasts": { get: { tags: ["Content"], summary: "List podcasts", responses: { 200: { description: "Podcasts" } } } },
      "/podcasts/{slug}": { get: { tags: ["Content"], summary: "Podcast with transcript and glossary", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Podcast" }, 404: { description: "Not found" } } } },
      "/grammar": { get: { tags: ["Content"], summary: "List grammar lessons", responses: { 200: { description: "Lessons" } } } },
      "/grammar/{slug}": { get: { tags: ["Content"], summary: "Grammar lesson", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Lesson" } } } },
      "/listening": { get: { tags: ["Content"], summary: "List listening exercises", responses: { 200: { description: "Exercises" } } } },
      "/listening/{slug}": { get: { tags: ["Content"], summary: "Listening exercise", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Exercise" } } } },
      "/speaking": { get: { tags: ["Content"], summary: "List speaking phrases", responses: { 200: { description: "Phrases" } } } },
      "/speaking/{slug}": { get: { tags: ["Content"], summary: "Speaking phrase", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Phrase" } } } },
      "/words": { get: { tags: ["Content"], summary: "List words. Optional query: level, unit, q, page, limit", responses: { 200: { description: "Words" } } } },
      "/words/lookup": { get: { tags: ["Content"], summary: "Look up one headword", parameters: [{ name: "q", in: "query", schema: { type: "string" } }], responses: { 200: { description: "Word or null" } } } },
      "/words/export.pdf": { get: { tags: ["Content"], summary: "Download a word list PDF (level, unit, or favorites=1)", security: [{ cookieAuth: [] }], responses: { 200: { description: "PDF" } } } },
      "/videos": { get: { tags: ["Content"], summary: "List verified lesson videos", responses: { 200: { description: "Videos" } } } },
      "/videos/{slug}": { get: { tags: ["Content"], summary: "One lesson video", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Video" } } } },
      "/movies": { get: { tags: ["Content"], summary: "List film recommendations. Trailers only, no streams.", responses: { 200: { description: "Movies" } } } },
      "/movies/{slug}": { get: { tags: ["Content"], summary: "Film detail with official trailer", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Movie" } } } },
      "/books": { get: { tags: ["Content"], summary: "Public-domain books by level", responses: { 200: { description: "Books" } } } },
      "/books/{slug}": { get: { tags: ["Content"], summary: "Book reader source", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Book" } } } },
      "/placement": {
        get: { tags: ["Auth"], summary: "Placement questions", security: [{ cookieAuth: [] }], responses: { 200: { description: "Questions" } } },
        post: { tags: ["Auth"], summary: "Score a placement attempt. Does not change the account until levels are saved.", security: [{ cookieAuth: [], csrfHeader: [] }], responses: { 200: { description: "Suggested level" } } },
      },
      "/words/{slug}": { get: { tags: ["Content"], summary: "Word detail", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Word" } } } },
      "/progress": { get: { tags: ["Progress"], summary: "Learner progress", security: [{ cookieAuth: [] }], responses: { 200: { description: "Progress" } } } },
      "/progress/podcast": { post: { tags: ["Progress"], summary: "Save podcast playback", security: [{ cookieAuth: [] }], responses: { 200: { description: "Saved" } } } },
      "/progress/quiz": { post: { tags: ["Progress"], summary: "Save a grammar quiz score", security: [{ cookieAuth: [] }], responses: { 200: { description: "Saved" } } } },
      "/progress/listening": { post: { tags: ["Progress"], summary: "Save a listening score", security: [{ cookieAuth: [] }], responses: { 200: { description: "Saved" } } } },
      "/progress/speaking": { post: { tags: ["Progress"], summary: "Save a speaking score", security: [{ cookieAuth: [] }], responses: { 200: { description: "Saved" } } } },
      "/progress/word": { post: { tags: ["Progress"], summary: "Update a word status", security: [{ cookieAuth: [] }], responses: { 200: { description: "Saved" } } } },
      "/progress/item": { post: { tags: ["Progress"], summary: "Idempotent per-item progress. Body: kind, slug, level, percent (0-100), completed. Percent only grows; >=90 or completed=true marks completed once. Returns progress + justCompleted.", security: [{ cookieAuth: [], csrfHeader: [] }], responses: { 200: { description: "Saved" } } } },
      "/progress/summary": { get: { tags: ["Progress"], summary: "Completed counts per kind and level, recent completions, content totals per level", security: [{ cookieAuth: [] }], responses: { 200: { description: "Summary" } } } },
      "/progress/task": { post: { tags: ["Progress"], summary: "Toggle a daily task", security: [{ cookieAuth: [] }], responses: { 200: { description: "Saved" } } } },
      "/leaderboard": { get: { tags: ["Leaderboard"], summary: "Rank learners by XP", responses: { 200: { description: "Board" } } } },
      "/leaderboard/{id}": { get: { tags: ["Leaderboard"], summary: "Public learner card", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Learner" }, 404: { description: "Not found" } } } },
      "/chat": { post: { tags: ["Chat"], summary: "Ask Ingri. Streams text/event-stream lines: data: {delta} … data: {done:true} or data: {error}. Provider from GEMINI_API_KEY / GROQ_API_KEY / OPENAI_API_KEY.", security: [{ cookieAuth: [], csrfHeader: [] }], requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["message"], properties: { message: { type: "string", maxLength: 2000 }, locale: { type: "string", enum: ["az", "en", "ru"] } } } } } }, responses: { 200: { description: "SSE stream" }, 429: { description: "Rate limited" } } } },
      "/chat/history": {
        get: { tags: ["Chat"], summary: "Saved conversation (last 100 messages) and active provider", security: [{ cookieAuth: [] }], responses: { 200: { description: "{ items, provider }" } } },
        delete: { tags: ["Chat"], summary: "Clear saved conversation", security: [{ cookieAuth: [], csrfHeader: [] }], responses: { 200: { description: "Cleared" } } },
      },
      "/notes": {
        get: { tags: ["Notes"], summary: "List own notes. Query: q, color, pinned, sort (updated|created|title), order, page, limit", security: [{ cookieAuth: [] }], responses: { 200: { description: "{ items, total, page, pages }" } } },
        post: { tags: ["Notes"], summary: "Create a note", security: [{ cookieAuth: [], csrfHeader: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/NoteInput" } } } }, responses: { 201: { description: "Created" }, 400: { description: "Validation error" } } },
      },
      "/notes/bulk-delete": { post: { tags: ["Notes"], summary: "Delete several own notes", security: [{ cookieAuth: [], csrfHeader: [] }], requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["ids"], properties: { ids: { type: "array", items: { type: "string" } } } } } } }, responses: { 200: { description: "{ ok, deleted }" } } } },
      "/notes/{id}": {
        patch: { tags: ["Notes"], summary: "Update title, content, color, or pinned", security: [{ cookieAuth: [], csrfHeader: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/NoteInput" } } } }, responses: { 200: { description: "Updated" }, 404: { description: "Not found" } } },
        delete: { tags: ["Notes"], summary: "Delete a note", security: [{ cookieAuth: [], csrfHeader: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Deleted" }, 404: { description: "Not found" } } },
      },
      "/notes/{id}/pin": { patch: { tags: ["Notes"], summary: "Toggle pinned", security: [{ cookieAuth: [], csrfHeader: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Toggled" } } } },
      "/admin/stats": { get: { tags: ["Admin"], summary: "Counts for admins", security: [{ cookieAuth: [] }], responses: { 200: { description: "Stats" }, 403: { description: "Forbidden" } } } },
    },
  },
  apis: ["./src/routers/*.js"],
});

export { spec as swaggerSpec };
