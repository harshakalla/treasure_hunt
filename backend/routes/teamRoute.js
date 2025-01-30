const express = require('express');
const router = express.Router();
const { getTeamDetails, submitClue,getAllTeamsProgress } = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware for protection
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware'); // For admin authentication


// Get the current team's details (protected route)
router.get('/team', authMiddleware, getTeamDetails);

// Submit a clue (protected route)
router.post('/submit-clue', authMiddleware, submitClue);
router.get('/team-progress', authMiddleware, getAllTeamsProgress);

module.exports = router;
