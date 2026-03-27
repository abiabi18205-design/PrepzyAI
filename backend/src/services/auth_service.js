import User from '../models/user_model.js';
import { hashPassword, comparePassword } from '../utils/bcrypt_util.js';
import { generateToken } from '../utils/jwt_util.js';
import { sendEmail } from './email_service.js';
import crypto from 'crypto';

// ====================
// ✅ Register User
// ====================
export const registerUser = async ({ name, email, password }) => {  // ✅ removed role from destructuring

  // ✅ Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  // ✅ Hash password
  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'user'  // ✅ always hardcoded to 'user', no one can self-assign admin
  });

  // ✅ Send welcome email (non-blocking)
  sendEmail(
    user.email,
    "Welcome to AI Interview Platform",
    `Hi ${user.name}, your account has been created successfully.`
  );

  // ✅ Generate JWT
  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

// ====================
// ✅ Login User
// ====================
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user || !(await comparePassword(password, user.password))) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

// ====================
// ✅ Forgot Password
// ====================
export const forgotPasswordService = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('No account found with that email');
    error.statusCode = 404;
    throw error;
  }

  // Generate a random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Save hashed token to DB (never store raw token in DB)
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  // Send raw token in email link
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  await sendEmail(
    user.email,
    'Password Reset Request',
    `Hi ${user.name},\n\nClick the link below to reset your password. This link expires in 15 minutes.\n\n${resetLink}\n\nIf you did not request this, ignore this email.`
  );
};

// ====================
// ✅ Reset Password
// ====================
export const resetPasswordService = async ({ token, newPassword }) => {
  // Hash the token from the URL to compare with DB
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() } // check not expired
  });

  if (!user) {
    const error = new Error('Invalid or expired reset token');
    error.statusCode = 400;
    throw error;
  }

  // Update password and clear reset token fields
  user.password = await hashPassword(newPassword);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  await sendEmail(
    user.email,
    'Password Changed Successfully',
    `Hi ${user.name}, your password has been changed successfully. If you did not do this, contact support immediately.`
  );
};

// ====================
// ✅ Update User Role (Service Layer)
// ====================
export const updateUserRoleService = async ({ userId, role }) => {
  if (!['user', 'admin'].includes(role)) {
    const error = new Error('Invalid role');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.role = role;
  await user.save();

  // ✅ Send email notifying role change
  sendEmail(
    user.email,
    'Role Updated',
    `Hi ${user.name}, your role has been updated to "${role}".`
  );

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};