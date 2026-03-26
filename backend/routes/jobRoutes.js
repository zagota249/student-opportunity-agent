const express = require('express');
const router = express.Router();
const { searchJobs, searchScholarships } = require('../services/jobSearchService');
const { jobSearchLimiter } = require('../middleware/rateLimiter');

// Search jobs - GET /api/jobs/search?query=intern&location=USA
router.get('/search', jobSearchLimiter, async (req, res) => {
    try {
        const { query = 'software intern', location = '', page = 1 } = req.query;
        const pageNum = parseInt(page);

        console.log(`[API] Job search: query="${query}", location="${location}"`);

        const result = await searchJobs(query, location, pageNum);

        res.json(result);
    } catch (error) {
        console.error('[API] Job search error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search jobs',
            error: error.message
        });
    }
});

// Search scholarships - GET /api/jobs/scholarships?country=USA
router.get('/scholarships', async (req, res) => {
    try {
        const { country = '' } = req.query;

        console.log(`[API] Scholarship search: country="${country}"`);

        const result = await searchScholarships('scholarship', country);

        res.json(result);
    } catch (error) {
        console.error('[API] Scholarship search error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search scholarships',
            error: error.message
        });
    }
});

module.exports = router;
