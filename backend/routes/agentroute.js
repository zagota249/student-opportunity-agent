const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authmiddleware');
const { applyLinkedIn, applyIndeed, testApiConnection } = require('../controllers/agentController');

// Protected routes (require authentication)
router.post('/linkedin', protect, applyLinkedIn);
router.post('/indeed', protect, applyIndeed);

// Public route to test TinyFish API connection
router.get('/test-connection', testApiConnection);

module.exports = router;