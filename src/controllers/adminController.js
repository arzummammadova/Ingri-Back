import User from "../models/authModel.js";
import Podcast from "../models/podcastModel.js";
import Grammar from "../models/grammarModel.js";
import Listening from "../models/listeningModel.js";
import Word from "../models/wordModel.js";

export async function adminStats(_req, res, next) {
  try {
    const [users, podcasts, grammar, listening, words] = await Promise.all([
      User.countDocuments(),
      Podcast.countDocuments(),
      Grammar.countDocuments(),
      Listening.countDocuments(),
      Word.countDocuments(),
    ]);
    res.json({ users, podcasts, grammar, listening, words });
  } catch (error) {
    next(error);
  }
}
