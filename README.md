# Ingri-Back

## Daily reminder emails

Learners opt in from the prompt shown after sign-in (or in Settings). A reminder is sent at most once per day,
at the chosen hour (user's timezone, default Asia/Baku), only if they have not studied yet that day.

- Mail goes through `BREVO_API_KEY` + `BREVO_FROM` (or `RESEND_API_KEY`) over HTTPS — Render's free plan blocks SMTP.
- The server checks every 15 minutes while it is awake (`REMINDER_SCHEDULER=0` disables this).
- Render's free instance sleeps after ~15 minutes idle, so add an external cron as well:
  1. Set `CRON_SECRET` (16+ random characters) on Render.
  2. On https://cron-job.org create a job: every hour, `GET https://ingri-back.onrender.com/api/cron/reminders`,
     header `x-cron-secret: <CRON_SECRET>`. The call wakes the server and sends whatever is due.
- Every email has a one-click unsubscribe link (`/api/reminders/unsubscribe`).

## Learning path, locking and points

- Podcasts, grammar, listening and speaking open one by one (`src/utils/sequence.js`): inside a level only the next
  unfinished item is open; the next CEFR level opens when every item of the previous level is finished
  (levels up to the learner's own level are always open). Locked items return only their header from the API and
  can't be scored (`403 LOCKED`).
- `GET /api/progress/path/:kind?level=B1` returns the ordered path with `completed / current / locked`.
- Quizzes are scored on the server from the submitted `answers` indexes. One-time points are paid once per
  (source, item) — see `awardOnce()` in `src/utils/points.js`; the daily/streak bonus is paid only together with a
  real completion.
- New real-audio podcasts in `src/seed/audioPodcasts.js` are upserted by slug on every start.
