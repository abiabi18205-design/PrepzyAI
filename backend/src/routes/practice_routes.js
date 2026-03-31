import express from "express";
import { body } from "express-validator";
import { validate } from "../middlewares/validate_middleware.js";
import { authMiddleware, authorizeRoles } from "../middlewares/auth_middleware.js";
import {
  createSession,
  createMultiCategorySession,  // ✅ ADD THIS IMPORT
  getSession,
  evaluateAnswer,
  completeSession,
  getUserSessions,
  getSessionResult,
  adminGetAllSessions,
} from "../controllers/practice_controller.js";

const router = express.Router();

const createSessionRules = [
  body("category").notEmpty().withMessage("Category is required"),
];

const evaluateRules = [
  body("questionId").notEmpty().withMessage("questionId is required"),
  body("userAnswer").notEmpty().withMessage("userAnswer is required"),
];

const completeRules = [
  body("sessionId").notEmpty().withMessage("sessionId is required"),
];

// Single category session (existing)
router.post("/session", authMiddleware, validate(createSessionRules), createSession);

// ✅ NEW: Multi-category session (for multiple job roles)
router.post("/multi-session", authMiddleware, createMultiCategorySession);

// Other routes (unchanged)
router.get("/session/:id", authMiddleware, getSession);
router.post("/evaluate", authMiddleware, validate(evaluateRules), evaluateAnswer);
router.post("/complete", authMiddleware, validate(completeRules), completeSession);
router.get("/results", authMiddleware, getUserSessions);
router.get("/results/:id", authMiddleware, getSessionResult);
router.get("/admin/sessions", authMiddleware, authorizeRoles("admin"), adminGetAllSessions);

export default router;