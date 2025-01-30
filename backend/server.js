const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoute'); // Import the team routes
const adminAuthRoute = require('./routes/adminRoute');


const authMiddleware = require('./middleware/authMiddleware'); // Ensure this is required for protecting routes if needed

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

// Enable cross-origin requests for your frontend (running on port 3000)
app.use(cors({
    origin: 'http://localhost:3000', // Frontend running on port 3000
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Enable necessary methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Enable authorization header if you're using JWT
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log('MongoDB connection error:', error));

// Use the routes
app.use('/auth', authRoutes); // Authentication routes (login/signup etc.)
app.use('/api/user', teamRoutes); // Team-related routes (protected)
app.use('/api/admin', adminAuthRoute);


// Catch-all for invalid routes (optional but useful for debugging)
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
