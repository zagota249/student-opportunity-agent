const express = require('express');
const { register, login,getprofile} = require('../controllers/authController');
const { protect } = require('../middleware/authmiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route (will add middleware later)
router.get('/profile', protect, getprofile);



module.exports = router;