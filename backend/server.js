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
const allowedOrigins = [/\.vercel\.app$/]; // Allow all subdomains of vercel.app
app.use(
    cors({
        origin: function(origin, callback) {
            if (!origin || allowedOrigins.some(pattern => pattern.test(origin))) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'token'],
        credentials: true,
    })
);

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
