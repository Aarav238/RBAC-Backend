// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionMiddleware = require('../middleware/permissionMiddleware');

// All routes here are protected and require appropriate permissions

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Admin
 */
router.get(
  '/',
  authMiddleware,
  permissionMiddleware(['view_users']),
  userController.getAllUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Admin or self
 */
router.get(
  '/:id',
  authMiddleware,
  userController.getUserById
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Admin or self
 */
router.put(
  '/:id',
  authMiddleware,
  userController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Admin
 */
router.delete(
  '/:id',
  authMiddleware,
  permissionMiddleware(['delete_user']),
  userController.deleteUser
);

module.exports = router;
