export const placementQuestions = [
  {
    level: "A1",
    prompt: "She ___ a student.",
    options: ["am", "is", "are", "be"],
    answer: 1,
  },
  {
    level: "A1",
    prompt: "This is ___ apple.",
    options: ["a", "an", "the", "any"],
    answer: 1,
  },
  {
    level: "A2",
    prompt: "Yesterday we ___ to the market.",
    options: ["go", "goes", "went", "gone"],
    answer: 2,
  },
  {
    level: "A2",
    prompt: "This book is ___ than that one.",
    options: ["cheap", "cheaper", "cheapest", "more cheap"],
    answer: 1,
  },
  {
    level: "B1",
    prompt: "I ___ never visited London.",
    options: ["have", "has", "did", "am"],
    answer: 0,
  },
  {
    level: "B1",
    prompt: "If it rains, we ___ at home.",
    options: ["stayed", "would stay", "will stay", "staying"],
    answer: 2,
  },
  {
    level: "B2",
    prompt: "If I ___ more time, I would travel.",
    options: ["have", "had", "would have", "has"],
    answer: 1,
  },
  {
    level: "B2",
    prompt: "The report ___ yesterday.",
    options: ["wrote", "was written", "was wrote", "has wrote"],
    answer: 1,
  },
  {
    level: "C1",
    prompt: "Not only ___ late, but he also forgot the file.",
    options: ["he was", "was he", "he did", "did he was"],
    answer: 1,
  },
  {
    level: "C1",
    prompt: "It ___ that the results are still provisional.",
    options: ["seems", "seem", "looking", "looks like"],
    answer: 0,
  },
  {
    level: "C2",
    prompt: "Rarely ___ such a precise argument.",
    options: ["we hear", "do we hear", "we do hear", "hear we"],
    answer: 1,
  },
  {
    level: "C2",
    prompt: "The claim should be ___ so it does not overstate the evidence.",
    options: ["qualified", "qualifying", "qualify", "qualification"],
    answer: 0,
  },
];

export function suggestLevel(answers) {
  const score = placementQuestions.reduce(
    (sum, question, index) => sum + (Number(answers[index]) === question.answer ? 1 : 0),
    0,
  );
  const bands = ["A1", "A1", "A2", "A2", "B1", "B1", "B2", "B2", "C1", "C1", "C2", "C2", "C2"];
  return { score, suggested: bands[score] || "A1" };
}
