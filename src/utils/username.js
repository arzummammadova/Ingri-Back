export const USERNAME_RE = /^[a-z0-9._]{3,20}$/;

/** Turns any text (email prefix, name) into a username candidate. */
export function slugUsername(value = "") {
  let base = String(value).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ə/g, "e").replace(/ı/g, "i").replace(/[^a-z0-9._]+/g, "").replace(/^[._]+|[._]+$/g, "").slice(0, 16);
  if (base.length < 3) base = `${base}user`.slice(0, 16);
  return base;
}

/** Finds a free username based on the given seed; Model is the User model. */
export async function uniqueUsername(Model, seed, excludeId) {
  const base = slugUsername(seed);
  for (let i = 0; i < 50; i += 1) {
    const candidate = i === 0 ? base : `${base.slice(0, 16)}${i < 10 ? i : Math.floor(Math.random() * 9000 + 1000)}`.slice(0, 20);
    const taken = await Model.exists({ username: candidate, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
    if (!taken) return candidate;
  }
  return `${base.slice(0, 12)}${Date.now().toString(36).slice(-6)}`;
}

/** Gives every legacy user without a username one generated from the email prefix. */
export async function backfillUsernames(Model) {
  const users = await Model.find({ $or: [{ username: { $exists: false } }, { username: "" }, { username: null }] }).select("_id email name");
  for (const user of users) {
    const username = await uniqueUsername(Model, user.email?.split("@")[0] || user.name, user._id);
    await Model.updateOne({ _id: user._id }, { $set: { username } });
  }
  if (users.length) console.log(`[username] backfilled ${users.length} user(s)`);
}
