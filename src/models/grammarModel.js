import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema({ en: String, az: String }, { _id: false });
const quizSchema = new mongoose.Schema(
  {
    prompt: String,
    promptAz: String,
    options: [String],
    answer: Number,
    explain: String,
    explainAz: String,
  },
  { _id: false },
);

const grammarSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: String,
    titleAz: String,
    level: String,
    minutes: Number,
    accent: String,
    order: Number,
    explanation: String,
    explanationAz: String,
    rules: [String],
    rulesAz: [String],
    examples: [exampleSchema],
    quiz: [quizSchema],
  },
  { timestamps: true },
);

/* ingri-indexes */
grammarSchema.index({ level: 1, order: 1 });
grammarSchema.index({ order: 1 });
grammarSchema.index({ accent: 1 });

export default mongoose.models.Grammar || mongoose.model("Grammar", grammarSchema);
