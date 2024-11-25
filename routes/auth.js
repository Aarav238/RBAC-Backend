// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const validate = require('../middleware/validate.js');
const { registerSchema, loginSchema, refreshTokenSchema } = require('../utils/validators');


// Routes
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get tokens
 * @access  Public
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshAccessToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authController.logout);


module.exports = router;
