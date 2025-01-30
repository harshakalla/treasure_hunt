const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoute'); // Import the team routes


 // Ensure this is required for protecting routes if needed

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

// Enable cross-origin requests for your frontend (running on port 3000 for local dev)
const allowedOrigins = [
    /\.vercel\.app$/, // Allow all subdomains of vercel.app
    'http://localhost:3000', // Allow localhost for development
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.some(pattern => pattern.test(origin) || origin === 'http://localhost:3000')) {
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
// Admin routes

// Catch-all for invalid routes (optional but useful for debugging)
app.get('/', (req, res) => {
    res.send('API Working');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});