const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');
const tokenService = require('../services/tokenService');
const { z } = require('zod');
const logger = require('../utils/logger');

// Zod Schemas
const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['Admin', 'Moderator', 'User']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  twoFactorToken: z.string().length(6).optional(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

const authController = {
  // Register a new user
  register: async (req, res, next) => {
    try {
      const parsedData = registerSchema.parse(req.body);
      const { username, email, password, role } = parsedData;

      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Find role
      const roleDoc = await Role.findOne({ name: role || 'User' });
      if (!roleDoc) {
        return res.status(400).json({ msg: 'Invalid role specified' });
      }

      // Create new user
      user = new User({
        username,
        email,
        password,
        role: roleDoc._id,
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      logger.info(`New user registered: ${user.email}`);

      res.status(201).json({ msg: 'Registration successful.' });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.errors });
      }
      next(err);
    }
  },

  // Login user
  login: async (req, res, next) => {
    try {
      const parsedData = loginSchema.parse(req.body);
      const { email, password, twoFactorToken } = parsedData;

      // Check if user exists
      const user = await User.findOne({ email }).populate('role');
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // If 2FA is enabled, verify token
      if (user.twoFactorEnabled) {
        if (!twoFactorToken) {
          return res.status(400).json({ msg: '2FA token is required.' });
        }

        // Implement 2FA verification logic here if needed
        // For now, assume it's valid
      }

      // Generate tokens
      const payload = {
        user: {
          id: user.id,
          role: user.role.name,
        },
      };

      const accessToken = tokenService.generateAccessToken(payload);
      const refreshToken = tokenService.generateRefreshToken(payload);

      // Save refresh token in DB
      user.refreshToken = refreshToken;
      await user.save();

      logger.info(`User logged in: ${user.email}`);

      res.json({ accessToken, refreshToken });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.errors });
      }
      next(err);
    }
  },

  // Refresh access token
  refreshAccessToken: async (req, res, next) => {
    try {
      const parsedData = refreshTokenSchema.parse(req.body);
      const { refreshToken } = parsedData;

      // Verify refresh token
      const decoded = tokenService.verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.user.id);

      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ msg: 'Invalid refresh token' });
      }

      // Generate new tokens
      const payload = {
        user: {
          id: user.id,
          role: user.role.name,
        },
      };

      const newAccessToken = tokenService.generateAccessToken(payload);
      const newRefreshToken = tokenService.generateRefreshToken(payload);

      // Update refresh token in DB
      user.refreshToken = newRefreshToken;
      await user.save();

      logger.info(`Access token refreshed for user: ${user.email}`);

      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.errors });
      }
      return res.status(403).json({ msg: 'Invalid or expired refresh token' });
    }
  },

  // Logout user
  logout: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }

      logger.info(`User logged out: ${user.email}`);

      res.json({ msg: 'Logged out successfully.' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
