import { registerUser, loginUser, forgotPasswordService, resetPasswordService } from '../services/auth_service.js';
import { successResponse } from '../utils/response_util.js';
import { comparePassword, hashPassword } from '../utils/bcrypt_util.js';
import { sendEmail } from '../services/email_service.js';
import User from '../models/user_model.js';
import Blacklist from '../models/blacklist_model.js';
import Session from '../models/session_model.js'; // ✅ Import Session model

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

// ✅ Change Password (for logged in users)
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!currentPassword || !newPassword) {
      const error = new Error('Current password and new password are required');
      error.statusCode = 400;
      throw error;
    }

    if (newPassword.length < 6) {
      const error = new Error('New password must be at least 6 characters');
      error.statusCode = 400;
      throw error;
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify current password
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 401;
      throw error;
    }

    // Hash and save new password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    // Send email notification
    await sendEmail(
      user.email,
      'Password Changed Successfully',
      `Hi ${user.name},\n\nYour password has been changed successfully.\n\nIf you did not perform this action, please contact support immediately.\n\nBest regards,\nPrepzyAI Team`
    );

    return successResponse(res, 200, 'Password changed successfully');
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

// ✅ Update Profile (user updates their name)
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name || !name.trim()) {
      const error = new Error('Name is required');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name: name.trim() },
      { new: true }
    ).select('-password');

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return successResponse(res, 200, 'Profile updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete Own Account (user deletes themselves)
export const deleteOwnAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Delete all user's sessions
    await Session.deleteMany({ userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Blacklist the current token
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await Blacklist.create({ token });
    }

    // Clear cookie if using cookie auth
    res.clearCookie('token');

    // Send confirmation email
    await sendEmail(
      user.email,
      'Account Deleted - PrepzyAI',
      `Hi ${user.name},\n\nYour account has been successfully deleted from PrepzyAI.\n\nIf you did not request this, please contact support immediately.\n\nWe're sad to see you go!\n\nBest regards,\nPrepzyAI Team`
    );

    return successResponse(res, 200, 'Account deleted successfully');
  } catch (error) {
    next(error);
  }
};