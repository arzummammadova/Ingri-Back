export const videos = [
  { slug: "invitations", title: "Inviting people out", channel: "BBC Learning English", level: "A1", skill: "speaking", topic: "invitations", minutes: 1, youtubeId: "sc4T5xQr5-E", order: 1 },
  { slug: "ship-sheep", title: "Ship or sheep", channel: "BBC Learning English", level: "A1", skill: "pronunciation", topic: "vowels", minutes: 1, youtubeId: "R-TDsD9bfV8", order: 2 },
  { slug: "telling-time", title: "Telling the time in English", channel: "Stefania Rigo", level: "A1", skill: "grammar", topic: "time", minutes: 8, youtubeId: "ub62GCUMZZo", order: 3 },
  { slug: "proper-nouns", title: "Naming words: proper nouns", channel: "Walnut Learning System", level: "A1", skill: "grammar", topic: "nouns", minutes: 6, youtubeId: "aT36dr6nOW8", order: 4 },
  { slug: "is-or-are", title: "Is or are", channel: "English with Lucy", level: "A2", skill: "grammar", topic: "verb be", minutes: 18, youtubeId: "EesQolfp9gQ", order: 5 },
  { slug: "to-and-for", title: "How to use to and for", channel: "mmmEnglish", level: "A2", skill: "grammar", topic: "prepositions", minutes: 21, youtubeId: "HVDh-iifKAs", order: 6 },
  { slug: "ipa-sounds", title: "English pronunciation and the IPA", channel: "mmmEnglish", level: "B1", skill: "pronunciation", topic: "sounds", minutes: 15, youtubeId: "n4NVPg2kHv4", order: 7 },
  { slug: "foods-crunch", title: "Foods that go crunch", channel: "BBC Learning English", level: "B1", skill: "listening", topic: "food", minutes: 6, youtubeId: "3nw9cWGmI5E", order: 8 },
  { slug: "grammar-practice", title: "English grammar practice", channel: "English with Lucy", level: "B1", skill: "grammar", topic: "mixed grammar", minutes: 25, youtubeId: "xJmUQxzMSEM", order: 9 },
  { slug: "phrasal-verbs", title: "Learn and use more phrasal verbs", channel: "mmmEnglish", level: "B2", skill: "vocabulary", topic: "phrasal verbs", minutes: 13, youtubeId: "8-ktHXX0BkI", order: 10 },
  { slug: "have-been", title: "Have been, has been, had been", channel: "English with Lucy", level: "B2", skill: "grammar", topic: "perfect tenses", minutes: 20, youtubeId: "6gfpUgsAvEg", order: 11 },
  { slug: "food-culture", title: "Learning a new food culture", channel: "BBC Learning English", level: "B2", skill: "listening", topic: "culture", minutes: 6, youtubeId: "5kr5ADrMeYU", order: 12 },
  { slug: "future-of-work", title: "What is the future of work?", channel: "BBC Learning English", level: "C1", skill: "listening", topic: "work", minutes: 6, youtubeId: "s1HxJVusR2w", order: 13 },
  { slug: "voa-superlatives", title: "Superlatives and science news", channel: "VOA Learning English", level: "C1", skill: "listening", topic: "news", minutes: 30, youtubeId: "hgYzNEivsk0", order: 14 },
  { slug: "future-of-work-c2", title: "Predictions and careful claims", channel: "BBC Learning English", level: "C2", skill: "listening", topic: "hedging", minutes: 6, youtubeId: "s1HxJVusR2w", order: 15 },
];

const watch = (title) => `https://www.justwatch.com/search?q=${encodeURIComponent(title)}`;
const imdb = (title) => `https://www.imdb.com/find/?q=${encodeURIComponent(title)}`;

function movie(slug, title, year, level, why, whyAz, vocabulary, trailerId, order) {
  return { slug, title, year, level, why, whyAz, vocabulary, trailerId, imdb: imdb(title), justwatch: watch(title), order };
}

