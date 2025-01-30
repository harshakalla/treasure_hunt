const Team = require('../models/team'); // Assuming the model is in models/team.js

// Get team details of the authenticated user
const getTeamDetails = async (req, res) => {
    try {
        const teamID = req.user.teamID; // Get the teamID from the authenticated user
        const team = await Team.findOne({ teamID }); // Find the team by teamID

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Return the team details, including the teamID and progress (but excluding password)
        const { password, ...teamDetails } = team.toObject();
        res.status(200).json({ teamID: teamDetails.teamID, progress: teamDetails.progress });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all teams' progress
const getAllTeamsProgress = async (req, res) => {
    try {
        const teams = await Team.find(); // Get all teams from the database

        if (!teams || teams.length === 0) {
            return res.status(404).json({ message: 'No teams found' });
        }

        // Only send teamID and progress (excluding passwords)
        const teamProgress = teams.map(team => {
            const { password, ...teamDetails } = team.toObject();
            return {
                teamID: teamDetails.teamID,
                progress: teamDetails.progress,
            };
        });

        res.status(200).json(teamProgress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Predefined correct clues for 8 clues
const correctClues = {
    clue1: 'https://qrco.de/bfifAd?trackSharing=1',
    clue2: 'https://qrco.de/bfiTJQ?trackSharing=1',
    clue3: 'https://qrco.de/bfiTMZ?trackSharing=1',
    clue4: 'https://qrco.de/bfiTNQ?trackSharing=1',
    clue5: 'https://qrco.de/bfiTWN',
    clue6: 'https://qrco.de/bfiTXu?trackSharing=1',
    clue7: 'https://qrco.de/bfiTe2?trackSharing=1',
    clue8: 'https://qrco.de/bfif4I?trackSharing=1',
};

// Function to handle clue submission
const submitClue = async (req, res) => {
    const { clueNumber, clueLink } = req.body;
    const teamID = req.user.teamID;

    // Retrieve the correct clue links from somewhere (perhaps a config or database)
    if (!correctClues[clueNumber]) {
        return res.status(400).json({ message: 'Invalid clue number' });
    }

    // Check if the clue link is correct
    if (correctClues[clueNumber] !== clueLink) {
        return res.status(400).json({ message: 'Incorrect clue link. Please try again with the correct link.' });
    }

    // Proceed with marking the clue as correct
    const team = await Team.findOne({ teamID });
    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }

    // Only update if the clue isn't already marked as correct
    if (!team.progress[clueNumber].isCorrect) {
        // Update team progress
        team.progress[clueNumber].isCorrect = true;

        // Get the current local time and store it as a Date object
        const submissionTime = new Date(); // This will store the exact time the clue was submitted

        // Store the submissionTime as a Date object
        team.progress[clueNumber].submissionTime = submissionTime;

        await team.save();

        return res.status(200).json({ message: `${clueNumber} is correct!` });
    } else {
        return res.status(200).json({ message: `${clueNumber} has already been solved.` });
    }
};

module.exports = {
    getTeamDetails,
    submitClue,
    getAllTeamsProgress,
};
