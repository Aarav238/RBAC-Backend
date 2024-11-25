// routes/protected.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const permissionMiddleware = require('../middleware/permissionMiddleware');

/**
 * @route   GET /api/protected/admin-route
 * @desc    Example Admin Route
 * @access  Admin
 */
router.get(
  '/admin-route',
  authMiddleware,
  permissionMiddleware(['create_user', 'delete_user']),
  (req, res) => {
    res.json({ msg: 'Welcome Admin! You have access to this route.' });
  }
);

/**
 * @route   GET /api/protected/moderator-route
 * @desc    Example Moderator Route
 * @access  Moderator
 */
router.get(
  '/moderator-route',
  authMiddleware,
  permissionMiddleware(['view_users']),
  (req, res) => {
    res.json({ msg: 'Welcome Moderator! You have access to this route.' });
  }
);

/**
 * @route   GET /api/protected/user-route
 * @desc    Example User Route
 * @access  Authenticated Users
 */
router.get(
  '/user-route',
  authMiddleware,
  (req, res) => {
    res.json({ msg: `Welcome ${req.user.role}! You have access to this route.` });
  }
);

module.exports = router;
