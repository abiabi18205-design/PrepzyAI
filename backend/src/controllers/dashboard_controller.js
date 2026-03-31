import Session from "../models/session_model.js";
import Question from "../models/question_model.js";
import User from "../models/user_model.js";
import { successResponse } from "../utils/response_util.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const completedSessions = await Session.find({
      userId,
      status: "completed",
    }).sort({ createdAt: -1 });

    const totalInterviews = completedSessions.length;

    const averageScore =
      totalInterviews > 0
        ? Math.round(
            completedSessions.reduce((sum, s) => sum + s.overallScore, 0) /
              totalInterviews
          )
        : 0;

    const questionsAnswered = completedSessions.reduce(
      (sum, s) => sum + s.answeredQuestions,
      0
    );

    let streak = 0;
    if (completedSessions.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let checkDate = new Date(today);

      for (let i = 0; i < 365; i++) {
        const dayStart = new Date(checkDate);
        const dayEnd = new Date(checkDate);
        dayEnd.setHours(23, 59, 59, 999);

        const sessionOnDay = completedSessions.find((s) => {
          const d = new Date(s.createdAt);
          return d >= dayStart && d <= dayEnd;
        });

        if (sessionOnDay) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    const recentSessions = completedSessions.slice(0, 5).map((s) => ({
      id: s._id,
      title: s.title,
      score: s.overallScore,
      category: s.category,
      date: s.createdAt,
    }));

    const categoryBreakdown = {};
    completedSessions.forEach((s) => {
      if (!categoryBreakdown[s.category]) {
        categoryBreakdown[s.category] = { count: 0, totalScore: 0 };
      }
      categoryBreakdown[s.category].count++;
      categoryBreakdown[s.category].totalScore += s.overallScore;
    });

    const categoryStats = Object.entries(categoryBreakdown).map(([cat, data]) => ({
      category: cat,
      sessions: data.count,
      avgScore: Math.round(data.totalScore / data.count),
    }));

    return successResponse(res, 200, "Dashboard stats fetched", {
      totalInterviews,
      averageScore,
      questionsAnswered,
      streak,
      recentSessions,
      categoryStats,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalQuestions, totalSessions, completedSessions] =
      await Promise.all([
        User.countDocuments(),
        Question.countDocuments(),
        Session.countDocuments(),
        Session.countDocuments({ status: "completed" }),
      ]);

    const recentSessions = await Session.find({ status: "completed" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email");

    const avgScoreResult = await Session.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, avgScore: { $avg: "$overallScore" } } },
    ]);

    const avgScore = avgScoreResult[0]?.avgScore
      ? Math.round(avgScoreResult[0].avgScore)
      : 0;

    return successResponse(res, 200, "Admin stats fetched", {
      totalUsers,
      totalQuestions,
      totalSessions,
      completedSessions,
      avgScore,
      recentSessions,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
