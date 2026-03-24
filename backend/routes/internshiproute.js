const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authmiddleware');
const {
    createInternship,
    getInternships,
    getInternshipById,
    updateInternship,
    deleteInternship
} = require('../controllers/internshipController');

// Protected routes
router.route('/')
    .post(protect, createInternship)
    .get(protect, getInternships);

router.route('/:id')
    .get(protect, getInternshipById)
    .put(protect, updateInternship)
    .delete(protect, deleteInternship);

module.exports = router;