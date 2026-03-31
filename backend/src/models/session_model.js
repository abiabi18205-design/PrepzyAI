import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  questionTitle: { type: String, required: true },
  questionCategory: { type: String },
  questionDifficulty: { type: String },
  userAnswer: { type: String, default: "" },
  result: { type: String, enum: ["Correct", "Partially Correct", "Incorrect", "Skipped", "Excellent", "Good", "Average", "Needs Improvement"], default: "Skipped" },
  score: { type: Number, default: 0, min: 0, max: 10 },
  feedback: { type: String, default: "" },
  improvement: { type: String, default: "" },
  timeTaken: { type: Number, default: 0 },
  
  // ✅ NEW FIELDS
  criteriaScores: {
    type: Object,
    default: {}
  },
  confidenceScore: {
    type: Number,
    default: 5,
    min: 0,
    max: 10
  },
  confidenceAnalysis: {
    type: String,
    default: ""
  },
  followUpQuestions: {
    type: [String],
    default: []
  },
  wordCount: {
    type: Number,
    default: 0
  },
  sampleAnswer: {
    type: String,
    default: ""
  },
});

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    category: { type: String, enum: ["Technical", "Behavioral", "HR", "System Design", "DSA", "Mixed"], required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard", "Mixed"], default: "Mixed" },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    answers: [answerSchema],
    status: { type: String, enum: ["in-progress", "completed", "abandoned"], default: "in-progress" },
    overallScore: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    answeredQuestions: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    strengths: [String],
    improvements: [String],
    overallFeedback: { type: String, default: "" },
    
    // ✅ NEW FIELDS FOR IMPROVED SESSION SUMMARY
    avgConfidence: {
      type: Number,
      default: 0
    },
    categoryAnalysis: {
      type: Array,
      default: []
    },
    recommendedResources: {
      type: [String],
      default: []
    },
    nextSteps: {
      type: [String],
      default: []
    },
    confidenceAssessment: {
      type: String,
      default: ""
    },
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);