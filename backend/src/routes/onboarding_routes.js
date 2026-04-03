import express from "express";
import { chat, savePreferences } from "../controllers/onboarding_controller.js";

const router = express.Router();

// AI chat endpoint — no auth required (user may not be logged in yet)
router.post("/chat", chat);

// Save preferences after onboarding complete
router.post("/preferences", savePreferences);

export default router;
