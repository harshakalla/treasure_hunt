const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Team = require('../models/team');



const signup = async (req, res) => {
    try {
        const { teamID, password } = req.body;
        
        // Check if the team already exists
        const existingTeam = await Team.findOne({ teamID });
        if (existingTeam) {
            return res.status(400).json({ message: 'Team ID already taken' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new team
        const newTeam = new Team({
            teamID,
            password: hashedPassword,
        });

        // Save the new team to the database
        await newTeam.save();

        // Generate a JWT token
        const token = jwt.sign({ teamID: newTeam.teamID }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token expiration
        });

        // Respond with the token
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error during signup' });
    }
};




// Login Handler
const login = async(req, res) => {
    try {
        const { teamID, password } = req.body;

        // Validate input
        if (!teamID || !password) {
            return res.status(400).json({ message: 'Please provide both Team ID and Password' });
        }

        // Check if team exists
        const team = await Team.findOne({ teamID });
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, team.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { teamID: team.teamID }, // Ensure you are encoding the correct team identifier
            process.env.JWT_SECRET || 'defaultSecret',
            { expiresIn: '1h' }
        );
        

        res.status(200).json({ message: 'Login successful', token, teamID: team.teamID });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};








module.exports = { signup, login  };