export const movies = [
  movie("paddington", "Paddington", 2014, "A1", "Clear speech, short scenes, and a kind story.", "Aydın nitq, qısa səhnələr və mehriban hekayə.", [{ en: "station", az: "stansiya" }, { en: "lost", az: "itmiş" }], "qFuzMlfZGWM", 1),
  movie("toy-story", "Toy Story", 1995, "A1", "Everyday words and a simple friendship plot.", "Gündəlik sözlər və sadə dostluq süjeti.", [{ en: "friend", az: "dost" }, { en: "toy", az: "oyuncaq" }], "h9hsA-LjQtk", 2),
  movie("finding-nemo", "Finding Nemo", 2003, "A1", "A clear journey story with repeated phrases.", "Təkrarlanan ifadələrlə aydın səyahət hekayəsi.", [{ en: "ocean", az: "okean" }, { en: "find", az: "tapmaq" }], "bMtzgW-FVLY", 3),
  movie("hotel-transylvania", "Hotel Transylvania", 2012, "A1", "Fast but visual comedy with basic dialogue.", "Əsas dialoqlu, görüntü ilə dəstəklənən komediya.", [{ en: "hotel", az: "otel" }, { en: "welcome", az: "xoş gəlmisiniz" }], "FYgzizpCTKU", 4),
  movie("ratatouille", "Ratatouille", 2007, "A1", "Food vocabulary in a hopeful Paris story.", "Ümidli Paris hekayəsində yemək sözləri.", [{ en: "kitchen", az: "mətbəx" }, { en: "cook", az: "bişirmək" }], "c3sBBRxDAqk", 5),
  movie("coco", "Coco", 2017, "A2", "Family words and a clear goal: get home.", "Ailə sözləri və aydın məqsəd: evə qayıtmaq.", [{ en: "family", az: "ailə" }, { en: "remember", az: "xatırlamaq" }], "xlnPHQ3TLX8", 6),
  movie("wall-e", "WALL-E", 2008, "A2", "Very little dialogue at first, so picture carries the story.", "Əvvəl az dialoq var, hekayəni görüntü daşıyır.", [{ en: "robot", az: "robot" }, { en: "earth", az: "Yer" }], "alIq_wG9FNk", 7),
  movie("inside-out", "Inside Out", 2015, "A2", "Emotion words in everyday family scenes.", "Gündəlik ailə səhnələrində hiss sözləri.", [{ en: "feeling", az: "hiss" }, { en: "school", az: "məktəb" }], "yRUAzGQ3nSY", 8),
  movie("paddington-revisit", "Paddington", 2014, "A2", "Watch again and notice polite requests.", "Yenidən bax və nəzakətli xahişlərə diqqət et.", [{ en: "please", az: "zəhmət olmasa" }, { en: "marmalade", az: "mürəbbə" }], "qFuzMlfZGWM", 9),
  movie("toy-story-plans", "Toy Story", 1995, "A2", "Listen for plans and problems between friends.", "Dostlar arasındakı plan və problemləri dinlə.", [{ en: "plan", az: "plan" }, { en: "problem", az: "problem" }], "h9hsA-LjQtk", 10),
  movie("hidden-figures", "Hidden Figures", 2016, "B1", "Workplace scenes with a clear true story.", "Aydın həqiqi hekayəli iş səhnələri.", [{ en: "work", az: "iş" }, { en: "calculate", az: "hesablamaq" }], "5wfrDhgUMGI", 11),
  movie("great-expectations", "Great Expectations", 2012, "B1", "A literary story told at a manageable pace in the trailer.", "Treylerdə ölçülü templə danışılan ədəbi hekayə.", [{ en: "expect", az: "gözləmək" }, { en: "fortune", az: "sərvət" }], "sGLRGaeCQrY", 12),
  movie("coco-goals", "Coco", 2017, "B1", "Follow a goal across obstacles.", "Məqsədi maneələrdən keçərək izlə.", [{ en: "goal", az: "məqsəd" }, { en: "promise", az: "vəd" }], "xlnPHQ3TLX8", 13),
  movie("inside-out-feelings", "Inside Out", 2015, "B1", "Name mixed feelings, not only happy or sad.", "Yalnız sevincli və kədərli yox, qarışıq hissləri adlandır.", [{ en: "memory", az: "xatirə" }, { en: "change", az: "dəyişiklik" }], "yRUAzGQ3nSY", 14),
  movie("finding-nemo-journey", "Finding Nemo", 2003, "B1", "Retell the journey in the past tense.", "Səyahəti keçmiş zamanda danış.", [{ en: "journey", az: "səyahət" }, { en: "brave", az: "cəsur" }], "bMtzgW-FVLY", 15),
  movie("arrival", "Arrival", 2016, "B2", "A linguist at the centre of a careful, adult story.", "Ehtiyatlı, yetkin hekayənin mərkəzində bir dilçi.", [{ en: "language", az: "dil" }, { en: "meaning", az: "məna" }], "tFMo3UJ4B4g", 16),
  movie("hidden-figures-argument", "Hidden Figures", 2016, "B2", "Listen for reasons and workplace argument.", "Səbəbləri və iş mübahisəsini dinlə.", [{ en: "reason", az: "səbəb" }, { en: "allow", az: "icazə vermək" }], "5wfrDhgUMGI", 17),
  movie("great-expectations-class", "Great Expectations", 2012, "B2", "Social class is shown through polite and sharp speech.", "Sosial təbəqə nəzakətli və kəskin nitqdə görünür.", [{ en: "gentleman", az: "centlmen" }, { en: "fortune", az: "sərvət" }], "sGLRGaeCQrY", 18),
  movie("arrival-listening", "Arrival", 2016, "C1", "Abstract ideas about language and time.", "Dil və zaman haqqında mücərrəd fikirlər.", [{ en: "interpret", az: "şərh etmək" }, { en: "assume", az: "fərz etmək" }], "tFMo3UJ4B4g", 19),
  movie("hidden-figures-precision", "Hidden Figures", 2016, "C1", "Precise workplace English under pressure.", "Təzyiq altında dəqiq iş ingiliscəsi.", [{ en: "precise", az: "dəqiq" }, { en: "evidence", az: "sübut" }], "5wfrDhgUMGI", 20),
  movie("great-expectations-style", "Great Expectations", 2012, "C1", "Period style with longer, formal sentences.", "Uzun, rəsmi cümlələrlə dövr üslubu.", [{ en: "fortune", az: "sərvət" }, { en: "manner", az: "tərz" }], "sGLRGaeCQrY", 21),
  movie("arrival-nuance", "Arrival", 2016, "C2", "Watch how a scientist refuses an easy claim.", "Alimin asan iddianı necə rədd etdiyinə bax.", [{ en: "hypothesis", az: "hipotez" }, { en: "nuance", az: "çalar" }], "tFMo3UJ4B4g", 22),
  movie("hidden-figures-register", "Hidden Figures", 2016, "C2", "Notice register shifts between colleagues and officials.", "Həmkar və rəsmi şəxs arasındakı üslub dəyişməsinə fikir ver.", [{ en: "authority", az: "səlahiyyət" }, { en: "justify", az: "əsaslandırmaq" }], "5wfrDhgUMGI", 23),
  movie("great-expectations-irony", "Great Expectations", 2012, "C2", "Irony and social ambition in literary English.", "Ədəbi ingiliscədə ironiya və sosial ambisiya.", [{ en: "ambition", az: "ambisiya" }, { en: "irony", az: "ironiya" }], "sGLRGaeCQrY", 24),
];
