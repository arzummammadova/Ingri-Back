/** Ingri branded, responsive HTML emails (table layout, inline styles for mail clients). */
const BRAND = { ink: "#0d0d0d", lilac: "#e3c8f5", lilacDeep: "#7c4dbd", mint: "#c8f0d0", peach: "#fbe6b5", aqua: "#ddf4f7" };

function esc(value = "") {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

export function frontendUrl() {
  return (process.env.FRONTEND_URL || process.env.FRONTEND_ORIGIN || "http://localhost:43123").split(",")[0].trim().replace(/\/$/, "");
}

const LANG = (locale) => (["az", "en", "ru"].includes(locale) ? locale : "az");
const COMMON = {
  az: { footer: "Bu məktubu Ingri hesabınla bağlı göndərdik. Əgər bu sən deyilsənsə, sadəcə məktubu nəzərə alma — hesabın təhlükəsizdir.", fallback: "Düymə işləmirsə, bu keçidi brauzerdə aç:", friend: "dost" },
  en: { footer: "We sent this email about your Ingri account. If this wasn't you, just ignore it — your account is safe.", fallback: "If the button doesn't work, open this link in your browser:", friend: "friend" },
  ru: { footer: "Мы отправили это письмо по поводу вашего аккаунта Ingri. Если это были не вы, просто проигнорируйте его — аккаунт в безопасности.", fallback: "Если кнопка не работает, откройте эту ссылку в браузере:", friend: "друг" },
};

function layout({ locale = "az", preheader, title, intro, cta, link, note, accent = BRAND.lilac, emoji = "👋" }) {
  const lang = LANG(locale);
  const home = frontendUrl();
  const footer = COMMON[lang].footer;
  const fallback = COMMON[lang].fallback;
  const html = `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(title)}</title>
<style>@media (max-width:620px){.card{padding:28px 20px!important}.h1{font-size:24px!important}}</style></head>
<body style="margin:0;padding:0;background:${BRAND.aqua};font-family:'Poppins','Segoe UI',Helvetica,Arial,sans-serif;color:${BRAND.ink}">
<span style="display:none!important;opacity:0;max-height:0;overflow:hidden">${esc(preheader || intro)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.aqua};padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td align="center" style="padding:0 0 20px">
  <a href="${home}" style="text-decoration:none;color:${BRAND.ink}">
    <span style="display:inline-block;width:44px;height:44px;line-height:44px;border-radius:14px;background:${BRAND.ink};color:#fff;font-family:'Fredoka','Poppins',Arial,sans-serif;font-weight:700;font-size:24px;text-align:center;vertical-align:middle">i</span>
    <span style="font-family:'Fredoka','Poppins',Arial,sans-serif;font-weight:700;font-size:30px;vertical-align:middle;padding-left:8px;letter-spacing:-0.5px">Ingri</span>
  </a>
</td></tr>
<tr><td class="card" style="background:#ffffff;border-radius:28px;padding:40px 36px;box-shadow:0 16px 40px rgba(13,13,13,0.08)">
  <div style="width:56px;height:56px;line-height:56px;border-radius:18px;background:${accent};text-align:center;font-size:28px;margin:0 0 20px">${emoji}</div>
  <h1 class="h1" style="margin:0 0 12px;font-family:'Fredoka','Poppins',Arial,sans-serif;font-size:28px;line-height:1.2;font-weight:600">${esc(title)}</h1>
  <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#3b4148">${intro}</p>
  ${cta && link ? `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:${BRAND.ink}">
    <a href="${link}" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px">${esc(cta)}</a>
  </td></tr></table>` : ""}
  ${note ? `<p style="margin:24px 0 0;padding:14px 16px;border-radius:16px;background:${BRAND.peach};font-size:14px;line-height:1.5">${note}</p>` : ""}
  ${link ? `<p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#5c6570">${fallback}<br><a href="${link}" style="color:${BRAND.lilacDeep};word-break:break-all">${esc(link)}</a></p>` : ""}
</td></tr>
<tr><td align="center" style="padding:20px 16px 0;font-size:12px;line-height:1.6;color:#5c6570">
  ${footer}<br>© ${new Date().getFullYear()} Ingri · <a href="${home}" style="color:#5c6570">${home.replace(/^https?:\/\//, "")}</a>
</td></tr>
</table></td></tr></table></body></html>`;
  const text = [title, "", intro.replace(/<[^>]+>/g, ""), link ? `\n${cta}: ${link}` : "", note ? `\n${note.replace(/<[^>]+>/g, "")}` : "", "\n— Ingri"].join("\n");
  return { html, text };
}


const COPY = {
  verify: {
    az: { subject: "Ingri-yə xoş gəldin! Hesabını təsdiqlə ✨", title: "Salam, {name}!", intro: "Ingri ailəsinə qoşulduğun üçün çox şadıq. İngilis dili səyahətinə başlamaq üçün bircə addım qalıb — e-poçtunu təsdiqlə.", cta: "E-poçtu təsdiqlə", note: "Keçid <b>24 saat</b> etibarlıdır." },
    en: { subject: "Welcome to Ingri! Please verify your email ✨", title: "Hi {name}!", intro: "We're so happy you joined Ingri. Just one small step before your English journey begins — confirm your email.", cta: "Verify email", note: "This link is valid for <b>24 hours</b>." },
    ru: { subject: "Добро пожаловать в Ingri! Подтвердите почту ✨", title: "Привет, {name}!", intro: "Мы очень рады, что вы с нами. До начала вашего пути в английском остался всего один шаг — подтвердите e-mail.", cta: "Подтвердить e-mail", note: "Ссылка действует <b>24 часа</b>." },
  },
  welcome: {
    az: { subject: "Hər şey hazırdır — gəl öyrənməyə başlayaq! 🎉", title: "Xoş gəldin, {name}!", intro: "Hesabın aktivdir. Hər gün cəmi bir neçə dəqiqə ilə podkastlar, qrammatika, sözlər və danışıq məşqləri ilə irəliləyəcəksən. Ardıcıllıq alovunu yandır 🔥 — biz yanındayıq!", cta: "Öyrənməyə başla" },
    en: { subject: "You're all set — let's start learning! 🎉", title: "Welcome, {name}!", intro: "Your account is active. With just a few minutes a day you'll grow with podcasts, grammar, words and speaking practice. Light up your streak 🔥 — we're right here with you!", cta: "Start learning" },
    ru: { subject: "Всё готово — начнём учиться! 🎉", title: "Добро пожаловать, {name}!", intro: "Ваш аккаунт активен. Всего несколько минут в день — и вы будете расти с подкастами, грамматикой, словами и разговорной практикой. Зажгите огонёк серии 🔥 — мы рядом!", cta: "Начать учиться" },
  },
  reset: {
    az: { subject: "Ingri şifrəni yenilə 🔐", title: "Şifrəni unutmusan? Narahat olma!", intro: "Salam, {name}! Şifrəni yeniləmək üçün sorğu aldıq. Aşağıdakı düyməyə kliklə və yeni şifrə seç.", cta: "Yeni şifrə təyin et", note: "Keçid <b>30 dəqiqə</b> etibarlıdır. Bu sorğunu sən göndərməmisənsə, heç nə etmə." },
    en: { subject: "Reset your Ingri password 🔐", title: "Forgot your password? No worries!", intro: "Hi {name}! We received a request to reset your password. Click the button below to choose a new one.", cta: "Set a new password", note: "The link is valid for <b>30 minutes</b>. If you didn't ask for this, you can ignore it." },
    ru: { subject: "Сброс пароля Ingri 🔐", title: "Забыли пароль? Не беда!", intro: "Привет, {name}! Мы получили запрос на сброс пароля. Нажмите кнопку ниже и выберите новый.", cta: "Задать новый пароль", note: "Ссылка действует <b>30 минут</b>. Если это были не вы, ничего делать не нужно." },
  },
  changed: {
    az: { subject: "Şifrən dəyişdirildi ✅", title: "Şifrən uğurla yeniləndi", intro: "Salam, {name}! Ingri hesabının şifrəsi indicə dəyişdirildi. Bu sən idinsə, hər şey qaydasındadır.", cta: "Şifrəni yenilə", note: "Bunu sən etməmisənsə, dərhal şifrəni yenilə." },
    en: { subject: "Your password was changed ✅", title: "Your password was updated", intro: "Hi {name}! The password for your Ingri account was just changed. If that was you, you're all good.", cta: "Reset password", note: "If this wasn't you, reset your password right away." },
    ru: { subject: "Пароль изменён ✅", title: "Пароль успешно обновлён", intro: "Привет, {name}! Пароль вашего аккаунта Ingri только что изменили. Если это вы — всё в порядке.", cta: "Сбросить пароль", note: "Если это были не вы, сразу сбросьте пароль." },
  },
  exists: {
    az: { subject: "Sənin artıq Ingri hesabın var 🙂", title: "Yenidən xoş gəldin!", intro: "Salam, {name}! Kimsə bu e-poçtla yeni hesab yaratmağa çalışdı. Bu sən idinsə, sadəcə daxil ol — hesabın səni gözləyir.", cta: "Daxil ol", note: "Şifrəni xatırlamırsan? Giriş səhifəsində “Şifrəni unutmusan?” seçimindən istifadə et." },
    en: { subject: "You already have an Ingri account 🙂", title: "Welcome back!", intro: "Hi {name}! Someone tried to create a new account with this email. If it was you, just sign in — your account is waiting.", cta: "Sign in", note: "Can't remember your password? Use “Forgot password?” on the sign-in page." },
    ru: { subject: "У вас уже есть аккаунт Ingri 🙂", title: "С возвращением!", intro: "Привет, {name}! Кто-то пытался создать новый аккаунт с этим e-mail. Если это были вы — просто войдите, аккаунт вас ждёт.", cta: "Войти", note: "Не помните пароль? Нажмите «Забыли пароль?» на странице входа." },
  },
};
const STYLE = { verify: ["✉️", BRAND.lilac], welcome: ["🎉", BRAND.mint], reset: ["🔐", BRAND.peach], changed: ["✅", BRAND.mint], exists: ["🙂", BRAND.aqua] };

function build(kind, { name, link, locale }) {
  const lang = LANG(locale);
  const c = COPY[kind][lang];
  const who = esc(name || COMMON[lang].friend);
  const fill = (v) => v && v.replace("{name}", who);
  const [emoji, accent] = STYLE[kind];
  return { subject: c.subject, ...layout({ locale: lang, emoji, accent, title: c.title.replace("{name}", name || COMMON[lang].friend), intro: fill(c.intro), cta: c.cta, link, note: c.note }) };
}
const page = (locale, path) => `${frontendUrl()}/${LANG(locale)}/${path}`;

export const verifyEmail = ({ name, link, locale }) => build("verify", { name, link, locale });
export const welcomeEmail = ({ name, locale }) => build("welcome", { name, locale, link: page(locale, "dashboard") });
export const resetEmail = ({ name, link, locale }) => build("reset", { name, link, locale });
export const passwordChangedEmail = ({ name, locale }) => build("changed", { name, locale, link: page(locale, "forgot-password") });
export const accountExistsEmail = ({ name, locale }) => build("exists", { name, locale, link: page(locale, "login") });
