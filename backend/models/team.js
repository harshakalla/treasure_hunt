const mongoose = require('mongoose');

// Define schema to track team's progress on clues
const teamSchema = new mongoose.Schema({
    teamID: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    progress: {
        clue1: { isCorrect: { type: Boolean, default: false }, submissionTime: { type: Date } },
        clue2: { isCorrect: { type: Boolean, default: false }, submissionTime: { type: Date } },
        clue3: { isCorrect: { type: Boolean, default: false }, submissionTime: { type: Date } },
        clue4: { isCorrect: { type: Boolean, default: false }, submissionTime: { type: Date } },
        clue5: { isCorrect: { type: Boolean, default: false }, submissionTime: { type: Date } },
        clue6: { isCorrect: { type: Boolean, default: false }, submissionTime: { type: Date } },
        clue7: { isCorrect: { type: Boolean, default: false }, submissionTime: { type: Date } },
        clue8: { isCorrect: { type: Boolean, default: false }, submissionTime: { type: Date } },
    },
});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
