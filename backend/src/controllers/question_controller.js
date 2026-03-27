import mongoose from "mongoose";
import Question from "../models/question_model.js";
import { successResponse } from "../utils/response_util.js";

// ── Create Question (Admin only) ──────────────────────────────────────────────
export const createQuestion = async (req, res) => {
  try {
    const { title, description, category, difficulty, answer, tags } = req.body;

    const question = await Question.create({
      title,
      description,
      category,
      difficulty,
      answer,
      tags,
      createdBy: req.user._id,
    });

    return successResponse(res, 201, "Question created successfully", { question });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── Get All Questions (Public) ────────────────────────────────────────────────
export const getAllQuestions = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.title = { $regex: search, $options: "i" };

    const total = await Question.countDocuments(filter);
    const questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return successResponse(res, 200, "Questions fetched successfully", {
      questions,
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

// ── Get Single Question (Public) ──────────────────────────────────────────────
export const getQuestionById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid question ID" });
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    return successResponse(res, 200, "Question fetched successfully", { question });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── Update Question (Admin only) ──────────────────────────────────────────────
export const updateQuestion = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid question ID" });
    }

    const { title, description, category, difficulty, answer, tags } = req.body;

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { title, description, category, difficulty, answer, tags },
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    return successResponse(res, 200, "Question updated successfully", { question });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── Delete Question (Admin only) ──────────────────────────────────────────────
export const deleteQuestion = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid question ID" });
    }

    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    return successResponse(res, 200, "Question deleted successfully", { questionId: req.params.id });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};