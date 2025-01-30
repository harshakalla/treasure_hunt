// authMiddleware.js
const jwt = require('jsonwebtoken');
const Team = require('../models/team'); // Assuming the model is in models/team.js

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from headers
        const token = req.header('Authorization').replace('Bearer ', '');
        
        // Verify the token and decode it
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
        const team = await Team.findOne({ teamID: decoded.teamID }); // Find the team using the decoded teamID
        
        if (!team) {
            throw new Error('Team not found');
        }
        
        req.user = team; // Attach the team object to the request
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authMiddleware;
