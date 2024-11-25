// routes/protected.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Accessible by Admin only
router.get('/admin', authMiddleware(['Admin']), (req, res) => {
    res.json({ msg: 'Welcome Admin! You have access to this route.' });
});

// Accessible by Admin and Moderator
router.get('/moderator', authMiddleware(['Admin', 'Moderator']), (req, res) => {
    res.json({ msg: `Welcome Moderator! You have access to this route. Your role is ${req.user.role}.` });
});

// Accessible by all authenticated users
router.get('/user', authMiddleware(), (req, res) => {
    res.json({ msg: `Welcome User! Your role is ${req.user.role}.` });
});

module.exports = router;
