import express from 'express';
import authRoutes from './auth_routes.js';
import questionRoutes from './question_routes.js';
import practiceRoutes from './practice_routes.js';
import dashboardRoutes from './dashboard_routes.js';
import onboardingRoutes from './onboarding_routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/questions', questionRoutes);
router.use('/practice', practiceRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/onboarding', onboardingRoutes);

export default router;
