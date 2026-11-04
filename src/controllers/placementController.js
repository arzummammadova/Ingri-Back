import { placementQuestions, suggestLevel } from "../data/placement.js";

export function getPlacement(_req, res) {
  res.json({
    questions: placementQuestions.map(({ prompt, options, level }) => ({ prompt, options, level })),
  });
}

export function scorePlacement(req, res) {
  const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
  res.json(suggestLevel(answers));
}
