const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token and decode the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user is an admin (assuming `role` is part of the token payload)
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. You are not an admin.' });
        }

        // Attach the decoded payload (user info) to the request object
        req.user = decoded;
        next();  // Continue to the next middleware/route handler
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authenticateAdmin;
