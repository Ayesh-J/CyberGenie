const express = require('express');
const router = express.Router();
const { signup, login, logout, status } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/status', status);

module.exports = router;
