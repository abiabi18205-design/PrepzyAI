import express from 'express';
import authRoutes from './auth_routes.js';
import questionRoutes from './question_routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/questions', questionRoutes);

export default router;