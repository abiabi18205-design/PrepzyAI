import express from "express";
import { authMiddleware, authorizeRoles } from "../middlewares/auth_middleware.js";
import { getDashboardStats, getAdminStats } from "../controllers/dashboard_controller.js";

const router = express.Router();

router.get("/stats", authMiddleware, getDashboardStats);
router.get("/admin/stats", authMiddleware, authorizeRoles("admin"), getAdminStats);

export default router;
