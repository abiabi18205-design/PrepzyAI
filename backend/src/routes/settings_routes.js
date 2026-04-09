import express from "express";
import { authMiddleware } from "../middlewares/auth_middleware.js";
import { getSettings, updateSettings } from "../controllers/settings_controller.js";

const router = express.Router();
router.get("/", authMiddleware, getSettings);
router.put("/", authMiddleware, updateSettings);
export default router;
