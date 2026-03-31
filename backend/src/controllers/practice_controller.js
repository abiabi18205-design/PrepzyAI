import Cerebras from '@cerebras/cerebras_cloud_sdk';
import mongoose from "mongoose";
import Session from "../models/session_model.js";
import Question from "../models/question_model.js";
import { successResponse } from "../utils/response_util.js";

// Initialize Cerebras with your API key
const cerebras = new Cerebras({ 
  apiKey: process.env.CEREBRAS_API_KEY 
});

// ✅ Simple cache for evaluations (saves API costs)
const evaluationCache = new Map();

const categoryMap = {
  technical: "Technical",
  behavioral: "Behavioral",
  hr: "HR",
  "system-design": "System Design",
  dsa: "DSA",
};

// ✅ Helper: Get difficulty expectations
const getDifficultyExpectations = (difficulty) => {
  switch(difficulty) {
    case "Easy":
      return "Expect basic understanding. Score leniently (7-10 for correct answers).";
    case "Medium":
      return "Expect solid understanding with some depth. Score normally.";
    case "Hard":
      return "Expect deep understanding, edge cases, and advanced concepts. Score strictly.";
    default:
      return "Score normally.";
  }
};

// ✅ Helper: Analyze answer length
const analyzeAnswerLength = (userAnswer) => {
  const wordCount = userAnswer.trim().split(/\s+/).length;
  let lengthScore = 10;
  let lengthFeedback = "";
  
  if (wordCount < 20) {
    lengthScore = 4;
    lengthFeedback = "Answer is too brief. Provide more details and examples.";
  } else if (wordCount < 50) {
    lengthScore = 7;
    lengthFeedback = "Good length, but could add more depth.";
  } else if (wordCount > 200) {
    lengthScore = 8;
    lengthFeedback = "Very thorough! Consider being more concise in live interviews.";
  } else {
    lengthScore = 10;
    lengthFeedback = "Perfect length - detailed but concise.";
  }
  
  return { wordCount, lengthScore, lengthFeedback };
};

// ✅ Helper: API call with retry logic
const callAIWithRetry = async (systemPrompt, userPrompt, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await cerebras.chat.completions.create({
        model: "llama3.1-8b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 800,
        temperature: 0.2,
        response_format: { type: "json_object" }
      });
      return response;
    } catch (error) {
      console.log(`Attempt ${i + 1} failed:`, error.message);
      if (i === maxRetries - 1) throw error;
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};

