import Stripe from 'stripe';
import User from '../models/user_model.js';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Price IDs for each plan (set in .env)
const PRICE_IDS = {
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || null,
    yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || null,
  },
  premium: {
    monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || null,
    yearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || null,
  },
};

// ── GET /api/payment/plan ─────────────────────────────────────────────────────
export const getUserPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('plan email name');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({ success: true, data: { plan: user.plan } });
  } catch (err) {
    console.error('getUserPlan error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── POST /api/payment/create-checkout-session ─────────────────────────────────
export const createCheckoutSession = async (req, res) => {
  const { plan, billing = 'monthly' } = req.body;

  // Validate
  if (!['pro', 'premium'].includes(plan)) {
    return res.status(400).json({ success: false, message: 'Invalid plan. Choose pro or premium.' });
  }

  // If Stripe is not configured, return mock URL (dev mode)
  if (!stripe) {
    console.warn('⚠️  STRIPE_SECRET_KEY not set – returning mock success URL');
    return res.json({
      success: true,
      data: {
        url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?mock=true&plan=${plan}`,
      },
    });
  }

  const priceId = PRICE_IDS[plan]?.[billing];

  if (!priceId) {
    // Stripe keys not fully configured – use mock mode
    console.warn(`⚠️  No price ID configured for ${plan}/${billing} – returning mock URL`);
    return res.json({
      success: true,
      data: {
        url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?mock=true&plan=${plan}`,
      },
    });
  }

  try {
    const user = await User.findById(req.user.id);

    // Build or reuse Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel`,
      metadata: { userId: user._id.toString(), plan, billing },
    });

    return res.json({ success: true, data: { url: session.url } });
  } catch (err) {
    console.error('Stripe createCheckoutSession error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to create checkout session' });
  }
};

// ── POST /api/payment/activate-free ──────────────────────────────────────────
export const activateFreePlan = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { plan: 'free' });
    return res.json({ success: true, data: { plan: 'free' } });
  } catch (err) {
    console.error('activateFreePlan error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── POST /api/payment/confirm-session ─────────────────────────────────────────
// Called by the success page to finalize a real Stripe session OR a mock session
export const confirmSession = async (req, res) => {
  const { sessionId, mock, plan: mockPlan } = req.body;

  // Mock mode (no Stripe keys)
  if (mock === 'true' || mock === true) {
    const validPlans = ['free', 'pro', 'premium'];
    const planToSet = validPlans.includes(mockPlan) ? mockPlan : 'pro';
    await User.findByIdAndUpdate(req.user.id, { plan: planToSet });
    return res.json({ success: true, data: { plan: planToSet } });
  }

  if (!stripe) {
    return res.status(503).json({ success: false, message: 'Payment service not configured' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    const plan = session.metadata?.plan || 'pro';
    await User.findByIdAndUpdate(req.user.id, { plan });

    return res.json({ success: true, data: { plan } });
  } catch (err) {
    console.error('confirmSession error:', err);
    return res.status(500).json({ success: false, message: 'Failed to confirm session' });
  }
};

// ── POST /api/payment/webhook (Stripe Webhook) ────────────────────────────────
export const handleWebhook = async (req, res) => {
  if (!stripe) return res.status(503).json({ message: 'Stripe not configured' });

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, plan } = session.metadata || {};

    if (userId && plan) {
      await User.findByIdAndUpdate(userId, { plan });
      console.log(`✅ Plan updated to "${plan}" for user ${userId}`);
    }
  }

  res.json({ received: true });
};
