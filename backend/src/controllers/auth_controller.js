import { registerUser, loginUser, forgotPasswordService, resetPasswordService } from '../services/auth_service.js';
import { successResponse } from '../utils/response_util.js';
import User from '../models/user_model.js';
import Blacklist from '../models/blacklist_model.js'; // ✅ Import Blacklist model


// ✅ OPTION A - JWT in Authorization Header

export const registerHeader = async (req, res, next) => {
  try {
    const { token, user } = await registerUser(req.body);
    return successResponse(res, 201, 'Registered successfully', { token, user });
  } catch (error) {
    next(error);
  }
};

export const loginHeader = async (req, res, next) => {
  try {
    const { token, user } = await loginUser(req.body);
    return successResponse(res, 200, 'Login successful', { token, user });
  } catch (error) {
    next(error);
  }
};


// ✅ OPTION B - JWT in HttpOnly Cookie

export const registerCookie = async (req, res, next) => {
  try {
    const { token, user } = await registerUser(req.body);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    });

    return successResponse(res, 201, 'Registered successfully', { user });
  } catch (error) {
    next(error);
  }
};

export const loginCookie = async (req, res, next) => {
  try {
    const { token, user } = await loginUser(req.body);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    });

    return successResponse(res, 200, 'Login successful', { user });
  } catch (error) {
    next(error);
  }
};


// ✅ Logout - blacklist token + clear cookie

export const logout = async (req, res) => {
  try {
    // Get token from Authorization header or cookie
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      return res.status(400).json({ success: false, message: 'No token provided' });
    }

    // ✅ Add token to blacklist
    await Blacklist.create({ token });

    // ✅ Clear cookie
    res.clearCookie('token');

    return successResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Forgot Password
export const forgotPassword = async (req, res, next) => {
  try {
    await forgotPasswordService(req.body);
    return successResponse(res, 200, 'Password reset link sent to your email');
  } catch (error) {
    next(error);
  }
};

// ✅ Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    await resetPasswordService(req.body);
    return successResponse(res, 200, 'Password reset successfully. Please login with your new password.');
  } catch (error) {
    next(error);
  }
};

// ✅ Update User Role (Admin Only)

export const updateUserRole = async (req, res) => {
  const { userId, role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    return successResponse(res, 200, `User role updated to ${role}`, { user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};