// ====================
// CREATE SESSION (Single Category)
// ====================
export const createSession = async (req, res) => {
  try {
    const { category, difficulty, questionCount = 5 } = req.body;
    const dbCategory = categoryMap[category] || category;

    const filter = { category: dbCategory };
    if (difficulty && difficulty !== "Mixed") filter.difficulty = difficulty;

    const allQuestions = await Question.find(filter);
    if (allQuestions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for this category/difficulty",
      });
    }

    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(questionCount, allQuestions.length));

    const title = `${dbCategory} Interview — ${new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;

    const session = await Session.create({
      userId: req.user.id,
      title,
      category: dbCategory,
      difficulty: difficulty || "Mixed",
      questions: selected.map((q) => q._id),
      totalQuestions: selected.length,
      status: "in-progress",
    });

    const populated = await Session.findById(session._id).populate("questions");

    const sessionData = {
      id: populated._id,
      title: populated.title,
      category: populated.category,
      difficulty: populated.difficulty,
      questions: populated.questions.map((q) => ({
        id: q._id,
        title: q.title,
        description: q.description || "",
        category: q.category,
        difficulty: q.difficulty,
        tags: q.tags || [],
        timeLimit: 120,
      })),
      totalQuestions: populated.totalQuestions,
      status: populated.status,
    };

    return successResponse(res, 201, "Session created", { session: sessionData });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ====================
//  CREATE MULTI-CATEGORY SESSION
// ====================
export const createMultiCategorySession = async (req, res) => {
  try {
    const { categories, questionsPerCategory = 3, difficulty = "Mixed" } = req.body;
    
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one job role",
      });
    }

    let allSelectedQuestions = [];
    const selectedCategories = [];

    for (const category of categories) {
      const dbCategory = categoryMap[category.toLowerCase()] || category;
      
      const filter = { category: dbCategory };
      if (difficulty && difficulty !== "Mixed") filter.difficulty = difficulty;

      const categoryQuestions = await Question.find(filter);
      
      if (categoryQuestions.length === 0) {
        console.log(`No questions found for category: ${dbCategory}`);
        continue;
      }

      const shuffled = categoryQuestions.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(questionsPerCategory, categoryQuestions.length));
      
      allSelectedQuestions.push(...selected);
      selectedCategories.push(dbCategory);
    }

    if (allSelectedQuestions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for selected job roles",
      });
    }

    const categoryNames = selectedCategories.join(", ");
    const title = `${categoryNames} Interview — ${new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;

    const session = await Session.create({
      userId: req.user.id,
      title,
      category: "Mixed",
      difficulty: difficulty || "Mixed",
      questions: allSelectedQuestions.map((q) => q._id),
      totalQuestions: allSelectedQuestions.length,
      status: "in-progress",
    });

    const populated = await Session.findById(session._id).populate("questions");

    const sessionData = {
      id: populated._id,
      title: populated.title,
      category: "Mixed",
      difficulty: populated.difficulty,
      categories: selectedCategories,
      questions: populated.questions.map((q) => ({
        id: q._id,
        title: q.title,
        description: q.description || "",
        category: q.category,
        difficulty: q.difficulty,
        tags: q.tags || [],
        timeLimit: 120,
      })),
      totalQuestions: populated.totalQuestions,
      status: populated.status,
    };

    return successResponse(res, 201, "Session created", { session: sessionData });
  } catch (err) {
    console.error("Create multi-category session error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ====================
//  GET SESSION
// ====================
export const getSession = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid session ID" });
    }

    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("questions");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const sessionData = {
      id: session._id,
      title: session.title,
      category: session.category,
      difficulty: session.difficulty,
      status: session.status,
      questions: session.questions.map((q) => ({
        id: q._id,
        title: q.title,
        description: q.description || "",
        category: q.category,
        difficulty: q.difficulty,
        tags: q.tags || [],
        timeLimit: 120,
      })),
      answers: session.answers,
      totalQuestions: session.totalQuestions,
      answeredQuestions: session.answeredQuestions,
    };

    return successResponse(res, 200, "Session fetched", { session: sessionData });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ====================
//  EVALUATE ANSWER (IMPROVED)
// ====================
export const evaluateAnswer = async (req, res) => {
  try {
    const { questionId, userAnswer, sessionId } = req.body;

    if (!questionId || !userAnswer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "questionId and userAnswer are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ success: false, message: "Invalid question ID" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    // ✅ Define cacheKey BEFORE using it
    const cacheKey = `${questionId}:${userAnswer.toLowerCase().trim()}`;

    // ✅ Check cache
    if (evaluationCache.has(cacheKey)) {
      console.log("✅ Returning cached evaluation");
      const evaluation = evaluationCache.get(cacheKey);
      
      if (sessionId && mongoose.Types.ObjectId.isValid(sessionId)) {
        await Session.findOneAndUpdate(
          { _id: sessionId, userId: req.user.id },
          {
            $push: {
              answers: {
                questionId: question._id,
                questionTitle: question.title,
                questionCategory: question.category,
                questionDifficulty: question.difficulty,
                userAnswer: userAnswer.trim(),
                result: evaluation.result,
                score: evaluation.overallScore,
                criteriaScores: evaluation.criteriaScores,
                confidenceScore: evaluation.confidenceScore,
                confidenceAnalysis: evaluation.confidenceAnalysis,
                feedback: evaluation.feedback,
                improvement: evaluation.improvementTip,
                followUpQuestions: evaluation.followUpQuestions || [],
                wordCount: evaluation.lengthAnalysis?.wordCount || 0,
                sampleAnswer: evaluation.sampleAnswer,
              },
            },
            $inc: { answeredQuestions: 1 },
          }
        );
      }
      
      return successResponse(res, 200, "Answer evaluated (cached)", { evaluation });
    }

    // ✅ Analyze answer length
    const wordCount = userAnswer.trim().split(/\s+/).length;
    let lengthScore = 10;
    let lengthFeedback = "";
    
    if (wordCount < 20) {
      lengthScore = 4;
      lengthFeedback = "Answer is too brief. Provide more details and examples.";
    } else if (wordCount < 50) {
      lengthScore = 7;
      lengthFeedback = "Good length, but could add more depth.";
    } else if (wordCount > 200) {
      lengthScore = 8;
      lengthFeedback = "Very thorough! Consider being more concise in live interviews.";
    } else {
      lengthScore = 10;
      lengthFeedback = "Perfect length - detailed but concise.";
    }

    // ✅ Difficulty expectations
    const getDifficultyExpectations = (difficulty) => {
      switch(difficulty) {
        case "Easy":
          return "Expect basic understanding. Score leniently (7-10 for correct answers).";
        case "Medium":
          return "Expect solid understanding with some depth. Score normally.";
        case "Hard":
          return "Expect deep understanding, edge cases, and advanced concepts. Score strictly.";
        default:
          return "Score normally.";
      }
    };

    const difficultyExpectations = getDifficultyExpectations(question.difficulty);

    // ✅ Improved system prompt
    const systemPrompt = `You are a senior technical interviewer at a top tech company. Evaluate the candidate's answer strictly but fairly.

EVALUATION CRITERIA (each 0-10):
1. ACCURACY (40% weight): Is the answer factually correct? Compare with reference answer.
2. COMPLETENESS (25% weight): Did they cover all key points from the reference answer?
3. CLARITY (20% weight): Is it well-structured and easy to follow?
4. EXAMPLES (10% weight): Did they provide relevant real-world examples?
5. COMMUNICATION (5% weight): Professional tone, confident language

${difficultyExpectations}

CONFIDENCE SCORING (0-10) - Analyze carefully:
- Hesitation words: "um", "like", "you know", "I think", "maybe" → Low confidence (0-3)
- Passive language: "I would say", "I believe" → Medium-low (3-5)
- Balanced confidence: clear statements without hedging → Medium (5-7)
- Strong confident language: "Definitely", "Absolutely", direct statements → High (7-9)
- Expert-level: Concise, authoritative with specific metrics → Very high (9-10)

Return ONLY valid JSON:
{
  "criteriaScores": {
    "accuracy": <number 0-10>,
    "completeness": <number 0-10>,
    "clarity": <number 0-10>,
    "examples": <number 0-10>,
    "communication": <number 0-10>
  },
  "overallScore": <number 0-10>,
  "confidenceScore": <number 0-10>,
  "confidenceAnalysis": "<brief explanation of why you gave this confidence score>",
  "result": "Excellent" | "Good" | "Average" | "Needs Improvement",
  "whatWentWell": ["point1", "point2"],
  "whatToImprove": ["point1", "point2"],
  "feedback": "<2-3 sentence constructive feedback>",
  "improvementTip": "<specific actionable advice>",
  "sampleAnswer": "<natural, conversational answer as if speaking in an interview - use first person, contractions, natural speech>",
  "followUpQuestions": ["question1", "question2"]
}`;

    const userPrompt = `QUESTION:
Title: "${question.title}"
Description: "${question.description || 'N/A'}"

REFERENCE ANSWER:
"${question.answer || 'No reference answer available'}"

CANDIDATE'S ANSWER:
"${userAnswer.trim()}"

WORD COUNT: ${wordCount} words
LENGTH FEEDBACK: ${lengthFeedback}`;

    // ✅ Call AI
    const response = await callAIWithRetry(systemPrompt, userPrompt);
    const rawText = response.choices[0]?.message?.content || "{}";

    let evaluation;
    try {
      evaluation = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      evaluation = match ? JSON.parse(match[0]) : null;
    }

    if (!evaluation) {
      return res.status(500).json({ success: false, message: "Failed to parse AI evaluation" });
    }

    // Ensure scores are within range
    evaluation.overallScore = Math.max(0, Math.min(10, Number(evaluation.overallScore) || 0));
    evaluation.confidenceScore = Math.max(0, Math.min(10, Number(evaluation.confidenceScore) || 5));
    
    // Add length analysis
    evaluation.lengthAnalysis = {
      wordCount,
      lengthScore,
      lengthFeedback
    };
    
    // ✅ Store in cache
    evaluationCache.set(cacheKey, evaluation);
    setTimeout(() => evaluationCache.delete(cacheKey), 3600000);

    if (sessionId && mongoose.Types.ObjectId.isValid(sessionId)) {
      await Session.findOneAndUpdate(
        { _id: sessionId, userId: req.user.id },
        {
          $push: {
            answers: {
              questionId: question._id,
              questionTitle: question.title,
              questionCategory: question.category,
              questionDifficulty: question.difficulty,
              userAnswer: userAnswer.trim(),
              result: evaluation.result,
              score: evaluation.overallScore,
              criteriaScores: evaluation.criteriaScores,
              confidenceScore: evaluation.confidenceScore,
              confidenceAnalysis: evaluation.confidenceAnalysis,
              feedback: evaluation.feedback,
              improvement: evaluation.improvementTip,
              followUpQuestions: evaluation.followUpQuestions || [],
              wordCount: wordCount,
              sampleAnswer: evaluation.sampleAnswer,
            },
          },
          $inc: { answeredQuestions: 1 },
        }
      );
    }

    return successResponse(res, 200, "Answer evaluated", {
      evaluation: {
        ...evaluation,
        questionId,
      },
    });
  } catch (err) {
    console.error("Evaluate error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ====================
// COMPLETE SESSION (IMPROVED)
// ====================
export const completeSession = async (req, res) => {
  try {
    const { sessionId, duration } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ success: false, message: "Invalid session ID" });
    }

    const session = await Session.findOne({ _id: sessionId, userId: req.user.id });
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.answers.length === 0) {
      return res.status(400).json({ success: false, message: "No answers to complete" });
    }

    const totalScore = session.answers.reduce((sum, a) => sum + a.score, 0);
    const overallScore = Math.round((totalScore / session.answers.length) * 10);
    
    // Calculate average confidence score
    const avgConfidence = session.answers.reduce((sum, a) => sum + (a.confidenceScore || 5), 0) / session.answers.length;
    
    // Group answers by category
    const answersByCategory = {};
    session.answers.forEach((answer) => {
      const cat = answer.questionCategory || "General";
      if (!answersByCategory[cat]) {
        answersByCategory[cat] = [];
      }
      answersByCategory[cat].push(answer);
    });
    
    // Calculate category averages
    const categoryAverages = {};
    for (const [cat, answers] of Object.entries(answersByCategory)) {
      const catTotal = answers.reduce((sum, a) => sum + a.score, 0);
      categoryAverages[cat] = Math.round((catTotal / answers.length) * 10);
    }

    // IMPROVED SUMMARY PROMPT with category breakdown
    const summaryPrompt = `An interview session just completed. Here are the results by category:

${Object.entries(answersByCategory).map(([category, answers]) => `
=== ${category} ===
${answers.map((a, i) => `Q${i + 1}: ${a.questionTitle}
Score: ${a.score}/10
Confidence: ${a.confidenceScore || 5}/10
Feedback: ${a.feedback}`).join("\n")}
Average Score: ${categoryAverages[category]}%
`).join("\n")}

Overall Score: ${overallScore}/100
Average Confidence: ${avgConfidence.toFixed(1)}/10

Provide a detailed session summary. Return JSON:
{
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["area1", "area2", "area3"],
  "categoryAnalysis": ${JSON.stringify(Object.entries(categoryAverages).map(([cat, score]) => ({
    category: cat,
    score: score,
    feedback: `Feedback for ${cat} category`
  })))},
  "overallFeedback": "2-3 sentence summary of overall performance",
  "recommendedResources": ["resource1", "resource2"],
  "nextSteps": ["step1", "step2"],
  "confidenceAssessment": "Assessment of candidate's confidence level"
}`;

    let strengths = [];
    let improvements = [];
    let categoryAnalysis = [];
    let overallFeedback = "Session completed successfully.";
    let recommendedResources = [];
    let nextSteps = [];
    let confidenceAssessment = "";

    try {
      const summaryMsg = await callAIWithRetry("You are an interview coach. Provide detailed feedback.", summaryPrompt);
      const rawSummary = summaryMsg.choices[0]?.message?.content || "{}";
      const match = rawSummary.match(/\{[\s\S]*\}/);
      const summary = match ? JSON.parse(match[0]) : null;

      if (summary) {
        strengths = summary.strengths || [];
        improvements = summary.improvements || [];
        categoryAnalysis = summary.categoryAnalysis || [];
        overallFeedback = summary.overallFeedback || overallFeedback;
        recommendedResources = summary.recommendedResources || [];
        nextSteps = summary.nextSteps || [];
        confidenceAssessment = summary.confidenceAssessment || "";
      }
    } catch (e) {
      console.error("Summary generation failed:", e.message);
    }

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      {
        status: "completed",
        overallScore,
        answeredQuestions: session.answers.length,
        duration: duration || 0,
        strengths,
        improvements,
        overallFeedback,
        categoryAnalysis,
        recommendedResources,
        nextSteps,
        confidenceAssessment,
        avgConfidence: Math.round(avgConfidence * 10) / 10,
      },
      { new: true }
    );

    return successResponse(res, 200, "Session completed", {
      resultId: updatedSession._id,
      overallScore,
      totalQuestions: session.totalQuestions,
      answeredQuestions: session.answers.length,
      strengths,
      improvements,
      categoryAnalysis,
      overallFeedback,
      recommendedResources,
      nextSteps,
      confidenceAssessment,
      avgConfidence: Math.round(avgConfidence * 10) / 10,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ====================
//  GET USER SESSIONS
// ====================
export const getUserSessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { timeRange, minScore, status } = req.query;

    const filter = { userId: req.user.id };
    if (status && status !== "all") filter.status = status;
    if (minScore) filter.overallScore = { $gte: Number(minScore) };

    if (timeRange && timeRange !== "all") {
      const now = new Date();
      const ranges = { week: 7, month: 30, year: 365 };
      const days = ranges[timeRange] || 30;
      filter.createdAt = { $gte: new Date(now - days * 24 * 60 * 60 * 1000) };
    }

    const total = await Session.countDocuments(filter);
    const sessions = await Session.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-answers");

    const results = sessions.map((s) => ({
      _id: s._id,
      sessionId: s._id,
      sessionTitle: s.title,
      date: s.createdAt,
      duration: s.duration,
      totalQuestions: s.totalQuestions,
      answeredQuestions: s.answeredQuestions,
      overallScore: s.overallScore,
      status: s.status,
      category: s.category,
      difficulty: s.difficulty,
      strengths: s.strengths,
      improvements: s.improvements,
      feedback: s.overallFeedback,
      avgConfidence: s.avgConfidence,
    }));

    return successResponse(res, 200, "Results fetched", {
      results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ====================
// GET SESSION RESULT
// ====================
export const getSessionResult = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid session ID" });
    }

    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!session) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    return successResponse(res, 200, "Result fetched", { result: session });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ====================
//  ADMIN GET ALL SESSIONS
// ====================
export const adminGetAllSessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const total = await Session.countDocuments();
    const sessions = await Session.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userId", "name email")
      .select("-answers");

    return successResponse(res, 200, "All sessions fetched", {
      sessions,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};