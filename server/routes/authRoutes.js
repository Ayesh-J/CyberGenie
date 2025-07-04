const express = require('express');
const router = express.Router();
const { signup, login, logout, status } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/status', authMiddleware, status);  // Protect status route with JWT auth middleware

module.exports = router;
