const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authmiddleware');
const { applyLinkedIn, applyIndeed, testApiConnection } = require('../controllers/agentController');
const { autoApplyLimiter } = require('../middleware/rateLimiter');

// Protected routes (require authentication)
// Rate limited: 20 applications per hour
router.post('/linkedin', protect, autoApplyLimiter, applyLinkedIn);
router.post('/indeed', protect, autoApplyLimiter, applyIndeed);

// Public route to test TinyFish API connection
router.get('/test-connection', testApiConnection);

module.exports = router;
