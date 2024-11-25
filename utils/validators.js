// utils/validators.js
const { z } = require('zod');

// Register Schema
const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['Admin', 'Moderator', 'User']).optional(),
});

// Login Schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  twoFactorToken: z.string().length(6).optional(),
});

// Refresh Token Schema
const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// Update User Schema
const updateUserSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['Admin', 'Moderator', 'User']).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateUserSchema,
};
