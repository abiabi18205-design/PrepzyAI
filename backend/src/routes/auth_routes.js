import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate_middleware.js';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import {
  loginHeader,
  registerHeader,
  loginCookie,
  registerCookie,
  logout,
  updateUserRole,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteOwnAccount,
  updateProfile,  // ✅ ADD THIS
} from '../controllers/auth_controller.js';

import { authMiddleware, authorizeRoles } from '../middlewares/auth_middleware.js';
import { successResponse } from '../utils/response_util.js';
import User from '../models/user_model.js';

const router = express.Router();

// ====================
// ✅ Rate limit - max 10 login attempts per 15 min
// ====================
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts, try again later'
  }
});

// ====================
// ✅ Validation rules
// ====================
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

// ✅ Change password validation rules
const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

// ✅ Role update validation rules
const updateRoleRules = [
  body('userId').notEmpty().withMessage('userId is required'),
  body('role').isIn(['user', 'admin']).withMessage('Role must be either "user" or "admin"'),
];

// ✅ Profile update validation rules
const profileUpdateRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
];

// ====================
// ✅ OPTION A - Header based routes
// ====================
router.post('/register', validate(registerRules), registerHeader);
router.post('/login', loginLimiter, validate(loginRules), loginHeader);

// ====================
// ✅ OPTION B - Cookie based routes
// ====================
router.post('/register-cookie', validate(registerRules), registerCookie);
router.post('/login-cookie', loginLimiter, validate(loginRules), loginCookie);

// ====================
// ✅ GOOGLE AUTH - Initiate
// ====================
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// ====================
// ✅ GOOGLE AUTH - Callback
// ====================
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login', session: false }),
  (req, res) => {
    // Generate JWT token for the Google user
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // ✅ Redirect to frontend success page (without /auth prefix)
    res.redirect(`http://localhost:3000/google/success?token=${token}`);
  }
);

// ====================
// ✅ Forgot Password
// ====================
router.post('/forgot-password', forgotPassword);

// ====================
// ✅ Reset Password
// ====================
router.post('/reset-password', resetPassword);

// ====================
// ✅ Change Password (for logged in users)
// ====================
router.post('/change-password', authMiddleware, validate(changePasswordRules), changePassword);

// ====================
// ✅ Logout
// ====================
router.post('/logout', logout);

// ====================
// ✅ Delete Own Account (user deletes themselves)
// ====================
router.delete('/delete-account', authMiddleware, deleteOwnAccount);

// ====================
// ✅ Update Profile (user updates their name)
// ====================
router.put('/profile', authMiddleware, validate(profileUpdateRules), updateProfile);

// ====================
// ✅ First Admin Setup (No token needed - secret key protected)
// ====================
router.post('/setup-admin', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return successResponse(res, 200, 'Admin setup successful! Login again to get admin token.', { user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ====================
// ✅ Update user role (Admin only)
// ====================
router.put('/update-role', authMiddleware, authorizeRoles('admin'), validate(updateRoleRules), updateUserRole);

// ====================
// ✅ READ current user info (FIXED - returns full user data)
// ====================
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return successResponse(res, 200, 'Current user info', { user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ====================
// ✅ READ all users (Admin only)
// ====================
router.get('/users', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return successResponse(res, 200, 'All users fetched', { users });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users', error: err.message });
  }
});

// ====================
// ✅ DELETE user (Admin only)
// ====================
router.delete('/users/:id', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return successResponse(res, 200, 'User deleted successfully', { userId: req.params.id });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete user', error: err.message });
  }
});

export default router;