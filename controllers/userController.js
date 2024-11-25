// controllers/userController.js
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');
const { z } = require('zod');
const logger = require('../utils/logger');

// Zod Schemas
const updateUserSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['Admin', 'Moderator', 'User']).optional(),
});

const userController = {
  // Get all users (Admin only)
  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.find().populate('role', 'name permissions');
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  // Get single user by ID (Admin and self)
  getUserById: async (req, res, next) => {
    try {
      const userId = req.params.id;

      // Allow access if the user is admin or requesting their own data
      if (req.user.role !== 'Admin' && req.user.id !== userId) {
        return res.status(403).json({ msg: 'Access denied' });
      }

      const user = await User.findById(userId).populate('role', 'name permissions');
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  // Update user (Admin and self)
  updateUser: async (req, res, next) => {
    try {
      const parsedData = updateUserSchema.parse(req.body);
      const userId = req.params.id;

      // Allow update if the user is admin or updating their own data
      if (req.user.role !== 'Admin' && req.user.id !== userId) {
        return res.status(403).json({ msg: 'Access denied' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      // Update fields
      if (parsedData.username) user.username = parsedData.username;
      if (parsedData.email) user.email = parsedData.email;
      if (parsedData.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(parsedData.password, salt);
      }
      if (parsedData.role && req.user.role === 'Admin') {
        const roleDoc = await Role.findOne({ name: parsedData.role });
        if (!roleDoc) {
          return res.status(400).json({ msg: 'Invalid role specified' });
        }
        user.role = roleDoc._id;
      }

      await user.save();

      logger.info(`User updated: ${user.email}`);

      res.json({ msg: 'User updated successfully' });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.errors });
      }
      next(err);
    }
  },

  // Delete user (Admin only)
  deleteUser: async (req, res, next) => {
    try {
      const userId = req.params.id;

      // Only admin can delete users
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ msg: 'Access denied' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      await user.remove();

      logger.info(`User deleted: ${user.email}`);

      res.json({ msg: 'User deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
