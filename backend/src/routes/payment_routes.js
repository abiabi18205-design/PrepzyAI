import express from 'express';
import {
  getUserPlan,
  createCheckoutSession,
  activateFreePlan,
  confirmSession,
  handleWebhook,
} from '../controllers/payment_controller.js';
import { protectHeader } from '../middlewares/auth_middleware.js';

const router = express.Router();

// Stripe webhook needs raw body - must use raw parser not json
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.get('/plan', protectHeader, getUserPlan);
router.post('/create-checkout-session', protectHeader, createCheckoutSession);
router.post('/activate-free', protectHeader, activateFreePlan);
router.post('/confirm-session', protectHeader, confirmSession);

export default router;
