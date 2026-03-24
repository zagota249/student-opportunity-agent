const express = require('express');
const { register, login, getprofile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authmiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getprofile);
router.put('/profile', protect, updateProfile);

module.exports = router;
