import express from "express";
import { body } from "express-validator";
import { validate } from "../middlewares/validate_middleware.js";
import { authMiddleware, authorizeRoles } from "../middlewares/auth_middleware.js";
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "../controllers/question_controller.js";

const router = express.Router();

// ── Validation rules ──────────────────────────────────────────────────────────
const questionRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["Technical", "Behavioral", "HR", "System Design", "DSA"])
    .withMessage("Invalid category"),
  body("difficulty")
    .notEmpty()
    .withMessage("Difficulty is required")
    .isIn(["Easy", "Medium", "Hard"])
    .withMessage("Invalid difficulty"),
];

// ── Routes ────────────────────────────────────────────────────────────────────

// Public routes
router.get("/", getAllQuestions);
router.get("/:id", getQuestionById);

// Admin only routes
router.post("/", authMiddleware, authorizeRoles("admin"), validate(questionRules), createQuestion);
router.put("/:id", authMiddleware, authorizeRoles("admin"), validate(questionRules), updateQuestion);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteQuestion);

export default router;